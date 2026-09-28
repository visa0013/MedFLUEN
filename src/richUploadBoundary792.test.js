import { sanitizeRich72, richText72 } from './experience72-model';
import { convertAnkiCollection792 } from './ankiImport792';

// JSDOM does not fetch images. Observe the browser boundary that would allow
// image requests: raw external markup reaching an active-document HTML parser.
function observeActiveParsing(run) {
  const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  const unsafe = [];
  const setter = jest.spyOn(Element.prototype, 'innerHTML', 'set').mockImplementation(function (html) {
    if (this.ownerDocument === document && this.tagName !== 'TEMPLATE' && String(html).includes('tracker.invalid')) unsafe.push(String(html));
    descriptor.set.call(this, html);
  });
  try { const result = run(); return { result, unsafe }; } finally { setter.mockRestore(); }
}

const hostile = '<p onclick="alert(1)">Keep <b>formatting</b></p><img src="https://tracker.invalid/private-card"><img srcset="https://tracker.invalid/variant 2x" src="data:image/png;base64,iVBORw0KGgo=" onerror="alert(1)"><iframe src="https://tracker.invalid/frame"></iframe><script>alert(1)</script><svg><image href="https://tracker.invalid/svg" /></svg><style>p{background:url(https://tracker.invalid/style)}</style>';

test('rich HTML is sanitized while inert, before remote resources can reach an active document', () => {
  const { result, unsafe } = observeActiveParsing(() => sanitizeRich72(hostile));
  expect(unsafe).toEqual([]);
  expect(result).toContain('<p>Keep <b>formatting</b></p>');
  expect(result).toContain('data:image/png;base64,iVBORw0KGgo=');
  expect(result).not.toMatch(/tracker\.invalid|onclick|onerror|srcset|iframe|script|svg|style/);
  expect(richText72(hostile)).toBe('Keep formatting\n[Billede]');
});

test('Anki media resolution never parses raw uploaded fields in the active document', () => {
  const model = { name: 'Basic', type: 0, flds: [{ name: 'Front' }, { name: 'Back' }], tmpls: [{ ord: 0, qfmt: '{{Front}}', afmt: '{{Back}}' }] };
  const collection = { models: { 10: model }, decks: { 5: { name: 'Medical' } }, notes: [{ id: 20, guid: 'boundary', mid: 10, tags: '', flds: `${hostile}<img src="local.png" onerror="alert(1)">\x1fAnswer` }], cards: [{ id: 30, nid: 20, did: 5, ord: 0 }] };
  const { result, unsafe } = observeActiveParsing(() => convertAnkiCollection792(collection, { moduleId: 'K5', language: 'da', media: { 'local.png': 'data:image/png;base64,iVBORw0KGgo=' } }));
  expect(unsafe).toEqual([]);
  expect(result.cards).toHaveLength(1);
  expect(result.cards[0].richContent.front.da).not.toMatch(/tracker\.invalid|onerror|onclick|srcset|script|iframe|svg/);
  expect(result.cards[0].richContent.front.da).toContain('data:image/png;base64,iVBORw0KGgo=');
  expect(result.warnings.join(' ')).toContain('tracker.invalid');
});
