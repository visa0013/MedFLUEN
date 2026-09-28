'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const { toneInstruction79 } = require('./dr-byte-tone79.cjs');
const { validateRequest } = require('./dr-byte-core.cjs');

test('the server bounds tone preferences and does not include raw markup', () => {
  assert.match(toneInstruction79('teaching', 'Brug <script>bare korte afsnit</script>'), /step by step/i);
  assert.doesNotMatch(toneInstruction79('teaching', '<script>'), /<script>/i);
  assert.throws(() => toneInstruction79('wrong', ''), /stil/i);
  assert.throws(() => toneInstruction79('brief', 'x'.repeat(501)), /stil/i);
});

test('request validation carries only a bounded style preference', () => {
  const request = validateRequest({ question: 'Epilepsi?', tone: 'socratic', customStyle: 'Brug korte afsnit.' });
  assert.match(request.styleInstruction, /Socratic/i);
  assert.throws(() => validateRequest({ question: 'Epilepsi?', tone: 'invalid' }), /stil/i);
});
