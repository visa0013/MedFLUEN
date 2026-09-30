import { richText72, sanitizeRich72 } from './experience72-model';

export const ankiExamSource797 = card => {
  const info = card?.richContent?.anki;
  return info?.sourceKind || (/eksamen|exam|mcq-opgaver/i.test(info?.deck || card?.sourceDeck || '') ? 'exam-mcq' : 'theory');
};

// Only convert a sequential, explicitly numbered list with one exact answer key.
// Ranges preserve inline formatting and media instead of rebuilding from text.
export function numberedMcq797(front, back) {
  const key = richText72(back).trim().replace(/^(?:svar|facit|answer|correct(?: answer)?)\s*:\s*/i, '');
  const template = document.createElement('template'); template.innerHTML = front || '';
  const walker = document.createTreeWalker(template.content, 4), labels = [];
  let textNode;
  while ((textNode = walker.nextNode())) {
    const matches = [...textNode.textContent.matchAll(/(?:^|\n)\s*([1-8A-H])[).:]\s*/g)];
    for (const match of matches) labels.push({ node: textNode, start: match.index, end: match.index + match[0].length, number: /^[A-H]$/.test(match[1]) ? match[1].charCodeAt(0) - 64 : Number(match[1]) });
  }
  if (labels.length > 2 && labels[1].number === 1) labels.shift();
  const htmlRange = (start, end) => {
    const range = document.createRange(); range.selectNodeContents(template.content);
    if (start) range.setStart(start.node, start.end);
    if (end) range.setEnd(end.node, end.start);
    const container = document.createElement('div'); container.append(range.cloneContents());
    const trimEdge = (parent, trailing) => {
      let node;
      while ((node = trailing ? parent.lastChild : parent.firstChild)) {
        const media = node.nodeType === 1 && (node.matches('img,audio,video') || node.querySelector('img,audio,video'));
        if (!node.textContent.trim() && !media) { node.remove(); continue; }
        if (node.nodeType === 1 && !node.matches('img,audio,video')) trimEdge(node, trailing);
        break;
      }
    };
    trimEdge(container, false); trimEdge(container, true);
    return sanitizeRich72(container.innerHTML);
  };
  const list = template.content.querySelector('ol');
  const items = list ? [...list.children].filter(node => node.tagName === 'LI') : [];
  const ordered = items.length >= 2;
  if (!ordered && (labels.length < 2 || labels.some((label, index) => label.number !== index + 1))) return null;
  let question = ordered ? (() => { const range = document.createRange(); range.selectNodeContents(template.content); range.setEndBefore(list); const node = document.createElement('div'); node.append(range.cloneContents()); return sanitizeRich72(node.innerHTML); })() : htmlRange(null, labels[0]);
  if (!richText72(question).trim() && !question.includes('<img')) return null;
  const options = ordered ? items.map(node => sanitizeRich72(node.innerHTML)) : labels.map((label, index) => htmlRange(label, labels[index + 1]));
  if (options.some(option => !richText72(option).trim() && !option.includes('<img'))) return null;
  const tokenIndex = token => /^[1-8]$/.test(token) ? Number(token) - 1 : /^[A-H]$/i.test(token) ? token.toUpperCase().charCodeAt(0) - 65 : -1;
  const tokens = key.split(/\s*(?:,|;|\bog\b|\band\b|&)\s*/i);
  let indices = tokens.map(tokenIndex);
  if (indices.some(index => index < 0 || index >= options.length)) {
    const matching = options.map((option, index) => richText72(option).trim() === key ? index : -1).filter(index => index >= 0);
    indices = matching.length === 1 ? matching : [];
  }
  return { front: question, options, correct: indices[0] ?? 0, correctIndices: [...new Set(indices)], unresolved: !indices.length };
}

export function normalizeAnkiCard797(card) {
  if (!card?.richContent?.anki) return card;
  let next = { ...card, richContent: { ...card.richContent, anki: { ...card.richContent.anki, sourceKind: ankiExamSource797(card) } } };
  if (card.cardType !== 'basic') return next;
  const languages = Object.keys(card.richContent.front || {});
  const language = languages[0];
  if (!language) return next;
  const mcq = numberedMcq797(card.richContent.front[language], card.richContent.back?.[language] || card.back?.[language]);
  if (!mcq) return next;
  const front = { [language]: richText72(mcq.front).trim() }, empty = { [language]: '' };
  const explanation = mcq.unresolved ? card.back : empty, explanationHtml = mcq.unresolved ? card.richContent.back : empty;
  return { ...next, cardType: 'mcq', front, ...(card.question ? { question: front } : {}), options: mcq.options.map(option => ({ [language]: richText72(option).trim() })), correct: mcq.correct, correctIndices: mcq.correctIndices, back: empty, explanation,
    richContent: { ...next.richContent, front: { [language]: mcq.front }, options: mcq.options.map(option => ({ [language]: option })), back: empty, explanation: explanationHtml } };
}

export function ankiDeckTree797(moduleId, cards, stats = () => ({})) {
  const root = { id: 'module:' + moduleId, type: 'module', label: moduleId, questions: [], children: [] };
  const index = new Map([[root.id, root]]);
  for (const card of cards) {
    const path = String(card.richContent?.anki?.deck || card.sourceDeck || 'ANKI-kort').split('::').filter(Boolean);
    let parent = root;
    path.forEach((part, depth) => {
      const id = 'anki:' + JSON.stringify([moduleId, ...path.slice(0, depth + 1)]);
      if (!index.has(id)) {
        const node = { id, type: 'anki', label: part.replace(/^#\s*[A-Z\d.]+\s*[-:]\s*/i, '').trim(), questions: [], children: [], groupFilter: null, lectureFilter: null };
        index.set(id, node); parent.children.push(node);
      }
      parent = index.get(id);
    });
    parent.questions.push(card);
  }
  const aggregate = node => {
    node.questions = [...new Map([...node.questions, ...node.children.flatMap(aggregate)].map(card => [card.id || card.cardId, card])).values()];
    node.stats = stats(node.questions);
    return node.questions;
  };
  aggregate(root); return root;
}
