import { getClinicalExample796 } from './clinicalShowcase796';

test('the landing sample uses a verified clinical question in every supported language', () => {
  const da = getClinicalExample796('da');
  const en = getClinicalExample796('en');
  const ar = getClinicalExample796('ar');
  expect(da.question).toBe('Hvilken hjernenerve innerverer m. rectus lateralis?');
  expect(da.answer).toBe('N. abducens (VI).');
  expect(en.question).toBe('Which cranial nerve innervates the lateral rectus muscle?');
  expect(ar.question).toContain('العضلة المستقيمة الوحشية');
  expect(da.sourceUrl).toBe('https://www.ncbi.nlm.nih.gov/books/NBK430711/');
  expect(getClinicalExample796('unknown')).toEqual(da);
});
