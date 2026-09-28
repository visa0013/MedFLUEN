import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, Simulate } from 'react-dom/test-utils';
import { WorkspaceHeader791 } from './Workspace791';
global.IS_REACT_ACT_ENVIRONMENT = true;

test('search opens the chosen lecture and Escape returns focus to search', () => {
  const el = document.createElement('div'); document.body.appendChild(el);
  const root = createRoot(el); const choose = jest.fn();
  act(() => root.render(<WorkspaceHeader791 name="Visar" entries={[{id:'n7',title:'Hovedpine',kind:'Forelæsning'}]} onSelect={choose} />));
  const search = el.querySelector('[data-search-trigger]');
  act(() => search.click());
  const input = el.querySelector('input[type="search"]');
  act(() => Simulate.change(input, {target:{value:'hoved'}}));
  act(() => el.querySelector('[data-search-result]').click());
  expect(choose).toHaveBeenCalledWith(expect.objectContaining({id:'n7'}));
  expect(el.querySelector('[role="dialog"]')).toBeNull();
  act(() => search.click());
  act(() => document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  expect(document.activeElement).toBe(search);
  act(() => root.unmount()); el.remove();
});
