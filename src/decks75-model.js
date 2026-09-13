// Placements are private pointers to existing card IDs. Never copy card content or FSRS.
export function deckApply75(state, operation, baseIds) {
  if (!state?.owner || operation.owner !== state.owner || operation.moduleId !== state.moduleId) throw Error('scope');
  const next = { ...state, decks: state.decks.map(deck => ({ ...deck })), placements: { ...state.placements } };
  const byId = new Map(next.decks.map(deck => [deck.id, deck]));
  const bases = new Set(baseIds);
  const item = byId.get(operation.id);
  const parentExists = id => bases.has(id) || byId.has(id);
  const name = String(operation.name || '').trim();
  switch (operation.type) {
    case 'create':
      if (!/^personal:[a-z\d-]+$/i.test(operation.id) || byId.has(operation.id)) throw Error('id');
      if (!parentExists(operation.parent)) throw Error('parent');
      next.decks.push({ id: operation.id, name, parent: operation.parent });
      break;
    case 'rename':
      if (!item) throw Error('missing');
      item.name = name;
      break;
    case 'move':
      if (!item) throw Error('missing');
      if (!parentExists(operation.parent)) throw Error('parent');
      item.parent = operation.parent;
      break;
    case 'assign':
      if (operation.target !== null && !byId.has(operation.target)) throw Error('target');
      for (const id of operation.cardIds || []) {
        if (typeof id !== 'string' || !id || id.length > 300 || ['__proto__','constructor','prototype'].includes(id)) throw Error('card');
        if (operation.target === null) delete next.placements[id];
        else next.placements[id] = operation.target;
      }
      break;
    case 'delete': {
      if (!item) throw Error('missing');
      if (operation.target !== null && (!byId.has(operation.target) || operation.target === item.id)) throw Error('target');
      const target = operation.target || item.parent;
      // Reparent immediate children and memberships in one state transition.
      next.decks.forEach(deck => { if (deck.parent === item.id) deck.parent = target; });
      Object.entries(next.placements).forEach(([id, deck]) => {
        if (deck !== item.id) return;
        if (operation.target) next.placements[id] = operation.target;
        else delete next.placements[id];
      });
      next.decks = next.decks.filter(deck => deck.id !== item.id);
      break;
    }
    default: throw Error('operation');
  }
  const all = new Map(next.decks.map(deck => [deck.id, deck]));
  const names = new Set();
  for (const deck of next.decks) {
    if (!deck.name || deck.name.length > 100) throw Error('name');
    const key = JSON.stringify([deck.parent, deck.name.normalize('NFKC').toLocaleLowerCase()]);
    if (names.has(key)) throw Error('name');
    names.add(key);
    const seen = new Set([deck.id]);
    let parent = deck.parent;
    while (all.has(parent)) {
      if (seen.has(parent)) throw Error('cycle');
      seen.add(parent); parent = all.get(parent).parent;
    }
    if (!bases.has(parent)) throw Error('parent');
  }
  return next;
}

export function deckTree75(base, state, stats) {
  const questions = new Map((base.questions || []).map(question => [String(question.id), question]));
  const customIds = new Set(state.decks.map(deck => deck.id));
  const placed = new Set(Object.entries(state.placements).filter(([, target]) => customIds.has(target)).map(([id]) => id));
  const index = new Map();
  function copy(node) {
    const children = (node.children || []).map(copy);
    const own = children.length ? [] : (node.questions || []).filter(question => !placed.has(String(question.id)));
    const result = { ...node, children, questions: own };
    index.set(result.id, result); return result;
  }
  const root = copy(base);
  state.decks.forEach(deck => index.set(deck.id, {
    id: deck.id, type: 'personal', label: deck.name, groupFilter: null, lectureFilter: null,
    questions: [], children: [],
  }));
  state.decks.forEach(deck => {
    const parent = index.get(deck.parent) || root;
    parent.children.push(index.get(deck.id));
  });
  Object.entries(state.placements).forEach(([id, target]) => {
    if (customIds.has(target) && questions.has(id)) index.get(target).questions.push(questions.get(id));
  });
  function aggregate(node, visited = new Set()) {
    if (visited.has(node.id)) return []; // Defensive for a corrupt cache; mutations reject cycles.
    visited.add(node.id);
    node.questions = [...new Map([...node.questions, ...node.children.flatMap(child => aggregate(child, visited))].map(question => [String(question.id), question])).values()];
    node.stats = stats(node.questions);
    return node.questions;
  }
  aggregate(root);
  // The module always includes every card, including legacy/unmapped content.
  root.questions = [...questions.values()]; root.stats = stats(root.questions);
  return root;
}
