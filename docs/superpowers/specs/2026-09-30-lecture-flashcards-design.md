# Forelæsningskort i MedFLUEN

Dato: 30. september 2026. Status: design til skriftlig godkendelse; funktionen er endnu ikke implementeret.

## 1. Formål og afgrænsning

Brugeren skal kunne give en forelæsnings-PDF og en genbrugelig prompt til ChatGPT, hente en fil og importere den til den relevante forelæsning i MedFLUEN. Resultatet skal være brugbare, kildeforbundne kort i appens eget design, inspireret af RemNotes interaktioner uden at kopiere hele deres brugerflade.

Den godkendte løsning indeholder:

- Svarlister, hvor brugeren efter afsløring markerer de **svarpunkter, vedkommende ikke huskede** og kan øve dem særskilt.
- Fagord med prikket understregning og korte, medfølgende definitioner.
- Meningsfulde forelæsningssektioner i faglig rækkefølge, uanset slidernes oprindelige rækkefølge.
- Billeder fra den faktiske forelæsning, kildehenvisninger og eksisterende billedforstørrelse.
- Lokal import, validering, forhåndsvisning og lagring samt en downloadbar prompt, filskabelon og formatbeskrivelse.

Funktion og UI prioriteres. Ingen store ANKI-dæk genimporteres under udviklingen. Eksisterende eksamens-MCQ, ANKI-import og almindelige kort skal fortsætte uændret. Dette omfatter ikke fuld offline-login, en ny AI-tjeneste, automatisk PDF-ekstraktion i appen eller en total ombygning af appen.

## 2. Samlet brugerforløb

1. Brugeren vælger et modul og en forelæsning under Træning → Teori.
2. Upload åbner med valget mellem den eksisterende ANKI-import og **Forelæsningspakke**. Her kan brugeren hente eller kopiere genereringsprompten og hente en tom JSON-skabelon.
3. Brugeren giver prompten og PDF'en til ChatGPT. Tekstkort leveres som JSON; kort med billeder leveres som ZIP med `lecture.json` og en `images/`-mappe.
4. MedFLUEN kontrollerer pakken og viser forelæsning, sektioner, antal kort, billedantal og eventuelle problemer. Et kort kan forhåndsvises før import.
5. Brugeren bekræfter den faktiske MedFLUEN-forelæsning. Pakkens titel eller ID må ikke uden videre oprette en ukendt forelæsning eller ændre valgt modul.
6. Importen gemmer alle kort og billeder samlet. Fejl efterlader ingen delvis import. Forelæsningsoversigten opdateres uden genindlæsning.
7. Brugeren kan træne hele forelæsningen, udvalgte sektioner eller tidligere glemte svarpunkter.

Et mismatch mellem pakkens modul/forelæsning og det valgte mål kræver aktiv bekræftelse med begge navne synlige. Ingen automatisk sletning af eksisterende kort.

## 3. UI og kortinteraktioner

### Forelæsningsoversigt og sektioner

Den eksisterende forelæsningsliste bevares. Når en forelæsning har en struktureret pakke, vises dens sektioner i højre detaljepanel med titel, kortantal og en tydelig markering af valgte sektioner. Alle er valgt som udgangspunkt. Handlingen **Start træning** følger valget. Vis ikke en opdigtet mestringsprocent; eventuelle gennemgangstal skal komme fra reelle registreringer.

Sektionerne kan eksempelvis følge sygdom og mekanisme → klinik og diagnostik → behandling, men antallet og navnene afhænger af stoffet. Første gennemgang følger sektionernes og kortenes rækkefølge. Almindelig repetition bruger appens eksisterende kø og intervaller inden for de valgte sektioner. Et eksplicit valg mellem **Gennemgang** og **Repetition** gør forskellen forståelig.

### Åbent, roligt layout

Bevar MedFLUENs farver og typografiske identitet. Spørgsmålet bruger appens læsevenlige spørgsmålstypografi; svar, kilder og kontroltekst har en ensartet størrelse og linjeafstand. Brug luft og diskrete skillelinjer frem for indrammede bokse omkring hvert svar. Undgå dekorative badges, filler-tekst, emoji og konkurrerende handlingsknapper.

I kortvisningen viser topbaren MedFLUEN-forelæsningen og sektionen, ikke en rå importsti. Korttælleren viser position og samlet antal i det aktive udvalg. Det eksisterende kortværktøj, Vis svar og vurderingsknapper genbruges. Sektionerne må ikke optage det højre billedområde under selve spørgsmålet; sektionsvalg sker i oversigten.

### Svarliste: markér det, du glemte

Før afsløring vises spørgsmålet og eventuelle spørgsmålsbilleder, men ingen svartekst. Efter **Vis svar** vises svarpunkterne som en overskuelig liste med en checkbox ved hvert punkt. En kort label, **Markér det, du ikke huskede**, afklarer betydningen. Afkrydset betyder glemt, aldrig korrekt valgt MCQ-svar.

Markeringer gemmes lokalt pr. bruger, kort og svarpunkt. En tidligere markering vises fortsat ved næste afsløring, indtil brugeren fjerner den. Brugeren kan ændre markeringerne, før kortet vurderes. Den normale kortvurdering opdaterer kortets repetitionsplan én gang; checkboxes er ikke ekstra vurderinger.

**Øv glemte svarpunkter** bruger de markerede punkter og deres oprindelige spørgsmål. Ét kort grupperer de glemte punkter fra samme spørgsmål; allerede huskede punkter er udeladt. Efter afsløring kan brugeren fjerne markeringer fra de punkter, der nu er husket. Ingen automatisk, uendelig generering af nye kort og ingen separate skjulte repetitionsplaner for hvert punkt i denne version. Køen fastfryses ved start, så ændringer ikke springer næste kort over.

### Definitioner

Glosarord i spørgsmål, svar og forklaring får en prikket understregning. Hover eller tastaturfokus åbner en lille definition med kildehenvisning; på touch åbner et tryk den samme visning. Escape, tryk udenfor eller skift af kort lukker den. Popoveren må ikke forsvinde, når markøren flyttes fra ord til definition, og den holdes inden for skærmen.

Definitionerne kommer fra pakken, ikke et live-AI-kald. De må være tilgængelige før svarafsløring som frivillig hjælp; de må ikke automatisk afsløre hele kortets facit. Manglende definitioner giver ikke et dødt, understreget ord.

### Billeder og kilde

Spørgsmålsbilleder vises i appens højre billedholder; på smalle skærme under spørgsmålet. Svarbilleder vises først efter afsløring. Ingen tom billedholder på kort uden billeder. Klik eller tastaturaktivering åbner et centreret billede, som lukkes med klik udenfor, Escape eller luk-knap, med fokus tilbage på den udløsende kontrol.

Billedtekst og alternativ tekst følger pakken. Hvert kort har mindst én kildehenvisning med filnavn og fysisk, 1-baseret PDF-side. Et tryk åbner den eksisterende forelæsnings-PDF på siden, når appen har en passende kobling. Ellers vises henvisningen uden en knap, der lover at åbne en fil, appen ikke har. Et trykt slidenummer kan medfølge som ekstra label, men må ikke forveksles med PDF-siden.

## 4. Versioneret filformat

Formatnavn: `medfluen-lecture`. Version: `1`. Den downloadbare JSON Schema og eksempelpakke skal svare til importørens faktiske krav, ikke en parallel dokumentationsversion.

### Pakke

- `format`, `version`, `packageId`: format og stabile identiteter. `packageId` er en lokal indholdsidentitet, ikke en brugeridentitet.
- `lecture`: `moduleId`, `lectureId`, `title`; MedFLUEN-målet vælges og bekræftes ved upload.
- `sources`: poster med `id`, `filename` og valgfrit `pageCount`.
- `sections`: poster med stabilt `id`, meningsfuld `title` og heltals-`order`.
- `glossary`: poster med `id`, `term`, kort `definition` og `sourceRefs`.
- `cards`: kortene beskrevet nedenfor.
- `assets`: billeder beskrevet nedenfor. Tom liste i en tekstpakke.
- `warnings`: konkrete begrænsninger fra genereringen, eksempelvis ulæselige sider eller manglende ekstraktion. En tom liste betyder ingen rapporterede begrænsninger, ikke at appen har verificeret PDF'ens faglige indhold.

### Kort

Hvert kort har stabilt `id`, `sectionId`, heltals-`order`, `type`, `question`, `sourceRefs` og valgfrie `explanation` og `assetIds`.

- `basic`: `answer` som tekst.
- `recall-list`: `answerItems`, hver med stabilt `id`, `text` og valgfrie egne `sourceRefs`.
- `mcq`: `options`, hver med stabilt `id` og `text`, samt `correctOptionIds`. Eksisterende MCQ-visning og korrektmarkering genbruges.

Denne pakkeversion introducerer ikke et nyt cloze-format; eksisterende cloze-kort fungerer fortsat gennem det eksisterende system. Korttyper blandes gerne i én forelæsning, men en svarliste er ikke et MCQ med flere korrekte muligheder.

Tekstfelter er ren tekst, ikke eksekverbar HTML. Glosarhenvisninger skrives som `[[term-id|visningstekst]]`; importøren kontrollerer ID og renderer teksten som sikre React-elementer. ID'er må ikke indeholde `[` , `]` eller `|`. Ukendte henvisninger er importfejl. Almindelig tekst ændres ikke til glosarord automatisk.

En `sourceRef` indeholder `sourceId`, positiv heltals-`page` og valgfrit `slideLabel`. En fysisk side uden for oplyst `pageCount` afvises. Appen validerer referencernes struktur, ikke medicinske påstandes rigtighed.

### Billeder

En asset indeholder `id`, relativ `path` under `images/`, `mime`, `alt`, valgfri `caption`, `role` (`question` eller `answer`) og `sourceRefs`. Billeder understøtter PNG, JPEG og WebP; filens faktiske format kontrolleres. Ingen SVG, scripts, eksterne URL'er eller indlejret HTML. En standalone JSON skal have tom `assets` og ingen `assetIds`; billeder kræver ZIP.

ZIP-pakken skal indeholde præcis én `lecture.json` i roden. Kun refererede billedfiler importeres. Absolutte stier, stier ud af pakken og dublerede filnavne afvises. Grænser: 128 MiB upload, 256 MiB samlet udpakket indhold, 12 MiB pr. billede og 10.000 kort. Grænserne håndhæves før lagring og vises kun, når de er relevante.

## 5. Import, identitet og lokal lagring

Validering omfatter formatversion, nødvendige felter, unikke ID'er, sektioner, korttyper, korrekte MCQ-referencer, glosar, kilder og medier. Fejl vises med den relevante sektion eller kortidentitet og et forståeligt problem. Fejlbehæftede kort springes aldrig over i stilhed. Forhåndsvisning skriver ikke data.

Kortidentitet dannes af brugerens lagringsscope, MedFLUEN-målet, `packageId` og kortets `id`. Genimport til samme mål genkendes; import til en anden forelæsning må ikke flytte eksisterende kort. Standardvalget ved dubletter er **Tilføj kun nye kort**. Brugeren kan aktivt vælge **Opdater eksisterende indhold** efter at have set antal nye, ændrede og uændrede kort.

Ved opdatering bevares repetitionsplaner for eksisterende kort og glemt-markeringer for uændrede svarpunkter med samme ID og tekst. Ændret svartekst nulstiller netop dette punkts glemt-markering; nye punkter starter uden markering. Manglende kort i en nyere pakke slettes ikke automatisk. Hvis den samme `packageId` importeres med en anden versionsangivelse end støttet, afvises pakken.

Metadata, kort og binære billeder gemmes i IndexedDB i en atomisk importtransaktion, adskilt fra ANKI-specifikke metadata. Læseadapteren forbinder forelæsningskortene med appens eksisterende personlige kort og repetition uden at miste sektioner, glosar eller svarpunkter ved normalisering. Glemt-markeringer er separat brugerstatus og indgår ikke i den delbare indholdspakke.

Indhold og brugerstatus er kontospecifikt. Skift af bruger rydder den indlæste visning, og asynkrone læsninger fra en tidligere bruger må ikke lække ind i den nye. Billed-URLs frigives ved kortskift og afmontering. Lagerfejl giver en klar besked og mulighed for at prøve igen; ingen falsk succes.

Lokal lagring betyder, at pakken og definitionerne ikke kræver appens AI og kan bruges uden en AI-forbindelse. Det lover ikke adgang på andre enheder, fuld offline-start eller automatisk serversynk. Uploadvisningen oplyser kort, at importen gemmes på denne enhed, uden at fylde træningsvisningen med status-tekst. Brugeren beholder den originale JSON/ZIP som backup.

## 6. Den genbrugelige genereringsprompt

Prompten leveres som downloadbar Markdown og en kopierbar tekst i uploadvisningen, sammen med JSON Schema og en tom skabelon. Den skal kunne bruges uden denne chats historik og skal indeholde formatets fulde instruktioner samt brugerens udfyldelige modul- og forelæsningsmål.

Den instruerer ChatGPT i at:

1. Læse hele den vedhæftede forelæsning før strukturering, opdage gentagelser og samle spredt indhold om samme emne.
2. Organisere sektioner og spørgsmål fagligt, med de oprindelige kildesider bevaret. Ikke låse alle forelæsninger til præcis tre sektioner.
3. Formulere konkrete, selvstændige spørgsmål og svar fra kilden. Hver svarliste skal besvare ét spørgsmål med afgrænsede punkter; større lister opdeles, når det forbedrer forståelsen.
4. Bruge `recall-list` til en faglig opremsning, `basic` til et enkelt svar og `mcq` kun når der er et kildestøttet korrekt facit og fagligt begrundede muligheder. Ingen fyldspørgsmål eller tilfældigt opdigtede distraktorer.
5. Tilføje korte, kildestøttede definitioner af nødvendige fagord. Ingen live-AI-afhængighed eller definitioner, der blot gentager ordet.
6. Ekstrahere relevante eksisterende figurer i læsbar kvalitet, uden facitmarkeringer på spørgsmålsbilleder. Gem dem faktisk i ZIP; aldrig skrive en billedsti til en fil, som ikke er leveret. Ingen genererede erstatningsfigurer.
7. Undlade udokumenterede kliniske detaljer, doseringer og supplerende viden. Modsætninger og ulæseligt materiale rapporteres som konkrete `warnings`; ikke udfyldes med gæt.
8. Levere gyldig, schema-kompatibel JSON med stabile ID'er og samtlige kildehenvisninger. Genbrug ID'er ved revision af en tidligere pakke.
9. Returnere en downloadbar fil, når miljøet understøtter det. Hvis ZIP eller billedudtræk ikke er muligt, levere en ærlig tekstpakke uden falske billedreferencer og beskrive præcis, hvad der mangler.

Appen lover ikke, at alle ChatGPT-miljøer kan ekstrahere billeder. Prompten og importerens fejlvisning skal gøre begrænsningen håndterbar, ikke skjule den.

## 7. Komponentgrænser og integration

- **Pakkemodel og validering:** én versioneret kontrakt for schema, parsefejl, referencer, dubletter og indholdsnormalisering. Ingen UI eller netværkskald.
- **Pakkelager:** brugerafgrænset, atomisk lagring og læsning af indhold, medier og glemt-status. Ingen afhængighed af ANKI-deckstier.
- **Uploadvisning:** målvalg, filvalg, fremdrift, preview, dubletbeslutning og bekræftelse. Genbruger appens modal- og knapdesign.
- **Forelæsningssektioner:** integration i `TrainingIndex791`, målvalg og filtrering, ikke en separat parallel deck-browser.
- **Kortvisning:** struktureret svarliste, glosartekst og eksisterende billedholder. Genbruges i reviewer og browser-preview; preview ændrer ikke læringsstatus.
- **Træningsadapter:** integration i `App.js`'s eksisterende personlige kort, kø og vurderinger. Nye detaljer ligger i mindre filer, ikke yderligere store inline-komponenter i `App.js`.
- **Prompt og skabelon:** downloadbare statiske filer, som følger samme kontrakt som valideringen.

Eksisterende `McqCard797`, billeddialogen fra `ReviewContent799` og appens repetitionsmotor genbruges. Tekst- og medievisning udvides sikkert frem for at injicere importerede scripts eller vilkårlige HTML-attributter.

## 8. Definition af en færdig løsning

Løsningen er først klar, når følgende fungerer samlet:

- En tekstpakke og en lille ZIP med et faktisk billede kan previewes og importeres til en eksisterende forelæsning.
- Kort og sektioner overlever genindlæsning; rækkefølge, mål og kortantal stemmer.
- Svarliste-checkbokse gemmer glemte punkter, og den særskilte øvelse viser kun disse uden at bryde normal repetition.
- Glosar fungerer med mus, tastatur og touch og kræver ingen netværksanmodning.
- Billeder afsløres på korrekt side og kan forstørres/lukkes med de eksisterende interaktioner.
- Genimport og indholdsopdatering følger reglerne ovenfor uden at slette brugerdata.
- Ugyldige referencer, manglende medier, usikre ZIP-stier og lagerfejl giver handlingsrettede fejl uden delvis import.
- Reviewer og kortbrowser viser samme indhold korrekt; gamle ANKI-, MCQ- og almindelige kort bevarer deres adfærd.
- Prompt, JSON Schema og tom skabelon kan hentes fra appen og er i overensstemmelse med importen.

Verifikation holdes målrettet: små modeltests for kontrakt, dubletter og sikkerhed; fokuserede interaktionstests for svarliste og glosar; én gennemgang med en lille pakke samt et produktionsbuild. Ingen stor dækimport eller lang, gentagen browser-testserie. Brugeren foretager den bredere praktiske afprøvning.
