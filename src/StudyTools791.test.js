import React from 'react';
import {createRoot} from 'react-dom/client';
import {act, Simulate} from 'react-dom/test-utils';
import {Dialog791, SessionOptions791, StudyActivity791} from './StudyTools791';
import {studyActivity791} from './studytools791-model';
global.IS_REACT_ACT_ENVIRONMENT=true;

test('activity ignores undone, duplicate and future reviews and counts local days',()=>{
  const at=new Date(2026,8,26,12).getTime();
  const result=studyActivity791([
    {id:'a',questionId:'q1',reviewedAt:at-60000,seconds:60,rating:3},
    {id:'a',questionId:'q1',reviewedAt:at-60000,seconds:60,rating:3},
    {id:'b',questionId:'q2',reviewedAt:at-120000,seconds:30,rating:1},
    {id:'undo',reversesReviewId:'b',reviewedAt:at},
    {id:'c',questionId:'q3',reviewedAt:new Date(2026,8,25,10).getTime(),seconds:120,rating:2},
    {id:'future',reviewedAt:at+60000,seconds:90,rating:4},
  ],at);
  expect(result).toMatchObject({reviews:2,seconds:180,activeDays:2,today:1,comfortablePercent:50});
  expect(result.days.map(d=>d.count)).toEqual([0,0,0,0,0,1,1]);
});

test('customization shows queue preview and updates the actual study preferences',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  let latest;
  function Harness(){const [prefs,set]=React.useState({pool:'mixed',limit:20,studyMode:'flashcard',order:'scheduler'});latest=prefs;return <SessionOptions791 name="Hovedpine" preferences={prefs} onPreference={patch=>set(p=>({...p,...patch}))} sessionCount={prefs.pool==='new'?3:5} onStart={()=>{}} onClose={()=>{}}/>;}
  act(()=>root.render(<Harness/>));
  act(()=>Simulate.change(el.querySelector('input[value="new"]')));
  expect(latest.pool).toBe('new');
  expect(el.querySelector('[data-session-preview]').textContent).toContain('3');
  act(()=>Simulate.change(el.querySelector('input[type="number"]'),{target:{value:'0'}}));
  expect(latest.limit).toBe(1);
  act(()=>Simulate.change(el.querySelector('input[name="session791-length"][value="all"]')));
  expect(latest.limit).toBe('all');
  act(()=>root.unmount());el.remove();
});

test('advanced session choices are folded without resetting remembered preferences',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  let latest;
  function Harness(){const [prefs,set]=React.useState({pool:'due',limit:35,studyMode:'recall',order:'deck'});latest=prefs;return <SessionOptions791 name="Hovedpine" preferences={prefs} onPreference={patch=>set(p=>({...p,...patch}))} sessionCount={5} onStart={()=>{}} onClose={()=>{}}/>;}
  act(()=>root.render(<Harness/>));
  const toggle=el.querySelector('button[aria-controls="session791-advanced"]');
  expect(toggle).not.toBeNull();
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(el.querySelector('#session791-advanced').hidden).toBe(true);
  expect(el.querySelector('input[value="due"]').checked).toBe(true);
  act(()=>toggle.click());
  expect(el.querySelector('#session791-advanced').hidden).toBe(false);
  expect(el.querySelector('input[value="recall"]').checked).toBe(true);
  expect(el.querySelector('input[name="session791-order"][value="deck"]').checked).toBe(true);
  act(()=>Simulate.change(el.querySelector('input[value="exam"]')));
  act(()=>toggle.click());
  expect(latest).toEqual({pool:'due',limit:35,studyMode:'exam',order:'deck'});
  act(()=>toggle.click());
  expect(el.querySelector('input[value="exam"]').checked).toBe(true);
  act(()=>root.unmount());el.remove();
});

test('three primary pools keep a remembered learning pool visible and unchanged until a choice is made',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  let latest;const changes=[];
  function Harness(){const [prefs,set]=React.useState({pool:'learning',limit:35,studyMode:'recall',order:'deck'});latest=prefs;return <SessionOptions791 name="Hovedpine" preferences={prefs} onPreference={patch=>{changes.push(patch);set(p=>({...p,...patch}));}} sessionCount={5} onStart={()=>{}} onClose={()=>{}}/>;}
  act(()=>root.render(<Harness/>));
  const primary=el.querySelector('.mf791-session-fields>fieldset');
  expect([...primary.querySelectorAll('input[name="session791-pool"]')].map(input=>input.value)).toEqual(['mixed','new','all']);
  const toggle=el.querySelector('button[aria-controls="session791-advanced"]');
  expect(toggle.textContent).toContain('Valgt: I læring');
  expect(el.querySelector('#session791-advanced').hidden).toBe(true);
  expect(el.querySelector('input[value="learning"]').closest('#session791-advanced')).not.toBeNull();
  act(()=>toggle.click());act(()=>toggle.click());
  expect(latest).toEqual({pool:'learning',limit:35,studyMode:'recall',order:'deck'});
  expect(changes).toEqual([]);
  act(()=>Simulate.change(primary.querySelector('input[value="new"]')));
  expect(latest.pool).toBe('new');expect(changes).toEqual([{pool:'new'}]);
  expect(toggle.textContent).not.toContain('Valgt: I læring');
  act(()=>root.unmount());el.remove();
});

test('an empty card count draft does not replace the saved limit and all cards preserves it',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  let latest;
  function Harness(){const [prefs,set]=React.useState({pool:'mixed',limit:35,studyMode:'flashcard',order:'scheduler'});latest=prefs;return <SessionOptions791 name="Hovedpine" preferences={prefs} onPreference={patch=>set(p=>({...p,...patch}))} sessionCount={5} onStart={()=>{}} onClose={()=>{}}/>;}
  act(()=>root.render(<Harness/>));
  const input=el.querySelector('input[type="number"]');
  act(()=>Simulate.change(input,{target:{value:''}}));
  expect(input.value).toBe('');expect(latest.limit).toBe(35);
  act(()=>Simulate.blur(input));expect(input.value).toBe('35');
  act(()=>Simulate.change(el.querySelector('input[name="session791-length"][value="all"]')));
  act(()=>Simulate.change(el.querySelector('input[name="session791-length"][value="limited"]')));
  expect(latest.limit).toBe(35);
  act(()=>root.unmount());el.remove();
});

test('dialog Escape closes and returns focus to the opening control',()=>{
  const trigger=document.createElement('button');document.body.appendChild(trigger);trigger.focus();
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);const close=jest.fn();
  act(()=>root.render(<Dialog791 title="Test" onClose={close}><button>First</button><button>Last</button></Dialog791>));
  expect(document.activeElement.textContent).toBe('First');
  act(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  expect(close).toHaveBeenCalledTimes(1);
  act(()=>root.unmount());expect(document.activeElement).toBe(trigger);el.remove();trigger.remove();
});

test('activity day action opens only that reviewed date',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);const browse=jest.fn();
  act(()=>root.render(<StudyActivity791 events={[{id:'x',reviewedAt:new Date(2026,8,26,10).getTime(),seconds:60,rating:3}]} now={new Date(2026,8,26,12).getTime()} onBrowse={browse} goal={20} />));
  act(()=>el.querySelector('[data-reviewed-date="2026-09-26"]').click());
  expect(browse).toHaveBeenCalledWith('2026-09-26');
  expect(el.querySelector('[data-today-reviews]').textContent).toContain('1');
  expect(el.querySelector('[role="progressbar"]')).toBeNull();
  expect(el.querySelector('input[type="number"]')).toBeNull();
  act(()=>root.unmount());el.remove();
});

test('dialog escapes an animated content container but retains the app theme',()=>{
  const frame=document.createElement('div');frame.className='mf791-app';
  const animated=document.createElement('div');frame.appendChild(animated);document.body.appendChild(frame);
  const root=createRoot(animated);
  act(()=>root.render(<Dialog791 title="Session" onClose={()=>{}}><button>Close</button></Dialog791>));
  expect(animated.querySelector('[role="dialog"]')).toBeNull();
  expect(frame.querySelector('[role="dialog"]')).not.toBeNull();
  act(()=>root.unmount());frame.remove();
});
