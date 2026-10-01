import React, { useState } from 'react';
import './examTopics798.css';

export function ExamTopics798({ tree, scope, selected, onSelection, onStart, onCustomize, onBrowse, onImport, onArchive, sessionCount, restoreCount = 0, language = 'da' }) {
  const en = language === 'en', [query, setQuery] = useState(''), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const group = tree.children.find(node => node.id === scope?.groupId);
  const chosen = scope?.topicIds == null ? group?.children.map(node => node.id) || [] : scope.topicIds;
  const topics = (group ? group.children : tree.children).filter(node => node.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  async function archive(restore = false) {
    setBusy(true); setMessage('');
    try { const result = await onArchive(restore); if (result?.ok === false) throw Error(result.error); setMessage(restore ? 'Importen er gendannet.' : 'Importen er fjernet. Kort og billeder kan gendannes.'); onSelection(null); }
    catch (error) { setMessage(error.message); } finally { setBusy(false); }
  }
  return <section className="mf798-exams" aria-label={en ? 'Exam topics' : 'Eksamensemner'}>
    <div className="mf798-subjects" role="group" aria-label={en ? 'Subject' : 'Fagområde'}>
      <button type="button" aria-pressed={!group} onClick={() => onSelection(null)}>{en ? 'Alle fagområder' : 'Alle fagområder'}</button>
      {tree.children.map(node => <button key={node.id} type="button" aria-pressed={group?.id === node.id} onClick={() => onSelection({ groupId: node.id, topicIds: null })}>{node.label}<span>{node.questions.length}</span></button>)}
    </div>
    <div className="mf798-layout"><div className="mf798-topic-list">
      <header><label><span>{en ? 'Topics' : 'Underemner'}</span><input type="search" aria-label="Søg i underemner" placeholder="Find en forelæsning eller et emne" value={query} onChange={event => setQuery(event.target.value)} /></label>
        {group && <button type="button" onClick={() => onSelection({ groupId: group.id, topicIds: chosen.length === group.children.length ? [] : null })}>{chosen.length === group.children.length ? 'Fravælg alle' : 'Vælg alle'}</button>}
      </header>
      {topics.map(node => group ? <label className="mf798-topic" key={node.id}><input type="checkbox" checked={chosen.includes(node.id)} onChange={event => onSelection({ groupId: group.id, topicIds: event.target.checked ? [...chosen, node.id] : chosen.filter(id => id !== node.id) })} /><span>{node.code && <small>{node.code}</small>}{node.label}</span><small>{node.questions.length} kort</small></label> : <button type="button" className="mf798-topic" key={node.id} onClick={() => onSelection({ groupId: node.id, topicIds: null })}><span>{node.label}</span><small>{node.questions.length} kort →</small></button>)}
      {!topics.length && <p>{query ? 'Ingen emner matcher søgningen.' : 'Upload et eksamensdæk for at tilføje underemner.'}</p>}
    </div><aside className="mf798-session"><small>DIN TRÆNING</small><h2>{selected.label}</h2><p>{selected.questions.length} kort i dit udvalg</p>
      <button type="button" className="mf798-start" disabled={!sessionCount} onClick={onStart}>Start træning <span>↗</span></button>
      <button type="button" onClick={onCustomize}>Tilpas træning</button><button type="button" disabled={!selected.questions.length && !restoreCount} onClick={onBrowse}>Gennemse kort</button>
      <div className="mf798-import"><button type="button" onClick={onImport}>Upload ANKI-dæk <span>↑</span></button>
        {onArchive && <><button type="button" disabled={busy || !tree.questions.some(card => card.richContent?.anki)} onClick={() => archive(false)}>Fjern import</button><button type="button" disabled={busy} onClick={() => archive(true)}>Gendan fjernet import</button></>}
      </div>{message && <p role="status">{message}</p>}
    </aside></div>
  </section>;
}
