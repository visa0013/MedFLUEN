import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { LectureSections800 } from './LectureSections800';
global.IS_REACT_ACT_ENVIRONMENT = true;
test('section choices can be empty and missed practice is distinct from ordered walkthrough', () => {
  const host = document.createElement('div'); document.body.appendChild(host); const root = createRoot(host);
  let current;
  function Harness() {
    const [selection, update] = React.useState({ keys: ['disease', 'diagnosis'], mode: 'guide' }); current = selection;
    return <LectureSections800 sections={[{ key: 'disease', title: 'Sygdommen', count: 3 }, { key: 'diagnosis', title: 'Diagnostik', count: 2 }]} selection={selection} onChange={update} forgottenCount={1} />;
  }
  act(() => root.render(<Harness />));
  act(() => host.querySelector('[data-mode="review"]').click());
  expect(current.mode).toBe('review');
  act(() => host.querySelector('[data-mode="forgotten"]').click());
  expect(current.mode).toBe('forgotten');
  act(() => host.querySelectorAll('input')[0].click());
  act(() => host.querySelectorAll('input')[1].click());
  expect(current.keys).toEqual([]);
  act(() => root.unmount()); host.remove();
});
