// Supplementary learning steps for a guided lecture, not a replacement for
// FSRS's long-term memory history. Ordinary repetition does not use this layer.
export function lectureLearningPreviews804(previews, reset, now) {
  const next = { ...previews };
  const caps = reset ? { 1: 60000, 2: 330000, 3: 600000, 4: 86400000 } : { 1: 60000, 2: 330000 };
  for (const [rating, cap] of Object.entries(caps)) {
    const original = previews[rating] || {};
    const delayMs = Number.isFinite(original.delayMs) ? Math.min(cap, original.delayMs) : cap;
    next[rating] = { ...original, delayMs, dueAt: now + delayMs, newIntervalDays: delayMs >= 86400000 ? 1 : 0 };
  }
  return next;
}
export function lectureRepeatAt804(preview, rating, now) {
  const delay = preview?.delayMs;
  if (rating === 4 || !Number.isFinite(delay) || delay < 0 || delay >= 86400000 || preview.newIntervalDays > 0) return null;
  return now + delay;
}
export function applyLectureDue804(stored, preview, now) {
  if (!Number.isFinite(preview?.delayMs) || preview.delayMs < 0) return stored;
  const dueAt = now + preview.delayMs, dueDate = new Date(dueAt).toISOString();
  return { ...stored, dueDate,
    ...(stored.fsrs ? { fsrs: { ...stored.fsrs, card: { ...stored.fsrs.card, due: dueDate } } } : {}),
    ...(stored.sm2 ? { sm2: { ...stored.sm2, due: dueAt } } : {}),
  };
}
