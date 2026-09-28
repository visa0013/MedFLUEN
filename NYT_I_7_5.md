# medFLUEN 7.5

## Nyt i denne opdatering

- Ny landing page med “Slå pensum med et smæk”, interaktiv demonstration, FAQ og samlet adgang til login/oprettelse.
- Login med adgangskode eller mailkode, signup-bekræftelse og password recovery. Tre matchende maildesigns til Supabase følger med.
- Flydende navigation i bunden, toppen, venstre eller højre side. På mobil samles den i bunden med en Mere-menu.
- Mindre profilmenu, fire accentfarver og lyst/mørkt/systemtema. Indstillinger gemmes lokalt pr. konto.
- Fluid tabs, Dr. Byte-orb og kort konfetti ved afslutning; respekt for reduceret bevægelse. Den gamle loading-animation er fjernet.
- Private underdæk og kortplaceringer med separat ejerskab, konfliktkontrol og mulighed for at genforsøge fejlede ændringer. Sletning af et dæk sletter ikke kortenes indhold eller repetitionshistorik.
- Hurtigere kortoprettelse: Tilføj eller Cmd/Ctrl+Enter gemmer og åbner næste kort. Dæk/type og fastgjorte oplysninger bevares. Senest tilføjet kan redigeres uden at miste næste kladde.
- Beskyttelse mod dobbeltgemning og ændringer under en igangværende gemning, også i billedkortets masker.
- Eksamenssæt kan registreres uden svar, med separat svarfil eller med svar i samme dokument. Filtre og mærker skelner mellem disse. Ukendt svarstatus vises særskilt.
- Dato til forelæsning genetablerer det administrative match mellem officielle kalenderhændelser og forelæsninger. Din eksisterende adminfunktion genbruges uændret.
- PDF-læser, markeringer og slidenoter fra 7.4 bevares. Noternes kontrolfelter følger nu også det mørke tema.
- Dr. Byte-indstillinger lover ikke længere AI-svar, som ikke er tilsluttet. Lokal søgning i PDF-kilder er fortsat tilgængelig.

## Vigtigt før installation

Dette er en opdateringspakke til dit eksisterende projekt. Alle 18 src-filer skal uploades samlet sammen med package.json. Behold index.js, styles.css, public og api fra dit fungerende projekt. Følg INSTALLATION.md, især schema-kontrollen før databaseændringer.

Der er ikke oprettet betalte tjenester eller ændret i din live-database. Rigtig maillevering, din eksisterende database og eksamensserverens bedømmelse skal kontrolleres efter installation. AI-API er fortsat ikke tilsluttet.
