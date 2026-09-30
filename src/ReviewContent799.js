import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { RichContent72 } from './Experience72';
import { sanitizeRich72 } from './experience72-model';
import './review799.css';

// Keep the imported text and its images intact, but give the images a stable place.
export function ReviewContent799({ html, text, language = 'da', cloze, revealed, children }) {
  const [expanded, setExpanded] = useState(null);
  const dialog = useRef(null);
  const media = useMemo(() => {
    const template = document.createElement('template');
    template.innerHTML = sanitizeRich72(html);
    const images = Array.from(template.content.querySelectorAll('img')).map(image => {
      const markup = image.outerHTML;
      image.remove();
      return markup;
    });
    return { images, html: template.innerHTML };
  }, [html]);
  useEffect(() => { setExpanded(null); }, [html, text]);
  useEffect(() => {
    if (!expanded || !dialog.current) return undefined;
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [expanded]);
  const openImage = image => {
    const src = image?.currentSrc || image?.getAttribute('src');
    if (src) setExpanded({ src, alt: image.alt || (language === 'en' ? 'Question image' : 'Billede til spørgsmålet') });
  };
  return <div className="mf799-review-content" data-has-images={media.images.length > 0}>
    <div className="mf799-review-text" onClick={event => {
      if (event.target.tagName === 'IMG') openImage(event.target);
    }}>
      <div className="mf799-question mf72-question"><RichContent72 html={media.html} text={media.images.length && !media.html.trim() ? '' : text} cloze={cloze} revealed={revealed} /></div>
      {children}
    </div>
    {media.images.length > 0 && <aside className="mf799-image-holder" aria-label={language === 'en' ? 'Question images' : 'Billeder til spørgsmålet'}>
      {media.images.map((image, index) => <button key={index} type="button" className="mf799-image-preview" aria-label={language === 'en' ? `Enlarge image ${index + 1}` : `Forstør billede ${index + 1}`} onClick={event => openImage(event.currentTarget.querySelector('img'))}>
        <RichContent72 html={image} />
        <span className="mf799-image-expand" aria-hidden="true">↗</span>
      </button>)}
    </aside>}
    {expanded && createPortal(<dialog ref={dialog} className="mf799-image-dialog" aria-label={language === 'en' ? 'Enlarged image' : 'Forstørret billede'} onCancel={() => setExpanded(null)} onClick={event => { if (event.target === event.currentTarget) setExpanded(null); }}>
      <div className="mf799-image-full">
        <button type="button" autoFocus aria-label={language === 'en' ? 'Close image' : 'Luk billede'} onClick={() => setExpanded(null)}>×</button>
        <img src={expanded.src} alt={expanded.alt} />
      </div>
    </dialog>, document.body)}
  </div>;
}
