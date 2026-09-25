const WORKSPACE_TABS_78 = Object.freeze({
  home: [],
  training: ['training-start', 'training-exams'],
  curriculum: ['curriculum-lectures'],
  planning: ['planning-calendar', 'planning-study-plan'],
  notes: ['notes-all', 'notes-lectures', 'notes-pages', 'notes-favorites'],
});

export function workspaceTabs78(area) {
  return [...(WORKSPACE_TABS_78[area] || [])];
}

export function homeFluid78(chatOpen, viewportWidth) {
  return Boolean(chatOpen) && Number(viewportWidth) > 700;
}

export async function enterFocus78(requestFullscreen, setInternalFocus) {
  if (typeof requestFullscreen === 'function') {
    try {
      await requestFullscreen();
      setInternalFocus(false);
      return 'native';
    } catch {
      // Browser policy may reject even a user-initiated request.
    }
  }
  setInternalFocus(true);
  return 'internal';
}

export async function leaveFocus78(exitFullscreen, setInternalFocus) {
  if (typeof exitFullscreen === 'function') {
    try { await exitFullscreen(); } catch { /* Internal focus still exits. */ }
  }
  setInternalFocus(false);
}
