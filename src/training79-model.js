import { examAnswerMode75, examAnswerPath75, examMatchesAnswerFilter75 } from './exam75-model';

function sources79(card) {
  const given = Array.isArray(card?.sources) ? card.sources.filter(source => source === 'theory' || source === 'exam-mcq') : [];
  if (given.length) return given;
  if (card?.examSetId || card?.exam_set_id || ['exam', 'exam-set', 'exam-mcq'].includes(card?.sourceType || card?.source_type)) return ['exam-mcq'];
  return ['theory'];
}

export function trainingCards79(cards, mode = 'all') {
  const byId = new Map();
  (Array.isArray(cards) ? cards : []).forEach(card => {
    if (!card?.id) return;
    const previous = byId.get(String(card.id));
    const sources = [...new Set([...(previous?.sources || []), ...sources79(card)])];
    byId.set(String(card.id), { ...(previous || {}), ...card, sources });
  });
  const unique = [...byId.values()];
  return mode === 'all' ? unique : unique.filter(card => card.sources.includes(mode));
}

export function examRows79(documents, filter = 'all', query = '') {
  const needle = String(query || '').trim().toLocaleLowerCase();
  return (Array.isArray(documents) ? documents : [])
    .filter(document => examMatchesAnswerFilter75(document, filter))
    .map(document => ({ ...document, answerMode: examAnswerMode75(document), hasAnswer: Boolean(examAnswerPath75(document)) }))
    .filter(document => filter !== 'with' || document.hasAnswer)
    .filter(document => !needle || `${document.name || ''} ${document.year || ''} ${document.moduleName || document.module_name || ''}`.toLocaleLowerCase().includes(needle));
}
