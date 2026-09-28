import React from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {Settings793,saveFocusSettings793} from './Settings793';
import {useAppearance75} from './Appearance75';
import {appearanceKey75} from './appearance75-model';
global.IS_REACT_ACT_ENVIRONMENT=true;
let host,root;
beforeEach(()=>{localStorage.clear();host=document.createElement('div');document.body.appendChild(host);root=createRoot(host);});
afterEach(()=>{act(()=>root.unmount());host.remove();});
function click(label){const b=Array.from(host.querySelectorAll('button')).find(b=>b.getAttribute('aria-label')===label||b.textContent===label||Array.from(b.querySelectorAll('span:not([aria-hidden])')).some(s=>s.textContent===label));expect(b).toBeDefined();act(()=>b.click());}
function Harness(){const appearance=useAppearance75('student');const [timer,set]=React.useState({focus:25,pause:5,longPause:15,longEvery:4});return <Settings793 appearance={appearance} timerSettings={timer} onTimerChange={patch=>set(current=>({...current,...patch}))} onClose={()=>{}}/>;}

test('a chosen custom accent previews immediately, persists per account and rejects incomplete hex edits',()=>{
 act(()=>root.render(<Harness/>));
 const picker=host.querySelector('input[type="color"]');expect(picker).not.toBeNull();
 act(()=>Simulate.change(picker,{target:{value:'#aa3377'}}));
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student')))).toMatchObject({accent:'custom',customAccent:'#aa3377'});
 const preview=host.querySelector('[data-settings-preview]');expect(preview.style.getPropertyValue('--preview-accent')).toBe('#aa3377');
 const hex=host.querySelector('input[aria-label="Hex-farvekode"]');
 act(()=>Simulate.change(hex,{target:{value:'#zz'}}));expect(hex.getAttribute('aria-invalid')).toBe('true');
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).customAccent).toBe('#aa3377');
 act(()=>Simulate.change(hex,{target:{value:'#274'}}));
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).customAccent).toBe('#227744');
 expect(preview.style.getPropertyValue('--preview-accent')).toBe('#227744');
});
test('curated surfaces change the live preview in the resolved dark theme',()=>{
 localStorage.setItem(appearanceKey75('student'),'{"mode":"dark"}');act(()=>root.render(<Harness/>));
 const backgrounds=Array.from(host.querySelectorAll('fieldset')).find(f=>f.querySelector('legend')?.textContent==='Baggrund');
 const inputs=backgrounds.querySelectorAll('input');expect(inputs.length).toBeGreaterThanOrEqual(6);
 for(const [index,expected] of [[3,'#25211d'],[4,'#1a2521'],[5,'#24212b']]){act(()=>Simulate.change(inputs[index]));expect(host.querySelector('[data-settings-preview]').style.getPropertyValue('--preview-bg')).toBe(expected);}
 click('Navigation');expect(host.querySelector('[role="switch"][aria-label*="orb"]')).toBeNull();
});

test('reading controls update the actual preview and persist the current account choice',()=>{
 act(()=>root.render(<Harness/>));click('Læsning');
 const input=host.querySelector('[aria-label="Tekststørrelse på kort og spørgsmål"]');
 act(()=>Simulate.change(input,{target:{value:'23'}}));
 expect(host.querySelector('[data-settings-preview]').style.getPropertyValue('--reading-size')).toBe('23px');
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).questionSize).toBe(23);
 const reduced=host.querySelector('[role="switch"][aria-label="Reducer bevægelse"]');
 act(()=>reduced.click());expect(reduced.getAttribute('aria-checked')).toBe('true');
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).motion).toBe('reduce');
});

test('restoring defaults requires confirmation and preserves card progress and focus durations',()=>{
 localStorage.setItem('medlearn-spaced-data','{"card":{"due":7}}');
 act(()=>root.render(<Harness/>));click('Læsning');
 act(()=>Simulate.change(host.querySelector('input[type="range"]'),{target:{value:'24'}}));
 click('Gendan standard');
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).questionSize).toBe(24);
 click('Annuller');expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).questionSize).toBe(24);
 click('Gendan standard');click('Ja, gendan mine visningsvalg');
 expect(JSON.parse(localStorage.getItem(appearanceKey75('student'))).questionSize).toBe(18);
 expect(localStorage.getItem('medlearn-spaced-data')).toBe('{"card":{"due":7}}');
 click('Fokus');expect(host.querySelector('[name="focus"]').value).toBe('25');
});

test('focus choices retain other timer values and saving failure is visible instead of claiming saved',()=>{
 act(()=>root.render(<Harness/>));click('Fokus');
 act(()=>Simulate.change(host.querySelector('[name="focus"]'),{target:{value:'40'}}));
 expect(host.querySelector('[name="pause"]').value).toBe('5');
 expect(host.querySelector('[name="focus"]').value).toBe('40');
 act(()=>root.render(<Settings793 appearance={{value:{mode:'system'},error:'Kunne ikke gemmes',set(){return false;}}} onClose={()=>{}}/>));
 expect(host.querySelector('[role="alert"]').textContent).toBe('Kunne ikke gemmes');
 expect(host.querySelector('footer').textContent).not.toContain('Gemt automatisk');
});

test('system-dark preview resolves to the same dark theme as the actual workspace',()=>{
 act(()=>root.render(<Settings793 appearance={{value:{mode:'system',surface:'paper'},theme:'dark',error:'',set(){}}} onClose={()=>{}}/>));
 expect(host.querySelector('[data-settings-preview]').getAttribute('data-mode')).toBe('dark');
});

test('a focus save error is visible and never reports successful saving',()=>{
 act(()=>root.render(<Settings793 appearance={{value:{},error:'',set(){}}} timerError="Fokus kunne ikke gemmes" onClose={()=>{}}/>));
 expect(host.querySelector('[role="alert"]').textContent).toBe('Fokus kunne ikke gemmes');
 expect(host.querySelector('footer').textContent).not.toContain('Gemmes automatisk');
});
test('focus saving preserves the latest earned session count and throws on denied storage',()=>{
 localStorage.setItem('timer-test','{"focus":25,"pause":5,"sessions":8}');
 const next=saveFocusSettings793(localStorage,'timer-test',{focus:25,pause:5,sessions:7},{focus:40});
 expect(next.focus).toBe(40);expect(next.sessions).toBe(8);
 const denied={getItem(){return null;},setItem(){throw new Error('Quota');}};
 expect(()=>saveFocusSettings793(denied,'timer-test',next,{focus:30})).toThrow('Quota');
});
