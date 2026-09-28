import { catalogRows79, contentKind79, visibleCurriculumTabs79 } from './curriculum79-model';
import { validateCatalog751 } from './catalog751-model';

test('legacy catalog rows remain lectures, with stable material references', () => {
  const old = { id: 'N1', title: 'Neurologi', group: 'Neurologi', materialId: 'pdf-1' };
  const classRow = { id: 'H1', title: 'Holdtime', group: 'Neurologi', kind: 'class', materialId: 'pdf-2' };
  expect(contentKind79(old)).toBe('lecture');
  expect(catalogRows79([old, classRow], 'class')[0].materialId).toBe('pdf-2');
  expect(validateCatalog751([old, classRow])[0].id).toBe('N1');
});

test('TBL is visible only for graduate context, but the model can still resolve an old direct link', () => {
  expect(visibleCurriculumTabs79('Bachelor', null)).toEqual(['lecture', 'class']);
  expect(visibleCurriculumTabs79('Bachelor', 'Kandidat')).toEqual(['lecture', 'class', 'tbl']);
  expect(contentKind79({ id: 'T1', kind: 'tbl' })).toBe('tbl');
});

test('unknown catalog kind is rejected before saving', () => {
  expect(() => validateCatalog751([{ id: 'N1', title: 'N', group: 'G', kind: 'unknown' }])).toThrow();
});
