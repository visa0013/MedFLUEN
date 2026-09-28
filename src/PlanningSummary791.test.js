import React from 'react';
import {createRoot} from 'react-dom/client';
import {act, Simulate} from 'react-dom/test-utils';
import {PlanningSummary791, RepetitionStart791, planCapacity791} from './PlanningSummary791';
global.IS_REACT_ACT_ENVIRONMENT=true;

test('capacity preserves fractional hours and distinguishes spare time, overload and unplaced content',()=>{
  const capacity=planCapacity791({requiredTotal:4110,capacityTotal:5760,unassigned:[]});
  expect(capacity).toMatchObject({requiredHours:68.5,availableHours:96,remainingHours:27.5,tone:'space'});
  expect(planCapacity791({requiredTotal:90,capacityTotal:60,unassigned:[]})).toMatchObject({remainingHours:-.5,tone:'over'});
  expect(planCapacity791({requiredTotal:0,capacityTotal:0,unassigned:[]})).toMatchObject({remainingHours:0,tone:'empty'});
  expect(planCapacity791({requiredTotal:60,capacityTotal:600,unassigned:[{lecture:{id:'N1'}}]})).toMatchObject({tone:'unplaced'});
});

let host,root;
beforeEach(()=>{host=document.createElement('div');document.body.appendChild(host);root=createRoot(host);});
afterEach(()=>{act(()=>root.unmount());host.remove();});

test('weekly load displays actual unequal minutes without inventing a minimum or changing the strategy',()=>{
  const strategy={requiredTotal:1200,capacityTotal:2400,unassigned:[],weeklyLoads:[{weekStart:'2026-09-28',minutes:60},{weekStart:'2026-10-05',minutes:1140}]};
  const before=JSON.stringify(strategy);
  act(()=>root.render(<PlanningSummary791 strategy={strategy}/>));
  const weeks=host.querySelectorAll('[data-week-load]');
  expect(weeks[0].textContent).toContain('1 t');
  expect(weeks[1].textContent).toContain('19 t');
  expect(weeks[0].querySelector('[role="meter"]').getAttribute('aria-valuenow')).toBe('60');
  expect(weeks[1].querySelector('[role="meter"]').getAttribute('aria-valuenow')).toBe('1140');
  expect(weeks[0].querySelector('i').style.width).toBe('5.263157894736842%');
  expect(JSON.stringify(strategy)).toBe(before);
});

test('the repetition entry chooses an available lecture and opens its existing calibration flow',()=>{
  const lectures=[{id:'N1',title:'Første'},{id:'N2',title:'Anden'},{id:'N3',title:'Tredje'}];
  let started;
  act(()=>root.render(<RepetitionStart791 lectures={lectures} memories={[{lectureId:'N1'},{lectureId:'N3',stoppedAt:'2026-09-26'}]} onStart={lecture=>{started=lecture;}}/>));
  const select=host.querySelector('select');
  expect([...select.options].map(option=>option.value)).toEqual(['N2','N3']);
  act(()=>Simulate.change(select,{target:{value:'N3'}}));
  act(()=>host.querySelector('button').click());
  expect(started).toBe(lectures[2]);
});

test('repetition offers no start for lectures already in active memory flows',()=>{
  act(()=>root.render(<RepetitionStart791 lectures={[{id:'N1',title:'Første'}]} memories={[{lectureId:'N1'}]} onStart={()=>{throw Error('Must not start');}}/>));
  expect(host.querySelector('select')).toBeNull();
  expect(host.querySelector('button')).toBeNull();
});
