import React, { useState } from 'react';

export function ByteSource79({ title, page, quote, url, onClose }) {
  const [showPdf, setShowPdf] = useState(false);
  return <aside className="mf79-source-peek" aria-label="Kildeuddrag">
    <header><div><small>Kilde · PDF-side {page}</small><h3>{title}</h3></div><button type="button" onClick={onClose} aria-label="Luk kildeuddrag">×</button></header>
    {quote ? <blockquote>{quote}</blockquote> : <p>Den præcise passage kunne ikke verificeres mod PDF-teksten. Åbn originalsiden og kontrollér selv.</p>}
    <footer><button type="button" onClick={() => setShowPdf(value => !value)} aria-expanded={showPdf}>{showPdf ? 'Skjul PDF' : 'Vis PDF her'}</button><a href={`${url}#page=${page}`} target="_blank" rel="noreferrer">Åbn side separat ↗</a></footer>
    {showPdf && <iframe title={`${title} · PDF-side ${page}`} src={`${url}#page=${page}`} />}
  </aside>;
}
