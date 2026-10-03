import { homeLayout79, navigateWorkspace79, normalizeWorkspace79, restoreWorkspace79 } from './workspace79-model';

describe('workspace 7.9 routing and layout', () => {
  test('retires Insights without discarding the user’s route context', () => {
    expect(normalizeWorkspace79('insights')).toEqual({
      area: 'home', route: 'home', notice: 'Indblik er flyttet. Dine resultater er bevaret.',
    });
    expect(normalizeWorkspace79('unknown')).toEqual({ area: 'home', route: 'home', notice: null });
    expect(normalizeWorkspace79('study-plan')).toEqual({ area: 'planning', route: 'study-plan', notice: null });
    expect(normalizeWorkspace79('training-history')).toEqual({ area: 'training', route: 'training-history', notice: null });
  });

  test('keeps Home broad unless a wide screen has an open companion', () => {
    expect(homeLayout79([], false, 1440)).toBe('wide');
    expect(homeLayout79([], true, 1024)).toBe('overlay');
    expect(homeLayout79([{ id: 'x' }], true, 1600)).toBe('split');
  });

  test('only restores the matching, versioned workspace state', () => {
    const saved = { version: 1, area: 'curriculum', documentId: 'lecture-1', selectedDate: '2026-09-24', split: 0.46 };
    expect(restoreWorkspace79(saved, 'curriculum')).toEqual(saved);
    expect(restoreWorkspace79(saved, 'home')).toBeNull();
    expect(restoreWorkspace79({ ...saved, split: 8 }, 'curriculum')).toBeNull();
    expect(restoreWorkspace79('{bad json', 'curriculum')).toBeNull();
  });

  test('changing study spaces keeps the assistant in the new context', () => {
    expect(navigateWorkspace79({ assistantOpen: true }, 'mcq')).toEqual({ route: 'mcq', activeWorkspace: null, assistantOpen: true });
    expect(navigateWorkspace79({ assistantOpen: true }, 'home')).toEqual({ route: 'home', activeWorkspace: null, assistantOpen: true });
  });

  test('the exam workspace has a persistent route separate from theory training', () => {
    expect(normalizeWorkspace79('exams')).toEqual({ area: 'exams', route: 'exams', notice: null });
    expect(navigateWorkspace79({ assistantOpen: true }, 'exams')).toEqual({ route: 'exams', activeWorkspace: null, assistantOpen: true });
  });

  test('only an explicit close request dismisses the assistant', () => {
    expect(navigateWorkspace79({ assistantOpen: true }, 'home', { closeAssistant: true }).assistantOpen).toBe(false);
  });
});
