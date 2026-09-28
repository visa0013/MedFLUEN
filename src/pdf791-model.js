export function pdfPage791(value, total) { return Math.min(Math.max(1,total||1),Math.max(1,Math.floor(Number(value)||1))); }
export function pdfScale791(mode, manual, page, area) {
  if(mode==='manual')return Math.max(.5,Math.min(3,Number(manual)||1));
  const width=Math.max(40,area.width-40)/Math.max(1,page.width);
  return Math.max(.05,Math.min(3,mode==='page'?Math.min(width,Math.max(40,area.height-40)/Math.max(1,page.height)):width));
}
export function pdfSearch791(pages, query) {
  const needle=String(query||'').normalize('NFKC').trim().toLocaleLowerCase();
  if(!needle)return [];
  return (pages||[]).filter(p=>String(p.text||'').normalize('NFKC').toLocaleLowerCase().includes(needle));
}
export function pdfAnnotations791(rows,version) {
  const visible=[],held=[];
  for(const row of rows){if(row.payload?.kind==='slide-note')continue;
    (row.payload?.normalized===true&&(!row.payload.version||row.payload.version===version)?visible:held).push(row);
  }
  return {visible,held};
}
export function createPdfRenderQueue791(limit=2) {
  let active=0;const pending=[];
  function pump(){
    pending.sort((a,b)=>b.priority-a.priority);
    while(active<limit&&pending.length){const item=pending.shift();item.signal?.removeEventListener('abort',item.abort);if(item.signal?.aborted){item.abort();continue;}
      active++;Promise.resolve().then(()=>{abort791(item.signal);return item.job();}).then(item.resolve,item.reject).finally(()=>{active--;pump();});
    }
  }
  return {run(job,{signal,priority=0}={}){return new Promise((resolve,reject)=>{
    const item={job,signal,priority,resolve,reject,abort(){const index=pending.indexOf(item);if(index>=0)pending.splice(index,1);const error=new Error('Afbrudt');error.name='AbortError';reject(error);}};
    if(signal?.aborted){item.abort();return;}pending.push(item);signal?.addEventListener('abort',item.abort,{once:true});pump();
  });}};
}
function abort791(signal) { if(signal?.aborted){const e=new Error('Afbrudt');e.name='AbortError';throw e;} }
export async function pdfVersion791(bytes) {
  if(typeof crypto!=='undefined'&&crypto.subtle){const hash=await crypto.subtle.digest('SHA-256',bytes);return [...new Uint8Array(hash)].map(n=>n.toString(16).padStart(2,'0')).join('');}
  // Non-secure/test environments: identity only, never used for access control.
  let hash=2166136261;for(const b of new Uint8Array(bytes))hash=Math.imul(hash^b,16777619);
  return `${bytes.byteLength}-${hash>>>0}`;
}
const indexCache791=new Map(), documents791=new Map(), listeners791=new Map();
export function aiPdfDocument791(source,selected=true) {
  const id=source.lectureId?`lecture-${source.materialId}`:source.documentId||source.materialId;
  return {id,materialId:source.materialId,title:source.title,bytes:source.bytes,version:source.version,moduleName:source.moduleName,lectureId:source.lectureId||null,totalPages:source.totalPages,selected,pages:source.pages.map(page=>({...page,documentId:id,title:source.title,version:source.version}))};
}
export function pdfWorkspaceSource791(state,moduleKey,source) {
  const lectureId=source.lectureId||state.selectedLectureId;
  return {...state,selectedLectureId:lectureId,
    lectureViewerHistory:lectureId?{...state.lectureViewerHistory,[moduleKey]:{...state.lectureViewerHistory?.[moduleKey],lectureId,...(source.materialId?{materialId:source.materialId}:{}),updatedAt:Date.now()}}:state.lectureViewerHistory,
    lectureMaterialSelection:lectureId&&source.materialId?{...state.lectureMaterialSelection,[`${moduleKey}:${lectureId}`]:source.materialId}:state.lectureMaterialSelection,
    documentViewer:source.materialId?{...state.documentViewer,[source.materialId]:{...state.documentViewer?.[source.materialId],page:source.page||1}}:state.documentViewer};
}
export function versionPdfCitations791(answer,documents) {
  const stamp=citation=>citation?.kind==='pdf'||citation?.kind==='document'?{...citation,version:documents.find(d=>(d.documentId||d.id)===citation.documentId)?.version||null}:citation;
  return {...answer,...(answer.paragraphs?{paragraphs:answer.paragraphs.map(p=>({...p,citations:(p.citations||[]).map(stamp)}))}:{}),...(answer.quiz?{quiz:{...answer.quiz,questions:answer.quiz.questions.map(q=>({...q,source:stamp(q.source)}))}}:{})};
}
export function sharedPdfDocuments791(userId) { return [...documents791.values()].filter(d=>d.userId===userId); }
export function subscribePdfDocuments791(userId, listener) {
  let group=listeners791.get(userId);if(!group){group=new Set();listeners791.set(userId,group);}group.add(listener);
  return ()=>{group.delete(listener);if(!group.size)listeners791.delete(userId);};
}
export function publishPdfDocument791(doc) {
  if(!doc.userId||!doc.materialId)return;
  const key=`${doc.userId}:${doc.materialId}`;documents791.delete(key);documents791.set(key,doc);
  while(documents791.size>4)documents791.delete(documents791.keys().next().value);
  listeners791.get(doc.userId)?.forEach(fn=>fn(doc));
}
export async function extractPdfIndex791(pdf, metadata={}) {
  const {signal,onProgress}=metadata;abort791(signal);
  const cacheKey=metadata.version?`${metadata.userId||'anonymous'}:${metadata.version}`:null;
  const cached=cacheKey&&indexCache791.get(cacheKey);
  const rebase=entry=>({...entry,pages:entry.pages.map(p=>({...p,documentId:metadata.documentId,title:metadata.title,version:metadata.version}))});
  if(cached){onProgress?.({...rebase(cached),processed:pdf.numPages});return rebase(cached);}
  const pages=[];let readablePages=0;
  for(let n=1;n<=pdf.numPages;n++){
    abort791(signal);let row={page:n,text:'',items:[],status:'empty'};
    try{const source=await pdf.getPage(n);const viewport=source.getViewport({scale:1});const content=await source.getTextContent();abort791(signal);
      const text=content.items.map(x=>`${x.str||''}${x.hasEOL?'\n':' '}`).join('').trim();
      row={...row,text,items:content.items,width:viewport.width,height:viewport.height,status:text?'text':'empty'};
      if(text)readablePages++;
    }catch(e){if(e.name==='AbortError')throw e;row.status='error';}
    pages.push(row);onProgress?.({...rebase({pages,readablePages,totalPages:pdf.numPages}),processed:n});
    // Yield between pages so large files do not starve viewer input.
    await new Promise(resolve=>setTimeout(resolve,0));
  }
  abort791(signal);
  const index={pages,readablePages,totalPages:pdf.numPages,status:readablePages===pdf.numPages?'ready':readablePages?'partial':'no-text'};
  if(cacheKey){indexCache791.set(cacheKey,index);while(indexCache791.size>8)indexCache791.delete(indexCache791.keys().next().value);}
  return rebase(index);
}
export async function openPdfDocument791({url,bytes,loadPdfJs,request=fetch,signal,onPassword,onProgress}) {
  abort791(signal);
  if(!bytes){
    if(typeof url!=='string'||! /^(https?:\/\/|blob:|\/[^/])/.test(url))throw Error('PDF-adressen er ikke tilgængelig.');
    const response=await request(url.split('#')[0],{signal});
    if(!response.ok){const e=Error('PDF-filen kunne ikke hentes.');e.status=response.status;throw e;}
    bytes=await response.arrayBuffer();
  }
  abort791(signal);if(bytes.byteLength>25*1024*1024)throw Error('PDF-filen må højst fylde 25 MB.');
  const header=String.fromCharCode(...new Uint8Array(bytes).slice(0,1024));
  if(!header.includes('%PDF-'))throw Error('Adressen leverede ikke en PDF-fil. Prøv at hente materialet igen.');
  const version=await pdfVersion791(bytes);abort791(signal);const engine=await loadPdfJs();abort791(signal);
  const assets=`${process.env.PUBLIC_URL||''}/pdf-assets/`;
  const task=engine.getDocument({data:new Uint8Array(bytes.slice(0)),isEvalSupported:false,cMapUrl:`${assets}cmaps/`,cMapPacked:true,standardFontDataUrl:`${assets}standard_fonts/`});
  let destroyed=false;
  const destroy=async()=>{if(destroyed)return;destroyed=true;signal?.removeEventListener('abort',onAbort);await task.destroy();};
  const onAbort=()=>{destroy().catch(()=>{});};signal?.addEventListener('abort',onAbort,{once:true});
  if(onPassword)task.onPassword=onPassword;if(onProgress)task.onProgress=onProgress;
  try{const pdf=await task.promise;abort791(signal);if(pdf.numPages>1000)throw Error('Del PDF-filer med over 1.000 sider op i mindre dele.');return {pdf,engine,bytes,version,destroy,renderQueue:createPdfRenderQueue791(2)};}
  catch(e){await destroy().catch(()=>{});throw e;}
}
