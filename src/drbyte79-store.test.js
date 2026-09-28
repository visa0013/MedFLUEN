import { conversationBody79, listConversations79, saveMessage79 } from './drbyte79-store';

describe('private Dr. Byte conversation storage', () => {
  test('stores only bounded text and verified source metadata, never attachments', () => {
    const body = conversationBody79({
      role: 'assistant', text: 'Kort svar', screen: 'data:image/png;base64,secret', bytes: new Uint8Array([1, 2]),
      context: 'Visible confidential screen', pages: [{ text: 'Whole PDF' }],
      paragraphs: [{ text: 'Forklaring', citations: [{ kind: 'pdf', documentId: 'doc-1', page: 4, title: 'N4', text: 'Præcis kort kildepassage' }] }],
    });
    expect(body).toEqual({ text: 'Kort svar', paragraphs: [{ text: 'Forklaring', citations: [{ kind: 'pdf', documentId: 'doc-1', page: 4, title: 'N4', text: 'Præcis kort kildepassage' }] }] });
    expect(JSON.stringify(body)).not.toMatch(/secret|Whole PDF|confidential/i);
  });

  test('list is owner-scoped and paginated', async () => {
    const query = { select: jest.fn(), eq: jest.fn(), order: jest.fn(), range: jest.fn() };
    query.select.mockReturnValue(query); query.eq.mockReturnValue(query); query.order.mockReturnValue(query);
    query.range.mockResolvedValue({ data: [{ id: 'one' }], error: null });
    const client = { from: jest.fn(() => query) };
    expect(await listConversations79(client, 'user-1', 0, 20)).toEqual([{ id: 'one' }]);
    expect(client.from).toHaveBeenCalledWith('dr_byte_conversations_79');
    expect(query.eq).toHaveBeenCalledWith('owner_id', 'user-1');
    expect(query.range).toHaveBeenCalledWith(0, 19);
    await expect(listConversations79(client, '', 0, 20)).rejects.toThrow();
  });

  test('message insert omits screenshot and source PDF bytes', async () => {
    const insert = jest.fn().mockResolvedValue({ error: null });
    const client = { from: jest.fn(() => ({ insert })) };
    await saveMessage79(client, 'conversation-1', { role: 'user', text: 'Hvad er epilepsi?', screen: 'secret', bytes: [42] });
    expect(client.from).toHaveBeenCalledWith('dr_byte_messages_79');
    expect(insert).toHaveBeenCalledWith(expect.objectContaining({ conversation_id: 'conversation-1', role: 'user', body: { text: 'Hvad er epilepsi?' } }));
  });
});
