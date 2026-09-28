import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {HomeLanding791,SduImportButton791} from './HomeLanding791';
import {toggleNativeFullscreen791} from './fullscreen791-model';
global.IS_REACT_ACT_ENVIRONMENT=true;

test('small accessible SDU import control opens the existing preview flow',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);const open=jest.fn();
  act(()=>root.render(<SduImportButton791 onImport={open}/>));
  expect(el.querySelector('button').getAttribute('aria-label')).toBe('Importér SDU-skema');
  act(()=>el.querySelector('button').click());expect(open).toHaveBeenCalledTimes(1);
  act(()=>root.unmount());el.remove();
});

test('home holds calendar and study plan without unmounting the calendar',()=>{
  const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);
  let mounted=0;
  function Calendar(){React.useEffect(()=>{mounted++;},[]);return <p>Calendar data</p>;}
  function Harness(){const [panel,setPanel]=React.useState('calendar');return <HomeLanding791 name="Visar" panel={panel} onPanel={setPanel} calendar={<Calendar/>} studyPlan={<p>Saved plan</p>}/>;}
  act(()=>root.render(<Harness/>));
  act(()=>el.querySelector('[data-home-panel="plan"]').click());
  expect(el.querySelector('[data-home-content="calendar"]').hidden).toBe(true);
  expect(el.querySelector('[data-home-content="plan"]').textContent).toContain('Saved plan');
  act(()=>el.querySelector('[data-home-panel="calendar"]').click());
  expect(mounted).toBe(1);
  expect(el.querySelector('[data-home-content="calendar"]').hidden).toBe(false);
  act(()=>root.unmount());el.remove();
});

test('unsupported or rejected fullscreen does not pretend the browser is fullscreen',async()=>{
  expect(await toggleNativeFullscreen791({fullscreenEnabled:false},{})).toEqual({ok:false,reason:'unsupported'});
  expect(await toggleNativeFullscreen791({fullscreenEnabled:true},{requestFullscreen:async()=>{throw Error('Denied');}})).toEqual({ok:false,reason:'rejected'});
});

test('fullscreen uses native entry and exit without synthetic state',async()=>{
  let entered=0,exited=0;
  expect(await toggleNativeFullscreen791({fullscreenEnabled:true},{requestFullscreen:async()=>{entered++;}})).toEqual({ok:true});
  expect(await toggleNativeFullscreen791({fullscreenElement:{},exitFullscreen:async()=>{exited++;}},{})).toEqual({ok:true});
  expect([entered,exited]).toEqual([1,1]);
});
