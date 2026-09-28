import React,{useSyncExternalStore} from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {PdfPageNotes791} from './PdfNotes791';
import {createAnnotationJournal74} from './reader74-model';
import {notePlain792} from './NoteEditor792';
global.IS_REACT_ACT_ENVIRONMENT=true;
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};};
function Host({journal,page=1}){const snapshot=useSyncExternalStore(journal.subscribe,journal.snapshot,journal.snapshot);return <PdfPageNotes791 materialId="m1" page={page} numPages={4} fileName="Intro" journal={{...snapshot,put:journal.edit,retry:journal.flush,getRows:()=>journal.snapshot().rows}}/>;}
const field=el=>el.querySelector('[aria-label="Sidenote"]');
const value=el=>notePlain792(field(el).innerHTML);
const type=(el,text)=>{field(el).textContent=text;Simulate.input(field(el));};
async function mount(journal,page=1){const el=document.createElement('div');document.body.append(el);const root=createRoot(el);await act(async()=>root.render(<Host journal={journal} page={page}/>));return {el,root,async page(n){await act(async()=>root.render(<Host journal={journal} page={n}/>));},async edit(text){await act(async()=>type(el,text));},async close(){await act(async()=>root.unmount());el.remove();}};}
test('every PDF page owns its own note and rapid edits update one stable record',async()=>{
  const journal=createAnnotationJournal74({storage:storage(),key:'pdf-notes'}),ui=await mount(journal);
  await ui.edit('Side 1');await ui.edit('Side 1, færdig');expect(journal.snapshot().rows).toHaveLength(1);
  await ui.page(2);expect(value(ui.el)).toBe('');await ui.edit('Side 2');
  await ui.page(1);expect(value(ui.el)).toBe('Side 1, færdig');await ui.close();
});
test('batched input events share the latest durable record before React renders',async()=>{
  const journal=createAnnotationJournal74({storage:storage(),key:'batch'}),ui=await mount(journal);
  await act(async()=>{type(ui.el,'A');type(ui.el,'AB');});
  expect(journal.snapshot().rows).toHaveLength(1);expect(journal.snapshot().rows[0].payload.text).toBe('AB');await ui.close();
});
test('failed cloud sync and closing the viewer preserve the page note in local storage',async()=>{
  const disk=storage();let journal=createAnnotationJournal74({storage:disk,key:'durable',send:async()=>{throw Error('offline');}});
  const ui=await mount(journal,3);await ui.edit('Bevar mig på side 3');await act(async()=>journal.flush());
  expect(ui.el.textContent).toContain('Gemt på enheden');await ui.close();
  journal=createAnnotationJournal74({storage:disk,key:'durable'});const reopened=await mount(journal,3);
  expect(value(reopened.el)).toBe('Bevar mig på side 3');await reopened.close();
});
test('late cloud hydration cannot erase a page note typed while loading',async()=>{
  const journal=createAnnotationJournal74({storage:storage(),key:'hydration'}),token=journal.hydrationToken(),ui=await mount(journal);
  await ui.edit('Min nye note');await act(async()=>journal.hydrate([],token));expect(value(ui.el)).toBe('Min nye note');await ui.close();
});
test('storage failure is not labelled saved and note text remains exportable',async()=>{
  const journal=createAnnotationJournal74({storage:{getItem:()=>null,setItem:()=>{throw Error('quota');}},key:'quota'}),ui=await mount(journal);
  await ui.edit('Vigtig note');expect(ui.el.textContent).toContain('Kun i denne åbne visning');expect(value(ui.el)).toBe('Vigtig note');await ui.close();
});
test('editing a legacy page note preserves its id and structured metadata',async()=>{
  const old={id:'legacy',type:'sticky',page:2,payload:{kind:'slide-note',text:'Gammel note',title:'Min titel',question:'Mit spørgsmål',tags:['eksamen']}};
  const journal=createAnnotationJournal74({storage:storage(),key:'legacy',initial:[old]}),ui=await mount(journal,2);
  await ui.edit('Gammel note, opdateret');expect(journal.snapshot().rows[0]).toMatchObject({id:'legacy',payload:{title:'Min titel',question:'Mit spørgsmål',tags:['eksamen'],text:'Gammel note, opdateret'}});await ui.close();
});
test('authoritative removal clears the editor and the next edit creates a saved note',async()=>{
  const old={id:'removed',type:'sticky',page:1,payload:{kind:'slide-note',text:'Removed remotely'}};
  const journal=createAnnotationJournal74({storage:storage(),key:'removed',initial:[old]}),ui=await mount(journal);
  await act(async()=>journal.hydrate([],journal.hydrationToken()));
  expect(value(ui.el)).toBe('');
  await act(async()=>Simulate.click(ui.el.querySelector('button[aria-label="Flere notehandlinger"]')));
  expect(document.querySelector('.pdf791-note-menu-panel').textContent).toContain('Noter i dokumentet0');
  await ui.edit('A new durable note');expect(journal.snapshot().rows[0].payload.text).toBe('A new durable note');await ui.close();
});
test('a quote request is acknowledged once and the linked note action is retained',async()=>{
  const journal=createAnnotationJournal74({storage:storage(),key:'quote'}),consumed=jest.fn(),linked=jest.fn();
  const el=document.createElement('div'),root=createRoot(el);document.body.append(el);
  await act(async()=>root.render(<PdfPageNotes791 materialId="m1" page={2} journal={{...journal.snapshot(),put:journal.edit}} selectionRequest={{requestId:'q1',materialId:'m1',page:2,text:'Selected quote'}} onSelectionConsumed={consumed} onNewFromPage={linked}/>));
  expect(consumed).toHaveBeenCalledWith('q1');expect(journal.snapshot().rows[0].payload.text).toBe('“Selected quote”');
  await act(async()=>Simulate.click(el.querySelector('button[aria-label="Flere notehandlinger"]')));
  await act(async()=>Simulate.click([...document.querySelectorAll('.pdf791-note-menu-panel button')].find(b=>b.textContent.includes('Ny note fra denne side'))));expect(linked).toHaveBeenCalledWith(2);
  await act(async()=>root.unmount());el.remove();
});
test('an existing note draft survives a thrown write and switching pages',async()=>{
  const el=document.createElement('div'),root=createRoot(el);document.body.append(el);
  const journal={rows:[{id:'old',type:'sticky',page:1,payload:{kind:'slide-note',text:'Saved'}}],status:'ready',put:()=>{throw Error('write failed');}};
  const show=page=>root.render(<PdfPageNotes791 materialId="m1" page={page} journal={journal}/>);
  await act(async()=>show(1));await act(async()=>type(el,'Unsaved draft'));
  await act(async()=>show(2));await act(async()=>show(1));expect(value(el)).toBe('Unsaved draft');
  await act(async()=>root.unmount());el.remove();
});
test('sharing uses the current PDF sidenote and never an empty legacy lecture draft',async()=>{
 let shared;const el=document.createElement('div'),root=createRoot(el);document.body.append(el);
 const journal={rows:[{id:'p2',type:'sticky',page:2,payload:{kind:'slide-note',text:'Min sidenote',html:'<strong>Min sidenote</strong>'}}],status:'ready'};
 await act(async()=>root.render(<PdfPageNotes791 materialId="m1" page={2} fileName="N1.pdf" journal={journal} lectureDraft={{freeText:''}} onShareNote={v=>{shared=v;}}/>));
 await act(async()=>Simulate.click(el.querySelector('button[aria-label="Flere notehandlinger"]')));
 const menu=document.querySelector('.pdf791-note-menu-panel');
 expect(menu.textContent).not.toContain('Hele forelæsningen og tidligere noter');expect(menu.textContent).not.toContain('Eksportér');
 const button=[...menu.querySelectorAll('button')].find(b=>b.textContent==='Del sidenote');expect(button.disabled).toBe(false);
 await act(async()=>button.click());expect(shared).toMatchObject({page:2,text:'Min sidenote',fileName:'N1.pdf',materialId:'m1'});
 await act(async()=>root.unmount());el.remove();
});
test('note placement offers both layouts and reports the user choice without changing note data',async()=>{
  const el=document.createElement('div'),root=createRoot(el);document.body.append(el);const change=jest.fn();
  await act(async()=>root.render(<PdfPageNotes791 materialId="m1" journal={{rows:[],status:'ready'}} placement="below" onPlacement={change}/>));
  await act(async()=>Simulate.click(el.querySelector('button[aria-label="Flere notehandlinger"]')));
  const choices=[...document.querySelectorAll('.pdf791-note-menu-panel button')];expect(choices.find(b=>b.textContent==='Under PDF').getAttribute('aria-pressed')).toBe('true');
  await act(async()=>Simulate.click(choices.find(b=>b.textContent==='Ved siden af')));expect(change).toHaveBeenCalledWith('side');
  await act(async()=>root.unmount());el.remove();
});
test('the note menu has a named dialog and Escape closes it and returns keyboard focus',async()=>{
  const journal=createAnnotationJournal74({storage:storage(),key:'menu'}),ui=await mount(journal),trigger=ui.el.querySelector('button[aria-label="Flere notehandlinger"]');
  await act(async()=>Simulate.click(trigger));expect(document.querySelector('[role="dialog"][aria-label="Notehandlinger"]')).not.toBeNull();
  await act(async()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  expect(document.querySelector('.pdf791-note-menu-panel')).toBeNull();expect(document.activeElement).toBe(trigger);await ui.close();
});
