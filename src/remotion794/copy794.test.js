import {getCinemaCopy794} from './copy794';

test('the cinematic study sample follows the chosen language and falls back to Danish', () => {
  expect(getCinemaCopy794('da').question).toBe('Hvilken hjernenerve innerverer m. rectus lateralis?');
  expect(getCinemaCopy794('da').answer).toBe('N. abducens (VI).');
  expect(getCinemaCopy794('en').question).toBe('Which cranial nerve innervates the lateral rectus muscle?');
  expect(getCinemaCopy794('ar').question).toContain('العضلة المستقيمة الوحشية');
  expect(getCinemaCopy794('unknown').question).toBe('Hvilken hjernenerve innerverer m. rectus lateralis?');
});
