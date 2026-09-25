export function appearance75(value) {
  return {
    mode: ['light','dark','system'].includes(value?.mode) ? value.mode : 'system',
    accent: ['blue','green','violet','graphite'].includes(value?.accent) ? value.accent : 'blue',
    surface: ['paper','mist','white'].includes(value?.surface) ? value.surface : 'paper',
    dock: ['bottom','top','left','right'].includes(value?.dock) ? value.dock : 'bottom',
    orb: typeof value?.orb === 'boolean' ? value.orb : true,
  };
}
export function appearanceKey75(owner) { return owner ? `medfluen-appearance75:account:${encodeURIComponent(owner)}` : 'medfluen-appearance75:public'; }
export function resolvedTheme75(mode, systemDark) { return mode === 'dark' || (mode === 'system' && systemDark) ? 'dark' : 'light'; }
export function palette75(base, accent, theme) {
  const dark = theme === 'dark';
  const colors = { blue: dark ? '#80adff' : '#155eef', green: dark ? '#6fd3b3' : '#087a5c', violet: dark ? '#bea3ff' : '#6b43cb', graphite: dark ? '#ced7e0' : '#394a57' };
  const color = colors[accent] || colors.blue;
  return { ...base, blue: color, blueSoft: `${color}12`, blueBorder: `${color}40`, blueGradient: `linear-gradient(135deg,${color},${color})`, onAccent: dark ? '#12151d' : '#ffffff' };
}
