import React from 'react';
import { visibleCurriculumTabs79 } from './curriculum79-model';
import './curriculum79.css';

const WORDS = {
  da: { lecture: 'Forelæsninger', class: 'Holdtimer', tbl: 'TBL', label: 'Pensumtype' },
  en: { lecture: 'Lectures', class: 'Classes', tbl: 'TBL', label: 'Curriculum type' },
  ar: { lecture: 'المحاضرات', class: 'الحصص', tbl: 'التعلم الجماعي', label: 'نوع المحتوى' },
};

export function Curriculum79Tabs({ kind = 'lecture', level, moduleLevel, language = 'da', onChange }) {
  const words = WORDS[language] || WORDS.da;
  const visible = visibleCurriculumTabs79(level, moduleLevel);
  return <nav className="mf79-curriculum-tabs" role="tablist" aria-label={words.label}>
    {visible.map(value => <button key={value} role="tab" type="button" aria-selected={kind === value} onClick={() => onChange?.(value)}>{words[value]}</button>)}
  </nav>;
}
