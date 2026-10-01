import { buildLecturePrompt800, lectureTemplate800 } from './lecture800-prompt';
import { validateLecture800 } from './lecture800-model';
import Ajv from 'ajv';

const target = { moduleId: 'K5 Nervesystem og psykiatri', lectureId: 'N2', title: 'Myasteni' };

test('a completed template imports with a neutral illustrative section instead of forcing disease sections', () => {
  const pack = lectureTemplate800(target);
  pack.cards[0].question = 'Hvilke punkter fremgår af kilden?';
  pack.cards[0].answerItems[0].text = 'Første kildepunkt.';
  pack.cards[0].answerItems[1].text = 'Andet kildepunkt.';

  const validated = validateLecture800(pack);
  expect(validated.sections).toEqual([{ id: 'overview', title: 'Fagligt overblik', order: 1 }]);
  expect(validated.cards[0].sectionId).toBe('overview');
});

test('practice import keeps its non-clinical overview and puts its definition behind the answer', () => {
  const pack = validateLecture800(lectureTemplate800(target, true));

  expect(pack.packageId).toBe('import-practice-v1');
  expect(pack.sections).toEqual([{ id: 'overview', title: 'Afprøvning af import', order: 1 }]);
  expect(pack.cards[0].sectionId).toBe('overview');
  expect(pack.cards[0].question).not.toContain('[[');
  expect(pack.cards[0].explanation).toContain('[[source-ref|kildehenvisning]]');
});

test('the prompt delivers an import schema that confines external source links to glossary definitions', () => {
  const prompt = buildLecturePrompt800(target), emittedSchema = JSON.parse(prompt.split('## JSON Schema — skal overholdes\n')[1]);
  const accepts = new Ajv({ strict: false }).compile(emittedSchema);
  const pack = { format: 'medfluen-lecture', version: 1, packageId: 'source-links', lecture: target, sources: [{ id: 'slides', filename: 'forelaesning.pdf', pageCount: 1 }], sections: [{ id: 'overview', title: 'Overblik', order: 1 }], glossary: [{ id: 'myelin', term: 'Myelin', definition: 'En supplerende faglig forklaring.', sourceRefs: [], sourceLinks: [{ title: 'Lægehåndbogen', url: 'https://www.sundhed.dk/' }] }], cards: [{ id: 'card', sectionId: 'overview', order: 1, type: 'basic', question: 'Hvad viser kilden?', answer: 'Det vedhæftede kildegrundlag.', sourceRefs: [{ sourceId: 'slides', page: 1 }] }], assets: [], warnings: [] };

  expect(accepts(pack)).toBe(true);
  pack.cards[0].sourceLinks = [{ title: 'Ekstern facitkilde', url: 'https://www.sundhed.dk/' }];
  expect(accepts(pack)).toBe(false);
});
