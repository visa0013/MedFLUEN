import React from 'react';
import './lecture800.css';

export function LectureSections800({ sections, selection, onChange, forgottenCount = 0 }) {
  return <section className="mf800-sections" aria-label="Forelæsningssektioner"><small>FORELÆSNINGENS SEKTIONER</small>
    {sections.map((section, index) => <label key={section.key} className="mf800-section-row"><input type="checkbox" checked={selection.keys.includes(section.key)} onChange={() => onChange({ ...selection, keys: selection.keys.includes(section.key) ? selection.keys.filter(key => key !== section.key) : [...selection.keys, section.key] })} /><span>{index + 1}. {section.title}</span><small>{section.count}</small></label>)}
    <div className="mf800-study-modes" aria-label="Træningsform">{[['guide', 'Gennemgang'], ['review', 'Repetition']].map(([mode, label]) => <button type="button" key={mode} data-mode={mode} aria-pressed={selection.mode === mode} onClick={() => onChange({ ...selection, mode })}>{label}</button>)}</div>
    <button type="button" data-mode="forgotten" className="mf800-forgotten-action" aria-pressed={selection.mode === 'forgotten'} disabled={!forgottenCount} onClick={() => onChange({ ...selection, mode: 'forgotten' })}>Øv glemte svarpunkter <span>({forgottenCount})</span></button>
  </section>;
}
