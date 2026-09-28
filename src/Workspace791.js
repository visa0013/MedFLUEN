import React, { useEffect, useRef, useState } from 'react';

export function Mark791({name, size=20}) {
  const paths = {download:<><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/></>, arrow:<path d="M5 12h14m-6-6 6 6-6 6"/>, close:<path d="m6 6 12 12M6 18 18 6"/>, plus:<path d="M12 5v14M5 12h14"/>, book:<><path d="M12 6v14a5 5 0 0 0-4-1H3V4h5a4 4 0 0 1 4 2Z"/><path className="mf791-book-page" d="M12 6a4 4 0 0 1 4-2h5v15h-5a5 5 0 0 0-4 1Z"/></>, chevron:<path d="m8 5 7 7-7 7"/>, play:<path d="m7 4 13 8-13 8Z"/>, tune:<><path d="M4 7h16M4 17h16"/><circle className="mf791-tune-knob" cx="9" cy="7" r="2"/><circle className="mf791-tune-knob" cx="15" cy="17" r="2"/></>, cards:<><path className="mf791-card-back" d="M8 3h11a2 2 0 0 1 2 2v12"/><g className="mf791-card-front"><rect x="4" y="7" width="13" height="14" rx="2"/><path d="M8 12h5m-5 4h3"/></g></>};
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.book}</svg>;
}

export function FocusSymbol791({active=false}) {
  return <svg className="mf791-focus-symbol" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.5 5.5A9 9 0 1 0 21 12M12 7v5l-3 2"/>{active?<><path className="mf791-focus-flame" d="M18 2c1.8 2.2 3 3.5 3 5a3 3 0 0 1-6 0c0-1 .4-1.8 1-2.6.2 1 .8 1.4 1.1 1.6.7-.9 1-2.2.9-4Z" fill="currentColor" stroke="none"/><path className="mf791-focus-ember" d="M18 6c.8.9 1.2 1.5 1.2 2.1a1.2 1.2 0 0 1-2.4 0c0-.6.4-1.2 1.2-2.1Z" fill="var(--mf79-surface)" stroke="none"/></>:<path d="m17 3 3 1-1 3"/>}</svg>;
}

export function WorkspaceHeader791({name='', moduleControl, timer, language='da', area='home', entries=[], onSelect, onHome, profileActions=[], onProfileAction}) {
  const en=language==='en', ar=language==='ar';
  const tr=(da,enText,arText)=>ar?arText:en?enText:da;
  const [search,setSearch]=useState(false),[query,setQuery]=useState(''),[profile,setProfile]=useState(false);
  const searchButton=useRef(null),input=useRef(null),profileButton=useRef(null),profileWrap=useRef(null),dialog=useRef(null);
  useEffect(()=>{if(search)input.current?.focus();},[search]);
  useEffect(()=>{
    function key(e){
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearch(v=>!v);setProfile(false);}
      if(e.key==='Escape'){if(search){setSearch(false);searchButton.current?.focus();}if(profile){setProfile(false);profileButton.current?.focus();}}
      if(e.key==='Tab'&&search){const nodes=dialog.current?.querySelectorAll('input,button');if(!nodes?.length)return;const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    }
    function outside(e){if(!profileWrap.current?.contains(e.target))setProfile(false);}
    document.addEventListener('keydown',key);document.addEventListener('pointerdown',outside);
    return()=>{document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',outside);};
  },[search,profile]);
  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
  const results=entries.filter(e=>normalize(`${e.title} ${e.kind} ${e.code||''}`).includes(normalize(query))).slice(0,24);
  return <>
    <header className="mf791-utility" dir={ar?'rtl':'ltr'}>
      <button className="mf791-wordmark" onClick={onHome} aria-label={tr('MedFLUEN · Hjem','MedFLUEN · Home','MedFLUEN · الرئيسية')}>MedFLUEN</button>
      <div className="mf791-module">{moduleControl}</div>
      <div className="mf791-utility-actions">
        <button ref={searchButton} data-search-trigger className="mf791-search-trigger" onClick={()=>{setSearch(true);setProfile(false);}} aria-label={tr('Søg i MedFLUEN','Search MedFLUEN','ابحث في MedFLUEN')}><Mark791 name="search" size={18}/><span>{tr('Søg i MedFLUEN','Search MedFLUEN','ابحث في MedFLUEN')}</span><kbd>⌘ K</kbd></button>
        <div className="mf791-focus">{timer}</div>
        <div className="mf791-account" ref={profileWrap}>
          <button ref={profileButton} className="mf791-avatar" aria-label={tr('Profil og indstillinger','Profile and settings','الملف والإعدادات')} aria-expanded={profile} onClick={()=>setProfile(v=>!v)}>{name.trim().slice(0,1).toUpperCase()||'M'}<span aria-hidden="true">⌄</span></button>
          {profile&&<div className="mf791-account-menu" role="dialog" aria-label={tr('Din konto','Your account','حسابك')}><small>{tr('DIN KONTO','YOUR ACCOUNT','حسابك')}</small><strong>{name}</strong>{profileActions.map(([id,,label])=><button key={id} onClick={()=>{setProfile(false);onProfileAction?.(id);}}>{label}<Mark791 name="arrow" size={14}/></button>)}</div>}
        </div>
      </div>
    </header>
    {search&&<div className="mf791-search-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget){setSearch(false);searchButton.current?.focus();}}}><section ref={dialog} className="mf791-search-dialog" role="dialog" aria-modal="true" aria-label={tr('Find dit indhold','Find your content','ابحث عن محتواك')}><div className="mf791-search-input"><Mark791 name="search"/><input ref={input} type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr('Forelæsning, dæk eller arbejdsrum…','Lecture, deck or workspace…','محاضرة أو بطاقات أو مساحة…')} aria-label={tr('Søg','Search','بحث')}/><button onClick={()=>{setSearch(false);searchButton.current?.focus();}} aria-label={tr('Luk søgning','Close search','إغلاق البحث')}><Mark791 name="close"/></button></div><div className="mf791-search-results">{results.map(e=><button key={e.id} data-search-result onClick={()=>{setSearch(false);setQuery('');onSelect?.(e);searchButton.current?.focus();}}><span><small>{e.kind}{e.code?` / ${e.code}`:''}</small><strong>{e.title}</strong></span><Mark791 name="arrow"/></button>)}{!results.length&&<p>{tr('Ingen resultater. Prøv et andet emne.','No results. Try another topic.','لا توجد نتائج.')}</p>}</div></section></div>}
  </>;
}
