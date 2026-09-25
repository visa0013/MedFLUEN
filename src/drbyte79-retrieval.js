function normalized79(value) {
  return String(value || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLocaleLowerCase('da-DK');
}

export function rankExcerpts79(pages, question, limit = 12) {
  const query = normalized79(question);
  const terms = [...new Set(query.match(/[\p{L}\p{N}]{3,}/gu) || [])];
  const scored = (Array.isArray(pages) ? pages : []).filter(page => typeof page?.text === 'string' && page.text.trim()).map((page, order) => {
    const body = normalized79(page.text);
    const title = normalized79(page.title);
    const whole = term => new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}\\p{N}])`, 'u');
    const score = (query && body.includes(query) ? 12 : 0) + terms.reduce((sum, term) => sum + (whole(term).test(body) ? 2 : 0) + (whole(term).test(title) ? 3 : 0), 0);
    return { ...page, score, order };
  });
  return scored.filter(page => !terms.length || page.score > 0).sort((a, b) => b.score - a.score || a.order - b.order).slice(0, Math.max(1, Math.min(12, limit)));
}

export function sourcePreview79(citation, source) {
  if (!source || String(citation?.documentId) !== String(source.documentId) || Number(citation?.page) !== Number(source.page)) return null;
  const quote = String(citation?.text || '').normalize('NFKC').replace(/\s+/g, ' ').trim();
  const body = String(source.text || '').normalize('NFKC').replace(/\s+/g, ' ');
  if (quote.length < 8 || !body.toLocaleLowerCase('da-DK').includes(quote.toLocaleLowerCase('da-DK'))) return null;
  return { title: source.title || citation.title || 'PDF-kilde', page: source.page, quote, highlight: null };
}
