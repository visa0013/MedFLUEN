import React from 'react';
import {createRoot} from 'react-dom/client';
import {act, Simulate} from 'react-dom/test-utils';
import {Assistant72} from './Experience72';
jest.mock('./pdf791-engine',()=>({loadPdfEngine791:async()=>{throw Error('Test has no PDF worker');}}));
global.IS_REACT_ACT_ENVIRONMENT = true;

test('switching between conversation and history retains an unsent question and selected lecture', async () => {
  HTMLElement.prototype.scrollTo = function() {};
  const el = document.createElement('div'); document.body.appendChild(el);
  const root = createRoot(el);
  await act(async()=>root.render(<Assistant72 userId={null} moduleName="K5" onClose={()=>{}} lectureCatalog={[{id:'N1',title:'Neurologi'}]} activeLecture={{id:'N1',title:'Neurologi'}} />));
  const input = el.querySelector('textarea[aria-label="Spørg Dr. Byte"]');
  act(()=>Simulate.change(input,{target:{value:'Mit spørgsmål'}}));
  const history = [...el.querySelectorAll('[role="tab"]')].find(b=>b.textContent==='Historik');
  expect(history).toBeDefined();
  act(()=>history.click());
  expect(history.getAttribute('aria-selected')).toBe('true');
  expect(el.querySelector('[aria-label="Dr. Byte samtaler"]')).not.toBeNull();
  const chat = [...el.querySelectorAll('[role="tab"]')].find(b=>b.textContent==='Samtale');
  act(()=>chat.click());
  expect(el.querySelector('textarea[aria-label="Spørg Dr. Byte"]').value).toBe('Mit spørgsmål');
  expect(el.querySelector('.mf77-compose-foot').textContent).toContain('Neurologi');
  act(()=>root.unmount()); el.remove();
});
