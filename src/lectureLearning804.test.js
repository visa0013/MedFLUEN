import { lectureLearningPreviews804, lectureRepeatAt804, applyLectureDue804 } from './lectureLearning804';
const day = 86400000;
const previews = { 1: { delayMs: 60000, newIntervalDays: 0 }, 2: { delayMs: day * 3, newIntervalDays: 3 }, 3: { delayMs: day * 7, newIntervalDays: 7 }, 4: { delayMs: day * 10, newIntervalDays: 10 } };
test('Again/Hard reset guided learning to short steps instead of keeping day-long Good/Easy intervals', () => {
  const reset = lectureLearningPreviews804(previews, true, 1000);
  expect([1, 2, 3, 4].map(r => reset[r].delayMs)).toEqual([60000, 330000, 600000, day]);
  expect(lectureRepeatAt804(reset[3], 3, 1000)).toBe(601000);
  expect(lectureRepeatAt804(reset[4], 4, 1000)).toBeNull();
  expect(previews[3].delayMs).toBe(day * 7);
});
test('a regular ten-minute learning step is repeated, while a day-based Good exits the section queue', () => {
  expect(lectureRepeatAt804({ delayMs: 600000, newIntervalDays: 0 }, 3, 1000)).toBe(601000);
  expect(lectureRepeatAt804({ delayMs: day - 1000, newIntervalDays: 1 }, 3, 1000)).toBeNull();
});
test('guided Hard always offers a short retry even for a previously mature card', () => {
  expect(lectureLearningPreviews804(previews, false, 1000)[2].delayMs).toBe(330000);
  expect(lectureLearningPreviews804(previews, false, 1000)[3].delayMs).toBe(day * 7);
});
test('the displayed guided interval is also persisted without replacing FSRS memory or review history', () => {
  const stored = { dueDate: '2030-01-01T00:00:00.000Z', fsrs: { card: { due: '2030-01-01T00:00:00.000Z', stability: 12, difficulty: 5 }, reviews: [{ rating: 2 }] } };
  const next = applyLectureDue804(stored, { delayMs: 600000 }, 1000);
  expect(next.dueDate).toBe('1970-01-01T00:10:01.000Z');
  expect(next.fsrs.card.due).toBe('1970-01-01T00:10:01.000Z');
  expect(next.fsrs.card.stability).toBe(12);
  expect(next.fsrs.reviews).toEqual([{ rating: 2 }]);
  expect(stored.fsrs.card.due).toBe('2030-01-01T00:00:00.000Z');
});
