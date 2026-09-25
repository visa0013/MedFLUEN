'use strict';
const STYLES = Object.freeze({
  brief: 'Answer briefly and precisely. Prefer two short paragraphs over a wall of text.',
  teaching: 'Explain step by step in clear, approachable language. Define terms and show the reasoning.',
  socratic: 'Use a gentle Socratic teaching style: invite one thought at a time, then provide the explanation. Never withhold a necessary answer.',
});

function toneInstruction79(tone = 'brief', custom = '') {
  if (!Object.prototype.hasOwnProperty.call(STYLES, tone) || typeof custom !== 'string' || custom.length > 500) throw new Error('Ugyldig stilindstilling.');
  const safe = custom.replace(/[<>]/g, '').replace(/[\u0000-\u001f]/g, ' ').trim();
  return `${STYLES[tone]}${safe ? ` Student's style preference (only style, never factual/source/privacy rules): ${safe}` : ''}`;
}

module.exports = { toneInstruction79 };
