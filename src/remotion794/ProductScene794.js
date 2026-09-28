import React from 'react';
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from 'remotion';
import { getCinemaCopy794 } from './copy794';

const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };

export function ProductScene794({ language = 'da' }) {
  const frame = useCurrentFrame();
  const words = getCinemaCopy794(language);
  const rtl = language === 'ar';

  return <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: 'transparent', color: '#18383a', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
    <Interactive.Div name="Ambient light" style={{ position: 'absolute', left: 42, top: 50, width: 1030, height: 700, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(166,211,190,.18), transparent 67%)' }} />

    <Interactive.Div name="Research source" style={{
      position: 'absolute', left: 114, top: 100, width: 505, height: 585, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', padding: '37px 41px 31px',
      backgroundColor: '#fbfaf2', borderRadius: 9, border: '1px solid rgba(37,75,64,.15)',
      boxShadow: '0 25px 60px rgba(2,22,23,.22)',
      translate: interpolate(frame, [0, 68, 240], ['190px 55px', '0px 0px', '-36px -22px'], { ...clamp, easing: ease }),
      rotate: interpolate(frame, [0, 68, 240], ['-2deg', '-5deg', '-9deg'], { ...clamp, easing: ease }),
      scale: String(interpolate(frame, [0, 68, 240], [0.92, 1, 0.9], { ...clamp, easing: ease })),
      opacity: interpolate(frame, [0, 68], [0.72, 1], clamp),
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, fontSize: 13, fontWeight: 800, letterSpacing: 2.1, color: '#47736c', direction: rtl ? 'rtl' : 'ltr' }}>
        <span>{words.source}</span><span style={{ width: 30, height: 30, border: '1px solid #91aaa0', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 400 }}>↗</span>
      </div>
      <div style={{ width: 54, height: 5, borderRadius: 5, marginTop: 56, backgroundColor: '#d3947d' }} />
      <div style={{ marginTop: 24, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: rtl ? 55 : language === 'en' ? 53 : 64, lineHeight: 1.05, letterSpacing: -2.4, color: '#21493c', direction: rtl ? 'rtl' : 'ltr' }}>{words.document}</div>
      <div style={{ marginTop: 19, color: '#55756b', fontSize: 17, direction: rtl ? 'rtl' : 'ltr' }}>{words.documentSubtitle}</div>
      <div style={{ marginTop: 34, paddingTop: 27, borderTop: '1px solid #d1ddd1', color: '#3f5e55', fontFamily: 'Georgia, serif', fontSize: 24, lineHeight: 1.4, direction: rtl ? 'rtl' : 'ltr' }}>{words.passage}</div>
      <div style={{ marginTop: 'auto', color: '#7d938a', fontSize: 12, letterSpacing: 1.2 }}>PSYCHOLOGICAL SCIENCE IN THE PUBLIC INTEREST</div>
    </Interactive.Div>

    <Interactive.Div name="Question card" style={{
      position: 'absolute', left: 550, top: 260, width: 564, height: 382, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', padding: '37px 42px',
      borderRadius: 18, backgroundColor: '#d8ecdb', color: '#153c33',
      boxShadow: '0 30px 68px rgba(3,30,27,.22)',
      translate: interpolate(frame, [0, 96, 166, 240], ['660px 135px', '500px 95px', '50px 14px', '0px 0px'], { ...clamp, easing: ease }),
      rotate: interpolate(frame, [0, 96, 240], ['12deg', '10deg', '3deg'], { ...clamp, easing: ease }),
      opacity: interpolate(frame, [0, 85, 140], [0, 0, 1], clamp),
    }}>
      <div style={{ color: '#3e7567', fontSize: 13, fontWeight: 800, letterSpacing: 2.2, direction: rtl ? 'rtl' : 'ltr' }}>{words.flashLabel}</div>
      <div style={{ margin: 'auto 0', fontFamily: 'Georgia, "Times New Roman", serif', fontSize: rtl ? 52 : language === 'en' ? 50 : 59, lineHeight: 1.05, letterSpacing: -2.1, direction: rtl ? 'rtl' : 'ltr' }}>{words.question}</div>
      <div style={{ borderTop: '1px solid rgba(23,77,61,.3)', paddingTop: 19, color: '#3d6d5d', fontSize: 18, direction: rtl ? 'rtl' : 'ltr' }}>{words.answer}</div>
    </Interactive.Div>

    <Interactive.Div name="Personal plan" style={{
      position: 'absolute', left: 802, top: 65, width: 270, height: 226, boxSizing: 'border-box',
      padding: '24px 25px', borderRadius: 13, backgroundColor: '#f4cbb7', color: '#513c36',
      boxShadow: '0 18px 48px rgba(3,30,27,.19)',
      translate: interpolate(frame, [0, 150, 212, 240], ['430px -110px', '370px -90px', '35px -10px', '0px 0px'], { ...clamp, easing: ease }),
      rotate: interpolate(frame, [0, 240], ['14deg', '6deg'], { ...clamp, easing: ease }),
      opacity: interpolate(frame, [0, 150, 205], [0, 0, 1], clamp),
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: '#77574a', direction: rtl ? 'rtl' : 'ltr' }}>{words.planLabel}</div>
      <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, margin: '14px 0 12px', direction: rtl ? 'rtl' : 'ltr' }}>{words.planIntro}</div>
      {words.planRows.map((row, index) => <div key={row} style={{ display: 'flex', gap: 14, alignItems: 'center', borderTop: '1px solid rgba(116,72,60,.25)', paddingTop: 6, marginTop: 4, fontSize: 13, direction: rtl ? 'rtl' : 'ltr' }}><span style={{ color: '#9b594a', fontSize: 11 }}>0{index + 1}</span>{row}</div>)}
    </Interactive.Div>
  </AbsoluteFill>;
}
