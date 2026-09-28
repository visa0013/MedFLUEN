import { pdfPage791, pdfScale791, pdfSearch791, extractPdfIndex791, openPdfDocument791, aiPdfDocument791, publishPdfDocument791, sharedPdfDocuments791, subscribePdfDocuments791, pdfWorkspaceSource791, versionPdfCitations791, pdfAnnotations791, createPdfRenderQueue791 } from './pdf791-model';
import {selectSources76} from './drbyte76-model';

test('page entry cannot leave the actual PDF page range', () => {
  expect(pdfPage791(100, 4)).toBe(4);
  expect(pdfPage791(-3, 4)).toBe(1);
  expect(pdfPage791('3.8', 4)).toBe(3);
});
test('fit width uses the available reader width and fit page also respects its height', () => {
  expect(pdfScale791('width', 1, {width:800,height:600}, {width:1040,height:540})).toBe(1.25);
  expect(pdfScale791('page', 1, {width:800,height:600}, {width:1040,height:540})).toBeCloseTo(500/600);
  expect(pdfScale791('manual', 12, {width:800,height:600}, {width:1040,height:540})).toBe(3);
});
test('search finds Danish text without losing real page numbers or source identity', () => {
  const matches=pdfSearch791([{page:1,text:'Første side'},{page:4,text:'Øvelse: læs hjernens øvre del.'}], 'ØVRE');
  expect(matches).toHaveLength(1);expect(matches[0].page).toBe(4);expect(matches[0].text).toContain('øvre');
  expect(pdfSearch791([{page:1,text:'Hej'}], ' ')).toEqual([]);
});
test('shared PDF index retains empty pages and readable pages rather than claiming a scan is readable', async () => {
  const pdf={numPages:3,getPage:async n=>({getViewport:()=>({width:842,height:595}),getTextContent:async()=>({items:n===2?[]:[{str:`N1 testmarkør ${n}`,hasEOL:true}]}),cleanup(){}})};
  const index=await extractPdfIndex791(pdf,{documentId:'lecture-n1',title:'Intro',version:'v1'});
  expect(index.pages.map(p=>p.page)).toEqual([1,2,3]);
  expect(index.pages[0]).toMatchObject({documentId:'lecture-n1',title:'Intro',version:'v1',text:'N1 testmarkør 1'});
  expect(index.readablePages).toBe(2);expect(index.status).toBe('partial');
});
test('cancelled indexing cannot produce an index for a new document', async () => {
  const controller=new AbortController();controller.abort();
  await expect(extractPdfIndex791({numPages:1},{signal:controller.signal})).rejects.toMatchObject({name:'AbortError'});
});
test('a storage route returning HTML is rejected as unavailable PDF, not sent to the motor', async () => {
  await expect(openPdfDocument791({url:'/file.pdf',request:async()=>({ok:true,arrayBuffer:async()=>Uint8Array.from('<html>login</html>',c=>c.charCodeAt(0)).buffer}),loadPdfJs:async()=>{throw Error('motor must not run');}})).rejects.toThrow('PDF');
});
test('PDF bytes are not detached from the shared source when passed to the motor', async () => {
  const bytes=new Uint8Array([37,80,68,70,45,49,46,55]);let sent;
  const doc=await openPdfDocument791({bytes:bytes.buffer,loadPdfJs:async()=>({getDocument:opts=>{sent=opts.data;return {promise:Promise.resolve({numPages:4}),destroy:async()=>{}};}})});
  expect(sent.buffer).not.toBe(bytes.buffer);expect(new Uint8Array(doc.bytes)).toEqual(bytes);expect(doc.pdf.numPages).toBe(4);await doc.destroy();
});
test('viewer text becomes the AI source with the exact material, version and real page numbers',()=>{
  const source={userId:'userA',materialId:'m1',lectureId:'N1',moduleName:'K5',title:'Intro',version:'sha-1',bytes:new ArrayBuffer(8),totalPages:4,pages:[{page:4,text:'N1-OPSUMMERING'}]};
  const doc=aiPdfDocument791(source,false);
  expect(doc).toMatchObject({id:'lecture-m1',materialId:'m1',lectureId:'N1',version:'sha-1',selected:false});
  expect(doc.pages[0]).toMatchObject({documentId:'lecture-m1',version:'sha-1',page:4,text:'N1-OPSUMMERING'});
});
test('shared source events cannot cross account boundaries',()=>{
  let seen=[];const stop=subscribePdfDocuments791('userA',doc=>seen.push(doc.materialId));
  publishPdfDocument791({userId:'userB',materialId:'other',pages:[]});publishPdfDocument791({userId:'userA',materialId:'mine',pages:[]});stop();
  expect(seen).toEqual(['mine']);expect(sharedPdfDocuments791('userA').map(d=>d.materialId)).toEqual(['mine']);
});
test('opening an AI source restores its exact lecture, material and page',()=>{
  const state=pdfWorkspaceSource791({lectureViewerHistory:{K5:{lectureId:'N2'}},documentViewer:{m1:{scale:1.5}}},'K5',{lectureId:'N1',materialId:'m1',page:4});
  expect(state.lectureViewerHistory.K5).toMatchObject({lectureId:'N1',materialId:'m1'});
  expect(state.lectureMaterialSelection['K5:N1']).toBe('m1');expect(state.documentViewer.m1).toMatchObject({page:4,scale:1.5});
});
test('citations retain the source version used to generate an answer',()=>{
  const answer=versionPdfCitations791({paragraphs:[{text:'Test',citations:[{kind:'pdf',documentId:'d1',page:4}]}]},[{id:'d1',version:'original'}]);
  expect(answer.paragraphs[0].citations[0].version).toBe('original');
});
test('the selected PDF page is included even beyond the generic twelve-page excerpt limit',()=>{
  const pages=Array.from({length:20},(_,i)=>({documentId:'lecture-m1',title:'Intro',page:i+1,text:`Side ${i+1}`,version:'original'}));
  const sources=selectSources76([{id:'lecture-m1',selected:true,pages}],'Forklar', {materialId:'m1',page:20});
  expect(sources).toHaveLength(12);expect(sources[0]).toMatchObject({documentId:'lecture-m1',page:20,version:'original'});
});
test('AI never mixes a new viewer version with old cached source excerpts',()=>{
  expect(selectSources76([{selected:true,pages:[{documentId:'lecture-m1',page:4,text:'Old source',version:'v1'}]}],'Forklar',{materialId:'m1',page:4,version:'v2'})).toEqual([]);
});
test('annotations with stale version or unknown coordinates are preserved but not drawn on the current PDF',()=>{
  const rows=[{id:'known',page:1,payload:{normalized:true,version:'v2'}},{id:'legacy',page:1,payload:{normalized:true}},{id:'stale',page:1,payload:{normalized:true,version:'v1'}},{id:'unknown',page:1,payload:{rect:{x:500}}}];
  expect(pdfAnnotations791(rows,'v2').visible.map(r=>r.id)).toEqual(['known','legacy']);
  expect(pdfAnnotations791(rows,'v2').held.map(r=>r.id)).toEqual(['stale','unknown']);expect(rows).toHaveLength(4);
});
test('full pages and thumbnails share a maximum of two concurrent renders',async()=>{
  const queue=createPdfRenderQueue791(2),releases=[];let active=0,maximum=0;
  const job=()=>new Promise(resolve=>{active++;maximum=Math.max(maximum,active);releases.push(()=>{active--;resolve();});});
  const tasks=[queue.run(job),queue.run(job),queue.run(job)];await Promise.resolve();expect(active).toBe(2);
  releases.shift()();await new Promise(r=>setTimeout(r,0));expect(active).toBe(2);releases.forEach(r=>r());await Promise.all(tasks);expect(maximum).toBe(2);
});
