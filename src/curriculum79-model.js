const KINDS = ['lecture', 'class', 'tbl'];

export function contentKind79(row) {
  return row?.kind == null ? 'lecture' : KINDS.includes(row.kind) ? row.kind : null;
}

export function visibleCurriculumTabs79(level, moduleLevel) {
  const graduate = level === 'Kandidat' || moduleLevel === 'Kandidat';
  return graduate ? [...KINDS] : KINDS.slice(0, 2);
}

export function catalogRows79(catalog, type) {
  return (Array.isArray(catalog) ? catalog : []).filter(row => contentKind79(row) === type);
}
