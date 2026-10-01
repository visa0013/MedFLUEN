import { useAccountStorage792 } from './accountStorage792';

// A private, recoverable overlay: original cards, media and scheduling records
// stay intact. Never send destructive mutations to the shared question bank.
export function useCardTrash803(userId, questions) {
  const [saved, setSaved] = useAccountStorage792('medfluen-card-trash803', userId, []);
  const batches = Array.isArray(saved) ? saved.filter(batch => typeof batch?.scope === 'string' && Array.isArray(batch.ids)) : [];
  const discarded = new Set(batches.flatMap(batch => batch.ids));
  function change({ scope, moduleId, ids = [], restore = false }) {
    if (!userId) return { ok: false, error: 'Log ind for at ændre dine kort.' };
    if (typeof scope !== 'string' || !scope) return { ok: false, error: 'Vælg et dæk først.' };
    const allowed = new Set(questions.filter(card => card.moduleId === moduleId).map(card => String(card.id)));
    const selected = [...new Set(ids.filter(id => typeof id === 'string' && allowed.has(id)))];
    try {
      setSaved(previous => {
        const current = Array.isArray(previous) ? previous : [];
        const existing = current.find(batch => batch.scope === scope);
        const remaining = current.filter(batch => batch.scope !== scope);
        return restore ? remaining : [...remaining, { scope, moduleId, ids: [...new Set([...(existing?.ids || []), ...selected])] }];
      });
      return { ok: true };
    } catch {
      return { ok: false, error: 'Ændringen kunne ikke gemmes. Kortene er ikke kasseret.' };
    }
  }
  return { questions: questions.filter(card => !discarded.has(String(card.id))), batches, change };
}

export function filterCardTree803(tree, visibleIds, stats) {
  const questions = (tree.questions || []).filter(card => visibleIds.has(String(card.id)));
  return { ...tree, questions, stats: stats(questions), children: (tree.children || []).map(child => filterCardTree803(child, visibleIds, stats)) };
}
