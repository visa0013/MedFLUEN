import React from 'react';
import { RichContent72 } from './Experience72';
import { ReviewContent799 } from './ReviewContent799';
import './mcq797.css';

const localized = (value, language) => typeof value === 'string' ? value : value?.[language] || value?.da || value?.en || '';

export function McqCard797({ question, language = 'da', revealed = false }) {
  const correct = Number(question.correct), answer = localized(question.options?.[correct], language);
  const indices = Array.isArray(question.correctIndices) ? question.correctIndices : [correct];
  const explanation = localized(question.explanation, language).trim();
  const explanationHtml = localized(question.richContent?.explanation, language);
  const hasMedia = /<(?:img|audio|video)\b/i.test(explanationHtml);
  const duplicate = !hasMedia && (explanation === String(correct + 1) || explanation.replace(/^[A-H][.)]\s*/i, '') === answer.replace(/^[A-H][.)]\s*/i, ''));
  return <div className="mf797-mcq" data-revealed={revealed}>
    <ReviewContent799 html={question.richContent?.front?.[language]} text={localized(question.front || question.question, language)} language={language}>
    <ol className="mf797-mcq-options" aria-label={language === 'en' ? 'Answer choices' : 'Svarmuligheder'}>
      {(question.options || []).map((option, index) => {
        const active = revealed && indices.includes(index);
        const content = <RichContent72 html={question.richContent?.options?.[index]?.[language]} text={localized(option, language)} />;
        return <li key={index} data-correct={active ? 'true' : undefined}>
          <span className="mf797-option-key" aria-hidden="true">{index + 1}</span>
          {active ? <strong className="mf797-option-body">{content}</strong> : <div className="mf797-option-body">{content}</div>}
          {active && <span className="mf797-option-check" aria-label={language === 'en' ? 'Correct answer' : 'Korrekt svar'}>✓</span>}
        </li>;
      })}
    </ol>
    <span className="mf797-answer-announcement" role="status">{revealed && indices.length ? (language === 'en' ? 'Correct answer: ' : 'Korrekt svar: ') + indices.map(index => index + 1).join(', ') : ''}</span>
    {revealed && (explanation || hasMedia) && !duplicate && <section className="mf797-mcq-explanation"><span>{language === 'en' ? 'Explanation' : 'Forklaring'}</span><RichContent72 html={explanationHtml} text={explanation} /></section>}
    </ReviewContent799>
  </div>;
}
