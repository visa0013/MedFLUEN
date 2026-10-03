import { sectionKey800 } from './lecture800-model';

// A walkthrough has its own short-term queue. The saved schedule follows the
// displayed learning interval, without moving pending cards to another section.
export function createLectureQueue804(cards, saved, legacyIndex = 0) {
  const sections = [];
  for (const card of cards) {
    const key = sectionKey800(card.lectureContent);
    let section = sections.find(item => item.key === key);
    if (!section) { section = { key, title: card.lectureContent.section.title, ids: [] }; sections.push(section); }
    section.ids.push(card.id);
  }
  const savedSection = Number.isInteger(saved?.sectionIndex) ? saved.sections?.[saved.sectionIndex] : null;
  const sectionIndex = sections.findIndex(section => section.key === savedSection?.key);
  const compatible = Array.isArray(saved?.sections) && saved.sections.every(old => sections.some(section => section.key === old.key && JSON.stringify(section.ids) === JSON.stringify(old.ids)));
  if (sectionIndex >= 0 && Array.isArray(saved.remaining)
    && compatible
    && saved.remaining.every(id => sections[sectionIndex].ids.includes(id))
    && new Set(saved.remaining).size === saved.remaining.length) {
    const pendingBySection = Object.fromEntries(sections.map(section => {
      const pending = saved.pendingBySection?.[section.key];
      return [section.key, Array.isArray(pending) && pending.every(id => section.ids.includes(id)) && new Set(pending).size === pending.length ? [...pending] : [...section.ids]];
    }));
    pendingBySection[sections[sectionIndex].key] = [...saved.remaining];
    const validIds = new Set(sections.flatMap(section => section.ids));
    const dueById = Object.fromEntries(Object.entries(saved.dueById || {}).filter(([id, due]) => validIds.has(id) && Number.isFinite(due)));
    const resetById = Object.fromEntries(Object.entries(saved.resetById || {}).filter(([id, reset]) => validIds.has(id) && reset === true));
    // Only explicitly saved, validated empty queues can be complete. Newly
    // discovered sections start with all IDs and are never inferred complete.
    const completedKeys = sections.filter(section => pendingBySection[section.key].length === 0).map(section => section.key);
    return { sections, sectionIndex, remaining: [...saved.remaining], pendingBySection, dueById, resetById, completedKeys };
  }
  const resumeId = cards[Math.max(0, legacyIndex)]?.id;
  const start = Math.max(0, sections.findIndex(section => section.ids.includes(resumeId)));
  const ids = sections[start]?.ids || [];
  const remaining = ids.slice(Math.max(0, ids.indexOf(resumeId)));
  const pendingBySection = Object.fromEntries(sections.map(section => [section.key, [...section.ids]]));
  if (sections[start]) pendingBySection[sections[start].key] = remaining;
  return { sections, sectionIndex: start, remaining, pendingBySection, dueById: {}, resetById: {}, completedKeys: [] };
}
export function lectureQueueView804(queue, now = Date.now()) {
  // Prefer unseen/due cards. If only delayed retries remain, keep practising
  // the first one in this section instead of opening a waiting screen.
  const currentId = queue.remaining.find(id => (queue.dueById?.[id] || 0) <= now) || queue.remaining[0] || null;
  const nextDue = queue.remaining.length ? Math.min(...queue.remaining.map(id => queue.dueById?.[id] || now)) : null;
  return { currentId, nextDue };
}
export function rateLectureQueue804(queue, rating, { currentId, repeatAt } = {}) {
  if (!queue.remaining.length) return queue;
  const current = currentId || queue.remaining[0];
  if (!queue.remaining.includes(current)) return queue;
  const remaining = queue.remaining.filter(id => id !== current);
  const dueById = { ...queue.dueById }, resetById = { ...queue.resetById };
  delete dueById[current]; delete resetById[current];
  if (rating === 1 || rating === 2 || Number.isFinite(repeatAt)) {
    remaining.push(current);
    if (Number.isFinite(repeatAt)) dueById[current] = repeatAt;
    if (rating === 1 || rating === 2) resetById[current] = true;
  }
  const key = queue.sections[queue.sectionIndex].key;
  const completedKeys = (queue.completedKeys || []).filter(item => item !== key);
  if (!remaining.length) completedKeys.push(key);
  return { ...queue, remaining, dueById, resetById, completedKeys, pendingBySection: { ...queue.pendingBySection, [key]: remaining } };
}
export function chooseLectureSection804(queue, key, restart = false) {
  if (!restart && queue.completedKeys?.includes(key)) return queue;
  const sectionIndex = queue.sections.findIndex(section => section.key === key);
  if (sectionIndex < 0) return queue;
  const section = queue.sections[sectionIndex];
  const remaining = restart ? [...section.ids] : [...(queue.pendingBySection?.[key] || section.ids)];
  return { ...queue, sectionIndex, remaining, pendingBySection: { ...queue.pendingBySection, [key]: remaining }, completedKeys: restart ? queue.completedKeys.filter(item => item !== key) : queue.completedKeys };
}
// Short learning steps stay in their section; only completion opens the next
// pending destination. Select it atomically so no roadmap flashes in between.
export function rateLectureRun804(queue, rating, options) {
  const rated = rateLectureQueue804(queue, rating, options);
  if (rated === queue || rated.remaining.length) return { queue: rated, handoffKey: null };
  const ordered = [...rated.sections.slice(rated.sectionIndex + 1), ...rated.sections.slice(0, rated.sectionIndex)];
  const next = ordered.find(section => !rated.completedKeys.includes(section.key)
    && (rated.pendingBySection?.[section.key] ?? section.ids).length > 0);
  return next ? { queue: chooseLectureSection804(rated, next.key), handoffKey: next.key }
    : { queue: rated, handoffKey: null };
}
export function continueLectureQueue804(queue) {
  const next = queue.sections[queue.sectionIndex + 1];
  if (queue.remaining.length || !next) return queue;
  return chooseLectureSection804(queue, next.key);
}
