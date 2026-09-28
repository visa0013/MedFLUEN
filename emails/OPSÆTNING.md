# medFLUEN · e-mail og koder

Skabelonerne bruger Supabases eksisterende login. De kræver ingen ekstra JavaScript-pakke og ingen ny OTP-tabel. De er endnu ikke installeret i dit projekt, og faktisk modtagelse er ikke testet.

## Skabeloner

I Supabase → Authentication → Email Templates indsætter du hele HTML-filen i den tilsvarende skabelon:

| Skabelon | Fil | Emnelinje |
|---|---|---|
| Confirm signup | `confirm-signup.html` | Din kode til medFLUEN |
| Magic Link | `login-code.html` | Log ind på medFLUEN med din kode |
| Reset password | `reset-password.html` | Nulstil din adgangskode til medFLUEN |

Behold `{{ .Token }}`, `{{ .SiteURL }}` og `{{ .ConfirmationURL }}` præcis som skrevet. Supabase udfylder dem. Indsæt aldrig selv en fast kode. Tekstfilerne er læsbare referencevarianter; de tilføjer ikke automatisk en separat tekst-del til mailen.

Kode-login bruger e-mailkoden fra Magic Link-skabelonen. Signup bruger bekræftelsesskabelonen. Recovery-knappen beholder Supabases eget bekræftelseslink. [Supabases skabelonvejledning](https://supabase.com/docs/guides/auth/auth-email-templates).

## Loginindstillinger

- Aktivér e-mailbekræftelse, hvis nye konti altid skal verificeres. Uden bekræftelse kan Supabase returnere en session straks; appen respekterer dette.
- Kodevisningen bruger seks cifre. Kontrollér, at projektets kodelængde matcher.
- Site URL skal være appens rigtige produktionsadresse, ikke en eksempeladresse.
- Tillad recovery-adressen under Redirect URLs: din reelle appadresse med `?auth=recovery`. Udskift ikke adressen med et opdigtet domæne.
- Brug projektets faktiske udløbstid. Mailteksten lover ingen bestemt varighed. Appens gensend-knap har en lokal ventetid; Supabases egne begrænsninger gælder stadig.

Metoderne og kodeflowet følger [Supabase OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless) og [password recovery](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail).

## Afsendelse og 0 kr.

Disse filer opretter ingen abonnementer. SMTP er ikke konfigureret, og ingen afsender eller hemmelig nøgle er blevet tilføjet. Offentlig maillevering skal afklares med din eksisterende mailopsætning og dens gældende grænser; skabeloner alene kan ikke sikre levering. SMTP-oplysninger må aldrig lægges i App.js eller REACT_APP-variabler.

Før offentlig brug skal en reel modtagertest kontrollere: signup-kode, forkert kode, gensendelse, kode-login og nulstilling af adgangskode. Beskyttelser som CAPTCHA må ikke slås fra for at få testen til at lykkes; hvis projektet kræver CAPTCHA, skal den tilsluttes særskilt.
