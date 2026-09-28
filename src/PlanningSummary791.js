import React,{useState} from 'react';
import './PlanningSummary791.css';

export function planCapacity791(strategy={}) {
  const required=Math.max(0,Number(strategy.requiredTotal)||0),available=Math.max(0,Number(strategy.capacityTotal)||0);
  return {requiredHours:required/60,availableHours:available/60,remainingHours:(available-required)/60,
    tone:strategy.unassigned?.length?'unplaced':required>available?'over':!available?'empty':'space'};
}
const locale791=language=>language==='en'?'en-GB':language==='ar'?'ar':'da-DK';
const hours791=(value,language)=>new Intl.NumberFormat(locale791(language),{maximumFractionDigits:1}).format(value);

export function PlanningSummary791({strategy,language='da'}) {
  const tr=(da,en,ar)=>language==='en'?en:language==='ar'?ar:da;
  const capacity=planCapacity791(strategy),max=Math.max(1,...(strategy.weeklyLoads||[]).map(week=>week.minutes));
  const detail=capacity.tone==='unplaced'?tr('Noget af dit pensum mangler en plads. Se indholdet nedenfor, før du gemmer.','Some content has no place. Check the items below before saving.','بعض المحتوى غير مجدول. راجعه أدناه قبل الحفظ.')
    :capacity.tone==='over'?tr(`${hours791(-capacity.remainingHours,language)} t mere end den tid, du har valgt.`,`${hours791(-capacity.remainingHours,language)} h beyond your available time.`,`${hours791(-capacity.remainingHours,language)} ساعة تتجاوز الوقت المتاح.`)
    :capacity.tone==='empty'?tr('Angiv læsetid i din normaluge for at få plads i planen.','Add study time to your normal week to make room in the plan.','أضف وقت دراسة إلى أسبوعك المعتاد.')
    :tr(`${hours791(capacity.remainingHours,language)} t er ikke disponeret i planen. Daglige timer og frister afgør, hvor indholdet kan placeres.`,`${hours791(capacity.remainingHours,language)} h remain unallocated. Daily hours and deadlines determine where content can fit.`,`${hours791(capacity.remainingHours,language)} ساعة غير مخصصة. تحدد ساعات كل يوم والمواعيد موضع المحتوى.`);
  return <section className="mf791-plan-summary" aria-label={tr('Planens tid og belastning','Plan time and workload','وقت الخطة وحجم العمل')}>
    <div className="mf791-plan-time" data-tone={capacity.tone}><div><small>{tr('TID I DIN PLAN','TIME IN YOUR PLAN','الوقت في خطتك')}</small><h2>{tr('Det skal der være plads til','Time your plan needs','الوقت الذي تحتاجه خطتك')}</h2></div><dl><div><dt>{tr('Planlagt indhold','Planned content','المحتوى المخطط')}</dt><dd>{hours791(capacity.requiredHours,language)} <span>{tr('t','h','س')}</span></dd></div><div><dt>{tr('Din tilgængelige tid','Your available time','وقتك المتاح')}</dt><dd>{hours791(capacity.availableHours,language)} <span>{tr('t','h','س')}</span></dd></div></dl><p>{detail}</p></div>
    <div className="mf791-plan-weeks"><header><h2>{tr('Ugebelastning','Weekly workload','حجم العمل الأسبوعي')}</h2><p>{tr('Faktisk planlagt tid, fordelt efter dine timer og fridage.','Actual planned time, based on your hours and days off.','الوقت المخطط الفعلي حسب ساعاتك وأيام الراحة.')}</p></header>
      {(strategy.weeklyLoads||[]).map(week=>{const start=new Date(`${week.weekStart}T12:00:00`),end=new Date(start);end.setDate(end.getDate()+6);const date=value=>value.toLocaleDateString(locale791(language),{day:'numeric',month:'short'});return <article key={week.weekStart} data-week-load={week.weekStart}><div><time dateTime={week.weekStart}>{date(start)} – {date(end)}</time><strong>{hours791(week.minutes/60,language)} {tr('t','h','س')}</strong></div><div className="mf791-plan-load" role="meter" aria-label={`${date(start)} – ${date(end)}`} aria-valuemin="0" aria-valuemax={max} aria-valuenow={week.minutes} aria-valuetext={`${hours791(week.minutes/60,language)} ${tr('timer planlagt','hours planned','ساعات مخططة')}`}><i style={{width:`${week.minutes/max*100}%`}}/></div></article>;})}
      {!strategy.weeklyLoads?.length&&<p>{tr('Ugerne vises, når planen har indhold og læsetid.','Weeks appear when the plan has content and study time.','تظهر الأسابيع عند إضافة المحتوى ووقت الدراسة.')}</p>}
    </div>
  </section>;
}

export function RepetitionStart791({lectures=[],memories=[],onStart,language='da'}) {
  const tr=(da,en,ar)=>language==='en'?en:language==='ar'?ar:da;
  const available=lectures.filter(lecture=>!memories.some(memory=>memory.lectureId===lecture.id&&!memory.stoppedAt));
  const [selected,setSelected]=useState('');
  const lecture=available.find(item=>item.id===selected)||available[0];
  return <div className="mf791-repetition-start"><h3>{tr('Planlæg din næste gennemgang','Plan your next review','خطط لمراجعتك التالية')}</h3><p>{tr('Repetition hjælper dig med at hente stoffet frem igen, før det bliver glemt. Vælg en forelæsning, du har gennemgået, og vurder din tid og belastning. Du vælger selv den næste dato.','Review helps you recall material before you forget it. Choose a lecture you have studied and rate the time and effort. You choose the next date.','تساعدك المراجعة على استرجاع المادة قبل نسيانها. اختر محاضرة درستها وقيّم الوقت والجهد، ثم اختر موعد المراجعة.')}</p>
    {lecture?<div><label><span>{tr('Gennemgået forelæsning','Studied lecture','محاضرة درستها')}</span><select value={lecture.id} onChange={event=>setSelected(event.target.value)}>{available.map(item=><option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</select></label><button type="button" className="ui-button ui-button--primary" onClick={()=>onStart(lecture)}>{tr('Vurdér og planlæg repetition','Rate and plan review','قيّم وخطط للمراجعة')}</button></div>:<p>{lectures.length?tr('Dine forelæsninger har allerede et repetitionsforløb. Åbn en planlagt gennemgang eller fortsæt efter din næste vurdering.','Your lectures already have review plans. Open a scheduled review or continue after your next rating.','للمحاضرات خطط مراجعة بالفعل. افتح مراجعة مجدولة أو تابع بعد تقييمك التالي.'):tr('Vælg et modul med forelæsninger for at starte et repetitionsforløb.','Choose a module with lectures to start a review plan.','اختر وحدة تحتوي على محاضرات لبدء خطة مراجعة.')}</p>}
  </div>;
}
