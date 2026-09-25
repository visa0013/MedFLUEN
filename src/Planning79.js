import React from 'react';
import './planning79.css';

const words = {
  da: { kicker: 'DIT STUDIERUM / 04', heading: 'Planlægning', calendar: 'Kalender', plan: 'Studieplan', description: 'Undervisning, aftaler og din egen læsning i ét skema.' },
  en: { kicker: 'YOUR STUDY SPACE / 04', heading: 'Planning', calendar: 'Calendar', plan: 'Study plan', description: 'Teaching, appointments and your own study time in one calendar.' },
  ar: { kicker: 'مساحة الدراسة / ٠٤', heading: 'التخطيط', calendar: 'التقويم', plan: 'خطة الدراسة', description: 'المحاضرات والمواعيد ووقت الدراسة في تقويم واحد.' },
};

export function Planning79({ language = 'da', moduleName, onOpenStudyPlan, children }) {
  const copy = words[language] || words.da;
  return <section className="mf79-planning" dir={language === 'ar' ? 'rtl' : undefined}>
    <header className="mf79-planning-intro"><div><small>{copy.kicker}{moduleName ? ` · ${moduleName}` : ''}</small><h1>{copy.heading}</h1><p>{copy.description}</p></div><nav aria-label={copy.heading}><span aria-current="page">{copy.calendar}</span><button type="button" onClick={onOpenStudyPlan}>{copy.plan}<span aria-hidden="true">↗</span></button></nav></header>
    <div className="mf79-planning-calendar">{children}</div>
  </section>;
}
