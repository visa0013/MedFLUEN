export function calendarHeading791(date, view, locale='da-DK') {
  if(view==='month')return new Intl.DateTimeFormat(locale,{month:'long',year:'numeric'}).format(date);
  if(view!=='week')return new Intl.DateTimeFormat(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(date);
  const first=new Date(date.getFullYear(),date.getMonth(),date.getDate(),12);
  first.setDate(first.getDate()-((first.getDay()+6)%7));
  const last=new Date(first);last.setDate(last.getDate()+6);
  const format=new Intl.DateTimeFormat(locale,{day:'numeric',month:'short',year:'numeric'});
  return format.formatRange?format.formatRange(first,last):`${format.format(first)} – ${format.format(last)}`;
}

export function selectedDeck791(tree, remembered) {
  const nodes=[];function visit(node){nodes.push(node);(node.children||[]).forEach(visit);}visit(tree);
  return nodes.find(node=>node.id===remembered)||nodes.find(node=>!node.children?.length&&node.questions?.length)||nodes.find(node=>node.type==='lecture')||tree;
}

export function primaryArea791(route, workspace) {
  if (workspace === 'lectures') return 'curriculum';
  if (workspace === 'notes') return 'notes';
  if (workspace === 'examSets') return 'training';
  if (workspace === 'calendar') return 'home';
  return ['mcq','training-history'].includes(route) ? 'training' : 'home';
}
