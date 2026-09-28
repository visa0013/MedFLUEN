import { convertAnkiCollection792, persistAnkiBatch792, checkAnkiFile792, parseAnkiPackage792 } from './ankiImport792';
import JSZip from 'jszip';
const initSqlJs = require('sql.js/dist/sql-asm.js');

const basic = { id: 10, name: 'Basic', type: 0, flds: [{ name: 'Front' }, { name: 'Back' }], tmpls: [{ ord: 0, qfmt: '{{Front}}', afmt: '{{FrontSide}}<hr>{{Back}}' }] };
const context = { moduleId: 'K5', language: 'da' };
function collection(model = basic, fields = 'What?\x1fAnswer', cards = [{ id: 30, nid: 20, did: 5, ord: 0 }]) {
  return { models: { 10: model }, decks: { 5: { name: 'Medicine::Basics' } }, notes: [{ id: 20, guid: 'unique-guid', mid: 10, tags: ' neuro revision ', flds: fields }], cards };
}
test('basic cards retain fronts, backs, rich formatting, tags and source deck; stable IDs flag duplicates', () => {
  const preview = convertAnkiCollection792(collection(basic, '<b>What?</b>\x1fAnswer'), context);
  expect(preview.cards[0]).toMatchObject({ cardType: 'basic', front: { da: 'What?' }, back: { da: 'Answer' }, tags: ['neuro', 'revision'], richContent: { front: { da: '<b>What?</b>' } } });
  expect(preview.cards[0].sourceDeck).toBe('Medicine::Basics');
  const duplicate = convertAnkiCollection792(collection(), { ...context, existingIds: [preview.cards[0].cardId] });
  expect(duplicate.cards).toHaveLength(0);
  expect(duplicate.duplicates).toBe(1);
});
test('each cloze card hides only its own deletion', () => {
  const model = { ...basic, type: 1, name: 'Cloze', flds: [{ name: 'Text' }, { name: 'Extra' }], tmpls: [{ qfmt: '{{cloze:Text}}', afmt: '{{cloze:Text}}<br>{{Extra}}' }] };
  const result = convertAnkiCollection792(collection(model, '{{c1::one}} and {{c2::two::hint}}\x1fExplanation', [{ id: 30, nid: 20, did: 5, ord: 0 }, { id: 31, nid: 20, did: 5, ord: 1 }]), context);
  expect(result.cards.map(c => c.front.da)).toEqual(['{{c1::one}} and two', 'one and {{c1::two::hint}}']);
  expect(result.cards.map(c => c.cardType)).toEqual(['cloze', 'cloze']);
});
test('declared MCQ fields import options and correct answer without guessing; arbitrary custom templates are skipped', () => {
  const model = { ...basic, name: 'MCQ', flds: ['Question', 'OptionA', 'OptionB', 'Correct', 'Explanation'].map(name => ({ name })), tmpls: [{ ord: 0, qfmt: '{{Question}}', afmt: '{{Correct}}' }] };
  expect(convertAnkiCollection792(collection(model, 'Which?\x1fFirst\x1fSecond\x1fB\x1fBecause'), context).cards[0]).toMatchObject({ cardType: 'mcq', options: [{ da: 'First' }, { da: 'Second' }], correct: 1 });
  const unsupported = convertAnkiCollection792(collection({ ...basic, tmpls: [{ qfmt: '<script>render()</script>{{Front}}', afmt: '{{Back}}' }] }), context);
  expect(unsupported.cards).toEqual([]);
  expect(unsupported.skipped).toBe(1);
  expect(unsupported.warnings.join(' ')).toMatch(/template|skabelon/i);
  const ambiguous = { ...model, flds: ['Question', 'OptionA', 'AnswerA', 'Correct', 'Explanation'].map(name => ({ name })) };
  expect(convertAnkiCollection792(collection(ambiguous, 'Which?\x1fFirst\x1fSecond\x1fA\x1fBecause'), context).cards).toEqual([]);
});
test('embedded images survive sanitizing; missing media is reported and active HTML is removed', () => {
  const result = convertAnkiCollection792(collection(basic, '<img src="photo.png" onerror="alert(1)"><img src="absent.png">\x1fAnswer'), { ...context, media: { 'photo.png': 'data:image/png;base64,iVBORw0KGgo=' } });
  expect(result.cards[0].richContent.front.da).toContain('data:image/png;base64,iVBORw0KGgo=');
  expect(result.cards[0].richContent.front.da).not.toMatch(/onerror|absent.png/);
  expect(result.warnings.join(' ')).toMatch(/absent.png/);
});
test('file boundary rejects other formats, oversized packages and empty files', () => {
  expect(() => checkAnkiFile792({ name: 'cards.csv', size: 50 })).toThrow(/.apkg/);
  expect(() => checkAnkiFile792({ name: 'cards.apkg', size: 30 * 1024 * 1024 })).toThrow(/20 MB/);
  expect(() => checkAnkiFile792({ name: 'cards.apkg', size: 0 })).toThrow();
});
test('batch persistence leaves duplicates intact, scopes ownership, and reports quota failure without losing a recoverable queue', () => {
  const card = convertAnkiCollection792(collection(), context).cards[0];
  const entries = new Map([['cards:user', JSON.stringify([{ ...card, back: { da: 'Edited answer' } }])]]);
  const storage = { getItem: key => entries.get(key) || null, setItem: (key, value) => entries.set(key, value) };
  const duplicate = persistAnkiBatch792(storage, { userId: 'user', storageKey: 'cards:user', queueKey: 'queue:user' }, [card]);
  expect(duplicate).toMatchObject({ imported: 0, duplicates: 1 });
  expect(JSON.parse(entries.get('cards:user'))[0].back.da).toBe('Edited answer');
  storage.setItem = (key, value) => { if (key === 'cards:user') throw Error('quota'); entries.set(key, value); };
  const added = persistAnkiBatch792(storage, { userId: 'user', storageKey: 'cards:user', queueKey: 'queue:user' }, [{ ...card, cardId: 'anki-new' }]);
  expect(added).toMatchObject({ ok: true, imported: 1, recoveryPending: true });
  expect(JSON.parse(entries.get('queue:user'))[0].ownerUserId).toBe('user');
});

test('a real zipped SQLite Anki package is parsed and corrupt or modern compressed packages report actionable errors', async () => {
  const SQL = await initSqlJs(), db = new SQL.Database();
  db.run('CREATE TABLE col (models text, decks text); CREATE TABLE notes (id integer,guid text,mid integer,tags text,flds text); CREATE TABLE cards (id integer,nid integer,did integer,ord integer);');
  db.run('INSERT INTO col VALUES (?,?)', [JSON.stringify({ 10: basic }), JSON.stringify({ 5: { name: 'Medical deck' } })]);
  db.run('INSERT INTO notes VALUES (20,?,?,?,?)', ['real-guid', 10, 'test', 'A real front\x1fA real back']);
  db.run('INSERT INTO cards VALUES (30,20,5,0)');
  const zip = new JSZip(); zip.file('collection.anki2', db.export()); zip.file('media', '{}'); db.close();
  const bytes = await zip.generateAsync({ type: 'uint8array' });
  const file = { name: 'cards.apkg', size: bytes.length, arrayBuffer: async () => bytes.buffer };
  const preview = await parseAnkiPackage792(file, context, { SQL });
  expect(preview.cards[0].front.da).toBe('A real front');
  expect(preview.cards[0].sourceDeck).toBe('Medical deck');
  const modern = new JSZip(); modern.file('collection.anki21b', 'compressed');
  const modernBytes = await modern.generateAsync({ type: 'uint8array' });
  await expect(parseAnkiPackage792({ ...file, size: modernBytes.length, arrayBuffer: async () => modernBytes.buffer }, context, { SQL })).rejects.toThrow(/older Anki|ældre Anki/i);
  await expect(parseAnkiPackage792({ ...file, arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer }, context, { SQL })).rejects.toThrow(/ZIP|beskadiget/i);
});
