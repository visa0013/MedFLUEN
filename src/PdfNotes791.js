import React,{useEffect,useMemo,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {NoteEditor792,noteHTML792,plainNoteHTML792} from './NoteEditor792';
import './pdf-notes791.css';

const pageNotes791=(rows,page)=>(rows||[]).filter(row=>row.type==='sticky'&&row.payload?.kind==='slide-note'&&Number(row.page)===Number(page)).sort((a,b)=>String(a.createdAt||a.id).localeCompare(String(b.createdAt||b.id)));
const noteId791=()=>(typeof crypto!=='undefined'&&crypto.randomUUID?.())||'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==='x'?r:(r&3|8)).toString(16);});

// Uses the existing durable annotation outbox: every input is written locally
// before cloud synchronization, with one stable record per page/editor.
export function PdfPageNotes791({materialId,page=1,numPages=0,fileName='PDF',journal,onPage,onClose,selectionRequest,onSelectionConsumed,onNewFromPage,onSharedNotes,onShareNote,shareState,shareMessage,placement='below',onPlacement,children,language='da'}){
  const en=language==='en',scope=`${materialId||''}:${page}`;
  const cache=useRef(new Map()),unsaved=useRef(new Set()),input=useRef(null),usedSelection=useRef(null),menuTrigger=useRef(null),menuPanel=useRef(null);
  const [menuOpen,setMenuOpen]=useState(false),[menuPosition,setMenuPosition]=useState({top:8,left:8});
  const [text,setText]=useState(''),[html,setHtml]=useState(''),[preview,setPreview]=useState(false),[overview,setOverview]=useState(false),[selectedId,setSelectedId]=useState(null),[notice,setNotice]=useState('');
  const rows=pageNotes791(journal.rows,page);
  const cached=cache.current.get(scope);
  const current=unsaved.current.has(scope)?cached:(rows.find(row=>row.id===selectedId)||rows.find(row=>row.id===cached?.id)||rows[0]);
  useEffect(()=>{
    if(!menuOpen)return;
    const reposition=()=>{const rect=menuTrigger.current?.getBoundingClientRect();if(!rect)return;const height=Math.min(menuPanel.current?.offsetHeight||360,window.innerHeight-24),width=Math.min(320,window.innerWidth-24),theme=getComputedStyle(menuTrigger.current),colors={};['--mf79-surface','--mf79-ink','--mf79-ink-soft','--mf79-line','--mf79-teal'].forEach(key=>{const value=theme.getPropertyValue(key).trim();if(value)colors[key]=value;});setMenuPosition({...colors,left:Math.max(12,Math.min(rect.right-width,window.innerWidth-width-12)),top:rect.bottom+8+height<=window.innerHeight-12?rect.bottom+8:Math.max(12,rect.top-height-8)});};
    reposition();
    const observer=typeof ResizeObserver==='undefined'?null:new ResizeObserver(reposition);if(menuPanel.current)observer?.observe(menuPanel.current);
    const outside=event=>{if(!menuTrigger.current?.contains(event.target)&&!menuPanel.current?.contains(event.target))setMenuOpen(false);};
    const escape=event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();setMenuOpen(false);menuTrigger.current?.focus();}};
    document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape,true);window.addEventListener('resize',reposition);window.addEventListener('scroll',reposition,true);
    return()=>{observer?.disconnect();document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape,true);window.removeEventListener('resize',reposition);window.removeEventListener('scroll',reposition,true);};
  },[menuOpen,placement,overview]);
  useEffect(()=>{setSelectedId(null);setPreview(false);setNotice('');},[scope]);
  useEffect(()=>{const next=current?.payload?.text||'';if(current)cache.current.set(scope,current);else cache.current.delete(scope);setText(next);setHtml(current?.payload?.html||plainNoteHTML792(next));},[scope,current?.id,current?.payload?.text,current?.payload?.html]); // eslint-disable-line react-hooks/exhaustive-deps

  function write(value,rich=plainNoteHTML792(value)){
    if(!materialId)return;
    const draft=cache.current.get(scope),previous=(journal.getRows?.()||journal.rows).find(row=>row.id===(draft?.id||current?.id));
    const base=previous||(unsaved.current.has(scope)?draft:null)||{id:noteId791(),type:'sticky',page,color:'#efce70',createdAt:new Date().toISOString(),payload:{kind:'slide-note',title:'',question:'',tags:[],normalized:true}};
    const safeHTML=noteHTML792(rich),next={...base,page,updatedAt:new Date().toISOString(),payload:{...base.payload,kind:'slide-note',text:value,html:safeHTML}};
    cache.current.set(scope,next);setText(value);setHtml(safeHTML);setNotice('');
    try{journal.put(next,previous);unsaved.current.delete(scope);}catch{unsaved.current.add(scope);setNotice(en?'Saving failed. Keep this view open and copy your note before closing.':'Lagring fejlede. Behold visningen åben og kopiér noten før du lukker.');}
  }
  useEffect(()=>{
    if(!selectionRequest?.requestId||usedSelection.current===selectionRequest.requestId||selectionRequest.materialId!==materialId||Number(selectionRequest.page)!==Number(page))return;
    usedSelection.current=selectionRequest.requestId;setPreview(false);
    const previous=current?.payload?.text||'',quote=`“${selectionRequest.text}”`;
    write([previous,quote].filter(Boolean).join('\n\n'),(previous?(current?.payload?.html||plainNoteHTML792(previous))+'<br><br>':'')+plainNoteHTML792(quote));
    onSelectionConsumed?.(selectionRequest.requestId);
    requestAnimationFrame(()=>input.current?.focus());
  },[selectionRequest?.requestId,scope]); // eslint-disable-line react-hooks/exhaustive-deps
  const allNotes=useMemo(()=>[...new Map([...journal.rows,...[...cache.current.entries()].filter(([key])=>key.startsWith(`${materialId}:`)&&unsaved.current.has(key)).map(([,row])=>row)].filter(row=>row.payload?.kind==='slide-note').map(row=>[row.id,row])).values()].sort((a,b)=>a.page-b.page),[journal.rows,text,materialId]);
  const notedPages=[...new Set(allNotes.filter(row=>row.payload?.text?.trim()).map(row=>Number(row.page)))];
  const status={ready:en?'Synced':'Synkroniseret',loading:en?'Reading saved notes…':'Henter gemte noter…',saving:en?'Saved locally · syncing…':'Gemt på enheden · synkroniserer…',local:en?'Saved on this device':'Gemt på enheden', 'storage-error':en?'Only in this open view':'Kun i denne åbne visning'}[journal.status]|| (en?'Saved on this device':'Gemt på enheden');
  return <section className="pdf791-page-notes" aria-label={en?'Notes for PDF':'Noter til PDF'}>
    <header><span>{en?'Notes':'Noter'} <span className="pdf791-note-page">· {en?'page':'side'} {page} / {numPages||'—'}</span></span><span className="pdf791-note-status" role="status">{notice?(en?'Not saved':'Ikke gemt'):status}</span><button type="button" ref={menuTrigger} aria-label={en?'More note actions':'Flere notehandlinger'} aria-haspopup="dialog" aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.35"/><circle cx="12" cy="12" r="1.35"/><circle cx="19" cy="12" r="1.35"/></svg></button>{menuOpen&&createPortal(<div ref={menuPanel} className="pdf791-note-menu-panel" role="dialog" aria-label={en?'Note actions':'Notehandlinger'} style={menuPosition}>
    <p className="pdf791-notes-source" title={fileName}>{fileName}</p>
    {onPlacement&&<div className="pdf791-note-placement" role="group" aria-label={en?'Note placement':'Placering af noter'}><small>{en?'Placement':'Placering'}</small><button type="button" aria-pressed={placement==='below'} onClick={()=>{onPlacement('below');setMenuOpen(false);}}>{en?'Below PDF':'Under PDF'}</button><button type="button" aria-pressed={placement==='side'} onClick={()=>{onPlacement('side');setMenuOpen(false);}}>{en?'Beside PDF':'Ved siden af'}</button></div>}
    <div className="pdf791-note-tools" role="toolbar" aria-label={en?'Note formatting':'Noteformatering'}>
      <button type="button" disabled={preview} aria-label={en?'Bold':'Fed'} onMouseDown={e=>e.preventDefault()} onClick={()=>input.current?.format('bold')}><strong>B</strong></button>
      <button type="button" disabled={preview} aria-label={en?'Italic':'Kursiv'} onMouseDown={e=>e.preventDefault()} onClick={()=>input.current?.format('italic')}><em>I</em></button>
      <button type="button" disabled={preview} aria-label={en?'Underline':'Understreg'} onMouseDown={e=>e.preventDefault()} onClick={()=>input.current?.format('underline')}><u>U</u></button>
      <button type="button" disabled={preview} aria-label={en?'Bullet list':'Punktliste'} onMouseDown={e=>e.preventDefault()} onClick={()=>input.current?.format('insertUnorderedList')}>≡</button>
      <button type="button" className="pdf791-note-preview" aria-pressed={preview} onClick={()=>setPreview(v=>!v)}>{preview?(en?'Edit':'Redigér'):(en?'Preview':'Læs')}</button>
    </div>
    {rows.length>1&&<details className="pdf791-older-notes"><summary>{en?'Other existing notes for this page':'Andre eksisterende noter til denne side'} ({rows.length-1})</summary>{rows.map(row=><button key={row.id} type="button" aria-pressed={current?.id===row.id} onClick={()=>{setSelectedId(row.id);cache.current.set(scope,row);}}>{row.payload?.title||row.payload?.text?.slice(0,65)||'Note'}</button>)}</details>}
    {['local','storage-error'].includes(journal.status)&&<button type="button" onClick={journal.retry}>{en?'Retry sync':'Synk igen'}</button>}
    <div className="pdf791-notes-bottom"><button type="button" aria-expanded={overview} onClick={()=>setOverview(v=>!v)}>{en?'Notes in this document':'Noter i dokumentet'}<span>{notedPages.length}</span></button></div>
    {overview&&<div className="pdf791-noted-pages" aria-label={en?'Pages with notes':'Sider med noter'}>{notedPages.length?notedPages.map(n=><button type="button" key={n} aria-current={n===Number(page)?'page':undefined} onClick={()=>onPage?.(n)}>{en?'Page':'Side'} {n}</button>):<p>{en?'Your page notes will appear here.':'Dine sidenoter bliver samlet her.'}</p>}</div>}
    {onNewFromPage&&<button type="button" className="pdf791-linked-note" onClick={()=>onNewFromPage(page)}>{en?'New linked note from this page':'Ny note fra denne side'} ↗</button>}
    {onSharedNotes&&<button type="button" onClick={()=>{setMenuOpen(false);onSharedNotes();}}>{en?'Shared notes':'Delte noter'}</button>}
    {onShareNote&&<div className="pdf792-share-note"><p>{en?'Share this page note with other signed-in users. Your other notes remain private.':'Del denne sidenote med andre loggede brugere. Dine øvrige noter forbliver private.'}</p><p className="pdf792-share-preview">{text.trim()?text.slice(0,160):(en?'Add a page note first.':'Skriv en sidenote først.')}</p><button type="button" disabled={!text.trim()||shareState==='saving'} onClick={()=>onShareNote({materialId,page,fileName,text,html:noteHTML792(html)})}>{shareState==='saving'?(en?'Sharing…':'Deler…'):(en?'Share page note':'Del sidenote')}</button>{shareMessage&&<p role="status">{shareMessage}</p>}</div>}
    {children}</div>,document.fullscreenElement||document.body)}{onClose&&<button type="button" onClick={onClose} aria-label={en?'Close notes':'Luk noter'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>}</header>
    {preview?<div className="pdf791-note-prose" dangerouslySetInnerHTML={{__html:noteHTML792(html||plainNoteHTML792(text|| (en?'This page has no note yet.':'Denne side har ikke en note endnu.')))}}/>:<NoteEditor792 ref={input} text={text} html={html} disabled={!materialId} language={language} onChange={value=>write(value.text,value.html)}/>}
    {(journal.status==='storage-error'||notice)&&<p className="pdf791-note-warning" role="alert">{notice|| (en?'Device storage is full or unavailable. Copy your note before closing.':'Enhedens lager er fuldt eller utilgængeligt. Kopiér noten før du lukker.')}</p>}
  </section>;
}
