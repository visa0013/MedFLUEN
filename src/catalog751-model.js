// IDs are permanent references used by notes, cards, materials and date mappings.
export function validateCatalog751(rows, previous = []) {
  if (!Array.isArray(rows) || rows.length > 2000) throw new Error("Forelæsningslisten er ugyldig.");
  const ids = new Set();
  for (const row of rows) {
    if (!row || typeof row.id !== "string" || !/^[A-Za-z0-9_-]{1,80}$/.test(row.id) || ids.has(row.id)) throw new Error("Forelæsnings-ID mangler eller er gentaget.");
    if (typeof row.title !== "string" || !row.title.trim() || row.title.length > 300) throw new Error("Angiv en titel på højst 300 tegn.");
    if (typeof row.group !== "string" || !row.group.trim() || row.group.length > 120) throw new Error("Angiv et hovedemne på højst 120 tegn.");
    if (row.kind != null && !["lecture", "class", "tbl"].includes(row.kind)) throw new Error("Vælg forelæsning, holdtime eller TBL.");
    if (row.parts != null && (!Number.isInteger(row.parts) || row.parts < 1 || row.parts > 50)) throw new Error("Antal dele skal være mellem 1 og 50.");
    ids.add(row.id);
  }
  if (previous.some(row => !ids.has(row.id))) throw new Error("Eksisterende forelæsninger må ikke fjernes: noter og kort kan være tilknyttet.");
  return rows.map(row => ({ ...row, title: row.title.trim(), group: row.group.trim() }));
}

export function mergeCatalog751(base, remote) {
  if (!remote) return base;
  const valid = validateCatalog751(remote);
  const ids = new Set(valid.map(row => row.id));
  return [...valid.map(row => ({ ...base.find(item => item.id === row.id), ...row })), ...base.filter(row => !ids.has(row.id))];
}

export function moveLecture751(rows, id, group, beforeId = null) {
  const item = rows.find(row => row.id === id);
  if (!item || beforeId === id || !group?.trim()) return rows;
  const result = rows.filter(row => row.id !== id);
  const before = result.findIndex(row => row.id === beforeId && row.group === group);
  let index = before;
  if (index < 0) { index = result.reduce((last, row, i) => row.group === group ? i + 1 : last, result.length); }
  result.splice(index, 0, { ...item, group });
  return result;
}

export async function saveCatalog751(client, moduleName, rows, revision, userId, previous) {
  const lectures = validateCatalog751(rows, previous);
  if (!userId || !moduleName?.trim() || moduleName.length > 200) throw new Error("Log ind og vælg et modul først.");
  const payload = { module_name: moduleName, lectures, revision: revision + 1, updated_by: userId };
  const query = revision === 0
    ? client.from("lecture_catalog_751").insert(payload)
    : client.from("lecture_catalog_751").update(payload).eq("module_name", moduleName).eq("revision", revision);
  const { data, error } = await query.select("module_name,lectures,revision").maybeSingle();
  if (error?.code === "23505" || (!error && !data)) throw new Error("Listen er ændret af en anden administrator. Genindlæs listen før du gemmer igen.");
  if (error) throw new Error("Listen kunne ikke gemmes. Kontrollér adminadgang og SQL-opsætning. Din kladde er bevaret.");
  return data;
}

export function createCatalogStore751(base) {
  const catalog = { ...base }, listeners = new Set();
  let epoch = 0, state = { status: "idle", revisions: {}, version: 0 };
  const emit = (patch) => { state = { ...state, ...patch, version: state.version + 1 }; listeners.forEach(fn => fn()); };
  const accept = (row) => {
    const current = state.revisions[row.module_name] || 0;
    if (!Number.isInteger(row.revision) || row.revision < 1 || row.revision < current) return;
    catalog[row.module_name] = mergeCatalog751(base[row.module_name] || [], row.lectures);
    emit({ revisions: { ...state.revisions, [row.module_name]: row.revision } });
  };
  return {
    catalog, getSnapshot: () => state,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    accept,
    reset() { epoch++; Object.keys(catalog).forEach(key => delete catalog[key]); Object.assign(catalog, base); emit({ status: "idle", revisions: {} }); },
    async refresh(client) {
      const token = ++epoch;
      if (state.status === "idle") emit({ status: "loading" });
      try {
        const { data, error } = await client.from("lecture_catalog_751").select("module_name,lectures,revision");
        if (token !== epoch) return;
        if (error || !Array.isArray(data)) throw new Error("catalog");
        // Validate the entire response before exposing any of it.
        data.forEach(row => { validateCatalog751(row.lectures); if (typeof row.module_name !== "string" || !Number.isInteger(row.revision)) throw new Error("catalog"); });
        data.forEach(accept); emit({ status: "ready" });
      } catch (_) { if (token === epoch) emit({ status: "error" }); }
    },
  };
}
