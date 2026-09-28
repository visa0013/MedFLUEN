import React from 'react';
import {createRoot} from 'react-dom/client';
import {act,Simulate} from 'react-dom/test-utils';
import {PdfReader791} from './PdfReader791';
jest.mock('./pdf791-engine',()=>({loadPdfEngine791:async()=>{throw Error('Inject the test motor');}}));
global.IS_REACT_ACT_ENVIRONMENT=true;
const bytes=Uint8Array.from('%PDF-1.7 fixture',c=>c.charCodeAt(0)).buffer;
const engine={getDocument:()=>({promise:Promise.resolve({numPages:4,getPage:async n=>({getViewport:({scale})=>({width:842*scale,height:595*scale,scale}),getTextContent:async()=>({items:[{str:`N1 testmarkør ${n}`,hasEOL:true}]}),render:()=>({promise:Promise.resolve(),cancel(){}})}),getOutline:async()=>[]}),destroy:async()=>{}}),TextLayer:class{constructor({container,textContentSource}){this.container=container;this.content=textContentSource;}render(){this.container.textContent=this.content.items.map(i=>i.str).join(' ');return Promise.resolve();}cancel(){}}};
let originalContext;
beforeAll(()=>{originalContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=()=>({});});
afterAll(()=>{HTMLCanvasElement.prototype.getContext=originalContext;});
async function mount(props={}){const el=document.createElement('div');document.body.append(el);const root=createRoot(el);await act(async()=>{root.render(<PdfReader791 bytes={bytes} materialId="n1" fileName="N1 Intro" loadPdfJs={async()=>engine} {...props}/>);await new Promise(r=>setTimeout(r,25));});return {el,root,async close(){await act(async()=>root.unmount());el.remove();}};}
test('reader renders pages itself and clamps direct navigation to actual page count',async()=>{
  const ui=await mount();expect(ui.el.querySelector('iframe')).toBeNull();expect(ui.el.querySelector('canvas')).not.toBeNull();
  const input=ui.el.querySelector('input[aria-label="PDF-side"]');
  await act(async()=>{Simulate.change(input,{target:{value:'999'}});});
  await act(async()=>{Simulate.keyDown(input,{key:'Enter',preventDefault(){}});});
  expect(input.value).toBe('4');await ui.close();
});
test('search opens a readable page result and returns to the matched PDF side',async()=>{
  const ui=await mount();await act(async()=>[...ui.el.querySelectorAll('button')].find(b=>b.getAttribute('aria-label')==='Søg i PDF').click());
  await act(async()=>{Simulate.change(ui.el.querySelector('input[type="search"]'),{target:{value:'testmarkør 3'}});await new Promise(r=>setTimeout(r,30));});
  const match=ui.el.querySelector('.pdf791-search-result');expect(match.textContent).toContain('Side 3');
  await act(async()=>match.click());expect(ui.el.querySelector('input[aria-label="PDF-side"]').value).toBe('3');await ui.close();
});
test('unreadable file gives an actionable error instead of a blank viewer',async()=>{
  const ui=await mount({bytes:Uint8Array.from('<html>',c=>c.charCodeAt(0)).buffer});
  expect(ui.el.querySelector('[role="alert"]').textContent).toContain('PDF');expect([...ui.el.querySelectorAll('button')].some(b=>b.textContent==='Prøv igen')).toBe(true);await ui.close();
});
test('AI receives the actual current page context, not a fabricated whole-document summary',async()=>{
  let context;const ui=await mount({onAskAI:value=>{context=value;}});
  await act(async()=>[...ui.el.querySelectorAll('button')].find(b=>b.textContent.includes('Spørg Dr. Byte')).click());
  expect(context).toMatchObject({materialId:'n1',page:1,text:'N1 testmarkør 1'});await ui.close();
});
test('a citation from a replaced file does not silently jump to a different source',async()=>{
  const ui=await mount({pageRequest:{materialId:'n1',page:3,version:'old-file',requestId:9}});
  expect(ui.el.querySelector('input[aria-label="PDF-side"]').value).toBe('1');
  expect(ui.el.textContent).toContain('PDF-filen er ændret');await ui.close();
});
test('jumping to the same page does not freeze subsequent scroll tracking',async()=>{
  const ui=await mount();const input=ui.el.querySelector('input[aria-label="PDF-side"]'),viewport=ui.el.querySelector('.pdf791-viewport');
  await act(async()=>Simulate.keyDown(input,{key:'Enter',preventDefault(){}}));
  ui.el.querySelectorAll('[data-pdf-page]').forEach((node,i)=>Object.defineProperty(node,'offsetTop',{value:i*600,configurable:true}));
  viewport.scrollTop=650;await act(async()=>Simulate.scroll(viewport));
  expect(input.value).toBe('2');await ui.close();
});
test('resizing uses the current page anchor instead of the page captured when loading',async()=>{
  let resize;const original=global.ResizeObserver;global.ResizeObserver=class{constructor(fn){resize=fn;}observe(){}disconnect(){}};
  const ui=await mount(),viewport=ui.el.querySelector('.pdf791-viewport'),input=ui.el.querySelector('input[aria-label="PDF-side"]');
  let width=900,height=600;Object.defineProperty(viewport,'clientWidth',{get:()=>width,configurable:true});Object.defineProperty(viewport,'clientHeight',{get:()=>height,configurable:true});
  const nodes=[...ui.el.querySelectorAll('[data-pdf-page]')];nodes.forEach((node,i)=>{Object.defineProperty(node,'offsetHeight',{get:()=>parseFloat(node.style.height),configurable:true});Object.defineProperty(node,'offsetTop',{get:()=>20+i*(parseFloat(node.style.height)+28),configurable:true});});
  await act(async()=>resize());await act(async()=>Simulate.change(input,{target:{value:'2'}}));await act(async()=>Simulate.keyDown(input,{key:'Enter',preventDefault(){}}));
  viewport.scrollTop=nodes[1].offsetTop+nodes[1].offsetHeight*.25;await act(async()=>Simulate.scroll(viewport));
  width=700;height=400;viewport.scrollTop=0;await act(async()=>Simulate.scroll(viewport));expect(input.value).toBe('2');await act(async()=>resize());
  expect(viewport.scrollTop).toBeCloseTo(nodes[1].offsetTop+nodes[1].offsetHeight*.25,4);await ui.close();global.ResizeObserver=original;
});
async function resizeHarness791(){
  let notify;const original=global.ResizeObserver;global.ResizeObserver=class{constructor(fn){notify=fn;}observe(){}disconnect(){}};
  const ui=await mount(),viewport=ui.el.querySelector('.pdf791-viewport'),input=ui.el.querySelector('input[aria-label="PDF-side"]');
  let width=900,height=600;
  Object.defineProperty(viewport,'clientWidth',{get:()=>width});Object.defineProperty(viewport,'clientHeight',{get:()=>height});
  const nodes=[...ui.el.querySelectorAll('[data-pdf-page]')];nodes.forEach((node,i)=>{Object.defineProperty(node,'offsetHeight',{get:()=>parseFloat(node.style.height)});Object.defineProperty(node,'offsetTop',{get:()=>20+i*(parseFloat(node.style.height)+28)});});
  Object.defineProperty(viewport,'scrollHeight',{get:()=>nodes[3].offsetTop+nodes[3].offsetHeight+20});
  await act(async()=>notify());
  return {...ui,viewport,input,nodes,async resize(w,h){width=w;height=h;await act(async()=>notify());},async jump(n){await act(async()=>Simulate.change(input,{target:{value:String(n)}}));await act(async()=>Simulate.keyDown(input,{key:'Enter',preventDefault(){}}));},async close(){await ui.close();global.ResizeObserver=original;}};
}
test('a resize with unchanged fit scale does not restore a stale anchor on the next user scroll',async()=>{
  const ui=await resizeHarness791();try{await ui.jump(2);await ui.resize(880,600);const target=ui.nodes[2].offsetTop;ui.viewport.scrollTop=target;await act(async()=>Simulate.scroll(ui.viewport));expect(ui.input.value).toBe('3');expect(ui.viewport.scrollTop).toBeCloseTo(target,4);}finally{await ui.close();}
});
test('native bottom clamping keeps the last PDF side selected after narrowing',async()=>{
  const ui=await resizeHarness791();try{await ui.jump(4);await ui.resize(400,600);ui.viewport.scrollTop=ui.viewport.scrollHeight-ui.viewport.clientHeight;await act(async()=>Simulate.scroll(ui.viewport));expect(ui.input.value).toBe('4');}finally{await ui.close();}
});
