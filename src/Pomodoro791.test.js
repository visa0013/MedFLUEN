import React from 'react';
import {createRoot} from 'react-dom/client';
import {act, Simulate} from 'react-dom/test-utils';
import {PomodoroPanel791, usePomodoro791, pomodoroSettings791} from './Pomodoro791';
import {Training79Header} from './Training79';
global.IS_REACT_ACT_ENVIRONMENT=true;

let host,root;
beforeEach(()=>{host=document.createElement('div');document.body.appendChild(host);root=createRoot(host);});
afterEach(()=>{act(()=>root.unmount());host.remove();jest.useRealTimers();});

test('old timer plans receive valid long-break defaults without losing their focus duration',()=>{
  expect(pomodoroSettings791({focus:45,pause:8})).toEqual({focus:45,pause:8,longPause:15,longEvery:4});
  expect(pomodoroSettings791({focus:Infinity,pause:-5,longPause:1000,longEvery:0})).toEqual({focus:25,pause:1,longPause:120,longEvery:1});
});

test('completed focus blocks earn minutes once and the second block starts the configured long break',()=>{
  jest.useFakeTimers();let timer;let earned=0;
  function Harness(){timer=usePomodoro791({settings:{focus:1,pause:1,longPause:3,longEvery:2},onComplete:minutes=>{earned+=minutes;}});return <span>{timer.phase}:{timer.seconds}</span>;}
  act(()=>root.render(<Harness/>));
  act(()=>timer.start());act(()=>jest.advanceTimersByTime(60000));
  expect(host.textContent).toBe('break:60');expect(earned).toBe(1);
  act(()=>jest.advanceTimersByTime(60000));expect(timer.phase).toBe('idle');
  act(()=>timer.start());act(()=>jest.advanceTimersByTime(60000));
  expect(host.textContent).toBe('long-break:180');expect(earned).toBe(2);
  act(()=>timer.stop());expect(earned).toBe(2);
});

test('pause preserves remaining time and editing defaults cannot change an active focus block',()=>{
  jest.useFakeTimers();let timer,change;let earned=0;
  function Harness(){const [settings,set]=React.useState({focus:1});change=set;timer=usePomodoro791({settings,onComplete:minutes=>{earned+=minutes;}});return <span>{timer.seconds}</span>;}
  act(()=>root.render(<Harness/>));act(()=>timer.start());act(()=>jest.advanceTimersByTime(10000));
  act(()=>timer.toggle());expect(timer.seconds).toBe(50);
  act(()=>change({focus:2}));act(()=>jest.advanceTimersByTime(30000));expect(timer.seconds).toBe(50);
  act(()=>timer.toggle());act(()=>jest.advanceTimersByTime(50000));expect(earned).toBe(1);
});

test('timer settings are tucked away and all four durations can be edited without dropping saved plans',()=>{
  let settings={focus:25,pause:5,longPause:15,longEvery:4};
  function Harness(){const [value,set]=React.useState(settings);settings=value;return <PomodoroPanel791 settings={value} onSettings={patch=>set(current=>({...current,...patch}))} timer={{phase:'idle',seconds:1500,running:false,cycle:0,start(){},toggle(){},stop(){}}} savedPlans={[{id:'old',name:'Læsning',focus:45,pause:8}]} onApplyPlan={()=>{}} onSavePlan={()=>{}} onDeletePlan={()=>{}} onClose={()=>{}}/>;}
  act(()=>root.render(<Harness/>));expect(host.querySelectorAll('input').length).toBe(0);
  act(()=>host.querySelector('[aria-label="Timerindstillinger"]').click());
  expect(host.querySelectorAll('input[type="number"]').length).toBe(4);
  act(()=>Simulate.change(host.querySelector('[name="longEvery"]'),{target:{value:'3'}}));
  expect(settings.longEvery).toBe(3);expect(host.textContent).toContain('Læsning');
});

test('exam papers remain reachable from the single training heading',()=>{
  let opened=false;
  act(()=>root.render(<Training79Header mode="theory" onOpenExamSets={()=>{opened=true;}}/>));
  const buttons=Array.from(host.querySelectorAll('button'));
  const papers=buttons.find(button=>button.textContent==='Eksamenssæt');
  expect(Boolean(papers)).toBe(true);
  act(()=>papers.click());expect(opened).toBe(true);
});
