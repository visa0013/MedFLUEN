import React, { useEffect, useRef, useState } from 'react';
import { createActiveClock72, sanitizeRich72, richText72, textHtml72, validMasks72, searchPages72 } from './experience72-model';
import './experience72.css';

export function useReviewClock72(active) {
  const clock = useRef(null);
  if (!clock.current) clock.current = createActiveClock72();
  useEffect(() => {
    const update = () => active && document.visibilityState !== 'hidden' && document.hasFocus() ? clock.current.resume() : clock.current.pause();
    update(); document.addEventListener('visibilitychange', update); window.addEventListener('focus', update); window.addEventListener('blur', update);
    return () => { clock.current.pause(); document.removeEventListener('visibilitychange',update); window.removeEventListener('focus',update); window.removeEventListener('blur',update); };
  }, [active]);
  return clock.current;
}

export function RichContent72({ html, text, cloze=false, revealed=false }) {
  const content=cloze&&html?sanitizeRich72(html).replace(/\{\{c\d+::(.*?)(?:::[^}]*)?\}\}/gs,(_,answer)=>revealed?answer:'[…]'):html;
  return content ? <div className="mf72-rich" dangerouslySetInnerHTML={{__html:sanitizeRich72(content)}} /> : <div className="mf72-rich mf72-plain">{text}</div>;
}

export function AreaTabs72({area,activeTab,onSelect,language,Icon}) {
  const en=language==='en';
  const tabs=area==='training' ? [['training-start',en?'Flashcards':'Flashkort','training','training-history'],['training-exams',en?'Exam sets':'Eksamenssæt','file','training-exam-history']] : area==='curriculum' ? [['curriculum-lectures',en?'Lectures':'Forelæsninger','curriculum'],['curriculum-notes',en?'Notes':'Noter','notebook']] : area==='planning' ? [['planning-calendar',en?'Calendar':'Kalender','calendar'],['planning-study-plan',en?'Study plan':'Studieplan','planning']] : [];
  if(!tabs.length) return null;
  const normalized=['training-review','training-history'].includes(activeTab)?'training-start':activeTab;
  return <nav className="medfluen-area-tabs mf72-tabs" aria-label={en?'Workspace navigation':'Områdenavigation'}>{tabs.map(([id,label,icon,history])=><div className="mf72-tab-pair" key={id} data-active={id===normalized}><button type="button" aria-current={id===normalized?'page':undefined} onClick={()=>onSelect(id)}><Icon name={icon} size={16}/>{label}</button>{history && <button type="button" className="mf72-history" aria-label={`${label} · ${en?'History':'Historik'}`} title={`${label} · ${en?'History':'Historik'}`} onClick={()=>onSelect(history)}><Icon name="clock" size={15}/></button>}</div>)}</nav>;
}

async function imageFile72(file) {
  if(!file || !/^image\/(png|jpeg|gif|webp)$/.test(file.type)) throw Error('Vælg PNG, JPG, GIF eller WebP.');
  if(file.size>12*1024*1024) throw Error('Billedet må højst fylde 12 MB.');
  const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(Error('Billedet kunne ikke læses.'));r.readAsDataURL(file);});
  if(file.size<700000) return data;
  const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('Billedet kunne ikke åbnes.'));i.src=data;});
  const scale=Math.min(1,1600/Math.max(img.width,img.height)); const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
  return canvas.toDataURL('image/jpeg',.88);
}

function RichEditor72({id,label,html,onChange,cloze}) {
  const editor=useRef(null), selection=useRef(null), file=useRef(null);
  const [source,setSource]=useState(false),[error,setError]=useState('');
  useEffect(()=>{if(editor.current) editor.current.innerHTML=sanitizeRich72(html);},[id,source]); // DOM owns selection and undo, not each React render.
  function remember(){const s=window.getSelection();if(s?.rangeCount&&editor.current?.contains(s.anchorNode)) selection.current=s.getRangeAt(0).cloneRange();}
  function restore(){editor.current?.focus();const s=window.getSelection();if(selection.current&&editor.current?.contains(selection.current.commonAncestorContainer)){s.removeAllRanges();s.addRange(selection.current);}}
  function emit(){onChange(sanitizeRich72(editor.current?.innerHTML||''));remember();}
  function command(name,value){restore();document.execCommand(name,false,value);emit();}
  async function addImage(f){try{setError('');const data=await imageFile72(f);command('insertHTML',`<img src="${data}" alt="Billede"><br>`);}catch(e){setError(e.message);}}
  const actions=[['bold','Fed','B'],['italic','Kursiv','I'],['underline','Understreget','U'],['strikeThrough','Gennemstreget','S'],['superscript','Hævet skrift','x²'],['subscript','Sænket skrift','x₂'],['insertUnorderedList','Punktliste','• ≡'],['insertOrderedList','Nummereret liste','1. ≡'],['justifyLeft','Venstrestil','≡'],['justifyCenter','Centrér','☰'],['undo','Fortryd','↶'],['redo','Gentag','↷'],['removeFormat','Fjern formatering','Tx']];
  return <section className="mf72-field"><div className="mf72-field-label"><label id={`${id}-label`}>{label}</label><button type="button" onClick={()=>{if(!source)emit();setSource(!source);}} aria-pressed={source} title="Vis HTML-kilde">&lt;/&gt;</button></div>
    {!source && <div className="mf72-format" role="toolbar" aria-label={`${label} · Formatering`} onMouseDown={e=>{if(e.target.closest('button'))e.preventDefault();}}>
      {actions.map(([cmd,title,symbol])=><button key={cmd} type="button" title={title} aria-label={title} onClick={()=>command(cmd)}>{symbol}</button>)}
      <select aria-label="Fontstørrelse" defaultValue="3" onChange={e=>command('fontSize',e.target.value)}>{[['1','10'],['2','13'],['3','16'],['4','20'],['5','24'],['6','32'],['7','40']].map(([v,l])=><option key={v} value={v}>{l} px</option>)}</select>
      <label title="Tekstfarve" className="mf72-color">A<input aria-label="Tekstfarve" type="color" defaultValue="#1665ea" onChange={e=>command('foreColor',e.target.value)}/></label>
      <label title="Fremhævning" className="mf72-color">▰<input aria-label="Fremhævning" type="color" defaultValue="#fff2a8" onChange={e=>command('hiliteColor',e.target.value)}/></label>
      <button type="button" title="Indsæt link" aria-label="Indsæt link" onClick={()=>{const url=window.prompt('Link (https://…)');if(url&&/^https?:\/\//i.test(url))command('createLink',url);}}>↗</button>
      <button type="button" onClick={()=>file.current.click()} title="Indsæt billede" aria-label="Indsæt billede">▧</button>
      {cloze&&<button type="button" title="Skjul markeret tekst" onClick={()=>{restore();const text=window.getSelection()?.toString();if(text)command('insertText',`{{c1::${text}}}`);}}>[…]</button>}
    </div>}
    <input ref={file} hidden type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={e=>{addImage(e.target.files[0]);e.target.value='';}}/>
    {source?<textarea className="mf72-source" aria-labelledby={`${id}-label`} value={html} onChange={e=>onChange(e.target.value)}/>:<div ref={editor} role="textbox" aria-multiline="true" aria-labelledby={`${id}-label`} contentEditable suppressContentEditableWarning className="mf72-rich mf72-editable" onInput={emit} onKeyUp={remember} onMouseUp={remember} onBlur={remember} onPaste={e=>{e.preventDefault();const image=[...e.clipboardData.files].find(f=>f.type.startsWith('image/'));if(image){addImage(image);return;}const h=e.clipboardData.getData('text/html');command('insertHTML',h?sanitizeRich72(h):textHtml72(e.clipboardData.getData('text/plain')));}} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(e.dataTransfer.files[0])addImage(e.dataTransfer.files[0]);}}/>}
    {error&&<p className="mf72-error" role="alert">{error}</p>}
  </section>;
}

function MaskEditor72({value,onChange}) {
  const surface=useRef(null),gesture=useRef(null),input=useRef(null);const [selected,setSelected]=useState(null),[error,setError]=useState('');
  const data=value||{}, masks=data.masks||[];
  const point=e=>{const r=surface.current.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
  function commit(next){const ids=new Set(next.map(m=>m.id));onChange({...data,masks:next,hiddenMaskIds:data.mode==='one'?[ids.has(data.hiddenMaskIds?.[0])?data.hiddenMaskIds[0]:next[0]?.id].filter(Boolean):next.map(m=>m.id)});}
  function down(e){if(e.button!==0)return;e.preventDefault();surface.current.focus();surface.current.setPointerCapture(e.pointerId);const p=point(e);const id=e.target.closest('[data-mask]')?.dataset.mask;const mask=masks.find(m=>m.id===id);setSelected(id||null);gesture.current={p,id,mask,resize:e.target.dataset.resize==='true',original:masks};if(!mask){const newMask={id:`mask-${Date.now()}`,x:p.x,y:p.y,width:0,height:0};gesture.current.id=newMask.id;gesture.current.draw=true;setSelected(newMask.id);commit([...masks,newMask]);}}
  function move(e){const g=gesture.current;if(!g)return;const p=point(e);let next;
    if(g.draw)next={id:g.id,x:Math.min(g.p.x,p.x),y:Math.min(g.p.y,p.y),width:Math.abs(g.p.x-p.x),height:Math.abs(g.p.y-p.y)};
    else if(g.resize) next={...g.mask,width:Math.max(.01,Math.min(1-g.mask.x,p.x-g.mask.x)),height:Math.max(.01,Math.min(1-g.mask.y,p.y-g.mask.y))};
    else next={...g.mask,x:Math.max(0,Math.min(1-g.mask.width,g.mask.x+p.x-g.p.x)),y:Math.max(0,Math.min(1-g.mask.height,g.mask.y+p.y-g.p.y))};
    commit([...(g.draw?g.original:g.original.filter(m=>m.id!==g.id)),next]);
  }
  function end(){gesture.current=null;commit(validMasks72(masks));}
  async function upload(f){try{setError('');const imageDataUrl=await imageFile72(f);onChange({imageDataUrl,masks:[],hiddenMaskIds:[],mode:'all',sourceName:f.name});setSelected(null);}catch(e){setError(e.message);}}
  return <section className="mf72-mask-editor"><div className="mf72-row"><button type="button" onClick={()=>input.current.click()}>{data.imageDataUrl?'Skift billede':'Vælg billede'}</button><button type="button" disabled={!selected} onClick={()=>{commit(masks.filter(m=>m.id!==selected));setSelected(null);}}>Slet markering</button><select aria-label="Skjul markeringer" value={data.mode||'all'} onChange={e=>onChange({...data,mode:e.target.value,hiddenMaskIds:e.target.value==='all'?masks.map(m=>m.id):[selected||masks[0]?.id].filter(Boolean)})}><option value="all">Skjul alle</option><option value="one">Skjul én</option></select>{data.mode==='one'&&<select aria-label="Aktiv markering" value={data.hiddenMaskIds?.[0]||''} onChange={e=>onChange({...data,hiddenMaskIds:[e.target.value]})}>{masks.map((m,i)=><option value={m.id} key={m.id}>Markering {i+1}</option>)}</select>}</div>
    <input ref={input} hidden type="file" accept="image/png,image/jpeg,image/gif,image/webp" onChange={e=>{upload(e.target.files[0]);e.target.value='';}}/>
    <p className="mf72-muted">Træk for at skjule et område. Flyt en markering, eller træk i dens hjørne for at ændre størrelse.</p>
    {data.imageDataUrl&&<div ref={surface} className="mf72-mask-surface" tabIndex={0} role="group" aria-label="Billedmarkeringer" onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onKeyDown={e=>{if(['Delete','Backspace'].includes(e.key)&&selected){e.preventDefault();commit(masks.filter(m=>m.id!==selected));}}}><img src={data.imageDataUrl} alt="Billede til maskering" draggable="false"/>{masks.map((m,i)=><div key={m.id} data-mask={m.id} data-selected={selected===m.id} className="mf72-mask" style={{left:`${m.x*100}%`,top:`${m.y*100}%`,width:`${m.width*100}%`,height:`${m.height*100}%`}}><span>{i+1}</span><i data-resize="true"/></div>)}</div>}
    {error&&<p className="mf72-error">{error}</p>}
  </section>;
}

export function CardEditor72({language='da',question=null,context={},lectures=[],onSave,onCancel,createMode=false,makeDraft,validate}) {
  const [draft,setDraft]=useState(()=>makeDraft(question,context,language)),[initial,setInitial]=useState(()=>makeDraft(question,context,language)),[errors,setErrors]=useState({}),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[preview,setPreview]=useState(false),[reveal,setReveal]=useState(false),[generation,setGeneration]=useState(0);
  const lock=useRef(false),root=useRef(null);
  const text=v=>typeof v==='string'?v:(v?.[language]??v?.da??v?.en??'');
  const local=(v,value)=>({...((v&&typeof v==='object')?v:{}),[language]:value});
  const dirty=JSON.stringify(draft)!==JSON.stringify(initial);
  useEffect(()=>{const d=makeDraft(question,context,language);setDraft(d);setInitial(d);setErrors({});setGeneration(v=>v+1);},[question?.id,context.moduleId,context.lectureId,language]);
  useEffect(()=>{const warn=e=>{if(dirty){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  function close(){if(!busy&&(!dirty||window.confirm('Du har ændringer, som ikke er gemt. Luk uden at gemme?')))onCancel?.();}
  function rich(field,html){setDraft(d=>({...d,[field]:local(d[field],richText72(html)),richContent:{...d.richContent,[field]:{...d.richContent?.[field],[language]:html}}}));}
  const fieldHtml=field=>draft.richContent?.[field]?.[language]??textHtml72(text(draft[field]));
  async function save(createNext=false){if(lock.current)return;const content={};Object.entries(draft.richContent||{}).forEach(([f,langs])=>{content[f]=Object.fromEntries(Object.entries(langs).map(([lang,h])=>[lang,sanitizeRich72(h)]));});const record={...draft,richContent:content,updatedAt:new Date().toISOString()};const result=validate(record,language);if(record.cardType==='image-occlusion'&&(!record.imageOcclusion?.imageDataUrl||!validMasks72(record.imageOcclusion.masks).length))result.errors.imageOcclusion='Vælg et billede og tegn mindst én markering.';setErrors(result.errors);if(Object.keys(result.errors).length){root.current?.querySelector('[role="textbox"]')?.focus();return;}lock.current=true;setBusy(true);try{if(!onSave)throw Error('Gem er ikke tilsluttet.');const saved=await onSave(record,{createNext});if(saved?.ok===false)throw Error(saved.error||'Kortet kunne ikke gemmes.');setDraft(record);setInitial(record);if(createNext){const next=makeDraft(null,{...context,lectureId:record.lectureId},language);next.cardType=record.cardType==='image-occlusion'?'basic':record.cardType;setDraft(next);setInitial(next);setGeneration(v=>v+1);setNotice('Kortet er gemt. Klar til det næste.');}}catch(e){setErrors({save:e.message});}finally{lock.current=false;setBusy(false);}}
  const front=text(draft.front).replace(/\{\{c\d+::(.*?)(?:::[^}]*)?\}\}/g,(_,a)=>reveal?a:'[…]');
  return <section ref={root} className="mf72 mf72-editor" data-flashcard-editor71="true" aria-label={createMode?'Nyt kort':'Redigér kort'} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();save();}if(e.key==='Escape')close();}}>
    <header className="mf72-editor-head"><div><small>DIT LÆRINGSRUM</small><h2>{createMode?'Nyt kort':'Redigér kort'}</h2></div><div className="mf72-row"><button type="button" aria-pressed={preview} onClick={()=>setPreview(!preview)}>Forhåndsvisning</button><button type="button" aria-label="Luk editor" onClick={close}>×</button></div></header>
    <div className="mf72-editor-meta"><label>Korttype<select value={draft.cardType} onChange={e=>setDraft({...draft,cardType:e.target.value})}><option value="basic">Forside / bagside</option><option value="cloze">Cloze · udfyld det skjulte</option><option value="image-occlusion">Billedkort · maskering</option><option value="mcq">Multiple choice</option></select></label><label>Forelæsning<select value={draft.lectureId||''} onChange={e=>setDraft({...draft,lectureId:e.target.value||null})}><option value="">Uden forelæsning</option>{lectures.map(l=><option key={l.id} value={l.id}>{l.id} · {text(l.title)||l.title}</option>)}</select></label></div>
    <div className={`mf72-editor-body ${preview?'with-preview':''}`}><div className="mf72-fields">
      {draft.cardType==='image-occlusion'&&<MaskEditor72 value={draft.imageOcclusion} onChange={imageOcclusion=>setDraft(d=>({...d,imageOcclusion}))}/>}
      <RichEditor72 key={`front-${generation}`} id={`front-${generation}`} label="Forside" cloze={draft.cardType==='cloze'} html={fieldHtml('front')} onChange={h=>rich('front',h)}/>
      {draft.cardType==='cloze'&&<p className="mf72-muted">Markér et ord og tryk […]. Syntaks: {'{{c1::svar}}'}. Alle skjulte felter vises samlet på dette kort.</p>}
      {draft.cardType==='mcq'?<><div className="mf72-options">{draft.options.map((o,i)=><label key={i}><input type="radio" name="correct72" aria-label={`Svar ${i+1} er korrekt`} checked={draft.correct===i} onChange={()=>setDraft({...draft,correct:i})}/><input aria-label={`Svar ${i+1}`} value={text(o)} onChange={e=>setDraft({...draft,options:draft.options.map((x,j)=>i===j?local(x,e.target.value):x)})}/><button type="button" disabled={draft.options.length<=2} aria-label={`Fjern svar ${i+1}`} onClick={()=>setDraft({...draft,correct:Math.max(0,draft.correct-(i<=draft.correct?1:0)),options:draft.options.filter((_,j)=>j!==i)})}>×</button></label>)}</div><button type="button" onClick={()=>setDraft({...draft,options:[...draft.options,{[language]:''}]})}>+ Svarmulighed</button><RichEditor72 key={`explanation-${generation}`} id={`explanation-${generation}`} label="Forklaring" html={fieldHtml('explanation')} onChange={h=>rich('explanation',h)}/></>:<RichEditor72 key={`back-${generation}`} id={`back-${generation}`} label="Bagside" html={fieldHtml('back')} onChange={h=>rich('back',h)}/>}
      <div className="mf72-editor-meta"><label>Emne<input value={text(draft.category)} onChange={e=>setDraft({...draft,category:local(draft.category,e.target.value)})}/></label><label>Tags · adskil med komma<input value={draft.tags.join(', ')} onChange={e=>setDraft({...draft,tags:e.target.value.split(',').map(t=>t.trim())})}/></label></div>
    </div>{preview&&<aside className="mf72-preview"><small>FORHÅNDSVISNING</small>{draft.imageOcclusion?.imageDataUrl&&<div className="mf72-mask-surface"><img alt="Billedkort" src={draft.imageOcclusion.imageDataUrl}/>{!reveal&&(draft.imageOcclusion.masks||[]).filter(m=>draft.imageOcclusion.hiddenMaskIds?.includes(m.id)).map(m=><div className="mf72-mask" key={m.id} style={{left:`${m.x*100}%`,top:`${m.y*100}%`,width:`${m.width*100}%`,height:`${m.height*100}%`}}/>)}</div>}<RichContent72 html={fieldHtml('front')} text={front} cloze={draft.cardType==='cloze'} revealed={reveal}/>{reveal&&<><hr/><RichContent72 html={draft.cardType==='mcq'?null:fieldHtml('back')} text={text(draft.options[draft.correct])}/>{draft.cardType==='mcq'&&<RichContent72 html={fieldHtml('explanation')}/>}</>}<button type="button" onClick={()=>setReveal(!reveal)}>{reveal?'Vis forside':'Vis svar'}</button></aside>}</div>
    {Object.keys(errors).length>0&&<div className="mf72-error" role="alert">{Object.values(errors).join(' ')}</div>}{notice&&<p role="status" className="mf72-notice">{notice}</p>}
    <footer className="mf72-editor-foot"><small>{dirty?'Ikke gemt':'Personligt kort'} · ⌘/Ctrl + Enter</small><button type="button" onClick={close} disabled={busy}>Annuller</button>{createMode&&<button type="button" disabled={busy} onClick={()=>save(true)}>Gem og opret næste</button>}<button type="button" disabled={busy} className="mf72-primary" onClick={()=>save(false)}>{busy?'Gemmer…':'Gem kort'}</button></footer>
  </section>;
}

async function documentStore72(userId, action, payload) {
  if(!userId||!window.indexedDB) return [];
  const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('medfluen-byte-documents-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('documents',{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  try{return await new Promise((resolve,reject)=>{const tx=db.transaction('documents',action==='read'?'readonly':'readwrite'),store=tx.objectStore('documents');let value=[];
    if(action==='read'){const req=store.getAll();req.onsuccess=()=>{value=req.result.filter(d=>d.owner===userId);};}
    else if(action==='put')store.put({...payload,key:`${userId}:${payload.id}`,owner:userId});
    else if(action==='delete')store.delete(`${userId}:${payload}`);
    tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('Lagring afbrudt.'));
  });}finally{db.close();}
}

function PdfSource72({bytes,initialPage,loadPdfJs}) {
  const [pdf,setPdf]=useState(null),[page,setPage]=useState(initialPage),[width,setWidth]=useState(720),[error,setError]=useState(''),[text,setText]=useState('');const canvas=useRef(null),container=useRef(null);
  useEffect(()=>{let disposed=false,task;loadPdfJs().then(lib=>{if(disposed)return;task=lib.getDocument({data:new Uint8Array(bytes.slice(0)),isEvalSupported:false});return task.promise;}).then(doc=>{if(doc&&!disposed)setPdf(doc);}).catch(e=>{if(!disposed)setError('PDF-kilden kunne ikke åbnes. Prøv Åbn separat.');});return()=>{disposed=true;task?.destroy();};},[bytes,loadPdfJs]);
  useEffect(()=>{const observer=new ResizeObserver(entries=>setWidth(Math.max(240,Math.min(1000,entries[0].contentRect.width-36))));if(container.current)observer.observe(container.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{if(!pdf)return;let cancelled=false,render;setError('');pdf.getPage(page).then(async source=>{if(cancelled)return;const native=source.getViewport({scale:1}),ratio=Math.min(2,window.devicePixelRatio||1),viewport=source.getViewport({scale:width/native.width});const el=canvas.current;el.width=Math.round(viewport.width*ratio);el.height=Math.round(viewport.height*ratio);el.style.width=`${viewport.width}px`;el.style.height=`${viewport.height}px`;render=source.render({canvasContext:el.getContext('2d'),viewport,transform:ratio===1?null:[ratio,0,0,ratio,0,0]});await render.promise;if(cancelled)return;const content=await source.getTextContent();if(!cancelled)setText(content.items.map(i=>i.str||'').join(' '));}).catch(e=>{if(!cancelled&&e.name!=='RenderingCancelledException')setError('Siden kunne ikke vises.');});return()=>{cancelled=true;render?.cancel();};},[pdf,page,width]);
  return <div className="mf72-pdf-reader"><div className="mf72-row"><button type="button" disabled={!pdf||page<=1} onClick={()=>setPage(p=>p-1)}>← Forrige</button><span>Side {page}{pdf?` / ${pdf.numPages}`:''}</span><button type="button" disabled={!pdf||page>=pdf.numPages} onClick={()=>setPage(p=>p+1)}>Næste →</button></div><div className="mf72-pdf-canvas" ref={container}>{!pdf&&!error&&<p role="status">Åbner kilden…</p>}{error&&<p role="alert">{error}</p>}<canvas ref={canvas} aria-label={`PDF-kilde, side ${page}`}/>{text&&<details><summary>Tekst på denne side</summary><p>{text}</p></details>}</div></div>;
}

export function Assistant72({onClose,userId,moduleName,supabase,loadPdfJs}) {
  const [docs,setDocs]=useState([]),[question,setQuestion]=useState(''),[messages,setMessages]=useState([]),[context,setContext]=useState(null),[screen,setScreen]=useState(null),[busy,setBusy]=useState(''),[notice,setNotice]=useState(''),[library,setLibrary]=useState(null),[chosen,setChosen]=useState([]),[viewer,setViewer]=useState(null);
  const upload=useRef(null),body=useRef(null),alive=useRef(true),locked=useRef(false),urls=useRef(new Set()),loadingPdf=useRef(null),streamRef=useRef(null),snapshotRef=useRef(null);
  useEffect(()=>{alive.current=true;documentStore72(userId,'read').then(rows=>{if(alive.current)setDocs(rows.map(r=>({...r,selected:true})));}).catch(()=>{if(alive.current)setNotice('Browseren kan ikke gemme PDF-biblioteket. Du kan stadig bruge det i denne åbne chat.');});return()=>{alive.current=false;loadingPdf.current?.destroy();streamRef.current?.getTracks().forEach(t=>t.stop());urls.current.forEach(url=>URL.revokeObjectURL(url));};},[userId]);
  useEffect(()=>{body.current?.scrollTo({top:body.current.scrollHeight,behavior:'auto'});},[messages.length]);
  async function indexFile(file,id){
    if(file.size>25*1024*1024)throw Error('PDF-filen må højst fylde 25 MB.');
    const bytes=await file.arrayBuffer();const pdfjs=await loadPdfJs();const task=pdfjs.getDocument({data:new Uint8Array(bytes.slice(0)),isEvalSupported:false});loadingPdf.current=task;let pdf;
    try{pdf=await task.promise;if(pdf.numPages>1000)throw Error('Del PDF-filer med over 1.000 sider op i mindre dele.');const pages=[];for(let n=1;n<=pdf.numPages;n++){if(!alive.current)throw Error('Afbrudt.');setBusy(`${file.name} · side ${n}/${pdf.numPages}`);const page=await pdf.getPage(n);const content=await page.getTextContent();const text=content.items.map(x=>`${x.str||''}${x.hasEOL?'\n':' '}`).join('').trim();if(text)pages.push({documentId:id,title:file.name,page:n,text});page.cleanup();}if(!pages.length)throw Error('Denne PDF har ingen læsbar tekst. Scannede sider kræver OCR, som ikke er tilsluttet.');const doc={id,title:file.name,bytes,pages,totalPages:pdf.numPages,selected:true};try{await documentStore72(userId,'put',doc);}catch{if(alive.current)setNotice('PDF’en er læst, men kunne ikke gemmes i browseren. Den er tilgængelig, så længe chatten er åben.');}if(alive.current)setDocs(current=>[...current.filter(d=>d.id!==id),doc]);return doc;}finally{await task.destroy();loadingPdf.current=null;}
  }
  async function importFiles(files){if(locked.current)return;locked.current=true;setNotice('');try{for(const file of files){if(!/\.pdf$/i.test(file.name))throw Error('Vælg en PDF-fil.');await indexFile(file,`local-${file.name}-${file.size}-${file.lastModified}`);}}catch(e){if(alive.current)setNotice(e.message);}finally{locked.current=false;if(alive.current)setBusy('');}}
  async function openLibrary(){if(locked.current)return;locked.current=true;setBusy('Henter dit bibliotek…');setNotice('');try{
    const [lecture,exam]=await Promise.all([supabase.from('lecture_materials').select('id,file_name,storage_path,mime_type,module_name').eq('module_name',moduleName),supabase.from('exam_set_documents').select('id,file_name,question_file_name,question_storage_path,storage_path,answer_file_name,answer_storage_path,module_name').eq('module_name',moduleName)]);
    if(lecture.error&&exam.error)throw Error('Biblioteket kunne ikke hentes. Du kan tilføje PDF-filer fra din computer.');
    const rows=[...(lecture.data||[]).filter(r=>r.mime_type==='application/pdf'||/\.pdf$/i.test(r.file_name)).map(r=>({id:`lecture-${r.id}`,title:r.file_name,path:r.storage_path,bucket:'lecture-materials'})),...(exam.data||[]).flatMap(r=>[{id:`exam-${r.id}`,title:r.question_file_name||r.file_name,path:r.question_storage_path||r.storage_path,bucket:'exam-set-documents'},...(r.answer_storage_path?[{id:`answer-${r.id}`,title:r.answer_file_name||'Facit.pdf',path:r.answer_storage_path,bucket:'exam-set-documents'}]:[])])].filter(r=>r.path);
    if(alive.current){setLibrary(rows);setChosen([]);if(lecture.error||exam.error)setNotice('En del af biblioteket kunne ikke hentes. De tilgængelige filer vises.');}
  }catch(e){if(alive.current)setNotice(e.message);}finally{locked.current=false;if(alive.current)setBusy('');}}
  async function importLibrary(){if(locked.current)return;locked.current=true;setNotice('');try{for(const item of (library||[]).filter(r=>chosen.includes(r.id))){setBusy(`Åbner ${item.title}…`);const {data,error}=await supabase.storage.from(item.bucket).download(item.path);if(error)throw Error(`${item.title} kunne ikke hentes.`);await indexFile(new File([data],item.title,{type:'application/pdf'}),item.id);}if(alive.current)setLibrary(null);}catch(e){if(alive.current)setNotice(e.message);}finally{locked.current=false;if(alive.current)setBusy('');}}
  function attachContext(){
    // Workspace overlays are siblings of main; capture the visible workspace, not the page behind it.
    const root=document.querySelector('.workspace-shell')||document.querySelector('main')||document.body;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),parts=[];let node;
    while((node=walker.nextNode())){const el=node.parentElement;if(!el||el.closest('.mf72-assistant,.mf72-help-backdrop,input,textarea,[contenteditable],script,style,[aria-hidden="true"],[hidden]'))continue;const r=el.getBoundingClientRect(),style=getComputedStyle(el);if(r.width<=0||r.height<=0||r.bottom<0||r.top>window.innerHeight||r.right<0||r.left>window.innerWidth||style.visibility==='hidden'||style.opacity==='0')continue;const t=node.textContent.trim();if(t)parts.push(t);}
    setContext({text:parts.join('\n').slice(0,14000),title:document.title,at:new Date().toLocaleTimeString('da-DK',{hour:'2-digit',minute:'2-digit'})});
  }
  async function captureScreen(){if(locked.current)return;locked.current=true;try{setNotice('');const stream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});streamRef.current=stream;const video=document.createElement('video');video.srcObject=stream;await video.play();if(!alive.current)return;const canvas=document.createElement('canvas'),scale=Math.min(1,1400/video.videoWidth);canvas.width=Math.round(video.videoWidth*scale);canvas.height=Math.round(video.videoHeight*scale);canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height);setScreen(canvas.toDataURL('image/jpeg',.8));}catch(e){if(e.name!=='NotAllowedError'&&alive.current)setNotice('Skærmbilledet kunne ikke tages. Brug “Se min visning” til at vedhæfte appens synlige tekst.');}finally{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;locked.current=false;}}
  function send(e){e.preventDefault();const q=question.trim();if(!q||busy)return;
    const sources=searchPages72(docs.filter(d=>d.selected).flatMap(d=>d.pages),q);
    const attachment=context?`\nVedhæftet appvisning · ${context.at}`:'';
    setMessages(m=>[...m,{role:'user',text:q+attachment+(screen?'\nVedhæftet skærmbillede':'')},{role:'assistant',text:sources.length?'Her er relevante uddrag fra de valgte PDF’er. Dette er lokal kildesøgning, ikke et AI-svar.':'AI-svar er ikke tilsluttet endnu.'+(docs.some(d=>d.selected)?' Jeg fandt ingen tekstuddrag, som matcher ordene i dit spørgsmål.':' Tilføj en PDF for at søge i dens tekst med sidereferencer.')+(context||screen?' Din vedhæftning er kun i denne åbne chat og er ikke sendt til en AI-tjeneste.':''),sources}]);
    snapshotRef.current={question:q,context,screen,sourcePages:sources.map(({documentId,page,text,title})=>({documentId,page,text,title}))};setQuestion('');
  }
  function openSource(source){const d=docs.find(d=>d.id===source.documentId);if(!d){setNotice('Kilden er fjernet fra biblioteket. Tilføj den igen for at åbne siden.');return;}const url=URL.createObjectURL(new Blob([d.bytes],{type:'application/pdf'}));urls.current.add(url);setViewer({url,page:source.page,title:d.title,bytes:d.bytes});}
  function closeSource(){if(viewer){URL.revokeObjectURL(viewer.url);urls.current.delete(viewer.url);}setViewer(null);}
  async function removeDoc(doc){try{await documentStore72(userId,'delete',doc.id);setDocs(d=>d.filter(x=>x.id!==doc.id));}catch{setNotice('PDF’en kunne ikke fjernes fra browserlageret. Prøv igen.');}}
  return <section className="mf72 mf72-assistant" aria-label="Dr. Byte"><header className="mf72-chat-head"><span className="mf72-byte-icon" aria-hidden="true">✧</span><div><h2>Dr. Byte</h2><small>Dit pensum, tæt på.</small></div><button type="button" aria-label="Luk Dr. Byte" onClick={onClose}>×</button></header>
    <div className="mf72-chat-body" ref={body}><div className="mf72-chat-welcome"><h3>Hvad vil du forstå?</h3><p>Find passager i dine PDF’er, og åbn den præcise side. AI-svar tilkobles senere. Dine PDF’er behandles lokalt i browseren.</p></div>
      {docs.length>0&&<details className="mf72-library"><summary>{docs.filter(d=>d.selected).length} af {docs.length} PDF’er valgt</summary>{docs.map(doc=><div key={doc.id} className="mf72-row"><label style={{flex:1}}><input type="checkbox" checked={doc.selected} onChange={e=>setDocs(rows=>rows.map(d=>d.id===doc.id?{...d,selected:e.target.checked}:d))}/><span>{doc.title}<br/><small>{doc.pages.length} sider med tekst</small></span></label><button type="button" aria-label={`Fjern ${doc.title}`} onClick={()=>removeDoc(doc)}>×</button></div>)}<p className="mf72-muted">Gemt lokalt for din bruger på denne enhed. Fjern filer her, hvis de ikke skal blive liggende.</p></details>}
      {library&&<div className="mf72-library"><h3>PDF-bibliotek · {moduleName}</h3>{library.length?library.map(item=><label key={item.id}><input type="checkbox" checked={chosen.includes(item.id)} onChange={e=>setChosen(ids=>e.target.checked?[...ids,item.id]:ids.filter(id=>id!==item.id))}/>{item.title}</label>):<p className="mf72-muted">Ingen tilgængelige PDF’er i dette modul.</p>}<div className="mf72-row"><button type="button" disabled={!chosen.length||!!busy} onClick={importLibrary}>Læs valgte PDF’er</button><button type="button" onClick={()=>setLibrary(null)}>Luk</button></div></div>}
      {messages.map((m,i)=><article key={i} className="mf72-chat-message" data-role={m.role}>{m.text}{m.sources?.map((s,j)=><div className="mf72-source-card" key={`${s.documentId}-${s.page}`}><strong>{j+1}. {s.title}</strong><blockquote>{s.text.slice(0,800)}{s.text.length>800?'…':''}</blockquote><button type="button" onClick={()=>openSource(s)}>Åbn kilde · side {s.page} ↗</button></div>)}</article>)}
      {busy&&<p className="mf72-muted" role="status">{busy}</p>}{notice&&<p className="mf72-error" role="alert">{notice}</p>}
    </div><form className="mf72-chat-compose" onSubmit={send}><div className="mf72-row"><button type="button" onClick={attachContext}>▣ Se min visning</button><button type="button" disabled={!!busy} onClick={()=>upload.current.click()}>+ PDF</button><button type="button" disabled={!!busy||!userId} onClick={openLibrary}>Bibliotek</button>{navigator.mediaDevices?.getDisplayMedia&&<button type="button" onClick={captureScreen} title="Vælg selv hvilken fane eller skærm der skal fotograferes">Skærmbillede</button>}</div><input ref={upload} type="file" accept="application/pdf" hidden multiple onChange={e=>{importFiles([...e.target.files]);e.target.value='';}}/>
      {context&&<details className="mf72-context"><summary>Appvisning vedhæftet · {context.at}</summary><p className="mf72-muted">Kun synlig tekst fra appen. Gennemse før du stiller dit spørgsmål.</p><pre>{context.text||'Ingen synlig tekst fundet.'}</pre><button type="button" onClick={()=>setContext(null)}>Fjern visning</button></details>}{screen&&<details className="mf72-context" open><summary>Skærmbillede vedhæftet</summary><img alt="Dit valgte skærmbillede" src={screen}/><button type="button" onClick={()=>setScreen(null)}>Fjern billede</button></details>}
      <textarea aria-label="Spørg Dr. Byte" placeholder="Søg eller stil et spørgsmål…" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(e);}}}/><div className="mf72-row"><small style={{flex:1}}>Lokal kildesøgning · AI afventer opsætning</small><button type="submit" disabled={!question.trim()||!!busy} className="mf72-primary">Søg i kilder ↗</button></div>
    </form>{viewer&&<div role="dialog" aria-modal="true" aria-label="PDF-kilde" className="mf72-pdf-view"><header><strong>{viewer.title} · side {viewer.page}</strong><a href={`${viewer.url}#page=${viewer.page}`} target="_blank" rel="noreferrer">Åbn separat</a><button type="button" onClick={closeSource}>Luk kilde</button></header><PdfSource72 key={viewer.url} bytes={viewer.bytes} initialPage={viewer.page} loadPdfJs={loadPdfJs}/></div>}
  </section>;
}

const GUIDE72=[
  {title:'Et roligt sted at starte.',intro:'Hjem samler din kalender og dine genveje. Du vælger selv, hvad du vil arbejde med — appen beslutter ikke for dig.',tag:'OVERBLIK',rows:[['I dag','Din kalender'],['Dit modul','Pensum og forelæsninger'],['Fortsæt','På dine præmisser']]},
  {title:'Vælg et dæk. Find din rytme.',intro:'Blå tal er nye kort, røde tal er kort i læring, og grønne tal er repetition. Åbn et dæk, se fordelingen og vælg din session. Historik findes ved det lille ur ved fanen.',tag:'FLASHKORT',rows:[['Nye kort','12'],['I læring','4'],['Klar til repetition','28']]},
  {title:'Se svaret, når du er klar.',intro:'Tænk over spørgsmålet, og tryk Vis svar eller mellemrum. Vurder derefter Igen, Svær, God eller Nem. Vurderingen styrer, hvornår kortet kommer igen. Z fortryder den seneste vurdering.',tag:'TRÆNING',rows:[['Forside','Hvad husker du?'],['Bagside','Tryk for at vende'],['Igen · Svær · God · Nem','1 · 2 · 3 · 4']]},
  {title:'Gør kortene til dine egne.',intro:'Opret og redigér med formatering, billeder og cloze. Billedkort skjuler områder, du selv tegner. Din rettelse af et fælles kort gemmes som din personlige udgave.',tag:'KORTEDITOR',rows:[['B  I  U','16 px'],['Forside / bagside','Dit indhold'],['Billedkort','Tegn · flyt · tilpas']]},
  {title:'Ét skema. Mere plads.',intro:'Kalenderen samler undervisning, studieplan og dine egne aftaler. Brug lagknapperne til at vise netop det, du har brug for. Skemaændringer ændrer ikke automatisk din private studieplan.',tag:'KALENDER',rows:[['SDU-skema','Undervisning'],['Studieplan','Din forberedelse'],['Egne events','Dine aftaler']]},
  {title:'Pensum og noter, side om side.',intro:'I Pensum finder du forelæsninger og deres materialer. Åbn en PDF, og brug noter ved siden af dokumentet. I Planlægning kan du selv samle din læsning og repetition i en studieplan.',tag:'PENSUM & PLANLÆGNING',rows:[['Forelæsning','Materialer samlet'],['Noter','Skriv med egne ord'],['Studieplan','Du vælger rammerne']]},
  {title:'Øv dig på hele sammenhængen.',intro:'Eksamenssæt samler opgaver, originalfiler og dine forsøg. Vælg et sæt og den visning, du vil bruge. Det lille ur ved fanen åbner historikken, så du kan vende tilbage til tidligere besvarelser.',tag:'EKSAMENSSÆT',rows:[['Original PDF','Læs hele opgaven'],['Træning','Arbejd med svarene'],['Historik','Find dine tidligere forsøg']]},
  {title:'Kilder tæt på dit spørgsmål.',intro:'Dr. Byte kan søge i PDF-tekst og vise sidereferencer. Du vælger selv de PDF’er og den appvisning, der vedhæftes. AI-svar kommer, når API’en er tilsluttet. Du kan altid vende tilbage til denne guide i profilmenuen.',tag:'DR. BYTE & HJÆLP',rows:[['PDF-bibliotek','Vælg dine kilder'],['Se min visning','Kun når du vælger det'],['Spørgsmål & svar','Hjælpen er her']]},
];
const FAQ72=[
  ['Hvordan kommer jeg i gang med flashkort?','Åbn Træning → Flashkort. Åbn modulet, vælg et dæk og tryk Start træning. Du kan selv tilpasse antal kort og kortpuljen inden start.'],
  ['Hvad betyder de blå, røde og grønne tal?','Blå viser nye kort. Rød viser kort i læring eller genlæring. Grøn viser repetition. Antallet i en session kan være mindre end dækkets samlede antal: kort kan være planlagt til en senere dag.'],
  ['Hvad betyder Igen, Svær, God og Nem?','Igen betyder, at du ikke kunne huske svaret. Svær betyder, at du huskede det med besvær. God betyder, at du huskede det normalt. Nem betyder, at svaret kom uden besvær. Brug din egen vurdering.'],
  ['Kan jeg fortryde en vurdering?','Ja. Tryk Fortryd eller Z under flashkorttræning. Også afslutningsskærmen har Fortryd sidste, så det seneste kort kan tages igen.'],
  ['Hvor er historikken?','Tryk på det lille ur ved Flashkort eller Eksamenssæt. Flashkort viser træningshistorik. I Eksamenssæt kan du vælge sættet og se dine tidligere forsøg.'],
  ['Hvordan redigerer jeg skrift og billeder?','Tryk Redigér på et kort. Markér tekst og brug formateringslinjen til skriftstørrelse, fed, kursiv, farve, lister og mere. Indsæt billeder med billedknappen, fra udklipsholderen eller ved at trække en billedfil ind i feltet.'],
  ['Hvordan laver jeg billedkort?','Vælg Billedkort i editoren, vælg et billede og træk over de områder, som skal skjules. Markeringer kan flyttes, slettes og tilpasses i hjørnet. Vælg Skjul alle eller Skjul én, og kontrollér resultatet i forhåndsvisningen.'],
  ['Bliver mine rettelser synlige for alle?','Personlige flashkort og rettelser gemmes for din bruger. Rettelser af et fælles kort overskriver ikke originalen for andre brugere. Synkronisering kræver login, forbindelse og de tilhørende Supabase-tabeller.'],
  ['Hvorfor er et kort ikke klar endnu?','Repetitionssystemet planlægger kort ud fra dine vurderinger. Et kort med en fremtidig dato vises ikke nødvendigvis i dagens kø. Du kan vælge en anden kortpulje i Tilpas session.'],
  ['Hvilken tid vises i flashkort?','Flashkort registrerer aktiv træningstid. Tiden pauses, når fanen er skjult, vinduet mister fokus eller korteditoren er åben. Afsluttede sessioner har en fast sluttid. Et separat fokusur er ikke det samme som flashkort-sessionens tid.'],
  ['Hvorfor mangler der tekst fra en PDF?','Tekstbaserede PDF’er kan søges lokalt. Scannede sider kan bestå af billeder uden tekstlag og kræver OCR. OCR og AI-svar er ikke tilsluttet i denne version. PDF’er på over 25 MB eller 1.000 sider skal deles op.'],
  ['Kan Dr. Byte se min skærm automatisk?','Nej. Se min visning vedhæfter den synlige tekst i appen, og Skærmbillede lader dig selv vælge en fane eller skærm via browseren. Vedhæftningen kan gennemses og fjernes. Intet sendes til en AI-tjeneste i denne version.'],
  ['Hvor opbevares PDF’er i Dr. Byte?','PDF-biblioteket gemmes lokalt i browseren for din bruger på denne enhed. Det bruges til at finde kilder, ikke til at træne en model. Fjern filer fra biblioteket, hvis de ikke skal opbevares.'],
  ['Ændres min studieplan automatisk ved nyt skema?','Nej. SDU-skema og private planaktiviteter er forskellige lag. Et opdateret undervisningsskema kan give anledning til at gennemgå din plan, men valget er dit.'],
];

export function HelpCenter72({onFinish}) {
  const [tab,setTab]=useState('guide'),[step,setStep]=useState(0),[search,setSearch]=useState(''),[flipped,setFlipped]=useState(false),[contact,setContact]=useState({email:'',subject:'',message:''}),[status,setStatus]=useState('');
  const dialog=useRef(null),originalFocus=useRef(null);
  useEffect(()=>{originalFocus.current=document.activeElement;dialog.current?.focus();return()=>originalFocus.current?.focus?.();},[]);
  function keys(e){if(e.key==='Escape'){onFinish();return;}if(e.key==='Tab'){const list=[...dialog.current.querySelectorAll('button,input,textarea,select,[tabindex="0"]')].filter(x=>!x.disabled&&x.getClientRects().length);const first=list[0],last=list[list.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}}
  async function prepare(e){e.preventDefault();const text=`MedFLUEN · Henvendelse\nFra: ${contact.email}\nEmne: ${contact.subject}\n\n${contact.message}`;try{await navigator.clipboard.writeText(text);setStatus('Din besked er kopieret. Den er ikke sendt — administratorens e-mail er endnu ikke tilsluttet.');}catch{const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));a.href=url;a.download='MedFLUEN-henvendelse.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Din besked er hentet som tekstfil. Den er ikke sendt.');}}
  const slide=GUIDE72[step],filtered=FAQ72.filter(([q,a])=>`${q} ${a}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <div className="mf72 mf72-help-backdrop"><section ref={dialog} role="dialog" aria-modal="true" aria-label="Guide og hjælp" tabIndex={-1} className="mf72-help" onKeyDown={keys}>
    <header className="mf72-help-head"><span className="mf72-byte-icon" aria-hidden="true">✧</span><div><h2>Find dig til rette.</h2><small>MedFLUEN · Guide & hjælp</small></div><button type="button" onClick={onFinish} aria-label="Luk guide">×</button></header>
    <nav className="mf72-help-tabs" aria-label="Hjælp"><button type="button" aria-pressed={tab==='guide'} onClick={()=>setTab('guide')}>Kom godt i gang</button><button type="button" aria-pressed={tab==='faq'} onClick={()=>setTab('faq')}>Spørgsmål & svar</button></nav>
    <div className="mf72-help-body">{tab==='guide'?<><div className="mf72-tour" key={step}><div className="mf72-tour-copy"><small>{String(step+1).padStart(2,'0')} / {String(GUIDE72.length).padStart(2,'0')} · {slide.tag}</small><h2>{slide.title}</h2><p>{slide.intro}</p></div><div className="mf72-tour-art" aria-label="Interaktiv illustration">{slide.rows.map(([label,value],i)=><div className="mf72-demo-row" key={label}><span>{label}</span><strong style={step===1?{color:['#1665ea','#d34b61','#169569'][i]}:undefined}>{step===2&&i===1?(flipped?'Her er dit svar.':'•••'):value}</strong></div>)}{step===2&&<button type="button" onClick={()=>setFlipped(!flipped)}>{flipped?'Vend tilbage':'Prøv at vise svaret'}</button>}{step===GUIDE72.length-1&&<button type="button" onClick={()=>setTab('faq')}>Udforsk spørgsmål & svar ↗</button>}</div></div><div className="mf72-tour-controls"><button type="button" onClick={()=>step?setStep(step-1):onFinish()}>{step?'Tilbage':'Spring over'}</button><div className="mf72-tour-dots">{GUIDE72.map((_,i)=><button type="button" key={i} aria-label={`Trin ${i+1}`} aria-current={i===step?'step':undefined} onClick={()=>setStep(i)}/>)}</div><button type="button" className="mf72-primary" onClick={()=>step===GUIDE72.length-1?onFinish():setStep(step+1)}>{step===GUIDE72.length-1?'Åbn mit læringsrum':'Næste →'}</button></div></>:<><h2 style={{marginBottom:18}}>Et hurtigt svar.</h2><input className="mf72-faq-search" aria-label="Søg i hjælp" placeholder="Søg efter fx billedkort, kalender eller PDF…" value={search} onChange={e=>setSearch(e.target.value)}/>{filtered.length?filtered.map(([q,a])=><details className="mf72-faq" key={q}><summary>{q}</summary><p>{a}</p></details>):<p className="mf72-muted">Ingen spørgsmål matcher. Du kan skrive en besked nedenfor.</p>}
    <form className="mf72-contact" onSubmit={prepare}><h3>Har du et andet spørgsmål?</h3><p>Forbered en besked til administratorerne. E-mailafsendelse aktiveres, når kontaktadressen er tilføjet. Skriv ikke patientoplysninger eller følsomme persondata.</p><label>Din e-mail<input required type="email" autoComplete="email" value={contact.email} onChange={e=>setContact({...contact,email:e.target.value})}/></label><label>Emne<input required maxLength={160} value={contact.subject} onChange={e=>setContact({...contact,subject:e.target.value})}/></label><label>Din besked<textarea required maxLength={5000} value={contact.message} onChange={e=>setContact({...contact,message:e.target.value})}/></label><div className="mf72-row"><button type="submit">Kopiér besked</button><small>Ingen afsendelse endnu</small></div>{status&&<p role="status">{status}</p>}</form></>}
    </div>
  </section></div>;
}

export function ExperienceStyles72(){return <style>{`
/* Shared rhythm; precise surfaces rather than changing every generic div. */
.home-v2-workspace.home-v2-workspace{gap:22px!important;background:transparent!important;border:0!important;box-shadow:none!important;overflow:visible!important;grid-template-columns:minmax(0,1fr) 260px!important;align-items:start!important}
.home-v2-calendar-area.home-v2-calendar-area{background:var(--ui-panel);border:1px solid var(--ui-border)!important;border-radius:22px!important;overflow:hidden!important;padding:0!important;height:auto!important;min-width:0;box-shadow:0 10px 40px rgba(25,45,75,.05)!important}
.home-v2-rail.home-v2-rail{border:0!important;padding:0!important;background:transparent!important;gap:18px!important;display:grid!important;align-content:start!important}
.home-v2-rail>section,.home-v2-rail>div{border-radius:20px!important;box-shadow:0 6px 28px rgba(25,45,75,.04)!important}
.home-v2-calendar-area .calendar-topbar{padding:18px 20px!important;gap:14px!important}
.home-v2-calendar-area .home-v2-panel-header{padding:20px 22px!important;gap:18px!important;min-height:92px!important}
.home-v2-calendar-area>.calendar-control-strip{padding:14px 18px!important;gap:10px!important;flex-wrap:wrap!important}
.home-v2-rail .home-v2-rail-card{padding:22px!important}
.home-v2-calendar-area .home-v2-calendar-canvas{min-height:440px!important}
.calendar-workspace .calendar-topbar{gap:16px!important;padding:18px 22px!important}
.calendar-workspace .calendar-layer-controls,.home-v2-calendar-area .calendar-layer-controls{padding:12px 18px!important;gap:9px!important}
.calendar-workspace .calendar-main-layout{gap:22px!important}
.flashcard71-deck-row>.flashcard71-deck-count:nth-child(2){color:#1665ea!important}
.flashcard71-deck-row>.flashcard71-deck-count:nth-child(3){color:#d14961!important}
.flashcard71-deck-row>.flashcard71-deck-count:nth-child(4){color:#15956a!important}
.flashcard71-deck-head>span:nth-child(2){color:#1665ea!important}.flashcard71-deck-head>span:nth-child(3){color:#d14961!important}.flashcard71-deck-head>span:nth-child(4){color:#15956a!important}
.flashcard71-card-face h1,.flashcard71-card-answer>strong{font-weight:400!important}
.sidebar-nav-btn,.sidebar-nav-icon,.medfluen-area-tabs button{animation:none!important;transition:background-color .15s,color .15s,border-color .15s!important}
.sidebar-nav-btn:active,.medfluen-area-tabs button:active{transform:none!important}
.sidebar-tooltip{pointer-events:none!important}
.flashcard71-editor,.study-plan-card,.lecture-material-card,.exam-set-card{border-radius:20px}
.study-plan-workspace .study-plan-workspace-header,.lecture-own-note-toolbar,.exam-set-question-header{padding:18px 22px!important;gap:14px!important}
.study-plan-workspace .study-plan-workspace-body{gap:20px!important}
.study-plan-v4-shell .study-plan-v4-card,.plan-progress-table-card,.lecture-own-note-shell,.lecture-shared-note-shell,.exam-set-question-card{border:1px solid var(--ui-border)!important;border-radius:20px!important;box-shadow:0 10px 35px rgba(25,45,75,.045)!important}
.lecture-own-note-shell .lecture-note-section,.lecture-shared-note-section{padding:18px!important}
.exam-set-question-text,.lecture-shared-note-free-text{line-height:1.7!important;font-weight:400!important}
@media(max-width:1050px){.home-v2-workspace.home-v2-workspace{grid-template-columns:minmax(0,1fr)!important;gap:18px!important}.home-v2-rail.home-v2-rail{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))!important}}
@media(prefers-reduced-motion:reduce){.sidebar-nav-btn,.medfluen-area-tabs button{transition:none!important}}
`}</style>;}
