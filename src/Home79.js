import React from 'react';

const WORDS = {
  da: { welcome: 'Goddag', calendar: 'Din kalender' },
  en: { welcome: 'Hello', calendar: 'Your calendar' },
  ar: { welcome: 'مرحبًا', calendar: 'تقويمك' },
};

export function Home79Header({ name, moduleName, language = 'da' }) {
  const words = WORDS[language] || WORDS.da;
  return <header className="mf79-home-heading">
    <div className="mf79-home-heading-main">
      <span className="mf79-kicker">{moduleName || 'MedFLUEN'}</span>
      <h1 className="mf79-display">{words.welcome}, {name || 'MedFLUEN'}</h1>
    </div>
    <span className="mf79-home-heading-label" aria-hidden="true">{words.calendar}</span>
  </header>;
}
