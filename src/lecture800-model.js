import Ajv from 'ajv';
import JSZip from 'jszip';
import schema from './lecture800-schema.json';

export { schema as lectureSchema800 };
const check = new Ajv({ allErrors: false, strict: false }).compile(schema);
const MiB = 1024 * 1024;
export const lectureLimits800 = { upload: 128 * MiB, unpacked: 256 * MiB, image: 12 * MiB };
export const glossaryTokens800 = /\[\[([^\]|]+)\|([^\]]+)\]\]/g;
export const plainLecture800 = text => String(text || '').replace(glossaryTokens800, '$2');
export const sectionKey800 = content => JSON.stringify([content.target.moduleId, content.target.lectureId, content.packageId, content.section.id]);
const unique = (items, name) => {
  const ids = new Set();
  for (const item of items) { if (ids.has(item.id)) throw Error(`${name}: ID "${item.id}" skal være unikt.`); ids.add(item.id); }
  return new Map(items.map(item => [item.id, item]));
};
const safePath = path => typeof path === 'string' && !path.includes('\\') && !path.split('/').some(part => !part || part === '.' || part === '..') && !path.startsWith('/') && !/^[a-z]+:/i.test(path);

export function validateLecture800(pack) {
  if (pack?.version !== 1 || pack?.format !== 'medfluen-lecture') throw Error('Pakken skal bruge format medfluen-lecture, version 1.');
  if (!check(pack)) {
    const error = check.errors[0];
    const messages = { required: `feltet ${error.params?.missingProperty} mangler`, additionalProperties: `ukendt felt ${error.params?.additionalProperty}`, type: 'feltet har forkert datatype', minItems: 'listen er tom eller for kort', maxItems: 'listen indeholder for mange elementer', enum: 'værdien understøttes ikke', pattern: error.instancePath?.endsWith('/path') ? 'billedets filsti skal ligge under images/' : 'teksten eller identiteten har ugyldigt format', minimum: 'tallet er under den tilladte grænse', minLength: 'teksten må ikke være tom', maxLength: 'teksten er for lang' };
    throw Error(`Filformatet er ugyldigt ved ${error.instancePath || 'pakken'}: ${messages[error.keyword] || 'værdien er ugyldig'}. Hent skabelonen og prøv igen.`);
  }
  const sources = unique(pack.sources, 'Kilder'), sections = unique(pack.sections, 'Sektioner'), terms = unique(pack.glossary, 'Glosar'), assets = unique(pack.assets, 'Billeder');
  unique(pack.cards, 'Kort');
  const paths = new Set();
  for (const asset of pack.assets) {
    if (!safePath(asset.path) || !asset.path.startsWith('images/')) throw Error(`Billede ${asset.id}: usikker filsti.`);
    if (paths.has(asset.path)) throw Error(`Billeder: filsti ${asset.path} er en dublet.`);
    paths.add(asset.path);
  }
  const refs = (items, label) => { for (const ref of items || []) { const source = sources.get(ref.sourceId); if (!source) throw Error(`${label}: ukendt kilde ${ref.sourceId}.`); if (source.pageCount && ref.page > source.pageCount) throw Error(`${label}: PDF-side ${ref.page} findes ikke i ${source.filename}.`); } };
  const text = (value, label) => {
    for (const match of String(value || '').matchAll(glossaryTokens800)) if (!terms.has(match[1])) throw Error(`${label}: manglende glosar-definition for ${match[1]}.`);
    const remainder = String(value || '').replace(glossaryTokens800, '');
    if (remainder.includes('[[') || remainder.includes(']]')) throw Error(`${label}: glosarhenvisningen skal skrives [[term-id|ord]].`);
  };
  pack.glossary.forEach(term => refs(term.sourceRefs, `Definition ${term.term}`));
  pack.assets.forEach(asset => refs(asset.sourceRefs, `Billede ${asset.id}`));
  for (const card of pack.cards) {
    const label = `Kort ${card.id}`;
    if (!sections.has(card.sectionId)) throw Error(`${label}: ukendt sektion ${card.sectionId}.`);
    refs(card.sourceRefs, label); text(card.question, label); text(card.answer, label); text(card.explanation, label);
    for (const id of card.assetIds || []) if (!assets.has(id)) throw Error(`${label}: manglende billede ${id}.`);
    if (card.type === 'recall-list') { unique(card.answerItems, label); card.answerItems.forEach(item => { text(item.text, label); refs(item.sourceRefs, label); }); }
    if (card.type === 'mcq') { const options = unique(card.options, label); card.options.forEach(option => text(option.text, label)); for (const id of card.correctOptionIds) if (!options.has(id)) throw Error(`${label}: facit ${id} matcher ingen svarmulighed.`); }
  }
  return pack;
}

function readFile(file, asText = false) {
  if (asText && file.text) return file.text();
  if (!asText && file.arrayBuffer) return file.arrayBuffer();
  return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(Error('Filen kunne ikke læses.')); asText ? reader.readAsText(file) : reader.readAsArrayBuffer(file); });
}
const detectedMime = bytes => bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71 && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10 ? 'image/png' : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' : String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP' ? 'image/webp' : null;

export async function parseLectureFile800(file) {
  if (!file || file.size > lectureLimits800.upload) throw Error('Filen må højst fylde 128 MiB.');
  if (/\.json$/i.test(file.name)) {
    let pack; try { pack = JSON.parse(await readFile(file, true)); } catch { throw Error('JSON-filen kunne ikke læses. Brug gyldig JSON uden Markdown-hegn.'); }
    validateLecture800(pack);
    if (pack.assets.length) throw Error('Kort med billeder skal uploades som ZIP med lecture.json og images/.');
    return { package: pack, media: new Map() };
  }
  if (!/\.zip$/i.test(file.name)) throw Error('Vælg en .json- eller .zip-fil. ANKI bruger den separate import.');
  let zip; try { zip = await JSZip.loadAsync(await readFile(file)); } catch { throw Error('ZIP-filen kunne ikke læses.'); }
  const entries = Object.values(zip.files);
  if (entries.length > 2205) throw Error('ZIP-pakken indeholder for mange filer.');
  let unpacked = 0;
  for (const entry of entries) {
    if (!safePath((entry.unsafeOriginalName || entry.name).replace(/\/$/, ''))) throw Error('ZIP-pakken indeholder en usikker filsti.');
    unpacked += entry._data?.uncompressedSize || 0;
    if (unpacked > lectureLimits800.unpacked) throw Error('ZIP-pakken må højst fylde 256 MiB udpakket.');
  }
  const manifest = zip.file('lecture.json');
  if (!manifest || entries.filter(entry => /(^|\/)lecture\.json$/.test(entry.name)).length !== 1) throw Error('ZIP-pakken skal indeholde præcis én lecture.json i roden.');
  let pack; try { pack = JSON.parse(await manifest.async('string')); } catch { throw Error('lecture.json er ikke gyldig JSON.'); }
  validateLecture800(pack);
  const media = new Map(), used = new Set(pack.cards.flatMap(card => card.assetIds || []));
  for (const asset of pack.assets) {
    const entry = zip.file(asset.path);
    if (!entry) throw Error(`Billedfilen ${asset.path} mangler i ZIP-pakken.`);
    if (entry._data?.uncompressedSize > lectureLimits800.image) throw Error(`${asset.path} må højst fylde 12 MiB.`);
    const bytes = await entry.async('uint8array');
    if (bytes.byteLength > lectureLimits800.image || detectedMime(bytes) !== asset.mime) throw Error(`${asset.path}: billedformatet matcher ikke PNG, JPEG eller WebP i pakken.`);
    if (used.has(asset.id)) media.set(asset.id, new Blob([bytes], { type: asset.mime }));
  }
  return { package: pack, media };
}

export function lectureRecords800(pack, target) {
  validateLecture800(pack);
  const sections = new Map(pack.sections.map(section => [section.id, section])), assets = new Map(pack.assets.map(asset => [asset.id, asset]));
  return [...pack.cards].sort((a, b) => sections.get(a.sectionId).order - sections.get(b.sectionId).order || a.order - b.order || a.id.localeCompare(b.id)).map(card => {
    const cardId = 'lecture800:' + JSON.stringify([target.moduleId, target.lectureId, pack.packageId, card.id]);
    const content = { packageId: pack.packageId, target, section: sections.get(card.sectionId), card, glossary: pack.glossary, sources: pack.sources, assets: (card.assetIds || []).map(id => ({ ...assets.get(id), mediaKey: JSON.stringify([target.moduleId, target.lectureId, pack.packageId, id]) })) };
    const options = card.options?.map(option => ({ da: plainLecture800(option.text) })) || [];
    const correctIndices = card.correctOptionIds?.map(id => card.options.findIndex(option => option.id === id)) || [];
    return { cardId, moduleId: target.moduleId, lectureId: target.lectureId, cardType: card.type, sourceType: 'lecture', front: { da: plainLecture800(card.question) }, back: { da: plainLecture800(card.answer || card.answerItems?.map(item => item.text).join('\n') || '') }, category: { da: content.section.title }, explanation: { da: plainLecture800(card.explanation || '') }, options, correct: correctIndices[0] || 0, correctIndices, lectureContent: content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  });
}

export function mergeLecture800(existing, incoming, mode = 'new') {
  const index = new Map(existing.map(card => [card.cardId, card])); let added = 0, updated = 0;
  for (const card of incoming) {
    const previous = index.get(card.cardId);
    if (!previous) { index.set(card.cardId, card); added++; }
    else if (mode === 'update' && JSON.stringify(previous.lectureContent) !== JSON.stringify(card.lectureContent)) { index.set(card.cardId, { ...previous, ...card, createdAt: previous.createdAt || card.createdAt }); updated++; }
  }
  return { records: [...index.values()], added, updated, duplicates: incoming.length - added };
}
export function reconcileForgotten800(previous, next, ids = []) {
  const old = new Map((previous?.lectureContent?.card.answerItems || []).map(item => [item.id, item.text]));
  return (next?.lectureContent?.card.answerItems || []).filter(item => ids.includes(item.id) && old.get(item.id) === item.text).map(item => item.id);
}
export function lectureSections800(questions) {
  const index = new Map();
  for (const question of questions) if (question.lectureContent) { const content = question.lectureContent, key = sectionKey800(content); if (!index.has(key)) index.set(key, { ...content.section, key, count: 0, lectureTitle: content.target.title }); index.get(key).count++; }
  return [...index.values()].sort((a, b) => a.order - b.order || a.key.localeCompare(b.key));
}
export function lectureStudyCards800(questions, selectedSections, missed) {
  const keys = new Set(selectedSections);
  return questions.filter(question => question.lectureContent && keys.has(sectionKey800(question.lectureContent)) && (!missed || (missed[question.id || question.cardId] || []).length)).sort((a, b) => a.lectureContent.section.order - b.lectureContent.section.order || a.lectureContent.card.order - b.lectureContent.card.order || (a.id || a.cardId).localeCompare(b.id || b.cardId));
}
