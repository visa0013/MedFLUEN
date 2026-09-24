import React, { useEffect, useMemo, useRef, useState } from 'react';
import { clampPage78, collectNotes78, filterNotes78, resolveBacklinks78, restoreNoteDrafts78 } from './notes78-model';
import './notes78.css';

const uid = () => crypto.randomUUID();
const ownSlideNotes = (rows, page) => (rows || []).filter(row => row.type === 'sticky' && row.payload?.kind === 'slide-note' && Number(row.page) === Number(page));

export function PageNote78({ materialId, page = 1, numPages = 0, journal, onPage, lectureDraft, onLectureDraft, lectureStatus, onNewFromPage, language = 'da' }) {
  const en = language === 'en';
  const [scope, setScope] = useState('page');
  const [pageInput, setPageInput] = useState(String(page));
  const selectedPage = clampPage78(page, numPages);
  const current = ownSlideNotes(journal.rows, selectedPage)[0];
  const [draft, setDraft] = useState('');
  const draftRef = useRef('');
  const identityRef = useRef('');
  const currentId = `${materialId || ''}:${selectedPage}`;

  // The journal persists every edit locally before sending it to Supabase.
  function savePage(text = draftRef.current, source = current) {
    if (!materialId || !journal.put || (!text.trim() && !source)) return;
    const base = source || { id:uid(), type:'sticky', page:selectedPage, color:'#f7d85c', createdAt:new Date().toISOString(), payload:{kind:'slide-note',title:'',question:'',tags:[],x:.06,y:.08,normalized:true} };
    journal.put({ ...base, page:selectedPage, payload:{...base.payload,kind:'slide-note',text} }, source);
  }
  useEffect(() => { setPageInput(String(selectedPage)); }, [materialId, selectedPage]);
  useEffect(() => {
    if (identityRef.current && identityRef.current !== currentId && draftRef.current !== undefined) {
      // The input event already saved the previous page in the journal.
      draftRef.current = '';
    }
    identityRef.current = currentId;
    const text = current?.payload?.text || '';
    draftRef.current = text;
    setDraft(text);
  }, [currentId, current?.id, current?.payload?.text]);
  useEffect(() => {
    const remote = current?.payload?.text || '';
    if (identityRef.current === currentId && remote !== draftRef.current && !journal.pending) {
      draftRef.current = remote; setDraft(remote);
    }
  }, [current?.payload?.text, currentId, journal.pending]);
  function moveTo(value) { const next = clampPage78(value, numPages); setPageInput(String(next)); if (next !== selectedPage) onPage?.(next); }
  function edit(text) { draftRef.current = text; setDraft(text); savePage(text); }
  const state = journal.status === 'ready' ? (en ? 'Synced' : 'Synkroniseret') : journal.status === 'saving' ? (en ? 'Saving…' : 'Gemmer…') : (en ? 'Saved locally' : 'Gemt på enheden');
  return <section className="mf78-page-note" aria-label={en ? 'Notes for PDF' : 'Noter til PDF'}>
    <header><div><small>{en ? 'MY NOTES' : 'MINE NOTER'}</small><h3>{en ? 'Beside the lecture' : 'Ved forelæsningen'}</h3></div><span role="status">{state}</span></header>
    <div className="mf78-note-scope" role="tablist" aria-label={en ? 'Note scope' : 'Noteområde'}>
      <button type="button" role="tab" aria-selected={scope === 'page'} onClick={() => setScope('page')}>{en ? 'This page' : 'Denne side'}</button>
      <button type="button" role="tab" aria-selected={scope === 'lecture'} onClick={() => setScope('lecture')}>{en ? 'Entire lecture' : 'Hele forelæsningen'}</button>
    </div>
    {scope === 'page' ? <>
      <div className="mf78-page-picker"><button type="button" aria-label={en ? 'Previous page' : 'Forrige side'} disabled={selectedPage <= 1} onClick={() => moveTo(selectedPage - 1)}>‹</button><label>{en ? 'Selected PDF page' : 'Valgt PDF-side'} <input type="number" min="1" max={numPages || 10000} value={pageInput} onChange={event => setPageInput(event.target.value)} onBlur={() => moveTo(pageInput)} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); moveTo(pageInput); event.currentTarget.blur(); } }} /></label><button type="button" aria-label={en ? 'Next page' : 'Næste side'} disabled={numPages > 0 && selectedPage >= numPages} onClick={() => moveTo(selectedPage + 1)}>›</button></div>
      <p className="mf78-page-caveat">{en ? 'Choose a page here; browser PDF scrolling cannot be detected automatically.' : 'Vælg siden her. Scroll i browserens PDF-viser kan ikke aflæses automatisk.'}</p>
      <textarea aria-label={en ? 'Page note' : 'Sidenote'} value={draft} disabled={!materialId} onChange={event => edit(event.target.value)} placeholder={en ? 'What matters on this page?' : 'Hvad er vigtigt på denne side?'} />
      <footer><button type="button" onClick={() => onNewFromPage?.(selectedPage)} disabled={!materialId}>{en ? 'New linked note' : 'Ny note fra denne side'} ↗</button>{['local','storage-error'].includes(journal.status) && <button type="button" onClick={journal.retry}>{en ? 'Retry sync' : 'Synk igen'}</button>}</footer>
    </> : <><textarea aria-label={en ? 'Lecture note' : 'Forelæsningsnote'} value={lectureDraft?.freeText || ''} onChange={event => onLectureDraft?.({freeText:event.target.value})} placeholder={en ? 'Thoughts about the entire lecture…' : 'Tanker om hele forelæsningen…'} /><p className="mf78-page-caveat">{lectureStatus === 'saved' ? (en ? 'Synced' : 'Synkroniseret') : lectureStatus === 'saving' ? (en ? 'Saving…' : 'Gemmer…') : (en ? 'Saved on this device or pending sync' : 'Gemt lokalt eller afventer synkronisering')}</p>{[lectureDraft?.keyPoints,lectureDraft?.clinicalPoints,lectureDraft?.openQuestions].some(v => String(v || '').trim()) && <details className="mf78-legacy"><summary>{en ? 'Earlier structured notes' : 'Tidligere strukturerede noter'}</summary>{[['keyPoints',en?'Key points':'Nøglepunkter'],['clinicalPoints',en?'Clinical points':'Kliniske punkter'],['openQuestions',en?'Open questions':'Åbne spørgsmål']].map(([key,label]) => <label key={key}>{label}<textarea value={lectureDraft?.[key] || ''} onChange={event => onLectureDraft?.({[key]:event.target.value})} /></label>)}</details>}</>}
  </section>;
}

function exportText(note) {
  const text = `# ${note.title || 'Note'}\n\n${note.body || ''}`;
  const blob = new Blob([text], {type:'text/markdown;charset=utf-8'});
  const href = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = href; a.download = `${(note.title || 'note').replace(/[^\w\u00c0-\u017f-]+/g,'-')}.md`; a.click(); setTimeout(() => URL.revokeObjectURL(href),1000);
}

function LegacyEditor78({note, rows, client, userId, onSaved, onOpenSource, onImport, en}) {
  const [editing,setEditing]=useState(false);
  const [body,setBody]=useState(note.body || '');
  const [sections,setSections]=useState(note.legacySections || []);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const sourceSections = JSON.stringify(note.legacySections || []);
  useEffect(()=>{setBody(note.body || '');setSections(JSON.parse(sourceSections));setEditing(false);setError('');},[note.id,note.body,sourceSections]);
  async function save() {
    if(note.localOnly)return;
    setBusy(true);setError('');
    try {
      let result;
      if(note.kind==='lecture') {
        result=await client.from('lecture_notes').update({free_text:body,key_points:sections[0] || '',clinical_points:sections[1] || '',open_questions:sections[2] || '',updated_at:new Date().toISOString()}).eq('user_id',userId).eq('module_name',note.module).eq('lecture_id',note.lectureId).select('*').single();
        if(result.error)throw result.error;
        onSaved('lectureRows',result.data);
      } else {
        const row=rows.annotationRows.find(item=>`page:${item.id}`===note.id && item.user_id===userId);
        if(!row)throw Error(en?'This PDF note is no longer available.':'PDF-noten findes ikke længere.');
        result=await client.from('lecture_pdf_annotations').update({payload:{...row.payload,text:body},updated_at:new Date().toISOString()}).eq('user_id',userId).eq('id',row.id).select('*').single();
        if(result.error)throw result.error;
        onSaved('annotationRows',result.data);
      }
      setEditing(false);
    } catch(err){setError(err.message || String(err));} finally {setBusy(false);}
  }
  return <article className="mf78-note-read"><small>{note.kind==='page'?`PDF-side ${note.source?.page}`:note.kind==='lecture'?(en?'Lecture note':'Forelæsningsnote'):(en?'On this device only':'Kun på denne enhed')}</small><h2>{note.title}</h2>
    {editing ? <><textarea aria-label={en?'Edit note':'Redigér note'} value={body} onChange={e=>setBody(e.target.value)} />{note.kind==='lecture'&&sections.some(v=>v?.trim())&&<details className="mf78-legacy" open><summary>{en?'Earlier structured fields':'Tidligere strukturerede felter'}</summary>{sections.map((value,i)=><label key={i}>{['Nøglepunkter','Kliniske punkter','Åbne spørgsmål'][i]}<textarea value={value || ''} onChange={e=>setSections(old=>old.map((v,j)=>j===i?e.target.value:v))} /></label>)}</details>}<div><button type="button" disabled={busy} onClick={save}>{en?'Save':'Gem'}</button><button type="button" onClick={()=>{setEditing(false);setBody(note.body || '');setSections(note.legacySections || []);}}>{en?'Cancel':'Annuller'}</button></div></> : <><p>{note.body || '—'}</p>{note.legacySections?.some(v=>v.trim())&&<div className="mf78-legacy"><h3>{en?'Earlier structured notes':'Tidligere strukturerede noter'}</h3>{note.legacySections.map((value,i)=>value.trim()&&<section key={i}><strong>{['Nøglepunkter','Kliniske punkter','Åbne spørgsmål'][i]}</strong><p>{value}</p></section>)}</div>}{!note.localOnly&&<button type="button" onClick={()=>setEditing(true)}>{en?'Edit note':'Redigér note'}</button>}</>}
    {error&&<p role="alert" className="mf78-notes-error">{error} {en?'Your text remains in the editor.':'Din tekst er stadig i editoren.'}</p>}
    {note.source?.lectureId&&<button type="button" className="mf78-source" onClick={()=>onOpenSource?.(note.source)}>{en?'Open source':'Åbn forelæsning'}{note.source.page?` · side ${note.source.page}`:''} ↗</button>}
    {note.localOnly&&<button type="button" onClick={()=>onImport(note)}>{en?'Import a copy to my account':'Importér en kopi til min konto'}</button>}
  </article>;
}

export function NotesHub78({ client, userId, moduleName, legacyLocalRows = [], sourceDraft, onSourceUsed, onOpenSource, onClose, language = 'da' }) {
  const en = language === 'en';
  const [kind,setKind] = useState('all');
  const [query,setQuery] = useState('');
  const [filters,setFilters] = useState({module:'',lectureId:'',tag:'',collection:''});
  const [rows,setRows] = useState({lectureRows:[],annotationRows:[],personalRows:[]});
  const [localDraftRows,setLocalDraftRows] = useState([]);
  const [showLocal,setShowLocal] = useState(false);
  const [selectedId,setSelectedId] = useState(null);
  const [editingLegacyId,setEditingLegacyId] = useState(null);
  const [draft,setDraft] = useState(null);
  const [status,setStatus] = useState('loading');
  const [error,setError] = useState('');
  const bodyRef = useRef(null);
  const loadedUser = useRef(null);
  useEffect(() => {
    let cancelled=false;
    loadedUser.current = userId;
    setRows({lectureRows:[],annotationRows:[],personalRows:[]}); setSelectedId(null); setDraft(null);
    setLocalDraftRows(restoreNoteDrafts78(typeof localStorage === 'undefined' ? null : localStorage,userId));
    if (!userId) { setStatus('local'); return undefined; }
    setStatus('loading');
    Promise.all([
      client.from('personal_notes').select('*').eq('user_id',userId).order('updated_at',{ascending:false}),
      client.from('lecture_notes').select('id,user_id,module_name,lecture_id,free_text,key_points,clinical_points,open_questions,updated_at').eq('user_id',userId),
      client.from('lecture_pdf_annotations').select('id,user_id,module_name,lecture_id,material_id,page_number,payload,updated_at').eq('user_id',userId).eq('annotation_type','sticky'),
    ]).then(results => {
      if (cancelled || loadedUser.current !== userId) return;
      const [personal,lecture,annotation]=results;
      setRows({personalRows:personal.data || [],lectureRows:lecture.data || [],annotationRows:annotation.data || []});
      setError([personal,lecture,annotation].filter(r=>r.error).map(r=>r.error.message).join(' · '));
      setStatus(results.some(r=>r.error)?'partial':'ready');
    }).catch(err=>{ if(!cancelled){setStatus('error');setError(err.message);} });
    return ()=>{cancelled=true;};
  },[client,userId]);
  const all = useMemo(()=>collectNotes78({...rows,personalRows:[...rows.personalRows,...localDraftRows.filter(note=>!rows.personalRows.some(remote=>remote.id===note.id))],legacyLocalRows:showLocal?legacyLocalRows:[],userId}),[rows,localDraftRows,legacyLocalRows,showLocal,userId]);
  const visible = useMemo(()=>filterNotes78(all,{query,kind,...filters}),[all,query,kind,filters]);
  const choices = useMemo(()=>({
    module:[...new Set(all.map(n=>n.module).filter(Boolean))],
    lectureId:[...new Set(all.map(n=>n.lectureId || n.source?.lectureId).filter(Boolean))],
    tag:[...new Set(all.flatMap(n=>n.tags || []).filter(Boolean))],
    collection:[...new Set(all.map(n=>n.collection).filter(Boolean))],
  }),[all]);
  const selected = all.find(n=>n.id===selectedId);
  const backlinks = selected ? resolveBacklinks78(all,selected.id) : [];

  function create(source = null, imported = null) {
    const id=uid();
    const note={id,user_id:userId,title:imported?.title || '',body:imported?.body || '',tags:[],collection:'',is_pinned:false,source_lecture_id:source?.lectureId || null,source_material_id:source?.materialId || null,source_page:source?.page || null,linked_note_ids:[],revision:1,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};
    try{localStorage.setItem(`mf78-note-draft:${userId}:${id}`,JSON.stringify(note));}catch{}
    setLocalDraftRows(current=>[note,...current]);setDraft(note);setSelectedId(id);setStatus('draft');setError('');
  }
  useEffect(()=>{ if(sourceDraft?.requestId && userId) {create(sourceDraft);onSourceUsed?.();} },[sourceDraft?.requestId,userId]); // eslint-disable-line react-hooks/exhaustive-deps
  function pick(note) {setSelectedId(note.id);let next=note.kind==='personal'?(rows.personalRows.find(r=>r.id===note.id)||localDraftRows.find(r=>r.id===note.id)):null;if(next){try{const local=JSON.parse(localStorage.getItem(`mf78-note-draft:${userId}:${next.id}`));if(local?.user_id===userId)next=local;}catch{}}setDraft(next);setError('');if(next?.updated_at!==rows.personalRows.find(r=>r.id===note.id)?.updated_at)setStatus('draft');}
  function updateLegacyRows(bucket, row) {setRows(current=>({...current,[bucket]:current[bucket].map(item=>item.id===row.id?row:item)}));}
  function patch(change) {if(!draft)return;const next={...draft,...change};try{localStorage.setItem(`mf78-note-draft:${userId}:${next.id}`,JSON.stringify(next));}catch{}setDraft(next);setLocalDraftRows(previous=>previous.map(row=>row.id===next.id?next:row));setStatus('draft');}
  async function save() {
    if(!draft || !userId) return;
    const links=(draft.linked_note_ids || []).filter(id=>id!==draft.id && rows.personalRows.some(row=>row.id===id && row.user_id===userId));
    const data={...draft,linked_note_ids:links,title:String(draft.title || '').slice(0,200),body:String(draft.body || ''),tags:(draft.tags || []).map(String).filter(Boolean),updated_at:new Date().toISOString()};
    setStatus('saving');setError('');
    try {
      const existing=rows.personalRows.find(row=>row.id===data.id);
      let result;
      if(existing){result=await client.from('personal_notes').update({...data,revision:existing.revision+1}).eq('id',data.id).eq('user_id',userId).eq('revision',existing.revision).select('*').maybeSingle();
        if(!result.error && !result.data) throw Error(en?'This note changed elsewhere. Copy your draft or reload before saving.':'Noten er ændret et andet sted. Eksportér kladden eller genindlæs før du gemmer.');
      } else result=await client.from('personal_notes').insert(data).select('*').single();
      if(result.error) throw result.error;
      setRows(current=>({...current,personalRows:[result.data,...current.personalRows.filter(row=>row.id!==data.id)]}));setDraft(result.data);setStatus('saved');
      setLocalDraftRows(current=>current.filter(row=>row.id!==data.id));
      try{localStorage.removeItem(`mf78-note-draft:${userId}:${data.id}`);}catch{}
    } catch(err){setStatus('error');setError(err.message || String(err));}
  }
  async function remove() {
    if(!draft || !rows.personalRows.some(row=>row.id===draft.id) || !window.confirm(en?'Delete this note? This cannot be undone.':'Slet denne note? Det kan ikke fortrydes.')) return;
    const {error:deleteError}=await client.from('personal_notes').delete().eq('id',draft.id).eq('user_id',userId);
    if(deleteError){setError(deleteError.message);return;}
    setRows(current=>({...current,personalRows:current.personalRows.filter(row=>row.id!==draft.id)}));
    try{localStorage.removeItem(`mf78-note-draft:${userId}:${draft.id}`);}catch{}
    setDraft(null);setSelectedId(null);
  }
  function discardLocalDraft() {
    if(!draft || rows.personalRows.some(row=>row.id===draft.id) || !window.confirm(en?'Discard this unsaved note?':'Kassér denne ugemte note?'))return;
    try{localStorage.removeItem(`mf78-note-draft:${userId}:${draft.id}`);}catch{}
    setLocalDraftRows(current=>current.filter(row=>row.id!==draft.id));setDraft(null);setSelectedId(null);
  }
  function insertMarkdown(before,after='') {
    const el=bodyRef.current;if(!el||!draft)return;
    const start=el.selectionStart,end=el.selectionEnd,text=draft.body || '';
    patch({body:text.slice(0,start)+before+text.slice(start,end)+after+text.slice(end)});
    requestAnimationFrame(()=>{el.focus();el.setSelectionRange(start+before.length,end+before.length);});
  }
  const tabs=[['all',en?'All':'Alle'],['lecture',en?'Lectures':'Forelæsninger'],['page',en?'Pages':'Sider'],['favorites',en?'Favorites':'Favoritter']];
  return <section className="mf78-notes-hub" aria-label={en?'Notes':'Noter'}>
    <header className="mf78-notes-head"><div><small>{en?'YOUR WORKSPACE':'DIT ARBEJDSRUM'}</small><h1>{en?'Notes':'Noter'}</h1><p>{en?'Ideas, pages and lectures together.':'Dine idéer, sider og forelæsninger samlet.'}</p></div><div><button type="button" className="mf78-primary" onClick={()=>create()} disabled={!userId}>+ {en?'New note':'Ny note'}</button><button type="button" onClick={onClose} aria-label={en?'Close notes':'Luk noter'}>×</button></div></header>
    <div className="mf78-notes-controls"><div role="tablist" aria-label={en?'Note views':'Notevisninger'}>{tabs.map(([id,label])=><button type="button" role="tab" key={id} aria-selected={kind===id} onClick={()=>setKind(id)}>{label}</button>)}</div><input type="search" aria-label={en?'Search notes':'Søg noter'} placeholder={en?'Search title, text or tag…':'Søg titel, tekst eller mærke…'} value={query} onChange={e=>setQuery(e.target.value)} /></div>
    <details className="mf78-note-filters"><summary>{en?'Filters':'Filtre'}{Object.values(filters).some(Boolean)?' · aktive':''}</summary><div>{[['module',en?'Module':'Modul'],['lectureId',en?'Lecture':'Forelæsning'],['tag',en?'Tag':'Mærke'],['collection',en?'Collection':'Samling']].map(([id,label])=><label key={id}>{label}<select value={filters[id]} onChange={e=>setFilters(current=>({...current,[id]:e.target.value}))}><option value="">{en?'All':'Alle'}</option>{choices[id].map(value=><option key={value} value={value}>{value}</option>)}</select></label>)}</div></details>
    {selected && !draft && !selected.localOnly && <button type="button" className="mf78-edit-legacy" onClick={()=>setEditingLegacyId(selected.id)}>{en?'Edit selected note':'Redigér valgt note'}</button>}
    {error && <p className="mf78-notes-error" role="status">{error} {status==='error' && draft ? (en?'Your local draft is preserved.':'Din lokale kladde er bevaret.') : ''}</p>}
    <div className="mf78-notes-columns"><aside className="mf78-notes-list" aria-label={en?'Note list':'Noteliste'}>{visible.map(note=><button type="button" key={note.id} aria-current={selectedId===note.id?'true':undefined} onClick={()=>pick(note)}><span className="mf78-note-kind">{note.kind==='page'?`PDF · ${note.source?.page}`:note.kind==='lecture'?'Forelæsning':note.kind==='local'?'Kun på denne enhed':'Note'}</span><strong>{note.title}</strong><small>{note.body?.slice(0,95) || '—'}</small></button>)}{!visible.length && <p>{status==='loading'?(en?'Loading notes…':'Henter noter…'):(en?'Nothing here yet.':'Her er endnu ingen noter.')}</p>}<div className="mf78-local-opt"><label><input type="checkbox" checked={showLocal} onChange={e=>setShowLocal(e.target.checked)} />{en?'Show old notes on this device':'Vis gamle noter på denne enhed'}</label><small>{en?'These older notes were not account-scoped. Only show them on a private device.':'De gamle noter er ikke knyttet til en konto. Vis dem kun på en privat enhed.'}</small></div></aside>
    <main className="mf78-notes-editor">{draft ? <><div className="mf78-editor-top"><span role="status">{status==='saving'?'Gemmer…':status==='saved'?'Synkroniseret':status==='error'?'Kun lokal kladde':'Ikke synkroniseret'}</span><button type="button" onClick={()=>exportText({title:draft.title,body:draft.body})}>{en?'Export':'Eksportér'}</button>{rows.personalRows.some(row=>row.id===draft.id)?<button type="button" onClick={remove}>{en?'Delete':'Slet'}</button>:<button type="button" onClick={discardLocalDraft}>{en?'Discard draft':'Kassér kladde'}</button>}<button type="button" className="mf78-primary" onClick={save} disabled={status==='saving'}>{en?'Save':'Gem'}</button></div><input className="mf78-note-title" aria-label={en?'Note title':'Notetitel'} placeholder={en?'Untitled note':'Note uden titel'} value={draft.title || ''} onChange={e=>patch({title:e.target.value})} /><div className="mf78-format" role="toolbar" aria-label={en?'Text formatting':'Tekstformatering'}>{[['H','## ','','Overskrift'],['B','**','**','Fed'],['I','*','*','Kursiv'],['•','- ','','Punktliste'],['☐','- [ ] ','','Tjekliste']].map(([label,before,after,title])=><button key={label} type="button" title={title} aria-label={title} onMouseDown={e=>e.preventDefault()} onClick={()=>insertMarkdown(before,after)}>{label}</button>)}</div><textarea ref={bodyRef} aria-label={en?'Note text':'Notetekst'} placeholder={en?'Write freely…':'Skriv frit…'} value={draft.body || ''} onChange={e=>patch({body:e.target.value})} onKeyDown={e=>{if((e.metaKey||e.ctrlKey)&&e.key==='b'){e.preventDefault();insertMarkdown('**','**');}if((e.metaKey||e.ctrlKey)&&e.key==='s'){e.preventDefault();save();}}} /><div className="mf78-note-meta"><label>{en?'Tags (comma-separated)':'Mærker (kommasepareret)'}<input value={(draft.tags || []).join(', ')} onChange={e=>patch({tags:e.target.value.split(',').map(v=>v.trim())})} /></label><label>{en?'Collection':'Samling'}<input value={draft.collection || ''} onChange={e=>patch({collection:e.target.value})} /></label><label><input type="checkbox" checked={Boolean(draft.is_pinned)} onChange={e=>patch({is_pinned:e.target.checked})} />{en?'Pin note':'Fastgør note'}</label></div><div className="mf78-note-links"><label>{en?'Link to another note':'Link til en anden note'}<select value="" onChange={e=>patch({linked_note_ids:[...(draft.linked_note_ids || []),e.target.value]})}><option value="">{en?'Choose a note…':'Vælg note…'}</option>{all.filter(n=>n.kind==='personal'&&n.id!==draft.id&&!(draft.linked_note_ids || []).includes(n.id)).map(n=><option key={n.id} value={n.id}>{n.title}</option>)}</select></label>{(draft.linked_note_ids || []).map(id=><button type="button" key={id} onClick={()=>patch({linked_note_ids:(draft.linked_note_ids || []).filter(x=>x!==id)})}>{all.find(n=>n.id===id)?.title || (en?'Broken link':'Brudt link')} ×</button>)}</div>{draft.source_material_id && <button type="button" className="mf78-source" onClick={()=>onOpenSource?.({lectureId:draft.source_lecture_id,materialId:draft.source_material_id,page:draft.source_page})}>{en?'Open source':'Åbn kilde'} · PDF-side {draft.source_page} ↗</button>}</> : selected ? <article className="mf78-note-read"><small>{selected.kind==='page'?`PDF-side ${selected.source?.page}`:selected.kind==='lecture'?'Forelæsningsnote':'Kun på denne enhed'}</small><h2>{selected.title}</h2><p>{selected.body || '—'}</p>{selected.legacySections?.some(v=>v.trim()) && <div className="mf78-legacy"><h3>Tidligere strukturerede noter</h3>{selected.legacySections.map((v,i)=>v.trim()&&<section key={i}><strong>{['Nøglepunkter','Kliniske punkter','Åbne spørgsmål'][i]}</strong><p>{v}</p></section>)}</div>}{selected.source?.lectureId && <button type="button" className="mf78-source" onClick={()=>onOpenSource?.(selected.source)}>Åbn forelæsning{selected.source.page?` · side ${selected.source.page}`:''} ↗</button>}{selected.localOnly && <button type="button" onClick={()=>{if(window.confirm('Importér denne lokale note til din private konto? Originalen bevares på enheden.'))create(null,{title:selected.title,body:selected.body});}}>Importér kopi til min konto</button>}</article> : <div className="mf78-notes-welcome"><span>✎</span><h2>{en?'A place to think clearly':'Et sted at tænke klart'}</h2><p>{en?'Choose a note or create one. PDF notes link back to their source.':'Vælg en note eller opret en ny. PDF-noter linker tilbage til kilden.'}</p></div>}{selected && backlinks.length>0 && <div className="mf78-backlinks"><strong>{en?'Linked from':'Henvist fra'}</strong>{backlinks.map(n=><button key={n.id} onClick={()=>pick(n)}>{n.title} ↗</button>)}</div>}</main></div>
    {editingLegacyId && selected && editingLegacyId===selected.id && <div className="mf78-legacy-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setEditingLegacyId(null);}}><div className="mf78-legacy-dialog" role="dialog" aria-modal="true" aria-label={en?'Edit note':'Redigér note'}><button className="mf78-legacy-close" type="button" onClick={()=>setEditingLegacyId(null)} aria-label={en?'Close':'Luk'}>×</button><LegacyEditor78 note={selected} rows={rows} client={client} userId={userId} onSaved={(bucket,row)=>{updateLegacyRows(bucket,row);setEditingLegacyId(null);}} onOpenSource={onOpenSource} en={en} /></div></div>}
  </section>;
}
