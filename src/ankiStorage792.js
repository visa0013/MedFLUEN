// Binary media and large imports live in IndexedDB, never in localStorage.
// Previews stage blobs in memory; confirmation commits cards and media together.
import { normalizeAnkiCard797 } from './ankiExam797-model';
const staged = new Map();
let databasePromise;
export const ankiMediaReference792 = /^medfluen-media:([a-f0-9]{64})$/;
export function stageAnkiMedia792(id, blob) { staged.set(id, blob); return `medfluen-media:${id}`; }
export function releaseAnkiMedia792(ids) { for (const id of ids || []) staged.delete(id); }
function database792() {
  if (!databasePromise) databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('medfluen-anki792', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('media', { keyPath: 'id' });
      db.createObjectStore('cards', { keyPath: 'key' }).createIndex('scope', 'scope');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(Error('Kortlageret kunne ikke åbnes. Tillad browserlagring og prøv igen.'));
  }).catch(error => { databasePromise = null; throw error; });
  return databasePromise;
}
function completed(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onabort = transaction.onerror = () => reject(Error('Importen kunne ikke gemmes. Browserens lager kan være fyldt. Ingen kort fra denne import er gemt.'));
  });
}
export async function readAnkiCards792(scope, includeArchived = false) {
  const db = await database792();
  return new Promise((resolve, reject) => {
    const request = db.transaction('cards').objectStore('cards').index('scope').getAll(scope);
    request.onsuccess = () => resolve(request.result.filter(row => includeArchived || !row.archived).map(row => ({ ...normalizeAnkiCard797(row.card), ...(row.archived ? { ankiArchived: true } : {}) })));
    request.onerror = () => reject(request.error);
  });
}
export async function archiveAnkiImport798(scope, moduleId, archived = true) {
  const db = await database792();
  const transaction = db.transaction('cards', 'readwrite'), done = completed(transaction);
  const store = transaction.objectStore('cards'), request = store.index('scope').openCursor(scope);
  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) return;
    if (cursor.value.card.moduleId === moduleId) cursor.update({ ...cursor.value, archived });
    cursor.continue();
  };
  await done;
}
export async function readAnkiMedia792(id) {
  if (staged.has(id)) return staged.get(id);
  const db = await database792();
  return new Promise((resolve, reject) => {
    const request = db.transaction('media').objectStore('media').get(id);
    request.onsuccess = () => resolve(request.result?.blob || null);
    request.onerror = () => reject(request.error);
  });
}
export async function persistAnkiImport792(storage, scope, cards) {
  if (!scope.userId) throw Error('Du skal være logget ind for at importere kort.');
  const db = await database792();
  const imported = await readAnkiCards792(scope.storageKey);
  const previous = JSON.parse(storage.getItem(scope.storageKey) || '[]');
  const queued = JSON.parse(storage.getItem(scope.queueKey) || '[]');
  if (!Array.isArray(previous) || !Array.isArray(queued)) throw Error('Det lokale kortlager kunne ikke læses.');
  const existing = new Map([...imported, ...previous, ...queued].map(card => [card.cardId, card]));
  const added = [];
  for (const card of cards) {
    if (existing.has(card.cardId)) continue;
    const owned = { ...card, ownerUserId: scope.userId };
    added.push(owned); existing.set(card.cardId, owned);
  }
  // Start and populate a single transaction without awaits: any quota error
  // rolls back both card and binary writes, including partially written batches.
  const transaction = db.transaction(['cards', 'media'], 'readwrite');
  const done = completed(transaction), assets = new Set();
  for (const card of added) {
    transaction.objectStore('cards').put({ key: [scope.storageKey, card.cardId], scope: scope.storageKey, card });
    for (const match of JSON.stringify(card.richContent || {}).matchAll(/medfluen-media:([a-f0-9]{64})/g)) assets.add(match[1]);
  }
  for (const id of assets) if (staged.has(id)) transaction.objectStore('media').put({ id, blob: staged.get(id) });
  await done;
  return { ok: true, imported: added.length, duplicates: cards.length - added.length, records: [...existing.values()], cardIds: added.map(card => card.cardId) };
}
