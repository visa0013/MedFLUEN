// A Monday-first calendar year, including empty padding cells for full weeks.
export function annualActivity791(events, referenceDate = new Date(), language = 'da') {
  const reference = new Date(referenceDate);
  const year = reference.getFullYear();
  const first = new Date(year, 0, 1, 12);
  const last = new Date(year, 11, 31, 12);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
  const end = new Date(last);
  end.setDate(last.getDate() + ((7 - last.getDay()) % 7));
  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const list = Array.isArray(events) ? events : [];
  const reversed = new Set(list.map(event => event?.reversesReviewId || event?.reverses_review_id).filter(Boolean).map(String));
  const totals = new Map();
  const seen = new Set();
  list.forEach(event => {
    if (!event || event.reversesReviewId || event.reverses_review_id || reversed.has(String(event.id || event.eventId || ''))) return;
    const eventId = String(event.id || event.eventId || '');
    if (eventId && seen.has(eventId)) return;
    const at = event.reviewedAt ?? event.reviewed_at;
    if (at == null) return;
    const date = new Date(at);
    if (Number.isNaN(date.getTime()) || date.getFullYear() !== year || date > reference) return;
    if (eventId) seen.add(eventId);
    const key = dateKey(date), total = totals.get(key) || { count: 0, seconds: 0 };
    total.count += 1;
    const seconds = Number(event.seconds ?? event.duration_seconds);
    total.seconds += Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
    totals.set(key, total);
  });
  const today = new Date(reference); today.setHours(23, 59, 59, 999);
  const cells = [];
  for (const date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    const key = dateKey(date), total = totals.get(key) || { count: 0, seconds: 0 };
    cells.push({ date: key, count: total.count, seconds: Math.round(total.seconds), weekday: date.getDay(), future: date > today, outsideYear: date.getFullYear() !== year });
  }
  const weekCount = cells.length / 7;
  const monthLabels = Array(weekCount).fill('');
  const locale = language === 'en' ? 'en-GB' : language === 'ar' ? 'ar' : 'da-DK';
  cells.forEach((cell, index) => {
    if (!cell.outsideYear && cell.date.endsWith('-01')) monthLabels[Math.floor(index / 7)] = new Date(`${cell.date}T12:00:00`).toLocaleDateString(locale, { month: 'short' });
  });
  return { year, cells, weekCount, monthLabels };
}
