import React,{useId,useState} from 'react';
import {appearance75,resolvedTheme75,palette75} from './appearance75-model';
import {AccentEditor75} from './Appearance75';
import {pomodoroSettings791} from './Pomodoro791';
import {Mark791} from './Workspace791';
import './settingsPanel793.css';

export function saveFocusSettings793(storage,key,current,patch){
 let stored=current;
 const raw=storage.getItem(key);
 if(raw){try{const parsed=JSON.parse(raw);if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))stored=parsed;}catch{}}
 const next={...stored,...pomodoroSettings791({...stored,...patch})};
 storage.setItem(key,JSON.stringify(next));
 return next;
}

export function Settings793({appearance,language='da',timerSettings,onTimerChange,timerError='',onClose}) {
 const [section,setSection]=useState('appearance'),[confirm,setConfirm]=useState(false),id=useId();
 const en=language==='en',ar=language==='ar',tr=(da,eng,arabic)=>ar?(arabic||eng):en?eng:da;
 const v=appearance75(appearance.value),change=appearance.set,timer=pomodoroSettings791(timerSettings);
 const previewTheme=appearance.theme||resolvedTheme75(v.mode,Boolean(window.matchMedia?.('(prefers-color-scheme: dark)').matches));
 const previewPalette=palette75({},v.accent,previewTheme,v.customAccent,v.surface);
 const saveError=appearance.error||timerError;
 const tabs=[['appearance','tune',tr('Udseende','Appearance','المظهر')],['reading','book',tr('Læsning','Reading','القراءة')],['navigation','cards',tr('Navigation','Navigation','التنقل')],['focus','play',tr('Fokus','Focus','التركيز')]];
 const titles={appearance:tr('Et roligt udgangspunkt','A calm starting point','مساحة هادئة'),reading:tr('Gør teksten din','Make the text yours','نص يناسبك'),navigation:tr('Plads til dit overblik','Room for your overview','مساحة للتنقل'),focus:tr('Din rytme, dine pauser','Your rhythm, your breaks','إيقاعك واستراحاتك')};
 function choices(field,label,items){return <fieldset className="mf793-choice"><legend>{label}</legend><div>{items.map(([value,title])=><label key={value}><input type="radio" name={`${id}-${field}`} checked={v[field]===value} onChange={()=>change({[field]:value})}/><span>{field==='accent'&&<i data-accent={value} style={value==='custom'?{background:v.customAccent}:undefined} aria-hidden="true"/>}{title}<b aria-hidden="true">✓</b></span></label>)}</div></fieldset>;}
 function toggle(label,hint,checked,fn){return <div className="mf793-toggle-row"><span><strong>{label}</strong><small>{hint}</small></span><button type="button" role="switch" aria-label={label} aria-checked={checked} onClick={fn}><i/></button></div>;}
 const preview=<aside className="mf793-preview" aria-label={tr('Forhåndsvisning af læsning','Reading preview','معاينة القراءة')} data-settings-preview data-mode={previewTheme} data-surface={v.surface} data-accent={v.accent} data-contrast={v.contrast} style={{'--reading-size':`${v.questionSize}px`,'--reading-leading':v.lineHeight,'--preview-bg':previewPalette.panel,'--preview-ink':previewPalette.text,'--preview-soft':previewPalette.secondary,'--preview-accent':previewPalette.blue,'--preview-border':previewPalette.border}}><div className="mf793-preview-meta"><span>{tr('FORHÅNDSVISNING','LIVE PREVIEW','معاينة')}</span><i aria-hidden="true"/></div><small>NEUROLOGI / N4</small><h3>{tr('Hvad er aktiv genkaldelse?','What is active recall?','ما الاستدعاء النشط؟')}</h3><p>{tr('At hente et svar frem fra hukommelsen, før du ser løsningen.','Retrieving an answer from memory before you look at the solution.','استرجاع الإجابة من الذاكرة قبل النظر إلى الحل.')}</p><div className="mf793-preview-answer">{tr('Vis svar','Show answer','إظهار الإجابة')}<kbd>⌴</kbd></div></aside>;
 return <div className="mf793-settings" dir={ar?'rtl':undefined}>
  <header className="mf793-header"><div><small>MEDFLUEN / {tr('DIT STUDIERUM','YOUR WORKSPACE','مساحتك')}</small><h2>{tr('Indstillinger','Settings','الإعدادات')}</h2></div><button type="button" className="mf793-close" aria-label={tr('Luk indstillinger','Close settings','إغلاق الإعدادات')} onClick={onClose}><Mark791 name="close"/></button></header>
  <div className="mf793-body"><nav className="mf793-sidebar" aria-label={tr('Indstillingsområder','Settings categories','فئات الإعدادات')}>{tabs.map(([key,icon,title])=><button key={key} type="button" id={`${id}-${key}`} aria-pressed={section===key} onClick={()=>{setSection(key);setConfirm(false);}}><Mark791 name={icon} size={19}/><span>{title}</span><span className="mf793-nav-arrow" aria-hidden="true">›</span></button>)}</nav>
   <section className="mf793-content" aria-labelledby={`${id}-${section}`}><header><small>{tabs.find(t=>t[0]===section)[2]}</small><h3>{titles[section]}</h3></header>
    {section==='appearance'&&<><div className="mf793-option-grid"><div>
     {choices('mode',tr('Tema','Theme','السمة'),[['light',tr('Lyst','Light','فاتح')],['dark',tr('Mørkt','Dark','داكن')],['system',tr('System','System','النظام')]])}
     {choices('accent',tr('Accentfarve','Accent colour','اللون'),[['blue',tr('Blå','Blue','أزرق')],['green',tr('Grøn','Green','أخضر')],['violet',tr('Violet','Violet','بنفسجي')],['graphite',tr('Grafit','Graphite','رمادي')],['custom',tr('Egen farve','Custom','لون مخصص')]])}
     <AccentEditor75 value={v} onChange={change} language={language}/>
     {choices('surface',tr('Baggrund','Background','الخلفية'),[['paper',tr('Varmt papir','Warm paper','ورق دافئ')],['mist',tr('Blød dis','Soft mist','ضباب')],['white',tr('Hvid','White','أبيض')],['sand',tr('Sand','Sand','رملي')],['sage',tr('Salvie','Sage','مريمي')],['lavender',tr('Lavendel','Lavender','لافندر')]])}
    </div>{preview}</div>{toggle(tr('Tydeligere kontrast','Stronger contrast','تباين أعلى'),tr('Mere markante tekster og skillelinjer.','Stronger text and dividing lines.','نص وحدود أوضح.'),v.contrast==='high',()=>change({contrast:v.contrast==='high'?'standard':'high'}))}</>}
    {section==='reading'&&<><div className="mf793-option-grid"><div><fieldset className="mf793-size"><legend>{tr('Tekststørrelse på kort og spørgsmål','Card and question text size','حجم نص البطاقات والأسئلة')}</legend><div><span>Aa</span><output>{v.questionSize} px</output></div><input type="range" min="15" max="25" value={v.questionSize} aria-label={tr('Tekststørrelse på kort og spørgsmål','Card and question text size','حجم النص')} onChange={e=>change({questionSize:Number(e.target.value)})}/><small>{tr('PDF-sider bruger fortsat deres egen zoom.','PDF pages keep their own zoom.','تحتفظ صفحات PDF بالتكبير الخاص بها.')}</small></fieldset>
     {choices('lineHeight',tr('Linjeafstand i træning','Practice line spacing','تباعد الأسطر'),[[1.4,tr('Tæt','Tight','ضيق')],[1.6,tr('Normal','Normal','عادي')],[1.9,tr('Luftig','Airy','واسع')]])}
    </div>{preview}</div>{toggle(tr('Reducer bevægelse','Reduce motion','تقليل الحركة'),tr('Rolige overgange uden flyvende elementer. Systemets valg respekteres altid.','Calm transitions without moving elements. Your system setting is always respected.','تقليل الحركة مع احترام إعدادات النظام.'),v.motion==='reduce',()=>change({motion:v.motion==='reduce'?'system':'reduce'}))}</>}
    {section==='navigation'&&<>{choices('dock',tr('Navigationens placering','Navigation position','موضع التنقل'),[['left',tr('Venstre','Left','يسار')],['right',tr('Højre','Right','يمين')],['top',tr('Top','Top','أعلى')],['bottom',tr('Bund','Bottom','أسفل')]])}<p className="mf793-hint">{tr('På små skærme ligger navigationen i bunden, så knapperne er lette at nå.','On small screens navigation stays at the bottom for easy access.','يظهر التنقل أسفل الشاشات الصغيرة لتسهيل الوصول.')}</p>
     {choices('density',tr('Afstand i dæklister','Deck list spacing','تباعد قوائم البطاقات'),[['comfortable',tr('Luftig','Comfortable','واسع')],['compact',tr('Kompakt','Compact','مضغوط')]])}
     <div className="mf793-density-preview" data-density={v.density} aria-hidden="true">{['N1 · Intro til neurologi','N4 · Epilepsi','N7 · Neurofysiologi'].map(text=><span key={text}>{text}<i/></span>)}</div>
     </>}
    {section==='focus'&&<><p className="mf793-hint">{tr('Længderne gælder næste session. En session, der allerede kører, bliver ikke ændret.','Durations apply to your next session. A running session is not changed.','تطبق المدد على الجلسة التالية دون تغيير الجلسة الحالية.')}</p><div className="mf793-timer-grid">{[['focus',tr('Fokustid','Focus time','التركيز'),180],['pause',tr('Kort pause','Short break','استراحة قصيرة'),60],['longPause',tr('Lang pause','Long break','استراحة طويلة'),120],['longEvery',tr('Lang pause efter','Long break after','استراحة طويلة بعد'),12]].map(([key,label,max])=><label key={key}><span>{label}</span><div><input name={key} aria-label={label} type="number" min="1" max={max} value={timer[key]} onChange={e=>{const n=Number(e.target.value);if(e.target.value!==''&&Number.isFinite(n))onTimerChange?.({[key]:Math.max(1,Math.min(max,Math.round(n)))});}}/><small>{key==='longEvery'?tr('sessioner','sessions','جلسات'):tr('min','min','دقيقة')}</small></div></label>)}</div>
     {toggle(tr('Timelyd','Timer sound','صوت المؤقت'),tr('Et diskret signal, når din fokussession slutter.','A gentle signal when your focus session ends.','إشارة قصيرة عند انتهاء التركيز.'),v.timerSound,()=>change({timerSound:!v.timerSound}))}
     </>}
   </section></div>
  <footer className="mf793-footer"><div>{saveError&&<p role="alert">{saveError}</p>}<button type="button" className="mf793-reset-trigger" aria-label={tr('Gendan standard','Restore defaults','استعادة الإعدادات الافتراضية')} title={tr('Gendan standard','Restore defaults','استعادة الإعدادات الافتراضية')} onClick={()=>setConfirm(!confirm)} aria-expanded={confirm}><span aria-hidden="true">↺</span></button></div><button type="button" className="mf793-done" onClick={onClose}>{tr('Færdig','Done','تم')}<span aria-hidden="true">↗</span></button></footer>
  {confirm&&<div className="mf793-reset" role="group" aria-label={tr('Bekræft gendannelse','Confirm restore','تأكيد الاستعادة')}><p>{tr('Gendan kun visningsvalg og timelyd? Dine kort, noter, fremgang og fokusplaner bevares.','Restore only display choices and timer sound? Cards, notes, progress and focus plans stay unchanged.','استعادة المظهر والصوت فقط؟ تبقى البطاقات والملاحظات والتقدم والخطط محفوظة.')}</p><div><button type="button" onClick={()=>setConfirm(false)}>{tr('Annuller','Cancel','إلغاء')}</button><button type="button" onClick={()=>{if(change(appearance75(null))!==false)setConfirm(false);}}>{tr('Ja, gendan mine visningsvalg','Yes, restore display choices','نعم، استعادة المظهر')}</button></div></div>}
 </div>;
}
