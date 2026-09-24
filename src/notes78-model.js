export function clampPage78(value, numPages = 0) {
  const page = Math.max(1, Math.floor(Number(value) || 1));
  const limit = Math.floor(Number(numPages) || 0);
  return limit > 0 ? Math.min(page, limit) : page;
}

export function notePageKey78(userId, materialId, page) {
  return JSON.stringify([String(userId || ''), String(materialId || ''), clampPage78(page)]);
}

export function restoreNoteDrafts78(storage, userId) {
  if (!storage || !userId) return [];
  const prefix = `mf78-note-draft:${userId}:`;
  const drafts = [];
  try {
    for (let index = 0; index < storage.length; index += 1) {
      const key = storage.key(index);
      if (!key?.startsWith(prefix)) continue;
      try {
        const row = JSON.parse(storage.getItem(key));
        if (row?.user_id === userId && row.id && key === `${prefix}${row.id}`) drafts.push(row);
      } catch { /* One corrupt draft must not hide the others. */ }
    }
  } catch { /* Private browsing can deny access to storage. */ }
  return drafts;
}

export function normalizeLegacyLectureNote78(row = {}) {
  const get = (camel, snake) => String(row[camel] ?? row[snake] ?? '');
  const freeText = get('freeText', 'free_text');
  const legacySections = [get('keyPoints','key_points'), get('clinicalPoints','clinical_points'), get('openQuestions','open_questions')];
  return { freeText, legacySections, hasContent: Boolean(freeText.trim() || legacySections.some(v => v.trim())) };
}

export function collectNotes78({ lectureRows = [], annotationRows = [], personalRows = [], legacyLocalRows = [], userId } = {}) {
  const own = row => Boolean(userId && row.user_id === userId);
  const lecture = lectureRows.filter(own).map(row => {
    const legacy = normalizeLegacyLectureNote78(row);
    return { id:`lecture:${row.module_name}:${row.lecture_id}`, kind:'lecture', title:row.title || row.lecture_id || 'Forelæsning', body:legacy.freeText,
      legacySections:legacy.legacySections, module:row.module_name, lectureId:row.lecture_id, userId, updatedAt:row.updated_at, tags:[], pinned:false,
      source:{lectureId:row.lecture_id}, localOnly:false };
  }).filter(row => Boolean(row.body.trim() || row.legacySections.some(v => v.trim())));
  const pages = annotationRows.filter(own).filter(row => row.payload?.kind === 'slide-note').map(row => ({
    id:`page:${row.id}`, kind:'page', title:row.payload?.title || `Side ${row.page_number || 1}`, body:row.payload?.text || '',
    tags:row.payload?.tags || [], userId, module:row.module_name, lectureId:row.lecture_id, updatedAt:row.updated_at,
    pinned:false, source:{lectureId:row.lecture_id,materialId:row.material_id,page:row.page_number}, localOnly:false,
  }));
  const personal = personalRows.filter(own).map(row => ({
    id:row.id, kind:'personal', title:row.title || 'Uden titel', body:row.body || '', tags:row.tags || [], collection:row.collection || '',
    pinned:Boolean(row.is_pinned), links:row.linked_note_ids || [], userId, updatedAt:row.updated_at,
    source:{lectureId:row.source_lecture_id, materialId:row.source_material_id, page:row.source_page}, localOnly:false,
    revision:row.revision || 1,
  }));
  // Old browser tabs are displayed only in their own explicitly local section.
  const local = legacyLocalRows.map(row => ({ id:`local:${row.id}`, kind:'local', title:row.title || 'Lokal note', body:String(row.content || '').replace(/<[^>]+>/g,' '),
    originalHtml:row.content || '', tags:[], pinned:false, localOnly:true, userId }));
  return [...personal, ...lecture, ...pages, ...local];
}

export function filterNotes78(rows, { query = '', kind = 'all', module = '', lectureId = '', tag = '', collection = '' } = {}) {
  const q = query.trim().toLocaleLowerCase();
  return (rows || []).filter(row => (kind === 'all' || (kind === 'favorites' ? row.pinned : row.kind === kind)) &&
    (!module || row.module === module) && (!lectureId || row.lectureId === lectureId || row.source?.lectureId === lectureId) &&
    (!tag || row.tags?.includes(tag)) && (!collection || row.collection === collection) &&
    (!q || [row.title,row.body,row.module,row.lectureId,row.collection,...(row.tags || [])].join(' ').toLocaleLowerCase().includes(q)));
}

export function resolveBacklinks78(rows, targetId) {
  return (rows || []).filter(row => (row.links || []).includes(targetId));
}
