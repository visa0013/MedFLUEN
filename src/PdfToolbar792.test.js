import React from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {PdfReader791} from './PdfReader791';
jest.mock('./pdf791-engine',()=>({loadPdfEngine791:async()=>{throw Error('Tests inject a synthetic PDF engine');}}));
global.IS_REACT_ACT_ENVIRONMENT=true;
const bytes=Uint8Array.from('%PDF-1.7 toolbar fixture',c=>c.charCodeAt(0)).buffer;
const engine={getDocument:()=>({promise:Promise.resolve({numPages:1,getPage:async()=>({getViewport:({scale,rotation=0})=>({width:(rotation%180?400:600)*scale,height:(rotation%180?600:400)*scale,scale,rotation}),getTextContent:async()=>({items:[{str:'Synthetic selectable PDF text.'}]}),render:()=>({promise:Promise.resolve(),cancel(){}})})}),destroy:async()=>{}}),TextLayer:class{constructor({container,textContentSource}){this.container=container;this.content=textContentSource;}render(){this.container.textContent=this.content.items[0].str;return Promise.resolve();}cancel(){}}};
const loadPdfJs=async()=>engine;
let mounted=[];
let originalContext,originalCrypto;
beforeAll(()=>{originalContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=()=>({});originalCrypto=global.crypto;global.crypto={randomUUID:()=> 'synthetic-annotation'};});
afterAll(()=>{HTMLCanvasElement.prototype.getContext=originalContext;global.crypto=originalCrypto;});
afterEach(()=>{mounted.forEach(({root,el})=>{act(()=>root.unmount());el.remove();});mounted=[];window.getSelection()?.removeAllRanges();});
async function mount(props={}){const el=document.createElement('div');document.body.append(el);const root=createRoot(el);mounted.push({root,el});await act(async()=>root.render(<PdfReader791 bytes={bytes} materialId="toolbar-fixture" fileName="Fixture.pdf" loadPdfJs={loadPdfJs} {...props}/>));for(let attempt=0;attempt<50&&el.querySelector('.pdf791-ai-status')?.dataset.state==='loading';attempt++)await act(async()=>new Promise(resolve=>setTimeout(resolve,0)));return el;}
function button(el,label){return [...el.querySelectorAll('button')].find(item=>item.getAttribute('aria-label')===label||item.textContent===label);}
function selectText(el){const layer=el.querySelector('.pdf791-text');const range=document.createRange();range.selectNodeContents(layer);range.getClientRects=()=>[{left:60,top:40,width:180,height:20}];layer.getBoundingClientRect=()=>({left:0,top:0,width:600,height:400});const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);Simulate.mouseUp(layer);}

test('the exam empty state uses the same PDF reader without a perpetual loading indicator',async()=>{
 const choose=jest.fn();const el=await mount({bytes:null,emptyMessage:'Vælg et eksamenssæt',onChooseFile:choose,chooseFileLabel:'Tilføj eksamenssæt'});
 expect(el.textContent).toContain('Vælg et eksamenssæt');expect(el.querySelector('.pdf791-loading-ring')).toBeNull();
 expect(button(el,'Søg i PDF').disabled).toBe(true);act(()=>button(el,'Tilføj eksamenssæt').click());expect(choose).toHaveBeenCalledTimes(1);
});

test('pencil opens relevant tools and selected text creates the chosen annotation type',async()=>{
  const created=[];const el=await mount({onCreateAnnotation:value=>created.push(value)});
  const edit=button(el,'Redigér PDF');expect(edit).toBeDefined();expect(el.querySelector('[aria-label="Flere PDF-værktøjer"]')).toBeNull();
  act(()=>edit.click());expect(edit.getAttribute('aria-expanded')).toBe('true');
  expect(button(el,'Kopiér sidetekst')).toBeUndefined();expect(button(el,'Eksportér markeringer')).toBeUndefined();expect(button(el,'Opret billedkort fra siden')).toBeUndefined();
  for(const [label,type] of [['Markér tekst','highlight'],['Understreg','underline'],['Overstreg','strike']]){
    if(!button(el,label))act(()=>edit.click());
    act(()=>button(el,label).click());act(()=>selectText(el));
    expect(created.at(-1)).toMatchObject({page:1,type,color:'#efce70',payload:{text:'Synthetic selectable PDF text.',normalized:true,rects:[{x:.1,y:.1,w:.3,h:.05}]}});
    expect(created.at(-1).payload.version).toEqual(expect.any(String));
    expect(el.querySelector('.pdf791-selection')).toBeNull();
  }
  expect(created).toHaveLength(3);
});

test('select tool offers a compact text action that can create a highlight',async()=>{
  const created=[];const el=await mount({onCreateAnnotation:value=>created.push(value)});
  const edit=button(el,'Redigér PDF');expect(edit).toBeDefined();act(()=>edit.click());act(()=>button(el,'Vælg tekst').click());act(()=>selectText(el));
  const popup=el.querySelector('[aria-label="Valgt PDF-tekst"]');expect(popup).not.toBeNull();
  expect(button(popup,'Markér tekst')).toBeDefined();act(()=>button(popup,'Markér tekst').click());
  expect(created[0]).toMatchObject({type:'highlight',page:1,payload:{text:'Synthetic selectable PDF text.'}});expect(el.querySelector('.pdf791-selection')).toBeNull();
});

test('drawing tools require the actual ink layer and selection reaches that layer',async()=>{
  let activeTool;const withInk=await mount({onCreateAnnotation:()=>{},onDeleteAnnotation:()=>{},renderInk:props=>{activeTool=props.activeTool;return null;}});
  const edit=button(withInk,'Redigér PDF');expect(edit).toBeDefined();
  for(const [label,wanted] of [['Tegn med pen','pen'],['Sæt en note','sticky'],['Fjern en markering','eraser'],['Vælg tekst','select']]){act(()=>edit.click());act(()=>button(withInk,label).click());expect(activeTool).toBe(wanted);}
  const withoutInk=await mount({onCreateAnnotation:()=>{}});act(()=>button(withoutInk,'Redigér PDF').click());
  expect(button(withoutInk,'Tegn med pen')).toBeUndefined();expect(button(withoutInk,'Sæt en note')).toBeUndefined();expect(button(withoutInk,'Fjern en markering')).toBeUndefined();
});

test('direct rotation swaps the rendered page dimensions and restores editing after a full turn',async()=>{
  const el=await mount({onCreateAnnotation:()=>{}});const rotate=button(el,'Rotér PDF-side');expect(rotate).toBeDefined();
  const page=el.querySelector('[data-pdf-page="1"]'),initialWidth=parseFloat(page.style.width),initialHeight=parseFloat(page.style.height);
  await act(async()=>rotate.click());expect(parseFloat(page.style.height)/parseFloat(page.style.width)).toBeCloseTo(initialWidth/initialHeight);
  expect(button(el,'Redigér PDF').disabled).toBe(true);
  await act(async()=>rotate.click());await act(async()=>rotate.click());await act(async()=>rotate.click());
  expect(parseFloat(page.style.width)).toBeCloseTo(initialWidth);expect(parseFloat(page.style.height)).toBeCloseTo(initialHeight);expect(button(el,'Redigér PDF').disabled).toBe(false);
});
