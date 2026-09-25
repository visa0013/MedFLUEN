export function conversationState79(raw) {
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      activeId: typeof value?.activeId === 'string' && value.activeId.length <= 128 ? value.activeId : null,
      draft: typeof value?.draft === 'string' ? value.draft.slice(0, 6000) : '',
      sourceIds: Array.isArray(value?.sourceIds) ? value.sourceIds.filter(id => typeof id === 'string' && id.length <= 128).slice(0, 12) : [],
    };
  } catch { return { activeId: null, draft: '', sourceIds: [] }; }
}

export function conversationTitle79(question) {
  const title = typeof question === 'string' ? question.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  return title || 'Ny samtale';
}

export function quotaError79(code) {
  if (code === 'APP_QUOTA') return 'Appens sikkerhedsgrænse er nået. Spørgsmålet er bevaret; prøv igen senere.';
  if (code === 'GEMINI_QUOTA' || code === 'PROVIDER_QUOTA') return 'Google Gemini har nået projektets gratis kapacitet. Ingen betalt model bruges automatisk.';
  return 'Dr. Byte kunne ikke svare lige nu. Dit spørgsmål er bevaret.';
}
