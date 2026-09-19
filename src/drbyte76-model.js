// Retrieval stays on the user's device; only selected, bounded excerpts leave it.
export function selectSources76(docs, question) {
  const stop = new Set(['hvad','hvordan','hvor','med','den','det','der','som','kan','for','the','and','forklar','please','explain','opsummer']);
  const terms = [...new Set(String(question).toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])].filter(t => !stop.has(t));
  const pages = docs.filter(d => d.selected).flatMap(d => d.pages || []).filter(p => p.text?.trim());
  const ranked = pages.map((p, order) => {
    const lower = p.text.toLocaleLowerCase();
    const matches = terms.map(t => lower.indexOf(t)).filter(n => n >= 0);
    const score = matches.length + terms.filter(t => (p.title || '').toLocaleLowerCase().includes(t)).length * 0.5;
    const start = Math.max(0, (matches[0] || 0) - 600);
    return { ...p, score, order, excerpt: p.text.slice(start, start + 5000) };
  });
  // For generic questions, sample a bounded selection; the assistant is told this is not exhaustive.
  const matched = ranked.filter(p => p.score > 0);
  return (matched.length ? matched.sort((a,b) => b.score - a.score || a.order - b.order) : ranked)
    .slice(0, 12).map((p,i) => ({ id: `S${i + 1}`, documentId: String(p.documentId).slice(0,300), title: String(p.title).slice(0,300), page: p.page, text: p.excerpt }));
}

export async function askDrByte76(payload, supabase, signal, request = fetch) {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session?.access_token) throw Error('Log ind igen for at bruge Dr. Byte.');
  const response = await request('/api/dr-byte', { method: 'POST', signal,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.session.access_token}` }, body: JSON.stringify(payload) });
  let body;
  try { body = await response.json(); } catch {
    throw Error(response.status === 404 ? 'AI-serveren mangler. Upload api/dr-byte.js og api/_lib/dr-byte-core.cjs, og deploy igen.' : 'Serveren gav ikke et læsbart svar. Prøv igen senere.');
  }
  if (!response.ok) throw Error(body?.error?.message || 'Dr. Byte kunne ikke svare. Prøv igen senere.');
  if (!Array.isArray(body?.paragraphs)) throw Error('Svaret kunne ikke læses. Prøv igen.');
  return body;
}
