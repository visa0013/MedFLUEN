// A private, durable outbox. PDF pins and slide notes share these exact records.
export function annotationKey74(userId, materialId) {
  return `medfluen:annotations:74:${encodeURIComponent(userId || "anonymous")}:${encodeURIComponent(materialId || "none")}`;
}

export function mergeAnnotationEdit74(current, next, previous) {
  if (!previous) return next;
  if (!current) return null;
  const payload = { ...current.payload };
  Object.keys(next.payload || {}).forEach(key => {
    if (JSON.stringify(next.payload[key]) !== JSON.stringify(previous.payload?.[key])) payload[key] = next.payload[key];
  });
  const merged = { ...current, payload };
  ["page", "type", "color", "updatedAt"].forEach(key => { if (next[key] !== previous[key]) merged[key] = next[key]; });
  return merged;
}

const annotationOwners74 = new WeakMap();
export function getAnnotationJournal74(owner, options) {
  let journals = annotationOwners74.get(owner);
  if (!journals) { journals = new Map(); annotationOwners74.set(owner, journals); }
  if (!journals.has(options.key)) journals.set(options.key, createAnnotationJournal74(options));
  return journals.get(options.key);
}

export function createAnnotationJournal74({ storage, key, initial = [], send = null }) {
  let cached;
  try { cached = JSON.parse(storage.getItem(key) || "null"); } catch { cached = null; }
  let rows = new Map((Array.isArray(cached?.rows) ? cached.rows : initial).filter(r => r?.id).map(r => [r.id, r]));
  const pending = new Map((Array.isArray(cached?.operations) ? cached.operations : []).filter(o => o?.id).map(o => [o.id, o]));
  const changes = new Map(pending);
  let revision = Math.max(0, Number(cached?.revision) || 0);
  let diskOK = true;
  let running = null;
  let status = pending.size ? "local" : "ready";
  const listeners = new Set();
  let snapshot;
  function publish() {
    snapshot = { rows: [...rows.values()], revision, pending: pending.size, status: diskOK ? status : "storage-error" };
    listeners.forEach(listener => listener());
  }
  function persist() {
    try { storage.setItem(key, JSON.stringify({ rows: [...rows.values()], operations: [...pending.values()], revision })); diskOK = true; }
    catch { diskOK = false; }
  }
  function change(id, row) {
    if (!id) return;
    const op = { id, revision: ++revision, row: row || null };
    if (row) rows.set(id, row); else rows.delete(id);
    changes.set(id, op); pending.set(id, op); status = "local";
    persist(); publish();
  }
  publish();
  return {
    snapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    put(row) { change(row?.id, row); },
    edit(row, previous) { const next = mergeAnnotationEdit74(rows.get(row?.id), row, previous); if (next) change(next.id, next); },
    remove(id) { change(id, null); },
    hydrationToken() { return { revision, pendingIds: [...pending.keys()] }; },
    hydrate(remote, token = revision) {
      const startedRevision = typeof token === "object" ? token.revision : token;
      const wasPending = new Set(typeof token === "object" ? token.pendingIds : []);
      const merged = new Map((remote || []).filter(r => r?.id).map(r => [r.id, r]));
      changes.forEach(op => {
        if (pending.has(op.id) || wasPending.has(op.id) || op.revision > startedRevision) {
          if (op.row) merged.set(op.id, op.row); else merged.delete(op.id);
        }
      });
      rows = merged; persist(); publish();
    },
    flush() {
      if (running) return running;
      if (!send || !pending.size) return Promise.resolve();
      status = "saving"; publish();
      running = (async () => {
        try {
          while (pending.size) {
            const op = [...pending.values()].sort((a, b) => a.revision - b.revision)[0];
            await send(op);
            if (pending.get(op.id)?.revision === op.revision) pending.delete(op.id);
            persist(); publish();
          }
          status = "ready";
        } catch { status = "local"; }
        finally { running = null; publish(); }
      })();
      return running;
    },
  };
}

export function slideNotes74(annotations, query = "") {
  const needle = String(query).trim().toLocaleLowerCase();
  return (annotations || []).filter(note => note?.type === "sticky" && !note.deletedAt)
    .filter(note => !needle || [note.payload?.title, note.payload?.text, note.payload?.question, ...(note.payload?.tags || []), String(note.page)].join(" ").toLocaleLowerCase().includes(needle))
    .sort((a, b) => a.page - b.page || String(a.createdAt || a.id).localeCompare(String(b.createdAt || b.id)));
}

export function exportSlideNotes74(annotations, fileName) {
  return [`# ${String(fileName || "Noter")}`, ...slideNotes74(annotations).map(note => {
    const p = note.payload || {};
    return `## ${p.title || "Slide " + note.page}\n\n${fileName || "PDF"} · side ${note.page}\n\n${p.text || ""}${p.question ? "\n\nSpørgsmål: " + p.question : ""}${p.tags?.length ? "\n\nMærker: " + p.tags.join(", ") : ""}`;
  })].join("\n\n");
}

export function pdfFailure74(error, stage = "document") {
  const message = String(error?.message || "");
  const name = String(error?.name || "");
  const code = stage === "runtime" ? "runtime"
    : /worker|WorkerMessageHandler/i.test(message) ? "worker"
    : error?.status === 401 || error?.status === 403 ? "access"
    : name === "PasswordException" ? "password"
    : name === "InvalidPDFException" ? "invalid"
    : name === "MissingPDFException" || error?.status === 404 ? "missing"
    : /fetch|network|response|load failed/i.test(message) ? "network" : "document";
  return { code, stage, status: [400, 401, 403, 404, 413, 500, 502, 503].includes(error?.status) ? error.status : null };
}
