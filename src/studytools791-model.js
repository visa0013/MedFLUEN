function dateKey(value) {
  const date=new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

// Both local and cloud review records can describe the same review.
export function studyActivity791(events, now=Date.now()) {
  const list=Array.isArray(events)?events:[];
  const reversed=new Set(list.map(e=>e?.reversesReviewId||e?.reverses_review_id).filter(Boolean).map(String));
  const end=new Date(now),start=new Date(now);start.setDate(start.getDate()-6);start.setHours(0,0,0,0);
  const byId=new Map();
  for(const e of list) {
    if(!e||e.reversesReviewId||e.reverses_review_id)continue;
    const id=String(e.id||e.eventId||`${e.questionId||e.question_id}:${e.reviewedAt||e.reviewed_at}:${e.rating}`);
    const raw=e.reviewedAt??e.reviewed_at,at=typeof raw==='number'?raw:Date.parse(raw);
    if(reversed.has(id)||!Number.isFinite(at)||at<start.getTime()||at>Number(now))continue;
    const seconds=Number(e.seconds??e.duration_seconds);
    byId.set(id,{...e,at,seconds:Number.isFinite(seconds)?Math.max(0,seconds):0});
  }
  const reviews=[...byId.values()];
  const days=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);const key=dateKey(d);const rows=reviews.filter(e=>dateKey(e.at)===key);return {date:key,count:rows.length,seconds:rows.reduce((sum,e)=>sum+e.seconds,0)};});
  const rated=reviews.filter(e=>Number(e.rating)>=1&&Number(e.rating)<=4);
  return {reviews:reviews.length,seconds:reviews.reduce((sum,e)=>sum+e.seconds,0),activeDays:days.filter(d=>d.count>0).length,today:days.find(d=>d.date===dateKey(end))?.count||0,comfortablePercent:rated.length?Math.round(rated.filter(e=>Number(e.rating)>=3).length/rated.length*100):null,days};
}
