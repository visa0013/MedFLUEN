# Nyt i MedFLUEN 7.9

Denne version er en ny studieskal inspireret af Readymags redaktionelle typografi og Arcs rolige, vedvarende arbejdsrum. Den beholder den fungerende kalender og de eksisterende data-/træningsmotorer; et nyt udseende må ikke nulstille kort, noter eller forelæsninger.

## Det er implementeret

- En ny offentlig forside og loginflade med »Slå pensum med et smæk«, en interaktiv prøv-selv-visning, tydelige startveje og en diskret priknavigation. Dr. Byte-orben bevæger sig, med respekt for reduceret bevægelse. Footer krediterer Visar Krasniqi.
- Hjem med en mere fokuseret velkomst, det eksisterende kalenderforløb og en valgfri varm/lys baggrund under indstillinger. Unødvendige citater og dashboard-plader er væk.
- Træning samler teori-flashkort og kort med eksplicit tilknytning til eksamenssæt bag ét valg. Blå/rød/grøn status bevares; eksamenssættenes dokumentliste og svar/uden svar bevares.
- Pensum skelner mellem forelæsninger, holdtimer og TBL. Klassifikation gemmes i eksisterende katalogrækker, uden at ændre deres ID’er. TBL-valget forklares for bachelor-moduler i stedet for at skjule eksisterende data.
- Planlægning genbruger den samme kalender og studieplan som Hjem. Indblik er fjernet fra hovednavigationen; data er ikke slettet.
- Dr. Byte har private, navngivne samtaler med søgning, kildevisning til konkrete PDF-sider, skærmkontekst og valg af svarstil. Fuldskærmsvisning giver plads til historik. Skift mellem appens områder lukker ikke samtalen automatisk.
- Den gamle appgrænse på 2/minut, 10/bruger/døgn og 40 samlet/døgn er afløst af særskilt reservations-/resultattælling. Et fejlet Gemini-svar bruger ikke den daglige succesgrænse. Ingen betalt reserve eller ChatGPT-konto-MCP anvendes.

## Bevidste grænser

- Google bestemmer stadig den faktiske Gemini-kvote. Den nye appgrænse er et sikkerhedsloft, ikke en garanti for 100 gratis svar. Hvis Googles egen kvote er opbrugt, får brugeren en særskilt fejl.
- Kildevisning kan vise den konkrete PDF-side, når dokumentet har læsbar tekst; en scannet PDF uden tekstlag bliver ikke magisk søgbar. PDF-sidetal er ikke altid trykte slide-numre.
- Notesbogen er bevaret fra 7.8 og er ikke ombygget i denne version, som aftalt til en senere patch. Browserens PDF-viser kan ikke rapportere intern scrollside pålideligt; sidenoter følger den side, der vælges i MedFLUENs kontrol.
- Ingen produktionstest er foretaget med din rigtige Supabase-konto, dine dokumenter eller Vercel. De nye SQL-migrationer skal køres før upload, og den konkrete deployment skal efterprøves.

## Lokal verifikation

Produktionsbuild: gennemført. 16 frontend-testpakker/36 tests og 6 server-tests: bestået. Offentlig forside og login er gennemgået visuelt i browser, inkl. mobil layout. Projektets ældre `App.js` giver fortsat ESLint-advarsler; buildet er ikke CI-rent, hvis en host tvinger `CI=true`.

Se [INSTALLATION.md](INSTALLATION.md) for sikker opsætning og [ALLE_FILER.md](ALLE_FILER.md) for hele filoversigten.
