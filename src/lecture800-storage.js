import { lectureRecords800, mergeLecture800, reconcileForgotten800 } from './lecture800-model';

let opening;
function database800() {
  if (!opening) opening = new Promise((resolve, reject) => {
    const request = indexedDB.open('medfluen-lectures800', 1);
    request.onupgradeneeded = () => { for (const name of ['cards', 'media', 'packages', 'forgotten']) request.result.createObjectStore(name, { keyPath: 'key' }).createIndex('scope', 'scope'); };
    request.onsuccess = () => { request.result.onversionchange = () => { request.result.close(); opening = null; }; resolve(request.result); };
    request.onerror = () => reject(Error('Forelæsningslageret kunne ikke åbnes. Tillad browserlagring og prøv igen.'));
    request.onblocked = () => reject(Error('Luk andre faner med appen og prøv igen.'));
  }).catch(error => { opening = null; throw error; });
  return opening;
}
const ownedKey = (scope, id) => JSON.stringify([scope, id]);
const done800 = transaction => new Promise((resolve, reject) => { transaction.oncomplete = resolve; transaction.onabort = transaction.onerror = () => reject(Error('Kunne ikke gemme på denne enhed. Lageret kan være fyldt. Importen er ikke delvist gemt.')); });
async function rows800(scope, name) {
  if (!scope) return [];
  const db = await database800();
  return new Promise((resolve, reject) => { const request = db.transaction(name).objectStore(name).index('scope').getAll(scope); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(Error('Det lokale forelæsningslager kunne ikke læses.')); });
}
export async function readLectureCards800(scope) { return (await rows800(scope, 'cards')).map(row => row.card); }
export async function readForgotten800(scope) { return Object.fromEntries((await rows800(scope, 'forgotten')).map(row => [row.cardId, row.itemIds])); }
export async function readLectureMedia800(scope, key) {
  if (!scope) return null;
  const db = await database800();
  return new Promise((resolve, reject) => { const request = db.transaction('media').objectStore('media').get(ownedKey(scope, key)); request.onsuccess = () => resolve(request.result?.blob || null); request.onerror = () => reject(Error('Billedet kunne ikke læses.')); });
}
export async function writeForgotten800(scope, card, itemIds) {
  if (!scope) throw Error('Log ind for at gemme markeringer.');
  const valid = new Set((card.lectureContent?.card.answerItems || []).map(item => item.id));
  const ids = [...new Set(itemIds)].filter(id => valid.has(id));
  const db = await database800(), transaction = db.transaction('forgotten', 'readwrite'), done = done800(transaction);
  const cardId = card.id || card.cardId;
  transaction.objectStore('forgotten').put({ key: ownedKey(scope, cardId), scope, cardId, itemIds: ids });
  await done;
  window.dispatchEvent(new CustomEvent('medfluen-forgotten800', { detail: { scope } }));
  return ids;
}
export async function persistLecture800(scope, preview, target, mode = 'new') {
  if (!scope) throw Error('Log ind for at gemme forelæsningskort.');
  const incoming = lectureRecords800(preview.package, target).map(card => ({ ...card, lectureScope800: scope }));
  for (const row of incoming) for (const asset of row.lectureContent.assets) if (!(preview.media.get(asset.id) instanceof Blob)) throw Error(`Billedet ${asset.path} mangler. Ingen kort er gemt.`);
  const db = await database800(), transaction = db.transaction(['cards', 'media', 'packages', 'forgotten'], 'readwrite'), done = done800(transaction);
  const cards = transaction.objectStore('cards'), forgotten = transaction.objectStore('forgotten');
  const oldCardsRequest = cards.index('scope').getAll(scope), flagsRequest = forgotten.index('scope').getAll(scope);
  let oldRows, flagRows, result;
  function write() {
    if (!oldRows || !flagRows) return;
    const previous = new Map(oldRows.map(row => [row.card.cardId, row.card]));
    const flags = new Map(flagRows.map(row => [row.cardId, row.itemIds]));
    result = mergeLecture800([...previous.values()], incoming, mode);
    const changedIds = new Set(incoming.filter(card => !previous.has(card.cardId) || (mode === 'update' && JSON.stringify(previous.get(card.cardId).lectureContent) !== JSON.stringify(card.lectureContent))).map(card => card.cardId));
    for (const card of result.records) if (changedIds.has(card.cardId)) {
      cards.put({ key: ownedKey(scope, card.cardId), scope, card });
      const itemIds = reconcileForgotten800(previous.get(card.cardId), card, flags.get(card.cardId));
      forgotten.put({ key: ownedKey(scope, card.cardId), scope, cardId: card.cardId, itemIds });
      for (const asset of card.lectureContent.assets) transaction.objectStore('media').put({ key: ownedKey(scope, asset.mediaKey), scope, blob: preview.media.get(asset.id) });
    }
    if (changedIds.size) transaction.objectStore('packages').put({ key: ownedKey(scope, JSON.stringify([target.moduleId, target.lectureId, preview.package.packageId])), scope, package: preview.package, target });
  }
  oldCardsRequest.onsuccess = () => { oldRows = oldCardsRequest.result; write(); };
  flagsRequest.onsuccess = () => { flagRows = flagsRequest.result; write(); };
  await done;
  return { ok: true, imported: result.added, updated: result.updated, duplicates: result.duplicates, records: result.records };
}
