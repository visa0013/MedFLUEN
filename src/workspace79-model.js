const ROUTES = Object.freeze({
  home: 'home',
  mcq: 'training',
  'training-history': 'training',
  training: 'training',
  curriculum: 'curriculum',
  lectures: 'curriculum',
  notes: 'notes',
  planning: 'planning',
  calendar: 'planning',
  'study-plan': 'planning',
});

export function normalizeWorkspace79(route) {
  if (route === 'insights') {
    return { area: 'home', route: 'home', notice: 'Indblik er flyttet. Dine resultater er bevaret.' };
  }
  const area = typeof route === 'string' ? ROUTES[route] : null;
  return area ? { area, route, notice: null } : { area: 'home', route: 'home', notice: null };
}

export function restoreWorkspace79(raw, area) {
  let value = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.version !== 1 || value.area !== area) return null;
  if (typeof value.split !== 'number' || value.split < 0.32 || value.split > 0.68) return null;
  if (value.documentId != null && typeof value.documentId !== 'string') return null;
  if (value.selectedDate != null && !/^\d{4}-\d{2}-\d{2}$/.test(value.selectedDate)) return null;
  return value;
}

export function homeLayout79(events, chatOpen, viewportWidth) {
  if (!chatOpen) return 'wide';
  return Number(viewportWidth) >= 1200 ? 'split' : 'overlay';
}

export function navigateWorkspace79(state, target, options = {}) {
  return {
    route: normalizeWorkspace79(target).route,
    activeWorkspace: null,
    assistantOpen: options.closeAssistant ? false : Boolean(state?.assistantOpen),
  };
}
