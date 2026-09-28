import React from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {HelpCenter72} from './Experience72';
jest.mock('./pdf791-engine',()=>({loadPdfEngine791:async()=>{throw Error('Test has no PDF worker');}}));
global.IS_REACT_ACT_ENVIRONMENT=true;

test('home guide demonstrates calendar and study plan without leaving the help dialog',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);const finish=jest.fn();
  act(()=>root.render(<HelpCenter72 onFinish={finish}/>));
  const demo=el.querySelector('[data-guide-demo="home"]');
  expect(demo).not.toBeNull();
  expect(demo.querySelector('[data-demo-panel="calendar"]').hidden).toBe(false);
  act(()=>demo.querySelector('button[data-demo-tab="plan"]').click());
  expect(demo.querySelector('[data-demo-panel="calendar"]').hidden).toBe(true);
  expect(demo.querySelector('[data-demo-panel="plan"]').hidden).toBe(false);
  expect(finish).not.toHaveBeenCalled();
  act(()=>el.querySelector('[aria-label="Trin 3"]').click());
  const reveal=el.querySelector('button[data-demo-reveal]');
  act(()=>reveal.click());expect(el.querySelector('[data-demo-answer]').hidden).toBe(false);
  act(()=>el.querySelector('[aria-label="Trin 1"]').click());
  act(()=>el.querySelector('[aria-label="Trin 3"]').click());
  expect(el.querySelector('[data-demo-answer]').hidden).toBe(true);
  act(()=>root.unmount());el.remove();
});

test('PDF guide changes note placement while keeping the sample clearly marked as a demo',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  act(()=>root.render(<HelpCenter72 onFinish={()=>{}}/>));
  act(()=>el.querySelector('[aria-label="Trin 6"]').click());
  const demo=el.querySelector('[data-guide-demo="pdf"]');
  expect(demo).not.toBeNull();expect(demo.textContent).toContain('Demo');
  act(()=>demo.querySelector('button[data-demo-layout="below"]').click());
  expect(demo.querySelector('[data-note-layout]').getAttribute('data-note-layout')).toBe('below');
  act(()=>demo.querySelector('button[data-demo-layout="focus"]').click());
  expect(demo.querySelector('[data-demo-notes]').hidden).toBe(true);
  act(()=>root.unmount());el.remove();
});

test('help navigation retains an unsent contact draft and closing restores focus',()=>{
  const trigger=document.createElement('button');document.body.appendChild(trigger);trigger.focus();
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);const close=jest.fn();
  act(()=>root.render(<HelpCenter72 onFinish={close}/>));
  const tabs=[...el.querySelectorAll('.mf72-help-tabs button')];
  act(()=>tabs[1].click());
  act(()=>Simulate.change(el.querySelector('textarea'),{target:{value:'Mit spørgsmål er ikke sendt'}}));
  act(()=>tabs[0].click());act(()=>tabs[1].click());
  expect(el.querySelector('textarea').value).toBe('Mit spørgsmål er ikke sendt');
  act(()=>el.querySelector('[aria-label="Luk guide"]').click());expect(close).toHaveBeenCalledTimes(1);
  act(()=>root.unmount());expect(document.activeElement).toBe(trigger);el.remove();trigger.remove();
});
