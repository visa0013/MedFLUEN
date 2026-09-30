import { sanitizeRich72, richText72 } from './experience72-model';
import JSZip from 'jszip';
import { stageAnkiMedia792, releaseAnkiMedia792 } from './ankiStorage792';
import { normalizeAnkiCard797 } from './ankiExam797-model';

export const ANKI_LIMITS792 = { compressed: 128 * 1024 * 1024, expanded: 256 * 1024 * 1024, cards: 10000, persisted: 32 * 1024 * 1024, entries: 15000, media: 16 * 1024 * 1024 };
export function checkAnkiFile792(file) {
  if (!/\.apkg$/i.test(file?.name || '')) throw Error('Vælg en Anki-fil (.apkg). Andre formater understøttes senere.');
  if (!file.size) throw Error('Anki-filen er tom.');
  if (file.size > ANKI_LIMITS792.compressed) throw Error('Anki-filen må højst fylde 128 MB.');
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
const normalizedText = value => richText72(value).replace(/\s+/g, ' ').trim();
function mcqFields792(fields) {
  const names = Object.keys(fields);
  const declared = names.filter(name => /^(?:Option|Answer)[A-H]$/i.test(name)).sort();
  const keyName = names.find(name => /^(Correct|CorrectAnswer)$/i.test(name));
  if (declared.length && keyName) {
    if (new Set(declared.map(name => name.slice(-1).toUpperCase())).size !== declared.length) throw Error('mcq-key');
    const key = normalizedText(fields[keyName]);
    const correct = /^[A-H]$/i.test(key) ? declared.findIndex(name => name.slice(-1).toUpperCase() === key.toUpperCase()) : /^\d+$/.test(key) ? Number(key) - 1 : -1;
    return { front: fields.Question || fields.Front, options: declared.map(name => fields[name]), correct, back: fields.Explanation || fields.Extra || '' };
  }
  if ('Question' in fields && 'Choices' in fields && 'Answer' in fields) {
    const container = document.createElement('template'); container.innerHTML = fields.Choices;
    const options = [...container.content.querySelectorAll('li')].map(node => node.innerHTML);
    if (!options.length) return { basic: true, front: fields.Question, back: fields.Answer };
    const answer = normalizedText(fields.Answer), stripLabel = text => text.replace(/^(?:[A-H]|\d+)[.)]\s*/i, '');
    const matches = options.map((option, index) => stripLabel(normalizedText(option)) === stripLabel(answer) ? index : -1).filter(index => index >= 0);
    const correct = matches.length === 1 ? matches[0] : /^[A-H]$/i.test(answer) ? answer.toUpperCase().charCodeAt(0) - 65 : /^\d+$/.test(answer) ? Number(answer) - 1 : -1;
    if (correct < 0 || correct >= options.length) {
      // Preserve the author's answer verbatim if it cannot be unambiguously
      // attached to an option. Never manufacture a single-choice answer key.
      return { basic: true, front: `${fields.Question}<ol>${options.map(option => `<li>${option}</li>`).join('')}</ol>`, back: fields.Answer, fallback: true };
    }
    return { front: fields.Question, options, correct, back: fields.Answer };
  }
  const numbered = names.filter(name => /^Q_\d+$/.test(name)).sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  if ('Question' in fields && 'Answers' in fields && numbered.length) {
    const keys = normalizedText(fields.Answers).split(/\s+/);
    const populated = numbered.map((name, index) => ({ value: fields[name], index })).filter(item => normalizedText(item.value));
    const correct = populated.map((item, index) => keys[item.index] === '1' ? index : -1).filter(index => index >= 0);
    const back = [fields['Extra 1'], fields.Sources].filter(Boolean).join('<br>');
    const qtype = normalizedText(fields[names.find(name => /^QType/.test(name))] || '2');
    if (correct.length && keys.every(key => key === '0' || key === '1')) return { front: fields.Question, options: populated.map(item => item.value), correct: correct[0], correctIndices: correct, back };
    return { basic: true, front: `${fields.Question}<ol>${populated.map(item => `<li>${item.value}</li>`).join('')}</ol>`, back: `${populated.map(item => `<p>${item.value}: ${keys[item.index] === '1' ? '✓' : '✗'}</p>`).join('')}${back}`, fallback: true };
  }
  return null;
}
export function convertAnkiCollection792(collection, context = {}) {
  const language = context.language || 'da', media = context.media || {};
  const warnings = new Set(context.warnings || []), known = new Set(context.existingIds || []);
  const result = { cards: [], duplicates: 0, skipped: 0, warnings: [], total: collection.cards.length };
  const notes = new Map(collection.notes.map(note => [String(note.id), note]));
  const clean = value => {
    const node = document.createElement('template'); node.innerHTML = String(value || '').replace(/\[sound:([^\]]+)\]/g, (_, name) => {
      const audio = document.createElement('audio'); audio.setAttribute('src', name); return audio.outerHTML;
    });
    node.content.querySelectorAll('img,audio,video,source').forEach(element => {
      const src = element.getAttribute('src') || '';
      if (!src && element.querySelector('source')) return;
      let name = src;
      try { name = decodeURIComponent(src); } catch { /* Keep literal filename. */ }
      if (media[name] || media[src]) element.setAttribute('src', media[name] || media[src]);
      else { warnings.add(`Medie mangler i pakken eller understøttes ikke: ${name}`); element.remove(); }
    });
    if (node.content.querySelector('svg,math')) warnings.add('Indlejret SVG og specialmatematik kræver et eksporteret billede.');
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
      let front, back, richOptions = [], correctIndices;
      const mcq = mcqFields792(fields);
      if (mcq) {
        front = mcq.front; back = mcq.back;
        if (mcq.fallback) warnings.add(`Facit i ${model.name} bevares som et vendekort, fordi det ikke er et entydigt enkeltvalg.`);
        if (!mcq.basic) {
          type = 'mcq'; correct = mcq.correct; correctIndices = mcq.correctIndices;
          richOptions = mcq.options.map(option => local(clean(option), language));
          options = richOptions.map(option => local(richText72(option[language]), language));
          if (correct < 0 || correct >= options.length || options.length < 2 || options.some(option => !option[language])) throw Error('mcq-key');
        }
      } else {
        front = templateFields(template.qfmt, fields); back = templateFields(template.afmt, fields, '');
      }
      if (model.type === 1) {
        type = 'cloze'; const target = Number(card.ord) + 1;
        if (!new RegExp(`\\{\\{c${target}::`).test(front)) throw Error('cloze');
        front = front.replace(/\{\{c(\d+)::(.*?)(?:::(.*?))?\}\}/gs, (_, number, answer, hint) => Number(number) === target ? `{{c1::${answer}${hint ? `::${hint}` : ''}}}` : answer);
        back = back.replace(/\{\{c\d+::(.*?)(?:::[^}]*)?\}\}/gs, (_, answer) => answer);
      } else if (!mcq && /cloze|occlusion|image.?mask|mcq|multiple.?choice/i.test(model.name || '')) {
        throw Error('custom-template');
      }
      front = clean(front); back = clean(back);
      if (!richText72(front) && !front.includes('<img')) throw Error('empty');
      if (type === 'basic' && !richText72(back) && !back.includes('<img')) throw Error('empty');
      const now = new Date().toISOString();
      const sourceDeck = collection.decks[card.did]?.name || 'Anki';
      result.cards.push(normalizeAnkiCard797({ cardId, moduleId: context.moduleId, lectureId: context.lectureId || null, cardType: type,
        front: local(richText72(front), language), back: local(richText72(back), language), explanation: local(richText72(back), language),
        richContent: { front: local(front, language), back: local(back, language), explanation: local(back, language), ...(richOptions.length ? { options: richOptions } : {}), anki: { guid: note.guid, ordinal: card.ord, deck: sourceDeck, model: model.name, sourceKind: context.sourceKind || undefined } },
        options, correct, ...(correctIndices ? { correctIndices } : {}), tags: String(note.tags || '').trim().split(/\s+/).filter(Boolean), category: local(sourceDeck, language), sourceDeck, createdAt: now, updatedAt: now }));
      known.add(cardId);
    } catch (error) {
      result.skipped++;
      warnings.add(`Sprunget over: ${model?.name || 'ukendt korttype'} (${error.message === 'custom-template' ? 'specialskabelon / custom template' : error.message === 'mcq-key' ? 'uklar MCQ-facit' : 'ufuldstændige eller ikke understøttede felter'}).`);
    }
  }
  if (JSON.stringify(result.cards).length > ANKI_LIMITS792.persisted) throw Error('Kortteksten fylder over 32 MB efter import. Eksportér et mindre dæk.');
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
let zstdPromise;
function loadZstd792() {
  if (!zstdPromise) zstdPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = `${process.env.PUBLIC_URL || ''}/vendor/anki/fzstd/umd/index.js`;
    script.onload = () => window.fzstd ? resolve(window.fzstd) : reject(Error('Zstandard-læseren kunne ikke startes.'));
    script.onerror = () => reject(Error('Zstandard-læseren kunne ikke indlæses. Genindlæs siden.'));
    document.head.appendChild(script);
  }).catch(error => { zstdPromise = null; throw error; });
  return zstdPromise;
}
const isZstd792 = bytes => bytes[0] === 0x28 && bytes[1] === 0xb5 && bytes[2] === 0x2f && bytes[3] === 0xfd;
async function decompress792(bytes, limit, dependencies) {
  if (!isZstd792(bytes) && !dependencies.forceZstd) {
    if (bytes.length > limit) throw Error('Mediet eller databasen er for stor efter udpakning.');
    return bytes;
  }
  const zstd = dependencies.zstd || await loadZstd792();
  // Bound the advertised window before fzstd allocates it. Then bound every
  // output chunk; ZIP sizes do not include this second compression layer.
  const flags = bytes[4], single = flags & 32;
  if (isZstd792(bytes)) {
    const sizeFlag = flags >> 6, dictFlag = flags & 3;
    const sizeBytes = sizeFlag ? 2 ** sizeFlag : single ? 1 : 0;
    const sizeOffset = (single ? 5 : 6) + (dictFlag === 3 ? 4 : dictFlag);
    let contentSize = sizeFlag === 1 ? 256 : 0;
    for (let index = 0; index < sizeBytes; index++) contentSize += bytes[sizeOffset + index] * 2 ** (8 * index);
    const base = 2 ** (10 + (bytes[5] >> 3));
    const window = single ? contentSize : base + base / 8 * (bytes[5] & 7);
    if (contentSize > limit || window > ANKI_LIMITS792.expanded) throw Error('Anki-pakkens udpakkede indhold eller komprimeringsvindue er for stort.');
  }
  if (!zstd.Decompress) {
    const output = zstd.decompress(bytes);
    if (output.length > limit) throw Error('Indholdet er for stort efter udpakning.');
    return output;
  }
  const chunks = []; let size = 0;
  const stream = new zstd.Decompress(chunk => {
    size += chunk.length;
    if (size > limit) throw Error('Indholdet er for stort efter udpakning.');
    chunks.push(chunk);
  });
  stream.push(bytes, true);
  const output = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { output.set(chunk, offset); offset += chunk.length; }
  return output;
}
// Anki's normalized template configs and modern media manifest are protobuf.
function protobuf792(bytes) {
  let offset = 0; const result = {};
  function varint() {
    let value = 0, multiplier = 1;
    for (let count = 0; count < 10 && offset < bytes.length; count++) {
      const byte = bytes[offset++]; value += (byte & 127) * multiplier;
      if (!(byte & 128)) return value;
      multiplier *= 128;
    }
    throw Error('Ugyldig Anki-metadata.');
  }
  while (offset < bytes.length) {
    const key = varint(), field = Math.floor(key / 8), wire = key % 8;
    if (wire === 2) {
      const length = varint();
      if (offset + length > bytes.length) throw Error('Ufuldstændig Anki-metadata.');
      (result[field] ||= []).push(bytes.subarray(offset, offset + length)); offset += length;
    } else if (wire === 0) result[field] = varint();
    else if (wire === 1) offset += 8;
    else if (wire === 5) offset += 4;
    else throw Error('Ugyldig Anki-metadata.');
  }
  return result;
}
function decodeUtf8792(bytes) {
  // TextDecoder is supported by the app's browsers; fallback also permits the
  // SQL.js test runner and preserves Danish/Arabic field and deck names.
  if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(bytes);
  return decodeURIComponent(Array.from(bytes, value => `%${value.toString(16).padStart(2, '0')}`).join(''));
}
function readCollection792(db) {
  const tables = new Set(rows(db, "SELECT name FROM sqlite_master WHERE type='table'").map(row => row.name));
  if (!tables.has('notes') || !tables.has('cards')) throw Error('schema');
  const cards = rows(db, `SELECT id,nid,did,ord FROM cards LIMIT ${ANKI_LIMITS792.cards + 1}`);
  const notes = rows(db, `SELECT id,guid,mid,tags,flds FROM notes LIMIT ${ANKI_LIMITS792.cards + 1}`);
  if (cards.length > ANKI_LIMITS792.cards || notes.length > ANKI_LIMITS792.cards) throw Error('card-limit');
  let models = {}, decks = {};
  if (tables.has('notetypes') && tables.has('fields') && tables.has('templates') && tables.has('decks')) {
    const fields = rows(db, 'SELECT ntid,ord,name FROM fields ORDER BY ntid,ord');
    const templates = rows(db, 'SELECT ntid,ord,name,config FROM templates ORDER BY ntid,ord');
    for (const model of rows(db, 'SELECT id,name,config FROM notetypes')) {
      const config = protobuf792(model.config);
      models[model.id] = { id: model.id, name: model.name, type: Number(config[1] || 0), flds: fields.filter(field => field.ntid === model.id), tmpls: templates.filter(template => template.ntid === model.id).map(template => {
        const data = protobuf792(template.config);
        return { ord: template.ord, name: template.name, qfmt: decodeUtf8792(data[1]?.[0] || new Uint8Array()), afmt: decodeUtf8792(data[2]?.[0] || new Uint8Array()) };
      }) };
    }
    decks = Object.fromEntries(rows(db, 'SELECT id,name FROM decks').map(deck => [deck.id, { ...deck, name: deck.name.split('\x1f').join('::') }]));
  } else if (tables.has('col')) {
    const metadata = rows(db, 'SELECT models,decks FROM col LIMIT 1')[0];
    models = JSON.parse(metadata?.models || '{}'); decks = JSON.parse(metadata?.decks || '{}');
  } else throw Error('schema');
  return { models, decks, cards, notes };
}
const mediaTypes792 = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', bmp: 'image/bmp', svg: 'image/svg+xml', mp3: 'audio/mpeg', ogg: 'audio/ogg', oga: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4', flac: 'audio/flac', mp4: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg' };
function sanitizeSvg792(bytes) {
  const root = document.createElement('template'); root.innerHTML = decodeUtf8792(bytes);
  const svg = root.content.querySelector('svg');
  if (!svg) throw Error('Ugyldigt SVG-billede.');
  const allowed = new Set(['svg','g','path','rect','circle','ellipse','line','polyline','polygon','text','tspan','defs','linearGradient','radialGradient','stop','clipPath','mask','title','desc']);
  for (const node of [svg, ...svg.querySelectorAll('*')]) {
    if (!allowed.has(node.localName)) { node.remove(); continue; }
    for (const attr of [...node.attributes]) {
      const localReference = /^url\(#[a-zA-Z][\w.-]*\)$/.test(attr.value);
      if (/^on|href|src|style|class$/i.test(attr.name) || (attr.name === 'id' && !/^[a-zA-Z][\w.-]*$/.test(attr.value)) || (!localReference && /url\s*\(|javascript:|data:|https?:/i.test(attr.value))) node.removeAttribute(attr.name);
    }
  }
  return new Blob([svg.outerHTML], { type: 'image/svg+xml' });
}
export async function parseAnkiPackage792(file, context = {}, dependencies = {}) {
  checkAnkiFile792(file);
  let zip;
  try { zip = await JSZip.loadAsync(await file.arrayBuffer(), { checkCRC32: false }); } catch { throw Error('Anki-filen er ikke en gyldig ZIP-pakke eller er beskadiget.'); }
  const entries = Object.values(zip.files);
  // Inspect ZIP central-directory sizes before inflating any entry (including media).
  if (entries.length > ANKI_LIMITS792.entries || entries.reduce((sum, entry) => sum + (entry._data?.uncompressedSize || 0), 0) > ANKI_LIMITS792.expanded) throw Error('Pakken er for stor efter udpakning (maks. 256 MB / 15.000 filer).');
  const modern = zip.file('collection.anki21b');
  const database = modern || zip.file('collection.anki21') || zip.file('collection.anki2');
  if (!database) throw Error('Pakken mangler Ankis kortdatabase. Vælg et eksporteret Anki-dæk (.apkg).');
  let bytes;
  try { bytes = await decompress792(await database.async('uint8array'), 64 * 1024 * 1024, { ...dependencies, forceZstd: Boolean(modern) }); }
  catch (error) { throw Error(`Anki-databasen kunne ikke udpakkes: ${error.message}`); }
  if (String.fromCharCode(...bytes.slice(0, 16)) !== 'SQLite format 3\0') throw Error('Anki-databasen er beskadiget eller i et ikke understøttet format.');
  const SQL = dependencies.SQL || await loadAnkiSql792(); let db, collection;
  try {
    db = new SQL.Database(bytes); db.run('PRAGMA query_only=ON; PRAGMA trusted_schema=OFF;');
    collection = readCollection792(db);
  } catch (error) {
    if (error.message === 'card-limit') throw Error('Maks. 10.000 kort pr. import. Eksportér et mindre dæk fra Anki.');
    throw Error('Anki-databasen kunne ikke læses. Filen er beskadiget eller indeholder en ukendt databasestruktur.');
  } finally { db?.close(); }
  let manifest = {};
  if (zip.file('media')) {
    try {
      const raw = await zip.file('media').async('uint8array');
      const decoded = await decompress792(raw, 8 * 1024 * 1024, dependencies);
      if (isZstd792(raw)) manifest = Object.fromEntries((protobuf792(decoded)[1] || []).map((chunk, index) => [String(index), decodeUtf8792(protobuf792(chunk)[1]?.[0] || new Uint8Array())]));
      else manifest = JSON.parse(decodeUtf8792(decoded));
    } catch { throw Error('Pakkens medieoversigt er beskadiget.'); }
  }
  const media = Object.create(null), warnings = [], mediaIds = [];
  let expanded = bytes.length;
  // Only inflate referenced media; CSS/fonts/scripts from Anki templates do
  // not belong in the app's card layout. All supported media remain lossless.
  const references = new Set();
  for (const note of collection.notes) {
    const root = document.createElement('template'); root.innerHTML = note.flds;
    for (const element of root.content.querySelectorAll('img,audio,video,source')) {
      const src = element.getAttribute('src'); if (src) { references.add(src); try { references.add(decodeURIComponent(src)); } catch {} }
    }
    for (const match of note.flds.matchAll(/\[sound:([^\]]+)\]/g)) references.add(match[1]);
  }
  try {
  for (const [entryName, name] of Object.entries(manifest)) {
    if (typeof name !== 'string' || !references.has(name) || !/^\d+$/.test(entryName)) continue;
    const extension = name.split('.').pop().toLowerCase(), type = mediaTypes792[extension];
    if (!type) { warnings.push(`Medieformat understøttes ikke: ${name}`); continue; }
    const entry = zip.file(entryName); if (!entry) { warnings.push(`Medie mangler: ${name}`); continue; }
    const payload = await decompress792(await entry.async('uint8array'), ANKI_LIMITS792.media, dependencies);
    expanded += payload.length;
    if (expanded > ANKI_LIMITS792.expanded) throw Error('Pakken indeholder over 256 MB udpakkede medier og kort.');
    const digest = await (dependencies.digest || (data => crypto.subtle.digest('SHA-256', data)))(payload);
    const id = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
    const blob = extension === 'svg' ? sanitizeSvg792(payload) : new Blob([payload], { type });
    media[name] = stageAnkiMedia792(id, blob); mediaIds.push(id);
    if (mediaIds.length % 25 === 0) { context.onProgress?.({ media: mediaIds.length, totalMedia: references.size }); await new Promise(resolve => setTimeout(resolve, 0)); }
  }
  const result = convertAnkiCollection792(collection, { ...context, media, warnings });
  return { ...result, mediaCount: new Set(mediaIds).size, releaseMedia: () => releaseAnkiMedia792(mediaIds) };
  } catch (error) { releaseAnkiMedia792(mediaIds); throw error; }
}
