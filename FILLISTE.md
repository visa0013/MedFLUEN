# MedFLUEN 7.9 — filer til upload

Forudsætning: 7.8 ligger allerede i GitHub. Åbn filerne enkeltvis her, og upload dem til **samme relative sti** i repositoryet. Nye filer skal oprettes med nøjagtigt samme store/små bogstaver. Upload hele sættet i én commit. [Installationsguiden](INSTALLATION.md) beskriver rækkefølgen.

## Appens indgang og eksisterende filer, der ændres

- [App.js](src/App.js) → `src/App.js`
- [Appearance75.js](src/Appearance75.js) → `src/Appearance75.js`
- [Catalog751.js](src/Catalog751.js) → `src/Catalog751.js`
- [Experience72.js](src/Experience72.js) → `src/Experience72.js`
- [appearance75-model.js](src/appearance75-model.js) → `src/appearance75-model.js`
- [catalog751-model.js](src/catalog751-model.js) → `src/catalog751-model.js`
- [shell78-model.js](src/shell78-model.js) → `src/shell78-model.js`
- [index.js](src/index.js) → `src/index.js` (inkluderet som sikker indgangsfil)
- [index.html](public/index.html) → `public/index.html` (inkluderet som sikker indgangsfil)

## Nye 7.9-filer i `src`

- [Home79.js](src/Home79.js), [Training79.js](src/Training79.js), [Curriculum79.js](src/Curriculum79.js), [Planning79.js](src/Planning79.js)
- [FirstEntry79.js](src/FirstEntry79.js), [DrByte79.js](src/DrByte79.js), [DrByteTone79.js](src/DrByteTone79.js), [ByteSource79.js](src/ByteSource79.js)
- [workspace79-model.js](src/workspace79-model.js), [training79-model.js](src/training79-model.js), [curriculum79-model.js](src/curriculum79-model.js), [planning79-model.js](src/planning79-model.js)
- [drbyte79-model.js](src/drbyte79-model.js), [drbyte79-retrieval.js](src/drbyte79-retrieval.js), [drbyte79-store.js](src/drbyte79-store.js), [drbyte79-tone.js](src/drbyte79-tone.js)
- [workspace79.css](src/workspace79.css), [training79.css](src/training79.css), [curriculum79.css](src/curriculum79.css), [planning79.css](src/planning79.css), [first-entry79.css](src/first-entry79.css), [drbyte79.css](src/drbyte79.css)

## Serverfiler

- [dr-byte-core.cjs](api/_lib/dr-byte-core.cjs) → `api/_lib/dr-byte-core.cjs` (ændret)
- [dr-byte-quota79.cjs](api/_lib/dr-byte-quota79.cjs) → `api/_lib/dr-byte-quota79.cjs` (ny)
- [dr-byte-tone79.cjs](api/_lib/dr-byte-tone79.cjs) → `api/_lib/dr-byte-tone79.cjs` (ny)

Lad den eksisterende [dr-byte.js](api/dr-byte.js) blive på `api/dr-byte.js`. Upload **ikke** en API-nøgle eller en lokal `.env`-fil.

## Database

Kør de tre nye migrationsfiler før deployment: [curriculum-kinds](supabase/segment_7_9_curriculum_kinds.sql), [samtalehistorik](supabase/segment_7_9_dr_byte_conversations.sql) og [kvote](supabase/segment_7_9_dr_byte_quota.sql). De skal køres i Supabase SQL Editor; GitHub-upload alene opretter ikke tabellerne.

Testfilerne i [den komplette filliste](ALLE_FILER.md) er med i pakken til videreudvikling, men ikke nødvendige for Vercel-deployment.
