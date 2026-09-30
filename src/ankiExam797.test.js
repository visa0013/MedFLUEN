import { ankiDeckTree797, normalizeAnkiCard797, numberedMcq797 } from './ankiExam797-model';

test('Anki hierarchy preserves every ancestor and aggregates cards without duplicates', () => {
  const cards = [
    { id: 'a', richContent: { anki: { deck: 'K3::Gastroenterologi::Pancreas' } } },
    { id: 'b', richContent: { anki: { deck: 'K3::Gastroenterologi::Lever' } } },
    { id: 'c', richContent: { anki: { deck: 'K3::Diabetes' } } },
  ];
  const tree = ankiDeckTree797('K3', cards, rows => ({ newCount: rows.length }));
  expect(tree.questions.map(card => card.id)).toEqual(['a', 'b', 'c']);
  expect(tree.children[0].label).toBe('K3');
  expect(tree.children[0].children[0].label).toBe('Gastroenterologi');
  expect(tree.children[0].children[0].stats.newCount).toBe(2);
  expect(tree.children[0].children[0].children.map(node => node.label)).toEqual(['Pancreas', 'Lever']);
});

test('numbered MCQ layout trims Anki spacer blocks but retains media', () => {
  const parsed = numberedMcq797('<div>Spørgsmål?</div><div><br></div><div>1) Første</div><div><br></div><div>2) Andet</div><div><img src="data:image/png;base64,YQ=="></div><div><br></div>', '2');
  expect(parsed.front).toBe('<div>Spørgsmål?</div>');
  expect(parsed.options[0]).toBe('<div>Første</div>');
  expect(parsed.options[1]).toContain('<img');
  expect(parsed.options[1]).not.toContain('<br>');
});

test('existing imports are upgraded without losing images, identity or owner', () => {
  const card = { cardId: 'anki-test-0', ownerUserId: 'me', cardType: 'basic', front: { da: 'Hvad?\n1) Første\n2) Andet' }, back: { da: '2' }, richContent: { front: { da: '<div>Hvad?</div><div>1) Første</div><div>2) Andet <img src="medfluen-media:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"></div>' }, back: { da: '2' }, anki: { deck: 'K3 eksamenssæt::Diabetes' } } };
  const next = normalizeAnkiCard797(card);
  expect(next).toMatchObject({ cardId: 'anki-test-0', ownerUserId: 'me', cardType: 'mcq', correct: 1, back: { da: '' } });
  expect(next.richContent.options[1].da).toContain('medfluen-media:');
  expect(next.richContent.anki.sourceKind).toBe('exam-mcq');
  expect(card.cardType).toBe('basic');
});
