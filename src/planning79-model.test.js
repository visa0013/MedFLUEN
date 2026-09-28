import { calendarView79, planCollision79, shiftCalendar79 } from './planning79-model';

describe('shared calendar state', () => {
  test('restores a valid date and view, but falls back for invalid storage', () => {
    expect(calendarView79({ lastDate: '2026-09-24', lastView: 'week', layers: { sdu: false } }, new Date('2026-09-25T12:00:00'))).toEqual({
      date: '2026-09-24', view: 'week', filters: { sdu: false },
    });
    expect(calendarView79({ lastDate: '2026-02-31', lastView: 'broken' }, new Date('2026-09-25T12:00:00'))).toEqual({
      date: '2026-09-25', view: 'day', filters: {},
    });
  });

  test('shifting the calendar updates the shared date for every view', () => {
    expect(shiftCalendar79('2026-09-24', 'day', 1)).toBe('2026-09-25');
    expect(shiftCalendar79('2026-09-24', 'week', -1)).toBe('2026-09-17');
    expect(shiftCalendar79('2026-01-31', 'month', 1)).toBe('2026-02-28');
  });

  test('finds overlap without changing either schedule', () => {
    const existing = [{ id: 'p', start: '2026-09-24T10:00:00', end: '2026-09-24T11:00:00' }];
    const proposed = [{ id: 's', start: '2026-09-24T10:30:00', end: '2026-09-24T11:30:00' }];
    const snapshot = JSON.stringify(existing);
    expect(planCollision79(existing, proposed)).toEqual([{ planId: 'p', eventId: 's', start: existing[0].start }]);
    expect(JSON.stringify(existing)).toBe(snapshot);
  });
});
