import React from 'react';
import { tonePreview79, toneSettings79 } from './drbyte79-tone';

const choices = [
  ['brief', 'Kort og præcist', 'Et direkte svar, når du vil hurtigt videre.'],
  ['teaching', 'Pædagogisk', 'Forklarer sammenhængen i et roligt tempo.'],
  ['socratic', 'Spørgende', 'Hjælper dig med at ræsonnere selv.'],
];

export function DrByteTone79({ settings, onChange, onClose }) {
  const value = toneSettings79(settings);
  const preview = tonePreview79(value.tone);
  return <section className="mf79-byte-tone-panel" aria-label="Dr. Bytes svarstil">
    <header><div><small>DR. BYTE</small><h3>Sådan svarer jeg</h3></div><button type="button" onClick={onClose} aria-label="Luk svarstil">×</button></header>
    <p>Vælg en stil. Den ændrer formen på svaret, ikke hvilke kilder der bruges.</p>
    <div className="mf79-byte-tone-options" role="group" aria-label="Svarstil">{choices.map(([key, title, description]) =>
      <button key={key} type="button" aria-pressed={value.tone === key} onClick={() => onChange({ ...value, tone: key })}><strong>{title}</strong><span>{description}</span></button>
    )}</div>
    <div className="mf79-byte-tone-preview"><small>EKSEMPEL</small><strong>{preview.question}</strong><p>{preview.answer}</p></div>
    <label htmlFor="mf79-byte-custom-tone">Egne ønsker til svarstilen</label>
    <textarea id="mf79-byte-custom-tone" maxLength={500} value={value.custom} onChange={event => onChange({ ...value, custom: event.target.value })} placeholder="Fx: Brug korte afsnit og forklar fagord første gang." />
    <small className="mf79-byte-tone-safety">Del ikke patientoplysninger. Dine ønsker kan ikke tilsidesætte kildekontrol eller sikkerhedsregler.</small>
  </section>;
}
