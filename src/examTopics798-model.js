const clean = value => String(value || '').replace(/^#?\s*(?:\d+(?:\.\d+)*|[A-Z])\s*[-:]\s*/i, '').replace(/\s*\(\d+(?:\+\d+)*\)\s*$/, '').trim();
const key = value => clean(value).toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const k3 = ['Gastroenterologi', 'Kirurgi', 'Endokrinologi', 'Diabetes', 'Pædiatrisk endokrinologi', 'Global health', 'Væske og elektrolyt'];
const k5 = ['Neurologi', 'Neurokirurgi', 'Voksenpsykiatri', 'Børne- og ungepsykiatri'];
const groupName = value => /^(ungepsykiatri|børnepsykiatri)$/i.test(value) ? k5[3] : value;

// Lecture metadata is authoritative. Imports provide subject labels, never UI folders.
export function examTopics798(moduleId, cards, lectures = [], stats = () => ({})) {
  const names = [...new Set((/^K3\b/.test(moduleId) ? k3 : /^K5\b/.test(moduleId) ? k5 : []).concat(lectures.map(lecture => groupName(lecture.group)).filter(Boolean)))];
  const root = { id: 'module:' + moduleId, type: 'module', label: 'Alle eksamensspørgsmål', questions: cards, children: [], stats: stats(cards) };
  const group = label => {
    let node = root.children.find(item => item.label === label);
    if (!node) { node = { id: 'subject:' + moduleId + ':' + key(label), type: 'subject', label, children: [], questions: [], groupFilter: null, lectureFilter: null }; root.children.push(node); }
    return node;
  };
  names.forEach(group);
  const topic = (parent, label, lectureId = null) => {
    let node = parent.children.find(item => key(item.label) === key(label));
    if (!node) { node = { id: parent.id + ':' + (lectureId || key(label)), type: 'topic', label, code: lectureId, lectureFilter: lectureId, groupFilter: null, questions: [], children: [] }; parent.children.push(node); }
    return node;
  };
  lectures.forEach(lecture => topic(group(groupName(lecture.group) || 'Øvrige emner'), lecture.title, lecture.id));
  for (const card of cards) {
    const path = String(card.richContent?.anki?.deck || card.sourceDeck || '').split('::').map(clean);
    const lecture = lectures.find(item => item.id === card.lectureId) || lectures.find(item => path.some(part => key(part) === key(item.title)));
    let label = lecture ? groupName(lecture.group) : names.find(name => path.some(part => key(part) === key(name) || (name === k5[3] && /børne|ungepsykiatri/i.test(part))));
    // Do not infer subjects from clinical question text or expose package names.
    if (!label) label = /kortsvar/i.test(path.join(' ')) ? 'Kortsvar' : 'Øvrige emner';
    const parent = group(label);
    const leaf = lecture?.title || (path.length > 1 && !/eksamen|anki|mcq|^info$|^andet$|^sygdomme$/i.test(path.at(-1)) ? path.at(-1) : label);
    topic(parent, leaf, lecture?.id || null).questions.push(card);
  }
  root.children.forEach(parent => { parent.questions = parent.children.flatMap(child => { child.stats = stats(child.questions); return child.questions; }); parent.stats = stats(parent.questions); });
  return root;
}

export function examSelection798(tree, scope) {
  if (!scope?.groupId) return tree;
  const group = tree.children.find(node => node.id === scope.groupId);
  if (!group) return tree;
  if (scope.topicIds == null) return group;
  const chosen = group.children.filter(node => scope.topicIds.includes(node.id));
  return { ...group, id: group.id + ':selection', label: chosen.length === 1 ? chosen[0].label : group.label, questions: chosen.flatMap(node => node.questions), lectureFilter: chosen.length === 1 ? chosen[0].lectureFilter : null };
}
