import { annualActivity791 } from './annualActivity791';

test('the annual activity calendar places January on the left and December on the right', () => {
  const result = annualActivity791([], new Date(2026, 8, 27), 'da');
  expect(result.year).toBe(2026);
  expect(result.weekCount).toBe(53);
  expect(result.cells.filter(cell => !cell.outsideYear)).toHaveLength(365);
  expect(result.cells.find(cell => !cell.outsideYear).date).toBe('2026-01-01');
  expect(result.cells.filter(cell => !cell.outsideYear).at(-1).date).toBe('2026-12-31');
  expect(result.monthLabels.filter(Boolean)).toHaveLength(12);
  expect(result.monthLabels[0]).toMatch(/^jan/i);
  expect(result.monthLabels.filter(Boolean).at(-1)).toMatch(/^dec/i);
  expect(result.cells.slice(0, 3).every(cell => cell.outsideYear)).toBe(true);
});

test('the calendar shows actual review totals and excludes undone reviews and other years', () => {
  const result = annualActivity791([
    { id: 'a', reviewedAt: new Date(2026, 0, 1, 10).getTime(), seconds: 20 },
    { eventId: 'a', reviewedAt: new Date(2026, 0, 1, 10).getTime(), seconds: 20 },
    { id: 'b', reviewed_at: new Date(2026, 0, 1, 11).toISOString(), duration_seconds: 40 },
    { id: 'c', reviewedAt: new Date(2026, 0, 1, 12).getTime(), seconds: 30 },
    { id: 'undo', reverses_review_id: 'c', reviewedAt: new Date(2026, 0, 2).getTime() },
    { id: 'old', reviewedAt: new Date(2025, 11, 31).getTime(), seconds: 100 },
    { id: 'invalid', reviewedAt: 'invalid', seconds: 50 },
    { id: 'future', reviewedAt: new Date(2026, 11, 1).getTime(), seconds: 90 },
  ], new Date(2026, 8, 27));
  expect(result.cells.find(cell => cell.date === '2026-01-01')).toMatchObject({ count: 2, seconds: 60, outsideYear: false });
  expect(result.cells.find(cell => cell.date === '2026-01-02')).toMatchObject({ count: 0, seconds: 0 });
  expect(result.cells.filter(cell => cell.outsideYear).every(cell => cell.count === 0)).toBe(true);
  expect(result.cells.find(cell => cell.date === '2026-12-01').future).toBe(true);
  expect(result.cells.find(cell => cell.date === '2026-12-01').count).toBe(0);
});

test('leap years include February 29 and allow the 54th calendar week when needed', () => {
  const result = annualActivity791([], new Date(2012, 5, 1), 'en');
  expect(result.weekCount).toBe(54);
  expect(result.cells.filter(cell => !cell.outsideYear)).toHaveLength(366);
  expect(result.cells.find(cell => cell.date === '2012-02-29')).toMatchObject({ outsideYear: false, count: 0 });
  expect(result.monthLabels.filter(Boolean)).toHaveLength(12);
});
