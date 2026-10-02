import { createLectureQueue804, rateLectureQueue804, continueLectureQueue804, lectureQueueView804, chooseLectureSection804 } from './lectureJourney804';
const cards = ['a1', 'a2', 'b1'].map((id, i) => ({ id, lectureContent: { packageId: 'p', target: { moduleId: 'K5', lectureId: 'N4' }, section: { id: i < 2 ? 'a' : 'b', title: i < 2 ? 'Grundlag' : 'Diagnostik', order: i < 2 ? 1 : 2 }, card: { order: i } } }));
const aKey = '["K5","N4","p","a"]', bKey = '["K5","N4","p","b"]';
test.each([1, 2])('rating %i repeats after the other cards without leaving the section', rating => {
  const start = createLectureQueue804(cards);
  const repeated = rateLectureQueue804(start, rating);
  expect(repeated.remaining).toEqual(['a2', 'a1']);
  const next = rateLectureQueue804(repeated, 3);
  expect(next.remaining).toEqual(['a1']);
  expect(next.sectionIndex).toBe(0);
  expect(rateLectureQueue804(next, 4).remaining).toEqual([]);
  expect(continueLectureQueue804(rateLectureQueue804(next, 4)).remaining).toEqual(['b1']);
  expect(start.remaining).toEqual(['a1', 'a2']);
});
test('a one-card hard answer repeats and final success awaits an explicit section transition', () => {
  const start = createLectureQueue804([cards[2]]);
  expect(rateLectureQueue804(start, 2).remaining).toEqual(['b1']);
  const end = rateLectureQueue804(start, 3);
  expect(end.remaining).toEqual([]);
  expect(continueLectureQueue804(end)).toEqual(end);
});
test('resume retains repeated cards and migration starts at the legacy position', () => {
  const repeated = rateLectureQueue804(createLectureQueue804(cards), 2);
  expect(createLectureQueue804(cards, JSON.parse(JSON.stringify(repeated)))).toEqual(repeated);
  expect(createLectureQueue804(cards, null, 1).remaining).toEqual(['a2']);
  expect(createLectureQueue804(cards, { ...repeated, remaining: ['deleted'] }).remaining).toEqual(['a1', 'a2']);
});
test('a pending transition survives refresh and skip does not requeue a buried card', () => {
  const end = rateLectureQueue804(rateLectureQueue804(createLectureQueue804(cards), 3), 3);
  expect(createLectureQueue804(cards, end).remaining).toEqual([]);
  expect(rateLectureQueue804(createLectureQueue804(cards), null).remaining).toEqual(['a2']);
  expect(continueLectureQueue804(createLectureQueue804(cards))).toEqual(createLectureQueue804(cards));
});
test('a ten-minute Good answer remains in the section but does not appear before it is due', () => {
  const start = createLectureQueue804(cards);
  const waiting = rateLectureQueue804(start, 3, { currentId: 'a1', repeatAt: 601000 });
  expect(waiting.remaining).toEqual(['a2', 'a1']);
  expect(lectureQueueView804(waiting, 1000).currentId).toBe('a2');
  const onlyRepeat = rateLectureQueue804(waiting, 4, { currentId: 'a2' });
  expect(lectureQueueView804(onlyRepeat, 600999)).toMatchObject({ currentId: null, nextDue: 601000 });
  expect(lectureQueueView804(onlyRepeat, 601000).currentId).toBe('a1');
  expect(onlyRepeat.completedKeys).not.toContain(aKey);
});
test('jumping to a different section preserves its pending repetitions through refresh', () => {
  const waiting = rateLectureQueue804(createLectureQueue804(cards), 2, { currentId: 'a1', repeatAt: 331000 });
  const elsewhere = chooseLectureSection804(waiting, bKey);
  expect(elsewhere.remaining).toEqual(['b1']);
  const restored = createLectureQueue804(cards, JSON.parse(JSON.stringify(elsewhere)));
  const back = chooseLectureSection804(restored, aKey);
  expect(back.remaining).toEqual(['a2', 'a1']);
  expect(lectureQueueView804(back, 1000).currentId).toBe('a2');
  expect(back.resetById.a1).toBe(true);
});
test('roadmap completion only follows day-based success, not a rating or a section jump', () => {
  const queue = rateLectureQueue804(rateLectureQueue804(createLectureQueue804(cards), 4), 4);
  expect(queue.completedKeys).toEqual([aKey]);
  expect(chooseLectureSection804(queue, bKey).completedKeys).toEqual([aKey]);
});
test('an older single-section run expands to the whole lecture without losing pending repetitions', () => {
  const older = rateLectureQueue804(createLectureQueue804(cards.slice(0, 2)), 2, { currentId: 'a1', repeatAt: 331000 });
  const expanded = createLectureQueue804(cards, older);
  expect(expanded.remaining).toEqual(['a2', 'a1']);
  expect(expanded.dueById.a1).toBe(331000);
  expect(chooseLectureSection804(expanded, bKey).remaining).toEqual(['b1']);
});
test('an older completed queue marks only its known completed section on the roadmap', () => {
  const older = { sections: createLectureQueue804(cards).sections, sectionIndex: 0, remaining: [] };
  const restored = createLectureQueue804(cards, older);
  expect(restored.completedKeys).toEqual([aKey]);
  expect(chooseLectureSection804(restored, bKey).remaining).toEqual(['b1']);
});
test('saved empty section queues retain completion even when an older progress marker was missing', () => {
  const saved = chooseLectureSection804(rateLectureQueue804(rateLectureQueue804(createLectureQueue804(cards), 4), 4), bKey);
  saved.completedKeys = [];
  expect(createLectureQueue804(cards, saved).completedKeys).toEqual([aKey]);
});
