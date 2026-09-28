import React,{useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Mark791} from './Workspace791';
import {studyActivity791} from './studytools791-model';
import './helpSession791.css';

export function Dialog791({children,onClose,size='default',title='Dialog',className=''}) {
  const dialog=useRef(null),close=useRef(onClose);close.current=onClose;
  useEffect(()=>{
    const previous=document.activeElement;
    const focusable=()=>[...dialog.current.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(e=>!e.closest('[hidden]'));
    (focusable()[0]||dialog.current).focus();
    function key(event){
      const modals=document.querySelectorAll('[aria-modal="true"]');
      if(modals[modals.length-1]!==dialog.current)return;
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close.current?.();}
      if(event.key==='Tab'){const list=focusable(),first=list[0],last=list[list.length-1];if(!first){event.preventDefault();return;}if(event.shiftKey&&(document.activeElement===first||document.activeElement===dialog.current)){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
    }
    document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('keydown',key);if(previous?.isConnected)previous.focus();};
  },[]);
  const content=<div className="ui-modal-backdrop mf791-dialog-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose?.();}}><section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} className={`ui-modal-surface mf791-dialog ${className}`} data-size={size}>{children}</section></div>;
  const frame=document.querySelector('.mf791-app');
  return frame ? createPortal(content,frame) : content;
}

export function SessionOptions791({name,preferences,onPreference,sessionCount,onStart,onClose,language='da'}) {
  const tr=(da,en,ar)=>language==='ar'?ar:language==='en'?en:da;
  const copy={title:tr('Tilpas træning','Customize session','تخصيص التدريب'),all:tr('Alle','All','الكل')};
  const [advanced,setAdvanced]=useState(false),[limitDraft,setLimitDraft]=useState(()=>String(preferences.limit==='all'?20:preferences.limit||20));
  useEffect(()=>{if(preferences.limit!=='all')setLimitDraft(String(preferences.limit||20));},[preferences.limit]);
  const cardLimit=value=>Math.max(1,Math.min(500,Math.round(Number(value)||20)));
  function changeLimit(value){setLimitDraft(value);if(value.trim()!==''&&Number.isFinite(Number(value)))onPreference({limit:Math.max(1,Math.min(500,Math.round(Number(value))))});}
  function finishLimit(){setLimitDraft(String(preferences.limit==='all'?cardLimit(limitDraft):preferences.limit||20));}
  const advancedPools=[
    ['due',tr('Kun klar','Due cards','البطاقات المستحقة'),tr('Planlagt repetition og kort i læring.','Scheduled reviews and learning cards.','المراجعات المجدولة وبطاقات التعلم.')],
    ['review',tr('Repetition','Review','مراجعة'),tr('Kun repetitionskort, der er klar.','Only review cards that are due.','بطاقات المراجعة المستحقة فقط.')],
    ['learning',tr('I læring','Learning','قيد التعلم'),tr('Kort du er ved at lære.','Cards you are currently learning.','بطاقات تتعلمها حالياً.')],
  ];
  const selectedAdvancedPool=advancedPools.find(([value])=>value===preferences.pool)?.[1];
  const group=(field,title,options)=> <fieldset><legend>{title}</legend><div className="mf791-option-grid">{options.map(([value,label,description])=><label key={value} data-selected={preferences[field]===value}><input type="radio" name={`session791-${field}`} value={value} checked={preferences[field]===value} onChange={()=>onPreference({[field]:value})}/><span><strong>{label}</strong>{description&&<small>{description}</small>}</span></label>)}</div></fieldset>;
  return <Dialog791 onClose={onClose} title={copy.title} size="large" className="mf791-session-options">
    <header className="mf791-dialog-heading"><div><small>{name}</small><h2>{copy.title}</h2></div><button aria-label={tr('Luk','Close','إغلاق')} onClick={onClose}><Mark791 name="close"/></button></header>
    <div className="mf791-session-layout"><div className="mf791-session-fields">
      {group('pool',tr('Hvilke kort?','Which cards?','أي بطاقات؟'),[
        ['mixed',tr('Klar + nye','Ready + new','جاهزة وجديدة'),tr('Planlagte repetitioner først.','Scheduled reviews first.','المراجعات المجدولة أولاً.')],
        ['new',tr('Nye kort','New cards','بطاقات جديدة'),tr('Kort du ikke har gennemgået.','Cards you have not studied.','بطاقات لم تدرسها بعد.')],
        ['all',tr('Hele dækket','Whole deck','المجموعة كاملة'),tr('Inkluderer også senere repetitioner.','Includes future reviews.','تشمل المراجعات المستقبلية.')],
      ])}
      <fieldset><legend>{tr('Sessionens længde','Session length','طول الجلسة')}</legend><div className="mf791-session-length"><label><input type="radio" name="session791-length" value="limited" checked={preferences.limit!=='all'} onChange={()=>onPreference({limit:cardLimit(limitDraft)})}/>{tr('Antal kort','Card count','عدد البطاقات')}</label><input aria-label={tr('Antal kort','Card count','عدد البطاقات')} type="number" min="1" max="500" disabled={preferences.limit==='all'} value={limitDraft} onChange={e=>changeLimit(e.target.value)} onBlur={finishLimit} onKeyDown={event=>{if(event.key==='Enter'){event.preventDefault();event.currentTarget.blur();}}}/><label><input type="radio" name="session791-length" value="all" checked={preferences.limit==='all'} onChange={()=>onPreference({limit:'all'})}/>{copy.all}</label></div></fieldset>
      <button type="button" className="mf791-session-more" aria-expanded={advanced} aria-controls="session791-advanced" onClick={()=>setAdvanced(value=>!value)}><Mark791 name="tune" size={17}/><span className="mf791-session-more-label">{tr('Flere indstillinger','More settings','إعدادات إضافية')}{selectedAdvancedPool&&<small>{tr('Valgt:','Selected:','المحدد:')} {selectedAdvancedPool}</small>}</span><span className="mf791-session-more-indicator" aria-hidden="true">{advanced?'−':'+'}</span></button>
      <div id="session791-advanced" hidden={!advanced}>
      {group('pool',tr('Flere kortpuljer','More card pools','مجموعات بطاقات إضافية'),advancedPools)}
      {group('studyMode',tr('Sådan træner du','Study format','طريقة التدريب'),[
        ['flashcard',tr('Flashkort','Flashcards','بطاقات'),tr('Tænk svaret, vend kortet og vurder det.','Think, reveal, then rate your recall.','فكر، ثم اكشف وقيّم تذكرك.')],
        ['recall',tr('Skriv svaret','Written recall','اكتب الإجابة'),tr('Formulér svaret før du ser facit.','Write your answer before revealing it.','اكتب إجابتك قبل كشف الحل.')],
        ['exam',tr('MCQ','MCQ','اختيار متعدد'),tr('Kun kort med svarmuligheder.','Only multiple-choice cards.','بطاقات الاختيار المتعدد فقط.')],
      ])}
      {group('order',tr('Rækkefølge','Order','الترتيب'),[
        ['scheduler',tr('Efter repetitionsplan','Scheduled','حسب الجدول')],['mixed',tr('Blandet','Mixed','مختلطة')],['deck',tr('Dækkets rækkefølge','Deck order','ترتيب المجموعة')],
      ])}
      </div>
    </div><aside className="mf791-session-preview" data-session-preview aria-live="polite"><small>{tr('DIN SESSION','YOUR SESSION','جلستك')}</small><strong>{sessionCount}</strong><span>{tr('kort er klar med dine valg','cards match your choices','بطاقة تطابق اختياراتك')}</span><p>{tr('Valgene gemmes til næste session. Kortenes fremgang og repetitionsdatoer ændres ikke, før du træner.','Your choices are remembered. Card progress and due dates stay unchanged until you study.','تُحفظ اختياراتك. لن يتغير تقدم البطاقات ومواعيدها حتى تبدأ التدريب.')}</p>{!sessionCount&&<p role="status">{tr('Prøv “Nye kort” eller “Hele dækket”, eller vælg et andet dæk.','Try New cards or Whole deck, or select another deck.','جرّب البطاقات الجديدة أو المجموعة كاملة، أو اختر مجموعة أخرى.')}</p>}<button className="mf791-start" disabled={!sessionCount} onClick={onStart}><Mark791 name="play" size={16}/>{tr('Start session','Start session','ابدأ الجلسة')}</button><button className="mf791-text-button" onClick={onClose}>{tr('Tilbage til dæk','Back to decks','العودة للمجموعات')}</button></aside></div>
  </Dialog791>;
}

export function StudyActivity791({events=[],now=Date.now(),onBrowse,language='da'}) {
  const tr=(da,en,ar)=>language==='ar'?ar:language==='en'?en:da;
  const summary=studyActivity791(events,now);
  const locale=language==='en'?'en-GB':language==='ar'?'ar':'da-DK';
  const recent=summary.days.filter(day=>day.count>0).reverse().slice(0,3);
  return <section className="mf791-study-activity" aria-label={tr('Dit aktivitetsoverblik','Your study activity','نشاط دراستك')}>
    <header><div><small>{tr('DE SENESTE 7 DAGE','LAST 7 DAYS','آخر 7 أيام')}</small><h3>{tr('Din læsning, i overblik','Your studying, at a glance','دراستك في لمحة')}</h3></div></header>
    <div className="mf791-activity-layout"><dl>{[[summary.reviews,tr('kort gennemgået','cards reviewed','بطاقات تمت مراجعتها')],[`${Math.round(summary.seconds/60)} min`,tr('aktiv korttræning','active card study','دراسة نشطة')],[`${summary.activeDays} / 7`,tr('dage med træning','days studied','أيام الدراسة')],[summary.comfortablePercent==null?'—':`${summary.comfortablePercent}%`,tr('vurderet God eller Nem','rated Good or Easy','قُيّمت جيدة أو سهلة')]].map(([value,label])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <div className="mf791-daily-goal"><small>{tr('I DAG','TODAY','اليوم')}</small><div data-today-reviews><strong>{summary.today}</strong><span>{tr('kort gennemgået','cards reviewed','بطاقات تمت مراجعتها')}</span></div><p>{tr('Dit overblik følger din faktiske træning — uden daglige kortmål.','Your overview reflects actual study, without daily card targets.','يعكس هذا الملخص دراستك الفعلية دون أهداف يومية للبطاقات.')}</p></div>
    <div className="mf791-recent-days"><small>{tr('GENBESØG DIN TRÆNING','REVISIT YOUR STUDYING','راجع دراستك')}</small>{recent.length?recent.map(day=><button key={day.date} data-reviewed-date={day.date} onClick={()=>onBrowse?.(day.date)}><span>{new Date(`${day.date}T12:00:00`).toLocaleDateString(locale,{weekday:'short',day:'numeric',month:'short'})}</span><strong>{day.count} {tr('kort','cards','بطاقة')}</strong><Mark791 name="arrow" size={15}/></button>):<p>{tr('Dine træningsdage vises her efter første session.','Your study days appear after your first session.','ستظهر أيام دراستك بعد جلستك الأولى.')}</p>}</div></div>
  </section>;
}
