import React, {useEffect, useId, useRef, useState} from 'react';
import {Dialog791} from './StudyTools791';
import {Mark791} from './Workspace791';
import './LectureOptions801.css';

const modes = [
  {value: 'guide', label: 'Faglig gennemgang', description: 'Alle valgte kort i forelæsningens faglige rækkefølge, uanset repetitionsdato.', action: 'Åbn forløbet'},
  {value: 'review', label: 'Repetition', description: 'Kort, der er klar, og nye kort efter repetitionsplanen.', action: 'Start repetition'},
  {value: 'forgotten', label: 'Glemte svarpunkter', description: 'Kun kort med svarpunkter, du har markeret som glemt.', action: 'Øv glemte svarpunkter'},
];

export function LectureOptions801({sections = [], lectureTitle, getCount, initialSelection, onStart, onClose}) {
  const groupId = useId();
  const allToggle = useRef(null);
  const [chosenKeys, setChosenKeys] = useState(() => initialSelection?.keys || sections.map(section => section.key));
  const [mode, setMode] = useState(() => modes.some(option => option.value === initialSelection?.mode) ? initialSelection.mode : 'guide');
  const [limit, setLimit] = useState(() => initialSelection?.limit === 'all' ? 'all' : Math.max(1, Math.min(500, Math.round(Number(initialSelection?.limit) || 20))));
  const keys = sections.filter(section => chosenKeys.includes(section.key)).map(section => section.key);
  const allSelected = sections.length > 0 && keys.length === sections.length;
  const total = sections.reduce((sum, section) => sum + section.count, 0);
  const candidateCount = Math.max(0, Math.floor(Number(getCount ? getCount(keys, mode) : mode === 'guide' ? sections.filter(section => keys.includes(section.key)).reduce((sum, section) => sum + section.count, 0) : 0) || 0));
  const sessionCount = mode === 'review' && limit !== 'all' ? Math.min(candidateCount, limit) : candidateCount;
  const selectedMode = modes.find(option => option.value === mode);
  const limits = [...new Set([10, 20, 40, ...(limit !== 'all' ? [limit] : [])])].sort((a, b) => a - b);
  useEffect(() => {if (allToggle.current) allToggle.current.indeterminate = keys.length > 0 && !allSelected;}, [keys.length, allSelected]);

  function toggleSection(key) {
    setChosenKeys(selected => selected.includes(key) ? selected.filter(item => item !== key) : [...selected, key]);
  }
  function start() {
    if (sessionCount > 0) onStart?.({keys, mode, limit: mode === 'review' ? limit : 0});
  }

  return <Dialog791 title="Tilpas forelæsningsforløb" size="large" className="mf801-lecture-options" onClose={onClose}>
    <header className="mf791-dialog-heading"><div><small>{lectureTitle || 'FORELÆSNINGSKORT'}</small><h2>Tilpas forelæsningsforløb</h2></div><button type="button" aria-label="Luk" onClick={onClose}><Mark791 name="close"/></button></header>
    <div className="mf801-lecture-layout">
      <div className="mf801-lecture-fields">
        <fieldset className="mf801-lecture-sections"><legend>Hvilke sektioner?</legend>
          <label className="mf801-lecture-all"><input ref={allToggle} data-lecture801-all type="checkbox" checked={allSelected} onChange={() => setChosenKeys(allSelected ? [] : sections.map(section => section.key))}/><strong>Hele forelæsningen</strong><small>{total} kort</small></label>
          <ol>{sections.map((section, index) => <li key={section.key} data-section-key={section.key}><label>
            <input type="checkbox" checked={keys.includes(section.key)} onChange={() => toggleSection(section.key)}/>
            <span className="mf801-lecture-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span className="mf801-lecture-section-name"><strong>{section.title}</strong><small>{section.count} kort</small></span>
          </label></li>)}</ol>
        </fieldset>
        <fieldset className="mf801-lecture-modes"><legend>Hvordan vil du arbejde?</legend><div>{modes.map(option => <label key={option.value} data-selected={mode === option.value}>
          <input type="radio" name={`${groupId}-mode`} value={option.value} checked={mode === option.value} onChange={() => setMode(option.value)}/>
          <span><strong>{option.label}</strong><small>{option.description}</small></span>
        </label>)}</div></fieldset>
        {mode === 'review' && <label className="mf801-lecture-limit"><span>Antal kort i repetitionen</span><select aria-label="Antal kort i repetitionen" value={limit} onChange={event => setLimit(event.target.value === 'all' ? 'all' : Number(event.target.value))}>{limits.map(value => <option key={value} value={value}>{value} kort</option>)}<option value="all">Alle kort, der er klar, og nye kort</option></select></label>}
      </div>
      <aside className="mf801-lecture-preview" aria-live="polite"><small>DIT FORLØB</small><strong data-lecture801-count>{sessionCount}</strong><span>kort med dine valg</span><p>{keys.length} af {sections.length} sektioner · {selectedMode.label}</p>
        <p>{mode === 'guide' ? 'Du får først et overblik over dine sektioner og følger derefter forløbet fra start til slut.' : mode === 'review' ? 'Kortenes repetitionsplan bestemmer rækkefølgen.' : 'Du øver de markerede svarpunkter fra dine valgte sektioner.'}</p>
        {!sessionCount && <p role="status">{!keys.length ? 'Vælg mindst én sektion for at fortsætte.' : mode === 'forgotten' ? 'Ingen glemte svarpunkter i de valgte sektioner. Vælg en anden sektion eller arbejdsform.' : mode === 'review' ? 'Ingen kort er klar til repetition i de valgte sektioner. Vælg faglig gennemgang for at se alle kort.' : 'De valgte sektioner indeholder ingen kort.'}</p>}
        <button type="button" className="mf791-start" data-lecture801-start disabled={!sessionCount} onClick={start}><Mark791 name="play" size={16}/>{selectedMode.action}</button>
        <button type="button" className="mf791-text-button" onClick={onClose}>Tilbage til teorikort</button>
      </aside>
    </div>
  </Dialog791>;
}
export default LectureOptions801;
