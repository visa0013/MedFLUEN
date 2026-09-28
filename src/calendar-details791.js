export function eventHasDetails791(event={}) {
  return Boolean(event.location || event.url || event.description || event.reminderMinutes || event.attachmentUrl || event.lectureId || (event.recurrence && event.recurrence !== 'none') || (event.endDate && event.endDate !== event.date) || (event.type && event.type !== 'study'));
}
