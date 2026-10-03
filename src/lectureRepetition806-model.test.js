import { lectureTodayCards806, lectureProgress806, resetLectureProgress806, restoreLectureProgress806, restoreLecturePlan806, lectureScopeCards806, clearLectureResume806, restoreLectureResume806, lectureSectionAction806, lectureEntryCount806, firstAvailableLectureSection806, todayLectureRun806 } from './lectureRepetition806-model';
import { lectureSessionCards800, sectionKey800 } from './lecture800-model';
import { createLectureQueue804, chooseLectureSection804, rateLectureQueue804, rateLectureRun804 } from './lectureJourney804';

const now = new Date(2026, 9, 3, 14).getTime();
const tomorrow = new Date(2026, 9, 4).getTime();
const card = (id, sectionOrder, order) => ({ id, lectureContent: { packageId: 'p', target: { moduleId: 'K5', lectureId: 'N4', title: 'Epilepsi' }, section: { id: `s${sectionOrder}`, order: sectionOrder, title: `Sektion ${sectionOrder}` }, card: { question: `Spørgsmål ${id}`, order } } });
const cards = [card('b', 2, 1), card('a2', 1, 2), card('a1', 1, 1), card('c', 3, 1), card('hidden', 4, 1)];
const schedules = { a1: { fsrs: { card: { due: new Date(tomorrow).toISOString(), state: 2 } } }, a2: { fsrs: { card: { due: new Date(now + 600000).toISOString(), state: 1 } } }, c: { dueDate: new Date(tomorrow + 86400000).toISOString() }, hidden: { suspendedAt: now } };

test('today-start uses academic order, includes short delays, and excludes tomorrow and hidden cards', () => {
  expect(lectureTodayCards806(cards, schedules, { now }).map(c => c.id)).toEqual(['a2', 'b']);
  expect(lectureTodayCards806(cards, schedules, { now, buried: { a2: true } }).map(c => c.id)).toEqual(['b']);
  expect(lectureTodayCards806(cards, schedules, { now: tomorrow }).map(c => c.id)).toEqual(['a1', 'a2', 'b']);
});
test('Start after a completed section selects the next available queue without restarting completed cards', () => {
  const queue = rateLectureQueue804(rateLectureQueue804(createLectureQueue804([cards[2], cards[1], cards[0], cards[3]]), 4), 4);
  const key = firstAvailableLectureSection806(queue, lectureTodayCards806(cards, schedules, { now }));
  expect(key).toBe('["K5","N4","p","s2"]');
  const continued = chooseLectureSection804(queue, key);
  expect(continued.remaining).toEqual(['b']);
  expect(continued.completedKeys).toEqual(['["K5","N4","p","s1"]']);
});
test('Start retains the pending order and short-step repetitions in an unfinished section', () => {
  const queue = rateLectureQueue804(createLectureQueue804([cards[2], cards[1], cards[0]]), 2, { currentId: 'a1', repeatAt: now + 600000 });
  const key = firstAvailableLectureSection806(queue, lectureTodayCards806(cards, {}, { now }));
  const continued = chooseLectureSection804(queue, key);
  expect(key).toBe('["K5","N4","p","s1"]');
  expect(continued.remaining).toEqual(['a2', 'a1']);
  expect(continued.dueById.a1).toBe(now + 600000);
});
test('Start never selects tomorrow-only, completed, or empty pending sections', () => {
  const queue = createLectureQueue804([cards[2], cards[1], cards[0], cards[3]]);
  expect(firstAvailableLectureSection806(queue, [cards[0]])).toBe('["K5","N4","p","s2"]');
  const completed = { ...queue, completedKeys: ['["K5","N4","p","s2"]'] };
  expect(firstAvailableLectureSection806(completed, [cards[0]])).toBeNull();
  expect(firstAvailableLectureSection806({ ...queue, pendingBySection: { ...queue.pendingBySection, '["K5","N4","p","s2"]': [] } }, [cards[0]])).toBeNull();
  expect(firstAvailableLectureSection806(null, cards)).toBeNull();
});
test('today-start restricts the actual queue and automatic handoffs while preserving completed sections and pending retries', () => {
  const catalog = [card('done', 1, 1), card('retry', 2, 1), card('new', 2, 2), card('future', 2, 3), card('tomorrow-section', 3, 1), card('last', 4, 1)];
  let queue = rateLectureQueue804(createLectureQueue804(catalog), 4);
  queue = chooseLectureSection804(queue, sectionKey800(catalog[1].lectureContent));
  queue = rateLectureQueue804(queue, 2, { currentId: 'retry', repeatAt: now + 600000 });
  const data = { done: { due: tomorrow }, future: { due: tomorrow }, 'tomorrow-section': { due: tomorrow } };
  const run = todayLectureRun806(queue, catalog, data, { now });
  expect(run.key).toBe(sectionKey800(catalog[1].lectureContent));
  expect(run.queue.remaining).toEqual(['new', 'retry']);
  expect(run.queue.dueById.retry).toBe(now + 600000);
  expect(run.queue.resetById.retry).toBe(true);
  expect(run.queue.completedKeys).toEqual([sectionKey800(catalog[0].lectureContent)]);
  expect(run.cards.map(item => item.id)).toEqual(['done', 'retry', 'new', 'last']);
  const restored = createLectureQueue804(run.cards, run.queue);
  expect(restored).toEqual(run.queue);
  const first = rateLectureRun804(restored, 4, { currentId: 'new' });
  expect(first.handoffKey).toBeNull();
  const second = rateLectureRun804(first.queue, 4, { currentId: 'retry' });
  expect(second.handoffKey).toBe(sectionKey800(catalog[5].lectureContent));
  expect(second.queue.remaining).toEqual(['last']);
  expect(rateLectureRun804(second.queue, 4).handoffKey).toBeNull();
});
test('today-start does not reintroduce answered cards or mutate a full saved walkthrough', () => {
  const catalog = [card('answered', 1, 1), card('pending', 1, 2), card('tomorrow', 2, 1)];
  const queue = rateLectureQueue804(createLectureQueue804(catalog), 4);
  const before = JSON.stringify(queue);
  const run = todayLectureRun806(queue, catalog, { tomorrow: { due: tomorrow } }, { now });
  expect(run.cards.map(item => item.id)).toEqual(['pending']);
  expect(run.queue.remaining).toEqual(['pending']);
  expect(JSON.stringify(queue)).toBe(before);
  expect(todayLectureRun806(queue, catalog, { pending: { due: tomorrow }, tomorrow: { due: tomorrow } }, { now }).key).toBeNull();
});
test('Start from forgotten-answer practice must begin a fresh guide instead of mixing incompatible pools', () => {
  const catalog = [card('forgotten', 1, 1), card('ordinary', 2, 1)];
  const queue = createLectureQueue804([catalog[0]]);
  expect(todayLectureRun806(queue, catalog, {}, { now, mode: 'forgotten' })).toBeNull();
  expect(todayLectureRun806(queue, catalog, {}, { now, mode: 'review' })).toBeNull();
  const plan = { mode: 'guide', todayOnly: true, keys: catalog.map(item => sectionKey800(item.lectureContent)), questionIds: lectureTodayCards806(catalog, {}, { now }).map(item => item.id) };
  const pool = lectureSessionCards800(catalog, plan);
  expect(pool.map(item => item.id)).toEqual(['forgotten', 'ordinary']);
  expect(rateLectureRun804(createLectureQueue804(pool), 4).queue.remaining).toEqual(['ordinary']);
});
test('reload retains the exact today-only plan instead of silently expanding it', () => {
  const plan = { mode: 'guide', todayOnly: true, keys: ['x'], questionIds: ['a2', 'b'] };
  expect(restoreLecturePlan806(plan, cards)).toEqual(plan);
  const whole = restoreLecturePlan806({ mode: 'guide', keys: ['x'], questionIds: ['a2'] }, cards);
  expect(whole.questionIds).toEqual(cards.map(c => c.id));
});
test('reset and undo touch only this lecture, preserve content and later changes in other lectures', () => {
  const other = { dueDate: '2026-12-01' };
  const before = { ...schedules, other };
  const reset = resetLectureProgress806(before, cards);
  expect(reset).toEqual({ other });
  expect(before.a1).toBe(schedules.a1);
  const newerOther = { dueDate: '2026-12-05' };
  expect(restoreLectureProgress806({ ...reset, other: newerOther }, before, cards)).toEqual({ ...before, other: newerOther });
  expect(cards[0].lectureContent.card.question).toBe('Spørgsmål b');
});
test('timeline uses actual reviews and due dates, with new and overdue cards in today', () => {
  const data = {
    a1: { fsrs: { card: { due: tomorrow, state: 2, reps: 3 }, reviews: [{ review: now - 86400000, rating: 1 }, { review: now - 3600000, rating: 2 }, { review: now, rating: 3 }] } },
    a2: { dueDate: now - 86400000, sm2: { state: 'review', reviewLog: [{ timestamp: now - 86400000 }, { timestamp: now }] } },
    c: { fsrs: { card: { due: tomorrow + 30 * 86400000, state: 2, reps: 700 }, reviews: [{ review: now }] } },
    hidden: schedules.hidden,
  };
  const result = lectureProgress806(cards, data, { now });
  expect(result.todayCount).toBe(2);
  expect(result.totalReviews).toBe(705);
  expect(result.rows.find(row => row.id === 'b').reviews).toBe(0);
  expect(result.rows.find(row => row.id === 'hidden').hidden).toBe(true);
  expect(result.days.find(day => day.offset === 0)).toMatchObject({ scheduled: 2, reviews: 4 });
  expect(result.days.find(day => day.offset === -1).reviews).toBe(2);
  expect(result.days.find(day => day.offset === 1).scheduled).toBe(1);
  expect(result.laterCount).toBe(1);
  expect(result.nextDue).toBe(tomorrow);
});
test('reversed reviews and invalid dates never invent chart activity', () => {
  const result = lectureProgress806([cards[0]], { b: { fsrs: { card: { due: 'invalid' }, reviews: [{ id: 'one', review: now }, { id: 'undo', review: now, reversesReviewId: 'one' }] } } }, { now });
  expect(result.totalReviews).toBe(0);
  expect(result.days.find(day => day.offset === 0).reviews).toBe(0);
  expect(result.todayCount).toBe(1);
  expect(result.nextDue).toBeNull();
});
test('empty progress is a valid zero-data overview', () => {
  expect(lectureProgress806([], {}, { now })).toMatchObject({ total: 0, todayCount: 0, totalReviews: 0, nextDue: null, laterCount: 0, rows: [] });
});
test('a restored today-only run cannot include tomorrow cards in its session pool', () => {
  const eligible = lectureTodayCards806(cards, schedules, { now });
  const plan = { mode: 'guide', todayOnly: true, keys: eligible.map(c => sectionKey800(c.lectureContent)), questionIds: eligible.map(c => c.id) };
  expect(lectureSessionCards800(cards, restoreLecturePlan806(plan, cards)).map(c => c.id)).toEqual(['a2', 'b']);
});
test('the lecture catalog includes hidden and future cards even when the practice scope selected only one card', () => {
  const catalog = cards.map(c => ({ ...c, moduleId: 'K5', lectureId: 'N4' }));
  const other = { ...catalog[0], id: 'other', lectureId: 'N5' };
  const anotherModule = { ...catalog[0], id: 'elsewhere', moduleId: 'K3' };
  expect(lectureScopeCards806([...catalog, other, anotherModule], { moduleId: 'K5', lectureFilter: 'N4', sessionQuestionIds: ['b'] }).map(c => c.id)).toEqual(cards.map(c => c.id));
  expect(lectureScopeCards806([...catalog, other], { moduleId: 'K5', groupFilter: 'Neurologi' }, ['N4']).map(c => c.id)).toEqual(cards.map(c => c.id));
});
test('forgetting one lecture never clears another lecture account-wide resume', () => {
  const storageKey = 'resume';
  localStorage.setItem(storageKey, JSON.stringify({ resumeKey: 'lecture-a', sectionQueue804: { remaining: ['a'] } }));
  clearLectureResume806(localStorage, storageKey, 'lecture-b');
  expect(JSON.parse(localStorage.getItem(storageKey)).resumeKey).toBe('lecture-a');
  clearLectureResume806(localStorage, storageKey, 'lecture-a');
  expect(localStorage.getItem(storageKey)).toBeNull();
});
test('undo never overwrites another lecture resume and tolerates malformed storage', () => {
  localStorage.setItem('resume', JSON.stringify({ resumeKey: 'lecture-a' }));
  expect(restoreLectureResume806(localStorage, 'resume', { resumeKey: 'lecture-b' })).toBe(false);
  expect(JSON.parse(localStorage.getItem('resume')).resumeKey).toBe('lecture-a');
  localStorage.removeItem('resume');
  expect(restoreLectureResume806(localStorage, 'resume', { resumeKey: 'lecture-b' })).toBe(true);
  localStorage.setItem('resume', '{invalid');
  expect(restoreLectureResume806(localStorage, 'resume', { resumeKey: 'lecture-b' })).toBe(false);
});
test('explicit repeat opens full-section practice while today-only continuation preserves its queue', () => {
  const queue = { sections: [{ key: 'a', ids: ['a2'] }] };
  expect(lectureSectionAction806(queue, 'a', { todayOnly: true, restart: true })).toBe('practice');
  expect(lectureSectionAction806(queue, 'a', { todayOnly: true, restart: false })).toBe('resume');
  expect(lectureSectionAction806(queue, 'a', { todayOnly: false, restart: true })).toBe('resume');
  expect(lectureSectionAction806(queue, 'new')).toBe('practice');
});
test('completed sections cannot be continued or restarted by stale roadmap actions', () => {
  const queue = { sections: [{ key: 'a', ids: ['a2'] }], completedKeys: ['a'] };
  expect(lectureSectionAction806(queue, 'a')).toBe('blocked');
  expect(lectureSectionAction806(queue, 'a', { restart: true, todayOnly: true })).toBe('blocked');
});
test('the lecture overview remains reachable even with no eligible practice cards', () => {
  expect(lectureEntryCount806([], cards, 'guide')).toBe(cards.length);
  expect(lectureEntryCount806([], cards, 'review')).toBe(0);
  expect(lectureEntryCount806([cards[0]], cards, 'guide')).toBe(1);
});
