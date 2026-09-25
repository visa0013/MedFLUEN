const CONVERSATIONS = 'dr_byte_conversations_79';
const MESSAGES = 'dr_byte_messages_79';

function bounded79(value, max = 6000) { return typeof value === 'string' ? value.slice(0, max) : ''; }
function requireId79(id) { if (typeof id !== 'string' || !id.trim() || id.length > 128) throw new Error('Ugyldigt samtale-id.'); return id; }
function rows79(result) { if (result.error) throw result.error; return result.data || []; }

function source79(source) {
  if (!source || !['pdf', 'document', 'web'].includes(source.kind)) return null;
  const item = { kind: source.kind, documentId: bounded79(source.documentId, 128), page: Number.isInteger(source.page) ? source.page : null, title: bounded79(source.title, 180), text: bounded79(source.text, 800) };
  if (typeof source.id === 'string') item.id = bounded79(source.id, 32);
  if (source.kind === 'web') item.url = /^https:\/\//.test(source.url || '') ? bounded79(source.url, 500) : '';
  return item;
}

export function conversationBody79(message) {
  const body = { text: bounded79(message?.text) };
  if (typeof message?.lectureId === 'string') body.lectureId = bounded79(message.lectureId, 128);
  if (Array.isArray(message?.paragraphs)) body.paragraphs = message.paragraphs.slice(0, 30).map(p => ({
    text: bounded79(p?.text, 3500), citations: (Array.isArray(p?.citations) ? p.citations : []).slice(0, 8).map(source79).filter(Boolean),
  }));
  if (message?.quiz && Array.isArray(message.quiz.questions)) body.quiz = {
    format: message.quiz.format === 'short' ? 'short' : 'mcq',
    flow: message.quiz.flow === 'guided' ? 'guided' : 'questions-only',
    questions: message.quiz.questions.slice(0, 20).map(q => ({
      prompt: bounded79(q.prompt, 1500), options: (Array.isArray(q.options) ? q.options : []).slice(0, 5).map(o => bounded79(o, 500)),
      answerIndex: Number.isInteger(q.answerIndex) ? q.answerIndex : 0,
      modelAnswer: bounded79(q.modelAnswer, 1500), explanation: bounded79(q.explanation, 2500),
      source: source79(q.source),
    })),
  };
  return body;
}

export async function listConversations79(client, userId, offset = 0, limit = 30) {
  requireId79(userId);
  if (!Number.isInteger(offset) || offset < 0 || !Number.isInteger(limit) || limit < 1 || limit > 30) throw new Error('Ugyldig samtaleforespørgsel.');
  return rows79(await client.from(CONVERSATIONS).select('id,title,updated_at').eq('owner_id', userId).order('updated_at', { ascending: false }).order('id', { ascending: false }).range(offset, offset + limit - 1));
}

export async function createConversation79(client, userId, title) {
  requireId79(userId);
  const result = await client.from(CONVERSATIONS).insert({ owner_id: userId, title: bounded79(title, 120) || 'Ny samtale' }).select('id,title,updated_at').single();
  if (result.error) throw result.error;
  return result.data;
}

export async function loadConversation79(client, id) {
  requireId79(id);
  return rows79(await client.from(MESSAGES).select('id,role,body,created_at').eq('conversation_id', id).order('created_at', { ascending: true }).order('id', { ascending: true }).limit(200));
}

export async function saveMessage79(client, conversationId, message) {
  requireId79(conversationId);
  if (!['user', 'assistant'].includes(message?.role)) throw new Error('Ugyldig afsender.');
  const body = conversationBody79(message);
  if (!body.text && !body.paragraphs?.length && !body.quiz?.questions?.length) return;
  const result = await client.from(MESSAGES).insert({ conversation_id: conversationId, role: message.role, body });
  if (result.error) throw result.error;
}

export async function renameConversation79(client, id, title) {
  requireId79(id);
  const value = bounded79(title?.trim(), 120);
  if (!value) throw new Error('Skriv en titel.');
  const result = await client.from(CONVERSATIONS).update({ title: value, updated_at: new Date().toISOString() }).eq('id', id);
  if (result.error) throw result.error;
}

export async function deleteConversation79(client, id) {
  requireId79(id);
  const result = await client.from(CONVERSATIONS).delete().eq('id', id);
  if (result.error) throw result.error;
}
