# Installation af MedFLUEN 7.9

Denne komplette mappe bygger på 7.8. Den indeholder ingen hemmelige nøgler. Behold dine eksisterende Vercel-miljøvariabler, herunder den serverbaserede Gemini-nøgle; læg aldrig nøglen i GitHub eller `src`.

## 1. Kontrollér databasen (kun læsning)

Kør [segment_7_9_schema_check.sql](supabase/segment_7_9_schema_check.sql) i Supabase → SQL Editor. Den eksisterende `lecture_catalog_751`-tabel og `current_user_is_admin()` skal findes, og RLS skal være slået til. Hvis det ikke passer, **stop og send resultatet**; kør ikke en tilfældig gammel migration igen.

## 2. Tilføj 7.9-databasedelene

Kør disse tre filer i denne rækkefølge, én ad gangen, i SQL Editor. Åbn filen, kopiér hele indholdet, indsæt og tryk Run. De ændrer ikke dine eksisterende forelæsnings-ID’er, noter eller kort:

1. [segment_7_9_curriculum_kinds.sql](supabase/segment_7_9_curriculum_kinds.sql) — typerne forelæsning, holdtime og TBL i det eksisterende katalog.
2. [segment_7_9_dr_byte_conversations.sql](supabase/segment_7_9_dr_byte_conversations.sql) — privat samtalehistorik med brugerafgrænset adgang.
3. [segment_7_9_dr_byte_quota.sql](supabase/segment_7_9_dr_byte_quota.sql) — adskiller appens sikkerhedsgrænse fra Googles egen kvote. Standard er 5 forsøg/minut, 100 vellykkede svar/bruger/døgn og 500 samlet/døgn; Googles faktiske gratis grænse kan være lavere.

Kør derefter den skrivebeskyttede [segment_7_9_dr_byte_schema_check.sql](supabase/segment_7_9_dr_byte_schema_check.sql). Hvis en SQL-kørsel fejler, stop og send den præcise fejl; slet ikke tabeller eller policies.

## 3. Upload appen

Upload de nye og ændrede filer fra [FILLISTE.md](FILLISTE.md) til **samme stier** i dit GitHub-repository. Upload hele listen i én commit, så nye imports og API-filer deployes sammen. `public/index.html` og `src/index.js` følger med; undlad ikke filer med stort/lille bogstav i navnet. SQL-filerne skal køres i Supabase, ikke for at få Vercel til at bygge.

Hvis du foretrækker at erstatte hele projektet, er [ALLE_FILER.md](ALLE_FILER.md) den komplette oversigt. Upload ikke `node_modules`, `build` eller lokale testdata. Bevar egne miljøvariabler og konfiguration i Vercel.

## 4. Kontroller den konkrete deployment

Vent til Vercel viser **Ready** for samme commit. Genindlæs MedFLUEN, og tjek: offentlig forside og login; Hjem og kalender; Træningens Teori/Eksamens-MCQ-valg; Pensums Forelæsninger/Holdtimer/TBL; Planlægning; Dr. Bytes historik, kildehenvisning og indstillinger. Test med én rigtig bruger og én af dine egne forelæsninger, men send ikke loginoplysninger eller API-nøgler til andre.

Den lokale produktionsbuild og automatiske kontroller passerer, men der er ældre lint-advarsler i den store `App.js`. Denne pakke er **ikke** deployet til din Vercel eller kørt mod dine Supabase-data, så ovenstående kontrol er nødvendig. [NYT_I_7_9.md](NYT_I_7_9.md) skelner mellem det, der er implementeret, og det, der stadig kræver live-test.
