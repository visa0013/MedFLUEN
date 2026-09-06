// Pure boundaries shared by the editor, review clock and local document search.
export function createActiveClock72(now = () => Date.now()) {
  let elapsed = 0, runningAt = now();
  return {
    read: () => elapsed + (runningAt == null ? 0 : Math.max(0, now() - runningAt)),
    pause() { if (runningAt != null) { elapsed += Math.max(0, now() - runningAt); runningAt = null; } },
    resume() { if (runningAt == null) runningAt = now(); },
    reset() { elapsed = 0; runningAt = now(); },
  };
}
export function shouldWakeSync72(event, queueKey) {
  return event?.type === 'online' || event?.detail?.key === queueKey;
}
export function sanitizeRich72(input) {
  if (typeof document === 'undefined') return '';
  const root = document.createElement('div');
  root.innerHTML = String(input || '');
  const allowed = new Set(['P','DIV','BR','B','STRONG','I','EM','U','S','UL','OL','LI','SPAN','SUB','SUP','BLOCKQUOTE','IMG','A','FONT']);
  function clean(parent) {
    [...parent.children].forEach(node => {
      if (['SCRIPT','STYLE','IFRAME','OBJECT','SVG','MATH','FORM','INPUT','BUTTON','VIDEO','AUDIO'].includes(node.tagName)) { node.remove(); return; }
      if (!allowed.has(node.tagName)) { clean(node); node.replaceWith(...node.childNodes); return; }
      const size = node.style.fontSize || (node.tagName === 'FONT' ? ({1:'10px',2:'13px',3:'16px',4:'20px',5:'24px',6:'32px',7:'40px'})[node.getAttribute('size')] : '');
      const color = node.style.color || node.getAttribute('color');
      const bg = node.style.backgroundColor;
      const align = node.style.textAlign;
      const src = node.getAttribute('src') || '';
      const href = node.getAttribute('href') || '';
      const alt = node.getAttribute('alt') || 'Billede';
      [...node.attributes].forEach(a => node.removeAttribute(a.name));
      if (/^(10|11|12|13|14|15|16|17|18|19|20|22|24|28|30|32|36|40|48)px$/.test(size || '')) node.style.fontSize = size;
      if (color && /^(#[a-f\d]{3,8}|rgba?\([\d.,\s%]+\)|[a-z]+)$/i.test(color)) node.style.color = color;
      if (bg && /^(#[a-f\d]{3,8}|rgba?\([\d.,\s%]+\)|[a-z]+)$/i.test(bg)) node.style.backgroundColor = bg;
      if (['left','right','center','justify'].includes(align)) node.style.textAlign = align;
      if (node.tagName === 'IMG') {
        if (!/^data:image\/(png|jpeg|gif|webp);base64,[a-z\d+/=\s]+$/i.test(src)) { node.remove(); return; }
        node.setAttribute('src',src); node.setAttribute('alt',alt.slice(0,200));
      }
      if (node.tagName === 'A' && /^https?:\/\//i.test(href)) { node.setAttribute('href',href); node.setAttribute('target','_blank'); node.setAttribute('rel','noopener noreferrer'); }
      clean(node);
      if (node.tagName === 'FONT') { const span = document.createElement('span'); span.style.cssText=node.style.cssText; span.append(...node.childNodes); node.replaceWith(span); }
    });
  }
  clean(root); return root.innerHTML;
}
export function richText72(html) {
  const root = document.createElement('div'); root.innerHTML = sanitizeRich72(html);
  root.querySelectorAll('br').forEach(n=>n.replaceWith('\n'));
  root.querySelectorAll('p,div,li,blockquote').forEach(n=>n.append('\n'));
  root.querySelectorAll('img').forEach(n=>n.replaceWith('[Billede]'));
  return (root.textContent || '').replace(/\n{3,}/g,'\n\n').trim();
}
export function textHtml72(text) {
  const node=document.createElement('div'); node.textContent=String(text || ''); return node.innerHTML.replace(/\n/g,'<br>');
}
export function validMasks72(masks) {
  return (Array.isArray(masks)?masks:[]).filter(m=>[m.x,m.y,m.width,m.height].every(Number.isFinite) && m.x>=0 && m.y>=0 && m.width>.005 && m.height>.005 && m.x+m.width<=1.001 && m.y+m.height<=1.001);
}
export function searchPages72(pages, query, limit=5) {
  const tokens=[...new Set(String(query).toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu)||[])].filter(t=>!['hvad','hvordan','hvor','med','den','det','der','som','kan','for','the','and'].includes(t));
  if(!tokens.length) return [];
  return pages.map(p=>{const body=p.text.toLocaleLowerCase();return {...p,score:tokens.reduce((s,t)=>s+(body.includes(t)?1:0),0)};}).filter(p=>p.score>0).sort((a,b)=>b.score-a.score||a.page-b.page).slice(0,limit);
}
