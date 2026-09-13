import React, { useEffect, useRef, useState } from 'react';
import { createAuthFlow75 } from './auth75-model';
import './access75.css';
import { AppearanceSettings75 } from './Appearance75';

export function useAccessSession75(auth) {
  // A URL marker is not proof of recovery. Only Supabase's verified event is.
  const [value, setValue] = useState({ session: undefined, recovery: false });
  useEffect(() => {
    let active = true, eventVersion = 0;
    const { data } = auth.onAuthStateChange((event, session) => {
      if (!active) return;
      eventVersion++;
      setValue(current => ({ session, recovery: Boolean(session?.user?.id && (event === 'PASSWORD_RECOVERY' || (current.recovery && current.session?.user?.id === session.user.id && ['TOKEN_REFRESHED', 'USER_UPDATED', 'INITIAL_SESSION'].includes(event)))) }));
    });
    const initialVersion = eventVersion;
    auth.getSession().then(result => {
      if (active && initialVersion === eventVersion) setValue(current => ({ ...current, session: result.data?.session || null }));
    }).catch(() => { if (active && initialVersion === eventVersion) setValue(current => ({ ...current, session: null })); });
    return () => { active = false; data.subscription.unsubscribe(); };
  }, [auth]);
  return { ...value, finishRecovery() {
    setValue(current => ({ ...current, recovery: false }));
    const url = new URL(window.location.href);
    url.searchParams.delete('auth');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  } };
}

export function accountProfileKey75(baseKey, owner) {
  return `${baseKey}:account75:${encodeURIComponent(owner || '')}`;
}

export function readAccountProfile75(baseKey, owner) {
  if (!owner) return null;
  const record = JSON.parse(window.localStorage.getItem(accountProfileKey75(baseKey, owner)) || 'null');
  return record?.ownerUserId === owner ? record : null;
}

export function useAccountProfile75(owner, baseKey) {
  const key = accountProfileKey75(baseKey, owner);
  const liveKey = useRef(key); liveKey.current = key;
  const [snapshot, setSnapshot] = useState(null), [error, setError] = useState('');
  useEffect(() => {
    function refresh() {
      try { setSnapshot({key,value:readAccountProfile75(baseKey,owner)});setError(''); }
      catch {setSnapshot({key,value:null});setError('Profilen kunne ikke læses fra browserlageret.');}
    }
    refresh();
    const changed = event => {if(event.key === key)refresh();};
    window.addEventListener('storage',changed);
    return () => window.removeEventListener('storage',changed);
  }, [key,owner,baseKey]);
  return [snapshot?.key === key ? snapshot.value : null, nextValue => {
    if (!owner || liveKey.current !== key) return false;
    try {
      const current = readAccountProfile75(baseKey,owner);
      const resolved = typeof nextValue === 'function' ? nextValue(current) : nextValue;
      const next = resolved ? {...resolved,ownerUserId:owner} : null;
      window.localStorage.setItem(key,JSON.stringify(next));
      setSnapshot({key,value:next});setError('');return true;
    } catch {setError('Profilen kunne ikke gemmes. Kontrollér browserens lagerplads og prøv igen.');return false;}
  }, error];
}

function Brand75({ onClick, disabled = false }) {
  if (!onClick) return <span className="mf75-brand"><span aria-hidden="true">m<span>f</span></span>med<span>FLUEN</span></span>;
  return <button type="button" className="mf75-brand" onClick={onClick} disabled={disabled} aria-label="medFLUEN · Forside"><span aria-hidden="true">m<span>f</span></span>med<span>FLUEN</span></button>;
}

export function AuthPanel75({ auth, initialMode = 'login', language = 'da', onBack, onComplete, onBusyChange }) {
  const en = language === 'en', ar = language === 'ar';
  const tr = (da, english, arabic) => ar && arabic ? arabic : en ? english : da;
  const actor = useRef(null);
  const complete = useRef(onComplete); complete.current = onComplete;
  const [state, setState] = useState({ mode: initialMode, phase: 'entry', email: '', busy: false, error: '', resendAt: 0 });
  const [password, setPassword] = useState(''), [confirmation, setConfirmation] = useState(''), [code, setCode] = useState('');
  const [visible, setVisible] = useState(false), [now, setNow] = useState(Date.now);
  const heading = useRef(null), codeInput = useRef(null);
  useEffect(() => {
    const redirect = new URL(window.location.pathname, window.location.origin);
    redirect.searchParams.set('auth', 'recovery');
    const flow = createAuthFlow75(auth, { mode: initialMode, redirectTo: redirect.href });
    actor.current = flow;
    let completed = false;
    const off = flow.subscribe(next => {
      setState(next);
      if (next.phase === 'complete' && !completed) { completed = true; setPassword(''); setConfirmation(''); setCode(''); complete.current?.(); }
    });
    setState(flow.snapshot());
    return () => { off(); flow.stop(); if (actor.current === flow) actor.current = null; };
  }, [auth, initialMode]);
  useEffect(() => {
    if (state.phase !== 'code') return;
    codeInput.current?.focus(); setPassword('');
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [state.phase]);
  useEffect(() => { if (state.phase !== 'code') heading.current?.focus(); }, [state.mode, state.phase]);
  useEffect(() => {onBusyChange?.(state.busy);}, [state.busy,onBusyChange]);
  function navigate(mode) {
    if (actor.current?.navigate(mode)) { setCode(''); setPassword(''); setConfirmation(''); setVisible(false); }
  }
  const otp = state.phase === 'code', sent = state.phase === 'sent', done = state.phase === 'complete';
  const title = otp ? tr('Tjek din indbakke', 'Check your inbox', 'تحقق من بريدك') : sent ? tr('Tjek din e-mail', 'Check your email', 'تحقق من بريدك الإلكتروني') : done ? tr('Du er klar', 'You’re ready', 'أنت جاهز') : ({ login: tr('Godt at se dig igen.', 'Good to see you again.', 'أهلاً بعودتك'), signup: tr('Dit studieliv, samlet.', 'Your studies, together.', 'دراستك في مكان واحد'), 'code-login': tr('Log ind med en kode.', 'Sign in with a code.', 'الدخول باستخدام رمز'), forgot: tr('Glemt adgangskoden?', 'Forgot your password?', 'نسيت كلمة المرور؟'), reset: tr('Vælg en ny adgangskode.', 'Choose a new password.', 'اختر كلمة مرور جديدة') })[state.mode];
  const errors = {
    email: tr('Indtast en gyldig e-mailadresse.', 'Enter a valid email address.', 'أدخل بريداً إلكترونياً صالحاً.'),
    code: tr('Kontrollér koden. Den skal have seks cifre og må ikke være udløbet.', 'Check the code. It must have six digits and must not have expired.', 'تحقق من الرمز المكوّن من ستة أرقام وصلاحيته.'),
    password: tr('Brug mindst seks tegn. Følg eventuelle ekstra krav til adgangskoden.', 'Use at least six characters and meet any additional password requirements.', 'استخدم ستة أحرف على الأقل.'),
    mismatch: tr('Adgangskoderne er ikke ens.', 'Passwords do not match.', 'كلمتا المرور غير متطابقتين.'),
    rate: tr('Der er sendt for mange anmodninger. Vent lidt, og prøv igen.', 'Too many requests. Wait a little and try again.', 'طلبات كثيرة. انتظر قليلاً وحاول مجدداً.'),
    captcha: tr('Sikkerhedstjekket kunne ikke gennemføres. Kontakt administratoren, hvis det fortsætter.', 'The security check could not be completed. Contact the administrator if this persists.'),
    generic: tr('Det lykkedes ikke. Kontrollér dine oplysninger og forbindelsen, og prøv igen.', 'That did not work. Check your details and connection, then try again.', 'تحقق من معلوماتك واتصالك وحاول مجدداً.'),
  };
  const countdown = Math.max(0, Math.ceil((state.resendAt - now) / 1000));
  const passwordField = !otp && !sent && !done && ['login', 'signup', 'reset'].includes(state.mode);
  const submitLabel = otp ? tr('Bekræft kode', 'Verify code', 'تأكيد الرمز') : state.mode === 'signup' ? tr('Opret konto', 'Create account', 'إنشاء حساب') : state.mode === 'reset' ? tr('Gem adgangskode', 'Save password', 'حفظ كلمة المرور') : ['forgot','code-login'].includes(state.mode) ? tr('Send e-mail', 'Send email', 'إرسال بريد إلكتروني') : tr('Log ind', 'Sign in', 'تسجيل الدخول');
  return <section className="mf75-auth-panel" dir={ar ? 'rtl' : 'ltr'}>
    {onBack && <button type="button" className="mf75-text-button mf75-auth-back" onClick={onBack} disabled={state.busy}>← {tr('Til forsiden', 'Back to home', 'العودة للرئيسية')}</button>}
    <h1 ref={heading} tabIndex={-1}>{title}</h1>
    <p className="mf75-auth-intro">{otp ? <>{tr('Indtast koden fra e-mailen til', 'Enter the email code sent to', 'أدخل الرمز المرسل إلى')} <strong dir="ltr">{state.email}</strong>.</> : sent ? tr('Hvis adressen kan bruges til gendannelse, modtager du en e-mail med et link. Tjek også spam.', 'If this address can be used for recovery, you will receive an email with a link. Check spam too.') : done ? tr('Oplysningerne er bekræftet.', 'Your details are confirmed.', 'تم تأكيد المعلومات.') : state.mode === 'signup' ? tr('Forelæsninger, flashkort og dine egne noter. I dit tempo.', 'Lectures, flashcards and your own notes. At your pace.') : state.mode === 'reset' ? tr('Din nye adgangskode gælder næste gang, du logger ind.', 'Use your new password the next time you sign in.') : tr('Fortsæt, hvor du slap.', 'Pick up where you left off.', 'تابع من حيث توقفت.')}</p>
    {!sent && !done && <form onSubmit={event => { event.preventDefault(); actor.current?.submit({ password, confirmation, code }); }}>
      <fieldset disabled={state.busy}>
        {!otp && state.mode !== 'reset' && <label htmlFor="mf75-email">{tr('E-mail', 'Email', 'البريد الإلكتروني')}<input id="mf75-email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={state.email} onChange={event => actor.current?.email(event.target.value)} aria-invalid={state.error === 'email'} /></label>}
        {passwordField && <label htmlFor="mf75-password">{tr('Adgangskode', 'Password', 'كلمة المرور')}<span className="mf75-password"><input id="mf75-password" type={visible ? 'text' : 'password'} autoComplete={state.mode === 'login' ? 'current-password' : 'new-password'} required minLength={state.mode === 'login' ? undefined : 6} value={password} onChange={event => setPassword(event.target.value)} /><button type="button" data-password-toggle aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? tr('Skjul', 'Hide', 'إخفاء') : tr('Vis', 'Show', 'إظهار')}</button></span></label>}
        {state.mode === 'reset' && !otp && <label htmlFor="mf75-confirm">{tr('Gentag adgangskode', 'Repeat password', 'كرر كلمة المرور')}<input id="mf75-confirm" type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={6} value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>}
        {otp && <label htmlFor="mf75-code">{tr('Din kode', 'Your code', 'الرمز')}<span className="mf75-otp"><span aria-hidden="true" className="mf75-otp-slots">{Array.from({length:6}, (_,index) => <span key={index} data-filled={Boolean(code[index])}>{code[index] || '·'}</span>)}</span><input ref={codeInput} id="mf75-code" aria-describedby={state.error ? 'mf75-auth-error' : undefined} aria-invalid={Boolean(state.error)} type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0,6))} /></span></label>}
      </fieldset>
      {state.error && <p className="mf75-auth-error" role="alert" id="mf75-auth-error">{errors[state.error] || errors.generic}</p>}
      <button className="mf75-solid" type="submit" disabled={state.busy}>{state.busy ? tr('Et øjeblik…', 'One moment…', 'لحظة…') : submitLabel}<span aria-hidden="true">→</span></button>
    </form>}
    {otp ? <div className="mf75-auth-secondary"><button type="button" disabled={state.busy || countdown > 0} onClick={() => actor.current?.resend()}>{countdown ? `${tr('Gensend om', 'Resend in')} ${countdown}s` : tr('Gensend kode', 'Resend code', 'إعادة إرسال الرمز')}</button><button type="button" disabled={state.busy} onClick={() => { actor.current?.email(state.email); setCode(''); }}>{tr('Skift e-mail', 'Change email', 'تغيير البريد')}</button></div> : !done && <div className="mf75-auth-secondary">
      {state.mode === 'login' && <><button type="button" disabled={state.busy} onClick={() => navigate('code-login')}>{tr('Brug en e-mailkode i stedet', 'Use an email code instead', 'استخدام رمز البريد')}</button><button type="button" disabled={state.busy} onClick={() => navigate('forgot')}>{tr('Glemt adgangskode?', 'Forgot password?', 'نسيت كلمة المرور؟')}</button></>}
      {state.mode !== 'reset' && <button type="button" disabled={state.busy} onClick={() => navigate(state.mode === 'login' ? 'signup' : 'login')}>{state.mode === 'login' ? tr('Ny her? Opret konto', 'New here? Create an account', 'جديد هنا؟ أنشئ حساباً') : tr('Tilbage til login', 'Back to sign in', 'العودة لتسجيل الدخول')}</button>}
    </div>}
  </section>;
}

function ProductDemo75({tab,setTab}) {
  const [studying, setStudying] = useState(false), [answer, setAnswer] = useState(false);
  const [slide, setSlide] = useState(1), [notes, setNotes] = useState({1:'Mit spørgsmål til næste forelæsning: hvordan hænger delene sammen?'});
  return <div className="mf75-product" id="demo">
    <header><span className="mf75-demo-brand">Dit studiebord</span><span className="mf75-demo-label">Interaktiv demo · eksempeldata</span></header>
    <nav aria-label="Vælg produktdemo">{['Flashkort','Forelæsninger','Kalender'].map(label => <button key={label} type="button" aria-current={tab === label ? 'page' : undefined} onClick={() => setTab(label)}>{label}</button>)}</nav>
    <div className="mf75-demo-surface">
      {tab === 'Flashkort' && (!studying ? <><div className="mf75-demo-title"><h3>Dine dæk</h3><span>Nervesystem og psykiatri</span></div><div className="mf75-demo-decks"><div className="mf75-demo-row mf75-demo-head"><span>Dæk</span><span>Nye</span><span>I gang</span><span>Klar</span></div>{[['Neurologi',12,3,8],['Neurokirurgi',6,0,4],['Voksenpsykiatri',9,2,6]].map(([name,n,l,r]) => <button data-demo-deck key={name} type="button" className="mf75-demo-row" onClick={() => {setStudying(true);setAnswer(false);}}><span>↳ {name}</span><span className="mf75-new">{n}</span><span className="mf75-learn">{l}</span><span className="mf75-review">{r}</span></button>)}</div><p className="mf75-demo-hint">Prøv at åbne et dæk.</p></> : <div className="mf75-demo-card"><button className="mf75-text-button" onClick={() => setStudying(false)}>← Dine dæk</button><small>EKSEMPELKORT · STUDIETEKNIK</small><h3>Hvad betyder aktiv genkaldelse?</h3>{answer && <p data-demo-answer>At forsøge at hente svaret frem fra hukommelsen, før du kigger i dine noter.</p>}<button data-demo-reveal type="button" className="mf75-outline" onClick={() => setAnswer(value => !value)}>{answer ? 'Skjul svar' : 'Vis svar'}</button></div>)}
      {tab === 'Forelæsninger' && <div className="mf75-demo-reading"><div><small>FORELÆSNING · EKSEMPEL</small><h3>{slide === 1 ? 'Fra overblik til forståelse.' : 'Sæt dine egne ord på.'}</h3><p>{slide === 1 ? 'Saml dine vigtigste pointer, mens du læser.' : 'Hvad vil du gerne kunne forklare uden at kigge?'}</p><div className="mf75-demo-page-nav">{[1,2].map(page => <button type="button" key={page} aria-pressed={slide === page} onClick={() => setSlide(page)}>Slide {page}</button>)}</div></div><label>Noter til slide {slide}<textarea value={notes[slide] || ''} onChange={event => setNotes(current => ({...current,[slide]:event.target.value}))} placeholder="Prøv at skrive en note…" /><small>Kun i denne demo. Gemmes ikke.</small></label></div>}
      {tab === 'Kalender' && <div className="mf75-demo-calendar"><div className="mf75-demo-title"><h3>En uge med plads.</h3><span>Eksempeluge</span></div><div className="mf75-demo-week">{['Man','Tir','Ons','Tor','Fre'].map((day,index) => <div key={day}><small>{day}</small><span>{7+index}</span>{index === 0 && <article><time>08.00 – 10.00</time><strong>Forelæsning</strong><small>Neurologi</small></article>}{index === 2 && <article className="mf75-demo-personal"><time>13.00 – 14.00</time><strong>Mine noter</strong><small>Egen aktivitet</small></article>}{index === 4 && <article><time>10.00 – 12.00</time><strong>Forelæsning</strong><small>Psykiatri</small></article>}</div>)}</div></div>}
    </div>
  </div>;
}

export function Landing75({ onAccess, appearance }) {
  const [menu, setMenu] = useState(false), [demoTab,setDemoTab] = useState('Flashkort');
  return <div className="mf75-public">
    <a className="mf75-skip" href="#main">Spring til indhold</a>
    <header className="mf75-public-nav"><Brand75 onClick={() => window.scrollTo({top:0})} /><button className="mf75-mobile-menu" type="button" aria-expanded={menu} aria-controls="mf75-public-links" onClick={() => setMenu(value => !value)}>Menu</button><nav id="mf75-public-links" data-open={menu} aria-label="Forside"><a href="#funktioner" onClick={() => setMenu(false)}>Funktioner</a><a href="#saadan" onClick={() => setMenu(false)}>Sådan fungerer det</a><a href="#spoergsmaal" onClick={() => setMenu(false)}>Spørgsmål</a><button type="button" className="mf75-outline" onClick={() => onAccess('login')}>Log ind <span aria-hidden="true">↗</span></button></nav></header>
    <main id="main">
      <section className="mf75-hero"><div className="mf75-eyebrow"><span aria-hidden="true" /> DIT STUDIELIV. DIN MÅDE.</div><h1>Slå pensum<br />med et <span>smæk.</span></h1><div className="mf75-hero-bottom"><p>Fra første forelæsning til sidste eksamensspørgsmål.<br className="mf75-wide-break" /> Saml dine materialer, noter og flashkort ét sted.</p><div><button type="button" data-signup className="mf75-solid" onClick={() => onAccess('signup')}>Opret konto <span aria-hidden="true">↗</span></button><a className="mf75-quiet-link" href="#demo">Se hvordan <span aria-hidden="true">↓</span></a></div></div></section>
      <section className="mf75-demo-section" aria-label="Prøv medFLUEN"><ProductDemo75 tab={demoTab} setTab={setDemoTab} /><div className="mf75-demo-caption"><span>Ét sted at lande. Mange måder at lære.</span><span>Du vælger, hvad der kommer næste gang.</span></div></section>
      <section className="mf75-features" id="funktioner"><div className="mf75-section-heading"><small>MINDRE ROD. MERE SAMMENHÆNG.</small><h2>Det, du læser.<br />Det, du vil huske.</h2></div><div className="mf75-feature-list"><article><span>01</span><div><h3>Noten hører til på slidet.</h3><p>Læs dine PDF’er, markér det vigtige, og skriv noter til hver side. Så er tanken stadig dér, når du vender tilbage.</p><a href="#demo" onClick={() => setDemoTab('Forelæsninger')}>Prøv forelæsningsvisningen ↗</a></div></article><article><span>02</span><div><h3>Et dæk. Et spørgsmål ad gangen.</h3><p>Organisér kortene i dine egne underdæk. Se nye kort, kort under indlæring og kort klar til repetition — og vælg selv.</p><a href="#demo" onClick={() => setDemoTab('Flashkort')}>Se flashkort ↗</a></div></article><article><span>03</span><div><h3>Øv dig på den rigtige opgave.</h3><p>Find eksamenssæt med eller uden facit. Appen viser, hvad der følger med, så du ved, hvad du øver på.</p><button className="mf75-text-button" onClick={() => onAccess('signup')}>Kom i gang ↗</button></div></article></div></section>
      <section className="mf75-how" id="saadan"><div><small>INGEN FAST OPSKRIFT.</small><h2>Plads til din<br />måde at lære på.</h2><p>Start med det, der giver mening for dig. medFLUEN samler overblikket. Du bestemmer retningen.</p></div><ol><li><span>1</span><div><h3>Vælg dit modul</h3><p>Find de forelæsninger og materialer, du arbejder med.</p></div></li><li><span>2</span><div><h3>Gør det til dit</h3><p>Skriv noter, opret kort, og organisér dine egne dæk.</p></div></li><li><span>3</span><div><h3>Vend tilbage, når det passer</h3><p>Dit overblik og din historik hjælper dig med at vælge næste skridt.</p></div></li></ol></section>
      <section className="mf75-faq" id="spoergsmaal"><div className="mf75-section-heading"><small>GODT AT VIDE</small><h2>Små spørgsmål.<br />Klare svar.</h2></div><div>{[
        ['Skal jeg oprette en konto?', 'Ja, for at bruge selve appen. Du kan prøve eksempelvisningen her på siden uden at logge ind.'],
        ['Følger alt pensum med?', 'Du kan bruge det materiale, der er tilgængeligt i dit modul. Udvalget vedligeholdes af administratorerne; medFLUEN lover ikke komplet pensumdækning.'],
        ['Er mine noter og kort personlige?', 'Egne noter, kort og underdæk hører til din konto. Fælles undervisningsmateriale administreres separat.'],
        ['Skal jeg følge en bestemt studieplan?', 'Nej. Du vælger selv forelæsninger, dæk og studieaktiviteter. Overblikket er information, ikke en opgaveliste du skal følge.'],
        ['Har alle eksamenssæt svar?', 'Nej. Et sæt kan have separat facit, svar i selve dokumentet eller være uden facit. Det fremgår ved sættet.'],
        ['Hvorfor modtager jeg ikke min kode?', 'Tjek adressen og spam-mappen. Du kan gensende fra kodevisningen efter ventetiden. Hvis mails stadig udebliver, kan administratorens mailopsætning kræve kontrol.'],
      ].map(([question,answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>
      <section className="mf75-last-call"><small>KLAR, NÅR DU ER.</small><h2>Dit næste kapitel<br />starter her.</h2><button type="button" className="mf75-solid" onClick={() => onAccess('signup')}>Opret konto <span aria-hidden="true">↗</span></button><button type="button" className="mf75-text-button" onClick={() => onAccess('login')}>Jeg har allerede en konto</button></section>
    </main>
    <footer className="mf75-public-footer"><Brand75 onClick={() => window.scrollTo({top:0})} /><span>Forelæsninger. Flashkort. Overblik.</span><a href="#spoergsmaal">Spørgsmål ↑</a>{appearance&&<details className="mf75-public-appearance"><summary>Udseende</summary><AppearanceSettings75 compact value={appearance.value} onChange={appearance.set} error={appearance.error}/></details>}</footer>
  </div>;
}

export function Access75({ auth, language = 'da', recovery = false, onRecovered, appearance }) {
  const [mode, setMode] = useState(null), [busy,setBusy] = useState(false);
  if (!mode && !recovery) return <Landing75 appearance={appearance} onAccess={next => {setMode(next);window.scrollTo({top:0});}} />;
  return <div className="mf75-public mf75-access"><header><Brand75 disabled={busy} onClick={recovery ? undefined : () => setMode(null)} /></header><main className="mf75-access-grid"><aside><small>DIT STUDIELIV. DIN MÅDE.</small><h2>Få styr på<br />det store.<br /><span>Ét kort ad gangen.</span></h2><p>Der er meget at lære.<br />Det behøver ikke ligge alle vegne.</p></aside><AuthPanel75 key={recovery ? 'reset' : mode} auth={auth} initialMode={recovery ? 'reset' : mode} language={language} onBack={recovery ? undefined : () => setMode(null)} onComplete={recovery ? onRecovered : undefined} onBusyChange={setBusy} /></main></div>;
}
