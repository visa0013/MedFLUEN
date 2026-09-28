import React, {useEffect,useRef,useState} from 'react';
import {Mark791} from './Workspace791';

const clamp=(value,fallback,max)=>Number.isFinite(Number(value))&&value!==undefined ? Math.max(1,Math.min(max,Math.round(Number(value)))) : fallback;
export function pomodoroSettings791(settings={}) {
  return {focus:clamp(settings.focus,25,180),pause:clamp(settings.pause,5,60),longPause:clamp(settings.longPause,15,120),longEvery:clamp(settings.longEvery,4,12)};
}

// A running block owns its duration. Changing the next block never rewrites earned time.
export function usePomodoro791({settings,onComplete}) {
  const config=pomodoroSettings791(settings),latest=useRef({config,onComplete});latest.current={config,onComplete};
  const [state,setState]=useState({phase:'idle',seconds:0,total:0,running:false,deadline:0,cycle:0});
  const finished=useRef(null);
  useEffect(()=>{
    if(!state.running)return undefined;
    const interval=window.setInterval(()=>setState(current=>current.running?{...current,seconds:Math.max(0,Math.ceil((current.deadline-Date.now())/1000))}:current),1000);
    return()=>window.clearInterval(interval);
  },[state.running,state.deadline]);
  useEffect(()=>{
    if(!state.running||state.seconds!==0||finished.current===state.deadline)return;
    finished.current=state.deadline;
    if(state.phase==='focus') {
      const cycle=state.cycle+1,{config:next,onComplete:complete}=latest.current;
      const long=cycle%next.longEvery===0,total=(long?next.longPause:next.pause)*60;
      setState({phase:long?'long-break':'break',seconds:total,total,running:true,deadline:Date.now()+total*1000,cycle});
      complete?.(state.total/60);
    } else setState(current=>({...current,phase:'idle',seconds:0,running:false,deadline:0}));
  },[state]);
  function start(phase='focus') {
    const total=(phase==='long-break'?config.longPause:phase==='break'?config.pause:config.focus)*60;
    finished.current=null;
    setState(current=>({...current,phase,seconds:total,total,running:true,deadline:Date.now()+total*1000}));
  }
  function toggle(){setState(current=>current.running?{...current,running:false,seconds:Math.max(0,Math.ceil((current.deadline-Date.now())/1000))}:{...current,running:true,deadline:Date.now()+current.seconds*1000});}
  function stop(){setState(current=>({...current,phase:'idle',running:false,seconds:0,deadline:0}));}
  return {...state,seconds:state.phase==='idle'?config.focus*60:state.seconds,start,toggle,stop};
}

const COPY={
  da:{title:'Fokus',settings:'Timerindstillinger',close:'Luk Pomodoro',focus:'Læsning',short:'Kort pause',long:'Lang pause',every:'Lang pause efter',blocks:'fokusblokke',min:'min',start:'Start fokus',pause:'Sæt på pause',resume:'Fortsæt',stop:'Stop',today:'I dag',week:'Denne uge',save:'Gem plan',name:'Navn på plan',plans:'Dine planer',remove:'Slet plan',back:'Tilbage',next:'Ændringer gælder næste blok.'},
  en:{title:'Focus',settings:'Timer settings',close:'Close Pomodoro',focus:'Focus',short:'Short break',long:'Long break',every:'Long break after',blocks:'focus blocks',min:'min',start:'Start focus',pause:'Pause',resume:'Resume',stop:'Stop',today:'Today',week:'This week',save:'Save plan',name:'Plan name',plans:'Your plans',remove:'Delete plan',back:'Back',next:'Changes apply to the next block.'},
  ar:{title:'تركيز',settings:'إعدادات المؤقت',close:'إغلاق بومودورو',focus:'الدراسة',short:'استراحة قصيرة',long:'استراحة طويلة',every:'استراحة طويلة بعد',blocks:'جلسات تركيز',min:'دقيقة',start:'ابدأ التركيز',pause:'إيقاف مؤقت',resume:'متابعة',stop:'إيقاف',today:'اليوم',week:'هذا الأسبوع',save:'حفظ الخطة',name:'اسم الخطة',plans:'خططك',remove:'حذف الخطة',back:'رجوع',next:'التغييرات للجلسة التالية.'}
};
export function PomodoroPanel791({language='da',settings,timer,onSettings,savedPlans=[],onApplyPlan,onSavePlan,onDeletePlan,onClose,today='0 t',week='0 t'}) {
  const copy=COPY[language]||COPY.da,config=pomodoroSettings791(settings);
  const [editing,setEditing]=useState(false),[name,setName]=useState('');
  const active=timer.phase!=='idle',label=timer.phase==='long-break'?copy.long:timer.phase==='break'?copy.short:copy.focus;
  const seconds=timer.seconds,display=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  const save=()=>{onSavePlan?.(name);setName('');};
  return <div className="mf791-pomodoro" dir={language==='ar'?'rtl':'ltr'}>
    <header><strong>{editing?copy.settings:copy.title}</strong><div><button type="button" aria-label={editing?copy.back:copy.settings} aria-expanded={editing} onClick={()=>setEditing(value=>!value)}><Mark791 name={editing?'chevron':'tune'} size={16}/></button><button type="button" aria-label={copy.close} onClick={onClose}><Mark791 name="close" size={16}/></button></div></header>
    {editing?<section className="mf791-timer-settings">
      <div className="mf791-timer-fields">{[['focus',copy.focus,180],['pause',copy.short,60],['longPause',copy.long,120],['longEvery',copy.every,12]].map(([key,text,max])=><label key={key}><span>{text}</span><div><input name={key} type="number" min="1" max={max} value={config[key]} onChange={event=>onSettings?.({[key]:clamp(event.target.value,config[key],max)})}/><small>{key==='longEvery'?copy.blocks:copy.min}</small></div></label>)}</div>
      {active&&<p className="mf791-timer-hint">{copy.next}</p>}
      <div className="mf791-timer-save"><label><span>{copy.name}</span><input value={name} onChange={event=>setName(event.target.value)} onKeyDown={event=>{if(event.key==='Enter')save();}} /></label><button type="button" onClick={save}>{copy.save}</button></div>
      {savedPlans.length>0&&<div className="mf791-timer-plans"><small>{copy.plans}</small>{savedPlans.map(plan=><div key={plan.id}><button type="button" onClick={()=>onApplyPlan?.(plan)}><span>{plan.name}</span><small>{plan.focus} / {plan.pause} {copy.min}</small></button><button type="button" aria-label={`${copy.remove}: ${plan.name}`} onClick={()=>onDeletePlan?.(plan.id)}><Mark791 name="close" size={12}/></button></div>)}</div>}
    </section>:<>
      <div className="mf791-timer-face" data-phase={timer.phase}><small>{label}{active&&!timer.running?` · ${copy.pause}`:''}</small><strong role="timer" aria-label={label}>{display}</strong><span>{config.focus} / {config.pause} / {config.longPause} {copy.min} · {config.longEvery} {copy.blocks}</span></div>
      <div className="mf791-timer-stats"><span>{copy.today}<strong>{today}</strong></span><span>{copy.week}<strong>{week}</strong></span></div>
    </>}
    <footer>{active?<><button type="button" className="mf791-timer-primary" onClick={timer.toggle}>{timer.running?copy.pause:copy.resume}</button><button type="button" className="mf791-timer-stop" onClick={timer.stop}>{copy.stop}</button></>:<button type="button" className="mf791-timer-primary" onClick={()=>timer.start()}><Mark791 name="play" size={14}/>{copy.start}</button>}</footer>
  </div>;
}
