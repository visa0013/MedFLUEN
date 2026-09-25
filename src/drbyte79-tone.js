const EXAMPLE = 'Hvad er et fokalt epileptisk anfald?';
const ANSWERS = {
  brief: 'Et fokalt anfald begynder i et afgrænset netværk i hjernen. Symptomerne afhænger af, hvor anfaldet starter.',
  teaching: 'Tænk på hjernen som flere netværk. Ved et fokalt anfald starter den unormale aktivitet i ét afgrænset netværk. Derfor kan symptomerne variere med placeringen. Dette er en generel forklaring; kontrollér dit pensum for den præcise formulering.',
  socratic: 'Hvor i hjernen tror du, aktiviteten starter, hvis et anfald kaldes fokalt? Det afgørende er, at aktiviteten begynder i et afgrænset netværk. Symptomerne afhænger derefter af netværkets funktion.',
};

export function toneSettings79(raw) {
  return { tone: Object.prototype.hasOwnProperty.call(ANSWERS, raw?.tone) ? raw.tone : 'brief', custom: typeof raw?.custom === 'string' ? raw.custom.slice(0, 500) : '' };
}

export function tonePreview79(tone) {
  return { question: EXAMPLE, answer: ANSWERS[tone] || ANSWERS.brief };
}
