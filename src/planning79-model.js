function localDate79(date) {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const value = new Date(`${date}T12:00:00`);
  if (Number.isNaN(value.getTime())) return null;
  const actual = `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  return actual === date ? value : null;
}

function dateKey79(value) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

export function calendarView79(raw, today = new Date()) {
  const date = localDate79(raw?.lastDate);
  const fallback = today instanceof Date && !Number.isNaN(today.getTime()) ? today : new Date();
  return {
    date: date ? dateKey79(date) : dateKey79(fallback),
    view: ['day', 'week', 'month'].includes(raw?.lastView) ? raw.lastView : 'day',
    filters: raw?.layers && typeof raw.layers === 'object' && !Array.isArray(raw.layers) ? { ...raw.layers } : {},
  };
}

export function shiftCalendar79(date, view, delta) {
  const current = localDate79(date);
  if (!current || !Number.isInteger(delta)) return date;
  if (view === 'month') {
    const target = new Date(current.getFullYear(), current.getMonth() + delta, 1, 12);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0, 12).getDate();
    target.setDate(Math.min(current.getDate(), lastDay));
    return dateKey79(target);
  }
  current.setDate(current.getDate() + delta * (view === 'week' ? 7 : 1));
  return dateKey79(current);
}

export function planCollision79(existing, proposed) {
  return (Array.isArray(existing) ? existing : []).flatMap(plan =>
    (Array.isArray(proposed) ? proposed : []).filter(event => {
      const pStart = Date.parse(plan?.start);
      const pEnd = Date.parse(plan?.end);
      const eStart = Date.parse(event?.start);
      const eEnd = Date.parse(event?.end);
      return [pStart, pEnd, eStart, eEnd].every(Number.isFinite) && pStart < eEnd && eStart < pEnd;
    }).map(event => ({ planId: plan.id, eventId: event.id, start: plan.start }))
  );
}
