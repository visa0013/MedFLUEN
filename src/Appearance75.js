import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { appearance75, appearanceKey75, resolvedTheme75 } from './appearance75-model';
import './appearance75.css';

export function useCompletion75(onDone) {
  const finished = useRef(false);
  return () => {
    if (finished.current) return;
    finished.current = true;
    if (!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) window.dispatchEvent(new window.CustomEvent('medfluen-celebrate75'));
    onDone?.();
  };
}

export function Celebration75() {
  const [burst,setBurst] = useState(0);
  useEffect(() => {
    let timer;
    function clear() {window.clearTimeout(timer);setBurst(0);}
    function celebrate() {
      if(document.hidden || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
      window.clearTimeout(timer);setBurst(value=>value+1);timer=window.setTimeout(clear,1300);
    }
    const visibility=()=>{if(document.hidden)clear();};
    window.addEventListener('medfluen-celebrate75',celebrate);document.addEventListener('visibilitychange',visibility);
    return ()=>{window.clearTimeout(timer);window.removeEventListener('medfluen-celebrate75',celebrate);document.removeEventListener('visibilitychange',visibility);};
  },[]);
  if(!burst)return null;
  return createPortal(<div data-celebration75 aria-hidden="true" className="mf75-celebration" key={burst}>{Array.from({length:28},(_,index)=><i key={index} style={{'--x':`${(index%2?-1:1)*(70+(index*47)%420)}px`,'--y':`${-80-(index*29)%360}px`,'--r':`${(index*97)%540}deg`,'--delay':`${(index%4)*25}ms`,background:['#507dff','#76cbb4','#b09aee','#efbc6a'][index%4]}}/>)}</div>,document.body);
}

export function useAppearance75(owner) {
  const key = appearanceKey75(owner);
  const [stored, setStored] = useState(null), [error, setError] = useState('');
  const [dark, setDark] = useState(() => Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches));
  function read() { return appearance75(JSON.parse(window.localStorage.getItem(key) || 'null')); }
  useEffect(() => {
    function refresh() { try { setStored({ key, value: read() }); setError(''); } catch { setStored({key,value:appearance75(null)});setError('Udseendet kunne ikke læses fra browserlageret.'); } }
    refresh();
    const changed = event => { if (event.key === key) refresh(); };
    window.addEventListener('storage', changed);
    return () => window.removeEventListener('storage', changed);
    // The read function is scoped by key; avoid resubscribing on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!query) return;
    const changed = event => setDark(event.matches);
    query.addEventListener('change', changed);
    return () => query.removeEventListener('change', changed);
  }, []);
  const value = stored?.key === key ? stored.value : appearance75(null);
  return { value, theme: resolvedTheme75(value.mode, dark), error, set(patch) {
    try {
      const next = appearance75({ ...read(), ...patch });
      window.localStorage.setItem(key, JSON.stringify(next));
      setStored({key,value:next});setError('');return true;
    } catch {setError('Udseendet kunne ikke gemmes. Frigør plads i browserlageret og prøv igen.');return false;}
  } };
}

export function AppearanceSettings75({ value, onChange, language = 'da', error = '', compact = false }) {
  const en = language === 'en';
  const instance = useId();
  return <section className="mf75-appearance" aria-label={en ? 'Appearance' : 'Udseende'}>
    {[
      ['mode',en?'Theme':'Tema', [['light',en?'Light':'Lyst'],['dark',en?'Dark':'Mørkt'],['system','System']]],
      ['accent',en?'Accent':'Farve', [['blue',en?'Blue':'Blå'],['green',en?'Green':'Grøn'],['violet','Violet'],['graphite',en?'Graphite':'Grafit']]],
      ['surface',en?'Background':'Baggrund', [['paper',en?'Warm paper':'Varmt papir'],['mist',en?'Soft mist':'Blød dis'],['white',en?'White':'Hvid']]],
      ...(!compact ? [['dock',en?'Navigation position':'Navigationens placering',[['bottom',en?'Bottom':'Bund'],['top',en?'Top':'Top'],['left',en?'Left':'Venstre'],['right',en?'Right':'Højre']]]] : []),
    ].map(([field,label,choices]) => <fieldset key={field}><legend>{label}</legend><div>{choices.map(([id,title]) => <label key={id}><input type="radio" name={`appearance75-${instance}-${field}`} checked={value[field] === id} onChange={() => onChange({[field]:id})} /><span>{field==='accent' && <i aria-hidden="true" data-accent={id}/>} {title}</span></label>)}</div></fieldset>)}
    {!compact && <label className="mf75-orb-toggle"><input type="checkbox" checked={value.orb} onChange={event => onChange({orb:event.target.checked})} /><span>{en?'Show the Dr. Byte orb':'Vis Dr. Byte-orben'}</span></label>}
    {error && <p role="alert">{error}</p>}
    {!compact && <small>{en?'Saved on this device for this account.':'Gemmes på denne enhed for denne konto.'}</small>}
  </section>;
}

export function Dock75({ items, active, Icon, position = 'bottom', profileActions = [], profileOpen = false, setProfileOpen, onProfileAction, userInitial = 'M', displayName = '', moduleLabel = '', profileLabel = 'Profil', profileButtonRef, profileMenuRef, assistant, orb = true, adminMode = false }) {
  const ownButton = useRef(null), ownMenu = useRef(null), moreButton = useRef(null);
  const button = profileButtonRef || ownButton, menu = profileMenuRef || ownMenu;
  const [more, setMore] = useState(false), [rect, setRect] = useState({left:12,top:12}), [hidden, setHidden] = useState(document.hidden);
  const open = more || profileOpen;
  useEffect(() => {
    const changed = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange',changed);return () => document.removeEventListener('visibilitychange',changed);
  }, []);
  useEffect(() => {
    if (!open) return;
    const trigger = more ? moreButton.current : button.current;
    function locate() {
      if (!trigger || !menu.current) return;
      const box=trigger.getBoundingClientRect(), height=menu.current.offsetHeight, width=Math.min(260,window.innerWidth-24);
      const below = box.bottom+height+12 < window.innerHeight;
      setRect({left:Math.max(12,Math.min(box.right-width,window.innerWidth-width-12)),top:Math.max(12,below?box.bottom+10:box.top-height-10)});
    }
    locate();menu.current?.querySelector('button')?.focus();
    function close(restore) { setMore(false);setProfileOpen?.(false);if(restore)trigger?.focus(); }
    function pointer(event) { if (!menu.current?.contains(event.target) && !button.current?.contains(event.target) && !moreButton.current?.contains(event.target)) close(false); }
    function key(event) { if(event.key==='Escape'){event.preventDefault();close(true);} }
    document.addEventListener('pointerdown',pointer);document.addEventListener('keydown',key);window.addEventListener('resize',locate);
    return () => {document.removeEventListener('pointerdown',pointer);document.removeEventListener('keydown',key);window.removeEventListener('resize',locate);};
  }, [open,more,position,button,menu,setProfileOpen]);
  function action(fn) {setMore(false);setProfileOpen?.(false);fn?.();}
  const extra = [...items.slice(3), ...(assistant ? [assistant] : [])];
  return <>
    <nav data-tour="sidebar" className="mf75-dock" data-position={position} data-page-hidden={hidden} aria-label="Primær navigation">
      {items.map((item,index) => <button key={item.id} type="button" className={index>2?'mf75-dock-extra':''} aria-label={item.label} aria-current={item.id===active?'page':undefined} onClick={() => action(item.action)}><Icon name={item.icon} size={20}/>{item.badge>0&&<em>{item.badge>99?'99+':item.badge}</em>}<span className="mf75-dock-tip">{item.label}</span></button>)}
      {assistant && <button type="button" className="mf75-dock-extra" aria-label={assistant.label} aria-pressed={assistant.active} onClick={() => action(assistant.action)}>{orb?<span className="mf75-byte-orb" aria-hidden="true"/>:<Icon name={assistant.icon} size={20}/>}<span className="mf75-dock-tip">{assistant.label}</span></button>}
      <button ref={moreButton} className="mf75-dock-more" type="button" aria-label="Mere" aria-expanded={more} aria-haspopup="dialog" onClick={() => {setProfileOpen?.(false);setMore(value=>!value);}}><Icon name="more" size={20}/><span className="mf75-dock-tip">Mere</span></button>
      <span className="mf75-dock-separator" aria-hidden="true"/>
      <button ref={button} type="button" className="mf75-dock-profile" aria-label={profileLabel} aria-expanded={profileOpen} aria-haspopup="dialog" onClick={() => {setMore(false);setProfileOpen?.(!profileOpen);}}>{userInitial}{adminMode&&<i aria-label="Admin mode"/>}<span className="mf75-dock-tip">{profileLabel}</span></button>
    </nav>
    {open && createPortal(<div ref={menu} role="dialog" aria-label={more?'Mere navigation':profileLabel} className="mf75-dock-popup" style={rect}>
      {!more && <header><strong>{displayName}</strong>{moduleLabel&&<small>{moduleLabel}</small>}</header>}
      {more ? extra.map(item=><button key={item.id} type="button" onClick={()=>action(item.action)}><Icon name={item.icon} size={17}/>{item.label}</button>) : profileActions.map(([id,icon,label])=><button key={id} type="button" data-danger={id==='signout'} onClick={()=>action(()=>onProfileAction(id))}><Icon name={icon} size={17}/>{label}</button>)}
    </div>,document.body)}
  </>;
}
