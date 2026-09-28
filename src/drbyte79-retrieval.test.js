import { rankExcerpts79, sourcePreview79 } from './drbyte79-retrieval';

describe('verified PDF excerpts', () => {
  test('ranks exact phrase and document title above incidental overlap', () => {
    const pages = [
      { documentId: 'other', title: 'Andet', page: 2, text: 'Dette er en bred omtale af epilepsi og et andet emne.' },
      { documentId: 'n4', title: 'N4 Epilepsi', page: 16, text: 'Fokale anfald begynder i et afgrænset netværk.' },
    ];
    expect(rankExcerpts79(pages, 'fokale anfald', 2)[0].page).toBe(16);
  });

  test('verifies the exact cited passage and never invents coordinates', () => {
    const page = { documentId: 'n4', title: 'N4 Epilepsi', page: 16, text: 'Fokale anfald begynder i et afgrænset netværk.' };
    const citation = { documentId: 'n4', page: 16, text: 'Fokale anfald begynder i et afgrænset netværk.' };
    expect(sourcePreview79(citation, page)).toEqual({ title: 'N4 Epilepsi', page: 16, quote: citation.text, highlight: null });
    expect(sourcePreview79({ ...citation, text: 'Et opdigtet uddrag' }, page)).toBeNull();
  });

  test('an image-only PDF is explicitly not searchable', () => {
    expect(rankExcerpts79([{ documentId: 'scan', page: 1, text: '' }], 'epilepsi')).toEqual([]);
  });
});
