import React, { useEffect, useRef, useState } from 'react';
import './training79.css';

const COPY = {
  da: { eyebrow: 'Træning / Flashkort', title: 'Træning', theory: 'Teori', exam: 'Eksamens-MCQ', source: 'Kortkilde' },
  en: { eyebrow: 'Training / Flashcards', title: 'Training', theory: 'Theory', exam: 'Exam MCQ', source: 'Card source' },
  ar: { eyebrow: 'التدريب / البطاقات', title: 'التدريب', theory: 'النظرية', exam: 'أسئلة الامتحان', source: 'مصدر البطاقة' },
};

export function Training79Header({ mode, language = 'da', onModeChange, onOpenExamSets, separateWorkspace = false }) {
  const copy = COPY[language] || COPY.da;
  const tabs=useRef(null),[indicator,setIndicator]=useState(null);
  useEffect(()=>{
    let active=true;
    const measure=()=>{const selected=tabs.current?.querySelector('[aria-selected="true"]');if(selected&&active)setIndicator({left:selected.offsetLeft-3,width:selected.offsetWidth});};
    measure();const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
    if(tabs.current)observer?.observe(tabs.current);
    window.addEventListener('resize',measure);document.fonts?.ready.then(measure);
    return()=>{active=false;observer?.disconnect();window.removeEventListener('resize',measure);};
  },[mode,language]);
  const exams = separateWorkspace && mode === 'exam-mcq';
  return <header className="mf79-training-heading" data-separate-workspace={separateWorkspace}>
    <div><span className="mf79-kicker">{exams ? (language === 'en' ? 'EXAMS / MCQ' : language === 'ar' ? 'الامتحان / الأسئلة' : 'EKSAMEN / MCQ') : copy.eyebrow}</span><h1 className="mf79-display">{exams ? (language === 'en' ? 'Exams' : language === 'ar' ? 'الامتحان' : 'Eksamenen') : copy.title}</h1><p className="mf791-training-intro">{exams ? (language === 'en' ? 'MCQ from your exam papers.' : language === 'ar' ? 'أسئلة من نماذج الامتحان.' : 'MCQ fra dine eksamenssæt.') : language === 'en' ? 'Flashcards for a stronger clinical everyday life.' : language === 'ar' ? 'بطاقات لدراسة الطب بثقة.' : 'Flashkort til en stærkere klinisk hverdag.'}</p></div>
    {!separateWorkspace && <div ref={tabs} className="mf79-training-source mf792-source-tabs" role="tablist" aria-label={copy.source}>
      {indicator&&<span className="mf792-source-indicator" aria-hidden="true" style={{width:indicator.width,transform:`translateX(${indicator.left}px)`}}/>}
      {[['theory', copy.theory], ['exam-mcq', copy.exam]].map(([value, label]) =>
        <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => onModeChange?.(value)}>{label}</button>)}
    </div>}
    {onOpenExamSets&&<button type="button" className="mf791-training-papers" onClick={onOpenExamSets}>{language==='en'?'Exam papers':language==='ar'?'نماذج الامتحان':'Eksamenssæt'}</button>}
  </header>;
}
