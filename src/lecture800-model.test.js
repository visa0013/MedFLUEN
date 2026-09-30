import { validateLecture800, lectureRecords800, mergeLecture800, lectureSections800, lectureStudyCards800, reconcileForgotten800, parseLectureFile800 } from './lecture800-model';
import JSZip from 'jszip';

export const package800 = () => ({ format: 'medfluen-lecture', version: 1, packageId: 'lecture-a', lecture: { moduleId: 'K5', lectureId: 'N2', title: 'Muskelsygdomme' }, sources: [{ id: 'pdf', filename: 'forelaesning.pdf', pageCount: 20 }], sections: [{ id: 'diagnosis', title: 'Diagnostik', order: 2 }, { id: 'disease', title: 'Sygdommen', order: 1 }], glossary: [{ id: 'term', term: 'Fagord', definition: 'En kildebaseret definition.', sourceRefs: [{ sourceId: 'pdf', page: 2 }] }], cards: [{ id: 'q2', type: 'basic', sectionId: 'diagnosis', order: 1, question: 'Hvad viser undersøgelsen?', answer: 'Et svar fra kilden.', sourceRefs: [{ sourceId: 'pdf', page: 4 }] }, { id: 'q1', type: 'recall-list', sectionId: 'disease', order: 1, question: 'Hvilke undergrupper findes af [[term|fagordet]]?', answerItems: [{ id: 'a', text: 'Første gruppe' }, { id: 'b', text: 'Anden gruppe' }], sourceRefs: [{ sourceId: 'pdf', page: 2 }] }], assets: [], warnings: [] });
const target = { moduleId: 'K5', lectureId: 'N2', title: 'Muskelsygdomme' };
test('accepts MedFLUENs real module names including spaces', () => {
  const pack = package800(); pack.lecture.moduleId = 'K5 Nervesystem og psykiatri';
  expect(validateLecture800(pack).lecture.moduleId).toBe('K5 Nervesystem og psykiatri');
});

test('validates every source, glossary and image reference rather than silently dropping cards', () => {
  const pack = package800();
  expect(validateLecture800(pack).cards).toHaveLength(2);
  pack.cards[0].sourceRefs[0].page = 21;
  expect(() => validateLecture800(pack)).toThrow(/side/i);
  pack.cards[0].sourceRefs[0].page = 4;
  pack.cards[1].question = 'Hvad er [[unknown|ordet]]?';
  expect(() => validateLecture800(pack)).toThrow(/definition|glosar/i);
});
test('rejects unknown versions, missing assets, duplicate identities and unsafe paths', () => {
  const pack = package800(); pack.version = 2;
  expect(() => validateLecture800(pack)).toThrow(/version/i);
  pack.version = 1; pack.cards[0].assetIds = ['missing'];
  expect(() => validateLecture800(pack)).toThrow(/billede/i);
  delete pack.cards[0].assetIds; pack.cards[1].id = 'q2';
  expect(() => validateLecture800(pack)).toThrow(/unik|dublet/i);
  pack.cards[1].id = 'q1'; pack.assets = [{ id: 'img', path: '../secret.png', mime: 'image/png', role: 'question', alt: 'Figur', sourceRefs: [{ sourceId: 'pdf', page: 2 }] }];
  expect(() => validateLecture800(pack)).toThrow(/sti/i);
});
test('adapts cards into the actual lecture and preserves structured metadata without Anki', () => {
  const rows = lectureRecords800(package800(), { ...target, lectureId: 'N3', title: 'Valgt forelæsning' });
  expect(rows[0].lectureId).toBe('N3');
  expect(rows[0].lectureContent.section.title).toBe('Sygdommen');
  expect(rows[0].lectureContent.card.answerItems).toHaveLength(2);
  expect(rows[0].richContent?.anki).toBeUndefined();
  expect(rows[0].front.da).toContain('fagordet');
});
test('defaults to adding only new cards and updates content without deleting missing cards', () => {
  const old = lectureRecords800(package800(), target);
  const newer = package800(); newer.cards[1].answerItems[0].text = 'Ændret gruppe';
  const incoming = lectureRecords800(newer, target);
  expect(mergeLecture800(old, incoming, 'new').records[0].lectureContent.card.answerItems[0].text).toBe('Første gruppe');
  const update = mergeLecture800(old, incoming.slice(0, 1), 'update');
  expect(update.records).toHaveLength(2);
  expect(update.updated).toBe(1);
  expect(update.records[0].cardId).toBe(old[0].cardId);
});
test('resets forgotten flags only for changed answers', () => {
  const old = lectureRecords800(package800(), target)[0];
  const changed = JSON.parse(JSON.stringify(old)); changed.lectureContent.card.answerItems[0].text = 'Nyt';
  expect(reconcileForgotten800(old, changed, ['a', 'b'])).toEqual(['b']);
});
test('keeps pedagogical order, empty choices empty, and missed-item sessions explicit', () => {
  const rows = lectureRecords800(package800(), target).map(row => ({ ...row, id: row.cardId }));
  const sections = lectureSections800(rows);
  expect(sections.map(s => s.title)).toEqual(['Sygdommen', 'Diagnostik']);
  expect(lectureStudyCards800(rows, sections.map(s => s.key)).map(q => q.lectureContent.card.id)).toEqual(['q1', 'q2']);
  expect(lectureStudyCards800(rows, [])).toEqual([]);
  const missed = { [rows[0].id]: ['b'] };
  expect(lectureStudyCards800(rows, sections.map(s => s.key), missed).map(q => q.id)).toEqual([rows[0].id]);
});
test('reads text-only JSON and refuses standalone image references', async () => {
  const pack = package800();
  const file = { name: 'lecture.json', size: 2000, text: async () => JSON.stringify(pack) };
  expect((await parseLectureFile800(file)).package.cards).toHaveLength(2);
  pack.assets = [{ id: 'img', path: 'images/figure.png', mime: 'image/png', role: 'question', alt: 'Figur', sourceRefs: [{ sourceId: 'pdf', page: 2 }] }];
  await expect(parseLectureFile800(file)).rejects.toThrow(/ZIP/i);
});
test('rejects missing binary images in a ZIP before any import', async () => {
  const pack = package800(); pack.assets = [{ id: 'img', path: 'images/figure.png', mime: 'image/png', role: 'question', alt: 'Figur', sourceRefs: [{ sourceId: 'pdf', page: 2 }] }]; pack.cards[0].assetIds = ['img'];
  const bytes = await new JSZip().file('lecture.json', JSON.stringify(pack)).generateAsync({ type: 'uint8array' });
  await expect(parseLectureFile800({ name: 'lecture.zip', size: bytes.length, arrayBuffer: async () => bytes.buffer })).rejects.toThrow(/figure.png/);
});
