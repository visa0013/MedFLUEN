# Epilepsi – kurateret forelæsningspakke

Indholdsrevision 4. oktober 2026: 74 kort, 8 sektioner, 7 billeder og 31 fagord med forklaringer. Dækkets størrelse og rækkefølge er bevaret. Enkle faktaspørgsmål får korte, direkte svar. Orddefinitioner hører til i hover, mens mekanismer, kliniske skel og faglige begrundelser fortsat forklares i den synlige tekst, når de er relevante for spørgsmålet. Hover findes kun i svar og forklaringer, ikke i spørgsmål.

Kortet om generaliserede anfaldstyper er uændret. Eksempelvis er prævalenssvaret nu kun: "Cirka 0,5–1 % af befolkningen har epilepsi." Definitioner, som selve spørgsmålet tester, er stadig en del af det synlige facit; de skjules ikke i hover.

## Opdater et allerede importeret dæk

Hent [ZIP-pakken fra MedFLUEN](https://med-fluen.vercel.app/lecture-packs/N4-Epilepsi-Kurateret-Opdateret.zip). I appen vælger du **Upload flashcards**, samme modul og **N4 – Epilepsi**, og derefter **Opdater eksisterende indhold** under Genimport. Kontrollér de 74 kort i forhåndsvisningen og gem.

Pakkens `packageId` og samtlige kort-, sektions- og svarpunkt-ID'er er de samme som i den tidligere kuraterede pakke. Ved genimport til samme mål opdateres indholdet uden nye dubletter; repetitionsplanerne er knyttet til de uændrede kort-ID'er. Appen fjerner tidligere glemt-markeringer for svarpunkter, hvis selve teksten er ændret.

Et GitHub-push udskifter ikke automatisk kort, som allerede er importeret i en brugers lokale browserlager. Import skal foretages i den browser og under den konto, hvor dækket bruges. Pakken erstatter heller ikke den ældre, separate pakke `N4-Epilepsi-MedFLUEN.zip` med 164 kort.

## Fagligt grundlag

Facit og forklaringer tager udgangspunkt i `N4 - Epilepsi.pdf`, 59 fysiske PDF-sider, dateret 09.09.2025. PDF'en og det private Anki-dæk er ikke inkluderet. Kildehenvisninger er bevaret og udvidet, hvor sammenhængen bruger flere slides.

Supplerende begrebsbaggrund findes særskilt i `glossary`. Klikbare, kontrollerede links til Lægehåndbogen, ILAE/IFCN, ACNS, Ugeskrift for Læger og Filadelfia vises i faktaboksene. Blandt andet er [Todds parese](https://ugeskriftet.dk/videnskab/todds-parese), [EEG](https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/neurologi/tilstande-og-sygdomme/kramper/epilepsi/) og [synkope](https://www.sundhed.dk/sundhedsfaglig/laegehaandbogen/generelt/symptomer-og-tegn/synkope/) uddybet. Specialudtrykkene spike-/polyspike-wave, low-row-elektroder og opistotonus har nu særskilte hover-bokse. Ekstern baggrund er ikke fremstillet som nye oplysninger fra PDF'en.

Pakken er studiemateriale, ikke en valideret klinisk instruks. Doser, konkrete kørselsregler og usikre slideoplysninger er fortsat markeret eller fravalgt i `warnings`.

## Filer og kontrol

- `lecture.json`: redigerbart indhold, samme manifest som i ZIP-pakken.
- `identities.json`: oprindelige stabile identiteter til kontrol af genimport.
- `public/lecture-packs/N4-Epilepsi-Kurateret-Opdateret.zip`: uploadpakken inklusive billeder.
- `src/epilepsyPack813.test.js`: kontrollerer den virkelige ZIP med appens importfunktion, identiteter, opdatering og billedreferencer.

Ved senere indholdsrettelser skal JSON-manifestet i ZIP og `lecture.json` opdateres sammen. Bevar identiteterne for eksisterende kort; opret kun nye kort-ID'er for reelt nye læringspunkter.
