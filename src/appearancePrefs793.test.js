import React from 'react';
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';
import {appearance75,appearanceKey75,palette75,appearanceStyle75} from './appearance75-model';
import {useAppearance75,Celebration75,useCompletion75,Dock75,AppearanceSettings75} from './Appearance75';
global.IS_REACT_ACT_ENVIRONMENT=true;
function contrast(a,b){const luminance=hex=>{const channels=hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;};const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('custom accents accept canonical hex colours and reject malformed persisted input',()=>{
 expect(appearance75({accent:'custom',customAccent:'#Ab3'})).toMatchObject({accent:'custom',customAccent:'#aabb33'});
 expect(appearance75({accent:'custom',customAccent:'url(unsafe)'})).toMatchObject({accent:'custom',customAccent:'#326d89'});
});
test.each(['paper','mist','white','sand','sage','lavender'])('surface %s provides readable custom colours in both themes',surface=>{
 for(const theme of ['light','dark'])for(const hex of ['#ffffff','#000000','#ffee00','#d82093']){
  const palette=palette75({},'custom',theme,hex,surface);
  expect(palette.panel).toMatch(/^#[0-9a-f]{6}$/);
  expect(contrast(palette.blue,palette.panel)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(palette.blue,palette.onAccent)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(palette.text,palette.panel)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(palette.secondary,palette.panel)).toBeGreaterThanOrEqual(4.5);
  const style=appearanceStyle75({accent:'custom',customAccent:hex,surface},theme);
  expect(style['--mf79-surface']).toBe(palette.panel);expect(style['--mf79-teal']).toBe(palette.blue);
 }
});
test('legacy orb hiding never replaces the Dr. Byte logo and neither settings interface exposes it',()=>{
 const host=document.createElement('div'),root=createRoot(host);
 act(()=>root.render(<Dock75 items={[]} Icon={()=>null} orb={false} hideProfile assistant={{label:'Dr. Byte',icon:'assistant'}}/>));
 expect(host.querySelector('[aria-label="Dr. Byte"] .mf75-byte-orb')).not.toBeNull();
 act(()=>root.render(<AppearanceSettings75 value={appearance75({orb:false})} onChange={()=>{}}/>));
 expect(host.querySelector('input[type="checkbox"]')).toBeNull();
 expect(appearance75({orb:false})).not.toHaveProperty('orb');act(()=>root.unmount());
});
test('invalid reading and accessibility settings cannot produce unreadable text or an unsupported mode',()=>{
 const value=appearance75({questionSize:1000,lineHeight:-1,contrast:'no',motion:'no',density:'no',timerSound:'false'});
 expect(value.questionSize).toBe(25);expect(value.lineHeight).toBe(1.6);expect(value.contrast).toBe('standard');expect(value.motion).toBe('system');expect(value.density).toBe('comfortable');expect(value.timerSound).toBe(true);expect(appearance75({questionSize:NaN}).questionSize).toBe(18);
});
test('a broken appearance record can be repaired by a normal choice without touching other records',()=>{
 localStorage.clear();localStorage.setItem(appearanceKey75('A'),'broken');let controls;
 const host=document.createElement('div'),root=createRoot(host);
 function Harness(){controls=useAppearance75('A');return <span>{controls.error}</span>;}
 act(()=>root.render(<Harness/>));expect(host.textContent).toContain('kunne ikke læses');
 act(()=>controls.set({mode:'dark'}));expect(host.textContent).toBe('');expect(JSON.parse(localStorage.getItem(appearanceKey75('A'))).mode).toBe('dark');
 act(()=>root.unmount());
});
test('app reduced motion suppresses completion confetti even outside the app portal',()=>{
 const frame=document.createElement('div');frame.className='mf791-app';frame.setAttribute('data-motion','reduce');document.body.appendChild(frame);
 const root=createRoot(frame);let complete;
 function Harness(){complete=useCompletion75(()=>{});return <Celebration75 reduceMotion/>;}
 act(()=>root.render(<Harness/>));act(()=>complete());expect(document.querySelector('[data-celebration75]')).toBeNull();
 act(()=>window.dispatchEvent(new CustomEvent('medfluen-celebrate75')));expect(document.querySelector('[data-celebration75]')).toBeNull();
 act(()=>root.unmount());frame.remove();
});
test('turning reduced motion back off cannot resurrect an expired celebration',()=>{
 const host=document.createElement('div'),root=createRoot(host);
 act(()=>root.render(<Celebration75/>));act(()=>window.dispatchEvent(new CustomEvent('medfluen-celebrate75')));
 expect(document.querySelector('[data-celebration75]')).not.toBeNull();
 act(()=>root.render(<Celebration75 reduceMotion/>));expect(document.querySelector('[data-celebration75]')).toBeNull();
 act(()=>root.render(<Celebration75/>));expect(document.querySelector('[data-celebration75]')).toBeNull();
 act(()=>root.unmount());
});
test('new reading settings save per account and switching accounts cannot overwrite the previous account',()=>{
 localStorage.clear();let controls;const host=document.createElement('div'),root=createRoot(host);
 function Harness({owner}){controls=useAppearance75(owner);return <span>{controls.value.questionSize}/{controls.value.motion}</span>;}
 act(()=>root.render(<Harness owner="A"/>));act(()=>controls.set({questionSize:22,motion:'reduce',lineHeight:1.9}));expect(host.textContent).toBe('22/reduce');
 act(()=>root.render(<Harness owner="B"/>));expect(host.textContent).toBe('18/system');act(()=>controls.set({questionSize:16}));expect(JSON.parse(localStorage.getItem(appearanceKey75('A'))).questionSize).toBe(22);
 act(()=>root.render(<Harness owner="A"/>));expect(host.textContent).toBe('22/reduce');act(()=>root.unmount());
});
test('legacy reading size and muted timer migrate without touching study records',()=>{
 localStorage.clear();localStorage.setItem('medlearn-preferences','{"questionSize":21,"timerSound":false}');localStorage.setItem('medlearn-spaced-data','{"card1":{"due":42}}');
 let controls;const host=document.createElement('div'),root=createRoot(host);function Harness(){controls=useAppearance75('A');return <span>{controls.value.questionSize}/{String(controls.value.timerSound)}</span>;}
 act(()=>root.render(<Harness/>));expect(host.textContent).toBe('21/false');act(()=>controls.set({contrast:'high'}));expect(localStorage.getItem('medlearn-spaced-data')).toBe('{"card1":{"due":42}}');expect(JSON.parse(localStorage.getItem(appearanceKey75('A'))).timerSound).toBe(false);act(()=>root.unmount());
});
