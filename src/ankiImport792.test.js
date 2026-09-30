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
  expect(() => checkAnkiFile792({ name: 'cards.apkg', size: 140 * 1024 * 1024 })).toThrow(/128 MB/);
  expect(() => checkAnkiFile792({ name: 'cards.apkg', size: 0 })).toThrow();
});

test('numbered basic MCQ becomes structured choices with no duplicate numeric answer', () => {
  const result = convertAnkiCollection792(collection(basic, '<div>3. Hvad er korrekt?</div><div><br></div><div>1) Første valg</div><div>2) <img src="figure.png"> Andet valg</div><div>3) Tredje valg</div>\x1f2'), { ...context, media: { 'figure.png': 'data:image/png;base64,iVBORw0KGgo=' } });
  expect(result.cards[0]).toMatchObject({ cardType: 'mcq', correct: 1, front: { da: '3. Hvad er korrekt?' }, back: { da: '' } });
  expect(result.cards[0].options.map(option => option.da)).toEqual(['Første valg', '[Billede] Andet valg', 'Tredje valg']);
  expect(result.cards[0].richContent.options[1].da).toContain('<img');
});

test('an out-of-range or ambiguous basic answer remains verbatim without guessing', () => {
  const result = convertAnkiCollection792(collection(basic, '<div>Hvad?</div><div>1) Første</div><div>2) Andet</div>\x1f1 eller 2'), context);
  expect(result.cards[0]).toMatchObject({ cardType: 'basic', back: { da: '1 eller 2' } });
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

test('a real zipped SQLite Anki package is parsed and corrupt packages report actionable errors', async () => {
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
  await expect(parseAnkiPackage792({ ...file, arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer }, context, { SQL })).rejects.toThrow(/ZIP|beskadiget/i);
});

function protobufStringFields(values) {
  const bytes = [];
  for (const [index, value] of values.entries()) {
    const encoded = Buffer.from(value, 'utf8');
    bytes.push((index + 1) * 8 + 2, encoded.length, ...encoded);
  }
  return new Uint8Array(bytes);
}

test('modern normalized Anki schema imports MCQ cards from collection.anki21b', async () => {
  const SQL = await initSqlJs(), db = new SQL.Database();
  db.run(`
    CREATE TABLE notetypes (id integer primary key, name text, mtime_secs integer, usn integer, config blob);
    CREATE TABLE fields (ntid integer, ord integer, name text, config blob, primary key(ntid, ord));
    CREATE TABLE templates (ntid integer, ord integer, name text, mtime_secs integer, usn integer, config blob, primary key(ntid, ord));
    CREATE TABLE decks (id integer primary key, name text, mtime_secs integer, usn integer, common blob, kind blob);
    CREATE TABLE notes (id integer primary key, guid text, mid integer, tags text, flds text);
    CREATE TABLE cards (id integer primary key, nid integer, did integer, ord integer);
  `);
  db.run('INSERT INTO notetypes VALUES (?,?,0,0,?)', [10, 'MCQ format', new Uint8Array()]);
  db.run('INSERT INTO fields VALUES (?,?,?,?)', [10, 0, 'Id', new Uint8Array()]);
  db.run('INSERT INTO fields VALUES (?,?,?,?)', [10, 1, 'Question', new Uint8Array()]);
  db.run('INSERT INTO fields VALUES (?,?,?,?)', [10, 2, 'Choices', new Uint8Array()]);
  db.run('INSERT INTO fields VALUES (?,?,?,?)', [10, 3, 'Answer', new Uint8Array()]);
  db.run('INSERT INTO templates VALUES (?,?,?,?,?,?)', [10, 0, 'Card 1', 0, 0, protobufStringFields(['<p>{{Question}}</p><ul>{{Choices}}</ul>', '{{Question}}<hr>{{Answer}}'])]);
  db.run('INSERT INTO decks VALUES (?,?,?,?,?,?)', [5, 'K3::Neurologi', 0, 0, new Uint8Array(), new Uint8Array()]);
  db.run('INSERT INTO notes VALUES (?,?,?,?,?)', [20, 'modern-guid', 10, 'neuro', 'Q1\x1fHvad er korrekt?\x1f<li>A. Første</li><li>B. Andet</li>\x1fB. Andet']);
  db.run('INSERT INTO cards VALUES (?,?,?,?)', [30, 20, 5, 0]);
  const normalized = db.export(); db.close();
  const zip = new JSZip(); zip.file('collection.anki21b', new Uint8Array([1, 2, 3])); zip.file('media', '{}');
  const bytes = await zip.generateAsync({ type: 'uint8array' });
  const file = { name: 'modern.apkg', size: bytes.length, arrayBuffer: async () => bytes.buffer };
  const preview = await parseAnkiPackage792(file, context, { SQL, zstd: { decompress: () => normalized } });
  expect(preview.cards).toHaveLength(1);
  expect(preview.cards[0]).toMatchObject({ cardType: 'mcq', sourceDeck: 'K3::Neurologi', correct: 1, options: [{ da: 'A. Første' }, { da: 'B. Andet' }] });
});

test('AllInOne single-choice fields bypass executable templates and keep images in options', () => {
  const model = { ...basic, name: 'AllInOne (kprim, mc, sc)', flds: ['Question', 'Title', 'QType (0=kprim,1=mc,2=sc)', 'Q_1', 'Q_2', 'Q_3', 'Q_4', 'Q_5', 'Answers', 'Sources', 'Extra 1'].map(name => ({ name })), tmpls: [{ ord: 0, qfmt: '<script>run()</script>', afmt: '<script>run()</script>' }] };
  const result = convertAnkiCollection792(collection(model, 'Hvad er korrekt?\x1f\x1f2\x1fForkert\x1f<img src="figure.png"> Rigtigt\x1f\x1f\x1f\x1f0 1 0 0 0 0\x1fKilde\x1fForklaring'), { ...context, media: { 'figure.png': 'data:image/png;base64,iVBORw0KGgo=' } });
  expect(result.skipped).toBe(0);
  expect(result.cards[0]).toMatchObject({ cardType: 'mcq', correct: 1, explanation: { da: 'Forklaring\nKilde' } });
  expect(result.cards[0].richContent.options[1].da).toContain('data:image/png');
  expect(JSON.stringify(result.cards)).not.toContain('<script');
});

test('audio and video from the package retain controls while remote and active content is stripped', () => {
  const result = convertAnkiCollection792(collection(basic, '[sound:clip.mp3]<video src="film.mp4" autoplay></video><img src="https://tracker.invalid/x">\x1fAnswer'), { ...context, media: { 'clip.mp3': 'data:audio/mpeg;base64,YQ==', 'film.mp4': 'data:video/mp4;base64,YQ==' } });
  const html = document.createElement('template'); html.innerHTML = result.cards[0].richContent.front.da;
  expect(html.content.querySelector('audio').hasAttribute('controls')).toBe(true);
  expect(result.cards[0].richContent.front.da).toContain('<video');
  expect(result.cards[0].richContent.front.da).not.toMatch(/autoplay|tracker/);
});

// Opt-in local compatibility check. The user's package is never added to source
// control or bundled with the app; synthetic tests above run everywhere.
(process.env.MF_ANKI_TEST_FILE ? test : test.skip)('the supplied K3 package imports all 2149 cards and its referenced images', async () => {
  const fs = require('fs'), nodeCrypto = require('crypto');
  const zstd = require('../public/vendor/anki/fzstd/umd/index.js');
  const payload = fs.readFileSync(process.env.MF_ANKI_TEST_FILE);
  const SQL = await initSqlJs();
  const result = await parseAnkiPackage792({ name: 'K3.apkg', size: payload.length, arrayBuffer: async () => new Uint8Array(payload).buffer }, context, { SQL, zstd, digest: data => nodeCrypto.createHash('sha256').update(data).digest() });
  expect(result.total).toBe(2149);
  expect(result.cards).toHaveLength(2149);
  expect(result.skipped).toBe(0);
  expect(result.mediaCount).toBeGreaterThan(900);
  expect(result.cards.filter(card => card.cardType === 'mcq').length).toBeGreaterThan(1000);
  expect(result.cards.some(card => /medfluen-media:/.test(JSON.stringify(card.richContent)))).toBe(true);
  console.info('K3 compatibility:', { ready: result.cards.length, skipped: result.skipped, media: result.mediaCount, warnings: result.warnings });
  result.releaseMedia();
}, 120000);
