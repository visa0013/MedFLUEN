export function normalizeQuizSettings78(raw = {}) {
  const format = raw.format == null ? 'mcq' : raw.format;
  const count = raw.count == null ? 3 : Number(raw.count);
  const flow = raw.flow == null ? 'guided' : raw.flow;
  if (!['mcq', 'short'].includes(format) || ![1, 3, 5, 10].includes(count) || !['guided', 'questions-only'].includes(flow)) {
    throw new Error('Vælg et gyldigt format, antal og forløb.');
  }
  return { format, count, flow };
}

export function quizBatches78(count) {
  const selected = Number(count);
  if (![1, 3, 5, 10].includes(selected)) throw new Error('Ugyldigt antal spørgsmål.');
  const batches = [];
  for (let left = selected; left > 0; left -= 3) batches.push(Math.min(left, 3));
  return batches;
}

export async function requestQuizBatches78(rawSettings, sources, ask, onBatch, previous = null) {
  const settings = normalizeQuizSettings78(rawSettings);
  if (!Array.isArray(sources) || !sources.length) throw new Error('Vælg en læsbar PDF-kilde først.');
  const questions = Array.isArray(previous?.questions) ? [...previous.questions] : [];
  if (questions.length > settings.count) throw new Error('Tidligere spørgsmål passer ikke til dette antal.');
  let error = null;
  for (let remaining = settings.count - questions.length; remaining > 0;) {
    const quizCount = Math.min(3, remaining);
    try {
      const response = await ask({ mode: 'quiz', quizFormat: settings.format, quizCount, sources });
      const batch = response?.quiz?.questions;
      if (!Array.isArray(batch) || batch.length !== quizCount) throw new Error('Dr. Byte leverede ikke det aftalte antal spørgsmål.');
      const rows = batch.map((row, index) => ({ ...row, id: `quiz-${questions.length + index + 1}` }));
      questions.push(...rows);
      if (typeof onBatch === 'function') onBatch(rows);
      remaining -= quizCount;
    } catch (caught) {
      error = caught;
      break;
    }
  }
  return { questions, completed: questions.length, error };
}

export function createQuizState78(questions, flow = 'guided') {
  return { questions: [...questions], flow, index: 0, phase: 'question', answers: {}, revealed: {}, hints: {} };
}

export function nextQuizStep78(state, event) {
  const index = Math.max(0, Math.min(state.questions.length - 1, state.index));
  const id = state.questions[index]?.id;
  if (!id) return state;
  if (event.type === 'SHOW_HINT') return { ...state, phase: 'hint', hints: { ...state.hints, [id]: true } };
  if (event.type === 'SUBMIT') return { ...state, phase: 'answer', answers: { ...state.answers, [id]: event.answer } };
  if (event.type === 'REVEAL') return { ...state, phase: 'feedback', revealed: { ...state.revealed, [id]: true } };
  if (event.type === 'NEXT' || event.type === 'PREVIOUS') {
    const next = Math.max(0, Math.min(state.questions.length - 1, index + (event.type === 'NEXT' ? 1 : -1)));
    const nextId = state.questions[next]?.id;
    return { ...state, index: next, phase: state.revealed[nextId] ? 'feedback' : state.hints[nextId] ? 'hint' : 'question' };
  }
  return state;
}
