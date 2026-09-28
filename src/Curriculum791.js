import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Mark791} from './Workspace791';
import {createPortal} from 'react-dom';
import {contentKind79} from './curriculum79-model';
import './annotations792.css';

const words=language=>language==='en'?{show:'Show lectures',sort:'Order',number:'Lecture order',date:'Date',result:(n,t)=>`${n} of ${t} shown`}:language==='ar'?{show:'عرض المحاضرات',sort:'الترتيب',number:'ترتيب المحاضرات',date:'التاريخ',result:(n,t)=>`${n} من ${t}`}: {show:'Vis forelæsninger',sort:'Rækkefølge',number:'Forelæsningsrækkefølge',date:'Dato',result:(n,t)=>`${n} af ${t} vises`};

export function CurriculumFilters791({filters,counts,filter,onFilter,sort,onSort,shown,total,language='da',simple=false}) {
  const w=words(language);
  const primary=filters.filter(item=>['all','reviewed','favorites','notReviewed'].includes(item.id));
  const filterSelect=<label><span>{w.show}</span><select aria-label={w.show} value={filter} onChange={e=>onFilter(e.target.value)}>{filters.map(item=><option key={item.id} value={item.id}>{item.label} · {counts[item.id] || 0}</option>)}</select></label>;
  return <div className="mf791-curriculum-filters">
    {simple?<><div className="mf791-curriculum-quick-filters" role="group" aria-label={w.show}>{primary.map(item=><button type="button" key={item.id} aria-pressed={filter===item.id} onClick={()=>onFilter(item.id)}>{item.label}<span>{counts[item.id]||0}</span></button>)}</div><details className="mf791-curriculum-more-filters"><summary>{language==='en'?'More filters':language==='ar'?'مرشحات إضافية':'Flere filtre'}{!primary.some(item=>item.id===filter)&&<span> · {filters.find(item=>item.id===filter)?.label}</span>}</summary>{filterSelect}</details></>:filterSelect}
    <div className="mf791-curriculum-filter-footer"><label><select aria-label={w.sort} value={sort} onChange={e=>onSort(e.target.value)}><option value="number">{w.number}</option><option value="date">{w.date}</option></select></label><small role="status">{w.result(shown,total)}</small></div>
  </div>;
}

export function useCurriculumNavigation791(initialReader=false) {
  const [page,setPage]=useState(initialReader?'reader':'overview');
  const headingRef=useRef(null),openerRef=useRef(null);
  const open=useCallback(opener=>{if(opener?.focus)openerRef.current=opener;setPage('reader');},[]);
  const back=useCallback(()=>setPage('overview'),[]);
  useEffect(()=>{
    if(page==='reader')headingRef.current?.focus({preventScroll:true});
    else if(openerRef.current?.isConnected)openerRef.current.focus({preventScroll:true});
  },[page]);
  return {page,open,back,headingRef};
}

export function CurriculumHeading791({page,headingRef,onBack,lecture,moduleName,language='da'}) {
  const tr=(da,en,ar)=>language==='ar'?ar:language==='en'?en:da;
  return <div className="mf791-curriculum-heading">
    {page==='reader'?<button type="button" className="mf791-curriculum-back" onClick={onBack}><span aria-hidden="true">←</span>{tr('Forelæsninger','Lectures','المحاضرات')}</button>:<small>{moduleName}</small>}
    <div className="mf791-curriculum-title-row">{page==='reader'&&<span className="mf791-curriculum-code">{lecture?.id}</span>}<h1 ref={headingRef} tabIndex={-1}>{page==='reader'?lecture?.title:tr('Forelæsninger','Lectures','المحاضرات')}</h1></div>
    <p>{page==='reader'?lecture?.group:tr('Dit pensum. Vælg en forelæsning, og læs videre.','Your curriculum. Choose a lecture and start reading.','اختر محاضرة وابدأ القراءة.')}</p>
  </div>;
}

export function LectureStatus791({label,value,options,onChange}) {
  return <label className="mf791-lecture-status"><span>{label}</span><select aria-label={label} value={value} onChange={e=>onChange(e.target.value)}>{options.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}</select></label>;
}

export function LectureProgress791({selfStudyStatus,attendanceStatus,language='da',onChange,lectureId}) {
  const tr=(da,en,ar)=>language==='en'?en:language==='ar'?ar:da;
  const [open,setOpen]=useState(false),[position,setPosition]=useState({top:0,left:0});const trigger=useRef(null),menu=useRef(null);
  useEffect(()=>{if(!open)return;const outside=e=>{if(!trigger.current?.contains(e.target)&&!menu.current?.contains(e.target))setOpen(false);};const keys=e=>{if(e.key==='Escape'){e.preventDefault();setOpen(false);trigger.current?.focus();}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',keys,true);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',keys,true);};},[open]);
  const state=selfStudyStatus==='reviewed'?'reviewed':selfStudyStatus==='in-progress'?'in-progress':'not-started';
  const label=state==='reviewed'?tr('Gennemgået','Reviewed','تمت المراجعة'):state==='in-progress'?tr('I gang','In progress','قيد الدراسة'):tr('Mangler','Not started','لم تبدأ');
  const content=<><i aria-hidden="true">{state==='reviewed'?'✓':state==='in-progress'?'◐':'○'}</i>{label}</>;
  function toggle(){
    const r=trigger.current.getBoundingClientRect();
    const colors=getComputedStyle(trigger.current.closest('.mf791-app')||trigger.current);
    const theme=Object.fromEntries(['--mf79-surface','--mf79-ink','--mf79-ink-soft','--mf79-line'].map(key=>[key,colors.getPropertyValue(key).trim()]).filter(([,value])=>value));
    setPosition({...theme,left:Math.max(12,Math.min(r.right-190,window.innerWidth-202)),top:Math.max(12,Math.min(r.bottom+6,window.innerHeight-166))});setOpen(v=>!v);
  }
  return <span className="annotation791-lecture-progress" data-status={state}>{onChange?<button ref={trigger} type="button" aria-label={`${lectureId||''} · ${label}`} aria-haspopup="dialog" aria-expanded={open} onClick={toggle}>{content}</button>:<span>{content}</span>}{attendanceStatus==='attended'&&<small>{tr('Deltaget','Attended','حضرت')}</small>}{open&&createPortal(<div ref={menu} className="curriculum792-status-picker" role="dialog" aria-label={tr('Markér status','Change progress','تغيير الحالة')} style={position}><small>{lectureId} · {tr('Din fremgang','Your progress','تقدمك')}</small>{[['not-started',tr('Mangler','Not started','لم تبدأ')],['in-progress',tr('I gang','In progress','قيد الدراسة')],['reviewed',tr('Gennemgået','Reviewed','تمت المراجعة')]].map(([id,text])=><button type="button" key={id} data-status={id} aria-pressed={state===id} onClick={()=>{onChange(id);setOpen(false);trigger.current?.focus();}}><i aria-hidden="true">{id==='reviewed'?'✓':id==='in-progress'?'◐':'○'}</i>{text}{state===id&&<span aria-hidden="true">✓</span>}</button>)}</div>,document.fullscreenElement||document.body)}</span>;
}

export function CurriculumProgress791({rows=[],language='da',kind}) {
  if(kind)rows=rows.filter(row=>contentKind79(row.lecture)===kind);
  const tr=(da,en,ar)=>language==='en'?en:language==='ar'?ar:da;
  const completed=rows.filter(row=>row.selfStudyStatus==='reviewed').length;
  const started=rows.filter(row=>row.selfStudyStatus==='in-progress').length;
  const pending=rows.length-completed-started;
  return <section className="annotation791-curriculum-progress" aria-label={tr('Din fremgang i pensum','Curriculum progress','تقدمك في المنهج')}><div><strong>{completed} / {rows.length}</strong><span>{tr('gennemgået','reviewed','تمت مراجعتها')}</span><progress max={Math.max(1,rows.length)} value={completed} aria-label={tr('Gennemgået pensum','Reviewed curriculum','المنهج الذي تمت مراجعته')}/></div><dl>{[['reviewed',completed,tr('Gennemgået','Reviewed','تمت المراجعة')],['in-progress',started,tr('I gang','In progress','قيد الدراسة')],['not-started',pending,tr('Mangler','Not started','لم تبدأ')]].map(([id,n,label])=><div key={id} data-status={id}><dt>{label}</dt><dd>{n}</dd></div>)}</dl></section>;
}

export function MaterialDetails791({draft,onChange,types=[],labels={},children}) {
  const fields=<>{!(draft.mode==='upload'&&draft.files?.length>1)&&<label className="lecture-material-field"><span>{labels.name}</span><input type="text" value={draft.name||''} onChange={e=>onChange(current=>({...current,name:e.target.value}))}/></label>}<label className="lecture-material-field"><span>{labels.type}</span><select value={draft.materialType||'other'} onChange={e=>onChange(current=>({...current,materialType:e.target.value}))}>{types.map(type=><option key={type.id} value={type.id}>{type.label}</option>)}</select></label>{draft.mode==='upload'&&<label className="lecture-material-primary-choice"><input type="checkbox" checked={Boolean(draft.makePrimary)} onChange={e=>onChange(current=>({...current,makePrimary:e.target.checked}))}/><span><strong>{labels.primary}</strong><small>{labels.primaryHint}</small></span></label>}{children}</>;
  return draft.mode==='edit'?<div className="annotation791-material-options">{fields}</div>:<details className="annotation791-material-options"><summary>{labels.options||'Tilpas materiale'}</summary><div>{fields}</div></details>;
}

export function MaterialEmpty791({selected,title,onAdd,busy=false,language='da'}) {
  const tr=(da,en,ar)=>language==='ar'?ar:language==='en'?en:da;
  return <div className="mf791-material-empty"><div className="mf791-material-empty-copy"><span className="mf791-material-symbol" aria-hidden="true"><Mark791 name="book" size={28}/></span><small>{tr('FORELÆSNINGSMATERIALE','LECTURE MATERIAL','مواد المحاضرة')}</small><h2>{selected?tr('En plads til dit materiale.','A place for your material.','مكان لموادك.'):tr('Vælg en forelæsning.','Select a lecture.','اختر محاضرة.')}</h2><p>{selected?tr('Tilføj en PDF eller andre dokumenter til denne forelæsning.','Add a PDF or other documents to this lecture.','أضف ملف PDF أو مستندات أخرى لهذه المحاضرة.'):tr('Åbn en forelæsning fra oversigten for at se dens materiale.','Open a lecture from the list to see its material.','افتح محاضرة من القائمة لعرض موادها.')}</p>{selected&&<button type="button" className="mf791-material-add" disabled={busy} onClick={onAdd}><Mark791 name="plus" size={16}/>{tr('Tilføj materiale','Add material','أضف مادة')}</button>}</div></div>;
}
