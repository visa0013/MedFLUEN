import {eventHasDetails791} from './calendar-details791';
test('a plain one-day event keeps secondary options closed',()=>{
  expect(eventHasDetails791({date:'2026-09-27',endDate:'2026-09-27',type:'study',recurrence:'none'})).toBe(false);
});
test('editing existing recurrence or multi-day events exposes their saved details',()=>{
  expect(eventHasDetails791({date:'2026-09-27',endDate:'2026-09-28'})).toBe(true);
  expect(eventHasDetails791({recurrence:'weekly'})).toBe(true);
  expect(eventHasDetails791({lectureId:'N1'})).toBe(true);
  expect(eventHasDetails791({type:'exam'})).toBe(true);
  expect(eventHasDetails791({description:'Min eksisterende note'})).toBe(true);
});
