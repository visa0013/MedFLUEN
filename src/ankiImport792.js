import { sanitizeRich72, richText72 } from './experience72-model';
import JSZip from 'jszip';

export const ANKI_LIMITS792 = { compressed: 20 * 1024 * 1024, expanded: 32 * 1024 * 1024, cards: 2000, persisted: 3 * 1024 * 1024, entries: 5000 };
export function checkAnkiFile792(file) {
  if (!/\.apkg$/i.test(file?.name || '')) throw Error('Vælg en Anki-fil (.apkg). Andre formater understøttes senere.');
  if (!file.size) throw Error('Anki-filen er tom.');
  if (file.size > ANKI_LIMITS792.compressed) throw Error('Anki-filen må højst fylde 20 MB.');
}
const local = (value, language) => ({ [language]: value });
function stableId(guid, ordinal) {
  // GUID is the Anki note identity; retain it reversibly, independent of package/deck names.
  return `anki-${encodeURIComponent(String(guid))}-${ordinal}`;
}
function templateFields(template, fields, frontSide = '') {
  if (/<(?:script|iframe|object|input|button)\b|\{\{[#/^]|\{\{(?:type|hint|tts):/i.test(template)) throw Error('custom-template');
  return template.replace(/\{\{([^}]+)\}\}/g, (_, token) => {
    if (token === 'FrontSide') return frontSide;
    const name = token.replace(/^(?:cloze|text):/, '');
    if (!Object.prototype.hasOwnProperty.call(fields, name)) throw Error('custom-template');
    return fields[name];
  });
}
export function convertAnkiCollection792(collection, context = {}) {
  const language = context.language || 'da', media = context.media || {};
  const warnings = new Set(context.warnings || []), known = new Set(context.existingIds || []);
  const result = { cards: [], duplicates: 0, skipped: 0, warnings: [], total: collection.cards.length };
  const notes = new Map(collection.notes.map(note => [String(note.id), note]));
  const clean = value => {
    const node = document.createElement('template'); node.innerHTML = String(value || '').replace(/\[sound:([^\]]+)\]/g, (_, name) => { warnings.add(`Lyd understøttes ikke: ${name}`); return '[Lyd]'; });
    node.content.querySelectorAll('img').forEach(img => {
      const name = img.getAttribute('src') || '';
      if (media[name]) img.setAttribute('src', media[name]);
      else { warnings.add(`Billede mangler eller understøttes ikke: ${name}`); img.remove(); }
    });
    if (node.content.querySelector('audio,video,svg,math')) warnings.add('Lyd, video, SVG og matematiske specialvisninger understøttes ikke.');
    return sanitizeRich72(node.innerHTML);
  };
  for (const card of collection.cards) {
    const note = notes.get(String(card.nid)), model = collection.models[note?.mid];
    try {
      if (!note?.guid || !model?.flds || !model?.tmpls?.length) throw Error('unknown-model');
      const cardId = stableId(note.guid, card.ord);
      if (known.has(cardId)) { result.duplicates++; continue; }
      const values = String(note.flds || '').split('\x1f');
      if (values.length !== model.flds.length || values.some(value => value.length > 200000)) throw Error('fields');
      const fields = Object.fromEntries(model.flds.map((field, i) => [field.name, values[i]]));
      const template = model.type === 1 ? model.tmpls[0] : model.tmpls.find(item => Number(item.ord ?? 0) === Number(card.ord));
      if (!template) throw Error('custom-template');
      let type = 'basic', options = [], correct = 0;
      let front = templateFields(template.qfmt, fields), back = templateFields(template.afmt, fields, '');
      const optionFields = model.flds.map(field => field.name).filter(name => /^(?:Option|Answer)[A-H]$/i.test(name)).sort();
      const correctField = model.flds.find(field => /^(Correct|CorrectAnswer)$/i.test(field.name));
      if (correctField && optionFields.length >= 2) {
        if (new Set(optionFields.map(name => name.slice(-1).toUpperCase())).size !== optionFields.length) throw Error('mcq-key');
        type = 'mcq'; options = optionFields.map(name => local(richText72(clean(fields[name])), language));
        const key = richText72(fields[correctField.name]).trim();
        correct = /^[A-H]$/i.test(key) ? optionFields.findIndex(name => name.slice(-1).toUpperCase() === key.toUpperCase()) : /^\d$/.test(key) ? Number(key) - 1 : -1;
        if (correct < 0 || correct >= options.length || options.some(option => !option[language])) throw Error('mcq-key');
        back = fields.Explanation || fields.Extra || '';
      } else if (model.type === 1) {
        type = 'cloze'; const target = Number(card.ord) + 1;
        if (!new RegExp(`\\{\\{c${target}::`).test(front)) throw Error('cloze');
        front = front.replace(/\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/gs, (_, number, answer, hint) => Number(number) === target ? `{{c1::${answer}${hint ? `::${hint}` : ''}}}` : answer);
        back = back.replace(/\{\{c\d+::(.*?)(?:::[^}]*)?\}\}/gs, (_, answer) => answer);
      } else if (/cloze|occlusion|image.?mask|mcq|multiple.?choice/i.test(model.name || '') || optionFields.length) {
        throw Error('custom-template');
      }
      front = clean(front); back = clean(back);
      if (!richText72(front) && !front.includes('<img')) throw Error('empty');
      if (type === 'basic' && !richText72(back) && !back.includes('<img')) throw Error('empty');
      const now = new Date().toISOString();
      const sourceDeck = collection.decks[card.did]?.name || 'Anki';
      result.cards.push({ cardId, moduleId: context.moduleId, lectureId: context.lectureId || null, cardType: type,
        front: local(richText72(front), language), back: local(richText72(back), language), explanation: local(richText72(back), language),
        richContent: { front: local(front, language), back: local(back, language), explanation: local(back, language), anki: { guid: note.guid, ordinal: card.ord, deck: sourceDeck, model: model.name } },
        options, correct, tags: String(note.tags || '').trim().split(/\s+/).filter(Boolean), category: local(sourceDeck, language), sourceDeck, createdAt: now, updatedAt: now });
      known.add(cardId);
    } catch (error) {
      result.skipped++;
      warnings.add(`Sprunget over: ${model?.name || 'ukendt korttype'} (${error.message === 'custom-template' ? 'specialskabelon / custom template' : error.message === 'mcq-key' ? 'uklar MCQ-facit' : 'ufuldstændige eller ikke understøttede felter'}).`);
    }
  }
  if (JSON.stringify(result.cards).length > ANKI_LIMITS792.persisted) throw Error('Kortene fylder over 3 MB efter import. Eksportér et mindre dæk eller færre billeder fra Anki.');
  result.warnings = [...warnings]; return result;
}
export function persistAnkiBatch792(storage, scope, cards) {
  if (!scope.userId) throw Error('Du skal være logget ind for at importere kort.');
  const read = key => { const parsed = JSON.parse(storage.getItem(key) || '[]'); if (!Array.isArray(parsed)) throw Error('Det lokale kortlager kunne ikke læses sikkert.'); return parsed; };
  const previous = read(scope.storageKey), queue = read(scope.queueKey), ids = new Set([...previous, ...queue].map(card => card.cardId));
  const added = cards.filter(card => { if (ids.has(card.cardId)) return false; ids.add(card.cardId); return true; }).map(card => ({ ...card, ownerUserId: scope.userId }));
  if (!added.length) return { ok: true, imported: 0, duplicates: cards.length, records: previous, cardIds: [] };
  const next = [...previous, ...added];
  // One write records the complete batch in the existing recovery/sync queue before exposing it.
  storage.setItem(scope.queueKey, JSON.stringify([...queue, ...added]));
  let recoveryPending = false;
  try { storage.setItem(scope.storageKey, JSON.stringify(next)); } catch { recoveryPending = true; }
  return { ok: true, imported: added.length, duplicates: cards.length - added.length, records: next, cardIds: added.map(card => card.cardId), recoveryPending };
}

let sqlPromise;
function loadAnkiSql792() {
  if (!sqlPromise) sqlPromise = new Promise((resolve, reject) => {
    const base = `${process.env.PUBLIC_URL || ''}/vendor/anki/`;
    const script = document.createElement('script'); script.src = `${base}sql-wasm.js`;
    script.onload = () => Promise.resolve().then(() => {
      if (typeof window.initSqlJs !== 'function') throw Error('Anki-læseren er ikke klar. Genindlæs siden og prøv igen.');
      return window.initSqlJs({ locateFile: name => `${base}${name}` });
    }).then(resolve, reject);
    script.onerror = () => reject(Error('Anki-læseren kunne ikke indlæses. Prøv igen.'));
    document.head.appendChild(script);
  }).catch(error => { sqlPromise = null; throw error; });
  return sqlPromise;
}
function rows(db, sql) {
  const result = db.exec(sql)[0];
  return result ? result.values.map(values => Object.fromEntries(result.columns.map((name, i) => [name, values[i]]))) : [];
}
export async function parseAnkiPackage792(file, context = {}, dependencies = {}) {
  checkAnkiFile792(file);
  let zip;
  try { zip = await JSZip.loadAsync(await file.arrayBuffer(), { checkCRC32: false }); } catch { throw Error('Anki-filen er ikke en gyldig ZIP-pakke eller er beskadiget.'); }
  const entries = Object.values(zip.files);
  // Inspect ZIP central-directory sizes before inflating any entry (including media).
  if (entries.length > ANKI_LIMITS792.entries || entries.reduce((sum, entry) => sum + (entry._data?.uncompressedSize || 0), 0) > ANKI_LIMITS792.expanded) throw Error('Pakken er for stor efter udpakning (maks. 32 MB / 5.000 filer). Eksportér et mindre Anki-dæk.');
  if (zip.file('collection.anki21b')) throw Error('Denne nyere Anki-pakke er endnu ikke understøttet. Eksportér igen med “Support older Anki versions” / “Understøt ældre Anki-versioner”.');
  const database = zip.file('collection.anki21') || zip.file('collection.anki2');
  if (!database) throw Error('Pakken mangler Ankis kortdatabase. Vælg et eksporteret Anki-dæk (.apkg).');
  const bytes = await database.async('uint8array');
  if (String.fromCharCode(...bytes.slice(0, 16)) !== 'SQLite format 3\0') throw Error('Anki-databasen er beskadiget eller i et ikke understøttet format.');
  const SQL = dependencies.SQL || await loadAnkiSql792(); let db, collection;
  try {
    db = new SQL.Database(bytes); db.run('PRAGMA query_only=ON; PRAGMA trusted_schema=OFF;');
    const tables = rows(db, "SELECT name,type FROM sqlite_master WHERE name IN ('col','notes','cards')");
    if (tables.length !== 3 || tables.some(table => table.type !== 'table')) throw Error('schema');
    const metadata = rows(db, 'SELECT models,decks FROM col LIMIT 1')[0];
    const cards = rows(db, `SELECT id,nid,did,ord FROM cards LIMIT ${ANKI_LIMITS792.cards + 1}`);
    if (cards.length > ANKI_LIMITS792.cards) throw Error('card-limit');
    const notes = rows(db, `SELECT id,guid,mid,tags,flds FROM notes LIMIT ${ANKI_LIMITS792.cards + 1}`);
    if (notes.length > ANKI_LIMITS792.cards) throw Error('card-limit');
    collection = { models: JSON.parse(metadata.models), decks: JSON.parse(metadata.decks), cards, notes };
  } catch (error) {
    if (error.message === 'card-limit') throw Error('Maks. 2.000 kort pr. import. Eksportér et mindre dæk fra Anki.');
    throw Error('Anki-databasen kunne ikke læses. Den kan være beskadiget eller bruge en nyere struktur. Eksportér med understøttelse af ældre Anki-versioner.');
  } finally { db?.close(); }
  let manifest = {};
  if (zip.file('media')) { try { manifest = JSON.parse(await zip.file('media').async('string')); } catch { throw Error('Pakkens medieoversigt er beskadiget.'); } }
  const media = Object.create(null), warnings = [];
  for (const [entryName, name] of Object.entries(manifest)) {
    const match = typeof name === 'string' && name.match(/\.(png|jpe?g|gif|webp)$/i);
    if (!match || !/^\d+$/.test(entryName)) continue;
    const entry = zip.file(entryName); if (!entry) { warnings.push(`Billede mangler: ${name}`); continue; }
    if (entry._data?.uncompressedSize > 1024 * 1024) { warnings.push(`Billedet er over 1 MB og springes over: ${name}`); continue; }
    const encoded = await entry.async('base64');
    media[name] = `data:image/${/^jpe?g$/i.test(match[1]) ? 'jpeg' : match[1].toLowerCase()};base64,${encoded}`;
  }
  return convertAnkiCollection792(collection, { ...context, media, warnings });
}
