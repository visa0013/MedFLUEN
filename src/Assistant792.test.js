import React from 'react';
import {createRoot} from 'react-dom/client';
import {act, Simulate} from 'react-dom/test-utils';
import {Assistant72} from './Experience72';
import {publishPdfDocument791} from './pdf791-model';

jest.mock('./pdf791-engine',()=>({loadPdfEngine791:async()=>{throw Error('Synthetic tests never load a PDF worker');}}));
global.IS_REACT_ACT_ENVIRONMENT=true;
const catalog=[{id:'n1',file_name:'Nerves.pdf',storage_path:'fixture/nerves.pdf',mime_type:'application/pdf',module_name:'K5',lecture_id:'N1'},{id:'c1',file_name:'Heart.pdf',storage_path:'fixture/heart.pdf',mime_type:'application/pdf',module_name:'K5',lecture_id:'C1'}];
const lectures=[{id:'N1',title:'Neurologi'},{id:'C1',title:'Kardiologi'}];
let mounted=[];
const originalFetch=global.fetch;
const originalImage=global.Image;
// A real 1 × 1 JPEG; jsdom has no native image decoder, so its boundary accepts
// this complete fixture and rejects every other byte sequence.
const tinyJpeg='/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2MBERISGBUYLxoaL2NCOEJjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY//AABEIAAEAAQMBEQACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/AO4oA//Z';
function client(rows=catalog){return {auth:{getSession:async()=>({data:{session:{access_token:'synthetic-token'}}})},from(table){const query={select(){return this;},eq(){return this;},order(){return this;},range(){return this;},insert(){return this;},single:async()=>({data:{id:'test-conversation'}}),then(resolve){return Promise.resolve({data:table==='lecture_materials'?rows:[],error:null}).then(resolve);}};return query;},storage:{from(){return {download:async()=>{throw Error('Fixture document is already indexed');}};}}};}
async function mount(props={}){const el=document.createElement('div');document.body.appendChild(el);const root=createRoot(el);mounted.push({root,el});await act(async()=>root.render(<Assistant72 onClose={()=>{}} userId="assistant792-fixture" moduleName="K5" supabase={client()} lectureCatalog={lectures} {...props}/>));return el;}
function button(el,label){return [...el.querySelectorAll('button')].find(b=>b.textContent===label||b.getAttribute('aria-label')===label);}
async function attach(el,file){act(()=>Simulate.change(el.querySelector('input[type="file"]'),{target:{files:[file],value:''}}));for(let attempt=0;attempt<50&&el.querySelector('[role="status"]');attempt++)await act(async()=>new Promise(resolve=>setTimeout(resolve,0)));}
beforeEach(()=>{global.Image=class{naturalWidth=1;naturalHeight=1;decode(){return this.src===`data:image/jpeg;base64,${tinyJpeg}`?Promise.resolve():Promise.reject(Error('Native decoder rejected malformed image'));}};sessionStorage.clear();HTMLElement.prototype.scrollTo=function(){};publishPdfDocument791({userId:'assistant792-fixture',materialId:'n1',lectureId:'N1',moduleName:'K5',title:'Nerves.pdf',version:'fixture-version',bytes:new ArrayBuffer(8),totalPages:1,pages:[{page:1,text:'Synthetic nerve source text.'}]});});
afterEach(()=>{mounted.forEach(({root,el})=>{act(()=>root.unmount());el.remove();});mounted=[];global.fetch=originalFetch;global.Image=originalImage;jest.restoreAllMocks();});

test('composer material search filters the real catalog and keeps selected sources available after reopening',async()=>{
  publishPdfDocument791({userId:'assistant792-fixture',materialId:'n1',lectureId:'N1',moduleName:'K5',title:'Nerves.pdf',version:'fixture-version',bytes:new ArrayBuffer(8),totalPages:1,pages:[{page:1,text:'Synthetic nerve source text.'}]});
  const el=await mount();
  expect(el.querySelector('.mf72-chat-body .mf72-library')).toBeNull();
  const choose=button(el,'Vælg materiale');expect(choose).toBeDefined();
  await act(async()=>choose.click());
  const search=el.querySelector('input[aria-label="Søg efter PDF-materiale"]');expect(search).not.toBeNull();
  expect(el.querySelector('.mf792-material-picker select')).toBeNull();
  act(()=>Simulate.change(search,{target:{value:'kardiologi'}}));
  expect(el.querySelector('.mf792-material-results').textContent).toContain('Heart.pdf');
  expect(el.querySelector('.mf792-material-results').textContent).not.toContain('Nerves.pdf');
  act(()=>Simulate.change(search,{target:{value:'nerves'}}));
  const selected=el.querySelector('input[aria-label="Brug Nerves.pdf"]');expect(selected.checked).toBe(true);
  act(()=>Simulate.change(selected,{target:{checked:false}}));
  act(()=>button(el,'Luk materialevalg').click());
  await act(async()=>choose.click());
  expect(el.querySelector('input[aria-label="Brug Nerves.pdf"]').checked).toBe(false);
});

test('manual material choices determine bounded source IDs and versions without automatically adding a lecture PDF',async()=>{
  publishPdfDocument791({userId:'assistant792-fixture',materialId:'c1',lectureId:'C1',moduleName:'K5',title:'Heart.pdf',version:'heart-version',bytes:new ArrayBuffer(8),totalPages:1,pages:[{page:1,text:'Synthetic heart source text.'}]});
  const payloads=[];global.fetch=async(_url,request)=>{payloads.push(JSON.parse(request.body));return {ok:true,json:async()=>({paragraphs:[{text:'Fixture answer',citations:[]}]})};};
  const el=await mount({activeLecture:lectures[0]});
  await act(async()=>button(el,'Vælg materiale').click());
  const nerve=el.querySelector('input[aria-label="Brug Nerves.pdf"]');
  if(nerve.checked)act(()=>Simulate.change(nerve,{target:{checked:false}}));
  const heart=el.querySelector('input[aria-label="Brug Heart.pdf"]');
  act(()=>Simulate.change(heart,{target:{checked:true}}));
  act(()=>Simulate.change(el.querySelector('textarea'),{target:{value:'Forklar heart'}}));
  await act(async()=>Simulate.submit(el.querySelector('form')));
  expect(payloads).toHaveLength(1);
  expect(payloads[0].sources).toEqual([{id:'S1',documentId:'lecture-c1',title:'Heart.pdf',page:1,text:'Synthetic heart source text.',version:'heart-version'}]);
});

test('the material picker checks only the sources the current lecture would actually use',async()=>{
  publishPdfDocument791({userId:'assistant792-fixture',materialId:'c1',lectureId:'C1',moduleName:'K5',title:'Heart.pdf',version:'heart-version',bytes:new ArrayBuffer(8),totalPages:1,pages:[{page:1,text:'Synthetic heart source text.'}]});
  const el=await mount({activeLecture:lectures[0]});
  await act(async()=>button(el,'Vælg materiale').click());
  expect(el.querySelector('input[aria-label="Brug Nerves.pdf"]').checked).toBe(true);
  expect(el.querySelector('input[aria-label="Brug Heart.pdf"]').checked).toBe(false);
});

test('a failed catalog download does not activate unrelated PDFs already loaded on this device',async()=>{
  publishPdfDocument791({userId:'assistant792-fixture',materialId:'c1',lectureId:'C1',moduleName:'K5',title:'Heart.pdf',version:'heart-version',bytes:new ArrayBuffer(8),totalPages:1,pages:[{page:1,text:'Synthetic heart source text.'}]});
  const el=await mount({activeLecture:lectures[0],supabase:client([...catalog,{id:'new',file_name:'New.pdf',storage_path:'fixture/new.pdf',mime_type:'application/pdf',module_name:'K5',lecture_id:'C1'}])});
  await act(async()=>button(el,'Vælg materiale').click());
  await act(async()=>Simulate.change(el.querySelector('input[aria-label="Brug New.pdf"]'),{target:{checked:true}}));
  expect(el.querySelector('[role="alert"]')).not.toBeNull();
  expect(el.querySelector('input[aria-label="Brug New.pdf"]').checked).toBe(false);
  expect(el.querySelector('input[aria-label="Brug Heart.pdf"]').checked).toBe(false);
  expect(el.querySelector('input[aria-label="Brug Nerves.pdf"]').checked).toBe(true);
  expect(el.querySelector('.mf792-material-control').textContent).toContain('Neurologi');
});

test('close remains independently usable after entering fullscreen',async()=>{
  let closed=0;const el=await mount({onClose:()=>closed++});
  const close=button(el,'Luk Dr. Byte');expect(close.parentElement.classList.contains('mf792-byte-close-slot')).toBe(true);
  act(()=>button(el,'Åbn Dr. Byte i fuldskærm').click());
  expect(el.querySelector('.mf79-byte-fullscreen')).not.toBeNull();
  act(()=>close.click());expect(closed).toBe(1);
});

test('Upload fil attaches supported JPEG locally and rejects unsupported formats clearly',async()=>{
  const el=await mount();expect(button(el,'Upload fil')).toBeDefined();
  const input=el.querySelector('input[type="file"]');expect(input.accept).toContain('image/jpeg');
  const image=new File([Uint8Array.from(atob(tinyJpeg),character=>character.charCodeAt(0))],'fixture.jpg',{type:'image/jpeg'});
  await attach(el,image);
  expect(el.querySelector('img[alt="Dit valgte skærmbillede"]').src).toMatch(/^data:image\/jpeg;base64,/);
  await attach(el,new File(['synthetic text'],'fixture.docx',{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));
  expect(el.querySelector('[role="alert"]').textContent).toContain('PDF eller JPEG');
});

test('a renamed non-JPEG file is rejected before it becomes an attachment',async()=>{
  const el=await mount();
  await attach(el,new File(['not an image'],'fixture.jpg',{type:'image/jpeg'}));
  expect(el.querySelector('[role="alert"]').textContent).toContain('gyldigt JPEG');
  expect(el.querySelector('img[alt="Dit valgte skærmbillede"]')).toBeNull();
});

test('a truncated JPEG with a valid signature is rejected before attachment',async()=>{
  const el=await mount();
  await attach(el,new File([new Uint8Array([255,216,255,224,0,0,255,217])],'truncated.jpg',{type:'image/jpeg'}));
  expect(el.querySelector('img[alt="Dit valgte skærmbillede"]')).toBeNull();
  expect(el.querySelector('[role="alert"]').textContent).toContain('gyldigt JPEG');
});

test('uploading a PDF keeps the active sources without adding unrelated device PDFs',async()=>{
  publishPdfDocument791({userId:'assistant792-fixture',materialId:'c1',lectureId:'C1',moduleName:'K5',title:'Heart.pdf',version:'heart-version',bytes:new ArrayBuffer(8),totalPages:1,pages:[{page:1,text:'Synthetic heart source text.'}]});
  const loadPdfJs=async()=>({getDocument:()=>({promise:Promise.resolve({numPages:1,getPage:async()=>({getViewport:()=>({width:300,height:400}),getTextContent:async()=>({items:[{str:'Synthetic local PDF text.'}]})})}),destroy:async()=>{}})});
  const el=await mount({activeLecture:lectures[0],loadPdfJs});
  const file=new File(['%PDF-1.4 synthetic'],'Local.pdf',{type:'application/pdf'});
  file.arrayBuffer=async()=>Uint8Array.from([37,80,68,70,45,49,46,52,32,115,121,110,116,104,101,116,105,99]).buffer;
  await attach(el,file);
  await act(async()=>button(el,'Vælg materiale').click());
  expect(el.querySelector('input[aria-label="Brug Local.pdf"]').checked).toBe(true);
  expect(el.querySelector('input[aria-label="Brug Nerves.pdf"]').checked).toBe(true);
  expect(el.querySelector('input[aria-label="Brug Heart.pdf"]').checked).toBe(false);
});
