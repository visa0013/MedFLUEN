import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import pack from '../docs/lecture-packs/epilepsi-kurateret/lecture.json';
import originalIdentity from '../docs/lecture-packs/epilepsi-kurateret/identities.json';
import { parseLectureFile800, lectureRecords800, mergeLecture800, validateLecture800 } from './lecture800-model';

test('the revised curated pack retains all existing review and section identities', () => {
  validateLecture800(pack);
  expect({
    packageId: pack.packageId,
    lecture: pack.lecture,
    sections: pack.sections.map(({ id, order }) => ({ id, order })),
    cards: pack.cards.map(({ id, type, order, sectionId, answerItems, assetIds }) => ({
      id, type, order, sectionId, itemIds: (answerItems || []).map(item => item.id), assetIds,
    })),
  }).toEqual(originalIdentity);
});

test('the downloadable ZIP passes the actual importer and includes every unchanged figure', async () => {
  const bytes = fs.readFileSync(path.join(__dirname, '../public/lecture-packs/N4-Epilepsi-Kurateret-Opdateret.zip'));
  const uploadBytes = new Uint8Array(bytes);
  const parsed = await parseLectureFile800({
    name: 'N4-Epilepsi-Kurateret-Opdateret.zip', size: bytes.length,
    arrayBuffer: async () => uploadBytes.buffer,
  }, { digest: value => crypto.createHash('sha256').update(value).digest() });
  expect(parsed.package).toEqual(pack);
  expect([...parsed.media.keys()].sort()).toEqual(pack.assets.map(asset => asset.id).sort());
  expect(parsed.mediaHashes.size).toBe(7);
  const records = lectureRecords800(parsed.package, pack.lecture, parsed.mediaHashes);
  expect(records).toHaveLength(74);
  for (const record of records) for (const asset of record.lectureContent.assets) {
    expect(asset.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(parsed.media.get(asset.id)).toBeInstanceOf(Blob);
  }
});

test('reimport replaces content without changing schedule keys or duplicating cards', () => {
  const incoming = lectureRecords800(pack, pack.lecture);
  const previous = incoming.map(record => ({
    ...record, createdAt: '2026-09-01T00:00:00.000Z',
    lectureContent: { ...record.lectureContent, glossary: [] },
  }));
  const schedule = new Map(previous.map(record => [record.cardId, { due: '2026-10-08T10:00:00.000Z', reps: 7, stability: 4.5 }]));
  const result = mergeLecture800(previous, incoming, 'update');
  expect(result.added).toBe(0);
  expect(result.updated).toBe(74);
  expect(result.records).toHaveLength(74);
  expect(result.records.map(record => record.cardId)).toEqual(previous.map(record => record.cardId));
  for (const record of result.records) {
    expect(record.createdAt).toBe('2026-09-01T00:00:00.000Z');
    expect(record.lectureContent.glossary).toEqual(pack.glossary);
    expect(schedule.get(record.cardId)).toEqual({ due: '2026-10-08T10:00:00.000Z', reps: 7, stability: 4.5 });
  }
  expect(mergeLecture800(result.records, incoming, 'update').updated).toBe(0);
});

test('definitions cannot leak through questions, options or section previews', () => {
  const hiddenSideTexts = [
    ...pack.cards.flatMap(card => [card.question, ...(card.options || []).map(option => option.text)]),
    ...pack.sections.map(section => section.summary), ...pack.glossary.map(term => term.definition),
  ];
  for (const text of hiddenSideTexts) expect(text).not.toMatch(/\[\[|\]\]/);
});
