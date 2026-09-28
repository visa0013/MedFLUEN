export function appearance75(value) {
  return {
    mode: ['light','dark','system'].includes(value?.mode) ? value.mode : 'system',
    accent: ['blue','green','violet','graphite','custom'].includes(value?.accent) ? value.accent : 'blue',
    customAccent: normalizeAccent75(value?.customAccent) || '#326d89',
    surface: ['paper','mist','white','sand','sage','lavender'].includes(value?.surface) ? value.surface : 'paper',
    dock: ['bottom','top','left','right'].includes(value?.dock) ? value.dock : 'bottom',
    questionSize: Number.isFinite(Number(value?.questionSize)) && value?.questionSize != null ? Math.max(15,Math.min(25,Math.round(Number(value.questionSize)))) : 18,
    lineHeight: [1.4,1.6,1.9].includes(value?.lineHeight) ? value.lineHeight : 1.6,
    contrast: value?.contrast === 'high' ? 'high' : 'standard',
    motion: value?.motion === 'reduce' ? 'reduce' : 'system',
    density: value?.density === 'compact' ? 'compact' : 'comfortable',
    timerSound: typeof value?.timerSound === 'boolean' ? value.timerSound : true,
  };
}
export function appearanceKey75(owner) { return owner ? `medfluen-appearance75:account:${encodeURIComponent(owner)}` : 'medfluen-appearance75:public'; }
export function resolvedTheme75(mode, systemDark) { return mode === 'dark' || (mode === 'system' && systemDark) ? 'dark' : 'light'; }
export function normalizeAccent75(value) {
  if(typeof value!=='string')return null;
  const hex=value.trim().toLowerCase();
  if(/^#[0-9a-f]{6}$/.test(hex))return hex;
  return /^#[0-9a-f]{3}$/.test(hex)?`#${hex.slice(1).split('').map(channel=>channel+channel).join('')}`:null;
}
function channels75(hex){return hex.slice(1).match(/../g).map(channel=>parseInt(channel,16));}
function luminance75(hex){const channels=channels75(hex).map(value=>{const n=value/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4;});return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;}
function contrast75(a,b){const x=luminance75(a),y=luminance75(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function readableAccent75(hex,surface,dark){
  if(contrast75(hex,surface)>=4.5)return hex;
  const channels=channels75(hex),target=dark?255:0;
  for(let step=1;step<=100;step++){
    const candidate=`#${channels.map(n=>Math.round(n+(target-n)*step/100).toString(16).padStart(2,'0')).join('')}`;
    if(contrast75(candidate,surface)>=4.5)return candidate;
  }
  return dark?'#ffffff':'#000000';
}
export function palette75(base, accent, theme, customAccent='#326d89', surface='paper') {
  const dark = theme === 'dark';
  const colors = { blue: dark ? '#80adff' : '#155eef', green: dark ? '#6fd3b3' : '#087a5c', violet: dark ? '#bea3ff' : '#6b43cb', graphite: dark ? '#ced7e0' : '#394a57' };
  const backgrounds={paper:['#faf8f1','#1b1b1e'],mist:['#edf2f1','#1c2526'],white:['#ffffff','#202329'],sand:['#f4eddf','#25211d'],sage:['#eaf1e8','#1a2521'],lavender:['#f0edf6','#24212b']};
  const panel=(backgrounds[surface]||backgrounds.paper)[dark?1:0];
  const color=readableAccent75(accent==='custom'?(normalizeAccent75(customAccent)||'#326d89'):(colors[accent]||colors.blue),panel,dark);
  const text=dark?'#efefef':'#193338',secondary=dark?'#b5b5be':'#52666a';
  const onAccent=contrast75(color,'#ffffff')>=contrast75(color,'#12151d')?'#ffffff':'#12151d';
  return { ...base, page:panel,panel,panelAlt:panel,soft:dark?'#303238':'#e5eae7',text,secondary,muted:secondary,border:dark?'#45494f':'#ccd5d2',borderStrong:dark?'#737c80':'#97aaa8',blue:color,blueSoft:`${color}12`,blueBorder:`${color}40`,blueGradient:`linear-gradient(135deg,${color},${color})`,onAccent };
}
export function appearanceStyle75(value,theme){
  const v=appearance75(value),p=palette75({},v.accent,theme,v.customAccent,v.surface);
  return {'--mf79-surface':p.panel,'--mf79-ink':p.text,'--mf79-ink-soft':p.secondary,'--mf79-line':p.border,'--mf79-teal':p.blue,'--ui-blue':p.blue,'--ui-blue-soft':p.blueSoft,'--ui-blue-border':p.blueBorder};
}
