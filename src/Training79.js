import React from 'react';
import './training79.css';

const COPY = {
  da: { eyebrow: 'Træning / Flashkort', title: 'Træning', theory: 'Teori', exam: 'Eksamens-MCQ', source: 'Kortkilde' },
  en: { eyebrow: 'Training / Flashcards', title: 'Training', theory: 'Theory', exam: 'Exam MCQ', source: 'Card source' },
  ar: { eyebrow: 'التدريب / البطاقات', title: 'التدريب', theory: 'النظرية', exam: 'أسئلة الامتحان', source: 'مصدر البطاقة' },
};

export function Training79Header({ mode, language = 'da', onModeChange }) {
  const copy = COPY[language] || COPY.da;
  return <header className="mf79-training-heading">
    <div><span className="mf79-kicker">{copy.eyebrow}</span><h1 className="mf79-display">{copy.title}</h1></div>
    <div className="mf79-training-source" role="tablist" aria-label={copy.source}>
      {[['theory', copy.theory], ['exam-mcq', copy.exam]].map(([value, label]) =>
        <button key={value} type="button" role="tab" aria-selected={mode === value} onClick={() => onModeChange?.(value)}>{label}</button>)}
    </div>
  </header>;
}
