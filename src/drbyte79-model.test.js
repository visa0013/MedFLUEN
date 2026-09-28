import { conversationState79, conversationTitle79, quotaError79 } from './drbyte79-model';

describe('Dr. Byte workspace state', () => {
  test('restores only bounded drafts and identifiers', () => {
    expect(conversationState79('{bad json')).toEqual({ activeId: null, draft: '', sourceIds: [] });
    expect(conversationState79({ activeId: 'one', draft: 'hej', screen: 'private', sourceIds: ['x', null] })).toEqual({ activeId: 'one', draft: 'hej', sourceIds: ['x'] });
  });

  test('titles remain meaningful without storing attachments', () => {
    expect(conversationTitle79('  Hvad betyder epilepsi?  ')).toBe('Hvad betyder epilepsi?');
    expect(conversationTitle79('')).toBe('Ny samtale');
  });

  test('app and provider limits have different user messages', () => {
    expect(quotaError79('APP_QUOTA')).toMatch(/appens/i);
    expect(quotaError79('GEMINI_QUOTA')).toMatch(/Google/i);
  });
});
