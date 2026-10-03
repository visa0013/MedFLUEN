import { lectureSections800, lectureStudyCards800, sectionKey800 } from './lecture800-model';
import { createLectureQueue804, chooseLectureSection804 } from './lectureJourney804';

const time = value => {
  if (value == null || value === '') return null;
  const result = typeof value === 'number' ? value : new Date(value).getTime();
  return Number.isFinite(result) ? result : null;
};
const dueTime = stored => time(stored?.fsrs?.card?.due ?? stored?.sm2?.due ?? stored?.due_at ?? stored?.dueAt ?? stored?.dueDate ?? stored?.due);
export const lectureDayKey806 = value => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
function hidden(stored, now) {
  return Boolean(stored?.suspendedAt || stored?.suspended_at || stored?.buried === true
    || String(stored?.sm2?.state || stored?.state).toLowerCase() === 'suspended'
    || (time(stored?.buriedUntil ?? stored?.buried_until) || 0) > now);
}
const orderedCards = cards => lectureStudyCards800(cards, lectureSections800(cards).map(section => section.key));

// Session IDs/section choices restrict practice, never the lecture's catalog.
export function lectureScopeCards806(cards, scope, groupLectureIds = []) {
  return cards.filter(card => card.lectureContent && card.moduleId === scope.moduleId
    && (!scope.lectureFilter || card.lectureId === scope.lectureFilter)
    && (!scope.groupFilter || scope.lectureFilter || groupLectureIds.includes(card.lectureId)));
}
export function clearLectureResume806(storage, storageKey, resumeKey) {
  try {
    const saved = JSON.parse(storage.getItem(storageKey) || 'null');
    if (saved?.resumeKey === resumeKey) storage.removeItem(storageKey);
  } catch { /* A malformed/unrelated record does not belong to this reset. */ }
}
export function restoreLectureResume806(storage, storageKey, resume) {
  try {
    const current = JSON.parse(storage.getItem(storageKey) || 'null');
    if (current && current.resumeKey !== resume.resumeKey) return false;
    storage.setItem(storageKey, JSON.stringify(resume));
    return true;
  } catch { return false; }
}
export function lectureSectionAction806(queue, key, { restart = false, todayOnly = false } = {}) {
  if (queue.completedKeys?.includes(key)) return 'blocked';
  return !queue.sections.some(section => section.key === key) || (todayOnly && restart) ? 'practice' : 'resume';
}
export function lectureEntryCount806(sessionCards, catalog, mode) {
  return sessionCards.length || (mode === 'guide' ? catalog.length : 0);
}
export function firstAvailableLectureSection806(queue, eligibleCards) {
  const eligible = new Set(eligibleCards.map(card => card.id));
  return queue?.sections.find((section, index) => {
    if (queue.completedKeys?.includes(section.key)) return false;
    const pending = index === queue.sectionIndex ? queue.remaining : queue.pendingBySection?.[section.key] ?? section.ids;
    return pending.some(id => eligible.has(id));
  })?.key || null;
}

// Re-scope a saved walkthrough, not just its first destination. Keep completed
// stops for the roadmap, but only today's pending IDs can enter practice or a
// later automatic handoff. Preserve retry order and short-step scheduling.
export function todayLectureRun806(saved, catalog, schedules = {}, options = {}) {
  // Forgotten/review pools have different card membership. Today's Start must
  // create a fresh guide for those modes rather than inherit their snapshots.
  if (options.mode && options.mode !== 'guide') return null;
  const eligible = new Set(lectureTodayCards806(catalog, schedules, options).map(card => card.id));
  const pending = new Map((saved?.sections || []).map((section, index) => [section.key,
    index === saved.sectionIndex ? saved.remaining : saved.pendingBySection?.[section.key] ?? section.ids]));
  const completed = new Set(saved?.completedKeys || []);
  const cards = orderedCards(catalog).filter(card => {
    const key = sectionKey800(card.lectureContent);
    return completed.has(key) || (eligible.has(card.id) && (!pending.has(key) || pending.get(key).includes(card.id)));
  });
  const fresh = createLectureQueue804(cards);
  const pendingBySection = Object.fromEntries(fresh.sections.map(section => [section.key,
    completed.has(section.key) ? [] : pending.has(section.key)
      ? pending.get(section.key).filter(id => eligible.has(id) && section.ids.includes(id)) : [...section.ids]]));
  const pendingIds = new Set(Object.values(pendingBySection).flat());
  const queue = { ...fresh, pendingBySection,
    remaining: pendingBySection[fresh.sections[fresh.sectionIndex]?.key] || [],
    completedKeys: fresh.sections.filter(section => completed.has(section.key)).map(section => section.key),
    dueById: Object.fromEntries(Object.entries(saved?.dueById || {}).filter(([id]) => pendingIds.has(id))),
    resetById: Object.fromEntries(Object.entries(saved?.resetById || {}).filter(([id]) => pendingIds.has(id))) };
  const key = firstAvailableLectureSection806(queue, cards.filter(card => eligible.has(card.id)));
  return { cards, key, queue: key ? chooseLectureSection804(queue, key) : queue };
}

export function lectureTodayCards806(cards, schedules = {}, { now = Date.now(), buried = {} } = {}) {
  const tomorrow = new Date(now); tomorrow.setHours(24, 0, 0, 0);
  return orderedCards(cards).filter(card => {
    const stored = schedules[card.id], due = dueTime(stored);
    return !buried[card.id] && !hidden(stored, now) && (due == null || due < tomorrow.getTime());
  });
}
export function restoreLecturePlan806(plan, cards) {
  return plan?.mode === 'guide' && !plan.todayOnly
    ? { ...plan, keys: lectureSections800(cards).map(section => section.key), questionIds: cards.map(card => card.id) }
    : plan;
}
export function resetLectureProgress806(data, cards) {
  const next = { ...data };
  for (const card of cards) delete next[card.id];
  return next;
}
export function restoreLectureProgress806(data, snapshot, cards) {
  const next = resetLectureProgress806(data, cards);
  for (const card of cards) if (Object.prototype.hasOwnProperty.call(snapshot, card.id)) next[card.id] = snapshot[card.id];
  return next;
}

function reviewsFor(stored) {
  const records = Array.isArray(stored?.fsrs?.reviews) && stored.fsrs.reviews.length
    ? stored.fsrs.reviews : stored?.sm2?.reviewLog || stored?.reviewLog || [];
  const reversed = new Set(records.map(review => review.reversesReviewId || review.reverses_review_id).filter(Boolean));
  const reviews = records.filter(review => !review.reversesReviewId && !review.reverses_review_id && !reversed.has(review.id))
    .map(review => time(review.review ?? review.timestamp ?? review.reviewedAt)).filter(at => at != null);
  // FSRS truncates its log at 500; reps is the lifetime count. Do not treat
  // legacy correct-in-a-row repetitions as a lifetime review count.
  const count = Math.max(reviews.length, Number(stored?.fsrs?.card?.reps) || 0, stored?.fsrs ? Number(stored.repetitions) || 0 : 0);
  return { count, reviews };
}

export function lectureProgress806(cards, schedules = {}, { now = Date.now(), buried = {} } = {}) {
  const today = new Date(now); today.setHours(0, 0, 0, 0);
  const days = Array.from({ length: 22 }, (_, index) => {
    const date = new Date(today); date.setDate(date.getDate() + index - 7);
    return { key: lectureDayKey806(date), at: date.getTime(), offset: index - 7, reviews: 0, scheduled: 0 };
  });
  const byDay = new Map(days.map(day => [day.key, day]));
  const rows = orderedCards(cards).map(card => {
    const stored = schedules[card.id], due = dueTime(stored), history = reviewsFor(stored);
    const unavailable = Boolean(buried[card.id]) || hidden(stored, now);
    const availableOn = unavailable ? null : lectureDayKey806(Math.max(today.getTime(), due ?? now));
    const content = card.lectureContent;
    history.reviews.forEach(at => { const day = byDay.get(lectureDayKey806(at)); if (day) day.reviews++; });
    if (availableOn && byDay.has(availableOn)) byDay.get(availableOn).scheduled++;
    return { id: card.id, sectionKey: sectionKey800(content), sectionTitle: content.section.title,
      question: content.card.question.replace(/\[\[[^|]+\|([^\]]+)\]\]/g, '$1'), due,
      availableOn, hidden: unavailable, reviews: history.count, reviewDays: history.reviews.map(lectureDayKey806) };
  });
  const futureDue = rows.filter(row => !row.hidden && row.availableOn > days[7].key).map(row => row.due);
  return { total: rows.length, todayCount: rows.filter(row => row.availableOn === days[7].key).length,
    totalReviews: rows.reduce((sum, row) => sum + row.reviews, 0), studiedCount: rows.filter(row => row.reviews > 0).length,
    nextDue: futureDue.length ? Math.min(...futureDue) : null,
    laterCount: rows.filter(row => row.availableOn > days[days.length - 1].key).length,
    todayKey: days[7].key, now, days, rows };
}
