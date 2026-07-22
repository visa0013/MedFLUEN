// Kræver: npm install @supabase/supabase-js
import React, { useEffect, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vuydytqlwhrblfrckpsj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1eWR5dHFsd2hyYmxmcmNrcHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NDQ0ODcsImV4cCI6MjEwMDMyMDQ4N30.c9wR1lFyCd-mWC5o_VYwzIxbEaEG2nD-OFKCj-IhQjg";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE = {
  user: "medlearn-user",
  theme: "medlearn-theme",
  language: "medlearn-language",
  preferences: "medlearn-preferences",
  notes: "medlearn-notes",
  activeNote: "medlearn-active-note",
  timer: "medlearn-timer",
  quizHistory: "medlearn-quiz-history",
  studyPlans: "medlearn-study-plans",
  spacedRepetition: "medlearn-spaced-repetition",
  deckSettings: "medlearn-deck-settings",
  importedQuestions: "medlearn-imported-questions",
  adminUnlocked: "medlearn-admin-unlocked",
  questionOverrides: "medlearn-question-overrides",
  buriedCards: "medlearn-buried-cards",
  calendarEvents: "medlearn-calendar-events",
  streak: "medlearn-streak",
  resumeSession: "medlearn-resume-session",
  pomodoroLog: "medlearn-pomodoro-log",
  pomodoroMinutesLog: "medlearn-pomodoro-minutes-log",
  badgesSeen: "medlearn-badges-seen",
  mascotState: "medlearn-mascot-state",
  dailyChecklist: "medlearn-daily-checklist",
  quickAccessOrder: "medlearn-quickaccess-order",
  flaggedQuestions: "medlearn-flagged-questions",
  aiSettings: "medlearn-ai-settings",
};

const LANGUAGES = [
  { code: "da", label: "Dansk", native: "Dansk", dir: "ltr" },
  { code: "en", label: "English", native: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
];

const TEXT = {
  da: {
    preparing: "Klargør",
    name: "Dit navn",
    nameQuestion: "Hvad vil du gerne kaldes?",
    namePlaceholder: "Skriv dit navn",
    studyLevel: "Studieniveau",
    chooseStudyLevel: "Vælg studieniveau",
    chooseModule: "Vælg modul",
    bachelor: "Bachelor",
    candidate: "Kandidat",
    continue: "Fortsæt",
    back: "Tilbage",
    start: "Start",
    home: "Hjem",
    clinicalMcq: "Kliniske MCQ'er",
    drByte: "Dr. Byte",
    drByteChatTitle: "Spørg Dr. Byte",
    drByteChatSubtitle: "Find relevante spørgsmål fra jeres spørgsmålsbank",
    drByteInputPlaceholder: "Skriv dit spørgsmål her...",
    drByteSend: "Send",
    drByteEmptyState:
      "Spørg mig om et emne, og jeg finder de mest relevante spørgsmål fra spørgsmålsbanken.",
    drByteThinking: "Søger i spørgsmålsbanken...",
    drByteNoResults:
      "Jeg kunne ikke finde nogen relevante spørgsmål. Prøv at omformulere eller nævne et specifikt emne.",
    drByteFoundOne: "Jeg fandt dette spørgsmål, som matcher bedst:",
    drByteFoundMany: "Jeg fandt disse spørgsmål, der matcher bedst:",
    drByteOpenQuestion: "Åbn spørgsmål",
    drByteMatchScore: "match",
    drByteClearChat: "Ryd samtale",
    drByteScanningBank: "Analyserer",
    drByteScannedNote: "Gennemgik",
    drByteQuestionsUnit: "spørgsmål i banken",
    drByteAiError: "AI-fejl:",
    drByteSourcesLabel: "Kilder fra spørgsmålsbanken",
    drByteBasedOnLabel: "Baseret på dette spørgsmål",
    drByteAiSectionTitle: "Dr. Byte AI",
    drByteAiToggleLabel: "Aktivér AI-svar",
    drByteAiToggleDescription:
      "Lad Dr. Byte generere rigtige svar baseret på jeres MCQ-data",
    drByteAiKeyLabel: "OpenAI API-nøgle",
    drByteAiKeyPlaceholder: "sk-...",
    drByteAiModelLabel: "Model",
    drByteAiKeyHint:
      "Din nøgle gemmes kun lokalt i din browser og sendes direkte til OpenAI — aldrig til en tredjepartsserver.",
    drByteWebSearchLabel: "Tillad websøgning",
    drByteWebSearchDescription:
      "Lad AI'en søge information op på nettet, når spørgsmålsbanken ikke er tilstrækkelig",
    drByteUsedWebSearch: "Svaret inkluderer information fundet via websøgning",
    drByteAiProviderLabel: "AI-udbyder",
    drByteNvidiaKeyLabel: "NVIDIA API-nøgle",
    drByteNvidiaKeyPlaceholder:
      "nvapi-... (valgfrit, standardnøgle bruges hvis tom)",
    drByteNvidiaKeyHint:
      "Hvis feltet er tomt, bruges en indbygget standardnøgle. Bemærk: al kode i denne app er synlig i browseren, så del ikke appen offentligt uden at rotere nøglen.",
    drByteNvidiaProxyLabel: "Proxy-URL (valgfrit)",
    drByteNvidiaProxyPlaceholder: "fx https://din-proxy.dk/api/nvidia",
    drByteNvidiaProxyHint:
      "NVIDIA's API blokerer direkte kald fra browseren (CORS). Uden en proxy-server får du en 'Failed to fetch'-fejl. Peg her på en simpel mellemled-server, der videresender kaldet til NVIDIA.",
    drByteGroqKeyLabel: "Groq API-nøgle",
    drByteGroqKeyPlaceholder: "gsk_...",
    drByteGroqKeyHint:
      "Groq tillader direkte kald fra browseren (ingen proxy nødvendig) og har en gratis niveau. Få en nøgle på console.groq.com.",
    notebook: "Notesbog",
    settings: "Indstillinger",
    language: "Sprog",
    profile: "Profil",
    resetProfile: "Nulstil profil",
    signOutAction: "Log ud",
    close: "Luk",
    newNote: "Ny note",
    deleteNote: "Slet note",
    renameHint: "Klik aktiv fane for at omdøbe",
    untitledNote: "Unavngivet note",
    note: "Note",
    notesPlaceholder: "Skriv dine noter...",
    words: "ord",
    font: "Skrifttype",
    focus: "Fokus",
    break: "Pause",
    focusTimer: "Fokusur",
    chooseSession: "Vælg en session.",
    minutes: "min",
    sessions: "sessioner",
    startFocus: "Start fokus",
    pause: "Pause",
    resume: "Fortsæt",
    resetTimer: "Nulstil",
    question: "Spørgsmål",
    previous: "Forrige",
    next: "Næste",
    finish: "Afslut",
    feedbackOn: "Feedback til",
    feedbackOff: "Feedback fra",
    correct: "Korrekt",
    incorrect: "Ikke helt",
    sessionComplete: "Session afsluttet",
    perfectSession: "Perfekt session",
    strongPerformance: "Stærk præstation",
    goodProgress: "God fremgang",
    readyForReview: "Klar til repetition",
    perfectDescription: "Alle spørgsmål er besvaret korrekt.",
    strongDescription: "Du har et solidt overblik over emnerne i sessionen.",
    progressDescription:
      "Gennemgå de forkerte svar for at styrke svagere områder.",
    reviewDescription: "En målrettet gennemgang vil give mest læring nu.",
    answered: "Besvaret",
    unanswered: "Ubesvaret",
    incorrectCount: "Forkert",
    resultsByTopic: "Resultater pr. emne",
    resultsByTopicDescription: "Se hvilke områder der skal repeteres.",
    focusArea: "Fokus",
    nextStep: "Næste skridt",
    reviewAnswers: "Gennemgå svar",
    startNewSession: "Start ny session",
    reviewSession: "Gennemgang af session",
    toResults: "Til resultat",
    appearance: "Udseende",
    light: "Lys",
    dark: "Mørk",
    textSize: "Tekststørrelse",
    questionText: "Spørgsmålstekst",
    small: "Lille",
    standard: "Standard",
    large: "Stor",
    timerSound: "Timelyd",
    timerSoundDescription: "Lyd ved afsluttet session",
    mascotToggle: "Vis Dr. Byte",
    mascotToggleDescription: "Vis den flydende mus-assistent i hjørnet",
    editOrder: "Rediger rækkefølge",
    doneReorder: "Færdig",
    reorderHint: "Træk boksene for at ændre rækkefølgen",
    done: "Færdig",
    chooseLanguage: "Vælg sprog",
    languageDescription:
      "Hele brugerfladen og spørgsmålene vises på dette sprog.",
    resetProfileTitle: "Nulstil profil?",
    resetProfileDescription:
      "Dit navn, niveau og modul fjernes. Dine noter beholdes.",
    cancel: "Annuller",
    reset: "Nulstil",
    currentModule: "Nuværende modul",
    repetition: "Repetition",
    insights: "Indsigter",
    comingSoon: "Kommer snart",
    questionOf: (current, total) => `Spørgsmål ${current} af ${total}`,
    correctOutOf: (correct, total) => `${correct} af ${total} korrekt`,
    topicCorrect: (correct, total) => `${correct}/${total} korrekt`,
    focusInstruction: (topic) =>
      `Gennemgå ${topic} og læs forklaringerne til de forkerte svar.`,
    noFocusInstruction:
      "Fremragende — du kan fortsætte til et nyt emne eller tage sessionen igen.",
    chooseSessionScope: "Vælg emne og forelæsning",
    allTopics: "Alle emner",
    allLecturesInGroup: "Alle forelæsninger i dette emne",
    dueMode: "Forfaldne spørgsmål",
    allMode: "Alle spørgsmål",
    lectureModeHint: "Spørgsmål prioriteres efter, hvad du skal repetere.",
    noQuestionsInLecture: "Ingen spørgsmål tilknyttet endnu.",
    newCard: "Nyt",
    reviewCard: "Repetition",
    dueCount: (count) => `${count} til repetition`,
    newCountLabel: (count) => `${count} nye`,
    noNewOrDue: "Intet at øve lige nu",
    importQuestions: "Importér spørgsmål",
    importTitle: "Importér nye MCQ'er",
    importDescription:
      "Indsæt en JSON-liste med spørgsmål i samme format som eksisterende data.",
    importPlaceholder:
      '[ { "question": "...", "options": ["..."], "correct": 0 } ]',
    importSuccess: (count) => `${count} spørgsmål importeret`,
    importError: "Kunne ikke læse JSON. Kontrollér formatet.",
    importModuleLabel: "Tilknyt modul",
    importLectureLabel: "Tilknyt forelæsning (valgfrit)",
    importButton: "Importér",
    importCancel: "Annuller",
    importUploadFile: "Upload JSON-fil",
    importEmpty: "Ingen gyldige spørgsmål fundet.",
    importIssuesTitle: (count) =>
      count === 1 ? "1 problem fundet" : `${count} problemer fundet`,
    importPreviewTitle: (count) =>
      count === 1
        ? "1 spørgsmål klar til import"
        : `${count} spørgsmål klar til import`,
    importDuplicateWarning: "Findes muligvis allerede i banken",
    importConfirmButton: (count) =>
      count === 1 ? "Importér 1 spørgsmål" : `Importér ${count} spørgsmål`,
    adminPortal: "Admin-portal",
    replayTutorial: "Vis rundvisning",
    adminGateTitle: "Administratoradgang",
    adminGateDescription:
      "Indtast adgangskoden for at redigere spørgsmålsbanken.",
    adminPasscodePlaceholder: "Adgangskode",
    adminUnlock: "Lås op",
    adminWrongCode: "Forkert adgangskode.",
    adminPanelTitle: "Administrer indhold",
    adminImportedList: "Importerede spørgsmål",
    adminNoImported: "Ingen spørgsmål importeret endnu.",
    adminDelete: "Slet",
    adminTabImport: "Importer",
    adminTabFlagged: "Flaggede spørgsmål",
    adminFlaggedCount: "flaggede",
    adminNoFlagged: "Ingen flaggede spørgsmål endnu.",
    adminFlaggedBy: "Flagget af",
    adminFlaggedAt: "Tidspunkt",
    adminFlaggedReason: "Begrundelse",
    adminFlaggedResolve: "Markér som løst",
    adminFlaggedDismiss: "Afvis",
    adminFlaggedResolved: "Løst",
    adminFlaggedOpen: "Åbne",
    flagQuestion: "Flag spørgsmål",
    flagQuestionTitle: "Flag dette spørgsmål",
    flagQuestionDescription:
      "Fortæl kort, hvorfor du er uenig med spørgsmålet, svaret eller forklaringen.",
    flagQuestionPlaceholder: "Beskriv problemet...",
    flagQuestionSubmit: "Send flag",
    flagQuestionCancel: "Annuller",
    flagQuestionSuccess: "Tak! Spørgsmålet er sendt til gennemgang.",
    flagQuestionAlreadyFlagged: "Du har allerede flagget dette spørgsmål.",
    adminLock: "Lås admin-portal",
    lectureMenu: "Forelæsningsmenu",
    viewQuestions: "Se spørgsmål",
    resetProgress: "Nulstil fremgang",
    resetProgressConfirmTitle: "Nulstil fremgang for denne bunke?",
    resetProgressConfirmDescription:
      "Alle repetitionsdata for spørgsmålene i denne forelæsning nulstilles, så de igen tæller som nye.",
    resetConfirm: "Nulstil",
    resetDone: "Fremgang nulstillet",
    questionListTitle: "Spørgsmål i forelæsning",
    noCardsInLecture: "Ingen spørgsmål i denne forelæsning endnu.",
    cardStatusNew: "Nyt",
    cardStatusDue: "Til repetition",
    cardStatusLearned: "Lært",
    addNewQuestion: "Opret nyt spørgsmål",
    editQuestion: "Redigér spørgsmål",
    newQuestionTitle: "Nyt spørgsmål",
    questionFieldLabel: "Spørgsmål",
    optionsFieldLabel: "Svarmuligheder",
    correctFieldLabel: "Korrekt svar",
    explanationFieldLabel: "Forklaring",
    categoryFieldLabel: "Kategori",
    saveQuestion: "Gem",
    cancelEdit: "Annuller",
    deleteQuestion: "Slet spørgsmål",
    confirmDeleteQuestion: "Er du sikker på, du vil slette dette spørgsmål?",
    addOption: "Tilføj svarmulighed",
    removeOption: "Fjern",
    closeList: "Luk liste",
    cardMenu: "Kortmenu",
    buryCard: "Gem kort væk",
    unburyCard: "Hent kort tilbage",
    resetThisCard: "Nulstil dette kort",
    viewLectureList: "Se spørgsmål i denne bunke",
    cardBuried: "Kort gemt væk til næste session",
    cardReset: "Kortets fremgang er nulstillet",
    fullscreenEnter: "Fuld skærm",
    fullscreenExit: "Afslut fuld skærm",
    noBuriedCards: "Ingen gemte kort",
    buriedCardsTitle: "Gemte kort",
    examSetBlock: "Eksamenssætøvelse",
    examSetBlockText: "Øv tidligere eksamensspørgsmål for modulet",
    lecturesBlock: "Forelæsninger",
    lecturesBlockText: "Gennemgå MCQ'er tilknyttet forelæsninger",
    startExamSet: "Øv eksamenssæt",
    startLectures: "Start forelæsninger",
    todaysPlanTitle: "Dagens plan",
    calendar: "Kalender",
    calendarTitle: "Kalender",
    calendarToday: "I dag",
    calendarAddEvent: "Ny hændelse",
    calendarEditEvent: "Redigér hændelse",
    calendarEventTitle: "Titel",
    calendarEventTitlePlaceholder: "Fx repetition af nyrefysiologi",
    calendarEventDate: "Dato",
    calendarEventTime: "Tidspunkt",
    calendarEventType: "Type",
    calendarTypeExam: "Eksamen",
    calendarTypeStudy: "Studieblok",
    calendarTypeReview: "Repetition",
    calendarTypeOther: "Andet",
    calendarSave: "Gem",
    calendarDelete: "Slet",
    calendarCancel: "Annuller",
    calendarNoEvents: "Ingen hændelser denne dag",
    calendarUpcoming: "Kommende",
    calendarNoUpcoming: "Ingen kommende hændelser",
    calendarMon: "Man",
    calendarTue: "Tir",
    calendarWed: "Ons",
    calendarThu: "Tor",
    calendarFri: "Fre",
    calendarSat: "Lør",
    calendarSun: "Søn",
    calendarViewDay: "Dag",
    calendarViewWeek: "Uge",
    calendarViewMonth: "Måned",
    calendarLecturesTitle: "Forelæsninger",
    calendarNoLectures: "Ingen forelæsninger for dette modul.",
    calendarImportICal: "Importér iCal",
    calendarICalEmpty: "Ingen hændelser fundet i filen.",
    calendarICalError: "Kunne ikke læse iCal-filen. Kontrollér formatet.",
    todaysPlanExpandedTitle: "Dagens plan",
  },

  en: {
    preparing: "Preparing",
    name: "Your name",
    nameQuestion: "What would you like to be called?",
    namePlaceholder: "Enter your name",
    studyLevel: "Study level",
    chooseStudyLevel: "Choose study level",
    chooseModule: "Choose module",
    bachelor: "Bachelor",
    candidate: "Graduate",
    continue: "Continue",
    back: "Back",
    start: "Start",
    home: "Home",
    clinicalMcq: "Clinical MCQs",
    drByte: "Dr. Byte",
    drByteChatTitle: "Ask Dr. Byte",
    drByteChatSubtitle: "Find relevant questions from your question bank",
    drByteInputPlaceholder: "Type your question here...",
    drByteSend: "Send",
    drByteEmptyState:
      "Ask me about a topic and I'll find the most relevant questions from the question bank.",
    drByteThinking: "Searching the question bank...",
    drByteNoResults:
      "I couldn't find any relevant questions. Try rephrasing or mentioning a specific topic.",
    drByteFoundOne: "I found this question that matches best:",
    drByteFoundMany: "I found these questions that match best:",
    drByteOpenQuestion: "Open question",
    drByteMatchScore: "match",
    drByteClearChat: "Clear conversation",
    drByteScanningBank: "Analyzing",
    drByteScannedNote: "Scanned",
    drByteQuestionsUnit: "questions in the bank",
    drByteAiError: "AI error:",
    drByteSourcesLabel: "Sources from the question bank",
    drByteBasedOnLabel: "Based on this question",
    drByteAiSectionTitle: "Dr. Byte AI",
    drByteAiToggleLabel: "Enable AI answers",
    drByteAiToggleDescription:
      "Let Dr. Byte generate real answers based on your MCQ data",
    drByteAiKeyLabel: "OpenAI API key",
    drByteAiKeyPlaceholder: "sk-...",
    drByteAiModelLabel: "Model",
    drByteAiKeyHint:
      "Your key is stored only locally in your browser and sent directly to OpenAI — never to a third-party server.",
    drByteWebSearchLabel: "Allow web search",
    drByteWebSearchDescription:
      "Let the AI look up information online when the question bank is not enough",
    drByteUsedWebSearch:
      "This answer includes information found via web search",
    drByteAiProviderLabel: "AI provider",
    drByteNvidiaKeyLabel: "NVIDIA API key",
    drByteNvidiaKeyPlaceholder:
      "nvapi-... (optional, default key used if empty)",
    drByteNvidiaKeyHint:
      "If left empty, a built-in default key is used. Note: all code in this app is visible in the browser, so don't share the app publicly without rotating the key.",
    drByteNvidiaProxyLabel: "Proxy URL (optional)",
    drByteNvidiaProxyPlaceholder: "e.g. https://your-proxy.com/api/nvidia",
    drByteNvidiaProxyHint:
      "NVIDIA's API blocks direct calls from the browser (CORS). Without a proxy server you'll get a 'Failed to fetch' error. Point this at a simple relay server that forwards the request to NVIDIA.",
    drByteGroqKeyLabel: "Groq API key",
    drByteGroqKeyPlaceholder: "gsk_...",
    drByteGroqKeyHint:
      "Groq allows direct calls from the browser (no proxy needed) and has a free tier. Get a key at console.groq.com.",
    notebook: "Notebook",
    settings: "Settings",
    language: "Language",
    profile: "Profile",
    resetProfile: "Reset profile",
    signOutAction: "Sign out",
    close: "Close",
    newNote: "New note",
    deleteNote: "Delete note",
    renameHint: "Click the active tab to rename it",
    untitledNote: "Untitled note",
    note: "Note",
    notesPlaceholder: "Write your notes...",
    words: "words",
    font: "Font",
    focus: "Focus",
    break: "Break",
    focusTimer: "Focus timer",
    chooseSession: "Choose a session.",
    minutes: "min",
    sessions: "sessions",
    startFocus: "Start focus",
    pause: "Pause",
    resume: "Continue",
    resetTimer: "Reset",
    question: "Question",
    previous: "Previous",
    next: "Next",
    finish: "Finish",
    feedbackOn: "Feedback on",
    feedbackOff: "Feedback off",
    correct: "Correct",
    incorrect: "Not quite",
    sessionComplete: "Session complete",
    perfectSession: "Perfect session",
    strongPerformance: "Strong performance",
    goodProgress: "Good progress",
    readyForReview: "Ready for review",
    perfectDescription: "All questions were answered correctly.",
    strongDescription: "You have a solid overview of this session's topics.",
    progressDescription: "Review incorrect answers to strengthen weaker areas.",
    reviewDescription:
      "Targeted review will create the most learning right now.",
    answered: "Answered",
    unanswered: "Unanswered",
    incorrectCount: "Incorrect",
    resultsByTopic: "Results by topic",
    resultsByTopicDescription: "See which areas need review.",
    focusArea: "Focus",
    nextStep: "Next step",
    reviewAnswers: "Review answers",
    startNewSession: "Start new session",
    reviewSession: "Session review",
    toResults: "To results",
    appearance: "Appearance",
    light: "Light",
    dark: "Dark",
    textSize: "Text size",
    questionText: "Question text",
    small: "Small",
    standard: "Standard",
    large: "Large",
    timerSound: "Timer sound",
    timerSoundDescription: "Sound when a session ends",
    mascotToggle: "Show Dr. Byte",
    mascotToggleDescription: "Show the floating mouse assistant in the corner",
    editOrder: "Edit order",
    doneReorder: "Done",
    reorderHint: "Drag the boxes to change their order",
    done: "Done",
    chooseLanguage: "Choose language",
    languageDescription:
      "The full interface and questions are shown in this language.",
    resetProfileTitle: "Reset profile?",
    resetProfileDescription:
      "Your name, level, and module will be removed. Your notes remain.",
    cancel: "Cancel",
    reset: "Reset",
    currentModule: "Current module",
    repetition: "Revision",
    insights: "Insights",
    comingSoon: "Coming soon",
    questionOf: (current, total) => `Question ${current} of ${total}`,
    correctOutOf: (correct, total) => `${correct} out of ${total} correct`,
    topicCorrect: (correct, total) => `${correct}/${total} correct`,
    focusInstruction: (topic) =>
      `Review ${topic} and read the explanations for incorrect answers.`,
    noFocusInstruction:
      "Excellent — continue to a new topic or take the session again.",
    chooseSessionScope: "Choose topic and lecture",
    allTopics: "All topics",
    allLecturesInGroup: "All lectures in this topic",
    dueMode: "Due questions",
    allMode: "All questions",
    lectureModeHint: "Questions are prioritized by what's due for review.",
    noQuestionsInLecture: "No questions linked yet.",
    newCard: "New",
    reviewCard: "Review",
    dueCount: (count) => `${count} due for review`,
    newCountLabel: (count) => `${count} new`,
    noNewOrDue: "Nothing to practice right now",
    importQuestions: "Import questions",
    importTitle: "Import new MCQs",
    importDescription:
      "Paste a JSON list of questions in the same format as existing data.",
    importPlaceholder:
      '[ { "question": "...", "options": ["..."], "correct": 0 } ]',
    importSuccess: (count) => `${count} questions imported`,
    importError: "Could not read JSON. Check the format.",
    importModuleLabel: "Assign module",
    importLectureLabel: "Assign lecture (optional)",
    importButton: "Import",
    importCancel: "Cancel",
    importUploadFile: "Upload JSON file",
    importEmpty: "No valid questions found.",
    importIssuesTitle: (count) =>
      count === 1 ? "1 issue found" : `${count} issues found`,
    importPreviewTitle: (count) =>
      count === 1
        ? "1 question ready to import"
        : `${count} questions ready to import`,
    importDuplicateWarning: "May already exist in the bank",
    importConfirmButton: (count) =>
      count === 1 ? "Import 1 question" : `Import ${count} questions`,
    adminPortal: "Admin portal",
    replayTutorial: "Show tour",
    adminGateTitle: "Administrator access",
    adminGateDescription: "Enter the passcode to edit the question bank.",
    adminPasscodePlaceholder: "Passcode",
    adminUnlock: "Unlock",
    adminWrongCode: "Incorrect passcode.",
    adminPanelTitle: "Manage content",
    adminImportedList: "Imported questions",
    adminNoImported: "No questions imported yet.",
    adminDelete: "Delete",
    adminTabImport: "Import",
    adminTabFlagged: "Flagged questions",
    adminFlaggedCount: "flagged",
    adminNoFlagged: "No flagged questions yet.",
    adminFlaggedBy: "Flagged by",
    adminFlaggedAt: "Timestamp",
    adminFlaggedReason: "Reason",
    adminFlaggedResolve: "Mark resolved",
    adminFlaggedDismiss: "Dismiss",
    adminFlaggedResolved: "Resolved",
    adminFlaggedOpen: "Open",
    flagQuestion: "Flag question",
    flagQuestionTitle: "Flag this question",
    flagQuestionDescription:
      "Briefly explain why you disagree with the question, answer, or explanation.",
    flagQuestionPlaceholder: "Describe the issue...",
    flagQuestionSubmit: "Submit flag",
    flagQuestionCancel: "Cancel",
    flagQuestionSuccess: "Thanks! The question has been sent for review.",
    flagQuestionAlreadyFlagged: "You have already flagged this question.",
    adminLock: "Lock admin portal",
    lectureMenu: "Lecture menu",
    viewQuestions: "View questions",
    resetProgress: "Reset progress",
    resetProgressConfirmTitle: "Reset progress for this deck?",
    resetProgressConfirmDescription:
      "All spaced-repetition data for questions in this lecture will be reset, so they count as new again.",
    resetConfirm: "Reset",
    resetDone: "Progress reset",
    questionListTitle: "Questions in lecture",
    noCardsInLecture: "No questions in this lecture yet.",
    cardStatusNew: "New",
    cardStatusDue: "Due",
    cardStatusLearned: "Learned",
    addNewQuestion: "Create new question",
    editQuestion: "Edit question",
    newQuestionTitle: "New question",
    questionFieldLabel: "Question",
    optionsFieldLabel: "Answer options",
    correctFieldLabel: "Correct answer",
    explanationFieldLabel: "Explanation",
    categoryFieldLabel: "Category",
    saveQuestion: "Save",
    cancelEdit: "Cancel",
    deleteQuestion: "Delete question",
    confirmDeleteQuestion: "Are you sure you want to delete this question?",
    addOption: "Add option",
    removeOption: "Remove",
    closeList: "Close list",
    cardMenu: "Card menu",
    buryCard: "Bury card",
    unburyCard: "Unbury card",
    resetThisCard: "Reset this card",
    viewLectureList: "View questions in this deck",
    cardBuried: "Card buried until next session",
    cardReset: "Card progress reset",
    fullscreenEnter: "Full screen",
    fullscreenExit: "Exit full screen",
    noBuriedCards: "No buried cards",
    buriedCardsTitle: "Buried cards",
    examSetBlock: "Exam set practice",
    examSetBlockText: "Practice previous exam questions for the module",
    lecturesBlock: "Lectures",
    lecturesBlockText: "Review MCQs linked to lectures",
    startExamSet: "Practice exam set",
    startLectures: "Start lectures",
    todaysPlanTitle: "Today's plan",
    calendar: "Calendar",
    calendarTitle: "Calendar",
    calendarToday: "Today",
    calendarAddEvent: "New event",
    calendarEditEvent: "Edit event",
    calendarEventTitle: "Title",
    calendarEventTitlePlaceholder: "E.g. renal physiology review",
    calendarEventDate: "Date",
    calendarEventTime: "Time",
    calendarEventType: "Type",
    calendarTypeExam: "Exam",
    calendarTypeStudy: "Study block",
    calendarTypeReview: "Review",
    calendarTypeOther: "Other",
    calendarSave: "Save",
    calendarDelete: "Delete",
    calendarCancel: "Cancel",
    calendarNoEvents: "No events this day",
    calendarUpcoming: "Upcoming",
    calendarNoUpcoming: "No upcoming events",
    calendarMon: "Mon",
    calendarTue: "Tue",
    calendarWed: "Wed",
    calendarThu: "Thu",
    calendarFri: "Fri",
    calendarSat: "Sat",
    calendarSun: "Sun",
    calendarViewDay: "Day",
    calendarViewWeek: "Week",
    calendarViewMonth: "Month",
    calendarLecturesTitle: "Lectures",
    calendarNoLectures: "No lectures for this module.",
    calendarImportICal: "Import iCal",
    calendarICalEmpty: "No events found in the file.",
    calendarICalError: "Could not read the iCal file. Check the format.",
    todaysPlanExpandedTitle: "Today's plan",
  },

  ar: {
    preparing: "جارٍ التحضير",
    name: "الاسم",
    nameQuestion: "بماذا تود أن نناديك؟",
    namePlaceholder: "اكتب اسمك",
    studyLevel: "المستوى الدراسي",
    chooseStudyLevel: "اختر المستوى الدراسي",
    chooseModule: "اختر الوحدة",
    bachelor: "بكالوريوس",
    candidate: "دراسات عليا",
    continue: "متابعة",
    back: "رجوع",
    start: "ابدأ",
    home: "الرئيسية",
    clinicalMcq: "أسئلة سريرية متعددة الخيارات",
    drByte: "الدكتور بايت",
    drByteChatTitle: "اسأل الدكتور بايت",
    drByteChatSubtitle: "ابحث عن أسئلة ذات صلة من بنك الأسئلة",
    drByteInputPlaceholder: "اكتب سؤالك هنا...",
    drByteSend: "إرسال",
    drByteEmptyState:
      "اسألني عن موضوع وسأجد لك الأسئلة الأكثر صلة من بنك الأسئلة.",
    drByteThinking: "جارٍ البحث في بنك الأسئلة...",
    drByteNoResults:
      "لم أتمكن من العثور على أسئلة ذات صلة. حاول إعادة الصياغة أو ذكر موضوع محدد.",
    drByteFoundOne: "وجدت هذا السؤال الأكثر تطابقًا:",
    drByteFoundMany: "وجدت هذه الأسئلة الأكثر تطابقًا:",
    drByteOpenQuestion: "فتح السؤال",
    drByteMatchScore: "تطابق",
    drByteClearChat: "مسح المحادثة",
    drByteScanningBank: "يتم التحليل",
    drByteScannedNote: "تم فحص",
    drByteQuestionsUnit: "سؤالًا في البنك",
    drByteAiError: "خطأ في الذكاء الاصطناعي:",
    drByteSourcesLabel: "مصادر من بنك الأسئلة",
    drByteBasedOnLabel: "بناءً على هذا السؤال",
    drByteAiSectionTitle: "الذكاء الاصطناعي للدكتور بايت",
    drByteAiToggleLabel: "تفعيل إجابات الذكاء الاصطناعي",
    drByteAiToggleDescription:
      "دع الدكتور بايت يولّد إجابات حقيقية بناءً على بيانات أسئلتك",
    drByteAiKeyLabel: "مفتاح OpenAI API",
    drByteAiKeyPlaceholder: "sk-...",
    drByteAiModelLabel: "النموذج",
    drByteAiKeyHint:
      "يتم تخزين مفتاحك محليًا فقط في متصفحك وإرساله مباشرة إلى OpenAI — لا يُرسل أبدًا إلى خادم خارجي.",
    drByteWebSearchLabel: "السماح بالبحث على الويب",
    drByteWebSearchDescription:
      "دع الذكاء الاصطناعي يبحث عن معلومات على الإنترنت عندما لا يكون بنك الأسئلة كافيًا",
    drByteUsedWebSearch:
      "تحتوي هذه الإجابة على معلومات تم العثور عليها عبر البحث على الويب",
    drByteAiProviderLabel: "مزود الذكاء الاصطناعي",
    drByteNvidiaKeyLabel: "مفتاح NVIDIA API",
    drByteNvidiaKeyPlaceholder:
      "nvapi-... (اختياري، يُستخدم المفتاح الافتراضي إذا تُرك فارغًا)",
    drByteNvidiaKeyHint:
      "إذا تُرك الحقل فارغًا، يُستخدم مفتاح افتراضي مدمج. ملاحظة: جميع الأكواد في هذا التطبيق مرئية في المتصفح، فلا تشارك التطبيق علنًا دون تدوير المفتاح.",
    drByteNvidiaProxyLabel: "عنوان URL للوكيل (اختياري)",
    drByteNvidiaProxyPlaceholder: "مثال: https://your-proxy.com/api/nvidia",
    drByteNvidiaProxyHint:
      "تحظر واجهة برمجة تطبيقات NVIDIA الاتصال المباشر من المتصفح (CORS). بدون خادم وكيل ستحصل على خطأ 'Failed to fetch'. أشر هنا إلى خادم وسيط بسيط يعيد توجيه الطلب إلى NVIDIA.",
    drByteGroqKeyLabel: "مفتاح Groq API",
    drByteGroqKeyPlaceholder: "gsk_...",
    drByteGroqKeyHint:
      "يسمح Groq بالاتصال المباشر من المتصفح (لا حاجة لخادم وكيل) ولديه مستوى مجاني. احصل على مفتاح من console.groq.com.",
    notebook: "دفتر الملاحظات",
    settings: "الإعدادات",
    language: "اللغة",
    profile: "الملف الشخصي",
    resetProfile: "إعادة تعيين الملف الشخصي",
    signOutAction: "تسجيل الخروج",
    close: "إغلاق",
    newNote: "ملاحظة جديدة",
    deleteNote: "حذف الملاحظة",
    renameHint: "اضغط على علامة التبويب النشطة لإعادة تسميتها",
    untitledNote: "ملاحظة بدون عنوان",
    note: "ملاحظة",
    notesPlaceholder: "اكتب ملاحظاتك...",
    words: "كلمة",
    font: "الخط",
    focus: "تركيز",
    break: "استراحة",
    focusTimer: "مؤقت التركيز",
    chooseSession: "اختر جلسة.",
    minutes: "دقيقة",
    sessions: "جلسات",
    startFocus: "ابدأ التركيز",
    pause: "إيقاف مؤقت",
    resume: "متابعة",
    resetTimer: "إعادة ضبط",
    question: "السؤال",
    previous: "السابق",
    next: "التالي",
    finish: "إنهاء",
    feedbackOn: "التغذية الراجعة مفعّلة",
    feedbackOff: "التغذية الراجعة معطّلة",
    correct: "إجابة صحيحة",
    incorrect: "ليست صحيحة تمامًا",
    sessionComplete: "اكتملت الجلسة",
    perfectSession: "جلسة مثالية",
    strongPerformance: "أداء قوي",
    goodProgress: "تقدّم جيد",
    readyForReview: "جاهز للمراجعة",
    perfectDescription: "تمت الإجابة عن جميع الأسئلة بشكل صحيح.",
    strongDescription: "لديك فهم جيد لموضوعات هذه الجلسة.",
    progressDescription: "راجع الإجابات غير الصحيحة لتقوية المجالات الأضعف.",
    reviewDescription: "ستمنحك المراجعة المركزة أكبر فائدة تعليمية الآن.",
    answered: "تمت الإجابة",
    unanswered: "دون إجابة",
    incorrectCount: "إجابة خاطئة",
    resultsByTopic: "النتائج حسب الموضوع",
    resultsByTopicDescription: "اطّلع على المجالات التي تحتاج إلى مراجعة.",
    focusArea: "التركيز",
    nextStep: "الخطوة التالية",
    reviewAnswers: "مراجعة الإجابات",
    startNewSession: "ابدأ جلسة جديدة",
    reviewSession: "مراجعة الجلسة",
    toResults: "إلى النتائج",
    appearance: "المظهر",
    light: "فاتح",
    dark: "داكن",
    textSize: "حجم النص",
    questionText: "نص السؤال",
    small: "صغير",
    standard: "قياسي",
    large: "كبير",
    timerSound: "صوت المؤقت",
    timerSoundDescription: "صوت عند انتهاء الجلسة",
    mascotToggle: "إظهار د. بايت",
    mascotToggleDescription: "إظهار مساعد الفأر العائم في الزاوية",
    editOrder: "تعديل الترتيب",
    doneReorder: "تم",
    reorderHint: "اسحب الصناديق لتغيير ترتيبها",
    done: "تم",
    chooseLanguage: "اختر اللغة",
    languageDescription: "تظهر الواجهة والأسئلة كاملة بهذه اللغة.",
    resetProfileTitle: "إعادة تعيين الملف الشخصي؟",
    resetProfileDescription:
      "سيتم حذف الاسم والمستوى والوحدة. تبقى ملاحظاتك محفوظة.",
    cancel: "إلغاء",
    reset: "إعادة تعيين",
    currentModule: "الوحدة الحالية",
    repetition: "مراجعة",
    insights: "إحصاءات",
    comingSoon: "قريبًا",
    questionOf: (current, total) => `السؤال ${current} من ${total}`,
    correctOutOf: (correct, total) => `${correct} من ${total} صحيحة`,
    topicCorrect: (correct, total) => `${correct}/${total} صحيحة`,
    focusInstruction: (topic) =>
      `راجع ${topic} واقرأ تفسيرات الإجابات غير الصحيحة.`,
    noFocusInstruction:
      "ممتاز — يمكنك الانتقال إلى موضوع جديد أو إعادة الجلسة.",
    chooseSessionScope: "اختر الموضوع والمحاضرة",
    allTopics: "جميع الموضوعات",
    allLecturesInGroup: "جميع المحاضرات في هذا الموضوع",
    dueMode: "الأسئلة المستحقة",
    allMode: "جميع الأسئلة",
    lectureModeHint: "يتم ترتيب الأسئلة حسب أولوية المراجعة.",
    noQuestionsInLecture: "لا توجد أسئلة مرتبطة بعد.",
    newCard: "جديد",
    reviewCard: "مراجعة",
    dueCount: (count) => `${count} للمراجعة`,
    newCountLabel: (count) => `${count} جديدة`,
    noNewOrDue: "لا يوجد ما تتدرب عليه الآن",
    importQuestions: "استيراد الأسئلة",
    importTitle: "استيراد أسئلة جديدة",
    importDescription: "أدخل قائمة JSON بالأسئلة بنفس تنسيق البيانات الحالية.",
    importPlaceholder:
      '[ { "question": "...", "options": ["..."], "correct": 0 } ]',
    importSuccess: (count) => `${count} أسئلة تم استيرادها`,
    importError: "تعذّرت قراءة JSON. تحقق من التنسيق.",
    importModuleLabel: "ربط بالوحدة",
    importLectureLabel: "ربط بالمحاضرة (اختياري)",
    importButton: "استيراد",
    importCancel: "إلغاء",
    importUploadFile: "تحميل ملف JSON",
    importEmpty: "لم يتم العثور على أسئلة صالحة.",
    importIssuesTitle: (count) =>
      count === 1
        ? "تم العثور على مشكلة واحدة"
        : `تم العثور على ${count} مشاكل`,
    importPreviewTitle: (count) =>
      count === 1
        ? "سؤال واحد جاهز للاستيراد"
        : `${count} أسئلة جاهزة للاستيراد`,
    importDuplicateWarning: "قد يكون موجودًا بالفعل في البنك",
    importConfirmButton: (count) =>
      count === 1 ? "استيراد سؤال واحد" : `استيراد ${count} أسئلة`,
    adminPortal: "بوابة الإدارة",
    replayTutorial: "عرض الجولة التعريفية",
    adminGateTitle: "صلاحية المسؤول",
    adminGateDescription: "أدخل كلمة المرور لتعديل بنك الأسئلة.",
    adminPasscodePlaceholder: "كلمة المرور",
    adminUnlock: "فتح",
    adminWrongCode: "كلمة مرور غير صحيحة.",
    adminPanelTitle: "إدارة المحتوى",
    adminImportedList: "الأسئلة المستوردة",
    adminNoImported: "لا توجد أسئلة مستوردة بعد.",
    adminDelete: "حذف",
    adminTabImport: "استيراد",
    adminTabFlagged: "الأسئلة المُعلَّمة",
    adminFlaggedCount: "معلّم",
    adminNoFlagged: "لا توجد أسئلة معلّمة بعد.",
    adminFlaggedBy: "علّمه",
    adminFlaggedAt: "الوقت",
    adminFlaggedReason: "السبب",
    adminFlaggedResolve: "وضع علامة كمحلول",
    adminFlaggedDismiss: "رفض",
    adminFlaggedResolved: "تم الحل",
    adminFlaggedOpen: "مفتوح",
    flagQuestion: "علّم السؤال",
    flagQuestionTitle: "علّم هذا السؤال",
    flagQuestionDescription:
      "اشرح بإيجاز سبب عدم موافقتك على السؤال أو الإجابة أو التفسير.",
    flagQuestionPlaceholder: "صف المشكلة...",
    flagQuestionSubmit: "إرسال العلامة",
    flagQuestionCancel: "إلغاء",
    flagQuestionSuccess: "شكرًا! تم إرسال السؤال للمراجعة.",
    flagQuestionAlreadyFlagged: "لقد علّمت هذا السؤال من قبل.",
    adminLock: "قفل بوابة الإدارة",
    lectureMenu: "قائمة المحاضرة",
    viewQuestions: "عرض الأسئلة",
    resetProgress: "إعادة تعيين التقدم",
    resetProgressConfirmTitle: "إعادة تعيين التقدم لهذه المجموعة؟",
    resetProgressConfirmDescription:
      "سيتم إعادة تعيين جميع بيانات المراجعة المتباعدة لأسئلة هذه المحاضرة، بحيث تُحسب كجديدة مرة أخرى.",
    resetConfirm: "إعادة تعيين",
    resetDone: "تمت إعادة تعيين التقدم",
    questionListTitle: "الأسئلة في المحاضرة",
    noCardsInLecture: "لا توجد أسئلة في هذه المحاضرة بعد.",
    cardStatusNew: "جديد",
    cardStatusDue: "للمراجعة",
    cardStatusLearned: "مكتسب",
    addNewQuestion: "إنشاء سؤال جديد",
    editQuestion: "تعديل السؤال",
    newQuestionTitle: "سؤال جديد",
    questionFieldLabel: "السؤال",
    optionsFieldLabel: "خيارات الإجابة",
    correctFieldLabel: "الإجابة الصحيحة",
    explanationFieldLabel: "التفسير",
    categoryFieldLabel: "الفئة",
    saveQuestion: "حفظ",
    cancelEdit: "إلغاء",
    deleteQuestion: "حذف السؤال",
    confirmDeleteQuestion: "هل أنت متأكد من حذف هذا السؤال؟",
    addOption: "إضافة خيار",
    removeOption: "إزالة",
    closeList: "إغلاق القائمة",
    cardMenu: "قائمة البطاقة",
    buryCard: "إخفاء البطاقة",
    unburyCard: "إظهار البطاقة",
    resetThisCard: "إعادة تعيين هذه البطاقة",
    viewLectureList: "عرض أسئلة هذه المجموعة",
    cardBuried: "تم إخفاء البطاقة حتى الجلسة القادمة",
    cardReset: "تمت إعادة تعيين تقدم البطاقة",
    fullscreenEnter: "ملء الشاشة",
    fullscreenExit: "الخروج من ملء الشاشة",
    noBuriedCards: "لا توجد بطاقات مخفية",
    buriedCardsTitle: "البطاقات المخفية",
    examSetBlock: "تدريب على مجموعات الامتحان",
    examSetBlockText: "تدرّب على أسئلة الامتحانات السابقة لهذه الوحدة",
    lecturesBlock: "المحاضرات",
    lecturesBlockText: "راجع الأسئلة المرتبطة بالمحاضرات",
    startExamSet: "تدريب على مجموعة امتحان",
    startLectures: "بدء المحاضرات",
    todaysPlanTitle: "خطة اليوم",
    calendar: "التقويم",
    calendarTitle: "التقويم",
    calendarToday: "اليوم",
    calendarAddEvent: "حدث جديد",
    calendarEditEvent: "تعديل الحدث",
    calendarEventTitle: "العنوان",
    calendarEventTitlePlaceholder: "مثال: مراجعة فسيولوجيا الكلى",
    calendarEventDate: "التاريخ",
    calendarEventTime: "الوقت",
    calendarEventType: "النوع",
    calendarTypeExam: "امتحان",
    calendarTypeStudy: "جلسة دراسة",
    calendarTypeReview: "مراجعة",
    calendarTypeOther: "أخرى",
    calendarSave: "حفظ",
    calendarDelete: "حذف",
    calendarCancel: "إلغاء",
    calendarNoEvents: "لا توجد أحداث هذا اليوم",
    calendarUpcoming: "القادمة",
    calendarNoUpcoming: "لا توجد أحداث قادمة",
    calendarMon: "إثنين",
    calendarTue: "ثلاثاء",
    calendarWed: "أربعاء",
    calendarThu: "خميس",
    calendarFri: "جمعة",
    calendarSat: "سبت",
    calendarSun: "أحد",
    calendarViewDay: "يوم",
    calendarViewWeek: "أسبوع",
    calendarViewMonth: "شهر",
    calendarLecturesTitle: "المحاضرات",
    calendarNoLectures: "لا توجد محاضرات لهذه الوحدة.",
    calendarImportICal: "استيراد iCal",
    calendarICalEmpty: "لم يتم العثور على أحداث في الملف.",
    calendarICalError: "تعذّرت قراءة ملف iCal. تحقق من التنسيق.",
    todaysPlanExpandedTitle: "خطة اليوم",
  },
};

const MODULES = {
  da: {
    Bachelor: [
      "B1 Celler og væv",
      "B2 Bevægeapparatet",
      "B3 Molekylær medicin",
      "B4 Genetik",
      "B5 Kredsløb og respiration",
      "B6 Ernæring og vækst",
      "B7 Reproduktion og farmakodynamik",
      "B8 Homeostase",
      "B9 Hjerne og sanser",
      "B10 Angreb og forsvar",
      "B11 Bachelorprojektet",
      "B12 Fra rask til syg",
    ],
    Kandidat: [
      "K1 Hjerte, lunger og nyrer",
      "K2 Bevægeapparatet og bloddannende organer",
      "K3 Fordøjelseskanalen, ernæring og metabolisme",
      "K5 Nervesystem og psykiatri",
      "K6 Retsmedicin, nyrer, urinveje og kræft",
      "K8 Mor og barn",
      "K9 Hud, øjne, farmakologi og ældre",
      "K10 Forberedelse til KBU",
    ],
  },

  en: {
    Bachelor: [
      "B1 Cells and tissues",
      "B2 Musculoskeletal system",
      "B3 Molecular medicine",
      "B4 Genetics",
      "B5 Circulation and respiration",
      "B6 Nutrition and growth",
      "B7 Reproduction and pharmacodynamics",
      "B8 Homeostasis",
      "B9 Brain and senses",
      "B10 Infection and immunity",
      "B11 Bachelor project",
      "B12 From healthy to ill",
    ],
    Kandidat: [
      "K1 Heart, lungs and kidneys",
      "K2 Musculoskeletal and hematological systems",
      "K3 Gastrointestinal system, nutrition and metabolism",
      "K5 Neurology and psychiatry",
      "K6 Forensics, kidneys, urinary tract and cancer",
      "K8 Mother and child",
      "K9 Dermatology, ophthalmology, pharmacology and geriatrics",
      "K10 Preparation for internship",
    ],
  },

  ar: {
    Bachelor: [
      "B1 الخلايا والأنسجة",
      "B2 الجهاز العضلي الهيكلي",
      "B3 الطب الجزيئي",
      "B4 علم الوراثة",
      "B5 الدورة الدموية والتنفس",
      "B6 التغذية والنمو",
      "B7 التكاثر والديناميكا الدوائية",
      "B8 الاتزان الداخلي",
      "B9 الدماغ والحواس",
      "B10 العدوى والمناعة",
      "B11 مشروع البكالوريوس",
      "B12 من السليم إلى المريض",
    ],
    Kandidat: [
      "K1 القلب والرئتان والكليتان",
      "K2 الجهاز العضلي الهيكلي وأعضاء تكوين الدم",
      "K3 الجهاز الهضمي والتغذية والاستقلاب",
      "K5 الجهاز العصبي والطب النفسي",
      "K6 الطب الشرعي والكلى والمسالك البولية والسرطان",
      "K8 الأم والطفل",
      "K9 الجلد والعيون وعلم الأدوية وطب الشيخوخة",
      "K10 التحضير للتدريب السريري",
    ],
  },
};

/*
  Fremtidige importerede spørgsmål skal bruge samme format.
  Hvert tekstfelt kan have da, en og ar.
*/
const MODULE_LECTURES = {
  "K5 Nervesystem og psykiatri": [
    {
      group: "Neurologi",
      id: "N1",
      title: "Intro til neurologi. Neurologisk udfald",
      parts: 3,
    },
    { group: "Neurologi", id: "N2", title: "Myasteni" },
    { group: "Neurologi", id: "N3", title: "Hovedpine", parts: 2 },
    { group: "Neurologi", id: "N4", title: "Epilepsi", parts: 2 },
    { group: "Neurologi", id: "N5", title: "Neurofysiologi – EEG – EP" },
    { group: "Neurologi", id: "N6", title: "Perifer neuropati" },
    { group: "Neurologi", id: "N7", title: "Neurofysiologi ENG og EMG" },
    { group: "Neurologi", id: "N8", title: "Apopleksi", parts: 2 },
    { group: "Neurologi", id: "N9", title: "MND/ALS" },
    { group: "Neurologi", id: "N10", title: "Multipel sklerose", parts: 2 },
    { group: "Neurologi", id: "N11", title: "Bevægeforstyrrelser" },
    { group: "Neurologi", id: "N12", title: "Autoimmun encephalitis" },
    { group: "Neurologi", id: "N13", title: "Demens" },
    { group: "Neurokirurgi", id: "NK1", title: "Degenerative rygsygdomme" },
    { group: "Neurokirurgi", id: "NK2", title: "Forhøjet ICP" },
    { group: "Neurokirurgi", id: "NK3", title: "Kranietraume" },
    { group: "Neurokirurgi", id: "NK4", title: "Hydrocephalus" },
    {
      group: "Neurokirurgi",
      id: "NK5",
      title: "Apopleksi og ICP monitorering",
    },
    { group: "Neurokirurgi", id: "NK6", title: "Tumor cerebri" },
    { group: "Voksenpsykiatri", id: "VP1", title: "Intro, angst og OCD" },
    {
      group: "Voksenpsykiatri",
      id: "VP2",
      title: "Tilpasningsreaktioner og belastningsreaktioner PTSD",
    },
    { group: "Voksenpsykiatri", id: "VP3", title: "Demens, BPSD og delir" },
    { group: "Voksenpsykiatri", id: "VP4", title: "Den suicidale patient" },
    { group: "Voksenpsykiatri", id: "VP5", title: "Psykiatrilov" },
    { group: "Voksenpsykiatri", id: "VP6", title: "Affektive lidelser" },
    {
      group: "Voksenpsykiatri",
      id: "VP7",
      title: "Behandling af affektive lidelser",
    },
    { group: "Voksenpsykiatri", id: "VP8", title: "Skizofreni", parts: 2 },
    { group: "Voksenpsykiatri", id: "VP9", title: "Psykoser i øvrigt" },
    {
      group: "Voksenpsykiatri",
      id: "VP10",
      title: "Behandling af skizofreni og psykoser",
    },
    {
      group: "Voksenpsykiatri",
      id: "VP11",
      title: "Personlighedsforstyrrelser",
      parts: 2,
    },
    { group: "Voksenpsykiatri", id: "VP12", title: "Oligofreni" },
    { group: "Voksenpsykiatri", id: "VP13", title: "Alkoholmisbrug" },
    {
      group: "Voksenpsykiatri",
      id: "VP14",
      title: "Autisme, ADHD o.a. (voksne)",
      parts: 2,
    },
    { group: "Voksenpsykiatri", id: "VP15", title: "Stofmisbrug", parts: 2 },
    { group: "Ungepsykiatri", id: "UP1", title: "Intro børnepsykiatri" },
    {
      group: "Ungepsykiatri",
      id: "UP2",
      title: "Udviklingsforstyrrelser (generelle, specifikke)",
    },
    { group: "Ungepsykiatri", id: "UP3", title: "Autisme (børn)" },
    { group: "Ungepsykiatri", id: "UP4", title: "ADHD (børn)" },
    { group: "Ungepsykiatri", id: "UP5", title: "Spiseforstyrrelser" },
    {
      group: "Ungepsykiatri",
      id: "UP6",
      title: "Adfærd og følelsesmæssige forstyrrelser i barndom",
      parts: 2,
    },
    {
      group: "Ungepsykiatri",
      id: "UP7",
      title: "Tidlig psykopatologi (tilknytningsforstyrrelser)",
      parts: 2,
    },
    { group: "Ungepsykiatri", id: "UP8", title: "Funktionelle lidelser" },
    { group: "Ungepsykiatri", id: "UP9", title: "Affektive lidelser" },
    { group: "Ungepsykiatri", id: "UP10", title: "Psykose" },
    { group: "Ungepsykiatri", id: "UP11", title: "Selvskadende adfærd" },
  ],
};

const QUESTIONS = [
  {
    id: "renal-henle-001",
    moduleId: "K1 Hjerte, lunger og nyrer",
    lectureId: null,
    category: {
      da: "Nyrefysiologi",
      en: "Renal physiology",
      ar: "فسيولوجيا الكلى",
    },
    question: {
      da: "Hvilken funktion er mest karakteristisk for Henles slynge?",
      en: "Which function is most characteristic of the loop of Henle?",
      ar: "ما الوظيفة الأكثر تميزًا لعروة هنلي؟",
    },
    options: [
      {
        da: "Skaber en osmotisk gradient i nyremarven",
        en: "Creates an osmotic gradient in the renal medulla",
        ar: "تُنشئ تدرجًا أسموزيًا في لب الكلية",
      },
      {
        da: "Filtrerer erytrocytter fra blodet",
        en: "Filters erythrocytes from the blood",
        ar: "ترشّح كريات الدم الحمراء من الدم",
      },
      {
        da: "Producerer erytropoietin",
        en: "Produces erythropoietin",
        ar: "تنتج الإريثروبويتين",
      },
      {
        da: "Lagrer urin før vandladning",
        en: "Stores urine before urination",
        ar: "تخزّن البول قبل التبول",
      },
    ],
    correct: 0,
    explanation: {
      da: "Henles slynge skaber en osmotisk gradient i nyremarven via modstrømsmekanismen. Det gør nyrerne i stand til at koncentrere urinen.",
      en: "The loop of Henle creates an osmotic gradient in the renal medulla through the countercurrent mechanism. This enables the kidneys to concentrate urine.",
      ar: "تُنشئ عروة هنلي تدرجًا أسموزيًا في لب الكلية عبر آلية التيار المعاكس، مما يمكّن الكليتين من تركيز البول.",
    },
  },
  {
    id: "infection-cap-001",
    moduleId: "K6 Retsmedicin, nyrer, urinveje og kræft",
    lectureId: null,
    category: {
      da: "Infektion",
      en: "Infection",
      ar: "العدوى",
    },
    question: {
      da: "Hvad er den hyppigste bakterielle årsag til samfundserhvervet pneumoni hos voksne?",
      en: "What is the most common bacterial cause of community-acquired pneumonia in adults?",
      ar: "ما السبب البكتيري الأكثر شيوعًا للالتهاب الرئوي المكتسب من المجتمع لدى البالغين؟",
    },
    options: [
      {
        da: "Streptococcus pneumoniae",
        en: "Streptococcus pneumoniae",
        ar: "العقدية الرئوية",
      },
      {
        da: "Staphylococcus aureus",
        en: "Staphylococcus aureus",
        ar: "المكورات العنقودية الذهبية",
      },
      {
        da: "Pseudomonas aeruginosa",
        en: "Pseudomonas aeruginosa",
        ar: "الزائفة الزنجارية",
      },
      {
        da: "Mycobacterium tuberculosis",
        en: "Mycobacterium tuberculosis",
        ar: "المتفطرة السلية",
      },
    ],
    correct: 0,
    explanation: {
      da: "Streptococcus pneumoniae er den hyppigste klassiske bakterielle årsag til samfundserhvervet pneumoni hos voksne.",
      en: "Streptococcus pneumoniae is the most common classic bacterial cause of community-acquired pneumonia in adults.",
      ar: "تُعد العقدية الرئوية السبب البكتيري الكلاسيكي الأكثر شيوعًا للالتهاب الرئوي المكتسب من المجتمع لدى البالغين.",
    },
  },
  {
    id: "neuro-optic-001",
    moduleId: "K5 Nervesystem og psykiatri",
    lectureId: "N5",
    category: {
      da: "Neurologi",
      en: "Neurology",
      ar: "طب الأعصاب",
    },
    question: {
      da: "Hvilken kranienerve overfører visuel information fra retina til hjernen?",
      en: "Which cranial nerve carries visual information from the retina to the brain?",
      ar: "أي عصب قحفي ينقل المعلومات البصرية من الشبكية إلى الدماغ؟",
    },
    options: [
      {
        da: "Nervus olfactorius (I)",
        en: "Olfactory nerve (I)",
        ar: "العصب الشمي (الأول)",
      },
      {
        da: "Nervus opticus (II)",
        en: "Optic nerve (II)",
        ar: "العصب البصري (الثاني)",
      },
      {
        da: "Nervus oculomotorius (III)",
        en: "Oculomotor nerve (III)",
        ar: "العصب المحرك للعين (الثالث)",
      },
      {
        da: "Nervus trochlearis (IV)",
        en: "Trochlear nerve (IV)",
        ar: "العصب البكري (الرابع)",
      },
    ],
    correct: 1,
    explanation: {
      da: "Nervus opticus, kranienerve II, formidler visuel information fra retina til hjernen.",
      en: "The optic nerve, cranial nerve II, carries visual information from the retina to the brain.",
      ar: "ينقل العصب البصري، العصب القحفي الثاني، المعلومات البصرية من الشبكية إلى الدماغ.",
    },
  },
];

const LIGHT = {
  page: "#f5f7fb",
  panel: "#ffffff",
  panelAlt: "rgba(255,255,255,.72)",
  soft: "#f1f4f9",
  border: "#e7eaf1",
  borderStrong: "#d3d9e3",
  text: "#12151d",
  secondary: "#5c6577",
  muted: "#97a0b2",
  blue: "#1665ea",
  blueSoft: "#eaf2ff",
  blueBorder: "#b9d9ff",
  blueGradient: "linear-gradient(135deg,#1665ea,#4b93ff)",
  green: "#0e9a68",
  greenSoft: "#e9fbf3",
  greenBorder: "#a9ecd0",
  red: "#e0454f",
  redSoft: "#fff0f1",
  redBorder: "#f6bfc4",
  purple: "#7a63f0",
  purpleSoft: "#f1eeff",
  shadow: "0 14px 38px rgba(23,35,58,.09)",
  shadowLg: "0 24px 60px rgba(23,35,58,.14)",
  overlay: "rgba(13,20,34,.42)",
  ring: "rgba(22,101,234,.16)",
};

const DARK = {
  page: "#0d1015",
  panel: "#171b22",
  panelAlt: "rgba(23,27,34,.72)",
  soft: "#1e232b",
  border: "#2b3140",
  borderStrong: "#3a4152",
  text: "#f6f8fb",
  secondary: "#a6afc0",
  muted: "#727d90",
  blue: "#5aa8ff",
  blueSoft: "rgba(90,168,255,.16)",
  blueBorder: "rgba(90,168,255,.4)",
  blueGradient: "linear-gradient(135deg,#3d8bff,#6fb4ff)",
  green: "#3fd79a",
  greenSoft: "rgba(63,215,154,.14)",
  greenBorder: "rgba(63,215,154,.35)",
  red: "#ff7b85",
  redSoft: "rgba(255,123,133,.14)",
  redBorder: "rgba(255,123,133,.35)",
  purple: "#b0a2ff",
  purpleSoft: "rgba(176,162,255,.14)",
  shadow: "0 18px 48px rgba(0,0,0,.34)",
  shadowLg: "0 28px 70px rgba(0,0,0,.44)",
  overlay: "rgba(0,0,0,.68)",
  ring: "rgba(90,168,255,.22)",
};

/* ------------------------------------------------------------------------
   ECHARTS LOADER + WRAPPER
   Loader Apache ECharts fra CDN (ingen npm/build-step nødvendig) og
   eksponerer en lille React-wrapper-komponent, der initialiserer et
   ECharts-instrument i en <div>, holder det i sync med `option`-prop'en,
   og rydder korrekt op igen ved unmount.
   ------------------------------------------------------------------------ */
let echartsLoaderPromise = null;
function loadEchartsScript() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.echarts) return Promise.resolve(window.echarts);
  if (echartsLoaderPromise) return echartsLoaderPromise;
  echartsLoaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-echarts-cdn="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.echarts));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js";
    script.async = true;
    script.dataset.echartsCdn = "true";
    script.onload = () => resolve(window.echarts);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return echartsLoaderPromise;
}

function EChart({ option, height = 300 }) {
  const domRef = useRef(null);
  const chartRef = useRef(null);
  const [ready, setReady] = useState(
    Boolean(typeof window !== "undefined" && window.echarts)
  );

  useEffect(() => {
    let cancelled = false;
    loadEchartsScript().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !domRef.current || !window.echarts) return;
    chartRef.current = window.echarts.init(domRef.current);
    chartRef.current.setOption(option);
    const onResize = () => chartRef.current && chartRef.current.resize();
    window.addEventListener("resize", onResize);

    // Værktøjerne i sidebaren (notesbog, kalender, Dr. Byte) åbner paneler ved at ændre
    // bredden af den flex-container, grafen sidder i, uden at selve vinduet skifter
    // størrelse. ECharts fanger kun window "resize"-events som standard, så uden dette
    // observerer grafen ikke ændringen og bliver stående i den forkerte bredde/klippet.
    // En ResizeObserver på selve chart-elementet fanger også disse layout-skift.
    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        if (chartRef.current) chartRef.current.resize();
      });
      resizeObserver.observe(domRef.current);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (chartRef.current) {
        chartRef.current.dispose();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption(option, true);
    }
  }, [option]);

  if (!ready) {
    return (
      <div
        style={{
          width: "100%",
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 12,
        }}
      >
        Indlæser diagram...
      </div>
    );
  }

  return <div ref={domRef} style={{ width: "100%", height }} />;
}

/* ------------------------------------------------------------------------
   CUSTOM UGEKALENDER MED DRAG & DROP OG KLIK-OG-OPRET
   Schedule-X's drag-and-drop-plugin er flyttet til en betalt premium-pakke
   (@sx-premium/drag-and-drop) og kan derfor ikke bruges gratis via CDN uden
   licens. Denne komponent er en selvstændig, letvægts uge-/dagsvisning bygget
   direkte i React, der giver os fuld kontrol over:
   - Træk-og-slip af events mellem tidspunkter/dage (native HTML5 DnD)
   - Klik på en tom celle for at oprette et nyt event på det tidspunkt
   - Klik på et eksisterende event for at redigere det
   Den er visuelt stylet efter appens blå gradient-tema i stedet for at læne
   sig på et eksternt bibliotek.
   ------------------------------------------------------------------------ */
const CAL_HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00–21:00

function startOfWeek(date) {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function timeToMinutes(time) {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + (m || 0);
}

function minutesToTime(minutes) {
  const clamped = Math.max(0, Math.min(23 * 60 + 59, minutes));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function WeekCalendar({
  c,
  events,
  weekStart,
  daysCount = 7,
  onMoveEvent,
  onSlotClick,
  onEventClick,
  weekdayLabels,
}) {
  const days = Array.from({ length: daysCount }, (_, i) =>
    addDays(weekStart, i)
  );
  const [dragId, setDragId] = useState(null);
  const [hoverSlot, setHoverSlot] = useState(null);

  const eventsByDayAndTime = {};
  events.forEach((event) => {
    if (!eventsByDayAndTime[event.date]) eventsByDayAndTime[event.date] = [];
    eventsByDayAndTime[event.date].push(event);
  });

  const typeColor = {
    exam: c.red,
    study: c.blue,
    review: c.green,
    other: c.secondary,
  };

  function handleDrop(dayKeyStr, hour, event) {
    event.preventDefault();
    if (!dragId) return;
    const source = events.find((item) => item.id === dragId);
    if (!source) return;
    const newTime = minutesToTime(
      hour * 60 + (timeToMinutes(source.time) % 60 || 0)
    );
    onMoveEvent({
      ...source,
      date: dayKeyStr,
      time: source.time ? newTime : source.time,
    });
    setDragId(null);
    setHoverSlot(null);
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `56px repeat(${daysCount}, 1fr)`,
          position: "sticky",
          top: 0,
          zIndex: 2,
          background: c.panel,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div />
        {days.map((day, i) => {
          const key = dateKey(day.getFullYear(), day.getMonth(), day.getDate());
          const isToday =
            key ===
            dateKey(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            );
          return (
            <div
              key={key}
              style={{
                padding: "10px 6px",
                textAlign: "center",
                borderInlineStart: `1px solid ${c.border}`,
                background: isToday ? c.blueSoft : "transparent",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: c.muted,
                  textTransform: "uppercase",
                }}
              >
                {weekdayLabels[i]}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: isToday ? c.blue : c.text,
                  marginTop: 2,
                }}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `56px repeat(${daysCount}, 1fr)`,
          position: "relative",
        }}
      >
        {CAL_HOURS.map((hour) => (
          <React.Fragment key={hour}>
            <div
              style={{
                height: 52,
                textAlign: "end",
                paddingInlineEnd: 8,
                fontSize: 10,
                color: c.muted,
                fontWeight: 700,
                borderTop: `1px solid ${c.border}`,
                boxSizing: "border-box",
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
            {days.map((day) => {
              const key = dateKey(
                day.getFullYear(),
                day.getMonth(),
                day.getDate()
              );
              const slotId = `${key}-${hour}`;
              const isHovered = hoverSlot === slotId;
              const dayEvents = (eventsByDayAndTime[key] || []).filter(
                (event) => {
                  const mins = timeToMinutes(event.time);
                  return mins !== null && Math.floor(mins / 60) === hour;
                }
              );
              return (
                <div
                  key={slotId}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setHoverSlot(slotId);
                  }}
                  onDragLeave={() =>
                    setHoverSlot((prev) => (prev === slotId ? null : prev))
                  }
                  onDrop={(event) => handleDrop(key, hour, event)}
                  onClick={(event) => {
                    if (event.target === event.currentTarget)
                      onSlotClick(key, `${String(hour).padStart(2, "0")}:00`);
                  }}
                  style={{
                    position: "relative",
                    height: 52,
                    borderTop: `1px solid ${c.border}`,
                    borderInlineStart: `1px solid ${c.border}`,
                    background: isHovered ? c.blueSoft : "transparent",
                    cursor: "pointer",
                    transition: "background .1s ease",
                  }}
                >
                  {dayEvents.map((event) => {
                    const color = typeColor[event.type] || c.secondary;
                    return (
                      <div
                        key={event.id}
                        draggable
                        onDragStart={() => setDragId(event.id)}
                        onDragEnd={() => setDragId(null)}
                        onClick={(domEvent) => {
                          domEvent.stopPropagation();
                          onEventClick(event);
                        }}
                        title={event.title}
                        style={{
                          position: "absolute",
                          inset: "2px 3px",
                          borderRadius: 7,
                          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                          color: "#fff",
                          fontSize: 10.5,
                          fontWeight: 700,
                          padding: "3px 6px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "grab",
                          boxShadow: `0 3px 10px ${color}55`,
                          zIndex: 1,
                        }}
                      >
                        {event.time ? `${event.time} · ` : ""}
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
function MonthCalendar({
  c,
  events,
  monthDate,
  onDayClick,
  onEventClick,
  weekdayLabels,
}) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const cells = getMonthMatrix(year, month);
  const todayKeyStr = dateKey(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  const eventsByDate = {};
  events.forEach((event) => {
    if (!eventsByDate[event.date]) eventsByDate[event.date] = [];
    eventsByDate[event.date].push(event);
  });

  const typeColor = {
    exam: c.red,
    study: c.blue,
    review: c.green,
    other: c.secondary,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        {weekdayLabels.map((label) => (
          <div
            key={label}
            style={{
              padding: "10px 6px",
              textAlign: "center",
              fontSize: 10,
              fontWeight: 700,
              color: c.muted,
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gridAutoRows: "minmax(96px, 1fr)",
          flex: 1,
        }}
      >
        {cells.map((day, i) => {
          if (!day) {
            return (
              <div
                key={`empty-${i}`}
                style={{
                  borderTop: `1px solid ${c.border}`,
                  borderInlineStart: `1px solid ${c.border}`,
                  background: c.soft,
                }}
              />
            );
          }
          const key = dateKey(year, month, day);
          const isToday = key === todayKeyStr;
          const dayEvents = (eventsByDate[key] || []).sort((a, b) =>
            (a.time || "").localeCompare(b.time || "")
          );
          return (
            <div
              key={key}
              onClick={() => onDayClick(key)}
              style={{
                position: "relative",
                borderTop: `1px solid ${c.border}`,
                borderInlineStart: `1px solid ${c.border}`,
                padding: 6,
                cursor: "pointer",
                background: isToday ? c.blueSoft : "transparent",
                display: "flex",
                flexDirection: "column",
                gap: 3,
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: isToday ? c.blue : c.text,
                }}
              >
                {day}
              </span>
              {dayEvents.slice(0, 3).map((event) => {
                const color = typeColor[event.type] || c.secondary;
                return (
                  <div
                    key={event.id}
                    onClick={(domEvent) => {
                      domEvent.stopPropagation();
                      onEventClick(event);
                    }}
                    title={event.title}
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      color: "#fff",
                      background: color,
                      borderRadius: 5,
                      padding: "2px 5px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                    }}
                  >
                    {event.time ? `${event.time} ` : ""}
                    {event.title}
                  </div>
                );
              })}
              {dayEvents.length > 3 && (
                <span style={{ fontSize: 9, color: c.muted, fontWeight: 700 }}>
                  +{dayEvents.length - 3}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => loadStorage(key, fallback));
  const isFirstWrite = useRef(true);
  const skipNextDispatch = useRef(false);

  useEffect(() => {
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Notify every other useStoredState instance watching this same key (e.g. Settings
      // and the Dr. Byte chat panel both read STORAGE.aiSettings independently) so they
      // stay in sync without requiring a full remount. Skip the dispatch if this write was
      // itself caused by an incoming external-update event, to avoid an infinite ping-pong
      // between multiple components sharing the same storage key.
      if (skipNextDispatch.current) {
        skipNextDispatch.current = false;
      } else {
        window.dispatchEvent(
          new CustomEvent("medlearn-storage-update", { detail: { key } })
        );
      }
    } catch {
      // Ignorer browser storage-fejl.
    }
  }, [key, value]);

  useEffect(() => {
    function handleExternalUpdate(event) {
      if (event.detail && event.detail.key === key) {
        skipNextDispatch.current = true;
        setValue(loadStorage(key, fallback));
      }
    }
    window.addEventListener("medlearn-storage-update", handleExternalUpdate);
    return () =>
      window.removeEventListener(
        "medlearn-storage-update",
        handleExternalUpdate
      );
  }, [key]);

  return [value, setValue];
}

const CLOUD_SYNCED_KEYS = {
  [STORAGE.studyPlans]: { table: "study_plans", type: "keyed_object" },
  [STORAGE.calendarEvents]: { table: "calendar_events", type: "array_by_id" },
  [STORAGE.importedQuestions]: {
    table: "imported_questions",
    type: "array_by_id",
  },
};

// Henter alt data for den loggede-ind bruger fra Supabase, og skriver det
// ind i localStorage under de rette STORAGE-nøgler, så alle eksisterende
// useStoredState-instanser (StudyPlan, Dashboard, CalendarPanel osv.)
// automatisk opdaterer sig via det eksisterende "medlearn-storage-update"
// event - uden at deres kode skal ændres.
async function pullCloudDataIntoLocalStorage(userId) {
  try {
    const { data: plans } = await supabase
      .from("study_plans")
      .select("module_name, data")
      .eq("user_id", userId);
    const plansObject = {};
    (plans || []).forEach((row) => {
      plansObject[row.module_name] = row.data;
    });
    localStorage.setItem(STORAGE.studyPlans, JSON.stringify(plansObject));
    window.dispatchEvent(
      new CustomEvent("medlearn-storage-update", {
        detail: { key: STORAGE.studyPlans },
      })
    );

    const { data: events } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId);
    const eventsArray = (events || []).map((row) => ({
      id: row.id,
      title: row.title,
      date: row.date,
      time: row.time,
      type: row.type,
      planModuleId: row.plan_module_id,
      lectureCount: row.lecture_count,
      estimatedHours: row.estimated_hours,
    }));
    localStorage.setItem(STORAGE.calendarEvents, JSON.stringify(eventsArray));
    window.dispatchEvent(
      new CustomEvent("medlearn-storage-update", {
        detail: { key: STORAGE.calendarEvents },
      })
    );

    const { data: questions } = await supabase
      .from("imported_questions")
      .select("id, data")
      .eq("user_id", userId);
    const questionsArray = (questions || []).map((row) => row.data);
    localStorage.setItem(
      STORAGE.importedQuestions,
      JSON.stringify(questionsArray)
    );
    window.dispatchEvent(
      new CustomEvent("medlearn-storage-update", {
        detail: { key: STORAGE.importedQuestions },
      })
    );
  } catch {
    // Hvis hentning fra Supabase fejler (fx offline), fortsætter appen med
    // de lokale data, der allerede ligger i localStorage.
  }
}

// Skriver den aktuelle lokale tilstand for en given STORAGE-nøgle til den
// tilsvarende Supabase-tabel. Kaldes hver gang localStorage opdateres for
// en af de tre synkroniserede nøgler (studieplaner, kalenderevents,
// importerede spørgsmål), så cloud-data altid følger med.
async function pushLocalStorageKeyToCloud(key, userId) {
  const config = CLOUD_SYNCED_KEYS[key];
  if (!config || !userId) return;
  try {
    if (key === STORAGE.studyPlans) {
      const plansObject = loadStorage(STORAGE.studyPlans, {});
      const rows = Object.entries(plansObject).map(([moduleName, data]) => ({
        user_id: userId,
        module_name: moduleName,
        data,
        updated_at: new Date().toISOString(),
      }));
      if (rows.length > 0) {
        await supabase
          .from("study_plans")
          .upsert(rows, { onConflict: "user_id,module_name" });
      }
    } else if (key === STORAGE.calendarEvents) {
      const eventsArray = loadStorage(STORAGE.calendarEvents, []);
      const rows = eventsArray.map((event) => ({
        id: event.id,
        user_id: userId,
        title: event.title,
        date: event.date,
        time: event.time,
        type: event.type,
        plan_module_id: event.planModuleId || null,
        lecture_count: event.lectureCount || null,
        estimated_hours: event.estimatedHours || null,
      }));
      if (rows.length > 0) {
        await supabase
          .from("calendar_events")
          .upsert(rows, { onConflict: "id" });
      }
    } else if (key === STORAGE.importedQuestions) {
      const questionsArray = loadStorage(STORAGE.importedQuestions, []);
      const rows = questionsArray.map((question) => ({
        id: question.id,
        user_id: userId,
        data: question,
      }));
      if (rows.length > 0) {
        await supabase
          .from("imported_questions")
          .upsert(rows, { onConflict: "id" });
      }
    }
  } catch {
    // Cloud-skrivning fejlede (fx offline) - de lokale data er stadig
    // gemt korrekt i localStorage, og forsøges synkroniseret igen ved
    // næste ændring eller næste login.
  }
}

// Kobler skyen sammen med det eksisterende lokale storage-system: lytter
// efter "medlearn-storage-update" for de tre synkroniserede nøgler, og
// sender ændringen videre til Supabase i baggrunden.
function useCloudSync(userId) {
  useEffect(() => {
    if (!userId) return;
    pullCloudDataIntoLocalStorage(userId);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    function handleUpdate(event) {
      const key = event.detail && event.detail.key;
      if (key && CLOUD_SYNCED_KEYS[key]) {
        pushLocalStorageKeyToCloud(key, userId);
      }
    }
    window.addEventListener("medlearn-storage-update", handleUpdate);
    return () =>
      window.removeEventListener("medlearn-storage-update", handleUpdate);
  }, [userId]);
}

function translate(value, language, fallback = "da") {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value[language] || value[fallback] || value.en || "";
}

/*
  Brug denne funktion på spørgsmål, der importeres senere.
  Gamle spørgsmål med ren tekst får automatisk samme tekst som fallback
  på alle tre sprog, indtil rigtige oversættelser tilføjes.
*/
export function normalizeImportedQuestion(rawQuestion) {
  const id =
    rawQuestion.id ||
    `question-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  function localized(value) {
    if (typeof value === "string") {
      return { da: value, en: value, ar: value };
    }

    return value || { da: "", en: "", ar: "" };
  }

  return {
    id,
    moduleId: rawQuestion.moduleId || null,
    lectureId: rawQuestion.lectureId || null,
    category: localized(rawQuestion.category || "Ukategoriseret"),
    question: localized(rawQuestion.question || rawQuestion.text || ""),
    options: (rawQuestion.options || []).map(localized),
    correct: Number(rawQuestion.correct ?? 0),
    explanation: localized(rawQuestion.explanation || ""),
  };
}

/* =============================================================================
   LEGACY ANKI SM-2 SCHEDULER (app-51)
   ---------------------------------------------------------------------------
   Replaces the previous simplified scheduleCard()/isDue()/cardStatus() trio
   with a faithful legacy SuperMemo-2 implementation matching Anki's classic
   scheduler. Card shape is DEEPLY compatible with the old shape used across
   this file (dueDate, easeFactor, interval, repetitions) so every existing
   call site (buildQuestionPool, dashboards, Insights status pills, due
   counters) keeps working without modification, while gaining full state
   machine behaviour (new/learning/review/relearning/suspended), configurable
   deck settings, fuzz, leeches and a complete review log.
   ========================================================================== */

const SM2_DEFAULT_DECK_SETTINGS = Object.freeze({
  new: {
    learningStepsMinutes: [1, 10],
    graduatingIntervalDays: 1,
    easyIntervalDays: 4,
  },
  lapse: {
    relearningStepsMinutes: [10],
    minIntervalAfterLapseDays: 1,
    newIntervalPercent: 0,
    leechThreshold: 8,
    leechAction: "suspend",
  },
  review: {
    startingEase: 2.5,
    hardIntervalMultiplier: 1.2,
    easyBonus: 1.3,
    intervalModifier: 1.0,
    maximumIntervalDays: 36500,
  },
  fuzz: {
    enabled: true,
    learningStepMaxExtraMinutes: 5,
  },
});

const SM2_CARD_STATE = Object.freeze({
  NEW: "new",
  LEARNING: "learning",
  REVIEW: "review",
  RELEARNING: "relearning",
  SUSPENDED: "suspended",
});

const SM2_RATING = Object.freeze({ AGAIN: 1, HARD: 2, GOOD: 3, EASY: 4 });

const SM2_MIN_EASE = 1.3;
const SM2_MS_PER_MIN = 60 * 1000;
const SM2_MS_PER_DAY = 24 * 60 * SM2_MS_PER_MIN;

function sm2CreateNewCard(id, deckId = "default") {
  return {
    id,
    deckId,
    state: SM2_CARD_STATE.NEW,
    intervalDays: 0,
    ease: null,
    repsCorrectInARow: 0,
    lapses: 0,
    learningStepIndex: 0,
    relearningStepIndex: 0,
    due: null,
    lastReviewedAt: null,
    isLeech: false,
    reviewLog: [],
  };
}

function sm2SeededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
function sm2FuzzSeedFor(cardId, atMs) {
  let h = 0;
  const str = `${cardId}:${atMs}`;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}
function sm2FuzzRangeDays(intervalDays) {
  if (intervalDays < 2.5) return 0;
  if (intervalDays < 7) return 0.15 * intervalDays;
  if (intervalDays < 30) return Math.max(1, 0.1 * intervalDays);
  return Math.max(2, 0.05 * intervalDays);
}
function sm2ApplyFuzzDays(intervalDays, cardId, nowMs, maxIntervalDays) {
  const range = sm2FuzzRangeDays(intervalDays);
  if (range <= 0) return { fuzzedDays: Math.round(intervalDays) };
  const rnd = sm2SeededRandom(sm2FuzzSeedFor(cardId, nowMs))();
  const delta = Math.round((rnd * 2 - 1) * range);
  let fuzzed = Math.round(intervalDays) + delta;
  fuzzed = Math.max(1, Math.min(maxIntervalDays, fuzzed));
  return { fuzzedDays: fuzzed };
}
function sm2ApplyFuzzMinutes(minutes, seedKey, nowMs, maxExtraMinutes) {
  if (!maxExtraMinutes) return { fuzzedMinutes: minutes };
  const rnd = sm2SeededRandom(sm2FuzzSeedFor(seedKey, nowMs) + 1)();
  const extra = Math.round(rnd * maxExtraMinutes);
  return { fuzzedMinutes: minutes + extra };
}

function sm2FormatIntervalDa(ms) {
  const minutes = ms / SM2_MS_PER_MIN;
  if (minutes < 1) return "<1 min";
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} t`;
  const days = Math.round(ms / SM2_MS_PER_DAY);
  return days === 1 ? "1 dag" : `${days} dage`;
}

function sm2PreviewRating(card, settings, rating, nowMs = Date.now()) {
  return sm2ComputeOutcome(card, settings, rating, nowMs);
}

function sm2ApplyRating(card, settings, rating, nowMs = Date.now()) {
  const outcome = sm2ComputeOutcome(card, settings, rating, nowMs);
  const wasOverdue = card.due != null && nowMs > card.due;
  const logEntry = {
    timestamp: nowMs,
    stateBefore: card.state,
    rating,
    shownIntervalMs: outcome.delayMs,
    assignedIntervalDays: outcome.newIntervalDays ?? null,
    easeBefore: card.ease,
    easeAfter: outcome.newEase,
    wasOverdue,
  };
  return {
    ...card,
    state: outcome.newState,
    intervalDays: outcome.newIntervalDays ?? card.intervalDays,
    ease: outcome.newEase,
    repsCorrectInARow: outcome.repsCorrectInARow,
    lapses: outcome.newLapses,
    learningStepIndex: outcome.newLearningStepIndex,
    relearningStepIndex: outcome.newRelearningStepIndex,
    due: outcome.dueAt,
    lastReviewedAt: nowMs,
    isLeech: outcome.isLeech,
    reviewLog: [...(card.reviewLog || []), logEntry],
  };
}

function sm2ComputeOutcome(card, settings, rating, nowMs) {
  if (
    card.state === SM2_CARD_STATE.NEW ||
    card.state === SM2_CARD_STATE.LEARNING
  ) {
    return sm2ComputeLearningOutcome(card, settings, rating, nowMs);
  }
  if (card.state === SM2_CARD_STATE.RELEARNING) {
    return sm2ComputeRelearningOutcome(card, settings, rating, nowMs);
  }
  if (card.state === SM2_CARD_STATE.REVIEW) {
    return sm2ComputeReviewOutcome(card, settings, rating, nowMs);
  }
  throw new Error(`Cannot rate a suspended/unknown-state card: ${card.state}`);
}

function sm2ComputeLearningOutcome(card, settings, rating, nowMs) {
  const steps = settings.new.learningStepsMinutes;
  const stepIdx =
    card.state === SM2_CARD_STATE.NEW ? 0 : card.learningStepIndex;

  if (rating === SM2_RATING.EASY) {
    const days = settings.new.easyIntervalDays;
    const { fuzzedDays } = sm2ApplyFuzzDays(
      days,
      card.id,
      nowMs,
      settings.review.maximumIntervalDays
    );
    return {
      newState: SM2_CARD_STATE.REVIEW,
      newIntervalDays: fuzzedDays,
      newEase: card.ease ?? settings.review.startingEase,
      repsCorrectInARow: 1,
      newLapses: card.lapses,
      newLearningStepIndex: 0,
      newRelearningStepIndex: card.relearningStepIndex,
      dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
      isLeech: card.isLeech,
      delayMs: fuzzedDays * SM2_MS_PER_DAY,
    };
  }
  if (rating === SM2_RATING.AGAIN) {
    const delayMin = sm2MinutesWithFuzz(
      steps[0],
      card,
      settings,
      nowMs,
      "again0"
    );
    return {
      newState: SM2_CARD_STATE.LEARNING,
      newIntervalDays: 0,
      newEase: card.ease,
      repsCorrectInARow: 0,
      newLapses: card.lapses,
      newLearningStepIndex: 0,
      newRelearningStepIndex: card.relearningStepIndex,
      dueAt: nowMs + delayMin * SM2_MS_PER_MIN,
      isLeech: card.isLeech,
      delayMs: steps[0] * SM2_MS_PER_MIN,
    };
  }
  if (rating === SM2_RATING.HARD) {
    let nominalMin;
    if (steps.length === 1)
      nominalMin = Math.min(steps[0] * 1.5, steps[0] + 24 * 60);
    else if (stepIdx === 0) nominalMin = (steps[0] + steps[1]) / 2;
    else nominalMin = steps[stepIdx];
    const delayMin = sm2MinutesWithFuzz(
      nominalMin,
      card,
      settings,
      nowMs,
      "hard"
    );
    return {
      newState: SM2_CARD_STATE.LEARNING,
      newIntervalDays: 0,
      newEase: card.ease,
      repsCorrectInARow: 0,
      newLapses: card.lapses,
      newLearningStepIndex: stepIdx,
      newRelearningStepIndex: card.relearningStepIndex,
      dueAt: sm2CrossesDayBoundary(delayMin)
        ? sm2DayKeyFromNow(nowMs, Math.max(1, Math.round(delayMin / 1440)))
        : nowMs + delayMin * SM2_MS_PER_MIN,
      isLeech: card.isLeech,
      delayMs: nominalMin * SM2_MS_PER_MIN,
    };
  }
  const nextIdx = stepIdx + 1;
  if (nextIdx >= steps.length) {
    const days = settings.new.graduatingIntervalDays;
    const { fuzzedDays } = sm2ApplyFuzzDays(
      days,
      card.id,
      nowMs,
      settings.review.maximumIntervalDays
    );
    return {
      newState: SM2_CARD_STATE.REVIEW,
      newIntervalDays: fuzzedDays,
      newEase: card.ease ?? settings.review.startingEase,
      repsCorrectInARow: 1,
      newLapses: card.lapses,
      newLearningStepIndex: 0,
      newRelearningStepIndex: card.relearningStepIndex,
      dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
      isLeech: card.isLeech,
      delayMs: fuzzedDays * SM2_MS_PER_DAY,
    };
  }
  const nextStepMin = steps[nextIdx];
  const delayMin = sm2MinutesWithFuzz(
    nextStepMin,
    card,
    settings,
    nowMs,
    "good"
  );
  return {
    newState: SM2_CARD_STATE.LEARNING,
    newIntervalDays: 0,
    newEase: card.ease,
    repsCorrectInARow: 0,
    newLapses: card.lapses,
    newLearningStepIndex: nextIdx,
    newRelearningStepIndex: card.relearningStepIndex,
    dueAt: sm2CrossesDayBoundary(delayMin)
      ? sm2DayKeyFromNow(nowMs, Math.max(1, Math.round(delayMin / 1440)))
      : nowMs + delayMin * SM2_MS_PER_MIN,
    isLeech: card.isLeech,
    delayMs: nextStepMin * SM2_MS_PER_MIN,
  };
}

function sm2ComputeRelearningOutcome(card, settings, rating, nowMs) {
  const steps = settings.lapse.relearningStepsMinutes;
  const stepIdx = card.relearningStepIndex;
  if (rating === SM2_RATING.AGAIN) {
    const delayMin = sm2MinutesWithFuzz(
      steps[0],
      card,
      settings,
      nowMs,
      "relearn-again"
    );
    return {
      newState: SM2_CARD_STATE.RELEARNING,
      newIntervalDays: card.intervalDays,
      newEase: card.ease,
      repsCorrectInARow: 0,
      newLapses: card.lapses,
      newLearningStepIndex: card.learningStepIndex,
      newRelearningStepIndex: 0,
      dueAt: nowMs + delayMin * SM2_MS_PER_MIN,
      isLeech: card.isLeech,
      delayMs: steps[0] * SM2_MS_PER_MIN,
    };
  }
  if (rating === SM2_RATING.HARD) {
    const nominalMin = steps[stepIdx] ?? steps[steps.length - 1];
    const delayMin = sm2MinutesWithFuzz(
      nominalMin,
      card,
      settings,
      nowMs,
      "relearn-hard"
    );
    return {
      newState: SM2_CARD_STATE.RELEARNING,
      newIntervalDays: card.intervalDays,
      newEase: card.ease,
      repsCorrectInARow: 0,
      newLapses: card.lapses,
      newLearningStepIndex: card.learningStepIndex,
      newRelearningStepIndex: stepIdx,
      dueAt: nowMs + delayMin * SM2_MS_PER_MIN,
      isLeech: card.isLeech,
      delayMs: nominalMin * SM2_MS_PER_MIN,
    };
  }
  const days = card.intervalDays;
  const { fuzzedDays } = sm2ApplyFuzzDays(
    days,
    card.id,
    nowMs,
    settings.review.maximumIntervalDays
  );
  return {
    newState: SM2_CARD_STATE.REVIEW,
    newIntervalDays: fuzzedDays,
    newEase: card.ease,
    repsCorrectInARow: 1,
    newLapses: card.lapses,
    newLearningStepIndex: card.learningStepIndex,
    newRelearningStepIndex: 0,
    dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
    isLeech: card.isLeech,
    delayMs: fuzzedDays * SM2_MS_PER_DAY,
  };
}

function sm2ComputeReviewOutcome(card, settings, rating, nowMs) {
  const rs = settings.review;
  const prevInterval = card.intervalDays;
  const prevEase = card.ease ?? rs.startingEase;
  const maxDays = rs.maximumIntervalDays;

  if (rating === SM2_RATING.AGAIN) {
    const newEase = Math.max(SM2_MIN_EASE, prevEase - 0.2);
    const retainedDays = Math.max(
      settings.lapse.minIntervalAfterLapseDays,
      Math.round(prevInterval * (settings.lapse.newIntervalPercent / 100))
    );
    const cappedDays = Math.min(maxDays, retainedDays);
    const newLapses = card.lapses + 1;
    const hitLeech = newLapses >= settings.lapse.leechThreshold;
    if (hitLeech && settings.lapse.leechAction === "suspend") {
      return {
        newState: SM2_CARD_STATE.SUSPENDED,
        newIntervalDays: cappedDays,
        newEase,
        repsCorrectInARow: 0,
        newLapses,
        newLearningStepIndex: card.learningStepIndex,
        newRelearningStepIndex: 0,
        dueAt: card.due,
        isLeech: true,
        delayMs: null,
      };
    }
    const relearnSteps = settings.lapse.relearningStepsMinutes;
    if (relearnSteps && relearnSteps.length > 0) {
      const delayMin = sm2MinutesWithFuzz(
        relearnSteps[0],
        card,
        settings,
        nowMs,
        "lapse-relearn"
      );
      return {
        newState: SM2_CARD_STATE.RELEARNING,
        newIntervalDays: cappedDays,
        newEase,
        repsCorrectInARow: 0,
        newLapses,
        newLearningStepIndex: card.learningStepIndex,
        newRelearningStepIndex: 0,
        dueAt: nowMs + delayMin * SM2_MS_PER_MIN,
        isLeech: hitLeech,
        delayMs: relearnSteps[0] * SM2_MS_PER_MIN,
      };
    }
    const { fuzzedDays } = sm2ApplyFuzzDays(
      cappedDays,
      card.id,
      nowMs,
      maxDays
    );
    return {
      newState: SM2_CARD_STATE.REVIEW,
      newIntervalDays: fuzzedDays,
      newEase,
      repsCorrectInARow: 0,
      newLapses,
      newLearningStepIndex: card.learningStepIndex,
      newRelearningStepIndex: 0,
      dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
      isLeech: hitLeech,
      delayMs: fuzzedDays * SM2_MS_PER_DAY,
    };
  }

  if (rating === SM2_RATING.HARD) {
    const newEase = Math.max(SM2_MIN_EASE, prevEase - 0.15);
    const candidate = Math.min(
      maxDays,
      prevInterval * rs.hardIntervalMultiplier * rs.intervalModifier
    );
    const { fuzzedDays } = sm2ApplyFuzzDays(candidate, card.id, nowMs, maxDays);
    return {
      newState: SM2_CARD_STATE.REVIEW,
      newIntervalDays: fuzzedDays,
      newEase,
      repsCorrectInARow: card.repsCorrectInARow + 1,
      newLapses: card.lapses,
      newLearningStepIndex: card.learningStepIndex,
      newRelearningStepIndex: 0,
      dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
      isLeech: card.isLeech,
      delayMs: fuzzedDays * SM2_MS_PER_DAY,
    };
  }

  if (rating === SM2_RATING.GOOD) {
    let candidate = Math.min(
      maxDays,
      prevInterval * prevEase * rs.intervalModifier
    );
    if (candidate <= prevInterval && maxDays > prevInterval)
      candidate = Math.min(maxDays, prevInterval + 1);
    const { fuzzedDays } = sm2ApplyFuzzDays(candidate, card.id, nowMs, maxDays);
    return {
      newState: SM2_CARD_STATE.REVIEW,
      newIntervalDays: fuzzedDays,
      newEase: prevEase,
      repsCorrectInARow: card.repsCorrectInARow + 1,
      newLapses: card.lapses,
      newLearningStepIndex: card.learningStepIndex,
      newRelearningStepIndex: 0,
      dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
      isLeech: card.isLeech,
      delayMs: fuzzedDays * SM2_MS_PER_DAY,
    };
  }

  const newEase = prevEase + 0.15;
  const candidate = Math.min(
    maxDays,
    prevInterval * prevEase * rs.easyBonus * rs.intervalModifier
  );
  const { fuzzedDays } = sm2ApplyFuzzDays(candidate, card.id, nowMs, maxDays);
  return {
    newState: SM2_CARD_STATE.REVIEW,
    newIntervalDays: fuzzedDays,
    newEase,
    repsCorrectInARow: card.repsCorrectInARow + 1,
    newLapses: card.lapses,
    newLearningStepIndex: card.learningStepIndex,
    newRelearningStepIndex: 0,
    dueAt: sm2DayKeyFromNow(nowMs, fuzzedDays),
    isLeech: card.isLeech,
    delayMs: fuzzedDays * SM2_MS_PER_DAY,
  };
}

function sm2MinutesWithFuzz(nominalMin, card, settings, nowMs, tag) {
  if (!settings.fuzz.enabled) return nominalMin;
  const { fuzzedMinutes } = sm2ApplyFuzzMinutes(
    nominalMin,
    `${card.id}:${tag}`,
    nowMs,
    settings.fuzz.learningStepMaxExtraMinutes
  );
  return fuzzedMinutes;
}
function sm2CrossesDayBoundary(delayMin) {
  return delayMin >= 1440;
}
function sm2DayKeyFromNow(nowMs, days) {
  const d = new Date(nowMs);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/* ---------------------------------------------------------------------------
   Compatibility bridge: converts between the OLD simple card shape
   ({ interval, easeFactor, repetitions, dueDate, lastResult }), which every
   existing call site in this file still reads (buildQuestionPool, Insights
   status pills, dashboard due-counters, sidebar counters), and the NEW
   SM-2 card shape ({ state, intervalDays, ease, due, ... }). We store the
   FULL SM-2 shape as the source of truth (under card.sm2), and mirror the
   fields old code expects at the top level so nothing else in the file has
   to change.
   ------------------------------------------------------------------------ */

function sm2ToLegacyShape(sm2Card) {
  const dueDate =
    sm2Card.due != null ? new Date(sm2Card.due).toISOString() : null;
  return {
    interval: sm2Card.intervalDays,
    easeFactor: sm2Card.ease ?? SM2_DEFAULT_DECK_SETTINGS.review.startingEase,
    repetitions: sm2Card.repsCorrectInARow,
    dueDate,
    lastResult:
      sm2Card.state !== SM2_CARD_STATE.RELEARNING && sm2Card.lapses === 0
        ? true
        : sm2Card.reviewLog.length
        ? sm2Card.reviewLog[sm2Card.reviewLog.length - 1].rating !==
          SM2_RATING.AGAIN
        : true,
    sm2: sm2Card,
  };
}

function sm2FromLegacyOrFresh(legacyOrSm2Card, questionId) {
  if (legacyOrSm2Card && legacyOrSm2Card.sm2 && legacyOrSm2Card.sm2.state) {
    return legacyOrSm2Card.sm2;
  }
  if (legacyOrSm2Card && legacyOrSm2Card.state) {
    return legacyOrSm2Card;
  }
  return sm2CreateNewCard(questionId);
}

function scheduleCardSM2(
  storedCard,
  rating,
  questionId,
  deckSettings = SM2_DEFAULT_DECK_SETTINGS,
  nowMs = Date.now()
) {
  const sm2Card = sm2FromLegacyOrFresh(storedCard, questionId);
  const updatedSm2 = sm2ApplyRating(sm2Card, deckSettings, rating, nowMs);
  return sm2ToLegacyShape(updatedSm2);
}

function previewCardSM2(
  storedCard,
  rating,
  questionId,
  deckSettings = SM2_DEFAULT_DECK_SETTINGS,
  nowMs = Date.now()
) {
  const sm2Card = sm2FromLegacyOrFresh(storedCard, questionId);
  return sm2PreviewRating(sm2Card, deckSettings, rating, nowMs);
}

function isDue(card) {
  if (!card) return true;
  const sm2Card = sm2FromLegacyOrFresh(card, card.id || "unknown");
  if (sm2Card.state === SM2_CARD_STATE.SUSPENDED) return false;
  if (!card.dueDate) return true;
  return new Date(card.dueDate).getTime() <= Date.now();
}

function cardStatus(card) {
  if (!card) return "new";
  const sm2Card = card.sm2;
  if (sm2Card) {
    if (sm2Card.state === SM2_CARD_STATE.SUSPENDED) return "suspended";
    if (sm2Card.state === SM2_CARD_STATE.RELEARNING) return "relearning";
    if (sm2Card.state === SM2_CARD_STATE.LEARNING) return "learning";
  }
  if (isDue(card)) return "due";
  return "learned";
}

/* =============================================================================
   SM2AnswerFooter — the four-button Igen/Svær/God/Nem answer area (app-51)
   ---------------------------------------------------------------------------
   Renders once the correct answer + explanation are revealed, replacing the
   plain Previous/Next footer for that moment. Shows live, scheduler-computed
   intervals on every button, handles keyboard shortcuts (1-4, Enter/space),
   defaults to "Igen" when the user picked wrong (without locking self-rating),
   warns before a leech-triggering "Igen", and commits atomically so double
   clicks / retries never double-apply a review.
   ========================================================================== */

const SM2_RATING_ORDER = [
  {
    key: SM2_RATING.AGAIN,
    label: "Igen",
    hint: "Igen = forkert",
    shortcut: "1",
    icon: "\u21ba",
  },
  {
    key: SM2_RATING.HARD,
    label: "Svær",
    hint: "Svær = korrekt med stor tøven",
    shortcut: "2",
    icon: "\u2248",
  },
  {
    key: SM2_RATING.GOOD,
    label: "God",
    hint: "God = korrekt",
    shortcut: "3",
    icon: "\u2713",
  },
  {
    key: SM2_RATING.EASY,
    label: "Nem",
    hint: "Nem = umiddelbart korrekt",
    shortcut: "4",
    icon: "\u2713\u2713",
  },
];

function sm2RatingVisual(c, key) {
  const accent = sm2AccentFor(c, key);
  const tones = {
    [SM2_RATING.AGAIN]: { surface: c.redSoft, label: "Forkert", icon: "↻" },
    [SM2_RATING.HARD]: { surface: c.soft, label: "Tøvende", icon: "≈" },
    [SM2_RATING.GOOD]: { surface: c.greenSoft, label: "Korrekt", icon: "✓" },
    [SM2_RATING.EASY]: { surface: c.blueSoft, label: "Let", icon: "✦" },
  };
  return { ...accent, ...tones[key] };
}

function sm2AccentFor(c, key) {
  switch (key) {
    case SM2_RATING.AGAIN:
      return {
        border: `2px solid ${c.red}`,
        iconBg: c.redSoft,
        iconColor: c.red,
      };
    case SM2_RATING.HARD:
      return {
        border: `2px dashed ${c.borderStrong}`,
        iconBg: c.soft,
        iconColor: c.secondary,
      };
    case SM2_RATING.GOOD:
      return {
        border: `2px solid ${c.green}`,
        iconBg: c.greenSoft,
        iconColor: c.green,
      };
    case SM2_RATING.EASY:
      return {
        border: `2px solid ${c.blue}`,
        iconBg: c.blueSoft,
        iconColor: c.blue,
      };
    default:
      return {
        border: `1px solid ${c.border}`,
        iconBg: c.soft,
        iconColor: c.secondary,
      };
  }
}

function sm2MakeIdempotencyKey(cardId, nowMs) {
  return `${cardId}:${nowMs}:${Math.random().toString(36).slice(2, 8)}`;
}

function SM2AnswerFooter({
  c,
  questionId,
  spacedData,
  setSpacedData,
  wrongChoiceSelected,
  deckSettings,
  onRated,
}) {
  const settings = deckSettings || SM2_DEFAULT_DECK_SETTINGS;
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  const inFlightRef = useRef(false);
  const idemKeyRef = useRef(sm2MakeIdempotencyKey(questionId, Date.now()));
  const nowMsRef = useRef(Date.now());

  const storedCard = (spacedData && spacedData[questionId]) || null;

  useEffect(() => {
    nowMsRef.current = Date.now();
    idemKeyRef.current = sm2MakeIdempotencyKey(questionId, nowMsRef.current);
    setSelected(null);
    setSubmitting(false);
    setError(null);
    inFlightRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const previews = {};
  SM2_RATING_ORDER.forEach((r) => {
    previews[r.key] = previewCardSM2(
      storedCard,
      r.key,
      questionId,
      settings,
      nowMsRef.current
    );
  });

  const suggestedDefault = wrongChoiceSelected
    ? SM2_RATING.AGAIN
    : SM2_RATING.GOOD;
  const willBecomeLeech = !!(
    previews[SM2_RATING.AGAIN] && previews[SM2_RATING.AGAIN].isLeech
  );

  useEffect(() => {
    function onKeyDown(e) {
      if (submitting) return;
      const map = {
        1: SM2_RATING.AGAIN,
        2: SM2_RATING.HARD,
        3: SM2_RATING.GOOD,
        4: SM2_RATING.EASY,
      };
      if (map[e.key] != null) {
        e.preventDefault();
        handleSelect(map[e.key]);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect(SM2_RATING.GOOD);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting, storedCard, settings, questionId]);

  function handleSelect(rating) {
    if (submitting || inFlightRef.current) return;
    inFlightRef.current = true;
    setSubmitting(true);
    setSelected(rating);
    setError(null);
    try {
      const nowMs = nowMsRef.current;
      const updated = scheduleCardSM2(
        storedCard,
        rating,
        questionId,
        settings,
        nowMs
      );
      // Persist before navigation: a second click, reload, or retry can never create a second review.
      const persisted = { ...(spacedData || {}), [questionId]: updated };
      localStorage.setItem(STORAGE.spacedRepetition, JSON.stringify(persisted));
      window.dispatchEvent(
        new CustomEvent("medlearn-storage-update", {
          detail: { key: STORAGE.spacedRepetition },
        })
      );
      setSpacedData(persisted);
      onRated(updated, rating);
    } catch (err) {
      setSubmitting(false);
      setSelected(null);
      inFlightRef.current = false;
      setError("Kunne ikke gemme vurderingen. Prøv igen.");
      // eslint-disable-next-line no-console
      console.error("scheduleCardSM2 failed", err);
    }
  }

  return (
    <div
      role="group"
      aria-label="Vurdér dit svar"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {willBecomeLeech && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 10,
            background: c.redSoft,
            border: `1px solid ${c.red}55`,
            color: c.red,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span aria-hidden="true">⚠️</span>
          <span>
            Dette kort når leech-tærsklen ved Igen — det bliver markeret og
            suspenderet.
          </span>
        </div>
      )}
      {error && (
        <div
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 10px",
            borderRadius: 10,
            background: c.redSoft,
            border: `1px solid ${c.red}55`,
            color: c.red,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span aria-hidden="true">⚠️</span>
          <span style={{ flex: 1 }}>{error}</span>
          <button
            type="button"
            onClick={() => selected != null && handleSelect(selected)}
            style={{
              fontWeight: 800,
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: c.red,
            }}
          >
            Prøv igen
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
        }}
      >
        {SM2_RATING_ORDER.map((r) => {
          const accent = sm2RatingVisual(c, r.key);
          const preview = previews[r.key];
          const isDefault = r.key === suggestedDefault;
          const isSelected = selected === r.key;
          return (
            <button
              key={r.key}
              type="button"
              disabled={submitting}
              onClick={() => handleSelect(r.key)}
              aria-keyshortcuts={r.shortcut}
              aria-pressed={isSelected}
              aria-label={`${r.label}, ${
                preview ? sm2FormatIntervalDa(preview.delayMs || 0) : ""
              }. ${r.hint}`}
              title={r.hint}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "space-between",
                gap: 8,
                minHeight: 70,
                padding: "10px",
                borderRadius: 11,
                border: `1px solid ${
                  isSelected || isDefault ? c.blueBorder : c.border
                }`,
                background: isSelected || isDefault ? c.blueSoft : c.panel,
                cursor: submitting ? "default" : "pointer",
                opacity: submitting && !isSelected ? 0.45 : 1,
                boxShadow: isSelected ? `0 0 0 2px ${c.ring}` : "none",
                transform: "none",
                transition: "border-color 120ms ease, background 120ms ease",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 0,
                    fontSize: 12,
                    fontWeight: 800,
                    color: c.text,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-grid",
                      placeItems: "center",
                      width: 22,
                      height: 22,
                      flexShrink: 0,
                      borderRadius: 7,
                      fontSize: 12,
                      background: c.blueSoft,
                      color: c.blue,
                      border: `1px solid ${c.blueBorder}`,
                    }}
                  >
                    {accent.icon}
                  </span>
                  <span>{r.label}</span>
                </span>
                <kbd
                  style={{
                    minWidth: 18,
                    padding: "2px 4px",
                    borderRadius: 5,
                    border: `1px solid ${c.border}`,
                    color: c.secondary,
                    background: c.panel,
                    fontSize: 9,
                    fontFamily: "inherit",
                    fontWeight: 800,
                    textAlign: "center",
                  }}
                >
                  {r.shortcut}
                </kbd>
              </span>
              <span
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 850,
                    letterSpacing: "-.01em",
                    color: c.blue,
                  }}
                >
                  {preview ? sm2FormatIntervalDa(preview.delayMs || 0) : "…"}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: 99,
                    background: c.blue,
                    opacity: isDefault ? 1 : 0.32,
                  }}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function applyOverrides(list, overrides) {
  if (!overrides) return list;
  return list
    .filter((q) => !(overrides[q.id] && overrides[q.id].deleted))
    .map((q) =>
      overrides[q.id] && overrides[q.id].fields
        ? { ...q, ...overrides[q.id].fields }
        : q
    );
}

function getFullQuestionBank(extraQuestions, overrides) {
  const base =
    extraQuestions && extraQuestions.length
      ? [...QUESTIONS, ...extraQuestions]
      : QUESTIONS;
  return applyOverrides(base, overrides);
}

function updateLocalizedField(original, language, newValue) {
  const base = original || { da: "", en: "", ar: "" };
  return { ...base, [language]: newValue };
}

function buildFixedBuckets(points, bucketCount) {
  if (!Array.isArray(points) || points.length === 0 || bucketCount <= 0)
    return [];
  const sorted = [...points].sort(
    (a, b) => (a.time ?? a.date ?? 0) - (b.time ?? b.date ?? 0)
  );
  const first = sorted[0].time ?? sorted[0].date;
  const last = sorted[sorted.length - 1].time ?? sorted[sorted.length - 1].date;
  if (first === undefined || last === undefined || first === last) {
    return sorted.map((p, idx) => ({
      ...p,
      bucketIndex: idx,
      bucketFraction: sorted.length <= 1 ? 0.5 : idx / (sorted.length - 1),
    }));
  }
  const span = last - first;
  const buckets = [];
  for (let i = 0; i < bucketCount; i++) {
    const fraction = bucketCount === 1 ? 0.5 : i / (bucketCount - 1);
    const pivot = first + fraction * span;
    let closest = sorted[0];
    let best = Math.abs((closest.time ?? closest.date) - pivot);
    for (let j = 1; j < sorted.length; j++) {
      const t = sorted[j].time ?? sorted[j].date;
      const d = Math.abs(t - pivot);
      if (d < best) {
        best = d;
        closest = sorted[j];
      }
    }
    buckets.push({ ...closest, bucketIndex: i, bucketFraction: fraction });
  }
  return buckets;
}

function formatXAxisLabel(point, range) {
  const value = point.time ?? point.date;
  if (!value) return "";
  const d = new Date(value);
  if (range === "1d") {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString();
}

function sm2StartOfTomorrow(nowMs = Date.now()) {
  const tomorrow = new Date(nowMs);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime();
}

function sm2CardDueMs(card) {
  if (!card) return null;
  const sm2 = sm2FromLegacyOrFresh(card, card.id || "unknown");
  return sm2.due ?? (card.dueDate ? new Date(card.dueDate).getTime() : null);
}

// A card remains in the active MCQ session until it is deliberately scheduled
// for tomorrow or later. This is independent from whether a short step is due now.
function sm2IsInTodayQueue(card, nowMs = Date.now()) {
  if (!card) return true;
  const sm2 = sm2FromLegacyOrFresh(card, card.id || "unknown");
  if (sm2.state === SM2_CARD_STATE.SUSPENDED) return false;
  const dueMs = sm2CardDueMs(card);
  return dueMs == null || dueMs < sm2StartOfTomorrow(nowMs);
}

function sm2NextPendingTodayIndex(
  pool,
  spacedData,
  currentIndex,
  nowMs = Date.now()
) {
  return (
    pool
      .map((question, index) => ({
        question,
        index,
        card: spacedData?.[question.id],
      }))
      .filter(
        ({ index, card }) =>
          index !== currentIndex && sm2IsInTodayQueue(card, nowMs)
      )
      .sort((a, b) => {
        const aDue = sm2CardDueMs(a.card) ?? nowMs;
        const bDue = sm2CardDueMs(b.card) ?? nowMs;
        return aDue - bDue || a.index - b.index;
      })[0]?.index ?? null
  );
}

function sm2QueuePriority(card) {
  const state = sm2FromLegacyOrFresh(card, card?.id || "unknown").state;
  if (state === SM2_CARD_STATE.LEARNING || state === SM2_CARD_STATE.RELEARNING)
    return 0;
  if (state === SM2_CARD_STATE.REVIEW) return 1;
  return 2;
}

function sm2NextDueQuestionIndex(
  pool,
  spacedData,
  answered,
  currentIndex,
  nowMs = Date.now()
) {
  const due = pool
    .map((question, index) => ({
      question,
      index,
      card: spacedData?.[question.id],
    }))
    .filter(({ index, card }) => index !== currentIndex && isDue(card))
    .sort((a, b) => {
      const priority = sm2QueuePriority(a.card) - sm2QueuePriority(b.card);
      if (priority) return priority;
      const aDue =
        a.card?.sm2?.due ??
        (a.card?.dueDate ? new Date(a.card.dueDate).getTime() : 0);
      const bDue =
        b.card?.sm2?.due ??
        (b.card?.dueDate ? new Date(b.card.dueDate).getTime() : 0);
      return aDue - bDue || a.index - b.index;
    });
  if (due.length) return due[0].index;
  const unseen = pool.findIndex(
    (question, index) =>
      index !== currentIndex && answered[question.id] === undefined
  );
  return unseen >= 0 ? unseen : null;
}

function buildQuestionPool(
  scope,
  spacedData,
  extraQuestions,
  overrides,
  buried
) {
  const allQuestions = getFullQuestionBank(extraQuestions, overrides).filter(
    (q) => !(buried && buried[q.id])
  );
  if (!scope) return allQuestions;
  const { moduleId, groupFilter, lectureFilter, mode, contentType } = scope;
  let pool = allQuestions.filter((q) => q.moduleId === moduleId);

  if (contentType === "examSet") {
    pool = pool.filter((q) => !q.lectureId);
  } else if (contentType === "lectures") {
    pool = pool.filter((q) => Boolean(q.lectureId));
  }

  if (lectureFilter) {
    pool = pool.filter((q) => q.lectureId === lectureFilter);
  } else if (groupFilter) {
    const idsInGroup = (MODULE_LECTURES[moduleId] || [])
      .filter((l) => l.group === groupFilter)
      .map((l) => l.id);
    pool = pool.filter((q) => idsInGroup.includes(q.lectureId));
  }

  if (pool.length === 0 && !contentType)
    pool = allQuestions.filter((q) => q.moduleId === moduleId);
  if (pool.length === 0 && !contentType) pool = allQuestions;

  // Keep same-day learning/relearning steps in this active MCQ queue even while
  // their precise minute due time is pending. A card leaves only when its planned
  // due time is tomorrow or later; it then returns on that due day.
  pool = pool.filter((q) => sm2IsInTodayQueue(spacedData[q.id]));

  if (mode === "due") {
    // Minute learning steps are part of today's active queue; future day reviews are not.
    const duePool = pool.filter((q) => {
      const card = spacedData[q.id];
      const state = sm2FromLegacyOrFresh(card, q.id).state;
      return (
        state === SM2_CARD_STATE.LEARNING ||
        state === SM2_CARD_STATE.RELEARNING ||
        isDue(card)
      );
    });
    // "Kun due" must be genuinely empty when no cards are due; do not silently
    // switch to a different set. The user can choose "Alle" for new cards.
    pool = duePool;
  }

  return pool
    .map((q) => ({
      q,
      due:
        spacedData[q.id] && spacedData[q.id].dueDate
          ? new Date(spacedData[q.id].dueDate).getTime()
          : 0,
    }))
    .sort(
      (a, b) =>
        sm2QueuePriority(spacedData[a.q.id]) -
          sm2QueuePriority(spacedData[b.q.id]) || a.due - b.due
    )
    .map((item) => item.q);
}

const DR_BYTE_STOPWORDS = {
  da: new Set([
    "og",
    "i",
    "jeg",
    "det",
    "at",
    "en",
    "den",
    "til",
    "er",
    "som",
    "på",
    "de",
    "med",
    "han",
    "af",
    "for",
    "ikke",
    "der",
    "var",
    "mig",
    "sig",
    "men",
    "et",
    "har",
    "om",
    "vi",
    "min",
    "havde",
    "ham",
    "hun",
    "nu",
    "over",
    "da",
    "fra",
    "du",
    "ud",
    "sin",
    "dem",
    "os",
    "op",
    "man",
    "hans",
    "hvor",
    "eller",
    "hvad",
    "skal",
    "selv",
    "her",
    "alle",
    "vil",
    "blev",
    "kunne",
    "ind",
    "end",
    "kan",
    "denne",
    "dette",
    "disse",
    "hvilken",
    "hvilket",
    "hvilke",
    "kunne",
    "gerne",
    "være",
    "hvordan",
    "hvorfor",
    "hvornår",
    "spørgsmål",
    "spørgsmåler",
    "spørg",
    "find",
    "findes",
    "viser",
    "vis",
    "vise",
    "noget",
    "nogen",
    "meget",
    "mere",
    "mest",
    // Generic academic/filler words that appear across most medical questions and cause
    // false-positive matches when they are the ONLY overlapping word with the query.
    "funktion",
    "funktioner",
    "betydning",
    "årsag",
    "årsager",
    "effekt",
    "effekter",
    "virkning",
    "virkninger",
    "egenskab",
    "egenskaber",
    "kendetegn",
    "karakteristisk",
    "vigtig",
    "vigtigt",
    "primær",
    "primært",
    "hoved",
    "generelt",
    "overordnet",
    "typisk",
    "typiske",
    "forklar",
    "forklare",
    "forklaring",
    "betyder",
    "angår",
    "gøre",
    "gør",
  ]),
  en: new Set([
    "the",
    "is",
    "at",
    "which",
    "on",
    "a",
    "an",
    "and",
    "or",
    "of",
    "to",
    "in",
    "for",
    "with",
    "that",
    "this",
    "these",
    "those",
    "what",
    "which",
    "who",
    "whom",
    "how",
    "why",
    "when",
    "where",
    "find",
    "show",
    "tell",
    "question",
    "questions",
    "about",
    "can",
    "could",
    "would",
    "should",
    "do",
    "does",
    "did",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "it",
    "its",
    "as",
    "by",
    "function",
    "functions",
    "meaning",
    "cause",
    "causes",
    "effect",
    "effects",
    "property",
    "properties",
    "feature",
    "characteristic",
    "important",
    "primary",
    "main",
    "general",
    "overall",
    "typical",
    "explain",
    "explains",
    "explanation",
    "does",
    "mean",
    "regarding",
    "concerning",
  ]),
  ar: new Set([
    "في",
    "من",
    "على",
    "عن",
    "إلى",
    "هل",
    "ما",
    "ماذا",
    "كيف",
    "لماذا",
    "الذي",
    "التي",
    "هذا",
    "هذه",
    "و",
    "أو",
  ]),
};

function stemWord(word) {
  // Lightweight Danish/English suffix stripping so inflected forms match their root.
  return word
    .replace(/(erne|ernes|ene|enes|erens|ernes)$/i, "")
    .replace(/(erne|ende|else|elser)$/i, "")
    .replace(/(erens|ers|end|ing|ede|et|es|er|en|e|s)$/i, (m) =>
      word.length - m.length >= 3 ? "" : m
    );
}

function levenshtein(a, b) {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  if (Math.abs(al - bl) > 2) return 99;
  const matrix = Array.from({ length: al + 1 }, (_, i) => [
    i,
    ...new Array(bl).fill(0),
  ]);
  for (let j = 0; j <= bl; j++) matrix[0][j] = j;
  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
    }
  }
  return matrix[al][bl];
}

function tokenizeForMatch(text, language) {
  const stopwords = DR_BYTE_STOPWORDS[language] || DR_BYTE_STOPWORDS.da;
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, (mark) => mark)
    .normalize("NFC")
    .replace(/[^a-z0-9æøåäöüéèáàíìóòúù\s-]/gi, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1 && !stopwords.has(word))
    .map((word) => stemWord(word));
}

function wordsAreRelated(queryWord, tokenWord) {
  if (queryWord === tokenWord) return 1;
  if (tokenWord.includes(queryWord) || queryWord.includes(tokenWord)) {
    const shorter = Math.min(queryWord.length, tokenWord.length);
    return shorter >= 3 ? 0.75 : 0;
  }
  if (queryWord.length >= 4 && tokenWord.length >= 4) {
    const distance = levenshtein(queryWord, tokenWord);
    if (distance === 1) return 0.6;
    if (distance === 2 && Math.min(queryWord.length, tokenWord.length) >= 6)
      return 0.35;
  }
  return 0;
}

function scoreQuestionMatch(query, question, language) {
  const queryWords = tokenizeForMatch(query, language);
  if (queryWords.length === 0) return 0;

  const questionText = translate(question.question, language);
  const categoryText = translate(question.category, language);
  const explanationText = translate(question.explanation, language);
  const optionsText = (question.options || [])
    .map((option) => translate(option, language))
    .join(" ");

  const haystacks = [
    { tokens: tokenizeForMatch(questionText, language), weight: 3.2 },
    { tokens: tokenizeForMatch(categoryText, language), weight: 2.6 },
    { tokens: tokenizeForMatch(optionsText, language), weight: 1.2 },
    { tokens: tokenizeForMatch(explanationText, language), weight: 1 },
  ];

  // Rare, long, specific technical terms (e.g. "oculomotorius") are far more informative
  // than short common words, even if they only appear once. Boost matches on longer words.
  function specificityBonus(word) {
    if (word.length >= 10) return 2.2;
    if (word.length >= 7) return 1.5;
    return 1;
  }

  let score = 0;
  let uniqueQueryWordsMatched = 0;

  queryWords.forEach((queryWord) => {
    let bestForThisWord = 0;
    haystacks.forEach(({ tokens, weight }) => {
      tokens.forEach((token) => {
        const relatedness = wordsAreRelated(queryWord, token);
        if (relatedness > 0) {
          score += relatedness * weight * specificityBonus(queryWord);
          bestForThisWord = Math.max(bestForThisWord, relatedness);
        }
      });
    });
    if (bestForThisWord > 0) uniqueQueryWordsMatched += 1;
  });

  // Reward questions that cover a larger share of the distinct query words,
  // so a question matching 4/4 words ranks above one matching 1/4 with a rare-word spike.
  const coverageRatio = uniqueQueryWordsMatched / queryWords.length;
  score *= 0.5 + 0.5 * coverageRatio;

  return score;
}

function findMatchingQuestions(query, questionBank, language, limit = 5) {
  // Absolute confidence ceiling: a score above this is treated as a "perfect" match (100%).
  // This is calibrated against typical scores for a well-matched question (weight 3.2 haystack,
  // multiple word hits), not relative to other results in this specific search.
  const ABSOLUTE_CONFIDENCE_CEILING = 6;
  // Minimum absolute score required before we consider a match usable at all.
  const MIN_USABLE_SCORE = 1.2;

  const scored = questionBank
    .map((question) => ({
      question,
      score: scoreQuestionMatch(query, question, language),
    }))
    .filter((item) => item.score >= MIN_USABLE_SCORE)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((item) => ({
    ...item,
    matchPercent: Math.min(
      100,
      Math.round((item.score / ABSOLUTE_CONFIDENCE_CEILING) * 100)
    ),
  }));
}

const DR_BYTE_DIRECT_ANSWER_COPY = {
  da: {
    lowConfidence:
      "Jeg er ikke helt sikker på, at jeg har fundet det rigtige spørgsmål til dette, men her er det mest relevante, jeg kunne finde:",
    answerLabel: "Svar",
    basedOn: "Baseret på spørgsmålet",
  },
  en: {
    lowConfidence:
      "I'm not fully confident this is the right question for this, but here is the most relevant one I could find:",
    answerLabel: "Answer",
    basedOn: "Based on the question",
  },
  ar: {
    lowConfidence:
      "لست متأكدًا تمامًا من أن هذا هو السؤال الصحيح، لكن هذا هو الأقرب صلة الذي وجدته:",
    answerLabel: "الإجابة",
    basedOn: "بناءً على السؤال",
  },
};

function buildDirectAnswer(matches, language) {
  if (!matches.length) return null;
  const copy =
    DR_BYTE_DIRECT_ANSWER_COPY[language] || DR_BYTE_DIRECT_ANSWER_COPY.da;
  const top = matches[0];
  const question = top.question;
  const correctOption = (question.options || [])[question.correct];
  const correctLetter = String.fromCharCode(65 + question.correct);
  const explanation = translate(question.explanation, language);
  const isLowConfidence = top.matchPercent < 65;

  const lines = [];
  if (isLowConfidence) lines.push(copy.lowConfidence, "");
  lines.push(
    `${copy.answerLabel}: ${correctLetter}. ${translate(
      correctOption,
      language
    )}`
  );
  if (explanation) {
    lines.push("");
    lines.push(explanation);
  }

  return {
    text: lines.join("\n"),
    primaryMatch: top,
    isLowConfidence,
  };
}

function buildAiContextBlock(matches, language) {
  return matches
    .map(({ question }, index) => {
      const optionLines = (question.options || [])
        .map(
          (option, optionIndex) =>
            `${String.fromCharCode(65 + optionIndex)}. ${translate(
              option,
              language
            )}`
        )
        .join("\n");
      return [
        `[Spørgsmål ${index + 1}] (id: ${question.id})`,
        `Kategori: ${translate(question.category, language)}`,
        `Spørgsmål: ${translate(question.question, language)}`,
        `Svarmuligheder:\n${optionLines}`,
        `Korrekt svar: ${String.fromCharCode(
          65 + question.correct
        )}. ${translate((question.options || [])[question.correct], language)}`,
        `Forklaring: ${translate(question.explanation, language)}`,
      ].join("\n");
    })
    .join("\n\n---\n\n");
}

const DR_BYTE_SYSTEM_PROMPT = {
  da: [
    "Du er Dr. Byte, en kyndig og hjælpsom studieassistent for medicinstuderende med bred medicinsk fagkundskab.",
    "Du får muligvis et udpluk af relevante MCQ-spørgsmål fra brugerens egen spørgsmålsbank som ekstra kontekst — men du er IKKE begrænset til kun at svare, hvis der findes et matchende MCQ.",
    "Din primære opgave er altid at BESVARE brugerens spørgsmål korrekt og fagligt fyldestgørende, uanset om det handler om selve MCQ'en, en specifik svarmulighed (også en forkert), eller et generelt medicinsk emne.",
    "Hvis brugeren spørger, hvorfor en bestemt svarmulighed i et MCQ er forkert, skal du forklare det fagligt og konkret, ikke bare gengive det korrekte svar.",
    "Hvis der findes relevante MCQ'er i konteksten, brug dem som faglig reference og nævn dem (fx 'jf. Spørgsmål 2'), hvor det er naturligt.",
    "Hvis der IKKE findes nogen relevant MCQ i konteksten, er det helt i orden — svar stadig på spørgsmålet ud fra din egen medicinske fagkundskab, uden at nævne MCQ-referencer.",
    "Svar altid på dansk, klart og præcist. Gæt aldrig på et faktuelt forkert svar — hvis du er usikker, sig det ærligt.",
  ].join(" "),
  en: [
    "You are Dr. Byte, a knowledgeable and helpful study assistant for medical students with broad medical expertise.",
    "You may receive a set of relevant MCQ questions from the user's own question bank as extra context — but you are NOT limited to only answering when a matching MCQ exists.",
    "Your primary task is always to ANSWER the user's question correctly and thoroughly, whether it concerns the MCQ itself, a specific answer option (including an incorrect one), or a general medical topic.",
    "If the user asks why a specific answer option in an MCQ is wrong, explain it with concrete medical reasoning, not just restate the correct answer.",
    "If relevant MCQs exist in the context, use them as supporting reference and mention them (e.g. 'see Question 2') where natural.",
    "If NO relevant MCQ exists in the context, that's fine — still answer the question using your own medical knowledge, without mentioning MCQ references.",
    "Always answer concisely and clearly. Never guess a factually wrong answer — if uncertain, say so honestly.",
  ].join(" "),
  ar: [
    "أنت الدكتور بايت، مساعد دراسي بارع ومفيد لطلاب الطب يتمتع بمعرفة طبية واسعة.",
    "قد تحصل على مجموعة من أسئلة الاختيار من متعدد ذات الصلة من بنك أسئلة المستخدم كسياق إضافي — لكنك لست مقيدًا بالإجابة فقط عند وجود سؤال مطابق.",
    "مهمتك الأساسية هي دائمًا الإجابة على سؤال المستخدم بدقة وبشكل شامل، سواء كان يتعلق بالسؤال نفسه، أو بخيار إجابة معين (حتى لو كان خاطئًا)، أو بموضوع طبي عام.",
    "إذا سأل المستخدم عن سبب خطأ خيار إجابة معين، فاشرح ذلك بمنطق طبي ملموس، لا مجرد إعادة ذكر الإجابة الصحيحة.",
    "إذا وُجدت أسئلة ذات صلة في السياق، استخدمها كمرجع داعم واذكرها عند الحاجة.",
    "إذا لم يوجد أي سؤال ذي صلة في السياق، فهذا أمر طبيعي — أجب على السؤال باستخدام معرفتك الطبية الخاصة دون ذكر أي مرجع.",
    "أجب دائمًا بإيجاز ووضوح. لا تخمن إجابة خاطئة علميًا مطلقًا — إذا كنت غير متأكد، فقل ذلك بصراحة.",
  ].join(" "),
};

// NOTE: this key is embedded directly in client-side code and will be visible to anyone
// who inspects the app's network requests or source (browser DevTools). Anyone with access
// to this app can extract and reuse it. Rotate it via NVIDIA's console if this app is ever
// shared beyond personal/local use.
const NVIDIA_DEFAULT_API_KEY =
  "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";

const NVIDIA_CORS_ERROR_HINT = {
  da: "NVIDIA's API tillader ikke direkte kald fra en browser (CORS er ikke aktiveret på deres endpoint). Dette er en begrænsning hos NVIDIA, ikke en fejl i appen. Tilføj en 'Proxy-URL' i AI-indstillingerne, der peger på en lille mellemled-server, for at løse det permanent.",
  en: "NVIDIA's API does not allow direct calls from a browser (CORS is not enabled on their endpoint). This is a limitation on NVIDIA's side, not a bug in the app. Add a 'Proxy URL' in the AI settings pointing to a small relay server to fix this permanently.",
  ar: "لا تسمح واجهة برمجة تطبيقات NVIDIA بالاتصال المباشر من المتصفح (CORS غير مُفعّل على نقطة النهاية الخاصة بهم). هذا قيد من جانب NVIDIA، وليس خطأ في التطبيق. أضف 'عنوان URL للوكيل' في إعدادات الذكاء الاصطناعي لحل هذا بشكل دائم.",
};

async function callDrByteNvidiaAI({
  apiKey,
  model,
  userQuestion,
  matches,
  language,
  conversationHistory = [],
  proxyUrl = "",
}) {
  const contextBlock = buildAiContextBlock(matches, language);
  const basePrompt =
    DR_BYTE_SYSTEM_PROMPT[language] || DR_BYTE_SYSTEM_PROMPT.da;

  const contextNote = contextBlock
    ? `Relevante spørgsmål fra spørgsmålsbanken (brug som reference hvis relevant, men du er ikke begrænset til dem):\n\n${contextBlock}`
    : "Der blev ikke fundet nogen relevant MCQ i spørgsmålsbanken til dette spørgsmål. Svar alligevel ud fra din egen medicinske fagkundskab.";

  const historyMessages = conversationHistory.slice(-6).map((entry) => ({
    role: entry.role === "user" ? "user" : "assistant",
    content: entry.text || entry.aiText || entry.directAnswer?.text || "",
  }));

  // NVIDIA's integrate.api.nvidia.com endpoint does not send CORS headers, so a direct
  // browser fetch will always fail with a generic "Failed to fetch" (the browser blocks it
  // before any response is readable). If a proxyUrl is configured, route the request through
  // that same-origin (or CORS-enabled) relay instead of calling NVIDIA directly.
  const targetUrl = proxyUrl
    ? proxyUrl.replace(/\/$/, "")
    : "https://integrate.api.nvidia.com/v1/chat/completions";

  let response;
  try {
    response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey || NVIDIA_DEFAULT_API_KEY}`,
      },
      body: JSON.stringify({
        model: model || "deepseek-ai/deepseek-v4-pro",
        messages: [
          { role: "system", content: basePrompt },
          ...historyMessages,
          {
            role: "user",
            content: `${contextNote}\n\nBrugerens spørgsmål: ${userQuestion}`,
          },
        ],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 16384,
        chat_template_kwargs: { thinking: false },
        stream: false,
      }),
    });
  } catch (networkError) {
    if (!proxyUrl) {
      const hint =
        NVIDIA_CORS_ERROR_HINT[language] || NVIDIA_CORS_ERROR_HINT.da;
      throw new Error(hint);
    }
    throw new Error(`${networkError.message} (proxy: ${targetUrl})`);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `NVIDIA AI request failed (${response.status}): ${errorBody.slice(
        0,
        200
      )}`
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  return { text, usedWebSearch: false };
}

async function callDrByteGroqAI({
  apiKey,
  model,
  userQuestion,
  matches,
  language,
  conversationHistory = [],
}) {
  const contextBlock = buildAiContextBlock(matches, language);
  const basePrompt =
    DR_BYTE_SYSTEM_PROMPT[language] || DR_BYTE_SYSTEM_PROMPT.da;

  const contextNote = contextBlock
    ? `Relevante spørgsmål fra spørgsmålsbanken (brug som reference hvis relevant, men du er ikke begrænset til dem):\n\n${contextBlock}`
    : "Der blev ikke fundet nogen relevant MCQ i spørgsmålsbanken til dette spørgsmål. Svar alligevel ud fra din egen medicinske fagkundskab.";

  const historyMessages = conversationHistory.slice(-6).map((entry) => ({
    role: entry.role === "user" ? "user" : "assistant",
    content: entry.text || entry.aiText || entry.directAnswer?.text || "",
  }));

  // Groq's API (api.groq.com) has CORS enabled, so it can be called directly from the
  // browser without a proxy, unlike NVIDIA's integrate.api.nvidia.com endpoint.
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: basePrompt },
          ...historyMessages,
          {
            role: "user",
            content: `${contextNote}\n\nBrugerens spørgsmål: ${userQuestion}`,
          },
        ],
        temperature: 0.4,
        max_tokens: 2048,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Groq AI request failed (${response.status}): ${errorBody.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() || "";
  return { text, usedWebSearch: false };
}

const DR_BYTE_WEB_SEARCH_NOTE = {
  da: "Du har adgang til et web_search-værktøj. Brug det, hvis den medfølgende MCQ-kontekst ikke er tilstrækkelig til at besvare spørgsmålet fagligt korrekt, eller hvis spørgsmålet handler om et emne, der ikke er dækket af spørgsmålsbanken. Prioriter altid pålidelige medicinske kilder (fx lærebøger, guidelines, videnskabelige oversigtsartikler).",
  en: "You have access to a web_search tool. Use it if the provided MCQ context is not sufficient to answer the question accurately, or if the question concerns a topic not covered by the question bank. Always prioritize reliable medical sources (e.g. textbooks, guidelines, peer-reviewed reviews).",
  ar: "لديك إمكانية الوصول إلى أداة البحث على الويب. استخدمها إذا لم يكن سياق الأسئلة المتوفر كافيًا للإجابة بدقة، أو إذا كان السؤال يتعلق بموضوع غير مغطى في بنك الأسئلة. أعط الأولوية دائمًا للمصادر الطبية الموثوقة.",
};

async function callDrByteAI({
  apiKey,
  model,
  userQuestion,
  matches,
  language,
  conversationHistory = [],
  allowWebSearch = true,
  provider = "openai",
  proxyUrl = "",
}) {
  if (provider === "nvidia") {
    return callDrByteNvidiaAI({
      apiKey,
      model,
      userQuestion,
      matches,
      language,
      conversationHistory,
      proxyUrl,
    });
  }
  if (provider === "groq") {
    return callDrByteGroqAI({
      apiKey,
      model,
      userQuestion,
      matches,
      language,
      conversationHistory,
    });
  }

  const contextBlock = buildAiContextBlock(matches, language);
  const basePrompt =
    DR_BYTE_SYSTEM_PROMPT[language] || DR_BYTE_SYSTEM_PROMPT.da;
  const webNote =
    DR_BYTE_WEB_SEARCH_NOTE[language] || DR_BYTE_WEB_SEARCH_NOTE.da;
  const systemPrompt = allowWebSearch ? `${basePrompt} ${webNote}` : basePrompt;

  const contextNote = contextBlock
    ? `Relevante spørgsmål fra spørgsmålsbanken (brug som reference hvis relevant, men du er ikke begrænset til dem):\n\n${contextBlock}`
    : "Der blev ikke fundet nogen relevant MCQ i spørgsmålsbanken til dette spørgsmål. Svar alligevel ud fra din egen medicinske fagkundskab, og brug web_search-værktøjet hvis nødvendigt for et fagligt korrekt svar.";

  const historyInputs = conversationHistory.slice(-6).map((entry) => ({
    role: entry.role === "user" ? "user" : "assistant",
    content: entry.text || entry.aiText || entry.directAnswer?.text || "",
  }));

  const requestBody = {
    model: model || "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      ...historyInputs,
      {
        role: "user",
        content: `${contextNote}\n\nBrugerens spørgsmål: ${userQuestion}`,
      },
    ],
    temperature: 0.3,
    max_output_tokens: 700,
  };

  if (allowWebSearch) {
    requestBody.tools = [{ type: "web_search" }];
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `AI request failed (${response.status}): ${errorBody.slice(0, 200)}`
    );
  }

  const data = await response.json();

  // Extract the assistant's final text output and detect whether a web search was used.
  const outputItems = data.output || [];
  let text = "";
  let usedWebSearch = false;

  outputItems.forEach((item) => {
    if (item.type === "web_search_call") usedWebSearch = true;
    if (item.type === "message" && Array.isArray(item.content)) {
      item.content.forEach((part) => {
        if (part.type === "output_text" && part.text) text += part.text;
      });
    }
  });

  if (!text && typeof data.output_text === "string") text = data.output_text;

  return { text: text.trim(), usedWebSearch };
}

function DrByteChat({
  c,
  t,
  language,
  importedQuestions,
  questionOverrides,
  onClose,
  onOpenQuestion,
}) {
  const [messages, setMessages] = useStoredState("medlearn-drbyte-chat", []);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [aiSettings] = useStoredState(STORAGE.aiSettings, {
    apiKey: "",
    model: "gpt-4o-mini",
    enabled: false,
    webSearch: true,
    provider: "openai",
    nvidiaApiKey: "",
    nvidiaModel: "deepseek-ai/deepseek-v4-pro",
    nvidiaProxyUrl: "",
    groqApiKey: "",
    groqModel: "llama-3.3-70b-versatile",
  });
  const scrollRef = useRef(null);

  // Recomputed on every render so the empty-state count always reflects the
  // latest imported/edited questions, matching what sendMessage will scan.
  const questionBank = getFullQuestionBank(
    importedQuestions,
    questionOverrides
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Rebuild the full question bank at send-time (not on mount) so freshly
    // imported or admin-edited questions are always included in the scan.
    const currentBank = getFullQuestionBank(
      importedQuestions,
      questionOverrides
    );

    const userMessage = { id: `u-${Date.now()}`, role: "user", text: trimmed };
    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setThinking(true);

    const matches = findMatchingQuestions(trimmed, currentBank, language, 6);

    const effectiveApiKey =
      aiSettings.provider === "nvidia"
        ? aiSettings.nvidiaApiKey || NVIDIA_DEFAULT_API_KEY
        : aiSettings.provider === "groq"
        ? aiSettings.groqApiKey
        : aiSettings.apiKey;
    if (aiSettings.enabled && effectiveApiKey) {
      try {
        const activeProvider = aiSettings.provider || "openai";
        const providerApiKey =
          activeProvider === "nvidia"
            ? aiSettings.nvidiaApiKey
            : activeProvider === "groq"
            ? aiSettings.groqApiKey
            : aiSettings.apiKey;
        const providerModel =
          activeProvider === "nvidia"
            ? aiSettings.nvidiaModel
            : activeProvider === "groq"
            ? aiSettings.groqModel
            : aiSettings.model;
        const aiResult = await callDrByteAI({
          apiKey: providerApiKey,
          model: providerModel,
          userQuestion: trimmed,
          matches,
          language,
          conversationHistory: messages,
          allowWebSearch: aiSettings.webSearch !== false,
          provider: activeProvider,
          proxyUrl: aiSettings.nvidiaProxyUrl || "",
        });
        const replyMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          aiText: aiResult.text,
          usedWebSearch: aiResult.usedWebSearch,
          matches,
          scannedCount: currentBank.length,
        };
        setMessages((previous) => [...previous, replyMessage]);
      } catch (error) {
        const replyMessage = {
          id: `a-${Date.now()}`,
          role: "assistant",
          aiError: String(error.message || error),
          matches,
          scannedCount: currentBank.length,
        };
        setMessages((previous) => [...previous, replyMessage]);
      } finally {
        setThinking(false);
      }
      return;
    }

    setTimeout(() => {
      const directAnswer = buildDirectAnswer(matches, language);
      const replyMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        directAnswer,
        matches,
        scannedCount: currentBank.length,
      };
      setMessages((previous) => [...previous, replyMessage]);
      setThinking(false);
    }, 420);
  }

  function clearChat() {
    setMessages([]);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: c.panel,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: `1px solid ${c.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <MascotAvatar size={34} mood="happy" />
          <div>
            <div style={{ color: c.text, fontWeight: 750, fontSize: 13.5 }}>
              {t.drByteChatTitle}
            </div>
            <div style={{ color: c.secondary, fontSize: 11 }}>
              {t.drByteChatSubtitle}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {messages.length > 0 && (
            <IconButton c={c} title={t.drByteClearChat} onClick={clearChat}>
              <Icon name="trash" size={15} />
            </IconButton>
          )}
          <IconButton c={c} title={t.close} onClick={onClose}>
            <Icon name="close" size={17} />
          </IconButton>
        </div>
      </header>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.length === 0 && !thinking && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 12,
              padding: "30px 10px",
              color: c.secondary,
              fontSize: 12.5,
              lineHeight: 1.6,
            }}
          >
            <MascotAvatar size={54} mood="default" />
            {t.drByteEmptyState}
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 99,
                background: c.soft,
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 700,
              }}
            >
              {t.drByteScanningBank} {questionBank.length}{" "}
              {t.drByteQuestionsUnit}
            </span>
          </div>
        )}

        {messages.map((message) =>
          message.role === "user" ? (
            <div
              key={message.id}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "9px 13px",
                  borderRadius: "14px 14px 4px 14px",
                  background: "linear-gradient(135deg,#1665ea,#4b93ff)",
                  color: "#fff",
                  fontSize: 12.5,
                  lineHeight: 1.5,
                }}
              >
                {message.text}
              </div>
            </div>
          ) : (
            <div
              key={message.id}
              style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
            >
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <MascotAvatar
                  size={26}
                  mood={message.matches.length ? "happy" : "sleepy"}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxWidth: "88%",
                }}
              >
                {message.aiText && (
                  <div
                    style={{
                      padding: "9px 13px",
                      borderRadius: "4px 14px 14px 14px",
                      background: c.soft,
                      color: c.text,
                      fontSize: 12.5,
                      lineHeight: 1.55,
                      fontWeight: 500,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {message.aiText}
                  </div>
                )}

                {message.usedWebSearch && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      color: c.muted,
                      fontSize: 10,
                      fontWeight: 650,
                      paddingInlineStart: 2,
                    }}
                  >
                    <Icon name="globe" size={11} />
                    {t.drByteUsedWebSearch}
                  </div>
                )}

                {message.aiError && (
                  <div
                    style={{
                      padding: "9px 13px",
                      borderRadius: "4px 14px 14px 14px",
                      background: c.redSoft,
                      color: c.red,
                      fontSize: 11.5,
                      lineHeight: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    {t.drByteAiError} {message.aiError}
                  </div>
                )}

                {!message.aiText &&
                  !message.aiError &&
                  message.directAnswer && (
                    <div
                      style={{
                        padding: "9px 13px",
                        borderRadius: "4px 14px 14px 14px",
                        background: c.soft,
                        color: c.text,
                        fontSize: 12.5,
                        lineHeight: 1.55,
                        fontWeight: 500,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {message.directAnswer.text}
                    </div>
                  )}

                {!message.aiText &&
                  !message.aiError &&
                  !message.directAnswer && (
                    <div
                      style={{
                        padding: "9px 13px",
                        borderRadius: "4px 14px 14px 14px",
                        background: c.soft,
                        color: c.text,
                        fontSize: 12.5,
                        lineHeight: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {t.drByteNoResults}
                    </div>
                  )}

                {message.matches.length > 0 &&
                  (message.aiText ||
                    message.aiError ||
                    message.directAnswer) && (
                    <div
                      style={{
                        color: c.muted,
                        fontSize: 10,
                        fontWeight: 750,
                        paddingInlineStart: 2,
                        textTransform: "uppercase",
                        letterSpacing: ".04em",
                      }}
                    >
                      {message.directAnswer &&
                      !message.aiText &&
                      !message.aiError
                        ? message.directAnswer.isLowConfidence
                          ? t.drByteSourcesLabel
                          : t.drByteBasedOnLabel
                        : t.drByteSourcesLabel}
                    </div>
                  )}

                {typeof message.scannedCount === "number" && (
                  <div
                    style={{
                      color: c.muted,
                      fontSize: 10,
                      fontWeight: 650,
                      paddingInlineStart: 2,
                    }}
                  >
                    {t.drByteScannedNote} {message.scannedCount}{" "}
                    {t.drByteQuestionsUnit}
                  </div>
                )}

                {(message.directAnswer && !message.directAnswer.isLowConfidence
                  ? message.matches.slice(0, 1)
                  : message.matches
                ).map(({ question, matchPercent }) => (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => onOpenQuestion && onOpenQuestion(question)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      textAlign: "start",
                      padding: "11px 13px",
                      borderRadius: 12,
                      border: `1px solid ${c.border}`,
                      background: c.panel,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          color: c.blue,
                          fontSize: 10.5,
                          fontWeight: 750,
                        }}
                      >
                        {translate(question.category, language)}
                      </span>
                      <span
                        style={{
                          flexShrink: 0,
                          padding: "2px 7px",
                          borderRadius: 99,
                          background: c.blueSoft,
                          color: c.blue,
                          fontSize: 9.5,
                          fontWeight: 800,
                        }}
                      >
                        {matchPercent}% {t.drByteMatchScore}
                      </span>
                    </div>
                    <span
                      style={{
                        color: c.text,
                        fontSize: 12.5,
                        fontWeight: 650,
                        lineHeight: 1.45,
                      }}
                    >
                      {translate(question.question, language)}
                    </span>
                    <span
                      style={{
                        color: c.secondary,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {t.drByteOpenQuestion} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {thinking && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <MascotAvatar size={26} mood="default" />
            <div
              style={{
                padding: "9px 13px",
                borderRadius: "4px 14px 14px 14px",
                background: c.soft,
                color: c.secondary,
                fontSize: 12,
                fontWeight: 650,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Icon name="sparkle" size={13} />
              {t.drByteThinking}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 14,
          borderTop: `1px solid ${c.border}`,
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
          placeholder={t.drByteInputPlaceholder}
          style={{
            flex: 1,
            height: 42,
            padding: "0 13px",
            borderRadius: 12,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 13,
          }}
        />
        <IconButton
          c={c}
          title={t.drByteSend}
          onClick={sendMessage}
          style={{
            width: 42,
            height: 42,
            background: "linear-gradient(135deg,#1665ea,#4b93ff)",
            color: "#fff",
          }}
        >
          <Icon name="chat" size={17} />
        </IconButton>
      </div>
    </div>
  );
}

function Icon({ name, size = 20, stroke = 2.1 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    chat: (
      <>
        <path d="M4 4h16v12H8l-4 4Z" />
      </>
    ),
    sparkle: (
      <>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
        <circle cx="12" cy="12" r="2.4" />
      </>
    ),
    flag: (
      <>
        <path d="M5 21V4" />
        <path d="M5 4h13l-3 4 3 4H5" />
      </>
    ),
    logo: (
      <>
        <path d="M3 12h4l2.5-7 4.5 14 2.5-7H21" />
        <circle cx="12" cy="12" r="9" opacity=".35" />
      </>
    ),
    home: (
      <>
        <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
        <path d="M9 21v-7h6v7" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V3h6v1M9 9h6M9 13h6M9 17h4" />
      </>
    ),
    notebook: (
      <>
        <path d="M6 3h12a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2 2V5a2 2 0 0 1 2-2Z" />
        <path d="M8 7h8M8 11h8M8 15h5M4 7h2M4 11h2M4 15h2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2.2" />
      </>
    ),
    play: <path d="m9 5 10 7-10 7Z" fill="currentColor" stroke="none" />,
    pause: (
      <>
        <path d="M9 5v14M15 5v14" />
      </>
    ),
    reset: (
      <>
        <path d="M3.5 11a8.5 8.5 0 1 0 2.2-5.7" />
        <path d="M3.5 4v5h5" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 4v16H9" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    brain: (
      <>
        <path d="M9 4.5a3 3 0 0 0-3 3v.3A3.2 3.2 0 0 0 4 10.7v1.1a3.2 3.2 0 0 0 1.4 2.65A3 3 0 0 0 8 19.5h1v-13a2 2 0 0 0-2-2Z" />
        <path d="M15 4.5a3 3 0 0 1 3 3v.3a3.2 3.2 0 0 1 2 3.4v1.1a3.2 3.2 0 0 1-1.4 2.65A3 3 0 0 1 16 19.5h-1v-13a2 2 0 0 1 2-2Z" />
        <path d="M12 6.5v13" />
      </>
    ),
    expand: (
      <>
        <path d="M15 3h6v6" />
        <path d="M9 21H3v-6" />
        <path d="M21 3l-7 7" />
        <path d="M3 21l7-7" />
      </>
    ),
    collapse: (
      <>
        <path d="M9 3H3v6" />
        <path d="M15 21h6v-6" />
        <path d="M3 3l7 7" />
        <path d="M21 21l-7-7" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M10 11v6M14 11v6" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
      </>
    ),
    star: (
      <path d="M12 3l2.6 5.6 6.1.5-4.6 4 1.4 6-5.5-3.3L6.5 19l1.4-6-4.6-4 6.1-.5Z" />
    ),
    flame: (
      <path d="M12 2c1 3-3 4.5-3 8a3 3 0 0 0 6 0c1.5 1 2 3 2 4.5A5 5 0 0 1 12 22a5 5 0 0 1-5-5c0-1.5.4-2.6 1-3.5-.3 1.5.2 2.5 1.5 2.5.8 0 1.5-.7 1.2-1.7C9 12 8 9.5 9.5 7 10.2 5.8 11.2 4 12 2Z" />
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    book: (
      <>
        <path d="M4 4.5A3.5 3.5 0 0 1 7.5 1H20v18H7.5A3.5 3.5 0 0 0 4 22Z" />
        <path d="M4 4.5V22M8 6h8M8 10h8" />
      </>
    ),
    cards: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M8 9h8M8 13h5M3 8v12a2 2 0 0 0 2 2h12" opacity=".55" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V5M4 20h16M8 16v-4M12 16V8M16 16v-7" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    moon: (
      <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
    ),
    volume: (
      <>
        <path d="M4 10v4h4l5 4V6L8 10Z" />
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7 7 0 0 1 0 11" />
      </>
    ),
    volumeOff: (
      <>
        <path d="M4 10v4h4l5 4V6L8 10Z" />
        <path d="m16 10 4 4m0-4-4 4" />
      </>
    ),
    list: (
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v2M22 12h-2M12 22v-2M2 12h2" />
      </>
    ),
    bolt: (
      <path
        d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
        fill="currentColor"
        stroke="none"
      />
    ),
    coffee: (
      <>
        <path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z" />
        <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
        <path d="M7 3.5c0 .9-.6 1.1-.6 2S7 6.6 7 7.5M11 3.5c0 .9-.6 1.1-.6 2s.6 1.1.6 2" />
      </>
    ),
  };

  return <svg {...props}>{icons[name]}</svg>;
}

function GlobalStyles() {
  return (
    <style>{`
      /* --------------------------------------------------------------
         KALENDER-TEMA (WeekCalendar)
         Kalenderen er en selvbygget React-komponent (WeekCalendar) i stedet
         for et eksternt bibliotek, så al styling styres af appens egne
         farve-tokens (c.blue/c.blueGradient osv.) og arver automatisk lys/
         mørkt tema uden separate CSS-overrides.
         -------------------------------------------------------------- */
      .sx-app-dark-container {
        color-scheme: dark;
      }

      * { box-sizing: border-box; }
      html, body, #root { min-height: 100%; margin: 0; }
      @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap");
      body {
        font-family: "Manrope", ui-sans-serif, system-ui, -apple-system,
          BlinkMacSystemFont, "Segoe UI", sans-serif;
        -webkit-font-smoothing: antialiased;
        letter-spacing: -0.01em;
      }
      button, input, textarea, select { font: inherit; }
      button { -webkit-tap-highlight-color: transparent; }

      button:not(:disabled):hover {
        filter: brightness(1.03);
      }
      button:not(:disabled):active {
        transform: scale(.97);
      }

      button:focus-visible,
      input:focus-visible,
      textarea:focus-visible,
      select:focus-visible {
        outline: 2px solid #55a7ff;
        outline-offset: 2px;
        border-radius: 6px;
      }

      input, textarea, select {
        transition: border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
      }

      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb {
        border: 2px solid transparent;
        border-radius: 20px;
        background: rgba(120,132,150,.38);
        background-clip: padding-box;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(120,132,150,.55);
        background-clip: padding-box;
      }

      .app-surface {
        transition: background 220ms ease, border-color 220ms ease;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(14px) scale(.99); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      @keyframes flameFlicker {
        0%, 100% { transform: scale(1) rotate(-1deg); }
        25% { transform: scale(1.05) rotate(1deg); }
        50% { transform: scale(0.97) rotate(-1.5deg); }
        75% { transform: scale(1.03) rotate(1.5deg); }
      }

      @keyframes flameFlickerStrong {
        0%, 100% { transform: scale(1) rotate(-2deg); }
        20% { transform: scale(1.08) rotate(2deg); }
        45% { transform: scale(0.94) rotate(-3deg); }
        70% { transform: scale(1.1) rotate(2.5deg); }
        85% { transform: scale(0.97) rotate(-1deg); }
      }

      @keyframes flameGlowPulse {
        0%, 100% { opacity: .55; transform: scale(.9); }
        50% { opacity: 1; transform: scale(1.15); }
      }

      .flame-icon {
        animation: flameFlicker 1.8s ease-in-out infinite;
        transform-origin: center bottom;
      }

      .flame-icon-strong {
        animation: flameFlickerStrong 1.1s ease-in-out infinite;
      }

      .flame-icon-strong::after {
        content: "";
        position: absolute;
        inset: -30%;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,138,0,.45), transparent 70%);
        animation: flameGlowPulse 1.4s ease-in-out infinite;
        z-index: -1;
      }

      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .live-feedback {
        animation: slideUpFade 320ms cubic-bezier(.16,1,.3,1) both;
      }

      @keyframes pulseSoft {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
      }

      .pulse-soft {
        animation: pulseSoft 1.6s ease-in-out infinite;
      }

      .sidebar-nav-btn {
        transition: background 180ms ease, color 180ms ease, transform 140ms ease;
      }
      .sidebar-nav-btn:hover {
        background: rgba(120,150,255,.10) !important;
        transform: translateY(-1px);
      }
      .sidebar-nav-btn:active {
        transform: scale(.94);
      }
      .sidebar-active-dot {
        animation: sidebarDotIn 220ms cubic-bezier(.16,1,.3,1) both;
      }
      @keyframes sidebarDotIn {
        from { opacity: 0; transform: translateY(-50%) scaleY(.3); }
        to { opacity: 1; transform: translateY(-50%) scaleY(1); }
      }
      .sidebar-logo {
        transition: transform 220ms cubic-bezier(.16,1,.3,1);
      }
      .sidebar-logo:hover {
        transform: scale(1.06) rotate(-2deg);
      }
      .sidebar-profile-btn {
        transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
      }
      .sidebar-profile-btn:hover {
        transform: translateY(-1px);
      }
      .sidebar-menu-item {
        transition: background 140ms ease, padding-inline-start 140ms ease;
      }
      .sidebar-menu-item:hover {
        background: rgba(120,150,255,.10);
        padding-inline-start: 13px;
      }
      .app-topbar button[data-tour="pomodoro"] {
        transition: background 180ms ease, border-color 180ms ease, transform 140ms ease;
      }
      .app-topbar button[data-tour="pomodoro"]:hover {
        transform: translateY(-1px);
      }
      .app-topbar button[data-tour="pomodoro"]:active {
        transform: scale(.98);
      }
      .clock-gradient-text {
        background: linear-gradient(100deg, #1665ea, #4b93ff, #7ab8ff, #4b93ff, #1665ea);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: clockGradientFlow 6s ease-in-out infinite, clockPulse 2s ease-in-out infinite;
        display: inline-block;
      }
      @keyframes clockGradientFlow {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes clockPulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: .92; transform: scale(1.015); }
      }



      @keyframes navWiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-2.5deg); }
        75% { transform: rotate(2.5deg); }
      }

      .nav-wiggle {
        animation: navWiggle 0.32s ease-in-out infinite;
        animation-delay: calc(var(--wiggle-delay, 0) * 70ms);
      }

      @keyframes fullscreenRevealIn {
        0% { opacity: 0; transform: scale(0.94); }
        10% { opacity: 1; transform: scale(1); }
        90% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.02); }
      }

      .fullscreen-reveal {
        animation: fullscreenRevealIn 2.6s cubic-bezier(.16,1,.3,1) forwards;
      }

      @keyframes revealNumberPop {
        0% { opacity: 0; transform: translateY(14px) scale(0.9); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }

      .reveal-number {
        animation: revealNumberPop 560ms cubic-bezier(.16,1,.3,1) both;
        animation-delay: 200ms;
      }

      @keyframes waveFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }

      .wave-float {
        animation: waveFloat 2.4s ease-in-out infinite;
      }

      @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .live-feedback {
        animation: slideUpFade 320ms cubic-bezier(.16,1,.3,1) both;
      }

      @keyframes pulseSoft {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.03); }
      }

      .pulse-soft {
        animation: pulseSoft 1.6s ease-in-out infinite;
      }

      @keyframes navWiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-2.5deg); }
        75% { transform: rotate(2.5deg); }
      }

      .nav-wiggle {
        animation: navWiggle 0.32s ease-in-out infinite;
        animation-delay: calc(var(--wiggle-delay, 0) * 70ms);
      }

      .fade-up {
        animation: fadeUp 460ms cubic-bezier(.16,1,.3,1) both;
      }

      @keyframes calendarSlideIn {
        from { opacity: 0; transform: translateX(-16px) scale(0.99); }
        to { opacity: 1; transform: translateX(0) scale(1); }
      }
      @keyframes calendarSlideOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to { opacity: 0; transform: translateX(-16px) scale(0.99); }
      }
      .calendar-fullscreen-enter {
        animation: calendarSlideIn 320ms cubic-bezier(.16,1,.3,1) both;
      }
      .calendar-fullscreen-exit {
        animation: calendarSlideOut 220ms cubic-bezier(.4,0,1,1) both;
      }
      @keyframes heartBloodFill { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-98px); } }

      @keyframes driftOne {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(11vw, -8vh, 0) scale(1.12); }
      }

      @keyframes driftTwo {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(-9vw, 9vh, 0) scale(.9); }
      }

      @keyframes driftThree {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(-7vw, -6vh, 0) scale(1.08); }
      }

      .onboarding-orb {
        position: absolute;
        border-radius: 999px;
        pointer-events: none;
        filter: blur(2px);
        opacity: .8;
      }

      .onboarding-orb.one {
        width: min(42vw, 560px);
        height: min(42vw, 560px);
        inset: -15% auto auto -12%;
        background: radial-gradient(circle at 35% 35%, rgba(39,136,255,.52), rgba(105,190,255,.12) 64%, transparent 72%);
        animation: driftOne 15s ease-in-out infinite;
      }

      .onboarding-orb.two {
        width: min(38vw, 480px);
        height: min(38vw, 480px);
        inset: auto -10% -18% auto;
        background: radial-gradient(circle at 48% 45%, rgba(44,154,255,.38), rgba(112,196,255,.09) 65%, transparent 73%);
        animation: driftTwo 18s ease-in-out infinite;
      }

      .onboarding-orb.three {
        width: min(22vw, 280px);
        height: min(22vw, 280px);
        inset: 20% 11% auto auto;
        background: radial-gradient(circle, rgba(88,184,255,.27), transparent 70%);
        animation: driftThree 13s ease-in-out infinite;
      }

      .onboarding-orb.one.dark {
        background: radial-gradient(circle at 35% 35%, rgba(58,140,255,.34), rgba(90,168,255,.10) 64%, transparent 72%);
      }

      .onboarding-orb.two.dark {
        background: radial-gradient(circle at 48% 45%, rgba(70,120,255,.28), rgba(112,150,255,.07) 65%, transparent 73%);
      }

      .onboarding-orb.three.dark {
        background: radial-gradient(circle, rgba(90,150,255,.20), transparent 70%);
      }

      @keyframes blueMesh {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      @keyframes appDriftOne {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(10vw, 8vh, 0) scale(1.14); }
      }

      @keyframes appDriftTwo {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        50% { transform: translate3d(-9vw, -10vh, 0) scale(.88); }
      }

      .app-blue-hue {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
        background: linear-gradient(120deg, #ddecff, #f5faff, #cfe7ff, #eef7ff, #d8eeff, #f7fbff);
        background-size: 500% 500%;
        animation: blueMesh 15s ease-in-out infinite;
      }

      .app-blue-hue::before,
      .app-blue-hue::after {
        content: "";
        position: absolute;
        border-radius: 999px;
        filter: blur(32px);
      }

      .app-blue-hue::before {
        width: min(55vw, 760px);
        height: min(55vw, 760px);
        top: -30vh;
        right: -15vw;
        background: radial-gradient(circle, rgba(32,120,255,.38), rgba(77,164,255,.15) 48%, transparent 72%);
        animation: appDriftOne 14s ease-in-out infinite;
      }

      .app-blue-hue::after {
        width: min(48vw, 650px);
        height: min(48vw, 650px);
        bottom: -28vh;
        left: 2vw;
        background: radial-gradient(circle, rgba(43,151,255,.32), rgba(71,112,255,.12) 52%, transparent 74%);
        animation: appDriftTwo 17s ease-in-out infinite;
      }

      .app-blue-hue-dark {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
        background: linear-gradient(120deg, #0b0f16, #0d1420, #0a1220, #0e1626, #0b1018, #0d1420);
        background-size: 500% 500%;
        animation: blueMesh 15s ease-in-out infinite;
      }

      .app-blue-hue-dark::before,
      .app-blue-hue-dark::after {
        content: "";
        position: absolute;
        border-radius: 999px;
        filter: blur(42px);
      }

      .app-blue-hue-dark::before {
        width: min(55vw, 760px);
        height: min(55vw, 760px);
        top: -30vh;
        right: -15vw;
        background: radial-gradient(circle, rgba(58,140,255,.30), rgba(90,168,255,.12) 48%, transparent 72%);
        animation: appDriftOne 14s ease-in-out infinite;
      }

      .app-blue-hue-dark::after {
        width: min(48vw, 650px);
        height: min(48vw, 650px);
        bottom: -28vh;
        left: 2vw;
        background: radial-gradient(circle, rgba(70,120,255,.26), rgba(63,100,220,.10) 52%, transparent 74%);
        animation: appDriftTwo 17s ease-in-out infinite;
      }

      .app-surface { position: relative; z-index: 2; }
      .app-sidebar { z-index: 4 !important; }
      .app-topbar { z-index: 3 !important; }
      .app-main-area { position: relative; z-index: 2; }

      .onboarding-blue-stage {
        background: linear-gradient(125deg, #e8f4ff, #d9ecff, #eff8ff, #d6eaff) !important;
        background-size: 320% 320% !important;
        animation: blueMesh 16s ease-in-out infinite;
      }

      .onboarding-blue-stage-light {
        background: linear-gradient(125deg, #e8f4ff, #d9ecff, #eff8ff, #d6eaff) !important;
        background-size: 320% 320% !important;
        animation: blueMesh 16s ease-in-out infinite;
      }

      .onboarding-blue-stage-dark {
        background: linear-gradient(125deg, #0b0f16, #0d1420, #0a1220, #0e1626) !important;
        background-size: 320% 320% !important;
        animation: blueMesh 16s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .onboarding-orb, .app-blue-hue, .app-blue-hue::before, .app-blue-hue::after { animation: none !important; }
      }

      .rich-editor:empty::before {
        content: attr(data-placeholder);
        color: #98a2b3;
        pointer-events: none;
      }

      .rich-editor ul,
      .rich-editor ol {
        padding-inline-start: 1.4rem;
      }

      .rich-editor hr {
        border: 0;
        border-top: 1px solid rgba(130,140,155,.36);
        margin: 1.2rem 0;
      }

      @media (max-width: 760px) {
        .app-sidebar { width: 58px !important; }
        .content-padding { padding: 22px !important; }
        .notes-open { width: min(calc(100vw - 58px), 390px) !important; }
        .desktop-only { display: none !important; }
      }
    `}</style>
  );
}

function IconButton({
  c,
  children,
  onClick,
  title,
  active = false,
  disabled = false,
  style = {},
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${active ? c.blueBorder : "transparent"}`,
        borderRadius: 12,
        background: active ? c.blueSoft : "transparent",
        color: active ? c.blue : c.secondary,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.38 : 1,
        transition:
          "background 160ms ease, border-color 160ms ease, color 160ms ease, transform 120ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick, disabled = false, style = {} }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        minHeight: 44,
        padding: "0 20px",
        border: 0,
        borderRadius: 13,
        background: "linear-gradient(135deg,#1665ea,#4b93ff)",
        color: "#fff",
        boxShadow: disabled ? "none" : "0 10px 24px rgba(22,101,234,.28)",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 0.1,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.38 : 1,
        transition:
          "transform 140ms ease, box-shadow 140ms ease, filter 140ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function Loader({ c, t, leaving, theme, moduleId }) {
  const facts = (
    moduleId ? QUESTIONS.filter((q) => q.moduleId === moduleId) : QUESTIONS
  )
    .map((q) => translate(q.explanation, "da"))
    .filter(Boolean);
  const [fact] = useState(
    () =>
      facts[Math.floor(Math.random() * Math.max(1, facts.length))] ||
      "Regelmæssig aktiv genkaldelse styrker langtidshukommelsen."
  );

  return (
    <div
      className={
        theme === "dark"
          ? "onboarding-blue-stage-dark"
          : "onboarding-blue-stage-light"
      }
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: c.page,
        opacity: leaving ? 0 : 1,
        transition: "opacity 250ms ease",
      }}
    >
      <section
        style={{
          width: "min(410px, calc(100vw - 40px))",
          padding: 28,
          borderRadius: 20,
          background: c.panel,
          border: `1px solid ${c.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 34,
              height: 34,
              borderRadius: 10,
              background: c.blueSoft,
              color: c.blue,
              border: `1px solid ${c.blueBorder}`,
            }}
          >
            <Icon name="logo" size={17} />
          </span>
          <div>
            <div style={{ color: c.text, fontSize: 13, fontWeight: 800 }}>
              MedLearn
            </div>
            <div style={{ marginTop: 2, color: c.secondary, fontSize: 11 }}>
              {t.preparing}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            placeItems: "center",
            margin: "2px 0 20px",
          }}
        >
          <svg
            width="128"
            height="142"
            viewBox="0 0 128 142"
            role="img"
            aria-label="Anatomisk hjerte fyldes med blod"
          >
            <defs>
              <clipPath id="heart-organ-clip">
                <path d="M61 131c-17-13-38-31-43-52C11 52 25 31 45 34c8 1 13 7 16 13V19c0-10 8-17 17-17 9 0 16 7 16 17v27c7-11 19-15 29-10 14 7 16 26 7 43-8 17-30 37-48 52Z" />
              </clipPath>
              <linearGradient id="heart-blood" x1="0" x2="0" y1="1" y2="0">
                <stop stopColor="#a91f39" />
                <stop offset="1" stopColor="#ef6474" />
              </linearGradient>
            </defs>
            <path
              d="M61 131c-17-13-38-31-43-52C11 52 25 31 45 34c8 1 13 7 16 13V19c0-10 8-17 17-17 9 0 16 7 16 17v27c7-11 19-15 29-10 14 7 16 26 7 43-8 17-30 37-48 52Z"
              fill={c.soft}
              stroke={c.borderStrong}
              strokeWidth="2"
            />
            <g clipPath="url(#heart-organ-clip)">
              <rect
                x="10"
                y="138"
                width="112"
                height="130"
                fill="url(#heart-blood)"
                style={{
                  animation: "heartBloodFill 1800ms ease-in-out infinite",
                }}
              />
            </g>
            <path
              d="M61 131c-17-13-38-31-43-52C11 52 25 31 45 34c8 1 13 7 16 13V19c0-10 8-17 17-17 9 0 16 7 16 17v27c7-11 19-15 29-10 14 7 16 26 7 43-8 17-30 37-48 52Z"
              fill="none"
              stroke={c.borderStrong}
              strokeWidth="2"
            />
            <path
              d="M61 47c-5 15-3 31 3 42m14-43c-3 14-1 29 6 40m-45-9c12 1 22 7 30 16m14-7c9-7 18-9 27-6"
              fill="none"
              stroke="rgba(255,255,255,.48)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div
          style={{
            padding: "12px 13px",
            borderRadius: 12,
            background: c.soft,
            border: `1px solid ${c.border}`,
          }}
        >
          <div
            style={{
              color: c.blue,
              fontSize: 10,
              fontWeight: 850,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Vidste du?
          </div>
          <p
            style={{
              margin: "5px 0 0",
              color: c.secondary,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            {fact}
          </p>
        </div>
      </section>
    </div>
  );
}

function Onboarding({ c, t, language, theme, onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [reveal, setReveal] = useState(null);
  const revealTimerRef = useRef(null);
  useEffect(
    () => () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    },
    []
  );
  const revealCopy =
    {
      da: {
        welcomeTitle: (n) => `Velkommen, ${n}!`,
        welcomeLabel: "Godt at have dig med",
        introTitle: "Klar til at komme i gang",
        introLabel: "Vi guider dig gennem hovedrummet",
      },
      en: {
        welcomeTitle: (n) => `Welcome, ${n}!`,
        welcomeLabel: "Great to have you here",
        introTitle: "Ready to get started",
        introLabel: "We'll guide you through the main space",
      },
      ar: {
        welcomeTitle: (n) => `أهلاً بك، ${n}!`,
        welcomeLabel: "سعداء بانضمامك",
        introTitle: "لنبدأ الآن",
        introLabel: "سنرشدك عبر المساحة الرئيسية",
      },
    }[language] || {};
  function triggerReveal(type, after) {
    setReveal(type);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      setReveal(null);
      after();
    }, 2400);
  }

  const levels = [
    { id: "Bachelor", label: t.bachelor },
    { id: "Kandidat", label: t.candidate },
  ];

  function next() {
    if (step === 1 && name.trim()) {
      triggerReveal("welcome", () => setStep(2));
    } else if (step === 2 && level) setStep(3);
    else if (step === 3 && moduleName) {
      triggerReveal("intro", () =>
        onComplete({ name: name.trim(), level, module: moduleName })
      );
    }
  }

  if (reveal === "welcome") {
    return (
      <StepReveal
        c={c}
        icon="user"
        title={revealCopy.welcomeTitle(name.trim())}
        label={revealCopy.welcomeLabel}
      />
    );
  }
  if (reveal === "intro") {
    return (
      <StepReveal
        c={c}
        icon="home"
        title={revealCopy.introTitle}
        label={revealCopy.introLabel}
      />
    );
  }

  return (
    <div
      className={
        theme === "dark"
          ? "onboarding-blue-stage-dark"
          : "onboarding-blue-stage-light"
      }
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        isolation: "isolate",
        padding: 20,
        background: c.page,
      }}
    >
      <span
        className={`onboarding-orb one${theme === "dark" ? " dark" : ""}`}
      />
      <span
        className={`onboarding-orb two${theme === "dark" ? " dark" : ""}`}
      />
      <span
        className={`onboarding-orb three${theme === "dark" ? " dark" : ""}`}
      />
      <section
        className="fade-up"
        style={{
          position: "relative",
          zIndex: 1,
          width: "min(510px, 100%)",
          padding: "30px 32px",
          borderRadius: 28,
          background: c.panel,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadow,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 15,
              background: c.blueSoft,
              color: c.blue,
              border: `1px solid ${c.blueBorder}`,
            }}
          >
            <Icon name="logo" size={20} />
          </div>

          <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                style={{
                  width: item === step ? 18 : 7,
                  height: 7,
                  borderRadius: 20,
                  background: item <= step ? c.blue : c.borderStrong,
                }}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="fade-up">
            <h1 style={{ color: c.text, margin: "0 0 25px", fontSize: 29 }}>
              {t.nameQuestion}
            </h1>

            <input
              autoFocus
              value={name}
              placeholder={t.namePlaceholder}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && next()}
              style={{
                width: "100%",
                height: 52,
                marginBottom: 16,
                padding: "0 15px",
                borderRadius: 14,
                border: `1px solid ${
                  name.trim() ? c.blueBorder : c.borderStrong
                }`,
                background: c.soft,
                color: c.text,
                fontSize: 16,
              }}
            />

            <PrimaryButton
              disabled={!name.trim()}
              onClick={next}
              style={{ width: "100%" }}
            >
              {t.continue}
            </PrimaryButton>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <h1 style={{ color: c.text, margin: "0 0 25px", fontSize: 29 }}>
              {t.chooseStudyLevel}
            </h1>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 22,
              }}
            >
              {levels.map((item) => {
                const selected = level === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setLevel(item.id);
                      setModuleName("");
                    }}
                    style={{
                      minHeight: 138,
                      padding: 18,
                      borderRadius: 18,
                      border: `1px solid ${selected ? c.blueBorder : c.border}`,
                      background: selected ? c.blueSoft : c.soft,
                      color: selected ? c.blue : c.text,
                      fontWeight: 750,
                      cursor: "pointer",
                    }}
                  >
                    <Icon name="book" size={29} />
                    <div style={{ marginTop: 12 }}>{item.label}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <IconButton
                c={c}
                title={t.back}
                onClick={() => setStep(1)}
                style={{
                  width: "auto",
                  minWidth: 100,
                  height: 44,
                  padding: "0 16px",
                  border: `1px solid ${c.borderStrong}`,
                  color: c.text,
                  fontWeight: 700,
                  gap: 5,
                }}
              >
                <Icon name="left" size={16} />
                {t.back}
              </IconButton>

              <PrimaryButton
                disabled={!level}
                onClick={next}
                style={{ flex: 1 }}
              >
                {t.continue}
              </PrimaryButton>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <h1 style={{ color: c.text, margin: "0 0 25px", fontSize: 29 }}>
              {t.chooseModule}
            </h1>

            <div
              style={{
                maxHeight: 330,
                overflowY: "auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
                gap: 10,
                padding: "3px 5px 3px 1px",
                marginBottom: 22,
              }}
            >
              {MODULES[language][level].map((item, index) => {
                const selected = moduleName === item;
                const code =
                  item.match(/^[A-Z]\d+/)?.[0] ||
                  String(index + 1).padStart(2, "0");
                const label = item.replace(/^[A-Z]\d+\s*/, "");

                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setModuleName(item)}
                    style={{
                      minHeight: 104,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: 15,
                      textAlign: "start",
                      borderRadius: 17,
                      border: `1px solid ${selected ? c.blueBorder : c.border}`,
                      background: selected ? c.blueSoft : c.soft,
                      color: selected ? c.blue : c.text,
                      boxShadow: selected ? `0 10px 22px ${c.blue}18` : "none",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition:
                        "transform 160ms ease, border-color 160ms ease",
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.transform = "translateY(-2px)";
                      if (!selected)
                        event.currentTarget.style.borderColor = c.borderStrong;
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.transform = "translateY(0)";
                      if (!selected)
                        event.currentTarget.style.borderColor = c.border;
                    }}
                  >
                    <span
                      style={{
                        width: "fit-content",
                        padding: "4px 7px",
                        borderRadius: 8,
                        background: selected ? `${c.blue}18` : c.panel,
                        color: selected ? c.blue : c.secondary,
                        border: `1px solid ${
                          selected ? c.blueBorder : c.border
                        }`,
                        fontSize: 10,
                        fontWeight: 800,
                        letterSpacing: ".06em",
                      }}
                    >
                      {code}
                    </span>
                    <span style={{ lineHeight: 1.35 }}>{label}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <IconButton
                c={c}
                title={t.back}
                onClick={() => setStep(2)}
                style={{
                  width: "auto",
                  minWidth: 100,
                  height: 44,
                  padding: "0 16px",
                  border: `1px solid ${c.borderStrong}`,
                  color: c.text,
                  fontWeight: 700,
                  gap: 5,
                }}
              >
                <Icon name="left" size={16} />
                {t.back}
              </IconButton>

              <PrimaryButton
                disabled={!moduleName}
                onClick={next}
                style={{ flex: 1 }}
              >
                {t.start}
              </PrimaryButton>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ModuleSwitcher({ c, language, user, setUser }) {
  const [open, setOpen] = useState(false);
  const levels = ["Bachelor", "Kandidat"];
  const modules =
    MODULES[language]?.[user.level] || MODULES.da[user.level] || [];
  const selectLevel = (level) => {
    const firstModule = (MODULES[language]?.[level] ||
      MODULES.da[level] || [""])[0];
    setUser((current) => ({ ...current, level, module: firstModule }));
  };
  const selectModule = (module) => {
    setUser((current) => ({ ...current, module }));
    setOpen(false);
  };
  const moduleLabel = user.module
    ? user.module.replace(/^[A-Z]\d+\s*/, "")
    : "Vælg modul";
  return (
    <div
      style={{
        position: "absolute",
        insetInlineEnd: 18,
        top: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        zIndex: 40,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 38,
          maxWidth: 240,
          padding: "0 10px",
          border: `1px solid ${open ? c.blueBorder : c.border}`,
          borderRadius: 11,
          background: open ? c.blueSoft : c.soft,
          color: open ? c.blue : c.secondary,
          cursor: "pointer",
          textAlign: "start",
        }}
      >
        <Icon name="book" size={16} />
        <span
          className="desktop-only"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          {moduleLabel}
        </span>
        <span
          style={{
            fontSize: 11,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms ease",
          }}
        >
          ⌄
        </span>
      </button>
      <div
        style={{
          position: "absolute",
          top: 62,
          insetInlineEnd: 0,
          width: 290,
          padding: 10,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          background: c.panel,
          boxShadow: c.shadow,
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0) scale(1)"
            : "translateY(-12px) scale(.98)",
          transformOrigin: "top right",
          pointerEvents: open ? "auto" : "none",
          transition:
            "opacity 180ms ease, transform 220ms cubic-bezier(.16,1,.3,1)",
          direction: "ltr",
        }}
      >
        <div
          style={{
            padding: "3px 5px 9px",
            color: c.muted,
            fontSize: 9,
            fontWeight: 850,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          {language === "da" ? "Studieniveau" : "Study level"}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 6,
            marginBottom: 11,
          }}
        >
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => selectLevel(level)}
              style={{
                height: 34,
                border: `1px solid ${
                  user.level === level ? c.blueBorder : c.border
                }`,
                borderRadius: 9,
                background: user.level === level ? c.blueSoft : c.soft,
                color: user.level === level ? c.blue : c.secondary,
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {level}
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "3px 5px 8px",
            borderTop: `1px solid ${c.border}`,
            color: c.muted,
            fontSize: 9,
            fontWeight: 850,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          {language === "da" ? "Modul" : "Module"}
        </div>
        <div
          style={{
            display: "grid",
            gap: 3,
            maxHeight: 265,
            overflowY: "auto",
            paddingInlineEnd: 2,
          }}
        >
          {modules.map((module) => (
            <button
              key={module}
              type="button"
              onClick={() => selectModule(module)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: "9px 10px",
                border: 0,
                borderRadius: 9,
                background: user.module === module ? c.blueSoft : "transparent",
                color: user.module === module ? c.blue : c.text,
                textAlign: "left",
                fontSize: 11,
                fontWeight: user.module === module ? 800 : 650,
                lineHeight: 1.35,
                cursor: "pointer",
              }}
            >
              {module}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PomodoroRing({ c, accent, size = 46, progress = 0, isBreak = false }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = circumference - (clamped / 100) * circumference;
  const headAngle = (clamped / 100) * 360 - 90;
  const headX = 50 + radius * Math.cos((headAngle * Math.PI) / 180);
  const headY = 50 + radius * Math.sin((headAngle * Math.PI) / 180);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ flexShrink: 0, overflow: "visible" }}
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={c.border}
        strokeWidth="7"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={accent}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: "stroke-dashoffset 1s linear" }}
      />
      {clamped > 0.5 && <circle cx={headX} cy={headY} r="5.5" fill={accent} />}
      <foreignObject x="34" y="34" width="32" height="32">
        <div
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accent,
          }}
        >
          <Icon name={isBreak ? "coffee" : "bolt"} size={16} stroke={2.2} />
        </div>
      </foreignObject>
    </svg>
  );
}

function Timer({ c, t, language, user, setUser }) {
  const [settings, setSettings] = useStoredState(STORAGE.timer, {
    focus: 25,
    pause: 5,
    sessions: 0,
  });

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("idle");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(settings.focus * 60);
  const [clock, setClock] = useState("");
  const [clockDate, setClockDate] = useState("");
  const [clockTick, setClockTick] = useState(() => new Date());
  const [pomodoroLog, setPomodoroLog] = useStoredState(STORAGE.pomodoroLog, {});
  const [pomodoroMinutesLog, setPomodoroMinutesLog] = useStoredState(
    STORAGE.pomodoroMinutesLog,
    {}
  );
  const todayKeyStr = (() => {
    const d = new Date();
    return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
  })();
  const todayPomodoroCount = pomodoroLog[todayKeyStr] || 0;

  const active = mode !== "idle";
  const isBreak = mode === "break";
  const minutes = isBreak ? settings.pause : settings.focus;
  const totalSeconds = minutes * 60;
  const progress = active ? ((totalSeconds - seconds) / totalSeconds) * 100 : 0;
  const accent = isBreak ? c.green : c.blue;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setClock(
        now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setClockDate(
        now.toLocaleDateString(undefined, {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      );
      setClockTick(now);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!running) return undefined;

    const interval = setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!running || seconds !== 0) return;

    if (mode === "focus") {
      setSettings((current) => ({
        ...current,
        sessions: current.sessions + 1,
      }));
      logPomodoroCompletion();
      recordStudyActivity();
      setMode("break");
      setSeconds(settings.pause * 60);
    } else {
      setMode("idle");
      setRunning(false);
      setSeconds(settings.focus * 60);
    }
  }, [seconds, running, mode, settings.focus, settings.pause, setSettings]);

  function logPomodoroCompletion() {
    setPomodoroLog((current) => ({
      ...current,
      [todayKeyStr]: (current[todayKeyStr] || 0) + 1,
    }));
    setPomodoroMinutesLog((current) => ({
      ...current,
      [todayKeyStr]: (current[todayKeyStr] || 0) + settings.focus,
    }));
  }

  function formatTime(value) {
    const min = Math.floor(value / 60);
    const sec = value % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function startTimer() {
    setMode("focus");
    setSeconds(settings.focus * 60);
    setRunning(true);
    setOpen(false);
  }

  function resetTimer() {
    setMode("idle");
    setRunning(false);
    setSeconds(settings.focus * 60);
  }

  return (
    <header
      className="app-surface app-topbar"
      style={{
        position: "relative",
        height: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: c.panel,
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      <button
        type="button"
        data-tour="pomodoro"
        onClick={() => setOpen((value) => !value)}
        aria-label={t.focusTimer}
        style={{
          minWidth: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "8px 20px",
          border: `1px solid ${active ? c.blueBorder : "transparent"}`,
          borderRadius: 18,
          background: active ? c.blueSoft : "transparent",
          color: c.text,
          cursor: "pointer",
          direction: "ltr",
          transition: "background 180ms ease, border-color 180ms ease",
        }}
      >
        {active && (
          <PomodoroRing
            c={c}
            accent={accent}
            size={40}
            progress={progress}
            isBreak={isBreak}
          />
        )}

        <span
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {active ? (
            <span
              style={{
                display: "block",
                color: accent,
                fontFamily:
                  '"Space Mono", "SFMono-Regular", Consolas, monospace',
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: ".02em",
                lineHeight: 1.05,
                fontVariantNumeric: "tabular-nums",
                textAlign: "center",
              }}
            >
              {formatTime(seconds)}
            </span>
          ) : (
            <span
              className="clock-gradient-text"
              style={{
                display: "block",
                fontFamily:
                  '"Space Mono", "SFMono-Regular", Consolas, monospace',
                fontSize: 28,
                fontWeight: 750,
                letterSpacing: ".01em",
                lineHeight: 1.05,
                fontVariantNumeric: "tabular-nums",
                textAlign: "center",
              }}
            >
              {clock}
            </span>
          )}

          <span
            style={{
              display: "block",
              marginTop: 4,
              color: active ? accent : c.muted,
              fontFamily: '"Manrope", ui-sans-serif, system-ui, sans-serif',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            {active ? (isBreak ? t.break : t.focus) : clockDate}
          </span>
        </span>
      </button>

      {active && (
        <div
          style={{
            position: "absolute",
            insetInlineEnd: 260,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            className="desktop-only"
            style={{ color: c.muted, fontSize: 12 }}
          >
            {settings.sessions} {t.sessions}
          </span>

          <IconButton
            c={c}
            title={running ? t.pause : t.resume}
            onClick={() => setRunning((value) => !value)}
          >
            <Icon name={running ? "pause" : "play"} size={16} />
          </IconButton>

          <IconButton c={c} title={t.resetTimer} onClick={resetTimer}>
            <Icon name="reset" size={16} />
          </IconButton>
        </div>
      )}

      {active && (
        <div
          style={{
            position: "absolute",
            insetInlineStart: 0,
            bottom: 0,
            width: `${Math.max(0, Math.min(100, progress))}%`,
            height: 3,
            background: accent,
            transition: "width 1s linear",
          }}
        />
      )}

      {open && !active && (
        <section
          className="fade-up"
          style={{
            position: "absolute",
            zIndex: 30,
            top: 80,
            width: "min(520px, calc(100vw - 28px))",
            padding: 16,
            borderRadius: 20,
            background: c.panel,
            border: `1px solid ${c.border}`,
            boxShadow: c.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <div>
              <div style={{ color: c.text, fontWeight: 750, fontSize: 14 }}>
                {t.focus}
              </div>
              <div style={{ color: c.secondary, fontSize: 12, marginTop: 3 }}>
                {t.chooseSession}
              </div>
            </div>

            <IconButton c={c} title={t.close} onClick={() => setOpen(false)}>
              <Icon name="close" size={17} />
            </IconButton>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 12,
            }}
          >
            {[
              [t.focus, "focus", 90],
              [t.break, "pause", 30],
            ].map(([label, key, max]) => (
              <label
                key={key}
                style={{
                  padding: 13,
                  borderRadius: 15,
                  background: c.soft,
                  border: `1px solid ${c.border}`,
                }}
              >
                <span
                  style={{ color: c.secondary, fontSize: 12, fontWeight: 650 }}
                >
                  {label}
                </span>

                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  <input
                    type="number"
                    min="1"
                    max={max}
                    value={settings[key]}
                    onChange={(event) => {
                      const value = Math.max(
                        1,
                        Math.min(max, Number(event.target.value) || 1)
                      );

                      setSettings((previous) => ({
                        ...previous,
                        [key]: value,
                      }));

                      if (key === "focus" && mode === "idle") {
                        setSeconds(value * 60);
                      }
                    }}
                    style={{
                      width: "100%",
                      border: 0,
                      outline: 0,
                      background: "transparent",
                      color: c.text,
                      fontSize: 22,
                      fontWeight: 750,
                    }}
                  />
                  <span style={{ color: c.muted, fontSize: 13 }}>
                    {t.minutes}
                  </span>
                </span>
              </label>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 7,
              marginBottom: 13,
            }}
          >
            {[15, 25, 45, 60].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setSettings((previous) => ({ ...previous, focus: value }));
                  setSeconds(value * 60);
                }}
                style={{
                  minHeight: 34,
                  borderRadius: 10,
                  border: `1px solid ${
                    settings.focus === value ? c.blueBorder : c.border
                  }`,
                  color: settings.focus === value ? c.blue : c.secondary,
                  background: settings.focus === value ? c.blueSoft : c.soft,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {value} {t.minutes}
              </button>
            ))}
          </div>

          <PrimaryButton onClick={startTimer} style={{ width: "100%" }}>
            <span
              style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
            >
              <Icon name="play" size={15} />
              {t.startFocus}
            </span>
          </PrimaryButton>
        </section>
      )}

      <ModuleSwitcher c={c} language={language} user={user} setUser={setUser} />
    </header>
  );
}

function Notebook({ c, t, onClose }) {
  const [tabs, setTabs] = useStoredState(STORAGE.notes, [
    { id: "note-1", title: "Noter", content: "" },
  ]);
  const [activeId, setActiveId] = useStoredState(STORAGE.activeNote, "note-1");
  const [renamingId, setRenamingId] = useState(null);
  const [draft, setDraft] = useState("");
  const editorRef = useRef(null);
  const renameRef = useRef(null);

  const activeTab = tabs.find((tab) => tab.id === activeId) || tabs[0];

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeId) && tabs[0]) {
      setActiveId(tabs[0].id);
    }
  }, [tabs, activeId, setActiveId]);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (activeTab?.content || "")
    ) {
      editorRef.current.innerHTML = activeTab?.content || "";
    }
  }, [activeId, activeTab?.content]);

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  function updateContent(content) {
    setTabs((previous) =>
      previous.map((tab) => (tab.id === activeId ? { ...tab, content } : tab))
    );
  }

  function command(commandName, value) {
    editorRef.current?.focus();
    document.execCommand(commandName, false, value);
    updateContent(editorRef.current?.innerHTML || "");
  }

  function addNote() {
    const id = `note-${Date.now()}`;
    const title = `${t.note} ${tabs.length + 1}`;

    setTabs((previous) => [...previous, { id, title, content: "" }]);
    setActiveId(id);
    setDraft(title);
    setRenamingId(id);
  }

  function deleteNote(id) {
    if (tabs.length === 1) {
      setTabs([{ id: "note-1", title: t.notebook, content: "" }]);
      setActiveId("note-1");
      return;
    }

    const tabIndex = tabs.findIndex((tab) => tab.id === id);
    const remainingTabs = tabs.filter((tab) => tab.id !== id);

    setTabs(remainingTabs);

    if (activeId === id) {
      setActiveId(remainingTabs[Math.max(0, tabIndex - 1)].id);
    }

    if (renamingId === id) setRenamingId(null);
  }

  function saveRename() {
    if (!renamingId) return;

    const title = draft.trim() || t.untitledNote;

    setTabs((previous) =>
      previous.map((tab) => (tab.id === renamingId ? { ...tab, title } : tab))
    );

    setRenamingId(null);
  }

  const plainText = (activeTab?.content || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = plainText ? plainText.split(" ").length : 0;

  return (
    <aside
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: c.panel,
        borderInlineStart: `1px solid ${c.border}`,
      }}
    >
      <header
        style={{
          height: 66,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          flexShrink: 0,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 32,
              height: 32,
              display: "grid",
              placeItems: "center",
              borderRadius: 10,
              background: c.blueSoft,
              color: c.blue,
            }}
          >
            <Icon name="notebook" size={16} />
          </div>

          <span style={{ color: c.text, fontWeight: 750, fontSize: 14 }}>
            {t.notebook}
          </span>
        </div>

        <div style={{ display: "flex", gap: 2 }}>
          <IconButton c={c} title={t.newNote} onClick={addNote}>
            <Icon name="plus" size={17} />
          </IconButton>

          <IconButton c={c} title={t.close} onClick={onClose}>
            <Icon name="close" size={17} />
          </IconButton>
        </div>
      </header>

      <div
        style={{
          display: "flex",
          gap: 5,
          overflowX: "auto",
          padding: "10px 10px 0",
          flexShrink: 0,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        {tabs.map((tab) => {
          const selected = tab.id === activeId;
          const editing = tab.id === renamingId;

          return (
            <div
              key={tab.id}
              style={{
                display: "flex",
                alignItems: "center",
                minWidth: 0,
                maxWidth: 145,
                marginBottom: -1,
                borderRadius: "10px 10px 0 0",
                border: `1px solid ${selected ? c.border : "transparent"}`,
                borderBottom: selected
                  ? `1px solid ${c.panel}`
                  : "1px solid transparent",
                color: selected ? c.text : c.secondary,
                background: selected ? c.panel : "transparent",
              }}
            >
              {editing ? (
                <input
                  ref={renameRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onBlur={saveRename}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      saveRename();
                    }
                    if (event.key === "Escape") setRenamingId(null);
                  }}
                  style={{
                    width: 104,
                    padding: "9px 8px",
                    border: 0,
                    outline: 0,
                    background: "transparent",
                    color: c.text,
                    fontSize: 12,
                    fontWeight: 650,
                  }}
                />
              ) : (
                <button
                  type="button"
                  title={selected ? t.renameHint : tab.title}
                  onClick={() => {
                    if (tab.id === activeId) {
                      setDraft(tab.title);
                      setRenamingId(tab.id);
                    } else {
                      setActiveId(tab.id);
                    }
                  }}
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    padding: "9px 9px",
                    border: 0,
                    background: "transparent",
                    color: "inherit",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    textAlign: "start",
                    fontSize: 12,
                    fontWeight: 650,
                    cursor: "pointer",
                  }}
                >
                  {tab.title}
                </button>
              )}

              <button
                type="button"
                title={t.deleteNote}
                onClick={() => deleteNote(tab.id)}
                style={{
                  width: 26,
                  height: 30,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  border: 0,
                  background: "transparent",
                  color: c.muted,
                  cursor: "pointer",
                }}
              >
                <Icon name="close" size={13} />
              </button>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          padding: 8,
          flexShrink: 0,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <select
          defaultValue="default"
          onChange={(event) => {
            if (event.target.value !== "default") {
              command("fontName", event.target.value);
            }
            event.target.value = "default";
          }}
          style={{
            height: 34,
            maxWidth: 88,
            padding: "0 7px",
            borderRadius: 9,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.secondary,
            fontSize: 11,
          }}
        >
          <option value="default">{t.font}</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Mono</option>
        </select>

        <IconButton
          c={c}
          title="Bold"
          onClick={() => command("bold")}
          style={{ color: c.text, fontWeight: 800 }}
        >
          B
        </IconButton>

        <IconButton
          c={c}
          title="Italic"
          onClick={() => command("italic")}
          style={{ color: c.text, fontStyle: "italic", fontWeight: 750 }}
        >
          I
        </IconButton>

        <IconButton
          c={c}
          title="Underline"
          onClick={() => command("underline")}
          style={{
            color: c.text,
            textDecoration: "underline",
            fontWeight: 750,
          }}
        >
          U
        </IconButton>

        <IconButton
          c={c}
          title="List"
          onClick={() => command("insertUnorderedList")}
        >
          <Icon name="list" size={16} />
        </IconButton>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className="rich-editor"
          data-placeholder={t.notesPlaceholder}
          onInput={(event) => updateContent(event.currentTarget.innerHTML)}
          style={{
            minHeight: "100%",
            padding: 18,
            outline: 0,
            color: c.text,
            fontSize: 15,
            lineHeight: 1.7,
          }}
        />
      </div>

      <footer
        style={{
          height: 42,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          flexShrink: 0,
          color: c.muted,
          fontSize: 11,
          borderTop: `1px solid ${c.border}`,
        }}
      >
        <span>
          {wordCount} {t.words}
        </span>
      </footer>
    </aside>
  );
}

function getMonthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

function recordStudyActivity() {
  const today = new Date();
  const key = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const streakData = JSON.parse(localStorage.getItem(STORAGE.streak) || "{}");
  const days = new Set(streakData.days || []);
  if (!days.has(key)) {
    days.add(key);
    const sortedDays = Array.from(days).sort();
    localStorage.setItem(STORAGE.streak, JSON.stringify({ days: sortedDays }));
    window.dispatchEvent(
      new CustomEvent("medlearn-storage-update", {
        detail: { key: STORAGE.streak },
      })
    );
  }
}

function computeStreak(days) {
  if (!days || days.length === 0) return { current: 0, longest: 0 };
  const sorted = [...days].sort();
  const dateSet = new Set(sorted);
  let longest = 0;
  let run = 0;
  let prev = null;
  sorted.forEach((day) => {
    const date = new Date(`${day}T00:00:00`);
    if (prev && (date - prev) / 86400000 === 1) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = date;
  });
  const today = new Date();
  let current = 0;
  const cursor = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  if (
    !dateSet.has(
      dateKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())
    )
  ) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (
    dateSet.has(
      dateKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate())
    )
  ) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return { current, longest };
}

const BADGE_DEFINITIONS = [
  {
    id: "streak-3",
    type: "streak",
    threshold: 3,
    icon: "target",
    label: { da: "3 dages streak", en: "3-day streak", ar: "تتابع 3 أيام" },
  },
  {
    id: "streak-7",
    type: "streak",
    threshold: 7,
    icon: "target",
    label: { da: "7 dages streak", en: "7-day streak", ar: "تتابع 7 أيام" },
  },
  {
    id: "streak-30",
    type: "streak",
    threshold: 30,
    icon: "target",
    label: { da: "30 dages streak", en: "30-day streak", ar: "تتابع 30 يومًا" },
  },
  {
    id: "questions-100",
    type: "questions",
    threshold: 100,
    icon: "clipboard",
    label: { da: "100 spørgsmål", en: "100 questions", ar: "100 سؤال" },
  },
  {
    id: "questions-500",
    type: "questions",
    threshold: 500,
    icon: "clipboard",
    label: { da: "500 spørgsmål", en: "500 questions", ar: "500 سؤال" },
  },
  {
    id: "questions-1000",
    type: "questions",
    threshold: 1000,
    icon: "clipboard",
    label: { da: "1000 spørgsmål", en: "1000 questions", ar: "1000 سؤال" },
  },
  {
    id: "pomodoro-10",
    type: "pomodoro",
    threshold: 10,
    icon: "clock",
    label: { da: "10 pomodoros", en: "10 pomodoros", ar: "10 بومودورو" },
  },
  {
    id: "pomodoro-50",
    type: "pomodoro",
    threshold: 50,
    icon: "clock",
    label: { da: "50 pomodoros", en: "50 pomodoros", ar: "50 بومودورو" },
  },
  {
    id: "accuracy-90",
    type: "accuracy",
    threshold: 90,
    icon: "chart",
    label: { da: "90% nøjagtighed", en: "90% accuracy", ar: "دقة 90%" },
  },
];

function computeEarnedBadges({
  streakCurrent,
  totalQuestionsAnswered,
  totalPomodoros,
  bestSessionAccuracy,
}) {
  return BADGE_DEFINITIONS.filter((badge) => {
    if (badge.type === "streak") return streakCurrent >= badge.threshold;
    if (badge.type === "questions")
      return totalQuestionsAnswered >= badge.threshold;
    if (badge.type === "pomodoro") return totalPomodoros >= badge.threshold;
    if (badge.type === "accuracy")
      return bestSessionAccuracy >= badge.threshold;
    return false;
  });
}

/* ------------------------------------------------------------------------
   LECTURE LINE RACE + POMODORO CALENDAR HEATMAP (ECharts)
   Bygger datasæt til:
   1) Et animeret "line race" pr. emnegruppe, hvor hver linje er en
      forelæsning, og y-værdien er den kumulative korrekt-procent over tid,
      baseret på session.lectures (gemt pr. quiz-session).
      Forelæsninger uden nogen besvarelser får `null` i hele arrayet, så
      ECharts (med connectNulls:false) lader dem stå helt tomme i grafen
      i stedet for at trække linjen ned til 0.
   2) Et kalender-heatmap over antal fokus-minutter pr. dag fra pomodoro-timeren.
   ------------------------------------------------------------------------ */
function buildLectureRaceData(group, lectures, sessions) {
  const groupLectures = lectures.filter((l) => l.group === group);
  const chronological = [...sessions].sort(
    (a, b) => new Date(a.completedAt) - new Date(b.completedAt)
  );

  const dateSet = new Set();
  chronological.forEach((session) => {
    if (session.lectures && Object.keys(session.lectures).length) {
      dateSet.add(session.completedAt.slice(0, 10));
    }
  });
  const dates = Array.from(dateSet).sort();

  const series = groupLectures.map((lecture) => {
    let cumCorrect = 0;
    let cumTotal = 0;
    let hasAnyData = false;
    const byDate = {};
    chronological.forEach((session) => {
      const stat = session.lectures ? session.lectures[lecture.id] : null;
      if (!stat || !stat.total) return;
      cumCorrect += stat.correct;
      cumTotal += stat.total;
      hasAnyData = true;
      const dateKeyStr = session.completedAt.slice(0, 10);
      byDate[dateKeyStr] = Math.round((cumCorrect / cumTotal) * 100);
    });

    if (!hasAnyData) {
      return {
        id: lecture.id,
        title: lecture.title,
        data: dates.map(() => null),
      };
    }

    let lastValue = null;
    const data = dates.map((d) => {
      if (byDate[d] !== undefined) lastValue = byDate[d];
      return lastValue;
    });
    return { id: lecture.id, title: lecture.title, data };
  });

  return { dates, series };
}

function LectureLineRace({ group, lectures, sessions, ink, emptyLabel }) {
  const { dates, series } = buildLectureRaceData(group, lectures, sessions);
  const hasAnyData =
    dates.length > 0 && series.some((s) => s.data.some((v) => v !== null));

  if (!hasAnyData) {
    return (
      <div
        style={{
          padding: "18px 4px",
          color: ink.muted,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {emptyLabel}
      </div>
    );
  }

  const palette = [
    ink.blue,
    ink.green,
    "#7a63f0",
    ink.red,
    "#f59e0b",
    "#0ea5b7",
    "#e879b9",
    "#8c564b",
    "#4ade80",
    "#60a5fa",
  ];

  // Fuldt navn på forelæsningen (fx "N5 · Neurofysiologi – EEG – EP") bruges som seriens navn,
  // så legenden viser navnet i stedet for blot forelæsningskoden. Legenden ligger i højre side
  // som en lodret liste med afkortet tekst + tooltip ved hover, så alle forelæsninger er synlige
  // uden at man skal scrolle, uanset hvor mange forelæsninger gruppen indeholder.
  const legendNameById = {};
  series.forEach((s) => {
    legendNameById[s.id] = s.title ? `${s.id} · ${s.title}` : s.id;
  });

  const legendHeight = Math.max(1, series.length) * 24;
  const chartHeight = Math.max(420, legendHeight + 80);

  const option = {
    backgroundColor: "transparent",
    color: palette,
    tooltip: { trigger: "axis" },
    legend: {
      orient: "vertical",
      right: 6,
      top: "middle",
      type: "plain",
      icon: "roundRect",
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 10,
      formatter: (name) => legendNameById[name] || name,
      textStyle: {
        color: ink.secondary,
        fontSize: 12,
        overflow: "truncate",
        width: 300,
      },
      tooltip: { show: true },
    },
    grid: { left: 50, right: 340, top: 24, bottom: 36, containLabel: false },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { color: ink.secondary, fontSize: 10.5 },
      axisLine: { lineStyle: { color: ink.lineStrong } },
    },
    yAxis: {
      type: "value",
      min: 0,
      max: 100,
      axisLabel: { color: ink.secondary, formatter: "{value}%", fontSize: 11 },
      splitLine: { lineStyle: { color: ink.line } },
    },
    series: series.map((s) => ({
      name: s.id,
      type: "line",
      data: s.data,
      connectNulls: false,
      showSymbol: true,
      symbolSize: 6,
      smooth: true,
      lineStyle: { width: 2.5 },
    })),
    animationDuration: 900,
    animationEasing: "cubicOut",
  };

  return <EChart option={option} height={chartHeight} />;
}

function buildPomodoroHeatmapSeries(pomodoroMinutesLog) {
  return Object.entries(pomodoroMinutesLog || {}).map(([date, minutes]) => [
    date,
    minutes,
  ]);
}

function PomodoroCalendarHeatmap({
  pomodoroMinutesLog,
  ink,
  year,
  emptyLabel,
}) {
  const data = buildPomodoroHeatmapSeries(pomodoroMinutesLog);
  const hasAnyData = data.some(([, minutes]) => minutes > 0);

  if (!hasAnyData) {
    return (
      <div
        style={{
          padding: "18px 4px",
          color: ink.muted,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        {emptyLabel}
      </div>
    );
  }

  // Fast, ikke-justerbar farveskala (piecewise) i stedet for en trækbar slider:
  // 0-30 min, 30-60 min, 1-2 timer, 2-5 timer, 5+ timer. Farverne går fra lys til mørk blå,
  // så mønstret i studieaktiviteten er let at aflæse uden at skulle interagere med grafen.
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      formatter: (p) => `${p.data[0]}<br/>${p.data[1] || 0} min fokus`,
    },
    visualMap: {
      type: "piecewise",
      show: true,
      calculable: false,
      orient: "horizontal",
      left: "center",
      bottom: 4,
      itemGap: 10,
      itemWidth: 14,
      itemHeight: 14,
      pieces: [
        { min: 0, max: 0, label: "0 min", color: ink.line },
        { min: 1, max: 30, label: "0–30 min", color: "#c9dff7" },
        { min: 31, max: 60, label: "30–60 min", color: "#8fbef0" },
        { min: 61, max: 120, label: "1–2 timer", color: "#4f97e6" },
        { min: 121, max: 300, label: "2–5 timer", color: "#1f6fd6" },
        { min: 301, label: "5+ timer", color: "#0d3f8c" },
      ],
      textStyle: { color: ink.secondary, fontSize: 11 },
    },
    calendar: {
      top: 40,
      left: 36,
      right: 24,
      bottom: 60,
      cellSize: ["auto", 24],
      range: String(year),
      itemStyle: { borderWidth: 1, borderColor: "#ffffff", color: ink.line },
      yearLabel: { show: false },
      dayLabel: { color: ink.secondary, fontSize: 10.5 },
      monthLabel: { color: ink.secondary, fontSize: 10.5 },
      splitLine: { lineStyle: { color: ink.line } },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data,
    },
  };

  return <EChart option={option} height={360} />;
}
function parseICalToEvents(icsText) {
  // Minimal VEVENT-parser: understøtter DTSTART/DTEND/SUMMARY i både heldags-
  // (VALUE=DATE) og tidsstemplet (UTC "Z" eller lokal) format. Dækker det,
  // de fleste universitets-/LMS-kalendere (f.eks. Outlook, Google Calendar,
  // Absalon/Canvas) eksporterer for forelæsningsskemaer.
  const lines = icsText.split(/\r?\n/);
  const unfolded = [];
  lines.forEach((line) => {
    if (line.startsWith(" ") && unfolded.length) {
      unfolded[unfolded.length - 1] += line.slice(1);
    } else {
      unfolded.push(line);
    }
  });
  const events = [];
  let current = null;
  unfolded.forEach((line) => {
    if (line.startsWith("BEGIN:VEVENT")) {
      current = {};
      return;
    }
    if (line.startsWith("END:VEVENT")) {
      if (current && current.dtstart) events.push(current);
      current = null;
      return;
    }
    if (!current) return;
    const [rawKey, ...rest] = line.split(":");
    const value = rest.join(":");
    const key = rawKey.split(";")[0];
    if (key === "SUMMARY") current.summary = value;
    if (key === "DTSTART") current.dtstart = value;
    if (key === "DTEND") current.dtend = value;
  });

  function parseIcsDate(raw) {
    if (!raw) return null;
    const clean = raw.replace("Z", "");
    const y = clean.slice(0, 4);
    const mo = clean.slice(4, 6);
    const d = clean.slice(6, 8);
    if (clean.length <= 8) return { date: `${y}-${mo}-${d}`, time: "" };
    const h = clean.slice(9, 11);
    const mi = clean.slice(11, 13);
    return { date: `${y}-${mo}-${d}`, time: `${h}:${mi}` };
  }

  return events
    .map((event, i) => {
      const start = parseIcsDate(event.dtstart);
      return {
        id: `ical-${Date.now()}-${i}`,
        title: event.summary || "Forelæsning",
        date: start ? start.date : "",
        time: start ? start.time : "",
        type: "study",
      };
    })
    .filter((event) => event.date);
}

function CalendarPanel({ c, t, language, theme, module, onClose }) {
  const [events, setEvents] = useStoredState(STORAGE.calendarEvents, []);
  const [plans] = useStoredState(STORAGE.studyPlans, {});

  // Robusthedsfix: hver gang kalenderen åbnes, tjekkes om den gemte
  // studieplan for det aktuelle modul allerede er repræsenteret i
  // kalenderevents. Hvis planen findes, men dens blokke mangler (fx fordi
  // de blev skrevet, mens kalenderen ikke lyttede), gen-genereres de her,
  // så "Studieplan" og "Kalender" aldrig kan gå ud af sync.
  useEffect(() => {
    const plan = plans[module];
    if (!plan) return;
    const alreadySynced = events.some((event) => event.planModuleId === module);
    if (alreadySynced) return;
    const lectures = MODULE_LECTURES[module] || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = plan.examDate ? new Date(`${plan.examDate}T00:00:00`) : null;
    const days = exam ? Math.max(0, Math.ceil((exam - today) / 86400000)) : 0;
    if (days <= 0) return;
    const doneLectureIds = plan.doneLectureIds || [];
    const pending = lectures.filter(
      (item) => !doneLectureIds.includes(item.id)
    );
    const lectureUnits =
      plan.mode === "lectures"
        ? pending.flatMap((item) =>
            Array.from({ length: item.parts || 1 }, (_, i) => ({
              ...item,
              part: (item.parts || 1) > 1 ? i + 1 : null,
            }))
          )
        : [];
    const excludedDates = plan.excludedDates || [];
    const dayDateKeys = Array.from({ length: days }, (_, i) => {
      const d = addDays(today, i);
      return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
    });
    const availableDayIndices = Array.from(
      { length: days },
      (_, i) => i
    ).filter((i) => !excludedDates.includes(dayDateKeys[i] || ""));
    const availableDaysCount = Math.max(1, availableDayIndices.length);
    const base = Math.floor(lectureUnits.length / availableDaysCount);
    const remainder = lectureUnits.length % availableDaysCount;
    const counts = Array.from(
      { length: availableDaysCount },
      (_, i) => base + (i < remainder ? 1 : 0)
    );
    const starts = [];
    let running = 0;
    for (let i = 0; i < counts.length; i++) {
      starts.push(running);
      running += counts[i];
    }
    const unitForDay = (dayIndex) => {
      const posInAvailable = availableDayIndices.indexOf(dayIndex);
      if (posInAvailable === -1) return [];
      return lectureUnits.slice(
        starts[posInAvailable] ?? 0,
        (starts[posInAvailable] ?? 0) + (counts[posInAvailable] ?? 0)
      );
    };
    const newEvents = Array.from({ length: days }, (_, index) => {
      const date = addDays(today, index);
      const units = unitForDay(index);
      const title = units.length
        ? `${module} \u00b7 ${units.map((u) => u.title).join(", ")}`
        : `${module} \u00b7 studieblok`;
      return {
        id: `studyplan-${module}-${index}`,
        title,
        date: dateKey(date.getFullYear(), date.getMonth(), date.getDate()),
        time: "18:00",
        type: "study",
        planModuleId: module,
      };
    });
    setEvents((previous) => [
      ...previous.filter((event) => event.planModuleId !== module),
      ...newEvents,
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module]);
  const today = new Date();
  const [view, setView] = useState("week"); // "day" | "week" | "month"
  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const [monthDate, setMonthDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [dayDate, setDayDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(
    dateKey(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [editingEvent, setEditingEvent] = useState(null);
  const [showLectures, setShowLectures] = useState(false);
  const [importError, setImportError] = useState("");
  const fileInputRef = useRef(null);

  const typeColors = {
    exam: { bg: c.redSoft, color: c.red },
    study: { bg: c.blueSoft, color: c.blue },
    review: { bg: c.greenSoft, color: c.green },
    other: { bg: c.soft, color: c.secondary },
  };

  const todayKey = dateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const eventsByDate = {};
  events.forEach((event) => {
    if (!eventsByDate[event.date]) eventsByDate[event.date] = [];
    eventsByDate[event.date].push(event);
  });

  function saveEvent(event) {
    // Krav 6: alt, der oprettes eller redigeres via kalenderen, og som ikke
    // eksplicit har fået en anden type, tagges automatisk som "study", så det
    // altid optræder i "Dagens plan".
    const normalized = { ...event, type: event.type || "study" };
    setEvents((previous) => {
      const exists = previous.some((item) => item.id === normalized.id);
      return exists
        ? previous.map((item) =>
            item.id === normalized.id ? normalized : item
          )
        : [...previous, normalized];
    });
    setEditingEvent(null);
  }

  function deleteEvent(id) {
    setEvents((previous) => previous.filter((item) => item.id !== id));
    setEditingEvent(null);
  }

  function moveEvent(updatedEvent) {
    setEvents((previous) =>
      previous.map((item) =>
        item.id === updatedEvent.id ? updatedEvent : item
      )
    );
  }

  function handleSlotClick(dayKeyStr, time) {
    setSelectedDate(dayKeyStr);
    setEditingEvent({
      id: `event-${Date.now()}`,
      title: "",
      date: dayKeyStr,
      time,
      type: "study",
    });
  }

  function handleWeekShift(delta) {
    setWeekStart((prev) => addDays(prev, delta * 7));
  }

  function handleMonthShift(delta) {
    setMonthDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
  }

  function handleDayShift(delta) {
    setDayDate((prev) => addDays(prev, delta));
  }

  function goToToday() {
    const now = new Date();
    setWeekStart(startOfWeek(now));
    setMonthDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setDayDate(now);
    setSelectedDate(dateKey(now.getFullYear(), now.getMonth(), now.getDate()));
  }

  function addLectureToCalendar(lecture) {
    setEditingEvent({
      id: `event-${Date.now()}`,
      title: lecture.title,
      date: selectedDate,
      time: "",
      type: "study",
      lectureId: lecture.id,
    });
  }

  function handleICalFile(fileEvent) {
    const file = fileEvent.target.files && fileEvent.target.files[0];
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseICalToEvents(String(reader.result || ""));
        if (!parsed.length) {
          setImportError(
            t.calendarICalEmpty || "Ingen hændelser fundet i filen."
          );
          return;
        }
        setEvents((previous) => [...previous, ...parsed]);
      } catch (error) {
        setImportError(t.calendarICalError || "Kunne ikke læse iCal-filen.");
      }
    };
    reader.readAsText(file);
    fileEvent.target.value = "";
  }

  const weekdayLabels = [
    t.calendarMon,
    t.calendarTue,
    t.calendarWed,
    t.calendarThu,
    t.calendarFri,
    t.calendarSat,
    t.calendarSun,
  ];

  const selectedEvents = (eventsByDate[selectedDate] || []).sort((a, b) =>
    (a.time || "").localeCompare(b.time || "")
  );

  const upcoming = events
    .filter((event) => event.date >= todayKey)
    .sort((a, b) =>
      (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""))
    )
    .slice(0, 5);

  const moduleLectures = MODULE_LECTURES[module] || [];
  const weekLabel = `${weekStart.getDate()}/${
    weekStart.getMonth() + 1
  } – ${addDays(weekStart, 6).getDate()}/${
    addDays(weekStart, 6).getMonth() + 1
  }`;
  const monthLabel = new Intl.DateTimeFormat(
    language === "da" ? "da-DK" : language === "ar" ? "ar" : "en-GB",
    { month: "long", year: "numeric" }
  ).format(monthDate);
  const dayLabel = new Intl.DateTimeFormat(
    language === "da" ? "da-DK" : language === "ar" ? "ar" : "en-GB",
    { weekday: "long", day: "numeric", month: "long" }
  ).format(dayDate);
  const currentLabel =
    view === "month" ? monthLabel : view === "day" ? dayLabel : weekLabel;

  return (
    <div
      className="fade-up"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: c.panel,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 28px",
          borderBottom: `1px solid ${c.border}`,
          flexShrink: 0,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="calendar" size={19} />
          <span style={{ color: c.text, fontWeight: 750, fontSize: 16 }}>
            {t.calendarTitle}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 3,
              padding: 3,
              borderRadius: 10,
              background: c.soft,
              border: `1px solid ${c.border}`,
            }}
          >
            {[
              ["day", t.calendarViewDay],
              ["week", t.calendarViewWeek],
              ["month", t.calendarViewMonth],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                style={{
                  height: 28,
                  padding: "0 10px",
                  borderRadius: 7,
                  border: "none",
                  background: view === value ? c.blueGradient : "transparent",
                  color: view === value ? "#fff" : c.secondary,
                  fontWeight: 750,
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              view === "month"
                ? handleMonthShift(-1)
                : view === "day"
                ? handleDayShift(-1)
                : handleWeekShift(-1)
            }
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.secondary,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="left" size={15} />
          </button>
          <span
            style={{
              fontSize: 12,
              fontWeight: 750,
              color: c.text,
              minWidth: 120,
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            {currentLabel}
          </span>
          <button
            type="button"
            onClick={() =>
              view === "month"
                ? handleMonthShift(1)
                : view === "day"
                ? handleDayShift(1)
                : handleWeekShift(1)
            }
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.secondary,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Icon name="right" size={15} />
          </button>
          <button
            type="button"
            onClick={goToToday}
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 9,
              border: `1px solid ${c.blueBorder}`,
              background: c.blueSoft,
              color: c.blue,
              fontWeight: 750,
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            {t.calendarToday}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".ics,text/calendar"
            style={{ display: "none" }}
            onChange={handleICalFile}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            style={{
              height: 34,
              padding: "0 12px",
              borderRadius: 9,
              border: `1px solid ${c.borderStrong}`,
              background: "transparent",
              color: c.text,
              fontWeight: 700,
              fontSize: 11,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name="calendar" size={14} />
            {t.calendarImportICal}
          </button>
          <IconButton c={c} title={t.close} onClick={onClose}>
            <Icon name="close" size={18} />
          </IconButton>
        </div>
      </header>

      {importError && (
        <div
          style={{
            padding: "8px 28px",
            background: c.redSoft,
            color: c.red,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {importError}
        </div>
      )}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          gap: 24,
          padding: 24,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "1 1 auto",
            minWidth: 0,
            minHeight: 640,
            borderRadius: 16,
            border: `1px solid ${c.border}`,
            overflow: "hidden",
            display: "flex",
          }}
        >
          {view === "month" ? (
            <MonthCalendar
              c={c}
              events={events}
              monthDate={monthDate}
              weekdayLabels={weekdayLabels}
              onDayClick={(dayKeyStr) => {
                setSelectedDate(dayKeyStr);
                setView("day");
                setDayDate(new Date(`${dayKeyStr}T00:00:00`));
              }}
              onEventClick={(event) => {
                setSelectedDate(event.date);
                setEditingEvent(event);
              }}
            />
          ) : (
            <WeekCalendar
              c={c}
              events={events}
              weekStart={view === "day" ? dayDate : weekStart}
              daysCount={view === "day" ? 1 : 7}
              weekdayLabels={
                view === "day"
                  ? [weekdayLabels[(dayDate.getDay() + 6) % 7]]
                  : weekdayLabels
              }
              onMoveEvent={moveEvent}
              onSlotClick={handleSlotClick}
              onEventClick={(event) => {
                setSelectedDate(event.date);
                setEditingEvent(event);
              }}
            />
          )}
        </div>

        <div
          style={{
            width: 340,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span style={{ color: c.text, fontWeight: 700, fontSize: 12 }}>
                {selectedDate}
              </span>
              <button
                type="button"
                onClick={() =>
                  setEditingEvent({
                    id: `event-${Date.now()}`,
                    title: "",
                    date: selectedDate,
                    time: "",
                    type: "study",
                  })
                }
                style={{
                  border: `1px dashed ${c.borderStrong}`,
                  borderRadius: 8,
                  background: "transparent",
                  color: c.blue,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: "5px 9px",
                }}
              >
                + {t.calendarAddEvent}
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <p style={{ color: c.muted, fontSize: 12 }}>
                {t.calendarNoEvents}
              </p>
            ) : (
              <div style={{ display: "grid", gap: 7 }}>
                {selectedEvents.map((event) => {
                  const palette = typeColors[event.type] || typeColors.other;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => setEditingEvent(event)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "9px 11px",
                        borderRadius: 10,
                        border: `1px solid ${c.border}`,
                        background: palette.bg,
                        cursor: "pointer",
                        textAlign: "start",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: palette.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: 12,
                          fontWeight: 650,
                          color: c.text,
                        }}
                      >
                        {event.title}
                      </span>
                      {event.time && (
                        <span
                          style={{
                            fontSize: 11,
                            color: c.secondary,
                            fontWeight: 700,
                          }}
                        >
                          {event.time}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowLectures((prev) => !prev)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 11px",
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: c.soft,
                color: c.text,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                marginBottom: showLectures ? 10 : 0,
              }}
            >
              {t.calendarLecturesTitle}
              <Icon name={showLectures ? "up" : "down"} size={14} />
            </button>
            {showLectures && (
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {moduleLectures.length === 0 ? (
                  <p style={{ color: c.muted, fontSize: 11 }}>
                    {t.calendarNoLectures}
                  </p>
                ) : (
                  moduleLectures.map((lecture) => (
                    <button
                      key={lecture.id}
                      type="button"
                      onClick={() => addLectureToCalendar(lecture)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 9px",
                        borderRadius: 8,
                        border: `1px solid ${c.border}`,
                        background: "transparent",
                        color: c.secondary,
                        fontSize: 11,
                        fontWeight: 650,
                        cursor: "pointer",
                        textAlign: "start",
                      }}
                    >
                      <Icon name="plus" size={12} />
                      {lecture.title}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div>
            <div
              style={{
                color: c.text,
                fontWeight: 700,
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {t.calendarUpcoming}
            </div>
            {upcoming.length === 0 ? (
              <p style={{ color: c.muted, fontSize: 12 }}>
                {t.calendarNoUpcoming}
              </p>
            ) : (
              <div style={{ display: "grid", gap: 7 }}>
                {upcoming.map((event) => {
                  const palette = typeColors[event.type] || typeColors.other;
                  return (
                    <div
                      key={event.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 10px",
                        borderRadius: 10,
                        background: c.soft,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 99,
                          background: palette.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          fontSize: 12,
                          fontWeight: 600,
                          color: c.text,
                        }}
                      >
                        {event.title}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          color: c.muted,
                          fontWeight: 700,
                        }}
                      >
                        {event.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {editingEvent && (
        <Modal c={c} onClose={() => setEditingEvent(null)}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
              {events.some((e) => e.id === editingEvent.id)
                ? t.calendarEditEvent
                : t.calendarAddEvent}
            </div>
            <IconButton
              c={c}
              title={t.close}
              onClick={() => setEditingEvent(null)}
            >
              <Icon name="close" size={17} />
            </IconButton>
          </header>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.secondary,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t.calendarEventTitle}
              </label>
              <input
                value={editingEvent.title}
                onChange={(event) =>
                  setEditingEvent((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                placeholder={t.calendarEventTitlePlaceholder}
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                  background: c.soft,
                  color: c.text,
                  fontSize: 13,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c.secondary,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {t.calendarEventDate}
                </label>
                <input
                  type="date"
                  value={editingEvent.date}
                  onChange={(event) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 10px",
                    borderRadius: 10,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 13,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c.secondary,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {t.calendarEventTime}
                </label>
                <input
                  type="time"
                  value={editingEvent.time}
                  onChange={(event) =>
                    setEditingEvent((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 10px",
                    borderRadius: 10,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 13,
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.secondary,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t.calendarEventType}
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  ["exam", t.calendarTypeExam],
                  ["study", t.calendarTypeStudy],
                  ["review", t.calendarTypeReview],
                  ["other", t.calendarTypeOther],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setEditingEvent((prev) => ({ ...prev, type: value }))
                    }
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 9,
                      border: `1px solid ${
                        editingEvent.type === value ? c.blueBorder : c.border
                      }`,
                      background:
                        editingEvent.type === value ? c.blueSoft : c.soft,
                      color: editingEvent.type === value ? c.blue : c.secondary,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 6,
              }}
            >
              {events.some((e) => e.id === editingEvent.id) ? (
                <button
                  type="button"
                  onClick={() => deleteEvent(editingEvent.id)}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    border: `1px solid ${c.red}`,
                    borderRadius: 10,
                    background: c.redSoft,
                    color: c.red,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t.calendarDelete}
                </button>
              ) : (
                <div />
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    border: `1px solid ${c.borderStrong}`,
                    borderRadius: 10,
                    background: "transparent",
                    color: c.text,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t.calendarCancel}
                </button>
                <PrimaryButton
                  onClick={() => {
                    if (!editingEvent.title.trim() || !editingEvent.date)
                      return;
                    saveEvent(editingEvent);
                  }}
                >
                  {t.calendarSave}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SessionSetup({
  c,
  t,
  language,
  user,
  spacedData,
  importedQuestions,
  questionOverrides,
  onStart,
  onCancel,
  onOpenLectureMenu,
  onResetAllProgress,
}) {
  const [groupFilter, setGroupFilter] = useState(null);
  const [lectureFilter, setLectureFilter] = useState(null);
  const [mode, setMode] = useState("all");
  const [studyMode, setStudyMode] = useState("flashcard");
  const [resetDialog, setResetDialog] = useState(null);

  const lectures = MODULE_LECTURES[user.module] || [];
  const groups = [...new Set(lectures.map((l) => l.group))];
  const lecturesInGroup = groupFilter
    ? lectures.filter((l) => l.group === groupFilter)
    : [];

  function countStats(questions) {
    let due = 0;
    let fresh = 0;
    questions.forEach((q) => {
      const card = spacedData[q.id];
      if (!card) fresh += 1;
      else if (isDue(card)) due += 1;
    });
    return { due, fresh, total: questions.length };
  }

  const allQuestionsPool = getFullQuestionBank(
    importedQuestions,
    questionOverrides
  );
  const moduleQuestions = allQuestionsPool.filter(
    (q) => q.moduleId === user.module
  );
  const allStats = countStats(moduleQuestions);

  function statsForGroup(group) {
    const idsInGroup = lectures
      .filter((l) => l.group === group)
      .map((l) => l.id);
    return countStats(
      moduleQuestions.filter((q) => idsInGroup.includes(q.lectureId))
    );
  }

  function statsForLecture(lectureId) {
    return countStats(moduleQuestions.filter((q) => q.lectureId === lectureId));
  }

  function StatBadges({ stats }) {
    if (stats.total === 0) return null;
    return (
      <span
        style={{ display: "inline-flex", gap: 6, marginInlineStart: "auto" }}
      >
        {stats.due > 0 && (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: 8,
              background: c.blueSoft,
              color: c.blue,
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {stats.due}
          </span>
        )}
        {stats.fresh > 0 && (
          <span
            style={{
              padding: "2px 7px",
              borderRadius: 8,
              background: c.greenSoft,
              color: c.green,
              fontSize: 10,
              fontWeight: 800,
            }}
          >
            {stats.fresh}
          </span>
        )}
      </span>
    );
  }

  const selectionStats = lectureFilter
    ? statsForLecture(lectureFilter)
    : groupFilter
    ? statsForGroup(groupFilter)
    : allStats;

  function start() {
    if (!studyMode) return;
    onStart({
      moduleId: user.module,
      groupFilter,
      lectureFilter,
      mode,
      studyMode,
    });
  }

  function resetSelectedScope() {
    const selectedIds = new Set(
      (lectureFilter
        ? moduleQuestions.filter((q) => q.lectureId === lectureFilter)
        : groupFilter
        ? moduleQuestions.filter((q) =>
            lectures
              .filter((l) => l.group === groupFilter)
              .some((l) => l.id === q.lectureId)
          )
        : moduleQuestions
      ).map((q) => q.id)
    );
    if (!selectedIds.size) return;
    setResetDialog({
      type: "selected",
      ids: [...selectedIds],
      label: "det valgte område",
    });
  }

  function confirmReset() {
    if (!resetDialog) return;
    if (resetDialog.type === "all") onResetAllProgress(() => ({}));
    else
      onResetAllProgress((previous) => {
        const next = { ...previous };
        resetDialog.ids.forEach((id) => delete next[id]);
        return next;
      });
    setResetDialog(null);
  }

  return (
    <div
      data-tour="mcq-room"
      className="fade-up"
      style={{ width: "min(720px,100%)", margin: "0 auto" }}
    >
      {resetDialog && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bekræft nulstilling"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1001,
            display: "grid",
            placeItems: "center",
            padding: 20,
            background: c.overlay,
          }}
        >
          <div
            className="fade-up"
            style={{
              width: "min(390px,100%)",
              padding: 22,
              borderRadius: 18,
              background: c.panel,
              border: `1px solid ${c.border}`,
            }}
          >
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: 38,
                height: 38,
                marginBottom: 13,
                borderRadius: 11,
                background: c.redSoft,
                color: c.red,
              }}
            >
              <Icon name="reset" size={18} />
            </div>
            <h2 style={{ margin: "0 0 7px", color: c.text, fontSize: 18 }}>
              Nulstil progress?
            </h2>
            <p
              style={{
                margin: "0 0 19px",
                color: c.secondary,
                fontSize: 13,
                lineHeight: 1.5,
              }}
            >
              Dette sletter planlægning og review-historik for{" "}
              {resetDialog.label}. Handlingen kan ikke fortrydes.
            </p>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <button
                type="button"
                onClick={() => setResetDialog(null)}
                style={{
                  minHeight: 38,
                  padding: "0 12px",
                  borderRadius: 9,
                  border: `1px solid ${c.border}`,
                  background: c.panel,
                  color: c.secondary,
                  fontWeight: 750,
                  cursor: "pointer",
                }}
              >
                Annuller
              </button>
              <button
                type="button"
                onClick={confirmReset}
                style={{
                  minHeight: 38,
                  padding: "0 12px",
                  borderRadius: 9,
                  border: `1px solid ${c.red}`,
                  background: c.redSoft,
                  color: c.red,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Nulstil
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 style={{ color: c.text, fontSize: 28, marginBottom: 8 }}>
        {t.chooseSessionScope}
      </h1>
      <p style={{ color: c.secondary, fontSize: 13, marginBottom: 12 }}>
        {user.module}
      </p>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginBottom: 24,
        }}
      >
        <button
          type="button"
          onClick={resetSelectedScope}
          style={{
            minHeight: 34,
            padding: "0 10px",
            borderRadius: 9,
            border: `1px solid ${c.border}`,
            background: c.panel,
            color: c.secondary,
            fontSize: 11,
            fontWeight: 750,
            cursor: "pointer",
          }}
        >
          Nulstil valgte
        </button>
        <button
          type="button"
          onClick={() =>
            setResetDialog({ type: "all", label: "alle MCQ-kort" })
          }
          style={{
            minHeight: 34,
            padding: "0 10px",
            borderRadius: 9,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.secondary,
            fontSize: 11,
            fontWeight: 750,
            cursor: "pointer",
          }}
        >
          Nulstil alle
        </button>
      </div>

      {lectures.length > 0 ? (
        <>
          <div style={{ display: "grid", gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => {
                setGroupFilter(null);
                setLectureFilter(null);
              }}
              style={{
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                textAlign: "start",
                borderRadius: 12,
                border: `1px solid ${!groupFilter ? c.blueBorder : c.border}`,
                background: !groupFilter ? c.blueSoft : c.soft,
                color: !groupFilter ? c.blue : c.text,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.allTopics}
              <StatBadges stats={allStats} />
            </button>
            {groups.map((group) => {
              const stats = statsForGroup(group);
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => {
                    setGroupFilter(group);
                    setLectureFilter(null);
                  }}
                  style={{
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 16px",
                    textAlign: "start",
                    borderRadius: 12,
                    border: `1px solid ${
                      groupFilter === group ? c.blueBorder : c.border
                    }`,
                    background: groupFilter === group ? c.blueSoft : c.soft,
                    color: groupFilter === group ? c.blue : c.text,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {group}
                  <StatBadges stats={stats} />
                </button>
              );
            })}
          </div>

          {groupFilter && (
            <div
              style={{
                display: "grid",
                gap: 8,
                marginBottom: 24,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              <button
                type="button"
                onClick={() => setLectureFilter(null)}
                style={{
                  minHeight: 40,
                  padding: "0 14px",
                  textAlign: "start",
                  borderRadius: 10,
                  border: `1px solid ${
                    !lectureFilter ? c.blueBorder : c.border
                  }`,
                  background: !lectureFilter ? c.blueSoft : "transparent",
                  color: !lectureFilter ? c.blue : c.secondary,
                  fontWeight: 650,
                  cursor: "pointer",
                }}
              >
                {t.allLecturesInGroup}
              </button>
              {lecturesInGroup.map((lecture) => {
                const stats = statsForLecture(lecture.id);
                return (
                  <div
                    key={lecture.id}
                    style={{ display: "flex", gap: 6, alignItems: "stretch" }}
                  >
                    <button
                      type="button"
                      onClick={() => setLectureFilter(lecture.id)}
                      style={{
                        flex: 1,
                        minHeight: 40,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        textAlign: "start",
                        borderRadius: 10,
                        border: `1px solid ${
                          lectureFilter === lecture.id ? c.blueBorder : c.border
                        }`,
                        background:
                          lectureFilter === lecture.id
                            ? c.blueSoft
                            : "transparent",
                        color:
                          lectureFilter === lecture.id ? c.blue : c.secondary,
                        fontWeight: 650,
                        cursor: "pointer",
                      }}
                    >
                      {lecture.title}
                      <StatBadges stats={stats} />
                    </button>
                    <button
                      type="button"
                      title={t.lectureMenu}
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenLectureMenu &&
                          onOpenLectureMenu(lecture, user.module);
                      }}
                      style={{
                        width: 40,
                        minHeight: 40,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 10,
                        border: `1px solid ${c.border}`,
                        background: "transparent",
                        color: c.secondary,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <Icon name="more" size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <p style={{ color: c.secondary, fontSize: 13, marginBottom: 20 }}>
          {t.noQuestionsInLecture}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: 14,
          marginBottom: 14,
          padding: "10px 12px",
          borderRadius: 12,
          background: c.soft,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: c.secondary,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 99,
              background: c.blue,
            }}
          />
          {t.reviewCard}
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: c.secondary,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 99,
              background: c.green,
            }}
          />
          {t.newCard}
        </span>
      </div>

      <section
        style={{
          marginBottom: 20,
          padding: 16,
          borderRadius: 16,
          background: c.panel,
          border: `1px solid ${c.border}`,
        }}
      >
        <div
          style={{
            marginBottom: 10,
            color: c.text,
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          Vælg sessionstype
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
            gap: 8,
          }}
        >
          {[
            {
              key: "exam",
              title: "Eksamensmode",
              text: "Ingen feedback undervejs",
              icon: "clock",
            },
            {
              key: "flashcard",
              title: "Flashcard mode",
              text: "Vurdér med Igen, Svær, God eller Nem",
              icon: "clipboard",
            },
            {
              key: "recall",
              title: "Active recall",
              text: "Gengiv svaret selv, se derefter facit",
              icon: "brain",
            },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setStudyMode(option.key)}
              style={{
                minHeight: 78,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                textAlign: "left",
                borderRadius: 12,
                border: `1px solid ${
                  studyMode === option.key ? c.blueBorder : c.border
                }`,
                background: studyMode === option.key ? c.blueSoft : c.soft,
                color: studyMode === option.key ? c.blue : c.text,
                cursor: "pointer",
              }}
            >
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: 7 }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background:
                      studyMode === option.key
                        ? "rgba(22,101,234,.14)"
                        : c.panel,
                    color: studyMode === option.key ? c.blue : c.secondary,
                  }}
                >
                  <Icon name={option.icon} size={14} />
                </span>
                <span style={{ fontSize: 12, fontWeight: 800 }}>
                  {option.title}
                </span>
              </span>
              <span
                style={{
                  fontSize: 10.5,
                  color: studyMode === option.key ? c.blue : c.secondary,
                }}
              >
                {option.text}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => setMode("due")}
          style={{
            flex: 1,
            minHeight: 52,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            borderRadius: 12,
            border: `1px solid ${mode === "due" ? c.blueBorder : c.border}`,
            background: mode === "due" ? c.blueSoft : c.soft,
            color: mode === "due" ? c.blue : c.text,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <span>{t.dueMode}</span>
          <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.75 }}>
            {t.dueCount(selectionStats.due)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setMode("all")}
          style={{
            flex: 1,
            minHeight: 52,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            borderRadius: 12,
            border: `1px solid ${mode === "all" ? c.blueBorder : c.border}`,
            background: mode === "all" ? c.blueSoft : c.soft,
            color: mode === "all" ? c.blue : c.text,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          <span>{t.allMode}</span>
          <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.75 }}>
            {t.newCountLabel(selectionStats.fresh)}
          </span>
        </button>
      </div>
      <p
        style={{
          color: c.muted,
          fontSize: 12,
          marginTop: -14,
          marginBottom: 20,
        }}
      >
        {selectionStats.total === 0 ? t.noNewOrDue : t.lectureModeHint}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            minHeight: 44,
            padding: "0 16px",
            border: `1px solid ${c.borderStrong}`,
            borderRadius: 12,
            color: c.text,
            fontWeight: 700,
            background: "transparent",
            cursor: "pointer",
          }}
        >
          {t.back}
        </button>
        <PrimaryButton
          onClick={start}
          disabled={!studyMode}
          style={{ flex: 1, opacity: studyMode ? 1 : 0.5 }}
        >
          {studyMode ? t.start : "Vælg sessionstype"}
        </PrimaryButton>
      </div>
    </div>
  );
}

function MCQ({
  c,
  t,
  language,
  questionSize,
  user,
  questionPool,
  sessionScope,
  spacedData,
  setSpacedData,
  buriedCards,
  setBuriedCards,
  onOpenLectureList,
  deckSettings,
  onResetProgress,
  onExitToOverview,
}) {
  const [cardMenuOpen, setCardMenuOpen] = useState(false);
  const [cardMenuNotice, setCardMenuNotice] = useState(null);
  const [flagModalOpen, setFlagModalOpen] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [flaggedQuestions, setFlaggedQuestions] = useStoredState(
    STORAGE.flaggedQuestions,
    []
  );
  // An empty array means every card in this scope is scheduled for a future day.
  // Only an omitted prop may use the global fallback bank.
  //
  // IMPORTANT: snapshot the pool once per session instead of re-deriving it from the
  // live questionPool prop on every render. The parent recomputes questionPool from
  // buildQuestionPool(sessionScope, spacedData, ...) using LIVE spacedData, so as soon as
  // the last due card in this session gets a day-based rating, that card's spaced-repetition
  // due date moves to a future day and buildQuestionPool filters it straight back out of
  // "today's queue" — shrinking or emptying the pool mid-session. Without snapshotting,
  // this broke both symptoms reported: the stats screen sometimes failed to trigger
  // (finishSession's guard checked a live pool.length that had already changed), and the
  // "review questions" button on the stats screen searched a pool that no longer contained
  // the just-answered questions, so review() silently found nothing to jump to.
  const initialPoolRef = useRef(
    Array.isArray(questionPool) ? questionPool : QUESTIONS
  );
  const pool = initialPoolRef.current;
  const [history, setHistory] = useStoredState(STORAGE.quizHistory, []);
  const [savedSession, setSavedSession] = useState(false);

  const resumeKey = `${user?.module || ""}::${
    sessionScope ? JSON.stringify(sessionScope) : "all"
  }`;
  const savedResume = (() => {
    try {
      const raw = JSON.parse(
        localStorage.getItem(STORAGE.resumeSession) || "null"
      );
      return raw && raw.resumeKey === resumeKey ? raw : null;
    } catch {
      return null;
    }
  })();

  const [index, setIndex] = useState(savedResume?.index || 0);
  const [answers, setAnswers] = useState(savedResume?.answers || {});
  const isExamMode = sessionScope?.studyMode === "exam";
  const isRecallMode = sessionScope?.studyMode === "recall";
  const [feedback, setFeedback] = useState(
    () => sessionScope?.studyMode !== "exam"
  );
  const [recallRevealed, setRecallRevealed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState(() => Date.now());
  const [waitingForDue, setWaitingForDue] = useState(false);
  // Session counters describe presentations in this viewer, not only unique source questions.
  const [sessionCardTotal, setSessionCardTotal] = useState(() => pool.length);
  const [sessionCardPosition, setSessionCardPosition] = useState(() =>
    Math.min((savedResume?.index || 0) + 1, pool.length || 1)
  );
  const [sessionReviews, setSessionReviews] = useState([]);
  const cardShownAtRef = useRef(Date.now());
  const [, setDuePulse] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setDuePulse((value) => value + 1),
      15000
    );
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (finished) return;
    localStorage.setItem(
      STORAGE.resumeSession,
      JSON.stringify({ resumeKey, index, answers, updatedAt: Date.now() })
    );
  }, [resumeKey, index, answers, finished]);

  const question = pool[index] || null;
  const selectedAnswer = question ? answers[question.id] : undefined;
  useEffect(() => {
    cardShownAtRef.current = Date.now();
  }, [question?.id, sessionCardPosition]);
  useEffect(() => {
    setRecallRevealed(false);
  }, [question?.id, sessionCardPosition]);
  const total = pool.length;
  const cardsLeftToday = pool.filter((item) =>
    sm2IsInTodayQueue(spacedData[item.id])
  ).length;
  const cardsCompletedToday = Math.max(0, total - cardsLeftToday);
  const todayProgress = total
    ? Math.min(100, Math.round((cardsCompletedToday / total) * 100))
    : 100;
  const answered = Object.keys(answers).length;

  const correct = pool.reduce(
    (sum, item) => sum + (answers[item.id] === item.correct ? 1 : 0),
    0
  );

  const incorrect = pool.reduce(
    (sum, item) =>
      sum +
      (answers[item.id] !== undefined && answers[item.id] !== item.correct
        ? 1
        : 0),
    0
  );

  const unanswered = total - answered;
  const score = total ? Math.round((correct / total) * 100) : 0;

  const resultsByCategory = pool.reduce((groups, item) => {
    const category = translate(item.category, language);

    if (!groups[category]) {
      groups[category] = { total: 0, correct: 0, incorrect: 0, unanswered: 0 };
    }

    groups[category].total += 1;

    if (answers[item.id] === item.correct) groups[category].correct += 1;
    else if (answers[item.id] === undefined) groups[category].unanswered += 1;
    else groups[category].incorrect += 1;

    return groups;
  }, {});

  const resultsByLecture = pool.reduce((groups, item) => {
    const lectureKey = item.lectureId || null;
    if (!lectureKey) return groups;
    if (!groups[lectureKey]) {
      groups[lectureKey] = {
        total: 0,
        correct: 0,
        incorrect: 0,
        unanswered: 0,
      };
    }
    groups[lectureKey].total += 1;
    if (answers[item.id] === item.correct) groups[lectureKey].correct += 1;
    else if (answers[item.id] === undefined) groups[lectureKey].unanswered += 1;
    else groups[lectureKey].incorrect += 1;
    return groups;
  }, {});

  const categories = Object.entries(resultsByCategory);

  useEffect(() => {
    // When the final active card is scheduled to a future day, open the normal
    // session summary rather than rendering an empty-state MCQ panel.
    if (!finished && pool.length === 0 && sessionCardPosition > 1)
      finishSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.length]);

  const weakestCategory =
    categories
      .filter(([, result]) => result.incorrect > 0 || result.unanswered > 0)
      .sort(
        ([, first], [, second]) =>
          first.correct / first.total - second.correct / second.total
      )[0]?.[0] || null;

  const RATING_WEIGHT = {
    [SM2_RATING.AGAIN]: 0,
    [SM2_RATING.HARD]: 1,
    [SM2_RATING.GOOD]: 2,
    [SM2_RATING.EASY]: 3,
  };
  const flashcardCategoryStats = (() => {
    const byCategory = {};
    sessionReviews.forEach((review) => {
      const sourceQuestion = pool.find((item) => item.id === review.questionId);
      const categoryName = sourceQuestion
        ? translate(sourceQuestion.category, language)
        : "Andet";
      if (!byCategory[categoryName])
        byCategory[categoryName] = { total: 0, weightSum: 0, againCount: 0 };
      byCategory[categoryName].total += 1;
      byCategory[categoryName].weightSum += RATING_WEIGHT[review.rating] ?? 2;
      if (review.rating === SM2_RATING.AGAIN)
        byCategory[categoryName].againCount += 1;
    });
    return Object.entries(byCategory).map(([name, stat]) => ({
      name,
      total: stat.total,
      qualityPercent: Math.round((stat.weightSum / (stat.total * 3)) * 100),
      againCount: stat.againCount,
    }));
  })();
  const weakestFlashcardCategory =
    [...flashcardCategoryStats].sort(
      (a, b) => a.qualityPercent - b.qualityPercent
    )[0] || null;
  const totalRatingsGiven = sessionReviews.length;
  const againShare = totalRatingsGiven
    ? Math.round(
        (sessionReviews.filter((r) => r.rating === SM2_RATING.AGAIN).length /
          totalRatingsGiven) *
          100
      )
    : 0;

  const hardestReview =
    [...sessionReviews].sort(
      (a, b) => a.rating - b.rating || b.seconds - a.seconds
    )[0] || null;
  const hardestQuestionText = hardestReview?.questionText || null;
  const totalReviewSeconds = sessionReviews.reduce(
    (sum, item) => sum + item.seconds,
    0
  );
  const actualElapsedSeconds = Math.max(
    1,
    Math.round((Date.now() - sessionStartedAt) / 1000)
  );
  const averageReviewSeconds = sessionReviews.length
    ? Math.round(totalReviewSeconds / sessionReviews.length)
    : 0;
  const formatSessionTime = (seconds) =>
    seconds >= 60
      ? `${Math.floor(seconds / 60)} min ${seconds % 60} sek`
      : `${seconds} sek`;
  const ratingCounts = SM2_RATING_ORDER.reduce(
    (counts, item) => ({
      ...counts,
      [item.key]: sessionReviews.filter((review) => review.rating === item.key)
        .length,
    }),
    {}
  );

  function finishSession() {
    if (!savedSession) {
      const session = {
        id: `session-${Date.now()}`,
        completedAt: new Date().toISOString(),
        module: user?.module || "",
        total,
        answered,
        correct,
        incorrect,
        score,
        durationSeconds: Math.max(
          1,
          Math.round((Date.now() - sessionStartedAt) / 1000)
        ),
        reviewSeconds: totalReviewSeconds,
        averageReviewSeconds,
        hardestQuestionId: hardestReview?.questionId || null,
        ratingCounts,
        wrongQuestionIds: pool
          .filter(
            (item) =>
              answers[item.id] !== undefined &&
              answers[item.id] !== item.correct
          )
          .map((item) => item.id),
        categories: Object.fromEntries(
          categories.map(([name, result]) => [
            name,
            { total: result.total, correct: result.correct },
          ])
        ),
        lectures: Object.fromEntries(
          Object.entries(resultsByLecture).map(([lectureId, result]) => [
            lectureId,
            { total: result.total, correct: result.correct },
          ])
        ),
      };
      setHistory((previous) => [...previous, session].slice(-100));
      setSavedSession(true);
      recordStudyActivity();
    }
    setFinished(true);
    localStorage.removeItem(STORAGE.resumeSession);
  }

  function advanceAfterRating(updatedCard, rating) {
    setSessionReviews((previous) => [
      ...previous,
      {
        questionId: question.id,
        questionText: translate(question.question, language),
        rating: rating ?? SM2_RATING.GOOD,
        seconds: Math.max(
          1,
          Math.round((Date.now() - cardShownAtRef.current) / 1000)
        ),
      },
    ]);
    const nextSpacedData = { ...spacedData, [question.id]: updatedCard };
    const nextAnswers = { ...answers };
    delete nextAnswers[question.id];
    setAnswers(nextAnswers);

    const nextDue = sm2CardDueMs(updatedCard);
    const staysInTodayQueue = nextDue == null || nextDue < sm2StartOfTomorrow();
    if (staysInTodayQueue) {
      // A short-step answer creates one more presentation in this same MCQ viewer.
      // It never opens a separate waiting/result screen.
      setSessionCardTotal((value) => value + 1);
      setSessionCardPosition((value) => value + 1);
      setWaitingForDue(false);
      const otherDueIndex = sm2NextDueQuestionIndex(
        pool,
        nextSpacedData,
        nextAnswers,
        index
      );
      if (otherDueIndex !== null) setIndex(otherDueIndex);
      // With one card, index deliberately remains unchanged: the MCQ is shown again.
      return;
    }

    // A day-based rating completes this presentation. Do not increment the
    // numerator: there is no extra card instance to show in this session.
    // Clamp the counter, which prevents impossible displays such as 4/3.
    setSessionCardPosition((value) => Math.min(value, sessionCardTotal));
    const nextIndex = sm2NextDueQuestionIndex(
      pool,
      nextSpacedData,
      nextAnswers,
      index
    );
    if (nextIndex !== null) {
      setIndex(nextIndex);
    } else {
      // No other due or unseen card remains in this pool. Without this branch the
      // session viewer would silently stall on the last answered card, and the
      // stats/summary screen would never appear (this was the reported bug).
      finishSession();
    }
    // The parent rebuilds the pool immediately. This just-scheduled card is excluded
    // until its saved day-based due timestamp, so it cannot reappear in this session.
  }

  function chooseAnswer(optionIndex) {
    if (reviewMode || (feedback && selectedAnswer !== undefined)) return;

    if (isExamMode) {
      setSessionReviews((previous) => [
        ...previous,
        {
          questionId: question.id,
          questionText: translate(question.question, language),
          rating:
            optionIndex === question.correct
              ? SM2_RATING.GOOD
              : SM2_RATING.AGAIN,
          seconds: Math.max(
            1,
            Math.round((Date.now() - cardShownAtRef.current) / 1000)
          ),
        },
      ]);
    }
    setAnswers((previous) => ({
      ...previous,
      [question.id]: optionIndex,
    }));

    // NOTE (app-51): scheduling no longer happens here. The legacy SM-2
    // scheduler now runs only when the user explicitly rates the card via
    // SM2AnswerFooter (Igen/Svær/God/Nem), after the explanation is shown.
  }

  function flashNotice(message) {
    setCardMenuNotice(message);
    setTimeout(() => setCardMenuNotice(null), 2200);
  }

  function buryCurrentCard() {
    if (setBuriedCards) {
      setBuriedCards((previous) => ({ ...previous, [question.id]: true }));
    }
    setCardMenuOpen(false);
    flashNotice(t.cardBuried);
    if (index < pool.length - 1) {
      setIndex((value) => value + 1);
    } else {
      setFinished(true);
    }
  }

  function resetCurrentCard() {
    if (setSpacedData) {
      setSpacedData((previous) => {
        const next = { ...previous };
        delete next[question.id];
        return next;
      });
    }
    setCardMenuOpen(false);
    flashNotice(t.cardReset);
  }

  function resetAllProgress() {
    if (onResetProgress && !onResetProgress()) return;
    setAnswers({});
    setIndex(0);
    setSessionCardPosition(1);
    setSessionCardTotal(pool.length || 1);
    setWaitingForDue(false);
  }

  function restart() {
    if (onExitToOverview) {
      onExitToOverview();
      return;
    }
    setSavedSession(false);
    setAnswers({});
    setIndex(0);
    setFinished(false);
    setReviewMode(false);
    setSessionStartedAt(Date.now());
    setSessionReviews([]);
    setSessionCardTotal(pool.length || 1);
    setSessionCardPosition(1);
  }

  function status() {
    if (score === 100) {
      return {
        title: t.perfectSession,
        description: t.perfectDescription,
        color: c.green,
        background: c.greenSoft,
      };
    }

    if (score >= 80) {
      return {
        title: t.strongPerformance,
        description: t.strongDescription,
        color: c.green,
        background: c.greenSoft,
      };
    }

    if (score >= 60) {
      return {
        title: t.goodProgress,
        description: t.progressDescription,
        color: c.blue,
        background: c.blueSoft,
      };
    }

    return {
      title: t.readyForReview,
      description: t.reviewDescription,
      color: c.red,
      background: c.redSoft,
    };
  }

  if (!question && !finished) {
    // The effect above promotes a completed queue to the summary. Avoid rendering
    // an empty-state screen during that single reconciliation render.
    return null;
  }

  if (finished) {
    return isExamMode ? (
      <div
        className="fade-up"
        style={{
          width: "min(880px, 100%)",
          margin: "0 auto",
          display: "grid",
          gap: 14,
        }}
      >
        <section
          style={{
            padding: "28px clamp(20px,4vw,36px)",
            borderRadius: 22,
            background: c.panel,
            border: `1px solid ${c.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 10px",
                  borderRadius: 99,
                  background: c.blueSoft,
                  color: c.blue,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                <Icon name="clock" size={13} stroke={3} />
                Eksamensmode
              </div>
              <h1
                style={{
                  margin: "16px 0 6px",
                  color: c.text,
                  fontSize: "clamp(26px,4vw,34px)",
                  lineHeight: 1,
                }}
              >
                {t.sessionComplete}
              </h1>
              <p
                style={{
                  maxWidth: 440,
                  margin: 0,
                  color: c.secondary,
                  fontSize: 13.5,
                  lineHeight: 1.55,
                }}
              >
                Ingen feedback blev vist under sessionen. Her er dit fulde
                resultat.
              </p>
            </div>
            <div
              style={{
                minWidth: 138,
                padding: "16px 18px",
                textAlign: "center",
                borderRadius: 18,
                background: c.blueSoft,
                border: `1px solid ${c.blueBorder}`,
              }}
            >
              <div
                style={{
                  color: c.blue,
                  fontSize: 38,
                  lineHeight: 1,
                  fontWeight: 850,
                }}
              >
                {score}%
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: c.secondary,
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {t.correctOutOf(correct, total)}
              </div>
            </div>
          </div>
          <div
            style={{
              height: 7,
              overflow: "hidden",
              marginTop: 22,
              borderRadius: 99,
              background: c.soft,
            }}
          >
            <div
              style={{
                width: `${score}%`,
                height: "100%",
                borderRadius: 99,
                background: c.blue,
                transition: "width 260ms ease",
              }}
            />
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 10,
          }}
        >
          {[
            [t.correct, correct, c.green, c.greenSoft, "check"],
            [t.incorrectCount, incorrect, c.red, c.redSoft, "close"],
            [t.unanswered, unanswered, c.secondary, c.soft, "clock"],
            [t.answered, answered, c.text, c.soft, "clipboard"],
          ].map(([label, value, color, background, icon]) => (
            <div
              key={label}
              style={{
                padding: 15,
                borderRadius: 15,
                background,
                border: `1px solid ${color}22`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  color,
                }}
              >
                <span style={{ fontSize: 22, fontWeight: 850 }}>{value}</span>
                <Icon name={icon} size={16} />
              </div>
              <div
                style={{
                  marginTop: 6,
                  color: c.secondary,
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: 10,
            padding: 16,
            borderRadius: 16,
            background: c.soft,
            border: `1px solid ${c.border}`,
          }}
        >
          <div>
            <div
              style={{
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Tid i alt
            </div>
            <div
              style={{
                marginTop: 4,
                color: c.text,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {formatSessionTime(
                Math.max(1, Math.round((Date.now() - sessionStartedAt) / 1000))
              )}
            </div>
          </div>
          <div style={{ gridColumn: "span 1" }}>
            <div
              style={{
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Sværest spørgsmål
            </div>
            <div
              style={{
                marginTop: 4,
                color: c.text,
                fontSize: 12.5,
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {hardestQuestionText
                ? hardestQuestionText.slice(0, 90) +
                  (hardestQuestionText.length > 90 ? "…" : "")
                : "Ingen data"}
            </div>
          </div>
        </section>

        <section
          style={{
            padding: 20,
            borderRadius: 20,
            background: c.panel,
            border: `1px solid ${c.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 15,
            }}
          >
            <div>
              <h2 style={{ margin: 0, color: c.text, fontSize: 15.5 }}>
                {t.resultsByTopic}
              </h2>
              <p
                style={{
                  margin: "4px 0 0",
                  color: c.secondary,
                  fontSize: 11.5,
                }}
              >
                {t.resultsByTopicDescription}
              </p>
            </div>
            {weakestCategory && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "6px 9px",
                  borderRadius: 9,
                  background: c.redSoft,
                  color: c.red,
                  fontSize: 11.5,
                  fontWeight: 750,
                }}
              >
                <Icon name="target" size={13} />
                {t.focusArea}: {weakestCategory}
              </span>
            )}
          </div>
          <div style={{ display: "grid", gap: 11 }}>
            {categories.map(([category, categoryResult]) => {
              const percent = Math.round(
                (categoryResult.correct / categoryResult.total) * 100
              );
              const color =
                percent >= 80 ? c.green : percent >= 60 ? c.blue : c.red;
              return (
                <div key={category}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 6,
                      color: c.text,
                      fontSize: 12.5,
                      fontWeight: 650,
                    }}
                  >
                    <span>{category}</span>
                    <span style={{ color: c.secondary }}>
                      {t.topicCorrect(
                        categoryResult.correct,
                        categoryResult.total
                      )}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      overflow: "hidden",
                      borderRadius: 99,
                      background: c.soft,
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        borderRadius: 99,
                        background: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <PrimaryButton onClick={restart}>{t.startNewSession}</PrimaryButton>
        </div>
      </div>
    ) : (
      <div
        className="fade-up"
        style={{
          width: "min(880px, 100%)",
          margin: "0 auto",
          display: "grid",
          gap: 14,
        }}
      >
        <section
          style={{
            padding: "28px clamp(20px,4vw,36px)",
            borderRadius: 22,
            background: c.panel,
            border: `1px solid ${c.border}`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "5px 10px",
              borderRadius: 99,
              background: c.greenSoft,
              color: c.green,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            <Icon
              name={isRecallMode ? "brain" : "clipboard"}
              size={13}
              stroke={3}
            />
            {isRecallMode ? "Active recall" : "Flashcard mode"}
          </div>
          <h1
            style={{
              margin: "16px 0 6px",
              color: c.text,
              fontSize: "clamp(26px,4vw,34px)",
              lineHeight: 1,
            }}
          >
            {t.sessionComplete}
          </h1>
          <p
            style={{
              maxWidth: 460,
              margin: 0,
              color: c.secondary,
              fontSize: 13.5,
              lineHeight: 1.55,
            }}
          >
            Du har gennemgået {sessionCardTotal} kort med aktiv genkaldelse. Her
            er, hvordan det gik.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0,1fr))",
              gap: 9,
              marginTop: 22,
            }}
          >
            {SM2_RATING_ORDER.map((item) => {
              const visual = sm2RatingVisual(c, item.key);
              const count = ratingCounts[item.key] || 0;
              const share = totalRatingsGiven
                ? Math.round((count / totalRatingsGiven) * 100)
                : 0;
              return (
                <div
                  key={item.key}
                  style={{
                    padding: "13px 11px",
                    borderRadius: 14,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: c.secondary,
                      fontSize: 11,
                      fontWeight: 750,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-grid",
                        placeItems: "center",
                        width: 19,
                        height: 19,
                        borderRadius: 6,
                        background: c.blueSoft,
                        color: c.blue,
                        border: `1px solid ${c.blueBorder}`,
                        fontSize: 10,
                      }}
                    >
                      {visual.icon}
                    </span>
                    {item.label}
                  </div>
                  <div
                    style={{
                      marginTop: 9,
                      color: c.text,
                      fontSize: 24,
                      lineHeight: 1,
                      fontWeight: 850,
                    }}
                  >
                    {count}
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      color: c.muted,
                      fontSize: 10.5,
                      fontWeight: 700,
                    }}
                  >
                    {share}%
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: 10,
            padding: 16,
            borderRadius: 16,
            background: c.soft,
            border: `1px solid ${c.border}`,
          }}
        >
          <div>
            <div
              style={{
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Tid i alt
            </div>
            <div
              style={{
                marginTop: 4,
                color: c.text,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {formatSessionTime(
                Math.max(1, Math.round((Date.now() - sessionStartedAt) / 1000))
              )}
            </div>
          </div>
          <div>
            <div
              style={{
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Tid pr. kort
            </div>
            <div
              style={{
                marginTop: 4,
                color: c.text,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {formatSessionTime(averageReviewSeconds)}
            </div>
          </div>
          <div>
            <div
              style={{
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Andel Igen
            </div>
            <div
              style={{
                marginTop: 4,
                color: c.text,
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              {againShare}%
            </div>
          </div>
          <div>
            <div
              style={{
                color: c.muted,
                fontSize: 10.5,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Sværest kort
            </div>
            <div
              style={{
                marginTop: 4,
                color: c.text,
                fontSize: 12.5,
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              {hardestQuestionText
                ? hardestQuestionText.slice(0, 90) +
                  (hardestQuestionText.length > 90 ? "…" : "")
                : "Ingen vurderinger endnu"}
            </div>
          </div>
        </section>

        {flashcardCategoryStats.length > 0 && (
          <section
            style={{
              padding: 20,
              borderRadius: 20,
              background: c.panel,
              border: `1px solid ${c.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 15,
              }}
            >
              <div>
                <h2 style={{ margin: 0, color: c.text, fontSize: 15.5 }}>
                  Emnekvalitet
                </h2>
                <p
                  style={{
                    margin: "4px 0 0",
                    color: c.secondary,
                    fontSize: 11.5,
                  }}
                >
                  Baseret på dine Igen/Svær/God/Nem-vurderinger pr. emne
                </p>
              </div>
              {weakestFlashcardCategory && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 9px",
                    borderRadius: 9,
                    background: c.redSoft,
                    color: c.red,
                    fontSize: 11.5,
                    fontWeight: 750,
                  }}
                >
                  <Icon name="target" size={13} />
                  {t.focusArea}: {weakestFlashcardCategory.name}
                </span>
              )}
            </div>
            <div style={{ display: "grid", gap: 11 }}>
              {flashcardCategoryStats.map((stat) => {
                const color =
                  stat.qualityPercent >= 80
                    ? c.green
                    : stat.qualityPercent >= 55
                    ? c.blue
                    : c.red;
                return (
                  <div key={stat.name}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        marginBottom: 6,
                        color: c.text,
                        fontSize: 12.5,
                        fontWeight: 650,
                      }}
                    >
                      <span>{stat.name}</span>
                      <span style={{ color: c.secondary }}>
                        {stat.total} kort
                        {stat.againCount ? ` · ${stat.againCount} Igen` : ""}
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        overflow: "hidden",
                        borderRadius: 99,
                        background: c.soft,
                      }}
                    >
                      <div
                        style={{
                          width: `${stat.qualityPercent}%`,
                          height: "100%",
                          borderRadius: 99,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <PrimaryButton onClick={restart}>{t.startNewSession}</PrimaryButton>
        </div>
      </div>
    );
  }

  const reveal = isRecallMode
    ? recallRevealed
    : (feedback || reviewMode) && selectedAnswer !== undefined;
  const category = translate(question.category, language);
  const questionText = translate(question.question, language);
  const explanation = translate(question.explanation, language);
  const cardState = spacedData && spacedData[question.id];
  const isNewCard = !cardState;

  const alreadyFlaggedByUser = flaggedQuestions.some(
    (item) =>
      item.questionId === question.id && item.userName === (user?.name || "")
  );

  function submitFlag() {
    if (!flagReason.trim()) return;
    setFlaggedQuestions((previous) => [
      ...previous,
      {
        id: `${question.id}-${Date.now()}`,
        questionId: question.id,
        questionText: translate(question.question, language),
        userName: user?.name || "",
        reason: flagReason.trim(),
        timestamp: Date.now(),
        status: "open",
      },
    ]);
    setFlagReason("");
    setFlagModalOpen(false);
  }

  return (
    <section
      className="fade-up"
      style={{
        width: "min(760px,100%)",
        margin: "0 auto",
        padding: "27px clamp(20px,4vw,32px)",
        borderRadius: 25,
        background: c.panel,
        border: `1px solid ${c.border}`,
        boxShadow: c.shadow,
      }}
    >
      <div
        aria-label={`Kort ${sessionCardPosition} af ${sessionCardTotal}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginBottom: 18,
          color: c.secondary,
          fontSize: 12,
          fontWeight: 750,
        }}
      >
        <span style={{ color: c.text, whiteSpace: "nowrap" }}>
          {sessionCardPosition}/{sessionCardTotal}
        </span>
        <div
          style={{
            flex: 1,
            height: 5,
            overflow: "hidden",
            borderRadius: 99,
            background: c.soft,
          }}
        >
          <div
            style={{
              width: `${Math.min(
                100,
                (sessionCardPosition / Math.max(1, sessionCardTotal)) * 100
              )}%`,
              height: "100%",
              borderRadius: 99,
              background: c.blue,
              transition: "width 180ms ease",
            }}
          />
        </div>
      </div>
      {reviewMode && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            marginBottom: 18,
            padding: "11px 12px",
            borderRadius: 12,
            background: c.blueSoft,
            color: c.blue,
            fontSize: 12,
            fontWeight: 750,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="clipboard" size={15} />
            {t.reviewSession}
          </span>

          <button
            type="button"
            onClick={() => {
              setReviewMode(false);
              setFinished(true);
            }}
            style={{
              padding: 0,
              border: 0,
              background: "transparent",
              color: c.blue,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {t.toResults}
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 14,
          marginBottom: 23,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "5px 9px",
                borderRadius: 8,
                background: c.blueSoft,
                color: c.blue,
                fontSize: 11,
                fontWeight: 750,
              }}
            >
              {category}
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 9px",
                borderRadius: 8,
                background: isNewCard ? c.greenSoft : c.blueSoft,
                color: isNewCard ? c.green : c.blue,
                fontSize: 11,
                fontWeight: 750,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: isNewCard ? c.green : c.blue,
                }}
              />
              {isNewCard ? t.newCard : t.reviewCard}
            </div>
          </div>

          <div style={{ marginTop: 10, color: c.secondary, fontSize: 13 }}>
            {`${sessionCardPosition}/${sessionCardTotal}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
            flexShrink: 0,
          }}
        >
          {!reviewMode && (
            <button
              type="button"
              onClick={() => setFeedback((value) => !value)}
              style={{
                padding: "8px 10px",
                borderRadius: 10,
                border: `1px solid ${feedback ? c.blueBorder : c.border}`,
                color: feedback ? c.blue : c.secondary,
                background: feedback ? c.blueSoft : c.soft,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {feedback ? t.feedbackOn : t.feedbackOff}
            </button>
          )}

          {!reviewMode && (
            <button
              type="button"
              title="Nulstil alle MCQ-kort"
              onClick={resetAllProgress}
              style={{
                height: 36,
                padding: "0 10px",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: c.panel,
                color: c.secondary,
                fontSize: 11,
                fontWeight: 750,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <Icon name="reset" size={14} />
              Nulstil
            </button>
          )}

          {onOpenLectureList && (
            <button
              type="button"
              title={t.viewLectureList}
              onClick={onOpenLectureList}
              style={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: c.soft,
                color: c.secondary,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Icon name="notebook" size={16} />
            </button>
          )}

          <div style={{ position: "relative" }}>
            <button
              type="button"
              title={t.cardMenu}
              onClick={() => setCardMenuOpen((value) => !value)}
              style={{
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
                borderRadius: 10,
                border: `1px solid ${cardMenuOpen ? c.blueBorder : c.border}`,
                background: cardMenuOpen ? c.blueSoft : c.soft,
                color: cardMenuOpen ? c.blue : c.secondary,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              <Icon name="more" size={16} />
            </button>

            {cardMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  insetInlineEnd: 0,
                  top: 42,
                  zIndex: 20,
                  width: 220,
                  padding: 7,
                  borderRadius: 14,
                  background: c.panel,
                  border: `1px solid ${c.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={buryCurrentCard}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 10,
                    border: 0,
                    background: "transparent",
                    color: c.text,
                    fontSize: 12,
                    fontWeight: 650,
                    cursor: "pointer",
                    textAlign: "start",
                  }}
                >
                  <Icon name="notebook" size={15} />
                  {t.buryCard}
                </button>

                <button
                  type="button"
                  onClick={resetCurrentCard}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 10,
                    border: 0,
                    background: "transparent",
                    color: c.text,
                    fontSize: 12,
                    fontWeight: 650,
                    cursor: "pointer",
                    textAlign: "start",
                  }}
                >
                  <Icon name="reset" size={15} />
                  {t.resetThisCard}
                </button>

                <button
                  type="button"
                  onClick={resetAllProgress}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 10px",
                    borderRadius: 10,
                    border: 0,
                    background: "transparent",
                    color: c.red,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "start",
                  }}
                >
                  <Icon name="reset" size={15} />
                  Nulstil al progress
                </button>

                {onOpenLectureList && (
                  <button
                    type="button"
                    onClick={() => {
                      setCardMenuOpen(false);
                      onOpenLectureList();
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 10px",
                      borderRadius: 10,
                      border: 0,
                      background: "transparent",
                      color: c.text,
                      fontSize: 12,
                      fontWeight: 650,
                      cursor: "pointer",
                      textAlign: "start",
                    }}
                  >
                    <Icon name="clipboard" size={15} />
                    {t.viewLectureList}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {cardMenuNotice && (
        <div
          style={{
            marginBottom: 14,
            padding: "8px 12px",
            borderRadius: 10,
            background: c.greenSoft,
            color: c.green,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {cardMenuNotice}
        </div>
      )}

      <div
        style={{
          height: 5,
          overflow: "hidden",
          borderRadius: 99,
          background: c.soft,
          marginBottom: 29,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(answered / total) * 100}%`,
            borderRadius: 99,
            background: "linear-gradient(90deg,#1677ff,#72b7ff)",
          }}
        />
      </div>

      <h1
        style={{
          margin: "0 0 25px",
          color: c.text,
          fontSize: questionSize,
          lineHeight: 1.52,
        }}
      >
        {questionText}
      </h1>

      {isRecallMode && !recallRevealed && (
        <div
          style={{
            display: "grid",
            gap: 12,
            padding: "26px 20px",
            borderRadius: 16,
            background: c.soft,
            border: `1px dashed ${c.borderStrong}`,
            textAlign: "center",
          }}
        >
          <div style={{ color: c.secondary, fontSize: 13, lineHeight: 1.5 }}>
            Gengiv svaret i dit hoved eller på papir, og tryk derefter for at se
            facit.
          </div>
          <PrimaryButton
            onClick={() => {
              setRecallRevealed(true);
              setAnswers((previous) => ({
                ...previous,
                [question.id]: question.correct,
              }));
            }}
            style={{ justifySelf: "center" }}
          >
            Vis svar
          </PrimaryButton>
        </div>
      )}

      {(!isRecallMode || recallRevealed) && (
        <div style={{ display: "grid", gap: 10 }}>
          {question.options.map((option, optionIndex) => {
            const selected = selectedAnswer === optionIndex;
            const isCorrect = optionIndex === question.correct;

            let background = c.panel;
            let border = c.border;
            let color = c.text;
            let opacity = 1;

            if (reveal && isCorrect) {
              background = c.greenSoft;
              border = `${c.green}88`;
              color = c.green;
            } else if (reveal && selected && !isCorrect) {
              background = c.redSoft;
              border = `${c.red}88`;
              color = c.red;
            } else if (selected) {
              background = c.blueSoft;
              border = c.blueBorder;
              color = c.blue;
            } else if (reveal) {
              opacity = 0.55;
            }

            return (
              <button
                key={`${question.id}-${optionIndex}`}
                type="button"
                disabled={
                  reviewMode || (feedback && selectedAnswer !== undefined)
                }
                onClick={() => chooseAnswer(optionIndex)}
                style={{
                  minHeight: 62,
                  display: "flex",
                  alignItems: "center",
                  gap: 13,
                  width: "100%",
                  padding: "12px 14px",
                  textAlign: "start",
                  borderRadius: 15,
                  border: `1px solid ${border}`,
                  background,
                  color,
                  opacity,
                  cursor:
                    reviewMode || (feedback && selectedAnswer !== undefined)
                      ? "default"
                      : "pointer",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 9,
                    background: c.soft,
                    color: c.secondary,
                    fontSize: 12,
                    fontWeight: 750,
                    direction: "ltr",
                  }}
                >
                  {String.fromCharCode(65 + optionIndex)}
                </span>

                <span style={{ fontSize: 14, fontWeight: 600 }}>
                  {translate(option, language)}
                </span>

                {reveal && isCorrect && (
                  <span style={{ marginInlineStart: "auto" }}>
                    <Icon name="check" size={18} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {reveal && (
        <div
          className="fade-up"
          style={{
            marginTop: 18,
            padding: 16,
            borderRadius: 15,
            background: isRecallMode
              ? c.blueSoft
              : selectedAnswer === question.correct
              ? c.greenSoft
              : c.redSoft,
            border: `1px solid ${
              isRecallMode
                ? c.blueBorder
                : selectedAnswer === question.correct
                ? `${c.green}55`
                : `${c.red}55`
            }`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 6,
              color: isRecallMode
                ? c.blue
                : selectedAnswer === question.correct
                ? c.green
                : c.red,
              fontSize: 13,
              fontWeight: 750,
            }}
          >
            <Icon
              name={
                isRecallMode
                  ? "check"
                  : selectedAnswer === question.correct
                  ? "check"
                  : "close"
              }
              size={15}
              stroke={3}
            />
            {isRecallMode
              ? "Facit"
              : selectedAnswer === question.correct
              ? t.correct
              : t.incorrect}
          </div>

          <div style={{ color: c.text, fontSize: 13, lineHeight: 1.55 }}>
            {explanation}
          </div>

          <button
            type="button"
            onClick={() => setFlagModalOpen(true)}
            disabled={alreadyFlaggedByUser}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
              padding: "6px 11px",
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              background: "transparent",
              color: alreadyFlaggedByUser ? c.muted : c.secondary,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: alreadyFlaggedByUser ? "default" : "pointer",
            }}
          >
            <Icon name="flag" size={13} />
            {alreadyFlaggedByUser
              ? t.flagQuestionAlreadyFlagged
              : t.flagQuestion}
          </button>
        </div>
      )}

      {flagModalOpen && (
        <Modal c={c} onClose={() => setFlagModalOpen(false)}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
              {t.flagQuestionTitle}
            </div>
            <IconButton
              c={c}
              title={t.close}
              onClick={() => setFlagModalOpen(false)}
            >
              <Icon name="close" size={17} />
            </IconButton>
          </header>

          <p
            style={{
              color: c.secondary,
              fontSize: 12,
              lineHeight: 1.55,
              marginBottom: 14,
            }}
          >
            {t.flagQuestionDescription}
          </p>

          <textarea
            value={flagReason}
            onChange={(event) => setFlagReason(event.target.value)}
            placeholder={t.flagQuestionPlaceholder}
            autoFocus
            style={{
              width: "100%",
              minHeight: 100,
              padding: 12,
              borderRadius: 12,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.text,
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              marginBottom: 14,
            }}
          />

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setFlagModalOpen(false)}
              style={{
                flex: 1,
                height: 42,
                border: `1px solid ${c.borderStrong}`,
                borderRadius: 10,
                background: "transparent",
                color: c.secondary,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.flagQuestionCancel}
            </button>
            <PrimaryButton
              onClick={submitFlag}
              style={{ flex: 1 }}
              disabled={!flagReason.trim()}
            >
              {t.flagQuestionSubmit}
            </PrimaryButton>
          </div>
        </Modal>
      )}

      <footer
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          marginTop: 25,
          paddingTop: 20,
          borderTop: `1px solid ${c.border}`,
        }}
      >
        {reveal && !reviewMode && !isExamMode && (
          <SM2AnswerFooter
            c={c}
            questionId={question.id}
            spacedData={spacedData}
            setSpacedData={setSpacedData}
            wrongChoiceSelected={
              !isRecallMode && selectedAnswer !== question.correct
            }
            deckSettings={deckSettings}
            onRated={advanceAfterRating}
          />
        )}
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
        >
          <IconButton
            c={c}
            title={t.previous}
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            style={{
              width: "auto",
              minHeight: 42,
              padding: "0 14px",
              border: `1px solid ${c.borderStrong}`,
              color: c.text,
              fontSize: 13,
              fontWeight: 700,
              gap: 5,
            }}
          >
            <Icon name="left" size={16} />
            {t.previous}
          </IconButton>

          {(reviewMode || !reveal) &&
            (index === total - 1 ? (
              <PrimaryButton onClick={finishSession}>
                {reviewMode ? t.toResults : t.finish}
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onClick={() =>
                  setIndex((value) => Math.min(total - 1, value + 1))
                }
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {t.next}
                  <Icon name="right" size={16} />
                </span>
              </PrimaryButton>
            ))}
        </div>
      </footer>
    </section>
  );
}

function Insights({ c, t, language, user }) {
  const [history] = useStoredState(STORAGE.quizHistory, []);
  const [streakData] = useStoredState(STORAGE.streak, { days: [] });
  const [pomodoroLog] = useStoredState(STORAGE.pomodoroLog, {});
  const [pomodoroMinutesLog] = useStoredState(STORAGE.pomodoroMinutesLog, {});
  const [expandedId, setExpandedId] = useState(null);
  const [depthGroupFilter, setDepthGroupFilter] = useState("all");
  const sessions = [...history].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
  );

  // Denne visning bruger en fast, hvid baggrund med mørk tekst uafhængigt af app-temaet
  // (lys/mørk), så indsigterne altid er tydelige og læsbare. Accentfarver (grøn/blå/rød)
  // følger stadig samme betydning som resten af appen.
  const ink = {
    page: "#ffffff",
    text: "#0f172a",
    secondary: "#475569",
    muted: "#94a3b8",
    line: "#e2e8f0",
    lineStrong: "#cbd5e1",
    blue: "#1665ea",
    blueSoft: "#eaf2ff",
    green: "#0e9a68",
    red: "#dc2626",
    redSoft: "#fef2f2",
  };

  const x =
    {
      da: {
        title: "Indsigter",
        subtitle: "Din læring, fortalt",
        score: "Samlet korrekt",
        accuracy: "Korrektprocent",
        answered: "Besvarede",
        sessionsWord: "Sessioner",
        trend: "Udvikling",
        recent: "Sessionslog",
        correct: "korrekte",
        time: "Tid",
        average: "Gennemsnit",
        best: "Bedste",
        latest: "Seneste",
        details: "Detaljer",
        hide: "Luk",
        topic: "Emne",
        result: "Resultat",
        date: "Dato",
        duration: "Varighed",
        noDuration: "Ikke registreret",
        lowest: "Laveste emnescore",
        all: "Alle data",
        noData: "Ingen sessioner endnu",
        noDataText: "Gennemfør en MCQ-session for at se din analyse her.",
        min: "min",
        activity: "Aktivitet",
        activityText:
          "Studiedage, pomodoros og gennemsnitlig score de sidste 14 dage",
        currentStreak: "Nuværende streak",
        longestStreak: "Længste streak",
        totalPomodoros: "Pomodoros i alt",
        activeDays: "Aktive dage",
        allTopicsOption: "Alle emner",
        statusHeading: "Status",
        statusStrongFor: (moduleName) =>
          `Du har et solidt greb om ${moduleName}, og præstationen holder sig konsekvent på et højt niveau.`,
        statusMixedFor: (moduleName) =>
          `Din forståelse af ${moduleName} er i fremgang, men enkelte emner trækker stadig ned i det samlede billede.`,
        statusWeakFor: (moduleName) =>
          `${moduleName} kræver fortsat systematisk repetition — flere emner ligger under et sikkert niveau.`,
        statusEarlyFor: (moduleName) =>
          `Du er tidligt i din gennemgang af ${moduleName}. Der er endnu ikke nok data til et fuldt billede.`,
        statusNoModule:
          "Vælg et modul i din profil for at få en detaljeret gennemgang af din læring inden for det.",
        statusGlobalNote:
          "Nedenstående afsnit dækker hele dit studieforløb, uafhængigt af modul.",
        attentionHeading: "Opmærksomhedspunkter",
        attentionIntroFor: (moduleName) =>
          `De emner i ${moduleName}, der kræver mest opmærksomhed lige nu.`,
        attentionNone:
          "Ingen emner i dette modul kræver særlig opmærksomhed lige nu — godt arbejde.",
        attentionItem: (topic, percent) =>
          `${topic} står aktuelt til ${percent} procent korrekte svar og bør prioriteres ved næste repetition.`,
        depthHeading: "Emne for emne",
        allGroupsOption: "Alle underemner",
        depthNoData: "Ingen data for dette underemne endnu.",
        depthIntroFor: (moduleName) =>
          `Sådan udvikler hvert emne i ${moduleName} sig over dine seneste sessioner.`,
        depthSentenceUp: (topic) =>
          `${topic} er i fremgang og nærmer sig et solidt niveau.`,
        depthSentenceDown: (topic) =>
          `${topic} er gået tilbage siden dine tidligere sessioner og bør revurderes.`,
        depthSentenceStable: (topic) =>
          `${topic} ligger stabilt uden markante udsving.`,
        depthSentenceEarly: (topic) =>
          `${topic} er endnu kun besvaret få gange — for tidligt at afgøre en tendens.`,
        trendHeading: "Udvikling over tid",
        recentHeading: "Dine seneste sessioner",
        activityHeading: "Aktivitet",
        pomodoroHeatmapTitle: "Fokus-minutter pr. dag",
        pomodoroHeatmapEmpty:
          "Ingen pomodoro-data endnu. Start fokusuret for at se din kalenderoversigt.",
      },
      en: {
        title: "Insights",
        subtitle: "Your learning, told as a story",
        score: "Overall correct",
        accuracy: "Accuracy",
        answered: "Answered",
        sessionsWord: "Sessions",
        trend: "Progress",
        recent: "Session log",
        correct: "correct",
        time: "Time",
        average: "Average",
        best: "Best",
        latest: "Latest",
        details: "Details",
        hide: "Close",
        topic: "Topic",
        result: "Result",
        date: "Date",
        duration: "Duration",
        noDuration: "Not recorded",
        lowest: "Lowest topic score",
        all: "All data",
        noData: "No sessions yet",
        noDataText: "Complete an MCQ session to see your analysis here.",
        min: "min",
        activity: "Activity",
        activityText:
          "Study days, pomodoros and average score over the last 14 days",
        currentStreak: "Current streak",
        longestStreak: "Longest streak",
        totalPomodoros: "Total pomodoros",
        activeDays: "Active days",
        allTopicsOption: "All topics",
        statusHeading: "Status",
        statusStrongFor: (moduleName) =>
          `You have a solid grasp of ${moduleName}, and performance remains consistently strong.`,
        statusMixedFor: (moduleName) =>
          `Your understanding of ${moduleName} is improving, but a few topics still weigh down the overall picture.`,
        statusWeakFor: (moduleName) =>
          `${moduleName} still needs systematic review — several topics remain below a safe level.`,
        statusEarlyFor: (moduleName) =>
          `You are early in your review of ${moduleName}. There isn't enough data yet for a complete picture.`,
        statusNoModule:
          "Choose a module in your profile to get a detailed breakdown of your learning within it.",
        statusGlobalNote:
          "The sections below cover your entire study history, independent of module.",
        attentionHeading: "Points of attention",
        attentionIntroFor: (moduleName) =>
          `The topics in ${moduleName} that need the most attention right now.`,
        attentionNone:
          "No topics in this module need particular attention right now — good work.",
        attentionItem: (topic, percent) =>
          `${topic} currently stands at ${percent} percent correct and should be prioritised in your next review.`,
        depthHeading: "Topic by topic",
        allGroupsOption: "All subtopics",
        depthNoData: "No data for this subtopic yet.",
        depthIntroFor: (moduleName) =>
          `How each topic in ${moduleName} has developed across your recent sessions.`,
        depthSentenceUp: (topic) =>
          `${topic} is improving and approaching a solid level.`,
        depthSentenceDown: (topic) =>
          `${topic} has declined since your earlier sessions and should be revisited.`,
        depthSentenceStable: (topic) =>
          `${topic} remains stable without significant fluctuation.`,
        depthSentenceEarly: (topic) =>
          `${topic} has only been answered a few times — too early to determine a trend.`,
        trendHeading: "Progress over time",
        recentHeading: "Your recent sessions",
        activityHeading: "Activity",
        pomodoroHeatmapTitle: "Focus minutes per day",
        pomodoroHeatmapEmpty:
          "No pomodoro data yet. Start the focus timer to see your calendar overview.",
      },
      ar: {
        title: "الإحصاءات",
        subtitle: "مسيرتك التعليمية بصيغة سردية",
        score: "الصحيح الإجمالي",
        accuracy: "نسبة الصحة",
        answered: "تمت الإجابة",
        sessionsWord: "الجلسات",
        trend: "التطور",
        recent: "سجل الجلسات",
        correct: "صحيحة",
        time: "الوقت",
        average: "المتوسط",
        best: "الأفضل",
        latest: "الأحدث",
        details: "التفاصيل",
        hide: "إغلاق",
        topic: "الموضوع",
        result: "النتيجة",
        date: "التاريخ",
        duration: "المدة",
        noDuration: "غير مسجلة",
        lowest: "أدنى نتيجة موضوع",
        all: "كل البيانات",
        noData: "لا توجد جلسات بعد",
        noDataText: "أكمل جلسة أسئلة لرؤية التحليل هنا.",
        min: "د",
        activity: "النشاط",
        activityText: "أيام الدراسة والبومودورو والمعدل خلال آخر 14 يومًا",
        currentStreak: "التتابع الحالي",
        longestStreak: "أطول تتابع",
        totalPomodoros: "إجمالي البومودورو",
        activeDays: "الأيام النشطة",
        allTopicsOption: "جميع الموضوعات",
        statusHeading: "الوضع الحالي",
        statusStrongFor: (moduleName) =>
          `لديك فهم قوي لمقرر ${moduleName}، وأدائك ثابت عند مستوى مرتفع.`,
        statusMixedFor: (moduleName) =>
          `فهمك لمقرر ${moduleName} يتحسن، لكن بعض الموضوعات لا تزال تؤثر سلبًا على الصورة العامة.`,
        statusWeakFor: (moduleName) =>
          `لا يزال مقرر ${moduleName} يحتاج إلى مراجعة منهجية — عدة موضوعات دون المستوى الآمن.`,
        statusEarlyFor: (moduleName) =>
          `أنت في بداية مراجعتك لمقرر ${moduleName}. لا توجد بيانات كافية بعد لصورة كاملة.`,
        statusNoModule:
          "اختر وحدة في ملفك الشخصي للحصول على تحليل تفصيلي لمسيرتك التعليمية ضمنها.",
        statusGlobalNote:
          "الأقسام أدناه تغطي مسيرتك الدراسية الكاملة، بغض النظر عن الوحدة.",
        attentionHeading: "نقاط تحتاج إلى اهتمام",
        attentionIntroFor: (moduleName) =>
          `الموضوعات في ${moduleName} التي تحتاج إلى أكبر قدر من الاهتمام حاليًا.`,
        attentionNone:
          "لا توجد موضوعات في هذه الوحدة تحتاج إلى اهتمام خاص حاليًا — عمل جيد.",
        attentionItem: (topic, percent) =>
          `يقف ${topic} حاليًا عند ${percent} بالمئة من الإجابات الصحيحة، وينبغي إعطاؤه الأولوية في مراجعتك القادمة.`,
        depthHeading: "موضوع بموضوع",
        allGroupsOption: "جميع المواضيع الفرعية",
        depthNoData: "لا توجد بيانات لهذا الموضوع الفرعي بعد.",
        depthIntroFor: (moduleName) =>
          `كيف تطور كل موضوع في ${moduleName} عبر جلساتك الأخيرة.`,
        depthSentenceUp: (topic) => `${topic} في تحسن ويقترب من مستوى جيد.`,
        depthSentenceDown: (topic) =>
          `${topic} تراجع منذ جلساتك السابقة وينبغي إعادة النظر فيه.`,
        depthSentenceStable: (topic) => `${topic} مستقر دون تقلبات ملحوظة.`,
        depthSentenceEarly: (topic) =>
          `لم تتم الإجابة على ${topic} إلا قليلًا حتى الآن — من المبكر تحديد اتجاه.`,
        trendHeading: "التطور مع الوقت",
        recentHeading: "جلساتك الأخيرة",
        activityHeading: "النشاط",
        pomodoroHeatmapTitle: "دقائق التركيز يوميًا",
        pomodoroHeatmapEmpty:
          "لا توجد بيانات بومودورو حتى الآن. ابدأ مؤقت التركيز لعرض التقويم.",
      },
    }[language] || {};

  const scoreColor = (value) =>
    value >= 80 ? ink.green : value >= 60 ? ink.blue : ink.red;

  if (!sessions.length) {
    return (
      <section
        className="fade-up"
        style={{
          maxWidth: 640,
          margin: "40px auto",
          padding: "60px 40px",
          textAlign: "center",
          background: ink.page,
          borderRadius: 20,
          border: `1px solid ${ink.line}`,
        }}
      >
        <Icon name="chart" size={26} />
        <h1
          style={{
            marginTop: 18,
            color: ink.text,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {x.noData}
        </h1>
        <p
          style={{
            marginTop: 8,
            color: ink.secondary,
            fontSize: 13.5,
            lineHeight: 1.6,
          }}
        >
          {x.noDataText}
        </p>
      </section>
    );
  }

  const currentModule = user?.module || null;
  const moduleSessions = currentModule
    ? sessions.filter((s) => s.module === currentModule)
    : [];
  const hasModuleData = moduleSessions.length > 0;

  const buildTopicMap = (sourceSessions) =>
    sourceSessions.reduce((all, session) => {
      Object.entries(session.categories || {}).forEach(([name, result]) => {
        if (!all[name]) all[name] = { correct: 0, total: 0 };
        all[name].correct += result.correct;
        all[name].total += result.total;
      });
      return all;
    }, {});

  const globalTopicMap = buildTopicMap(sessions);
  const globalTopics = Object.entries(globalTopicMap)
    .map(([name, result]) => ({
      name,
      ...result,
      percent: result.total
        ? Math.round((result.correct / result.total) * 100)
        : 0,
    }))
    .sort((a, b) => a.percent - b.percent);

  // Modulafgrænset emnetabel — kun sessioner, hvor session.module matcher det aktuelt valgte modul, indgår.
  const moduleTopicMap = buildTopicMap(moduleSessions);
  const moduleTopics = Object.entries(moduleTopicMap)
    .map(([name, result]) => ({
      name,
      ...result,
      percent: result.total
        ? Math.round((result.correct / result.total) * 100)
        : 0,
    }))
    .sort((a, b) => a.percent - b.percent);

  // Tendens pr. emne: sammenligner den ældre halvdel af sessioner med den nyere halvdel,
  // så "Emne for emne" kan formuleres som en udvikling snarere end et statisk øjebliksbillede.
  const computeTopicTrends = (sourceSessions) => {
    const chronological = [...sourceSessions].sort(
      (a, b) => new Date(a.completedAt) - new Date(b.completedAt)
    );
    const perTopic = {};
    chronological.forEach((session) => {
      Object.entries(session.categories || {}).forEach(([name, result]) => {
        if (!result.total) return;
        if (!perTopic[name]) perTopic[name] = [];
        perTopic[name].push(Math.round((result.correct / result.total) * 100));
      });
    });
    return Object.entries(perTopic).map(([name, values]) => {
      if (values.length < 2) {
        return {
          name,
          trend: "early",
          sampleSize: values.length,
          recentPercent: values[values.length - 1],
        };
      }
      const half = Math.ceil(values.length / 2);
      const earlier = values.slice(0, half);
      const recent = values.slice(half);
      const avg = (list) => list.reduce((sum, v) => sum + v, 0) / list.length;
      const earlierAvg = avg(earlier);
      const recentAvg = recent.length ? avg(recent) : earlierAvg;
      const delta = recentAvg - earlierAvg;
      const trend = delta > 6 ? "up" : delta < -6 ? "down" : "stable";
      return {
        name,
        trend,
        sampleSize: values.length,
        recentPercent: Math.round(recentAvg),
      };
    });
  };

  const moduleTrends = computeTopicTrends(moduleSessions);

  const lecturesInModule = currentModule
    ? MODULE_LECTURES[currentModule] || []
    : [];
  const lectureGroupById = lecturesInModule.reduce((map, lecture) => {
    map[lecture.id] = lecture.group || null;
    return map;
  }, {});
  const depthGroupOptions = Array.from(
    new Set(lecturesInModule.map((l) => l.group).filter(Boolean))
  );

  const categoryToGroups = {};
  QUESTIONS.forEach((q) => {
    if (q.moduleId !== currentModule) return;
    const groupName = q.lectureId ? lectureGroupById[q.lectureId] : null;
    if (!groupName) return;
    const categoryName = translate(q.category, language);
    if (!categoryToGroups[categoryName])
      categoryToGroups[categoryName] = new Set();
    categoryToGroups[categoryName].add(groupName);
  });

  const filteredDepthTopics =
    depthGroupFilter === "all"
      ? moduleTrends
      : moduleTrends.filter((topic) =>
          categoryToGroups[topic.name]?.has(depthGroupFilter)
        );

  const attentionTopics = moduleTopics
    .filter((topic) => topic.percent < 70)
    .slice(0, 4);

  const overallAccuracyModule = moduleTopics.length
    ? Math.round(
        (moduleTopics.reduce((sum, tp) => sum + tp.correct, 0) /
          moduleTopics.reduce((sum, tp) => sum + tp.total, 0)) *
          100
      )
    : 0;

  const statusSentence = !currentModule
    ? x.statusNoModule
    : !hasModuleData
    ? x.statusEarlyFor(currentModule)
    : overallAccuracyModule >= 80
    ? x.statusStrongFor(currentModule)
    : overallAccuracyModule >= 60
    ? x.statusMixedFor(currentModule)
    : x.statusWeakFor(currentModule);

  // -- Resten af komponenten (udvikling over tid, aktivitet, sessionslog) forbliver globalt, dvs. hele studiehistorikken --
  const total = sessions.reduce(
    (sum, item) => ({
      correct: sum.correct + (item.correct || 0),
      answered: sum.answered + (item.answered || 0),
    }),
    { correct: 0, answered: 0 }
  );
  const accuracy = total.answered
    ? Math.round((total.correct / total.answered) * 100)
    : 0;

  const formatDate = (date, compact = false) =>
    new Intl.DateTimeFormat(
      language === "da" ? "da-DK" : language === "ar" ? "ar" : "en-GB",
      compact
        ? { day: "numeric", month: "short" }
        : {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
    ).format(new Date(date));
  const formatDuration = (seconds) =>
    seconds
      ? `${Math.max(1, Math.round(seconds / 60))} ${x.min}`
      : x.noDuration;

  const totalPomodoros = Object.values(pomodoroLog).reduce(
    (sum, value) => sum + value,
    0
  );

  // Statistik uden panelbaggrund — tal bærer vægten typografisk i stedet for at blive pakket i kort.
  const stat = (label, value, dimmed = false) => (
    <div key={label} style={{ minWidth: 88 }}>
      <div
        style={{
          color: dimmed ? ink.red : ink.text,
          fontFamily: '"Space Mono", monospace',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-.01em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 4,
          color: dimmed ? ink.red : ink.muted,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: ".08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );

  const eyebrow = (label) => (
    <div
      style={{
        color: ink.muted,
        fontSize: 10.5,
        fontWeight: 800,
        letterSpacing: ".12em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </div>
  );

  // Synlige, konsistente skillelinjer mellem kapitlerne — fuld bredde, ensartet farve og luft.
  const divider = (
    <div style={{ height: 1, background: ink.lineStrong, margin: "38px 0" }} />
  );

  return (
    <div
      className="fade-up"
      style={{
        width: "min(1200px, 100%)",
        margin: "0 auto",
        background: ink.page,
        borderRadius: 24,
        border: `1px solid ${ink.line}`,
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        padding: "48px 64px 56px",
      }}
    >
      {/* Overskrift ---------------------------------------------------- */}
      <header style={{ marginBottom: 34 }}>
        {eyebrow(x.subtitle)}
        <h1
          style={{
            margin: "10px 0 0",
            color: ink.text,
            fontSize: 32,
            lineHeight: 1.15,
            letterSpacing: "-.03em",
            fontWeight: 700,
          }}
        >
          {x.title}
        </h1>
      </header>

      {/* Kapitel 1 — Status --------------------------------------------- */}
      <section style={{ marginBottom: 8 }}>
        {eyebrow(x.statusHeading)}
        <p
          style={{
            margin: "12px 0 0",
            color: ink.text,
            fontSize: 17,
            lineHeight: 1.65,
            fontWeight: 500,
            maxWidth: 620,
          }}
        >
          {statusSentence}
        </p>
        {currentModule && (
          <p
            style={{
              margin: "10px 0 0",
              color: ink.muted,
              fontSize: 12.5,
              lineHeight: 1.6,
            }}
          >
            {x.statusGlobalNote}
          </p>
        )}
        {hasModuleData && (
          <div
            style={{
              display: "flex",
              gap: 34,
              marginTop: 22,
              flexWrap: "wrap",
            }}
          >
            {stat(
              x.score,
              `${overallAccuracyModule}%`,
              overallAccuracyModule < 60
            )}
            {stat(x.sessionsWord, moduleSessions.length)}
            {stat(
              x.answered,
              moduleTopics.reduce((sum, tp) => sum + tp.total, 0)
            )}
          </div>
        )}
      </section>

      {hasModuleData && divider}

      {/* Kapitel 2 — Opmærksomhedspunkter (svage punkter, modulafgrænset) -- */}
      {hasModuleData && (
        <section style={{ marginBottom: 8 }}>
          {eyebrow(x.attentionHeading)}
          <p
            style={{
              margin: "12px 0 20px",
              color: ink.secondary,
              fontSize: 13.5,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            {x.attentionIntroFor(currentModule)}
          </p>
          {attentionTopics.length === 0 ? (
            <p style={{ color: ink.text, fontSize: 14.5, lineHeight: 1.6 }}>
              {x.attentionNone}
            </p>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {attentionTopics.map((topic) => (
                <div
                  key={topic.name}
                  style={{ display: "flex", alignItems: "baseline", gap: 14 }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: ink.red,
                      flexShrink: 0,
                      transform: "translateY(-2px)",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      color: ink.text,
                      fontSize: 14.5,
                      lineHeight: 1.6,
                    }}
                  >
                    {x.attentionItem(topic.name, topic.percent)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {divider}

      {/* Kapitel 5 — Fokus-kalender (globalt) --------------------------- */}
      <section style={{ marginBottom: 8 }}>
        {eyebrow(x.pomodoroHeatmapTitle)}
        <p
          style={{
            margin: "12px 0 22px",
            color: ink.secondary,
            fontSize: 13.5,
            lineHeight: 1.6,
            maxWidth: 560,
          }}
        >
          {x.activityText}
        </p>
        <PomodoroCalendarHeatmap
          pomodoroMinutesLog={pomodoroMinutesLog}
          ink={ink}
          year={new Date().getFullYear()}
          emptyLabel={x.pomodoroHeatmapEmpty}
        />
      </section>

      {hasModuleData && divider}

      {/* Kapitel 3 — Emne for emne (reworket emneanalyse, modulafgrænset) -- */}
      {hasModuleData && (
        <section style={{ marginBottom: 8 }}>
          {eyebrow(x.depthHeading)}
          <p
            style={{
              margin: "12px 0 22px",
              color: ink.secondary,
              fontSize: 13.5,
              lineHeight: 1.6,
              maxWidth: 560,
            }}
          >
            {x.depthIntroFor(currentModule)}
          </p>

          {depthGroupOptions.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 22,
              }}
            >
              <button
                type="button"
                onClick={() => setDepthGroupFilter("all")}
                style={{
                  height: 28,
                  padding: "0 12px",
                  borderRadius: 20,
                  border: `1px solid ${
                    depthGroupFilter === "all" ? ink.blue : ink.lineStrong
                  }`,
                  background:
                    depthGroupFilter === "all" ? ink.blueSoft : "transparent",
                  color: depthGroupFilter === "all" ? ink.blue : ink.secondary,
                  fontSize: 10.5,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                {x.allGroupsOption}
              </button>
              {depthGroupOptions.map((groupName) => (
                <button
                  key={groupName}
                  type="button"
                  onClick={() => setDepthGroupFilter(groupName)}
                  style={{
                    height: 28,
                    padding: "0 12px",
                    borderRadius: 20,
                    border: `1px solid ${
                      depthGroupFilter === groupName ? ink.blue : ink.lineStrong
                    }`,
                    background:
                      depthGroupFilter === groupName
                        ? ink.blueSoft
                        : "transparent",
                    color:
                      depthGroupFilter === groupName ? ink.blue : ink.secondary,
                    fontSize: 10.5,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  {groupName}
                </button>
              ))}
            </div>
          )}

          {depthGroupFilter !== "all" && (
            <div style={{ marginBottom: 26 }}>
              <p
                style={{
                  margin: "0 0 10px",
                  color: ink.secondary,
                  fontSize: 11.5,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                }}
              >
                {depthGroupFilter}
              </p>
              <LectureLineRace
                group={depthGroupFilter}
                lectures={lecturesInModule}
                sessions={moduleSessions}
                ink={ink}
                emptyLabel={x.depthNoData}
              />
            </div>
          )}

          {filteredDepthTopics.length === 0 ? (
            <p style={{ color: ink.muted, fontSize: 13, lineHeight: 1.6 }}>
              {x.depthNoData}
            </p>
          ) : (
            <>
              {filteredDepthTopics.length >= 3 &&
                (() => {
                  const radarSize = 300;
                  const center = radarSize / 2;
                  const maxRadius = center - 50;
                  const axisCount = filteredDepthTopics.length;
                  const angleStep = (Math.PI * 2) / axisCount;
                  const pointAt = (index, valuePercent) => {
                    const angle = angleStep * index - Math.PI / 2;
                    const r =
                      (Math.max(0, Math.min(100, valuePercent)) / 100) *
                      maxRadius;
                    return {
                      x: center + r * Math.cos(angle),
                      y: center + r * Math.sin(angle),
                    };
                  };
                  const labelPointAt = (index) => {
                    const angle = angleStep * index - Math.PI / 2;
                    const r = maxRadius + 24;
                    return {
                      x: center + r * Math.cos(angle),
                      y: center + r * Math.sin(angle),
                    };
                  };
                  const dataPoints = filteredDepthTopics.map((topic, index) =>
                    pointAt(index, topic.recentPercent)
                  );
                  const polygonPoints = dataPoints
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ");
                  const ringLevels = [25, 50, 75, 100];
                  return (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 28,
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          maxWidth: 340,
                          aspectRatio: "1 / 1",
                        }}
                      >
                        <svg
                          viewBox={`0 0 ${radarSize} ${radarSize}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            overflow: "visible",
                          }}
                        >
                          {ringLevels.map((level) => (
                            <polygon
                              key={level}
                              points={filteredDepthTopics
                                .map((_, index) => {
                                  const p = pointAt(index, level);
                                  return `${p.x},${p.y}`;
                                })
                                .join(" ")}
                              fill="none"
                              stroke={ink.line}
                              strokeWidth={1}
                            />
                          ))}
                          {filteredDepthTopics.map((_, index) => {
                            const edge = pointAt(index, 100);
                            return (
                              <line
                                key={index}
                                x1={center}
                                y1={center}
                                x2={edge.x}
                                y2={edge.y}
                                stroke={ink.line}
                                strokeWidth={1}
                              />
                            );
                          })}
                          <polygon
                            points={polygonPoints}
                            fill={ink.blueSoft}
                            stroke={ink.blue}
                            strokeWidth={2}
                            fillOpacity={0.6}
                          />
                          {dataPoints.map((p, index) => (
                            <circle
                              key={index}
                              cx={p.x}
                              cy={p.y}
                              r={3.5}
                              fill={scoreColor(
                                filteredDepthTopics[index].recentPercent
                              )}
                              stroke={ink.page}
                              strokeWidth={1.5}
                            />
                          ))}
                          {filteredDepthTopics.map((topic, index) => {
                            const lp = labelPointAt(index);
                            return (
                              <text
                                key={topic.name}
                                x={lp.x}
                                y={lp.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={9.5}
                                fontWeight={700}
                                fill={ink.secondary}
                              >
                                {topic.name.length > 16
                                  ? `${topic.name.slice(0, 15)}…`
                                  : topic.name}
                              </text>
                            );
                          })}
                        </svg>
                      </div>
                    </div>
                  );
                })()}

              <div style={{ display: "grid", gap: 18 }}>
                {filteredDepthTopics
                  .slice()
                  .sort((a, b) => {
                    const order = { down: 0, early: 1, stable: 2, up: 3 };
                    return order[a.trend] - order[b.trend];
                  })
                  .map((topicTrend) => {
                    const sentence =
                      topicTrend.trend === "up"
                        ? x.depthSentenceUp(topicTrend.name)
                        : topicTrend.trend === "down"
                        ? x.depthSentenceDown(topicTrend.name)
                        : topicTrend.trend === "early"
                        ? x.depthSentenceEarly(topicTrend.name)
                        : x.depthSentenceStable(topicTrend.name);
                    const dotColor =
                      topicTrend.trend === "up"
                        ? ink.green
                        : topicTrend.trend === "down"
                        ? ink.red
                        : topicTrend.trend === "early"
                        ? ink.muted
                        : ink.blue;
                    return (
                      <div
                        key={topicTrend.name}
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 14,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: dotColor,
                            flexShrink: 0,
                            transform: "translateY(-2px)",
                          }}
                        />
                        <p
                          style={{
                            margin: 0,
                            color: ink.text,
                            fontSize: 14.5,
                            lineHeight: 1.6,
                          }}
                        >
                          {sentence}
                          <span
                            style={{
                              marginInlineStart: 8,
                              color: ink.muted,
                              fontFamily: '"Space Mono",monospace',
                              fontSize: 11,
                            }}
                          >
                            {topicTrend.recentPercent}%
                          </span>
                        </p>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </section>
      )}

      {divider}

      {/* Kapitel 6 — Sessionslog (globalt) -------------------------------- */}
      <section>
        {eyebrow(x.recentHeading)}
        <div style={{ marginTop: 18 }}>
          {sessions.slice(0, 10).map((session, index) => {
            const open = expandedId === session.id;
            const categoryRows = Object.entries(session.categories || {})
              .map(([name, value]) => ({
                name,
                ...value,
                percent: value.total
                  ? Math.round((value.correct / value.total) * 100)
                  : 0,
              }))
              .sort((a, b) => a.percent - b.percent);
            const lowest = categoryRows[0];
            return (
              <article
                key={session.id}
                style={{
                  borderBottom:
                    index === Math.min(9, sessions.length - 1)
                      ? 0
                      : `1px solid ${ink.line}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : session.id)}
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(150px,1.4fr) minmax(100px,1fr) 90px 70px",
                    gap: 14,
                    alignItems: "center",
                    padding: "14px 0",
                    border: 0,
                    background: "transparent",
                    color: ink.text,
                    textAlign: "start",
                    cursor: "pointer",
                  }}
                >
                  <span>
                    <strong style={{ display: "block", fontSize: 12.5 }}>
                      {session.module || "MCQ"}
                    </strong>
                    <span
                      style={{
                        display: "block",
                        marginTop: 4,
                        color: ink.muted,
                        fontSize: 10,
                      }}
                    >
                      {formatDate(session.completedAt)}
                    </span>
                  </span>
                  <span style={{ color: ink.secondary, fontSize: 11 }}>
                    {session.correct}/{session.total} {x.correct}
                  </span>
                  <span
                    style={{
                      color: ink.secondary,
                      fontFamily: '"Space Mono",monospace',
                      fontSize: 11,
                    }}
                  >
                    {formatDuration(session.durationSeconds)}
                  </span>
                  <span
                    style={{
                      justifySelf: "end",
                      color: scoreColor(session.score),
                      fontFamily: '"Space Mono",monospace',
                      fontSize: 13,
                      fontWeight: 800,
                    }}
                  >
                    {session.score}%
                  </span>
                </button>
                {open && (
                  <div className="fade-up" style={{ padding: "0 0 20px" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "minmax(170px,.7fr) minmax(0,1.3fr)",
                        gap: 20,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: ink.muted,
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: ".07em",
                            textTransform: "uppercase",
                          }}
                        >
                          {x.lowest}
                        </div>
                        <div
                          style={{
                            marginTop: 6,
                            color: ink.text,
                            fontSize: 13,
                            fontWeight: 700,
                          }}
                        >
                          {lowest ? `${lowest.name} · ${lowest.percent}%` : "—"}
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: 8 }}>
                        {categoryRows.map((row) => (
                          <div
                            key={row.name}
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "minmax(110px,1fr) 35px minmax(80px,1fr)",
                              gap: 8,
                              alignItems: "center",
                              fontSize: 10,
                            }}
                          >
                            <span
                              style={{ color: ink.secondary, fontWeight: 700 }}
                            >
                              {row.name}
                            </span>
                            <span
                              style={{ color: ink.muted, textAlign: "end" }}
                            >
                              {row.percent}%
                            </span>
                            <span
                              style={{
                                height: 4,
                                overflow: "hidden",
                                borderRadius: 9,
                                background: ink.line,
                              }}
                            >
                              <span
                                style={{
                                  display: "block",
                                  width: `${row.percent}%`,
                                  height: "100%",
                                  borderRadius: 9,
                                  background: scoreColor(row.percent),
                                }}
                              />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AdvancedPlanTimeline({
  c,
  language,
  copy,
  today,
  exam,
  timelineDays,
  mode,
  questionTotal,
  questionsForDayIndex,
  unitForDay,
  reviewIntervals,
}) {
  const scrollRef = useRef(null);
  const dayKey = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const isToday = (date) => dayKey(date) === dayKey(today);
  const isExam = (date) => exam && dayKey(date) === dayKey(exam);
  const label = (date) =>
    new Intl.DateTimeFormat(language === "da" ? "da-DK" : "en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  const questionsForDay = (index) => questionsForDayIndex(index);
  const intervals = reviewIntervals || [1, 3, 7];
  const reviewsForDay = (index) =>
    intervals.flatMap((offset) =>
      index >= offset
        ? unitForDay(index - offset)
            .slice(0, 2)
            .map((unit) => ({ ...unit, offset }))
        : []
    );
  const scrollTo = (selector) => {
    const node = scrollRef.current?.querySelector(selector);
    if (node)
      scrollRef.current.scrollTo({
        left: Math.max(0, node.offsetLeft - 24),
        behavior: "smooth",
      });
  };
  return (
    <div style={{ overflow: "hidden", background: c.soft }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 7,
          padding: "12px 18px",
          borderBottom: `1px solid ${c.border}`,
          background: c.panel,
        }}
      >
        <button
          type="button"
          onClick={() => scrollTo('[data-today="true"]')}
          style={{
            height: 30,
            padding: "0 10px",
            borderRadius: 8,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.secondary,
            fontSize: 10,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {copy.today}
        </button>
        <button
          type="button"
          onClick={() => scrollTo('[data-exam="true"]')}
          style={{
            height: 30,
            padding: "0 10px",
            borderRadius: 8,
            border: `1px solid ${c.red}55`,
            background: c.redSoft,
            color: c.red,
            fontSize: 10,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {copy.examDay}
        </button>
      </div>
      <div
        ref={scrollRef}
        style={{ overflowX: "auto", overscrollBehaviorInline: "contain" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${timelineDays.length}, 122px)`,
            minWidth: Math.max(850, timelineDays.length * 122),
          }}
        >
          {timelineDays.map((date, index) => {
            const todayColumn = isToday(date),
              examColumn = isExam(date),
              units =
                mode === "lectures" && !examColumn ? unitForDay(index) : [],
              questions = !examColumn ? questionsForDay(index) : 0,
              reviews =
                mode === "lectures" && !examColumn ? reviewsForDay(index) : [];
            return (
              <article
                key={date.toISOString()}
                data-today={todayColumn || undefined}
                data-exam={examColumn || undefined}
                style={{
                  position: "relative",
                  minHeight: 372,
                  padding: "0 9px 14px",
                  borderInlineEnd: `1px solid ${c.border}`,
                  background: examColumn
                    ? c.redSoft
                    : todayColumn
                    ? c.blueSoft
                    : c.panel,
                }}
              >
                <header
                  style={{
                    minHeight: 58,
                    margin: "0 -9px 11px",
                    padding: "10px 9px 8px",
                    borderBottom: `1px solid ${c.border}`,
                    background: examColumn
                      ? c.redSoft
                      : todayColumn
                      ? c.blueSoft
                      : c.panel,
                  }}
                >
                  <div
                    style={{
                      color: examColumn
                        ? c.red
                        : todayColumn
                        ? c.blue
                        : c.muted,
                      fontSize: 9,
                      fontWeight: 850,
                      letterSpacing: ".07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {examColumn
                      ? copy.examDay
                      : todayColumn
                      ? copy.today
                      : label(date)}
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      color: c.text,
                      fontFamily: '"Space Mono",monospace',
                      fontSize: 15,
                      fontWeight: 800,
                    }}
                  >
                    {date.getDate()}
                  </div>
                </header>
                {todayColumn && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      insetInlineStart: 0,
                      width: 3,
                      background: c.blue,
                    }}
                  />
                )}
                {examColumn ? (
                  <div
                    style={{
                      display: "grid",
                      placeItems: "center",
                      minHeight: 140,
                      padding: 12,
                      borderRadius: 12,
                      border: `1px solid ${c.red}44`,
                      background: `${c.red}12`,
                      color: c.red,
                      textAlign: "center",
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {copy.examDay}
                  </div>
                ) : (
                  <>
                    {units.length > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div
                          style={{
                            marginBottom: 5,
                            color: c.blue,
                            fontSize: 9,
                            fontWeight: 850,
                            letterSpacing: ".07em",
                            textTransform: "uppercase",
                          }}
                        >
                          {copy.lecture}
                        </div>
                        {units.slice(0, 2).map((unit) => (
                          <div
                            key={`${unit.id}-${unit.part || 1}`}
                            title={unit.title}
                            style={{
                              marginBottom: 5,
                              padding: "7px 8px",
                              borderRadius: 8,
                              border: `1px solid ${c.blueBorder}`,
                              background: c.blueSoft,
                              color: c.blue,
                              fontSize: 10,
                              fontWeight: 750,
                              lineHeight: 1.3,
                            }}
                          >
                            {unit.title}
                            {unit.part ? ` · ${unit.part}` : ""}
                          </div>
                        ))}
                        {units.length > 2 && (
                          <div
                            style={{
                              color: c.muted,
                              fontSize: 10,
                              fontWeight: 750,
                            }}
                          >
                            +{units.length - 2}{" "}
                            {language === "da" ? "øvrige" : "more"}
                          </div>
                        )}
                      </div>
                    )}
                    {questions > 0 && (
                      <div style={{ marginBottom: 10 }}>
                        <div
                          style={{
                            marginBottom: 5,
                            color: c.green,
                            fontSize: 9,
                            fontWeight: 850,
                            letterSpacing: ".07em",
                            textTransform: "uppercase",
                          }}
                        >
                          {copy.questionsLabel}
                        </div>
                        <div
                          style={{
                            padding: "9px 8px",
                            borderRadius: 8,
                            border: `1px solid ${c.green}44`,
                            background: c.greenSoft,
                            color: c.green,
                            fontFamily: '"Space Mono",monospace',
                            fontSize: 12,
                            fontWeight: 800,
                          }}
                        >
                          {questions} {language === "da" ? "nye" : "new"}
                        </div>
                      </div>
                    )}
                    {reviews.length > 0 && (
                      <div>
                        <div
                          style={{
                            marginBottom: 5,
                            color: c.blue,
                            fontSize: 9,
                            fontWeight: 850,
                            letterSpacing: ".07em",
                            textTransform: "uppercase",
                          }}
                        >
                          {copy.review}
                        </div>
                        {reviews.slice(0, 2).map((unit, i) => (
                          <div
                            key={`${unit.id}-${unit.offset}-${i}`}
                            title={unit.title}
                            style={{
                              overflow: "hidden",
                              marginBottom: 4,
                              padding: "6px 7px",
                              borderRadius: 7,
                              background: `${c.blue}14`,
                              color: c.blue,
                              fontSize: 10,
                              fontWeight: 700,
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ↻ {unit.title}
                          </div>
                        ))}
                        {reviews.length > 2 && (
                          <div
                            style={{
                              color: c.muted,
                              fontSize: 10,
                              fontWeight: 750,
                            }}
                          >
                            +{reviews.length - 2}{" "}
                            {language === "da" ? "øvrige" : "more"}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 14,
          padding: "11px 18px",
          borderTop: `1px solid ${c.border}`,
          background: c.panel,
          color: c.secondary,
          fontSize: 10,
          fontWeight: 700,
        }}
      >
        {[
          [c.blue, copy.lecture],
          [c.green, copy.questionsLabel],
          [c.blue, copy.review],
        ].map(([color, text]) => (
          <span
            key={text}
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <i
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
              }}
            />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

const REVIEW_METHODS = {
  2357: { id: "2357", intervals: [2, 3, 5, 7], maxRecommendedDays: 14 },
  1371430: {
    id: "1371430",
    intervals: [1, 3, 7, 14, 30],
    maxRecommendedDays: Infinity,
  },
};

function StepReveal({ c, icon, number, title, label, sublabel }) {
  return (
    <div
      className="fullscreen-reveal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "grid",
        placeItems: "center",
        background: `linear-gradient(160deg, ${c.page}, ${c.blueSoft})`,
      }}
    >
      <div style={{ textAlign: "center", padding: 24 }}>
        <div
          className="wave-float"
          style={{
            width: 74,
            height: 74,
            margin: "0 auto 22px",
            display: "grid",
            placeItems: "center",
            borderRadius: 22,
            background: c.blueSoft,
            border: `1px solid ${c.blueBorder}`,
            color: c.blue,
          }}
        >
          <Icon name={icon} size={32} />
        </div>
        <div
          className="reveal-number"
          style={{
            fontFamily: title ? "inherit" : '"Space Mono",monospace',
            fontSize: title
              ? "clamp(26px,4.4vw,40px)"
              : "clamp(52px,10vw,88px)",
            fontWeight: 800,
            color: c.text,
            lineHeight: 1.15,
          }}
        >
          {title || number}
        </div>
        <div
          className="reveal-number"
          style={{
            marginTop: 14,
            color: c.blue,
            fontSize: "clamp(16px,2.6vw,22px)",
            fontWeight: 800,
            letterSpacing: "-.01em",
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div
            className="reveal-number"
            style={{
              marginTop: 8,
              color: c.secondary,
              fontSize: 13,
              fontWeight: 650,
            }}
          >
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkloadVisualizer({
  c,
  copy,
  hoursPerDay,
  estimatedMinutes,
  capacityMinutes,
  days,
  reviewIntervals,
  lectureUnitsCount,
  language,
}) {
  const fillPct = Math.max(
    4,
    Math.min(
      100,
      Math.round((capacityMinutes / Math.max(estimatedMinutes, 1)) * 100)
    )
  );
  const isOk = capacityMinutes >= estimatedMinutes;
  const waveColor = isOk ? c.green : c.red;
  const waveSoft = isOk ? c.greenSoft : c.redSoft;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,220px) minmax(0,1fr)",
        gap: 24,
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 150,
          height: 150,
          margin: "0 auto",
          borderRadius: "50%",
          overflow: "hidden",
          background: c.soft,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadow,
        }}
      >
        <div
          className="wave-float"
          style={{
            position: "absolute",
            left: -4,
            right: -4,
            bottom: -14,
            height: `calc(${fillPct}% + 14px)`,
            background: `linear-gradient(180deg, ${waveSoft}, ${waveColor})`,
            transition: "height 400ms cubic-bezier(.16,1,.3,1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Space Mono",monospace',
                fontSize: 26,
                fontWeight: 800,
                color: c.text,
              }}
            >
              {fillPct}%
            </div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: c.muted,
                letterSpacing: ".04em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {copy.perDayHours}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            fontWeight: 700,
            color: c.secondary,
          }}
        >
          <span>
            {Math.round(estimatedMinutes)} {copy.minutes}
          </span>
          <span>
            {capacityMinutes} {copy.minutes}
          </span>
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 99,
            background: c.soft,
            overflow: "hidden",
            border: `1px solid ${c.border}`,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.min(100, fillPct)}%`,
              background: waveColor,
              borderRadius: 99,
              transition: "width 400ms cubic-bezier(.16,1,.3,1)",
            }}
          />
        </div>
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: isOk ? c.greenSoft : c.redSoft,
            color: isOk ? c.green : c.red,
            fontSize: 11.5,
            fontWeight: 700,
            lineHeight: 1.5,
          }}
        >
          {isOk ? copy.capacityOk : copy.capacityWarning}
        </div>
        <div style={{ color: c.muted, fontSize: 10, lineHeight: 1.5 }}>
          {copy.waterLevelHint}
        </div>
      </div>
    </div>
  );
}

function StudyPlan({ c, language, user, setUser }) {
  const [plans, setPlans] = useStoredState(STORAGE.studyPlans, {});
  const existing = plans[user.module];
  const [step, setStep] = useState(existing ? 9 : 1);
  const [level, setLevel] = useState(user.level || "Kandidat");
  const [moduleName, setModuleName] = useState(user.module || "");
  const [examDate, setExamDate] = useState(existing?.examDate || "");
  const [mode, setMode] = useState(existing?.mode || "lectures");
  const [done, setDone] = useState(existing?.doneLectureIds || []);
  const [hoursPerDay, setHoursPerDay] = useState(existing?.hoursPerDay || 2);
  const [hoursPerLecture, setHoursPerLecture] = useState(
    existing?.hoursPerLecture || 1
  );
  const [questionDistribution, setQuestionDistribution] = useState(
    existing?.questionDistribution || "spread"
  );
  const [reviewMethod, setReviewMethod] = useState(
    existing?.reviewMethod || null
  );
  const [excludedDates, setExcludedDates] = useState(
    existing?.excludedDates || []
  );
  const [newExceptionDate, setNewExceptionDate] = useState("");
  const [difficultyEnabled, setDifficultyEnabled] = useState(
    existing?.difficultyEnabled || false
  );
  const [difficulty, setDifficulty] = useState(existing?.difficulty || {});
  const [planSaved, setPlanSaved] = useState(Boolean(existing));
  const [timelineView, setTimelineView] = useState("list");
  const [reveal, setReveal] = useState(null);
  const [confirmDeletePlan, setConfirmDeletePlan] = useState(false);
  const revealTimerRef = useRef(null);
  useEffect(
    () => () => {
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    },
    []
  );

  // Robusthedsfix: garanterer at studieplanens blokke altid findes i
  // kalenderen, uanset i hvilken rækkefølge komponenterne monteres. Uden
  // dette kunne kalenderen vise forældede/manglende data, hvis den blev
  // åbnet i et andet browserfaneblad, eller hvis "medlearn-storage-update"
  // eventet blev udsendt før CalendarPanel/Dashboard var monteret og
  // lyttede efter det. Kører kun når der allerede findes en gemt plan
  // (dvs. brugeren er på oversigtstrinnet), og kun én gang ved montering.
  useEffect(() => {
    if (existing) {
      syncPlanToCalendar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function triggerReveal(type, nextStep) {
    setReveal(type);
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      setReveal(null);
      setStep(nextStep);
    }, 2600);
  }
  const lectures = MODULE_LECTURES[moduleName] || [];
  const totalLecturesCount = lectures.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = examDate ? new Date(`${examDate}T00:00:00`) : null;
  const days = exam ? Math.max(0, Math.ceil((exam - today) / 86400000)) : 0;
  const pending = lectures.filter((item) => !done.includes(item.id));
  const lectureUnits =
    mode === "lectures"
      ? pending.flatMap((item) =>
          Array.from({ length: item.parts || 1 }, (_, i) => ({
            ...item,
            part: (item.parts || 1) > 1 ? i + 1 : null,
          }))
        )
      : [];
  const questionTotal = QUESTIONS.length;
  const activeDays = Math.max(1, days);
  const dayDateKeys = Array.from({ length: activeDays }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
  });
  const isExcludedDay = (dayIndex) =>
    excludedDates.includes(dayDateKeys[dayIndex] || "");
  const availableDayIndices = Array.from(
    { length: activeDays },
    (_, i) => i
  ).filter((i) => !isExcludedDay(i));
  const availableDaysCount = Math.max(1, availableDayIndices.length);
  const difficultyWeight = (level2) =>
    level2 === "hard" ? 1.6 : level2 === "easy" ? 0.7 : 1;

  function distributeEvenly(totalItems, bucketCount) {
    const buckets = Math.max(1, bucketCount);
    const base = Math.floor(totalItems / buckets);
    const remainder = totalItems % buckets;
    return Array.from(
      { length: buckets },
      (_, i) => base + (i < remainder ? 1 : 0)
    );
  }
  function cumulativeStarts(counts) {
    const starts = [];
    let running = 0;
    for (let i = 0; i < counts.length; i++) {
      starts.push(running);
      running += counts[i];
    }
    return starts;
  }

  const lecturesPerDayCounts = distributeEvenly(
    lectureUnits.length,
    availableDaysCount
  );
  const lecturesPerDayStarts = cumulativeStarts(lecturesPerDayCounts);
  const lecturesPerDay = lecturesPerDayCounts.length
    ? Math.max(...lecturesPerDayCounts)
    : 0;
  const crammWindowDays = Math.min(availableDaysCount, 14);
  const crammStartIndex = Math.max(
    0,
    availableDayIndices.length - crammWindowDays
  );
  const useCramming = mode === "lectures" && questionDistribution === "cram";
  const questionsPerDayCounts = useCramming
    ? distributeEvenly(questionTotal, crammWindowDays)
    : distributeEvenly(questionTotal, availableDaysCount);
  const questionsPerDayStarts = cumulativeStarts(questionsPerDayCounts);
  const questionsPerDay = questionsPerDayCounts.length
    ? Math.max(...questionsPerDayCounts)
    : 0;
  const questionsForDayIndex = (dayIndex) => {
    if (isExcludedDay(dayIndex)) return 0;
    const posInAvailable = availableDayIndices.indexOf(dayIndex);
    if (posInAvailable === -1) return 0;
    if (useCramming) {
      const posInCramWindow = posInAvailable - crammStartIndex;
      if (
        posInCramWindow < 0 ||
        posInCramWindow >= questionsPerDayCounts.length
      )
        return 0;
      return questionsPerDayCounts[posInCramWindow];
    }
    return questionsPerDayCounts[posInAvailable] || 0;
  };
  const totalDifficultyWeight = lectureUnits.reduce(
    (sum, u) => sum + difficultyWeight(difficulty[u.id]),
    0
  );
  const avgWeight = lectureUnits.length
    ? totalDifficultyWeight / lectureUnits.length
    : 1;
  const minutesPerLecture = Math.round(hoursPerLecture * 60);
  const estimatedMinutes = difficultyEnabled
    ? lecturesPerDay * minutesPerLecture * avgWeight +
      questionsPerDay * 2.5 +
      (lectureUnits.length ? 20 : 0)
    : lecturesPerDay * minutesPerLecture +
      questionsPerDay * 2.5 +
      (lectureUnits.length ? 20 : 0);
  const capacityMinutes = Math.round(hoursPerDay * 60);
  const copy =
    {
      da: {
        title: "Studieplan",
        intro: "Opsæt en plan frem mod eksamen",
        next: "Fortsæt",
        back: "Tilbage",
        setup: "Opsætning",
        module: "Modul",
        level: "Niveau",
        exam: "Eksamensdato",
        examHint: "Datoen bruges til at fordele indholdet frem mod eksamen.",
        pathway: "Indhold og metode",
        lectures: "Forelæsninger + eksamenssæt",
        lecturesText: "Fordeler resterende forelæsninger og eksamensspørgsmål.",
        questions: "Kun eksamenssæt",
        questionsText:
          "Planlægger eksamensspørgsmål og repetition uden forelæsninger.",
        prior: "Gennemgået indhold",
        priorText:
          "Markér forelæsninger, du allerede har set. De indgår ikke som nye opgaver.",
        generate: "Opret studieplan",
        edit: "Redigér opsætning",
        overview: "Planoversigt",
        days: "dage til eksamen",
        hours: "timer pr. dag",
        workload: "Forventet arbejdsbyrde",
        minutes: "minutter pr. dag",
        lecturesDay: "forelæsningsdele pr. dag",
        questionsDay: "MCQ'er pr. dag",
        timeline: "Tidslinje",
        today: "I dag",
        examDay: "Eksamen",
        lecture: "Forelæsning",
        questionsLabel: "Nye MCQ'er",
        review: "Repetition",
        noLectures: "Der er endnu ikke tilføjet forelæsninger for dette modul.",
        select: "Vælg modul",
        saved: "Studieplan opdateret",
        planNote:
          "Planen fordeler nyt indhold tidligt og lægger repetition efter de valgte intervaller, når der er tid før eksamen.",
        done: "Gennemgået",
        remaining: "resterende",
        list: "Liste",
        graph: "Planoversigt",
        mcqOnly:
          "Kun eksamenssæt: nye MCQ'er fordeles jævnt over dagene før eksamen.",
        daysUntilExamLabel: "dage til din eksamen",
        stepExamDate: "Eksamensdato",
        stepReviewMethod: "Repetitionsmetode",
        stepQuestionTiming: "Eksamenssæt-fordeling",
        stepHoursPerLecture: "Tid pr. forelæsning",
        stepWorkload: "Daglig arbejdsbyrde",
        reviewStepHint:
          "Vælg hvordan dit gennemgåede indhold skal repeteres frem mod eksamen.",
        method2357Name: "2-3-5-7 metoden",
        method2357Desc:
          "Bedst 1-2 uger før eksamen. Hurtig, intensiv repetition.",
        method137Name: "1-3-7-14-30 reglen",
        method137Desc:
          "Bedst 1+ måned før eksamen. Langsigtet hukommelsesopbygning.",
        recommended: "Anbefalet til dig",
        intervalsLabel: "Repeteres efter",
        questionTimingHint:
          "Skal eksamenssættet øves løbende sammen med hver forelæsning, eller samlet op til et par uger før eksamen?",
        spreadName: "Løbende",
        spreadDesc: "Nye MCQ'er fordeles jævnt hver dag fra start til eksamen.",
        crammName: "Op til eksamen",
        crammDesc:
          "MCQ'er samles i de sidste 14 dage (eller færre) op til eksamen.",
        lecturesInModule: "forelæsninger i dette modul",
        hoursPerLectureQ:
          "Hvor lang tid tager det typisk dig at gå igennem én forelæsning?",
        minutesUnit: "min",
        livePreviewTitle: "Live forhåndsvisning",
        perDayHours: "timer/dag",
        reviewsFit: "repetitioner du kan nå",
        capacityWarning:
          "Din daglige tid dækker ikke helt det planlagte indhold — overvej flere timer.",
        capacityOk: "Din tid pr. dag dækker planen godt.",
        waterLevelHint:
          "Vandstanden viser hvor godt din tid dækker dagens indhold.",
        exceptionDays: "Undtagelsesdage",
        exceptionDaysHint:
          "Markér dage hvor du ikke kan studere. Planen fordeler indholdet uden om disse dage.",
        addExceptionDay: "Tilføj dag",
        noExceptionDays: "Ingen undtagelsesdage tilføjet",
        removeExceptionDay: "Fjern",
        difficultyStep: "Sværhedsgrad (valgfrit)",
        difficultyToggleLabel: "Brug selvvurderet sværhedsgrad",
        difficultyToggleHint:
          "Marker forelæsninger som lette, middel eller svære. Planen giver mere tid til svære forelæsninger.",
        difficultyEasy: "Let",
        difficultyMedium: "Middel",
        difficultyHard: "Svær",
        difficultySkippedHint:
          "Denne funktion er slået fra. Alle forelæsninger får lige meget tid.",
        catchUpTitle: "Indhent forsinkelse",
        catchUpText:
          "Du er bagud med planen. Vil du omfordele det resterende indhold over de dage, der er tilbage?",
        catchUpButton: "Indhent nu",
        catchUpDone: "Planen er opdateret",
        lectureProgress: "Forelæsninger",
        examSetProgress: "Eksamenssæt",
        ofTotal: "af",
        checklistTitle: "Dagens opgaver",
        checklistEmpty: "Intet planlagt for i dag",
        checklistDone: "Færdig",
        markDone: "Markér som færdig",
        exportPlan: "Eksportér studieplan",
        exportPlanDone: "Studieplan eksporteret",
        checkAll: "Marker alle",
        uncheckAll: "Fjern alle",
        checkGroup: "Marker emne",
        uncheckGroup: "Fjern emne",
        ungrouped: "Øvrige",
        deletePlan: "Slet plan",
        deletePlanConfirmTitle: "Slet studieplan?",
        deletePlanConfirmText:
          "Dette fjerner planen permanent og rydder alle tilhørende blokke i kalenderen. Denne handling kan ikke fortrydes.",
        cancel: "Annuller",
      },
      en: {
        title: "Study plan",
        intro: "Set up a plan towards your exam",
        next: "Continue",
        back: "Back",
        setup: "Setup",
        module: "Module",
        level: "Level",
        exam: "Exam date",
        examHint: "The date distributes content up to the exam.",
        pathway: "Content and method",
        lectures: "Lectures + exam sets",
        lecturesText: "Distributes remaining lectures and exam questions.",
        questions: "Exam sets only",
        questionsText: "Plans exam questions and review without lectures.",
        prior: "Completed content",
        priorText: "Mark lectures you have already watched.",
        generate: "Create study plan",
        edit: "Edit setup",
        overview: "Plan overview",
        days: "days to exam",
        hours: "hours per day",
        workload: "Expected workload",
        minutes: "minutes per day",
        lecturesDay: "lecture units per day",
        questionsDay: "MCQs per day",
        timeline: "Timeline",
        today: "Today",
        examDay: "Exam",
        lecture: "Lecture",
        questionsLabel: "New MCQs",
        review: "Review",
        noLectures: "Lectures have not been added for this module yet.",
        select: "Select module",
        saved: "Study plan updated",
        planNote:
          "The plan places new content early and schedules review after the chosen intervals when time allows.",
        done: "Completed",
        remaining: "remaining",
        list: "List",
        graph: "Plan overview",
        mcqOnly:
          "Exam sets only: new MCQs are distributed across the days before the exam.",
        daysUntilExamLabel: "days until your exam",
        stepExamDate: "Exam date",
        stepReviewMethod: "Review method",
        stepQuestionTiming: "Exam set timing",
        stepHoursPerLecture: "Time per lecture",
        stepWorkload: "Daily workload",
        reviewStepHint:
          "Choose how your completed content should be reviewed towards the exam.",
        method2357Name: "The 2-3-5-7 Method",
        method2357Desc:
          "Best for 1-2 weeks before an exam. Fast, intensive review.",
        method137Name: "The 1-3-7-14-30 Rule",
        method137Desc: "Best for 1+ month before an exam. Long-term retention.",
        recommended: "Recommended for you",
        intervalsLabel: "Reviewed after",
        questionTimingHint:
          "Should the exam set be practiced continuously alongside each lecture, or bundled a couple of weeks before the exam?",
        spreadName: "Continuous",
        spreadDesc: "New MCQs are spread evenly from start to exam day.",
        crammName: "Close to exam",
        crammDesc:
          "MCQs are bundled into the last 14 days (or fewer) before the exam.",
        lecturesInModule: "lectures in this module",
        hoursPerLectureQ:
          "How long does it typically take you to get through one lecture?",
        minutesUnit: "min",
        livePreviewTitle: "Live preview",
        perDayHours: "hours/day",
        reviewsFit: "reviews you can fit",
        capacityWarning:
          "Your daily time doesn't quite cover the planned content — consider more hours.",
        capacityOk: "Your daily time covers the plan well.",
        waterLevelHint:
          "The water level shows how well your time covers today's content.",
        exceptionDays: "Exception days",
        exceptionDaysHint:
          "Mark days you can't study. The plan distributes content around these days.",
        addExceptionDay: "Add day",
        noExceptionDays: "No exception days added",
        removeExceptionDay: "Remove",
        difficultyStep: "Difficulty (optional)",
        difficultyToggleLabel: "Use self-rated difficulty",
        difficultyToggleHint:
          "Mark lectures as easy, medium, or hard. The plan allocates more time to hard lectures.",
        difficultyEasy: "Easy",
        difficultyMedium: "Medium",
        difficultyHard: "Hard",
        difficultySkippedHint:
          "This feature is turned off. All lectures get equal time.",
        catchUpTitle: "Catch up on delay",
        catchUpText:
          "You're behind on your plan. Redistribute the remaining content over the days left?",
        catchUpButton: "Catch up now",
        catchUpDone: "Plan updated",
        lectureProgress: "Lectures",
        examSetProgress: "Exam set",
        ofTotal: "of",
        checklistTitle: "Today's tasks",
        checklistEmpty: "Nothing planned for today",
        checklistDone: "Done",
        markDone: "Mark as done",
        exportPlan: "Export study plan",
        exportPlanDone: "Study plan exported",
        checkAll: "Check all",
        uncheckAll: "Uncheck all",
        checkGroup: "Check topic",
        uncheckGroup: "Uncheck topic",
        ungrouped: "Other",
        deletePlan: "Delete plan",
        deletePlanConfirmTitle: "Delete study plan?",
        deletePlanConfirmText:
          "This permanently removes the plan and clears all related blocks from the calendar. This action cannot be undone.",
        cancel: "Cancel",
      },
    }[language] || {};
  const field = {
    width: "100%",
    height: 48,
    padding: "0 13px",
    borderRadius: 12,
    border: `1px solid ${c.borderStrong}`,
    background: c.soft,
    color: c.text,
    fontSize: 13,
    outline: 0,
  };
  const setModule = (value) => {
    setModuleName(value);
    const saved = plans[value];
    setDone(saved?.doneLectureIds || []);
    setExamDate(saved?.examDate || "");
    setMode(saved?.mode || "lectures");
    setHoursPerDay(saved?.hoursPerDay || 2);
    setHoursPerLecture(saved?.hoursPerLecture || 1);
    setQuestionDistribution(saved?.questionDistribution || "spread");
    setReviewMethod(saved?.reviewMethod || null);
    setExcludedDates(saved?.excludedDates || []);
    setDifficultyEnabled(saved?.difficultyEnabled || false);
    setDifficulty(saved?.difficulty || {});
    setPlanSaved(Boolean(saved));
  };
  const toggle = (id) =>
    setDone((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
    );
  const save = () => {
    setPlans((old) => ({
      ...old,
      [moduleName]: {
        examDate,
        mode,
        doneLectureIds: done,
        hoursPerDay,
        hoursPerLecture,
        questionDistribution,
        reviewMethod,
        excludedDates,
        difficultyEnabled,
        difficulty,
        createdAt: existing?.createdAt || Date.now(),
      },
    }));
    setUser((old) => ({ ...old, level, module: moduleName }));
    setPlanSaved(true);
    setStep(9);
    syncPlanToCalendar();
  };
  const toggleExceptionDate = () => {
    if (!newExceptionDate) return;
    setExcludedDates((old) =>
      old.includes(newExceptionDate) ? old : [...old, newExceptionDate].sort()
    );
    setNewExceptionDate("");
  };
  const removeExceptionDate = (date) =>
    setExcludedDates((old) => old.filter((d) => d !== date));
  const setLectureDifficulty = (id, level2) =>
    setDifficulty((old) => ({ ...old, [id]: level2 }));
  function syncPlanToCalendar() {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE.calendarEvents) || "[]"
    );
    const withoutOldPlan = stored.filter(
      (event) => event.planModuleId !== moduleName
    );
    const newEvents = timelineDays
      .slice(0, Math.max(days, 0))
      .map((date, index) => {
        const units = unitForDay(index);
        const title = units.length
          ? `${moduleName} \u00b7 ${units.map((u) => u.title).join(", ")}`
          : `${moduleName} \u00b7 ${questionsForDayIndex(index)} MCQ`;
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        return {
          id: `studyplan-${moduleName}-${index}`,
          title,
          date: dateKey(y, m, d),
          time: "18:00",
          type: "study",
          planModuleId: moduleName,
        };
      });
    localStorage.setItem(
      STORAGE.calendarEvents,
      JSON.stringify([...withoutOldPlan, ...newEvents])
    );
    window.dispatchEvent(
      new CustomEvent("medlearn-storage-update", {
        detail: { key: STORAGE.calendarEvents },
      })
    );
  }

  function deletePlan() {
    // Fjerner selve planen fra STORAGE.studyPlans, og rydder samtidig alle
    // kalenderevents, der stammer fra denne plan (planModuleId), så
    // kalenderen ikke efterlader "spøgelses-blokke" fra en slettet plan.
    setPlans((old) => {
      const next = { ...old };
      delete next[moduleName];
      return next;
    });
    const stored = JSON.parse(
      localStorage.getItem(STORAGE.calendarEvents) || "[]"
    );
    const withoutPlan = stored.filter(
      (event) => event.planModuleId !== moduleName
    );
    localStorage.setItem(STORAGE.calendarEvents, JSON.stringify(withoutPlan));
    window.dispatchEvent(
      new CustomEvent("medlearn-storage-update", {
        detail: { key: STORAGE.calendarEvents },
      })
    );
    setPlanSaved(false);
    setDone([]);
    setStep(1);
  }
  const addDays = (date, count) => {
    const value = new Date(date);
    value.setDate(value.getDate() + count);
    return value;
  };
  const dateShort = (date) =>
    new Intl.DateTimeFormat(language === "da" ? "da-DK" : "en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  const timelineDays = Array.from({ length: Math.max(days + 1, 1) }, (_, i) =>
    addDays(today, i)
  );
  const unitForDay = (dayIndex) => {
    if (isExcludedDay(dayIndex)) return [];
    const posInAvailable = availableDayIndices.indexOf(dayIndex);
    if (posInAvailable === -1) return [];
    const start = lecturesPerDayStarts[posInAvailable] ?? 0;
    const count = lecturesPerDayCounts[posInAvailable] ?? 0;
    return lectureUnits.slice(start, start + count);
  };
  const typeStyle = (type) =>
    type === "lecture"
      ? [c.blue, c.blueSoft]
      : type === "review"
      ? [c.blue, `${c.blue}14`]
      : [c.green, c.greenSoft];
  const stepTitles = [
    copy.setup,
    copy.stepExamDate,
    copy.stepReviewMethod,
    copy.stepQuestionTiming,
    copy.prior,
    copy.exceptionDays,
    copy.difficultyStep,
    copy.stepHoursPerLecture,
    copy.stepWorkload,
    copy.timeline,
  ];
  const totalWizardSteps = 9;
  const stepTitle = stepTitles[step - 1];
  function exportCalendar() {
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
    const formatICS = (date, hour) => {
      const d = new Date(date);
      d.setHours(hour, 0, 0, 0);
      return d
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };
    const events = timelineDays.flatMap((date, index) => {
      if (index >= days) return [];
      const units = unitForDay(index);
      const title = units.length
        ? `MedLearn \u00b7 ${units.map((x) => x.title).join(", ")}`
        : `MedLearn \u00b7 ${questionsForDayIndex(index)} MCQ`;
      const start = formatICS(date, 18);
      const end = formatICS(
        date,
        Math.min(23, 18 + Math.max(1, Math.ceil(estimatedMinutes / 60)))
      );
      return [
        `BEGIN:VEVENT\r\nUID:medlearn-${moduleName}-${index}@local\r\nDTSTAMP:${stamp}\r\nDTSTART:${start}\r\nDTEND:${end}\r\nSUMMARY:${title}\r\nDESCRIPTION:Study plan for ${moduleName}\r\nEND:VEVENT`,
      ];
    });
    const content = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//MedLearn//Study Plan//EN\r\n${events.join(
      "\r\n"
    )}\r\nEND:VCALENDAR`;
    const url = URL.createObjectURL(
      new Blob([content], { type: "text/calendar;charset=utf-8" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `MedLearn-${moduleName.replace(/[^a-z0-9]+/gi, "-")}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  }
  function exportPlanAsJSON() {
    const dayRows = timelineDays
      .slice(0, Math.max(days, 0))
      .map((date, index) => {
        const units = unitForDay(index);
        const y = date.getFullYear();
        const m = date.getMonth();
        const d = date.getDate();
        return {
          date: dateKey(y, m, d),
          excluded: isExcludedDay(index),
          lectures: units.map((u) => ({
            id: u.id,
            title: u.title,
            part: u.part,
            difficulty: difficulty[u.id] || "medium",
          })),
          questions: questionsForDayIndex(index),
        };
      });
    const payload = {
      module: moduleName,
      level,
      examDate,
      mode,
      reviewMethod,
      hoursPerDay,
      hoursPerLecture,
      questionDistribution,
      excludedDates,
      difficultyEnabled,
      exportedAt: new Date().toISOString(),
      days: dayRows,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `MedLearn-studieplan-${moduleName.replace(
      /[^a-z0-9]+/gi,
      "-"
    )}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (reveal === "examDate") {
    return (
      <StepReveal
        c={c}
        icon="calendar"
        number={days}
        label={copy.daysUntilExamLabel}
      />
    );
  }
  if (reveal === "lectureCount") {
    return (
      <StepReveal
        c={c}
        icon="book"
        number={totalLecturesCount}
        label={copy.lecturesInModule}
      />
    );
  }

  return (
    <>
      <div
        className="fade-up"
        style={{
          width: "min(1080px,100%)",
          margin: "0 auto",
          display: "grid",
          gap: 16,
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 16,
            padding: "7px 1px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                color: c.muted,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".1em",
                textTransform: "uppercase",
              }}
            >
              {copy.intro}
            </div>
            <h1
              style={{
                margin: "7px 0 0",
                color: c.text,
                fontSize: 31,
                letterSpacing: "-.04em",
              }}
            >
              {copy.title}
            </h1>
          </div>
          {planSaved && (
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                height: 35,
                padding: "0 12px",
                borderRadius: 9,
                border: `1px solid ${c.borderStrong}`,
                background: c.panel,
                color: c.secondary,
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {copy.edit}
            </button>
          )}
        </header>
        {step < 9 && (
          <>
            <section
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 2px",
              }}
            >
              {Array.from({ length: totalWizardSteps }, (_, i) => i + 1).map(
                (number) => (
                  <div
                    key={number}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flex: number < totalWizardSteps ? 1 : 0,
                    }}
                  >
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: "50%",
                        background: number <= step ? c.blue : c.soft,
                        color: number <= step ? "#fff" : c.muted,
                        fontFamily: '"Space Mono",monospace',
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    >
                      {number}
                    </span>
                    {number < totalWizardSteps && (
                      <span
                        style={{
                          height: 1,
                          flex: 1,
                          background: number < step ? c.blue : c.border,
                        }}
                      />
                    )}
                  </div>
                )
              )}
            </section>
            <section
              style={{
                padding: "26px clamp(20px,4vw,34px)",
                borderRadius: 18,
                background: c.panel,
                border: `1px solid ${c.border}`,
                boxShadow: c.shadow,
              }}
            >
              <div style={{ marginBottom: 23 }}>
                <div
                  style={{
                    color: c.muted,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                  }}
                >
                  {step}/{totalWizardSteps}
                </div>
                <h2
                  style={{
                    margin: "7px 0 0",
                    color: c.text,
                    fontSize: 21,
                    letterSpacing: "-.025em",
                  }}
                >
                  {stepTitle}
                </h2>
              </div>

              {step === 1 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                    gap: 15,
                  }}
                >
                  <label
                    style={{
                      color: c.secondary,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {copy.level}
                    <select
                      value={level}
                      onChange={(e) => {
                        setLevel(e.target.value);
                        setModule("");
                      }}
                      style={{ ...field, marginTop: 8 }}
                    >
                      <option value="Bachelor">Bachelor</option>
                      <option value="Kandidat">Kandidat</option>
                    </select>
                  </label>
                  <label
                    style={{
                      color: c.secondary,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {copy.module}
                    <select
                      value={moduleName}
                      onChange={(e) => setModule(e.target.value)}
                      style={{ ...field, marginTop: 8 }}
                    >
                      <option value="">{copy.select}</option>
                      {(MODULES[language]?.[level] || MODULES.da[level]).map(
                        (item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                </div>
              )}

              {step === 2 && (
                <div>
                  <label
                    style={{
                      color: c.secondary,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {copy.exam}
                    <input
                      type="date"
                      value={examDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setExamDate(e.target.value)}
                      style={{ ...field, marginTop: 8, colorScheme: "light" }}
                    />
                    <span
                      style={{
                        display: "block",
                        marginTop: 7,
                        color: c.muted,
                        fontSize: 10,
                        lineHeight: 1.4,
                      }}
                    >
                      {copy.examHint}
                    </span>
                  </label>
                </div>
              )}

              {step === 3 && (
                <div>
                  <p
                    style={{
                      margin: "0 0 18px",
                      color: c.secondary,
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {copy.reviewStepHint}
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
                      gap: 14,
                    }}
                  >
                    {Object.entries(REVIEW_METHODS).map(([key, methodDef]) => {
                      const selected = reviewMethod === key;
                      const isRecommended =
                        days > 0 && (key === "2357" ? days <= 14 : days > 14);
                      const name =
                        key === "2357"
                          ? copy.method2357Name
                          : copy.method137Name;
                      const desc =
                        key === "2357"
                          ? copy.method2357Desc
                          : copy.method137Desc;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setReviewMethod(key)}
                          style={{
                            position: "relative",
                            minHeight: 190,
                            padding: 20,
                            borderRadius: 16,
                            border: `1px solid ${
                              selected ? c.blueBorder : c.border
                            }`,
                            background: selected ? c.blueSoft : c.soft,
                            color: c.text,
                            textAlign: "start",
                            cursor: "pointer",
                          }}
                        >
                          {isRecommended && (
                            <span
                              className="pulse-soft"
                              style={{
                                position: "absolute",
                                top: 14,
                                insetInlineEnd: 14,
                                padding: "4px 9px",
                                borderRadius: 99,
                                background: c.green,
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: ".04em",
                                textTransform: "uppercase",
                              }}
                            >
                              {copy.recommended}
                            </span>
                          )}
                          <Icon name="target" size={22} />
                          <strong
                            style={{
                              display: "block",
                              marginTop: 16,
                              fontSize: 15,
                              color: selected ? c.blue : c.text,
                            }}
                          >
                            {name}
                          </strong>
                          <span
                            style={{
                              display: "block",
                              marginTop: 7,
                              color: c.secondary,
                              fontSize: 11.5,
                              lineHeight: 1.55,
                            }}
                          >
                            {desc}
                          </span>
                          <div
                            style={{
                              display: "flex",
                              gap: 6,
                              marginTop: 14,
                              flexWrap: "wrap",
                            }}
                          >
                            {methodDef.intervals.map((interval) => (
                              <span
                                key={interval}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  minWidth: 26,
                                  height: 26,
                                  padding: "0 7px",
                                  borderRadius: 8,
                                  background: c.panel,
                                  color: selected ? c.blue : c.secondary,
                                  fontFamily: '"Space Mono",monospace',
                                  fontSize: 11,
                                  fontWeight: 800,
                                  border: `1px solid ${c.border}`,
                                }}
                              >
                                {interval}
                              </span>
                            ))}
                          </div>
                          <span
                            style={{
                              display: "block",
                              marginTop: 9,
                              color: c.muted,
                              fontSize: 9.5,
                              fontWeight: 700,
                            }}
                          >
                            {copy.intervalsLabel}{" "}
                            {methodDef.intervals.join(", ")}{" "}
                            {language === "da" ? "dage" : "days"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
                      gap: 12,
                      marginBottom: 16,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMode("lectures")}
                      style={{
                        minHeight: 120,
                        padding: 18,
                        borderRadius: 14,
                        border: `1px solid ${
                          mode === "lectures" ? c.blueBorder : c.border
                        }`,
                        background: mode === "lectures" ? c.blueSoft : c.soft,
                        color: c.text,
                        textAlign: "start",
                        cursor: "pointer",
                      }}
                    >
                      <Icon name="book" size={21} />
                      <strong
                        style={{
                          display: "block",
                          marginTop: 16,
                          fontSize: 14,
                          color: mode === "lectures" ? c.blue : c.text,
                        }}
                      >
                        {copy.lectures}
                      </strong>
                      <span
                        style={{
                          display: "block",
                          marginTop: 6,
                          color: c.secondary,
                          fontSize: 11,
                          lineHeight: 1.5,
                        }}
                      >
                        {copy.lecturesText}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("questions")}
                      style={{
                        minHeight: 120,
                        padding: 18,
                        borderRadius: 14,
                        border: `1px solid ${
                          mode === "questions" ? c.blueBorder : c.border
                        }`,
                        background: mode === "questions" ? c.blueSoft : c.soft,
                        color: c.text,
                        textAlign: "start",
                        cursor: "pointer",
                      }}
                    >
                      <Icon name="clipboard" size={21} />
                      <strong
                        style={{
                          display: "block",
                          marginTop: 16,
                          fontSize: 14,
                          color: mode === "questions" ? c.blue : c.text,
                        }}
                      >
                        {copy.questions}
                      </strong>
                      <span
                        style={{
                          display: "block",
                          marginTop: 6,
                          color: c.secondary,
                          fontSize: 11,
                          lineHeight: 1.5,
                        }}
                      >
                        {copy.questionsText}
                      </span>
                    </button>
                  </div>
                  {mode === "lectures" && (
                    <div>
                      <p
                        style={{
                          margin: "0 0 14px",
                          color: c.secondary,
                          fontSize: 12,
                          lineHeight: 1.55,
                        }}
                      >
                        {copy.questionTimingHint}
                      </p>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",
                          gap: 12,
                        }}
                      >
                        {[
                          ["spread", copy.spreadName, copy.spreadDesc],
                          ["cram", copy.crammName, copy.crammDesc],
                        ].map(([key, name, desc]) => {
                          const selected = questionDistribution === key;
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => setQuestionDistribution(key)}
                              style={{
                                minHeight: 100,
                                padding: 16,
                                borderRadius: 13,
                                border: `1px solid ${
                                  selected ? c.blueBorder : c.border
                                }`,
                                background: selected ? c.blueSoft : c.soft,
                                color: c.text,
                                textAlign: "start",
                                cursor: "pointer",
                              }}
                            >
                              <strong
                                style={{
                                  display: "block",
                                  fontSize: 13,
                                  color: selected ? c.blue : c.text,
                                }}
                              >
                                {name}
                              </strong>
                              <span
                                style={{
                                  display: "block",
                                  marginTop: 6,
                                  color: c.secondary,
                                  fontSize: 11,
                                  lineHeight: 1.5,
                                }}
                              >
                                {desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 5 && (
                <>
                  <p
                    style={{
                      margin: "0 0 14px",
                      color: c.secondary,
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {copy.priorText}
                  </p>
                  {lectures.length ? (
                    <>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginBottom: 14,
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setDone(lectures.map((l) => l.id))}
                          style={{
                            height: 34,
                            padding: "0 12px",
                            borderRadius: 9,
                            border: `1px solid ${c.blueBorder}`,
                            background: c.blueSoft,
                            color: c.blue,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {copy.checkAll}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDone([])}
                          style={{
                            height: 34,
                            padding: "0 12px",
                            borderRadius: 9,
                            border: `1px solid ${c.borderStrong}`,
                            background: c.panel,
                            color: c.secondary,
                            fontSize: 11,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {copy.uncheckAll}
                        </button>
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gap: 16,
                          maxHeight: 420,
                          overflowY: "auto",
                          paddingInlineEnd: 4,
                        }}
                      >
                        {Object.entries(
                          lectures.reduce((groups, item) => {
                            const key = item.group || copy.ungrouped;
                            (groups[key] = groups[key] || []).push(item);
                            return groups;
                          }, {})
                        ).map(([groupName, groupItems]) => {
                          const groupIds = groupItems.map((l) => l.id);
                          const allChecked = groupIds.every((id) =>
                            done.includes(id)
                          );
                          const someChecked = groupIds.some((id) =>
                            done.includes(id)
                          );
                          return (
                            <div key={groupName}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginBottom: 8,
                                }}
                              >
                                <span
                                  style={{
                                    color: c.muted,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: ".05em",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {groupName}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDone((old) =>
                                      allChecked
                                        ? old.filter(
                                            (id) => !groupIds.includes(id)
                                          )
                                        : [...new Set([...old, ...groupIds])]
                                    )
                                  }
                                  style={{
                                    height: 26,
                                    padding: "0 10px",
                                    borderRadius: 7,
                                    border: `1px solid ${
                                      someChecked ? c.blueBorder : c.border
                                    }`,
                                    background: someChecked
                                      ? c.blueSoft
                                      : c.soft,
                                    color: someChecked ? c.blue : c.secondary,
                                    fontSize: 10,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                  }}
                                >
                                  {allChecked
                                    ? copy.uncheckGroup
                                    : copy.checkGroup}
                                </button>
                              </div>
                              <div style={{ display: "grid", gap: 7 }}>
                                {groupItems.map((item) => (
                                  <label
                                    key={item.id}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 11,
                                      padding: "11px 12px",
                                      borderRadius: 10,
                                      background: done.includes(item.id)
                                        ? c.blueSoft
                                        : c.soft,
                                      border: `1px solid ${
                                        done.includes(item.id)
                                          ? c.blueBorder
                                          : "transparent"
                                      }`,
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={done.includes(item.id)}
                                      onChange={() => toggle(item.id)}
                                      style={{ accentColor: c.blue }}
                                    />
                                    <span
                                      style={{
                                        color: done.includes(item.id)
                                          ? c.blue
                                          : c.text,
                                        fontFamily: '"Space Mono",monospace',
                                        fontSize: 11,
                                        fontWeight: 700,
                                      }}
                                    >
                                      {item.id}:
                                    </span>
                                    <span
                                      style={{
                                        flex: 1,
                                        color: done.includes(item.id)
                                          ? c.blue
                                          : c.text,
                                        fontSize: 12,
                                        fontWeight: 650,
                                      }}
                                    >
                                      {item.title}
                                    </span>
                                    {item.parts > 1 && (
                                      <span
                                        style={{ color: c.muted, fontSize: 10 }}
                                      >
                                        ({item.parts})
                                      </span>
                                    )}
                                  </label>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <p style={{ color: c.secondary, fontSize: 13 }}>
                      {copy.noLectures}
                    </p>
                  )}
                </>
              )}

              {step === 6 && (
                <div>
                  <p
                    style={{
                      margin: "0 0 16px",
                      color: c.secondary,
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {copy.exceptionDaysHint}
                  </p>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    <input
                      type="date"
                      value={newExceptionDate}
                      onChange={(e) => setNewExceptionDate(e.target.value)}
                      style={{ ...field, flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={toggleExceptionDate}
                      disabled={!newExceptionDate}
                      style={{
                        height: 42,
                        padding: "0 16px",
                        borderRadius: 10,
                        border: "none",
                        background: c.blue,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: newExceptionDate ? "pointer" : "default",
                        opacity: newExceptionDate ? 1 : 0.5,
                      }}
                    >
                      {copy.addExceptionDay}
                    </button>
                  </div>
                  {excludedDates.length ? (
                    <div style={{ display: "grid", gap: 7 }}>
                      {excludedDates.map((d) => (
                        <div
                          key={d}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "10px 12px",
                            borderRadius: 10,
                            background: c.soft,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 650,
                              color: c.text,
                            }}
                          >
                            {new Date(`${d}T00:00:00`).toLocaleDateString()}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeExceptionDate(d)}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: c.red,
                              fontSize: 11,
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            {copy.removeExceptionDay}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: c.muted, fontSize: 12 }}>
                      {copy.noExceptionDays}
                    </p>
                  )}
                </div>
              )}

              {step === 7 && (
                <div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 11,
                      padding: "12px 14px",
                      borderRadius: 11,
                      background: difficultyEnabled ? c.blueSoft : c.soft,
                      border: `1px solid ${
                        difficultyEnabled ? c.blueBorder : "transparent"
                      }`,
                      cursor: "pointer",
                      marginBottom: 14,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={difficultyEnabled}
                      onChange={(e) => setDifficultyEnabled(e.target.checked)}
                      style={{ accentColor: c.blue }}
                    />
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: difficultyEnabled ? c.blue : c.text,
                      }}
                    >
                      {copy.difficultyToggleLabel}
                    </span>
                  </label>
                  <p
                    style={{
                      margin: "0 0 16px",
                      color: c.secondary,
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {difficultyEnabled
                      ? copy.difficultyToggleHint
                      : copy.difficultySkippedHint}
                  </p>
                  {difficultyEnabled && lectures.length ? (
                    <div
                      style={{
                        display: "grid",
                        gap: 7,
                        maxHeight: 340,
                        overflowY: "auto",
                        paddingInlineEnd: 4,
                      }}
                    >
                      {lectures.map((item) => {
                        const lvl = difficulty[item.id] || "medium";
                        return (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "9px 12px",
                              borderRadius: 10,
                              background: c.soft,
                            }}
                          >
                            <span
                              style={{
                                flex: 1,
                                fontSize: 12,
                                fontWeight: 650,
                                color: c.text,
                              }}
                            >
                              {item.id}: {item.title}
                            </span>
                            <div style={{ display: "flex", gap: 4 }}>
                              {["easy", "medium", "hard"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() =>
                                    setLectureDifficulty(item.id, opt)
                                  }
                                  style={{
                                    padding: "5px 9px",
                                    borderRadius: 7,
                                    border: "none",
                                    fontSize: 10,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    background:
                                      lvl === opt
                                        ? opt === "hard"
                                          ? c.red
                                          : opt === "easy"
                                          ? c.green
                                          : c.blue
                                        : c.panel,
                                    color: lvl === opt ? "#fff" : c.secondary,
                                  }}
                                >
                                  {opt === "easy"
                                    ? copy.difficultyEasy
                                    : opt === "hard"
                                    ? copy.difficultyHard
                                    : copy.difficultyMedium}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              )}

              {step === 7 && (
                <div>
                  <p
                    style={{
                      margin: "0 0 18px",
                      color: c.secondary,
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                  >
                    {copy.hoursPerLectureQ}
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <input
                      type="range"
                      min="0.25"
                      max="4"
                      step="0.25"
                      value={hoursPerLecture}
                      onChange={(e) =>
                        setHoursPerLecture(Number(e.target.value))
                      }
                      style={{ flex: 1, accentColor: c.blue }}
                    />
                    <span
                      style={{
                        minWidth: 76,
                        padding: "9px 12px",
                        borderRadius: 11,
                        background: c.blueSoft,
                        color: c.blue,
                        fontFamily: '"Space Mono",monospace',
                        fontSize: 15,
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                    >
                      {Math.round(hoursPerLecture * 60)} {copy.minutesUnit}
                    </span>
                  </div>
                </div>
              )}

              {step === 8 && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      marginBottom: 22,
                    }}
                  >
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={hoursPerDay}
                      onChange={(e) => setHoursPerDay(Number(e.target.value))}
                      style={{ flex: 1, accentColor: c.blue }}
                    />
                    <span
                      style={{
                        minWidth: 64,
                        padding: "9px 12px",
                        borderRadius: 11,
                        background: c.blueSoft,
                        color: c.blue,
                        fontFamily: '"Space Mono",monospace',
                        fontSize: 15,
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                    >
                      {hoursPerDay}t
                    </span>
                  </div>
                  <WorkloadVisualizer
                    c={c}
                    copy={copy}
                    hoursPerDay={hoursPerDay}
                    estimatedMinutes={estimatedMinutes}
                    capacityMinutes={capacityMinutes}
                    days={Math.max(days, 1)}
                    reviewIntervals={
                      REVIEW_METHODS[reviewMethod]?.intervals || [1, 3, 7]
                    }
                    lectureUnitsCount={lectureUnits.length}
                    language={language}
                  />
                </div>
              )}

              <footer
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 25,
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep((value) => Math.max(1, value - 1))}
                  disabled={step === 1}
                  style={{
                    height: 42,
                    padding: "0 14px",
                    borderRadius: 10,
                    border: `1px solid ${c.borderStrong}`,
                    background: c.panel,
                    color: c.secondary,
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: step === 1 ? "default" : "pointer",
                    opacity: step === 1 ? 0.4 : 1,
                  }}
                >
                  {copy.back}
                </button>
                {step === 2 ? (
                  <PrimaryButton
                    disabled={!examDate}
                    onClick={() => triggerReveal("examDate", 3)}
                  >
                    {copy.next}
                  </PrimaryButton>
                ) : step === 5 ? (
                  <PrimaryButton
                    onClick={() =>
                      totalLecturesCount > 0
                        ? triggerReveal("lectureCount", 6)
                        : setStep(6)
                    }
                  >
                    {copy.next}
                  </PrimaryButton>
                ) : step < 9 ? (
                  <PrimaryButton
                    disabled={
                      (step === 1 && !moduleName) ||
                      (step === 3 && !reviewMethod)
                    }
                    onClick={() => setStep((value) => value + 1)}
                  >
                    {copy.next}
                  </PrimaryButton>
                ) : (
                  <PrimaryButton
                    disabled={!moduleName || !examDate}
                    onClick={save}
                  >
                    {copy.generate}
                  </PrimaryButton>
                )}
              </footer>
            </section>
          </>
        )}
        {step === 9 && (
          <>
            <section
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))",
                borderRadius: 17,
                overflow: "hidden",
                background: c.panel,
                border: `1px solid ${c.border}`,
                boxShadow: c.shadow,
              }}
            >
              {[
                [days, copy.days],
                [
                  mode === "questions" ? questionTotal : lectureUnits.length,
                  mode === "questions" ? "MCQ\u2019er i alt" : copy.remaining,
                ],
                [questionsPerDay, copy.questionsDay],
                [
                  `${Math.round(estimatedMinutes)} ${copy.minutes}`,
                  copy.workload,
                ],
              ].map(([value, label]) => (
                <div
                  key={label}
                  style={{
                    padding: "17px 18px",
                    borderInlineEnd: `1px solid ${c.border}`,
                  }}
                >
                  <div
                    style={{
                      color: c.text,
                      fontFamily: '"Space Mono",monospace',
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      color: c.muted,
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </section>
            <section
              style={{
                padding: "16px 18px",
                borderRadius: 14,
                background: c.blueSoft,
                border: `1px solid ${c.blueBorder}`,
                color: c.secondary,
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              {copy.planNote}
              {mode === "questions" && (
                <strong
                  style={{ display: "block", marginTop: 7, color: c.text }}
                >
                  {questionsPerDay} {copy.questionsLabel.toLowerCase()}.
                </strong>
              )}
            </section>
            <section
              style={{
                width: "calc(100% + 32px)",
                marginInline: "-16px",
                borderRadius: 0,
                overflow: "hidden",
                background: c.panel,
                borderTop: `1px solid ${c.border}`,
                borderBottom: `1px solid ${c.border}`,
                boxShadow: c.shadow,
              }}
            >
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "19px max(21px, calc((100vw - 1100px) / 2))",
                  borderBottom: `1px solid ${c.border}`,
                }}
              >
                <h2 style={{ margin: 0, color: c.text, fontSize: 16 }}>
                  {copy.timeline}
                </h2>
                <div style={{ display: "flex", gap: 7 }}>
                  <div
                    style={{
                      display: "flex",
                      padding: 3,
                      borderRadius: 9,
                      background: c.soft,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    {[
                      ["list", copy.list],
                      ["graph", copy.graph],
                    ].map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setTimelineView(id)}
                        style={{
                          height: 28,
                          padding: "0 9px",
                          border: 0,
                          borderRadius: 6,
                          background:
                            timelineView === id ? c.panel : "transparent",
                          color: timelineView === id ? c.text : c.muted,
                          fontSize: 10,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={exportCalendar}
                    style={{
                      height: 34,
                      padding: "0 11px",
                      borderRadius: 8,
                      border: `1px solid ${c.blueBorder}`,
                      background: c.blueSoft,
                      color: c.blue,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    Google Calendar (.ics)
                  </button>
                  <button
                    type="button"
                    onClick={exportPlanAsJSON}
                    style={{
                      height: 34,
                      padding: "0 11px",
                      borderRadius: 8,
                      border: `1px solid ${c.borderStrong}`,
                      background: c.panel,
                      color: c.secondary,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {copy.exportPlan}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeletePlan(true)}
                    style={{
                      height: 34,
                      padding: "0 11px",
                      borderRadius: 8,
                      border: `1px solid ${c.red}`,
                      background: c.redSoft,
                      color: c.red,
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    {copy.deletePlan}
                  </button>
                </div>
              </header>
              {timelineView === "list" ? (
                <div style={{ display: "grid", gap: 0 }}>
                  {timelineDays.map((date, index) => {
                    const isExam = index === days;
                    const units = unitForDay(index);
                    const tasks = [];
                    if (!isExam) {
                      units.forEach((unit) =>
                        tasks.push({
                          type: "lecture",
                          text: `${unit.title}${
                            unit.part ? ` (${unit.part}/${unit.parts})` : ""
                          }`,
                        })
                      );
                      const count = questionsForDayIndex(index);
                      if (count)
                        tasks.push({
                          type: "questions",
                          text: `${count} ${copy.questionsLabel}`,
                        });
                      (
                        REVIEW_METHODS[reviewMethod]?.intervals || [1, 3, 7]
                      ).forEach((interval) => {
                        if (
                          index >= interval &&
                          unitForDay(index - interval).length
                        )
                          tasks.push({
                            type: "review",
                            text: `${copy.review} \u00b7 ${unitForDay(
                              index - interval
                            )
                              .map((x) => x.title)
                              .join(", ")}`,
                          });
                      });
                    }
                    return (
                      <article
                        key={date.toISOString()}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "125px minmax(0,1fr)",
                          gap: 17,
                          padding: "16px 21px",
                          borderBottom:
                            index === timelineDays.length - 1
                              ? 0
                              : `1px solid ${c.border}`,
                          background:
                            index === 0 ? `${c.blueSoft}55` : "transparent",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: index === 0 ? c.blue : c.text,
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            {isExam
                              ? copy.examDay
                              : index === 0
                              ? copy.today
                              : dateShort(date)}
                          </div>
                          <div
                            style={{
                              marginTop: 4,
                              color: c.muted,
                              fontFamily: '"Space Mono",monospace',
                              fontSize: 10,
                            }}
                          >
                            {date.toLocaleDateString(
                              language === "da" ? "da-DK" : "en-GB",
                              { day: "2-digit", month: "2-digit" }
                            )}
                          </div>
                        </div>
                        <div style={{ display: "grid", gap: 6 }}>
                          {isExam ? (
                            <span
                              style={{
                                color: c.red,
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                            >
                              {copy.examDay}
                            </span>
                          ) : (
                            tasks.map((task, i) => {
                              const [color, bg] = typeStyle(task.type);
                              return (
                                <div
                                  key={i}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "8px 10px",
                                    borderRadius: 8,
                                    background: bg,
                                    color: c.text,
                                    fontSize: 11,
                                    fontWeight: 650,
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: "50%",
                                      background: color,
                                      flexShrink: 0,
                                    }}
                                  />
                                  {task.text}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <AdvancedPlanTimeline
                  c={c}
                  language={language}
                  copy={copy}
                  today={today}
                  exam={exam}
                  timelineDays={timelineDays}
                  mode={mode}
                  questionTotal={questionTotal}
                  questionsForDayIndex={questionsForDayIndex}
                  unitForDay={unitForDay}
                  reviewIntervals={REVIEW_METHODS[reviewMethod]?.intervals}
                />
              )}
            </section>
          </>
        )}
      </div>
      {confirmDeletePlan && (
        <Modal c={c} onClose={() => setConfirmDeletePlan(false)}>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              color: c.text,
              fontSize: 15,
              marginBottom: 10,
            }}
          >
            <Icon name="flag" size={18} />
            {copy.deletePlanConfirmTitle}
          </h2>
          <p
            style={{
              color: c.secondary,
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 18,
            }}
          >
            {copy.deletePlanConfirmText}
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              onClick={() => setConfirmDeletePlan(false)}
              style={{
                height: 40,
                padding: "0 14px",
                border: `1px solid ${c.borderStrong}`,
                borderRadius: 10,
                background: "transparent",
                color: c.text,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copy.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDeletePlan(false);
                deletePlan();
              }}
              style={{
                height: 40,
                padding: "0 14px",
                border: `1px solid ${c.red}`,
                borderRadius: 10,
                background: c.red,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {copy.deletePlan}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function Dashboard({
  c,
  t,
  user,
  onNavigate,
  language,
  spacedData,
  importedQuestions,
  questionOverrides,
}) {
  const [studyPlans, setPlansGlobal] = useStoredState(STORAGE.studyPlans, {});
  const [checklist, setChecklist] = useStoredState(STORAGE.dailyChecklist, {});
  const activePlan = studyPlans[user.module];
  const hour = new Date().getHours();
  const greeting =
    hour < 5
      ? { da: "God nat", en: "Good night", ar: "تصبح على خير" }
      : hour < 12
      ? { da: "Godmorgen", en: "Good morning", ar: "صباح الخير" }
      : hour < 18
      ? { da: "God eftermiddag", en: "Good afternoon", ar: "مساء الخير" }
      : { da: "Godaften", en: "Good evening", ar: "مساء الخير" };
  const copy =
    {
      da: {
        overview: "Dagens overblik",
        review: "Til repetition",
        newQuestions: "Nye MCQ'er",
        total: "MCQ'er i modulet",
        focusText: "Oversigt over den valgte studiesession.",
        start: "Start MCQ-session",
        plan: "Studieplan",
        planText: "Planlagte blokke vises her.",
        emptyPlan: "Ingen studieblokke planlagt i dag",
        planHint: "Se hele planen i kalenderen.",
        quickAccess: "Funktioner",
        repetition: "Repetition",
        notes: "Notesbog",
        insights: "Indsigter",
        mcq: "Alle MCQ'er",
        coming: "Kommer snart",
      },
      en: {
        overview: "Today's overview",
        review: "To review",
        newQuestions: "New MCQs",
        total: "MCQs in module",
        focusText: "Overview of the selected study session.",
        start: "Start MCQ session",
        plan: "Study plan",
        planText: "Scheduled blocks will appear here.",
        emptyPlan: "No study blocks scheduled today",
        planHint: "See the full plan in the calendar.",
        quickAccess: "Functions",
        repetition: "Revision",
        notes: "Notebook",
        insights: "Insights",
        mcq: "All MCQs",
        coming: "Coming soon",
      },
      ar: {
        overview: "نظرة عامة اليوم",
        review: "للمراجعة",
        newQuestions: "أسئلة جديدة",
        total: "أسئلة في الوحدة",
        focusText: "نظرة عامة على جلسة الدراسة المحددة.",
        start: "ابدأ جلسة الأسئلة",
        plan: "خطة الدراسة",
        planText: "ستظهر الكتل المخططة هنا.",
        emptyPlan: "لا توجد جلسات دراسية مخططة اليوم",
        planHint: "شاهد الخطة الكاملة في التقويم.",
        quickAccess: "الوظائف",
        repetition: "مراجعة",
        notes: "دفتر الملاحظات",
        insights: "الإحصاءات",
        mcq: "جميع الأسئلة",
        coming: "قريبًا",
      },
    }[language] || null;
  const x = copy || {
    overview: "Dagens overblik",
    review: "Til repetition",
    newQuestions: "Nye MCQ'er",
    total: "MCQ'er i modulet",
    focusText: "",
    start: "Start MCQ-session",
    plan: "Studieplan",
    planText: "",
    emptyPlan: "Ingen studieblokke planlagt i dag",
    planHint: "",
    quickAccess: "Funktioner",
    repetition: "Repetition",
    notes: "Notesbog",
    insights: "Indsigter",
    mcq: "Alle MCQ'er",
    coming: "Kommer snart",
  };
  const [history] = useStoredState(STORAGE.quizHistory, []);
  const [calendarEvents, setCalendarEvents] = useStoredState(
    STORAGE.calendarEvents,
    []
  );
  const [editingPlanEvent, setEditingPlanEvent] = useState(null);
  const currentModule = user?.module || "";
  const todayDate = new Date();
  const todayIso = dateKey(
    todayDate.getFullYear(),
    todayDate.getMonth(),
    todayDate.getDate()
  );
  const todaysEvents = calendarEvents
    .filter((event) => event.date === todayIso)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const allQuestionsForDash = getFullQuestionBank(
    importedQuestions,
    questionOverrides
  );
  const moduleQuestions = allQuestionsForDash.filter(
    (q) => q.moduleId === currentModule
  );
  const questionCount =
    moduleQuestions.length > 0
      ? moduleQuestions.length
      : allQuestionsForDash.length;
  const scopedQuestions =
    moduleQuestions.length > 0 ? moduleQuestions : allQuestionsForDash;
  const safeSpacedData = spacedData || {};
  const reviewCount = scopedQuestions.filter(
    (q) => safeSpacedData[q.id] && isDue(safeSpacedData[q.id])
  ).length;
  const newCount = scopedQuestions.filter((q) => !safeSpacedData[q.id]).length;
  const actionsById = {
    mcq: ["mcq", "clipboard", x.mcq, c.blue, true],
    repeat: ["repeat", "cards", x.repetition, c.blue, false],
    insights: ["insights", "chart", x.insights, c.green, true],
  };
  const defaultActionOrder = ["mcq", "repeat", "insights"];
  const [quickAccessOrder, setQuickAccessOrder] = useStoredState(
    STORAGE.quickAccessOrder,
    defaultActionOrder
  );
  const [reorderingActions, setReorderingActions] = useState(false);
  const actionDragIdRef = useRef(null);
  const [actionDragOverId, setActionDragOverId] = useState(null);
  const safeActionOrder = quickAccessOrder.filter((id) => actionsById[id]);
  const orderedActionIds =
    safeActionOrder.length === defaultActionOrder.length
      ? safeActionOrder
      : [
          ...safeActionOrder,
          ...defaultActionOrder.filter((id) => !safeActionOrder.includes(id)),
        ];
  const actions = orderedActionIds.map((id) => actionsById[id]);

  function moveActionTo(fromId, toId) {
    if (!fromId || fromId === toId) return;
    setQuickAccessOrder((previous) => {
      const base = previous.filter((id) => actionsById[id]);
      const list =
        base.length === defaultActionOrder.length
          ? [...base]
          : [...base, ...defaultActionOrder.filter((id) => !base.includes(id))];
      const from = list.indexOf(fromId);
      const to = list.indexOf(toId);
      if (from === -1 || to === -1) return previous;
      list.splice(from, 1);
      list.splice(to, 0, fromId);
      return list;
    });
  }

  const [streakData] = useStoredState(STORAGE.streak, { days: [] });
  const [pomodoroLog] = useStoredState(STORAGE.pomodoroLog, {});
  const streak = computeStreak(streakData.days || []);
  const totalPomodoros = Object.values(pomodoroLog).reduce(
    (sum, value) => sum + value,
    0
  );
  const todayPomodoros = pomodoroLog[todayIso] || 0;

  const totalQuestionsAnswered = history.reduce(
    (sum, session) => sum + (session.answered || 0),
    0
  );
  const bestSessionAccuracy = history.reduce(
    (best, session) => Math.max(best, session.score || 0),
    0
  );
  const earnedBadges = computeEarnedBadges({
    streakCurrent: streak.current,
    totalQuestionsAnswered,
    totalPomodoros,
    bestSessionAccuracy,
  });

  const resumeRaw = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE.resumeSession) || "null");
    } catch {
      return null;
    }
  })();
  const hasResumableSession = Boolean(
    resumeRaw && Object.keys(resumeRaw.answers || {}).length > 0
  );

  const dashCopy =
    {
      da: {
        streak: "Studiestreak",
        days: "dage",
        pomodoros: "Pomodoros i dag",
        badges: "Badges",
        noBadges: "Optjen dit første badge",
        resume: "Genoptag session",
        resumeText: "Du har en igangværende session",
      },
      en: {
        streak: "Study streak",
        days: "days",
        pomodoros: "Pomodoros today",
        badges: "Badges",
        noBadges: "Earn your first badge",
        resume: "Resume session",
        resumeText: "You have a session in progress",
      },
      ar: {
        streak: "سلسلة الدراسة",
        days: "أيام",
        pomodoros: "بومودورو اليوم",
        badges: "الشارات",
        noBadges: "اكسب شارتك الأولى",
        resume: "استئناف الجلسة",
        resumeText: "لديك جلسة قيد التقدم",
      },
    }[language] || {};

  const studyPlanDashCopy =
    {
      da: {
        progressTitle: "Studieplan-fremdrift",
        lectureProgress: "Forelæsninger",
        examSetProgress: "Eksamenssæt",
        catchUpTitle: "Du er bagud med planen",
        catchUpText:
          "Din faktiske fremgang halter efter tidsplanen. Vil du omfordele det resterende indhold over de dage, der er tilbage?",
        catchUpButton: "Indhent nu",
        checklistTitle: "Dagens opgaver",
        checklistEmpty: "Intet planlagt for i dag",
        readMoreToday: "Vil du læse mere i dag? Tilføj næste forelæsning",
      },
      en: {
        progressTitle: "Study plan progress",
        lectureProgress: "Lectures",
        examSetProgress: "Exam set",
        catchUpTitle: "You're behind on your plan",
        catchUpText:
          "Your actual progress is lagging behind schedule. Redistribute the remaining content over the days left?",
        catchUpButton: "Catch up now",
        checklistTitle: "Today's tasks",
        checklistEmpty: "Nothing planned for today",
        readMoreToday: "Want to read more today? Add next lecture",
      },
      ar: {
        progressTitle: "تقدم خطة الدراسة",
        lectureProgress: "المحاضرات",
        examSetProgress: "مجموعة الامتحان",
        catchUpTitle: "أنت متأخر عن خطتك",
        catchUpText:
          "تقدمك الفعلي متأخر عن الجدول الزمني. هل تريد إعادة توزيع المحتوى المتبقي على الأيام المتبقية؟",
        catchUpButton: "إلحق الآن",
        checklistTitle: "مهام اليوم",
        checklistEmpty: "لا يوجد شيء مخطط لليوم",
        readMoreToday: "هل تريد المزيد اليوم؟ أضف المحاضرة التالية",
      },
    }[language] || {};

  return (
    <div
      className="fade-up"
      style={{
        width: "min(880px, 100%)",
        margin: "0 auto",
        display: "grid",
        gap: 16,
      }}
    >
      <section style={{ padding: "14px 0 7px" }}>
        <div
          style={{
            color: c.secondary,
            fontSize: 14,
            fontWeight: 650,
            marginBottom: 8,
          }}
        >
          {greeting[language] || greeting.da}
        </div>
        <h1
          style={{
            margin: 0,
            color: c.text,
            fontSize: "clamp(32px, 4vw, 45px)",
            letterSpacing: "-.045em",
            lineHeight: 1.06,
            fontWeight: 800,
          }}
        >
          {user.name}
        </h1>
        <div
          style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}
        >
          {[
            [reviewCount, x.review, c.blue, c.blueSoft],
            [newCount, x.newQuestions, c.green, c.greenSoft],
            [questionCount, x.total, c.text, c.soft],
          ].map(([value, label, color, background]) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 12px",
                borderRadius: 99,
                background,
                border: `1px solid ${color}22`,
              }}
            >
              <span style={{ color, fontSize: 14, fontWeight: 800 }}>
                {value}
              </span>
              <span
                style={{ color: c.secondary, fontSize: 11, fontWeight: 700 }}
              >
                {label}
              </span>
            </span>
          ))}

          {streak.current > 0 &&
            (() => {
              const tiers = [1, 5, 10, 50, 100];
              const tierIndex = tiers.reduce(
                (acc, threshold, i) => (streak.current >= threshold ? i : acc),
                0
              );
              const pillHeight = 30;
              const glowStrength = 0.25 + tierIndex * 0.18;
              const flameColor = "#ff8a00";
              return (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    height: pillHeight,
                  }}
                >
                  <span
                    className={
                      tierIndex >= 2
                        ? "flame-icon flame-icon-strong"
                        : "flame-icon"
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: pillHeight,
                      height: pillHeight,
                      color: flameColor,
                      filter: `drop-shadow(0 0 ${
                        4 + tierIndex * 3
                      }px rgba(255,138,0,${glowStrength}))`,
                    }}
                  >
                    <Icon name="flame" size={pillHeight} />
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "baseline",
                      gap: 5,
                    }}
                  >
                    <span
                      style={{
                        color: flameColor,
                        fontSize: 14,
                        fontWeight: 800,
                      }}
                    >
                      {streak.current}
                    </span>
                    <span
                      style={{
                        color: flameColor,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {dashCopy.streak}
                    </span>
                  </span>
                </span>
              );
            })()}
        </div>
      </section>

      {hasResumableSession && (
        <section>
          <button
            type="button"
            onClick={() => onNavigate("mcq")}
            style={{
              width: "100%",
              textAlign: "start",
              cursor: "pointer",
              padding: "16px 20px",
              borderRadius: 18,
              background: c.blueSoft,
              border: `1px solid ${c.blueBorder}`,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <span
              style={{
                width: 38,
                height: 38,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 12,
                background: c.panel,
                color: c.blue,
              }}
            >
              <Icon name="right" size={17} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ color: c.blue, fontSize: 13, fontWeight: 800 }}>
                {dashCopy.resume}
              </div>
              <div style={{ marginTop: 2, color: c.secondary, fontSize: 11 }}>
                {dashCopy.resumeText}
              </div>
            </div>
          </button>
        </section>
      )}

      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            gap: 10,
          }}
        >
          <h2
            style={{ margin: 0, color: c.text, fontSize: 15, fontWeight: 800 }}
          >
            {x.quickAccess}
          </h2>
          <button
            type="button"
            title={reorderingActions ? t.doneReorder : t.editOrder}
            onClick={() => setReorderingActions((value) => !value)}
            style={{
              width: 30,
              height: 30,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              borderRadius: 9,
              border: `1px solid ${
                reorderingActions ? c.blueBorder : c.border
              }`,
              background: reorderingActions ? c.blueSoft : "transparent",
              color: reorderingActions ? c.blue : c.muted,
              cursor: "pointer",
            }}
          >
            <Icon name="edit" size={14} />
          </button>
        </div>
        {reorderingActions && (
          <div
            style={{
              marginBottom: 10,
              color: c.muted,
              fontSize: 11,
              fontWeight: 650,
            }}
          >
            {t.reorderHint}
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          {actions.map(([id, icon, title, color, enabled], index) => {
            const isDragOver = reorderingActions && actionDragOverId === id;
            return (
              <div
                key={id}
                draggable={reorderingActions}
                onDragStart={(event) => {
                  actionDragIdRef.current = id;
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  if (actionDragOverId !== id) setActionDragOverId(id);
                }}
                onDragLeave={() => {
                  if (actionDragOverId === id) setActionDragOverId(null);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  moveActionTo(actionDragIdRef.current, id);
                  actionDragIdRef.current = null;
                  setActionDragOverId(null);
                }}
                onDragEnd={() => {
                  actionDragIdRef.current = null;
                  setActionDragOverId(null);
                }}
                className={reorderingActions ? "nav-wiggle" : ""}
                style={{
                  "--wiggle-delay": index,
                  borderRadius: 20,
                  outline: isDragOver ? `2px dashed ${c.blue}` : "none",
                  outlineOffset: 3,
                }}
              >
                <button
                  type="button"
                  data-tour={
                    id === "mcq"
                      ? "mcq-card"
                      : id === "insights"
                      ? "insights-card"
                      : undefined
                  }
                  disabled={!enabled || reorderingActions}
                  onClick={() =>
                    enabled && !reorderingActions && onNavigate(id)
                  }
                  style={{
                    width: "100%",
                    textAlign: "start",
                    cursor: reorderingActions
                      ? "grab"
                      : enabled
                      ? "pointer"
                      : "not-allowed",
                    opacity: enabled ? 1 : 0.5,
                    padding: 18,
                    borderRadius: 20,
                    background: c.panel,
                    border: `1px solid ${c.border}`,
                    boxShadow: c.shadow,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 12,
                      background: `${color}18`,
                      color,
                    }}
                  >
                    <Icon name={icon} size={17} />
                  </span>
                  <div style={{ color: c.text, fontSize: 13, fontWeight: 800 }}>
                    {title}
                  </div>
                  {!enabled && !reorderingActions && (
                    <span
                      style={{
                        position: "absolute",
                        top: 14,
                        insetInlineEnd: 14,
                        color: c.muted,
                        fontSize: 9,
                        fontWeight: 800,
                        textTransform: "uppercase",
                      }}
                    >
                      {x.coming}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => onNavigate("study-plan")}
          style={{
            width: "100%",
            textAlign: "start",
            cursor: "pointer",
            padding: 0,
            border: 0,
            background: "transparent",
          }}
        >
          <div
            style={{
              padding: "22px clamp(20px, 3vw, 28px)",
              borderRadius: 24,
              background: c.panel,
              border: `1px solid ${c.border}`,
              boxShadow: c.shadow,
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                width: 52,
                height: 52,
                flexShrink: 0,
                display: "grid",
                placeItems: "center",
                borderRadius: 16,
                background: c.blueGradient,
                color: "#fff",
                boxShadow: `0 10px 22px ${c.blue}33`,
              }}
            >
              <Icon name="clock" size={22} />
            </span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ color: c.text, fontSize: 15, fontWeight: 800 }}>
                {x.plan}
              </div>
              <div style={{ marginTop: 4, color: c.secondary, fontSize: 12 }}>
                {activePlan
                  ? `${
                      activePlan.mode === "lectures"
                        ? "Studieplan"
                        : "Eksamenssæt"
                    } \u00b7 ${activePlan.hoursPerDay || 2} t/dag \u00b7 ${
                      activePlan.examDate || ""
                    }`
                  : x.focusText}
              </div>
            </div>
            {activePlan && activePlan.examDate && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderRadius: 14,
                  background: c.blueSoft,
                  border: `1px solid ${c.blueBorder}`,
                }}
              >
                <span
                  style={{
                    color: c.blue,
                    fontSize: 20,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(`${activePlan.examDate}T00:00:00`) -
                        new Date()) /
                        86400000
                    )
                  )}
                </span>
                <span
                  style={{
                    color: c.blue,
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                  }}
                >
                  dage
                </span>
              </div>
            )}
            <span style={{ color: c.muted, flexShrink: 0 }}>
              <Icon name="right" size={18} />
            </span>
          </div>
        </button>
      </section>

      <section>
        <div
          style={{
            padding: "26px clamp(22px, 3vw, 32px)",
            borderRadius: 26,
            background: c.panel,
            border: `1px solid ${c.border}`,
            boxShadow: c.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 14,
                background: c.blueGradient,
                color: "#fff",
                boxShadow: `0 10px 22px ${c.blue}33`,
              }}
            >
              <Icon name="calendar" size={20} />
            </span>
            <div>
              <div style={{ color: c.text, fontSize: 18, fontWeight: 800 }}>
                {x.todaysPlanExpandedTitle}
              </div>
              <div style={{ marginTop: 2, color: c.muted, fontSize: 12 }}>
                {x.planText}
              </div>
            </div>
          </div>

          {todaysEvents.length === 0 ? (
            <div
              style={{
                display: "grid",
                placeItems: "center",
                minHeight: 140,
                padding: 20,
                borderRadius: 18,
                border: `1px dashed ${c.borderStrong}`,
                background: c.soft,
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{ color: c.secondary, fontSize: 13, fontWeight: 750 }}
                >
                  {x.emptyPlan}
                </div>
                <div style={{ marginTop: 6, color: c.muted, fontSize: 12 }}>
                  {x.planHint}
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 10,
                maxHeight: 360,
                overflowY: "auto",
                paddingRight: 2,
              }}
            >
              {todaysEvents.map((event) => {
                const palette =
                  event.type === "exam"
                    ? [c.red, c.redSoft]
                    : event.type === "review"
                    ? [c.green, c.greenSoft]
                    : event.type === "study"
                    ? [c.blue, c.blueSoft]
                    : [c.secondary, c.soft];
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setEditingPlanEvent(event)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: palette[1],
                      border: `1px solid ${c.border}`,
                      cursor: "pointer",
                      textAlign: "start",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 99,
                        background: palette[0],
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13.5,
                        fontWeight: 650,
                        color: c.text,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {event.title}
                    </span>
                    {event.time && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 750,
                          color: palette[0],
                          flexShrink: 0,
                        }}
                      >
                        {event.time}
                      </span>
                    )}
                    <Icon name="right" size={14} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {editingPlanEvent && (
        <Modal c={c} onClose={() => setEditingPlanEvent(null)}>
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
              {t.calendarEditEvent}
            </div>
            <IconButton
              c={c}
              title={t.close}
              onClick={() => setEditingPlanEvent(null)}
            >
              <Icon name="close" size={17} />
            </IconButton>
          </header>
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.secondary,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t.calendarEventTitle}
              </label>
              <input
                value={editingPlanEvent.title}
                onChange={(event) =>
                  setEditingPlanEvent((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 10px",
                  borderRadius: 10,
                  border: `1px solid ${c.border}`,
                  background: c.soft,
                  color: c.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c.secondary,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {t.calendarEventDate}
                </label>
                <input
                  type="date"
                  value={editingPlanEvent.date}
                  onChange={(event) =>
                    setEditingPlanEvent((prev) => ({
                      ...prev,
                      date: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 10px",
                    borderRadius: 10,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 13,
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: c.secondary,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {t.calendarEventTime}
                </label>
                <input
                  type="time"
                  value={editingPlanEvent.time}
                  onChange={(event) =>
                    setEditingPlanEvent((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 10px",
                    borderRadius: 10,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
            <div>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: c.secondary,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t.calendarEventType}
              </label>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  ["exam", t.calendarTypeExam],
                  ["study", t.calendarTypeStudy],
                  ["review", t.calendarTypeReview],
                  ["other", t.calendarTypeOther],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setEditingPlanEvent((prev) => ({ ...prev, type: value }))
                    }
                    style={{
                      flex: 1,
                      height: 36,
                      borderRadius: 9,
                      border: `1px solid ${
                        editingPlanEvent.type === value
                          ? c.blueBorder
                          : c.border
                      }`,
                      background:
                        editingPlanEvent.type === value ? c.blueSoft : c.soft,
                      color:
                        editingPlanEvent.type === value ? c.blue : c.secondary,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 6,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setCalendarEvents((previous) =>
                    previous.filter((item) => item.id !== editingPlanEvent.id)
                  );
                  setEditingPlanEvent(null);
                }}
                style={{
                  height: 40,
                  padding: "0 14px",
                  border: `1px solid ${c.red}`,
                  borderRadius: 10,
                  background: c.redSoft,
                  color: c.red,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {t.calendarDelete}
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setEditingPlanEvent(null)}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    border: `1px solid ${c.borderStrong}`,
                    borderRadius: 10,
                    background: "transparent",
                    color: c.text,
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t.calendarCancel}
                </button>
                <PrimaryButton
                  onClick={() => {
                    if (
                      !editingPlanEvent.title.trim() ||
                      !editingPlanEvent.date
                    )
                      return;
                    setCalendarEvents((previous) =>
                      previous.map((item) =>
                        item.id === editingPlanEvent.id
                          ? editingPlanEvent
                          : item
                      )
                    );
                    setEditingPlanEvent(null);
                  }}
                >
                  {t.calendarSave}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activePlan &&
        (() => {
          const planLectures = MODULE_LECTURES[currentModule] || [];
          const planExamQuestions = scopedQuestions.filter((q) => !q.lectureId);
          const doneCount = (activePlan.doneLectureIds || []).length;
          const totalLectureCount = planLectures.length;
          const examSetDoneCount = planExamQuestions.filter(
            (q) => safeSpacedData[q.id]
          ).length;
          const examSetTotalCount = planExamQuestions.length;
          const planToday = new Date();
          planToday.setHours(0, 0, 0, 0);
          const planExam = activePlan.examDate
            ? new Date(`${activePlan.examDate}T00:00:00`)
            : null;
          const daysLeft = planExam
            ? Math.max(0, Math.ceil((planExam - planToday) / 86400000))
            : 0;
          const daysSinceCreated = activePlan.createdAt
            ? Math.max(
                1,
                Math.ceil(
                  (planToday - new Date(activePlan.createdAt)) / 86400000
                )
              )
            : 1;
          const totalPlanDays =
            planExam && activePlan.createdAt
              ? Math.max(
                  1,
                  Math.ceil(
                    (planExam - new Date(activePlan.createdAt)) / 86400000
                  )
                )
              : 1;
          const expectedProgressFraction = Math.min(
            1,
            daysSinceCreated / totalPlanDays
          );
          const actualProgressFraction =
            totalLectureCount > 0 ? doneCount / totalLectureCount : 1;
          const isBehind =
            activePlan.mode === "lectures" &&
            totalLectureCount > 0 &&
            actualProgressFraction < expectedProgressFraction - 0.08 &&
            daysLeft > 0;
          const todayKey = dateKey(
            planToday.getFullYear(),
            planToday.getMonth(),
            planToday.getDate()
          );
          const todayIsExcluded = (activePlan.excludedDates || []).includes(
            todayKey
          );
          const todayChecklist = checklist[todayKey] || {};

          function computeTodayLectureUnits() {
            if (activePlan.mode !== "lectures" || todayIsExcluded) return [];
            const doneIds = activePlan.doneLectureIds || [];
            const pending = planLectures.filter((l) => !doneIds.includes(l.id));
            const units = pending.flatMap((item) =>
              Array.from({ length: item.parts || 1 }, (_, i) => ({
                ...item,
                part: (item.parts || 1) > 1 ? i + 1 : null,
              }))
            );
            const exam = activePlan.examDate
              ? new Date(`${activePlan.examDate}T00:00:00`)
              : null;
            const daysUntilExam = exam
              ? Math.max(0, Math.ceil((exam - planToday) / 86400000))
              : 0;
            const activeDays = Math.max(1, daysUntilExam);
            const excludedDates = activePlan.excludedDates || [];
            let excludedCount = 0;
            for (let i = 0; i < activeDays; i++) {
              const d = new Date(planToday);
              d.setDate(d.getDate() + i);
              const key = dateKey(d.getFullYear(), d.getMonth(), d.getDate());
              if (excludedDates.includes(key)) excludedCount++;
            }
            const availableDaysCount = Math.max(1, activeDays - excludedCount);
            const lecturesPerDay = Math.max(
              1,
              Math.ceil(units.length / availableDaysCount)
            );
            return units.slice(0, lecturesPerDay);
          }

          function unitKey(u) {
            return u.part ? `${u.id}-${u.part}` : u.id;
          }
          function unitLabel(u) {
            return u.part
              ? `${u.id} (${u.part}): ${u.title}`
              : `${u.id}: ${u.title}`;
          }

          const liveTodayUnits = computeTodayLectureUnits();
          const baseChecklistItems = liveTodayUnits.map((u) => ({
            id: unitKey(u),
            label: unitLabel(u),
          }));
          const extraTodayItems = checklist[`${todayKey}__extra`] || [];
          const checklistItems = [...baseChecklistItems, ...extraTodayItems];

          const toggleChecklistItem = (id) => {
            setChecklist((old) => {
              const dayState = { ...(old[todayKey] || {}) };
              dayState[id] = !dayState[id];
              return { ...old, [todayKey]: dayState };
            });
          };

          const allDoneToday =
            checklistItems.length > 0 &&
            checklistItems.every((item) => Boolean(todayChecklist[item.id]));

          const usedLectureIds = new Set([
            ...(activePlan.doneLectureIds || []),
            ...baseChecklistItems.map((i) => i.id.split("-")[0]),
            ...extraTodayItems.map(
              (i) => String(i.id).replace("extra-", "").split("-")[0]
            ),
          ]);
          const nextExtraLecture = planLectures.find(
            (l) => !usedLectureIds.has(l.id)
          );

          const addExtraToday = () => {
            if (!nextExtraLecture) return;
            setChecklist((old) => ({
              ...old,
              [`${todayKey}__extra`]: [
                ...(old[`${todayKey}__extra`] || []),
                {
                  id: `extra-${nextExtraLecture.id}`,
                  label: `${nextExtraLecture.id}: ${nextExtraLecture.title}`,
                },
              ],
            }));
          };

          const handleCatchUp = () => {
            setPlansGlobal((old) => {
              const plan = old[currentModule];
              if (!plan) return old;
              return {
                ...old,
                [currentModule]: { ...plan, createdAt: Date.now() },
              };
            });
          };
          return (
            <>
              <section>
                <div
                  style={{
                    padding: "22px clamp(20px, 3vw, 28px)",
                    borderRadius: 24,
                    background: c.panel,
                    border: `1px solid ${c.border}`,
                    boxShadow: c.shadow,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 12,
                        background: c.soft,
                        color: c.secondary,
                      }}
                    >
                      <Icon name="chart" size={17} />
                    </span>
                    <div
                      style={{ color: c.text, fontSize: 15, fontWeight: 800 }}
                    >
                      {studyPlanDashCopy.progressTitle}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                      gap: 12,
                    }}
                  >
                    {[
                      [
                        studyPlanDashCopy.lectureProgress,
                        doneCount,
                        totalLectureCount,
                        c.blue,
                        c.blueSoft,
                      ],
                      [
                        studyPlanDashCopy.examSetProgress,
                        examSetDoneCount,
                        examSetTotalCount,
                        c.blue,
                        c.blueSoft,
                      ],
                    ].map(([label, done2, total2, color, bg]) => {
                      const pct =
                        total2 > 0 ? Math.round((done2 / total2) * 100) : 0;
                      return (
                        <div
                          key={label}
                          style={{
                            padding: "14px 16px",
                            borderRadius: 14,
                            background: c.soft,
                            border: `1px solid ${c.border}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 750,
                                color: c.secondary,
                              }}
                            >
                              {label}
                            </span>
                            <span
                              style={{ fontSize: 11, fontWeight: 800, color }}
                            >
                              {done2}/{total2}
                            </span>
                          </div>
                          <div
                            style={{
                              height: 8,
                              borderRadius: 99,
                              background: c.border,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                background: color,
                                borderRadius: 99,
                                transition: "width .3s",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {isBehind && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: "14px 16px",
                        borderRadius: 14,
                        background: c.redSoft,
                        border: `1px solid ${c.redBorder}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: c.red,
                          marginBottom: 4,
                        }}
                      >
                        {studyPlanDashCopy.catchUpTitle}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: c.secondary,
                          lineHeight: 1.55,
                          marginBottom: 10,
                        }}
                      >
                        {studyPlanDashCopy.catchUpText}
                      </div>
                      <button
                        type="button"
                        onClick={handleCatchUp}
                        style={{
                          height: 36,
                          padding: "0 14px",
                          borderRadius: 9,
                          border: "none",
                          background: c.red,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 800,
                          cursor: "pointer",
                        }}
                      >
                        {studyPlanDashCopy.catchUpButton}
                      </button>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <div
                  style={{
                    padding: "22px clamp(20px, 3vw, 28px)",
                    borderRadius: 24,
                    background: c.panel,
                    border: `1px solid ${c.border}`,
                    boxShadow: c.shadow,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        width: 36,
                        height: 36,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 12,
                        background: c.soft,
                        color: c.secondary,
                      }}
                    >
                      <Icon name="check" size={17} />
                    </span>
                    <div
                      style={{ color: c.text, fontSize: 15, fontWeight: 800 }}
                    >
                      {studyPlanDashCopy.checklistTitle}
                    </div>
                  </div>
                  {checklistItems.length === 0 ? (
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 14,
                        border: `1px dashed ${c.borderStrong}`,
                        background: c.soft,
                        textAlign: "center",
                        color: c.secondary,
                        fontSize: 12,
                        fontWeight: 650,
                      }}
                    >
                      {studyPlanDashCopy.checklistEmpty}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: 8 }}>
                      {checklistItems.map((item) => {
                        const isDone = Boolean(todayChecklist[item.id]);
                        return (
                          <label
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              padding: "10px 12px",
                              borderRadius: 12,
                              background: isDone ? c.soft : c.panel,
                              border: `1px solid ${
                                isDone ? c.border : c.borderStrong
                              }`,
                              cursor: "pointer",
                              opacity: isDone ? 0.55 : 1,
                              transition:
                                "opacity 200ms ease, background 200ms ease",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => toggleChecklistItem(item.id)}
                              style={{ accentColor: c.muted }}
                            />
                            <span
                              style={{
                                flex: 1,
                                fontSize: 12,
                                fontWeight: 650,
                                color: isDone ? c.muted : c.text,
                                textDecoration: isDone
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {item.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {allDoneToday && nextExtraLecture && (
                    <button
                      type="button"
                      onClick={addExtraToday}
                      style={{
                        marginTop: 12,
                        width: "100%",
                        height: 42,
                        borderRadius: 12,
                        border: `1px dashed ${c.blueBorder}`,
                        background: c.blueSoft,
                        color: c.blue,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {studyPlanDashCopy.readMoreToday}
                    </button>
                  )}
                </div>
              </section>
            </>
          );
        })()}

      <section>
        <div
          style={{
            padding: "22px clamp(20px, 3vw, 28px)",
            borderRadius: 24,
            background: c.panel,
            border: `1px solid ${c.border}`,
            boxShadow: c.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span
                style={{
                  width: 36,
                  height: 36,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 12,
                  background: c.soft,
                  color: c.secondary,
                }}
              >
                <Icon name="star" size={17} />
              </span>
              <div style={{ color: c.text, fontSize: 15, fontWeight: 800 }}>
                {dashCopy.badges}
              </div>
            </div>
            <span style={{ color: c.muted, fontSize: 11, fontWeight: 700 }}>
              {earnedBadges.length}/{BADGE_DEFINITIONS.length}
            </span>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {BADGE_DEFINITIONS.map((badge) => {
              const earned = earnedBadges.some((b) => b.id === badge.id);
              return (
                <span
                  key={badge.id}
                  title={badge.label[language] || badge.label.da}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 13px",
                    borderRadius: 99,
                    background: earned ? c.greenSoft : c.soft,
                    border: `1px solid ${earned ? c.greenBorder : c.border}`,
                    opacity: earned ? 1 : 0.55,
                  }}
                >
                  <Icon name={badge.icon} size={14} />
                  <span
                    style={{
                      color: earned ? c.green : c.muted,
                      fontSize: 11,
                      fontWeight: 750,
                    }}
                  >
                    {badge.label[language] || badge.label.da}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

const ADMIN_PASSCODE_HASH = 384710755;

function simpleHash(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) % 1000000007;
  }
  return hash;
}

function QuestionEditor({
  c,
  t,
  language,
  question,
  moduleId,
  lectureId,
  onSave,
  onCancel,
}) {
  const [questionText, setQuestionText] = useState(
    question ? translate(question.question, language) : ""
  );
  const [category, setCategory] = useState(
    question ? translate(question.category, language) : ""
  );
  const [options, setOptions] = useState(
    question ? question.options.map((o) => translate(o, language)) : ["", ""]
  );
  const [correct, setCorrect] = useState(question ? question.correct : 0);
  const [explanation, setExplanation] = useState(
    question ? translate(question.explanation, language) : ""
  );

  function updateOption(index, value) {
    setOptions((previous) => previous.map((o, i) => (i === index ? value : o)));
  }

  function addOption() {
    setOptions((previous) => [...previous, ""]);
  }

  function removeOption(index) {
    setOptions((previous) => previous.filter((_, i) => i !== index));
    if (correct >= options.length - 1) setCorrect(0);
  }

  function save() {
    const id = question
      ? question.id
      : `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const baseQuestion = question || {
      id,
      moduleId,
      lectureId,
      category: { da: "", en: "", ar: "" },
      question: { da: "", en: "", ar: "" },
      options: options.map(() => ({ da: "", en: "", ar: "" })),
      correct: 0,
      explanation: { da: "", en: "", ar: "" },
    };

    const updated = {
      ...baseQuestion,
      id,
      moduleId,
      lectureId,
      category: updateLocalizedField(baseQuestion.category, language, category),
      question: updateLocalizedField(
        baseQuestion.question,
        language,
        questionText
      ),
      options: options.map((value, i) =>
        updateLocalizedField(baseQuestion.options[i], language, value)
      ),
      correct,
      explanation: updateLocalizedField(
        baseQuestion.explanation,
        language,
        explanation
      ),
    };

    onSave(updated);
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.secondary,
            display: "block",
            marginBottom: 4,
          }}
        >
          {t.categoryFieldLabel}
        </label>
        <input
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          style={{
            width: "100%",
            height: 38,
            padding: "0 10px",
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 13,
          }}
        />
      </div>

      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.secondary,
            display: "block",
            marginBottom: 4,
          }}
        >
          {t.questionFieldLabel}
        </label>
        <textarea
          value={questionText}
          onChange={(event) => setQuestionText(event.target.value)}
          style={{
            width: "100%",
            minHeight: 70,
            padding: 10,
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 13,
            resize: "vertical",
          }}
        />
      </div>

      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.secondary,
            display: "block",
            marginBottom: 4,
          }}
        >
          {t.optionsFieldLabel}
        </label>
        <div style={{ display: "grid", gap: 7 }}>
          {options.map((option, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 7, alignItems: "center" }}
            >
              <input
                type="radio"
                name="correct-option"
                checked={correct === i}
                onChange={() => setCorrect(i)}
                title={t.correctFieldLabel}
              />
              <input
                value={option}
                onChange={(event) => updateOption(i, event.target.value)}
                style={{
                  flex: 1,
                  height: 36,
                  padding: "0 10px",
                  borderRadius: 9,
                  border: `1px solid ${
                    correct === i ? c.blueBorder : c.border
                  }`,
                  background: correct === i ? c.blueSoft : c.soft,
                  color: c.text,
                  fontSize: 13,
                }}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  style={{
                    border: 0,
                    background: "transparent",
                    color: c.red,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {t.removeOption}
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addOption}
          style={{
            marginTop: 8,
            border: `1px dashed ${c.borderStrong}`,
            borderRadius: 9,
            background: "transparent",
            color: c.secondary,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            padding: "7px 10px",
          }}
        >
          + {t.addOption}
        </button>
      </div>

      <div>
        <label
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: c.secondary,
            display: "block",
            marginBottom: 4,
          }}
        >
          {t.explanationFieldLabel}
        </label>
        <textarea
          value={explanation}
          onChange={(event) => setExplanation(event.target.value)}
          style={{
            width: "100%",
            minHeight: 60,
            padding: 10,
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 13,
            resize: "vertical",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
          marginTop: 4,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            height: 40,
            padding: "0 14px",
            border: `1px solid ${c.borderStrong}`,
            borderRadius: 10,
            background: "transparent",
            color: c.text,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {t.cancelEdit}
        </button>
        <PrimaryButton onClick={save}>{t.saveQuestion}</PrimaryButton>
      </div>
    </div>
  );
}

function LectureMenuModal({
  c,
  t,
  language,
  lecture,
  moduleId,
  spacedData,
  setSpacedData,
  importedQuestions,
  setImportedQuestions,
  questionOverrides,
  setQuestionOverrides,
  buriedCards,
  setBuriedCards,
  onClose,
}) {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [creating, setCreating] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [unlocked, setUnlocked] = useStoredState(STORAGE.adminUnlocked, false);
  const [gateOpen, setGateOpen] = useState(false);
  const [gatePasscode, setGatePasscode] = useState("");
  const [gateError, setGateError] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  function withAdmin(action) {
    return () => {
      if (unlocked) {
        action();
      } else {
        setPendingAction(() => action);
        setGatePasscode("");
        setGateError(false);
        setGateOpen(true);
      }
    };
  }

  function unlockGate() {
    if (simpleHash(gatePasscode.trim()) === ADMIN_PASSCODE_HASH) {
      setUnlocked(true);
      setGateOpen(false);
      setGateError(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } else {
      setGateError(true);
    }
  }

  const allQuestions = getFullQuestionBank(
    importedQuestions,
    questionOverrides
  );
  const lectureQuestions = lecture.id
    ? allQuestions.filter(
        (q) => q.moduleId === moduleId && q.lectureId === lecture.id
      )
    : allQuestions.filter((q) => q.moduleId === moduleId);

  function resetProgress() {
    setSpacedData((previous) => {
      const next = { ...previous };
      lectureQuestions.forEach((q) => {
        delete next[q.id];
      });
      return next;
    });
    setConfirmingReset(false);
  }

  function resetAllProgress() {
    setSpacedData({});
    setBuriedCards({});
    setConfirmingReset(false);
  }

  function resetSingleCard(id) {
    setSpacedData((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }

  function toggleBuried(id) {
    setBuriedCards((previous) => {
      const next = { ...previous };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  }

  function isCustomQuestion(id) {
    return importedQuestions.some((q) => q.id === id);
  }

  function saveQuestion(updated) {
    if (isCustomQuestion(updated.id)) {
      setImportedQuestions((previous) =>
        previous.map((q) => (q.id === updated.id ? updated : q))
      );
    } else if (QUESTIONS.some((q) => q.id === updated.id)) {
      setQuestionOverrides((previous) => ({
        ...previous,
        [updated.id]: { ...(previous[updated.id] || {}), fields: updated },
      }));
    } else {
      setImportedQuestions((previous) => [...previous, updated]);
    }
    setEditingQuestion(null);
    setCreating(false);
  }

  function deleteQuestion(id) {
    if (isCustomQuestion(id)) {
      setImportedQuestions((previous) => previous.filter((q) => q.id !== id));
    } else {
      setQuestionOverrides((previous) => ({
        ...previous,
        [id]: { ...(previous[id] || {}), deleted: true },
      }));
    }
    setConfirmingDeleteId(null);
  }

  if (gateOpen) {
    return (
      <Modal c={c} onClose={() => setGateOpen(false)}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
            {t.adminGateTitle}
          </div>
          <IconButton c={c} title={t.close} onClick={() => setGateOpen(false)}>
            <Icon name="close" size={17} />
          </IconButton>
        </header>

        <p
          style={{
            color: c.secondary,
            fontSize: 12,
            lineHeight: 1.55,
            marginBottom: 16,
          }}
        >
          {t.adminGateDescription}
        </p>

        <input
          type="password"
          value={gatePasscode}
          onChange={(event) => {
            setGatePasscode(event.target.value);
            setGateError(false);
          }}
          onKeyDown={(event) => event.key === "Enter" && unlockGate()}
          placeholder={t.adminPasscodePlaceholder}
          autoFocus
          style={{
            width: "100%",
            height: 44,
            padding: "0 12px",
            borderRadius: 12,
            border: `1px solid ${gateError ? c.red : c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 14,
            marginBottom: 12,
          }}
        />

        {gateError && (
          <div
            style={{
              color: c.red,
              fontSize: 12,
              fontWeight: 650,
              marginBottom: 12,
            }}
          >
            {t.adminWrongCode}
          </div>
        )}

        <PrimaryButton onClick={unlockGate} style={{ width: "100%" }}>
          {t.adminUnlock}
        </PrimaryButton>
      </Modal>
    );
  }

  if (creating || editingQuestion) {
    return (
      <Modal
        c={c}
        onClose={() => {
          setCreating(false);
          setEditingQuestion(null);
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
            {creating ? t.newQuestionTitle : t.editQuestion}
          </div>
          <IconButton
            c={c}
            title={t.close}
            onClick={() => {
              setCreating(false);
              setEditingQuestion(null);
            }}
          >
            <Icon name="close" size={17} />
          </IconButton>
        </header>
        <QuestionEditor
          c={c}
          t={t}
          language={language}
          question={editingQuestion}
          moduleId={moduleId}
          lectureId={lecture.id}
          onSave={saveQuestion}
          onCancel={() => {
            setCreating(false);
            setEditingQuestion(null);
          }}
        />
      </Modal>
    );
  }

  return (
    <Modal c={c} onClose={onClose}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
          {t.questionListTitle}
        </div>
        <IconButton c={c} title={t.close} onClick={onClose}>
          <Icon name="close" size={17} />
        </IconButton>
      </header>
      <p style={{ color: c.secondary, fontSize: 12, marginBottom: 16 }}>
        {lecture.title}
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          type="button"
          onClick={withAdmin(() => setCreating(true))}
          style={{
            flex: 1,
            minHeight: 40,
            borderRadius: 10,
            border: `1px dashed ${c.borderStrong}`,
            background: "transparent",
            color: c.blue,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          + {t.addNewQuestion}
        </button>
        {!confirmingReset ? (
          <button
            type="button"
            onClick={withAdmin(() => setConfirmingReset(true))}
            disabled={lectureQuestions.length === 0}
            style={{
              minHeight: 40,
              padding: "0 14px",
              borderRadius: 10,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.secondary,
              fontSize: 12,
              fontWeight: 700,
              cursor: lectureQuestions.length === 0 ? "default" : "pointer",
              opacity: lectureQuestions.length === 0 ? 0.5 : 1,
            }}
          >
            {t.resetProgress}
          </button>
        ) : (
          <button
            type="button"
            onClick={resetProgress}
            style={{
              minHeight: 40,
              padding: "0 14px",
              borderRadius: 10,
              border: `1px solid ${c.red}`,
              background: c.redSoft,
              color: c.red,
              fontSize: 12,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {t.resetConfirm}?
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={withAdmin(() => {
          if (
            window.confirm(
              "Nulstil progress for alle MCQ’er? Alle kortplaner og reviewhistorik slettes."
            )
          )
            resetAllProgress();
        })}
        style={{
          width: "100%",
          minHeight: 38,
          marginTop: -8,
          marginBottom: 16,
          padding: "0 12px",
          borderRadius: 10,
          border: `1px solid ${c.border}`,
          background: "transparent",
          color: c.secondary,
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Nulstil alle MCQ-kort
      </button>

      {lectureQuestions.length === 0 ? (
        <p style={{ color: c.muted, fontSize: 12 }}>{t.noCardsInLecture}</p>
      ) : (
        <div
          style={{ display: "grid", gap: 8, maxHeight: 320, overflowY: "auto" }}
        >
          {lectureQuestions.map((question) => {
            const card = spacedData[question.id];
            const status = cardStatus(card);
            const statusLabel =
              status === "new"
                ? t.cardStatusNew
                : status === "due"
                ? t.cardStatusDue
                : t.cardStatusLearned;
            const statusColor =
              status === "new"
                ? c.green
                : status === "due"
                ? c.blue
                : c.secondary;
            const statusBg =
              status === "new"
                ? c.greenSoft
                : status === "due"
                ? c.blueSoft
                : c.soft;

            return (
              <div
                key={question.id}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: c.soft,
                  border: `1px solid ${c.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: c.text,
                      fontSize: 13,
                      fontWeight: 600,
                      flex: 1,
                    }}
                  >
                    {translate(question.question, language)}
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      padding: "3px 8px",
                      borderRadius: 7,
                      fontSize: 10,
                      fontWeight: 800,
                      background: statusBg,
                      color: statusColor,
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    type="button"
                    onClick={withAdmin(() => setEditingQuestion(question))}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      border: 0,
                      background: "transparent",
                      color: c.blue,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Icon name="edit" size={13} /> {t.editQuestion}
                  </button>
                  {confirmingDeleteId === question.id ? (
                    <button
                      type="button"
                      onClick={() => deleteQuestion(question.id)}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: c.red,
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {t.resetConfirm}?
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={withAdmin(() =>
                        setConfirmingDeleteId(question.id)
                      )}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        border: 0,
                        background: "transparent",
                        color: c.red,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <Icon name="trash" size={13} /> {t.deleteQuestion}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => toggleBuried(question.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      border: 0,
                      background: "transparent",
                      color:
                        buriedCards && buriedCards[question.id]
                          ? c.blue
                          : c.secondary,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <Icon name="notebook" size={13} />
                    {buriedCards && buriedCards[question.id]
                      ? t.unburyCard
                      : t.buryCard}
                  </button>

                  {card && (
                    <button
                      type="button"
                      onClick={() => resetSingleCard(question.id)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        border: 0,
                        background: "transparent",
                        color: c.secondary,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <Icon name="reset" size={13} /> {t.resetThisCard}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

function AdminPortal({ c, t, language, user, onClose }) {
  const [unlocked, setUnlocked] = useStoredState(STORAGE.adminUnlocked, false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [imported, setImportedQuestions] = useStoredState(
    STORAGE.importedQuestions,
    []
  );
  const [flagged, setFlagged] = useStoredState(STORAGE.flaggedQuestions, []);
  const [adminTab, setAdminTab] = useState("import");

  function tryUnlock() {
    if (simpleHash(passcode.trim()) === ADMIN_PASSCODE_HASH) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  function removeQuestion(id) {
    setImportedQuestions((previous) => previous.filter((q) => q.id !== id));
  }

  function resolveFlag(id) {
    setFlagged((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status: "resolved" } : item
      )
    );
  }

  function dismissFlag(id) {
    setFlagged((previous) => previous.filter((item) => item.id !== id));
  }

  const openFlags = flagged.filter((item) => item.status !== "resolved");

  if (!unlocked) {
    return (
      <Modal c={c} onClose={onClose}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
            {t.adminGateTitle}
          </div>
          <IconButton c={c} title={t.close} onClick={onClose}>
            <Icon name="close" size={17} />
          </IconButton>
        </header>

        <p
          style={{
            color: c.secondary,
            fontSize: 12,
            lineHeight: 1.55,
            marginBottom: 16,
          }}
        >
          {t.adminGateDescription}
        </p>

        <input
          type="password"
          value={passcode}
          onChange={(event) => {
            setPasscode(event.target.value);
            setError(false);
          }}
          onKeyDown={(event) => event.key === "Enter" && tryUnlock()}
          placeholder={t.adminPasscodePlaceholder}
          autoFocus
          style={{
            width: "100%",
            height: 44,
            padding: "0 12px",
            borderRadius: 12,
            border: `1px solid ${error ? c.red : c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 14,
            marginBottom: 12,
          }}
        />

        {error && (
          <div
            style={{
              color: c.red,
              fontSize: 12,
              fontWeight: 650,
              marginBottom: 12,
            }}
          >
            {t.adminWrongCode}
          </div>
        )}

        <PrimaryButton onClick={tryUnlock} style={{ width: "100%" }}>
          {t.adminUnlock}
        </PrimaryButton>
      </Modal>
    );
  }

  return (
    <Modal c={c} onClose={onClose} size="large">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
          {t.adminPanelTitle}
        </div>
        <IconButton c={c} title={t.close} onClick={onClose}>
          <Icon name="close" size={17} />
        </IconButton>
      </header>

      <div
        style={{
          display: "flex",
          gap: 6,
          padding: 4,
          borderRadius: 12,
          background: c.soft,
          marginBottom: 18,
        }}
      >
        {[
          ["import", t.adminTabImport],
          [
            "flagged",
            `${t.adminTabFlagged}${
              openFlags.length > 0 ? ` (${openFlags.length})` : ""
            }`,
          ],
        ].map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setAdminTab(key)}
            style={{
              flex: 1,
              height: 38,
              border: 0,
              borderRadius: 9,
              background: adminTab === key ? c.panel : "transparent",
              color: adminTab === key ? c.text : c.secondary,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: adminTab === key ? c.shadow : "none",
              transition: "background 160ms ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {adminTab === "import" ? (
        <>
          <div style={{ marginBottom: 20 }}>
            <ImportQuestionsModal
              c={c}
              t={t}
              language={language}
              user={user}
              embedded
              onClose={() => {}}
            />
          </div>

          <div
            style={{
              borderTop: `1px solid ${c.border}`,
              paddingTop: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                color: c.text,
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 10,
              }}
            >
              {t.adminImportedList} ({imported.length})
            </div>

            {imported.length === 0 ? (
              <p style={{ color: c.muted, fontSize: 12 }}>
                {t.adminNoImported}
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 8,
                  maxHeight: 220,
                  overflowY: "auto",
                }}
              >
                {imported.map((question) => (
                  <div
                    key={question.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "9px 11px",
                      borderRadius: 10,
                      background: c.soft,
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <span
                      style={{
                        color: c.text,
                        fontSize: 12,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {translate(question.question, language)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: c.red,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      {t.adminDelete}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              color: c.text,
              fontWeight: 700,
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            {t.adminTabFlagged} ({flagged.length} {t.adminFlaggedCount})
          </div>

          {flagged.length === 0 ? (
            <p style={{ color: c.muted, fontSize: 12 }}>{t.adminNoFlagged}</p>
          ) : (
            <div
              style={{
                display: "grid",
                gap: 10,
                maxHeight: 440,
                overflowY: "auto",
              }}
            >
              {[...flagged]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: 13,
                      borderRadius: 12,
                      background: c.soft,
                      border: `1px solid ${
                        item.status === "resolved" ? c.border : c.redBorder
                      }`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          color: c.text,
                          fontSize: 12.5,
                          fontWeight: 700,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.questionText}
                      </span>
                      <span
                        style={{
                          flexShrink: 0,
                          padding: "3px 8px",
                          borderRadius: 99,
                          background:
                            item.status === "resolved"
                              ? c.greenSoft
                              : c.redSoft,
                          color: item.status === "resolved" ? c.green : c.red,
                          fontSize: 10,
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        {item.status === "resolved"
                          ? t.adminFlaggedResolved
                          : t.adminFlaggedOpen}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 14,
                        marginBottom: 8,
                        color: c.secondary,
                        fontSize: 11,
                        fontWeight: 650,
                      }}
                    >
                      <span>
                        {t.adminFlaggedBy}:{" "}
                        <strong style={{ color: c.text }}>
                          {item.userName || "—"}
                        </strong>
                      </span>
                      <span>
                        {t.adminFlaggedAt}:{" "}
                        <strong style={{ color: c.text }}>
                          {new Date(item.timestamp).toLocaleString(undefined, {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </strong>
                      </span>
                    </div>

                    <div
                      style={{
                        padding: "8px 10px",
                        borderRadius: 8,
                        background: c.panel,
                        color: c.secondary,
                        fontSize: 12,
                        lineHeight: 1.5,
                        marginBottom: 10,
                      }}
                    >
                      <span style={{ color: c.muted, fontWeight: 700 }}>
                        {t.adminFlaggedReason}:{" "}
                      </span>
                      {item.reason}
                    </div>

                    {item.status !== "resolved" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          type="button"
                          onClick={() => resolveFlag(item.id)}
                          style={{
                            flex: 1,
                            height: 34,
                            border: 0,
                            borderRadius: 8,
                            background: c.greenSoft,
                            color: c.green,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {t.adminFlaggedResolve}
                        </button>
                        <button
                          type="button"
                          onClick={() => dismissFlag(item.id)}
                          style={{
                            flex: 1,
                            height: 34,
                            border: `1px solid ${c.borderStrong}`,
                            borderRadius: 8,
                            background: "transparent",
                            color: c.secondary,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          {t.adminFlaggedDismiss}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setUnlocked(false)}
        style={{
          width: "100%",
          height: 40,
          border: `1px solid ${c.borderStrong}`,
          borderRadius: 10,
          background: "transparent",
          color: c.secondary,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        {t.adminLock}
      </button>
    </Modal>
  );
}

function parseDelimited(rawText) {
  const firstLine = rawText.split(/\r?\n/)[0] || "";
  const delimiter = firstLine.includes("\t") ? "\t" : ",";
  const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return { header: [], rows: [] };
  const splitLine = (line) =>
    line.split(delimiter).map((cell) => cell.trim().replace(/^"(.*)"$/, "$1"));
  const header = splitLine(lines[0]).map((cell) => cell.toLowerCase());
  const looksLikeHeader = header.some((cell) =>
    ["question", "spørgsmål", "front", "option1", "correct"].includes(cell)
  );
  const dataLines = looksLikeHeader ? lines.slice(1) : lines;
  const rows = dataLines.map((line, index) => ({
    index,
    cells: splitLine(line),
  }));
  return { header: looksLikeHeader ? header : [], rows };
}

function questionFingerprint(rawQuestionText) {
  return String(rawQuestionText || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function ImportQuestionsModal({
  c,
  t,
  language,
  user,
  onClose,
  embedded = false,
}) {
  const [format, setFormat] = useState("json");
  const [text, setText] = useState("");
  const [moduleId, setModuleId] = useState(user?.module || "");
  const [lectureId, setLectureId] = useState("");
  const [status, setStatus] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [imported, setImportedQuestions] = useStoredState(
    STORAGE.importedQuestions,
    []
  );

  const lectures = MODULE_LECTURES[moduleId] || [];
  const existingFingerprints = new Set(
    [...QUESTIONS, ...imported].map((q) =>
      questionFingerprint(
        q.question?.[language] || q.question?.da || q.question
      )
    )
  );

  function normalizeCandidate(item, rowLabel) {
    const questionText = item.question || item.text || item.front || "";
    if (!questionText || String(questionText).trim().length === 0) {
      return { error: `${rowLabel}: mangler spørgsmålstekst.` };
    }
    let options = item.options;
    if (!Array.isArray(options) || options.length < 2) {
      return { error: `${rowLabel}: skal have mindst 2 svarmuligheder.` };
    }
    let correct = Number(item.correct ?? 0);
    if (Number.isNaN(correct) || correct < 0 || correct >= options.length) {
      return {
        error: `${rowLabel}: "correct"-indekset er ugyldigt (skal matche en af svarmulighederne).`,
      };
    }
    const fingerprint = questionFingerprint(questionText);
    const isDuplicate = existingFingerprints.has(fingerprint);
    const normalized = normalizeImportedQuestion({
      ...item,
      question: questionText,
      options,
      correct,
      moduleId: moduleId || item.moduleId || null,
      lectureId: lectureId || item.lectureId || null,
    });
    return { normalized, isDuplicate, fingerprint };
  }

  function buildPreviewFromJSON(rawText) {
    let raw;
    try {
      raw = JSON.parse(rawText);
    } catch (parseError) {
      return {
        errors: [`Ugyldig JSON: ${parseError.message}`],
        candidates: [],
      };
    }
    const list = Array.isArray(raw) ? raw : [raw];
    const errors = [];
    const candidates = [];
    list.forEach((item, index) => {
      if (!item || typeof item !== "object") {
        errors.push(`Række ${index + 1}: ikke et gyldigt objekt.`);
        return;
      }
      const result = normalizeCandidate(item, `Række ${index + 1}`);
      if (result.error) errors.push(result.error);
      else candidates.push(result);
    });
    return { errors, candidates };
  }

  function buildPreviewFromDelimited(rawText) {
    const { header, rows } = parseDelimited(rawText);
    const errors = [];
    const candidates = [];
    const colIndex = (names) => header.findIndex((h) => names.includes(h));
    const qIdx = header.length
      ? colIndex(["question", "spørgsmål", "front"])
      : 0;
    const corrIdx = header.length
      ? colIndex(["correct", "correct_index", "svar"])
      : -1;
    const explIdx = header.length
      ? colIndex(["explanation", "forklaring", "back"])
      : -1;
    const catIdx = header.length ? colIndex(["category", "kategori"]) : -1;
    const optionStartIdx = header.length
      ? header.findIndex(
          (h) => h.startsWith("option") || h.startsWith("svarmulighed")
        )
      : 1;

    rows.forEach(({ index, cells }) => {
      const rowLabel = `Linje ${index + (header.length ? 2 : 1)}`;
      if (cells.length === 0 || cells.every((cell) => cell === "")) return;
      const questionText = qIdx >= 0 ? cells[qIdx] : cells[0];
      const optionCells = header.length
        ? cells
            .slice(
              optionStartIdx >= 0 ? optionStartIdx : 1,
              corrIdx >= 0 ? corrIdx : undefined
            )
            .filter((cell) => cell !== "")
        : cells.slice(1, cells.length - 1).filter((cell) => cell !== "");
      const correctRaw =
        corrIdx >= 0 ? cells[corrIdx] : cells[cells.length - 1];
      const correctIndex = Number.isNaN(Number(correctRaw))
        ? optionCells.findIndex(
            (cell) =>
              cell.trim().toLowerCase() ===
              String(correctRaw).trim().toLowerCase()
          )
        : Number(correctRaw);
      const item = {
        question: questionText,
        options: optionCells,
        correct: correctIndex,
        explanation: explIdx >= 0 ? cells[explIdx] : "",
        category: catIdx >= 0 ? cells[catIdx] : "",
      };
      const result = normalizeCandidate(item, rowLabel);
      if (result.error) errors.push(result.error);
      else candidates.push(result);
    });
    return { errors, candidates };
  }

  function runPreview(rawText) {
    if (!rawText || !rawText.trim()) {
      setStatus({ type: "error", message: t.importEmpty });
      setPreview(null);
      return;
    }
    const result =
      format === "json"
        ? buildPreviewFromJSON(rawText)
        : buildPreviewFromDelimited(rawText);
    if (result.candidates.length === 0 && result.errors.length > 0) {
      setStatus({ type: "error", message: t.importError });
      setPreview({ ...result, candidates: [] });
      return;
    }
    setStatus(null);
    setPreview(result);
  }

  function confirmImport() {
    if (!preview || preview.candidates.length === 0) return;
    const toImport = preview.candidates.filter(
      (candidate) => !candidate.excluded
    );
    setImportedQuestions((previous) => [
      ...previous,
      ...toImport.map((candidate) => candidate.normalized),
    ]);
    setStatus({ type: "success", message: t.importSuccess(toImport.length) });
    setPreview(null);
    setText("");
    setFileName(null);
  }

  function toggleCandidateExcluded(fingerprint, candidateIndex) {
    setPreview((prev) => ({
      ...prev,
      candidates: prev.candidates.map((candidate, index) =>
        index === candidateIndex
          ? { ...candidate, excluded: !candidate.excluded }
          : candidate
      ),
    }));
  }

  function handleImport() {
    runPreview(text);
  }

  function loadFile(file) {
    if (!file) return;
    setFileName(file.name);
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith(".csv")) setFormat("csv");
    else if (lowerName.endsWith(".tsv") || lowerName.endsWith(".txt"))
      setFormat("csv");
    else setFormat("json");
    const reader = new FileReader();
    reader.onload = () => {
      const content2 = typeof reader.result === "string" ? reader.result : "";
      setText(content2);
    };
    reader.onerror = () => {
      setStatus({ type: "error", message: t.importError });
    };
    reader.readAsText(file);
  }

  function handleFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    loadFile(file);
    event.target.value = "";
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    loadFile(file);
  }

  const body = (
    <>
      {!embedded && (
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div style={{ color: c.text, fontWeight: 750, fontSize: 15 }}>
            {t.importTitle}
          </div>
          <IconButton c={c} title={t.close} onClick={onClose}>
            <Icon name="close" size={17} />
          </IconButton>
        </header>
      )}

      {embedded && (
        <div
          style={{
            color: c.text,
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {t.importTitle}
        </div>
      )}

      <p
        style={{
          color: c.secondary,
          fontSize: 12,
          lineHeight: 1.55,
          marginBottom: 16,
        }}
      >
        {t.importDescription}
      </p>

      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[
          ["json", "JSON"],
          ["csv", "CSV / TSV (Anki-eksport)"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFormat(value)}
            style={{
              flex: 1,
              height: 34,
              borderRadius: 9,
              border: `1px solid ${format === value ? c.blueBorder : c.border}`,
              background: format === value ? c.blueSoft : c.soft,
              color: format === value ? c.blue : c.secondary,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json,.csv,.tsv,.txt"
        onChange={handleFileSelected}
        style={{ display: "none" }}
      />

      <button
        type="button"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          height: 52,
          marginBottom: 14,
          borderRadius: 12,
          border: `1.5px dashed ${isDragging ? c.blue : c.borderStrong}`,
          background: isDragging ? c.blueSoft : c.soft,
          color: isDragging ? c.blue : c.secondary,
          fontSize: 12.5,
          fontWeight: 700,
          cursor: "pointer",
          transition: "background .1s ease, border-color .1s ease",
        }}
      >
        <Icon name="plus" size={15} />
        {fileName ? fileName : t.importUploadFile}
      </button>

      <div style={{ display: "grid", gap: 10, marginBottom: 12 }}>
        <select
          value={moduleId}
          onChange={(event) => {
            setModuleId(event.target.value);
            setLectureId("");
          }}
          style={{
            height: 40,
            borderRadius: 10,
            border: `1px solid ${c.border}`,
            background: c.soft,
            color: c.text,
            fontSize: 12,
            padding: "0 10px",
          }}
        >
          <option value="">{t.importModuleLabel}</option>
          {Object.values(MODULES[language] || MODULES.da)
            .flat()
            .map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
        </select>

        {lectures.length > 0 && (
          <select
            value={lectureId}
            onChange={(event) => setLectureId(event.target.value)}
            style={{
              height: 40,
              borderRadius: 10,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.text,
              fontSize: 12,
              padding: "0 10px",
            }}
          >
            <option value="">{t.importLectureLabel}</option>
            {lectures.map((lecture) => (
              <option key={lecture.id} value={lecture.id}>
                {lecture.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={t.importPlaceholder}
        style={{
          width: "100%",
          minHeight: 160,
          padding: 12,
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          background: c.soft,
          color: c.text,
          fontSize: 12,
          fontFamily: "Space Mono, SFMono-Regular, Consolas, monospace",
          resize: "vertical",
          marginBottom: 12,
        }}
      />

      {status && (
        <div
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            marginBottom: 12,
            fontSize: 12,
            fontWeight: 650,
            background: status.type === "success" ? c.greenSoft : c.redSoft,
            color: status.type === "success" ? c.green : c.red,
          }}
        >
          {status.message}
        </div>
      )}

      {preview && preview.errors.length > 0 && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            marginBottom: 12,
            background: c.redSoft,
            border: `1px solid ${c.red}`,
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 750,
              color: c.red,
              marginBottom: 4,
            }}
          >
            {t.importIssuesTitle(preview.errors.length)}
          </div>
          <div
            style={{
              display: "grid",
              gap: 2,
              maxHeight: 90,
              overflowY: "auto",
            }}
          >
            {preview.errors.map((message, index) => (
              <div key={index} style={{ fontSize: 11, color: c.red }}>
                {message}
              </div>
            ))}
          </div>
        </div>
      )}

      {preview && preview.candidates.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontSize: 11.5,
              fontWeight: 750,
              color: c.secondary,
              marginBottom: 8,
            }}
          >
            {t.importPreviewTitle(preview.candidates.length)}
          </div>
          <div
            style={{
              display: "grid",
              gap: 6,
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            {preview.candidates.map((candidate, index) => (
              <label
                key={index}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: `1px solid ${
                    candidate.isDuplicate ? c.borderStrong : c.border
                  }`,
                  background: candidate.isDuplicate ? c.soft : c.panel,
                  cursor: "pointer",
                  opacity: candidate.excluded ? 0.5 : 1,
                }}
              >
                <input
                  type="checkbox"
                  checked={!candidate.excluded}
                  onChange={() =>
                    toggleCandidateExcluded(candidate.fingerprint, index)
                  }
                  style={{ marginTop: 2 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: c.text,
                      fontWeight: 650,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {candidate.normalized.question.da ||
                      candidate.normalized.question.en}
                  </div>
                  {candidate.isDuplicate && (
                    <div
                      style={{
                        fontSize: 10.5,
                        color: c.secondary,
                        fontWeight: 700,
                        marginTop: 2,
                      }}
                    >
                      {t.importDuplicateWarning}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        {!embedded && (
          <IconButton
            c={c}
            title={t.importCancel}
            onClick={onClose}
            style={{
              width: "auto",
              height: 40,
              padding: "0 14px",
              border: `1px solid ${c.borderStrong}`,
              color: c.text,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {t.importCancel}
          </IconButton>
        )}
        {preview && preview.candidates.length > 0 ? (
          <PrimaryButton onClick={confirmImport}>
            {t.importConfirmButton(
              preview.candidates.filter((c2) => !c2.excluded).length
            )}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={handleImport}>{t.importButton}</PrimaryButton>
        )}
      </div>
    </>
  );

  if (embedded) return body;

  return (
    <Modal c={c} onClose={onClose}>
      {body}
    </Modal>
  );
}

function SettingsModal({
  c,
  t,
  theme,
  setTheme,
  preferences,
  setPreferences,
  onClose,
}) {
  const [aiSettings, setAiSettings] = useStoredState(STORAGE.aiSettings, {
    apiKey: "",
    model: "gpt-4o-mini",
    enabled: false,
    webSearch: true,
    provider: "openai",
    nvidiaApiKey: "",
    nvidiaModel: "deepseek-ai/deepseek-v4-pro",
    nvidiaProxyUrl: "",
    groqApiKey: "",
    groqModel: "llama-3.3-70b-versatile",
  });

  return (
    <Modal c={c} onClose={onClose} size="large">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 21,
        }}
      >
        <div>
          <div style={{ color: c.text, fontWeight: 750 }}>{t.settings}</div>
        </div>

        <IconButton c={c} title={t.close} onClick={onClose}>
          <Icon name="close" size={17} />
        </IconButton>
      </header>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div
          style={{
            color: c.muted,
            fontSize: 11,
            fontWeight: 750,
            letterSpacing: ".09em",
            textTransform: "uppercase",
            marginBottom: 9,
          }}
        >
          {t.drByteAiSectionTitle}
        </div>

        <div
          style={{
            borderRadius: 15,
            border: `1px solid ${c.border}`,
            padding: 14,
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div>
              <div style={{ color: c.text, fontSize: 12.5, fontWeight: 700 }}>
                {t.drByteAiToggleLabel}
              </div>
              <div style={{ color: c.secondary, fontSize: 11, marginTop: 2 }}>
                {t.drByteAiToggleDescription}
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setAiSettings((prev) => ({ ...prev, enabled: !prev.enabled }))
              }
              style={{
                width: 44,
                height: 26,
                borderRadius: 99,
                border: "none",
                flexShrink: 0,
                background: aiSettings.enabled ? c.blue : c.border,
                position: "relative",
                cursor: "pointer",
                transition: "background 160ms ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  insetInlineStart: aiSettings.enabled ? 22 : 3,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "inset-inline-start 160ms ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,.25)",
                }}
              />
            </button>
          </div>

          <div>
            <label
              style={{
                color: c.secondary,
                fontSize: 11,
                fontWeight: 650,
                display: "block",
                marginBottom: 5,
              }}
            >
              {t.drByteAiProviderLabel}
            </label>
            <select
              value={aiSettings.provider || "openai"}
              onChange={(event) =>
                setAiSettings((prev) => ({
                  ...prev,
                  provider: event.target.value,
                }))
              }
              style={{
                width: "100%",
                height: 40,
                padding: "0 12px",
                borderRadius: 11,
                border: `1px solid ${c.border}`,
                background: c.soft,
                color: c.text,
                fontSize: 12.5,
              }}
            >
              <option value="openai">OpenAI</option>
              <option value="groq">Groq (Llama)</option>
              <option value="nvidia">NVIDIA (DeepSeek)</option>
            </select>
          </div>

          {(aiSettings.provider || "openai") === "groq" ? (
            <>
              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteGroqKeyLabel}
                </label>
                <input
                  type="password"
                  value={aiSettings.groqApiKey}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      groqApiKey: event.target.value,
                    }))
                  }
                  placeholder={t.drByteGroqKeyPlaceholder}
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                />
                <div
                  style={{
                    color: c.muted,
                    fontSize: 10.5,
                    lineHeight: 1.5,
                    marginTop: 5,
                  }}
                >
                  {t.drByteGroqKeyHint}
                </div>
              </div>

              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteAiModelLabel}
                </label>
                <select
                  value={aiSettings.groqModel}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      groqModel: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                >
                  <option value="llama-3.3-70b-versatile">
                    llama-3.3-70b-versatile
                  </option>
                  <option value="llama-3.1-8b-instant">
                    llama-3.1-8b-instant
                  </option>
                  <option value="gemma2-9b-it">gemma2-9b-it</option>
                </select>
              </div>
            </>
          ) : (aiSettings.provider || "openai") === "openai" ? (
            <>
              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteAiKeyLabel}
                </label>
                <input
                  type="password"
                  value={aiSettings.apiKey}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      apiKey: event.target.value,
                    }))
                  }
                  placeholder={t.drByteAiKeyPlaceholder}
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteAiModelLabel}
                </label>
                <select
                  value={aiSettings.model}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      model: event.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                >
                  <option value="gpt-4o-mini">gpt-4o-mini</option>
                  <option value="gpt-4o">gpt-4o</option>
                  <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteNvidiaKeyLabel}
                </label>
                <input
                  type="password"
                  value={aiSettings.nvidiaApiKey}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      nvidiaApiKey: event.target.value,
                    }))
                  }
                  placeholder={t.drByteNvidiaKeyPlaceholder}
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                />
                <div
                  style={{
                    color: c.muted,
                    fontSize: 10.5,
                    lineHeight: 1.5,
                    marginTop: 5,
                  }}
                >
                  {t.drByteNvidiaKeyHint}
                </div>
              </div>

              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteAiModelLabel}
                </label>
                <input
                  type="text"
                  value={aiSettings.nvidiaModel}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      nvidiaModel: event.target.value,
                    }))
                  }
                  placeholder="deepseek-ai/deepseek-v4-pro"
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: c.secondary,
                    fontSize: 11,
                    fontWeight: 650,
                    display: "block",
                    marginBottom: 5,
                  }}
                >
                  {t.drByteNvidiaProxyLabel}
                </label>
                <input
                  type="text"
                  value={aiSettings.nvidiaProxyUrl}
                  onChange={(event) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      nvidiaProxyUrl: event.target.value,
                    }))
                  }
                  placeholder={t.drByteNvidiaProxyPlaceholder}
                  style={{
                    width: "100%",
                    height: 40,
                    padding: "0 12px",
                    borderRadius: 11,
                    border: `1px solid ${c.border}`,
                    background: c.soft,
                    color: c.text,
                    fontSize: 12.5,
                  }}
                />
                <div
                  style={{
                    color: c.muted,
                    fontSize: 10.5,
                    lineHeight: 1.5,
                    marginTop: 5,
                  }}
                >
                  {t.drByteNvidiaProxyHint}
                </div>
              </div>
            </>
          )}

          {!aiSettings.provider || aiSettings.provider === "openai" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div>
                <div style={{ color: c.text, fontSize: 12.5, fontWeight: 700 }}>
                  {t.drByteWebSearchLabel}
                </div>
                <div style={{ color: c.secondary, fontSize: 11, marginTop: 2 }}>
                  {t.drByteWebSearchDescription}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAiSettings((prev) => ({
                    ...prev,
                    webSearch: !prev.webSearch,
                  }))
                }
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: 99,
                  border: "none",
                  flexShrink: 0,
                  background: aiSettings.webSearch ? c.blue : c.border,
                  position: "relative",
                  cursor: "pointer",
                  transition: "background 160ms ease",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    insetInlineStart: aiSettings.webSearch ? 22 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "inset-inline-start 160ms ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,.25)",
                  }}
                />
              </button>
            </div>
          ) : null}

          <div style={{ color: c.muted, fontSize: 10.5, lineHeight: 1.5 }}>
            {t.drByteAiKeyHint}
          </div>
        </div>

        <div
          style={{
            color: c.muted,
            fontSize: 11,
            fontWeight: 750,
            letterSpacing: ".09em",
            textTransform: "uppercase",
            marginBottom: 9,
          }}
        >
          {t.appearance}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 5,
            padding: 5,
            borderRadius: 15,
            background: c.soft,
            marginBottom: 20,
          }}
        >
          {[
            ["light", t.light, "sun"],
            ["dark", t.dark, "moon"],
          ].map(([value, label, icon]) => {
            const selected = theme === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                style={{
                  height: 39,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  border: 0,
                  borderRadius: 11,
                  background: selected ? c.panel : "transparent",
                  color: selected ? c.text : c.secondary,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <Icon name={icon} size={15} />
                {label}
              </button>
            );
          })}
        </div>

        <section
          style={{
            padding: "18px 0",
            borderTop: `1px solid ${c.border}`,
            borderBottom: `1px solid ${c.border}`,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ color: c.text, fontWeight: 650, fontSize: 14 }}>
                {t.textSize}
              </div>
              <div style={{ color: c.secondary, fontSize: 12, marginTop: 3 }}>
                {t.questionText}
              </div>
            </div>

            <div
              style={{
                minWidth: 40,
                padding: "6px 7px",
                borderRadius: 8,
                textAlign: "center",
                color: c.blue,
                background: c.blueSoft,
                fontSize: 12,
                fontWeight: 750,
              }}
            >
              {preferences.questionSize}px
            </div>
          </div>

          <input
            type="range"
            min="15"
            max="25"
            value={preferences.questionSize}
            onChange={(event) =>
              setPreferences((current) => ({
                ...current,
                questionSize: Number(event.target.value),
              }))
            }
            style={{ display: "block", width: "100%", accentColor: c.blue }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
              color: c.muted,
              fontSize: 11,
            }}
          >
            <span>{t.small}</span>
            <span>{t.standard}</span>
            <span>{t.large}</span>
          </div>
        </section>

        <button
          type="button"
          onClick={() =>
            setPreferences((current) => ({
              ...current,
              sound: !current.sound,
            }))
          }
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "15px 0",
            padding: 0,
            border: 0,
            background: "transparent",
            color: c.text,
            cursor: "pointer",
          }}
        >
          <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              style={{
                width: 35,
                height: 35,
                display: "grid",
                placeItems: "center",
                borderRadius: 10,
                color: preferences.sound ? c.blue : c.muted,
                background: preferences.sound ? c.blueSoft : c.soft,
              }}
            >
              <Icon
                name={preferences.sound ? "volume" : "volumeOff"}
                size={16}
              />
            </span>

            <span style={{ textAlign: "start" }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 650 }}>
                {t.timerSound}
              </span>
              <span
                style={{
                  display: "block",
                  color: c.secondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {t.timerSoundDescription}
              </span>
            </span>
          </span>

          <span
            style={{
              width: 42,
              height: 24,
              padding: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: preferences.sound ? "flex-end" : "flex-start",
              borderRadius: 99,
              background: preferences.sound ? c.blue : c.borderStrong,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
              }}
            />
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setPreferences((prev) => ({
              ...prev,
              mascotEnabled: prev.mascotEnabled === false ? true : false,
            }))
          }
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            padding: "14px 0",
            border: 0,
            background: "transparent",
            color: c.text,
            cursor: "pointer",
            borderBottom: `1px solid ${c.border}`,
            marginBottom: 18,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: 11,
                background: c.blueSoft,
                color: c.blue,
                flexShrink: 0,
              }}
            >
              <Icon name="user" size={16} />
            </span>

            <span style={{ textAlign: "start" }}>
              <span style={{ display: "block", fontSize: 14, fontWeight: 650 }}>
                {t.mascotToggle}
              </span>
              <span
                style={{
                  display: "block",
                  color: c.secondary,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {t.mascotToggleDescription}
              </span>
            </span>
          </span>

          <span
            style={{
              width: 42,
              height: 24,
              padding: 3,
              display: "flex",
              alignItems: "center",
              justifyContent:
                preferences.mascotEnabled === false ? "flex-start" : "flex-end",
              borderRadius: 99,
              background:
                preferences.mascotEnabled === false ? c.borderStrong : c.blue,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: "#fff",
              }}
            />
          </span>
        </button>
      </div>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            height: 43,
            border: 0,
            borderRadius: 12,
            background: "linear-gradient(135deg,#1665ea,#4b93ff)",
            color: "#fff",
            fontWeight: 750,
            cursor: "pointer",
            boxShadow: "0 10px 24px rgba(22,101,234,.28)",
          }}
        >
          {t.done}
        </button>
      </div>
    </Modal>
  );
}

function LanguageModal({ c, t, language, setLanguage, onClose }) {
  return (
    <Modal c={c} onClose={onClose}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: c.text,
            fontWeight: 750,
          }}
        >
          <Icon name="globe" size={17} />
          {t.chooseLanguage}
        </span>

        <IconButton c={c} title={t.close} onClick={onClose}>
          <Icon name="close" size={17} />
        </IconButton>
      </header>

      <p
        style={{
          margin: "0 0 16px",
          color: c.secondary,
          fontSize: 12,
          lineHeight: 1.55,
        }}
      >
        {t.languageDescription}
      </p>

      <div style={{ display: "grid", gap: 7 }}>
        {LANGUAGES.map((item) => {
          const selected = language === item.code;

          return (
            <button
              type="button"
              key={item.code}
              onClick={() => {
                setLanguage(item.code);
                onClose();
              }}
              style={{
                minHeight: 47,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 13px",
                borderRadius: 12,
                border: `1px solid ${selected ? c.blueBorder : c.border}`,
                background: selected ? c.blueSoft : c.soft,
                color: selected ? c.blue : c.text,
                fontWeight: 700,
                cursor: "pointer",
                direction: item.dir,
              }}
            >
              <span>{item.native}</span>
              {selected && <Icon name="check" size={17} stroke={3} />}
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function Sidebar({
  c,
  t,
  route,
  setRoute,
  notesOpen,
  setNotesOpen,
  calendarOpen,
  setCalendarOpen,
  onCloseCalendar,
  drByteOpen,
  setDrByteOpen,
  profileOpen,
  setProfileOpen,
  onProfileAction,
  dueCount = 0,
}) {
  function NavButton({ icon, title, active, onClick, badge }) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        className="sidebar-nav-btn"
        style={{
          position: "relative",
          width: 44,
          height: 44,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: 13,
          background: active ? c.blueSoft : "transparent",
          color: active ? c.blue : c.secondary,
          cursor: "pointer",
        }}
      >
        <Icon name={icon} size={19} />
        {active && (
          <span
            className="sidebar-active-dot"
            style={{
              position: "absolute",
              insetInlineStart: -13,
              top: "50%",
              transform: "translateY(-50%)",
              width: 3,
              height: 18,
              borderRadius: 99,
              background: c.blue,
            }}
          />
        )}
        {badge > 0 && (
          <span
            style={{
              position: "absolute",
              top: -3,
              insetInlineEnd: -3,
              minWidth: 16,
              height: 16,
              padding: "0 3px",
              borderRadius: 99,
              background: c.red,
              color: "#fff",
              fontSize: 9,
              fontWeight: 800,
              display: "grid",
              placeItems: "center",
              border: `2px solid ${c.panel}`,
              lineHeight: 1,
            }}
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>
    );
  }

  return (
    <aside
      data-tour="sidebar"
      className="app-sidebar app-surface"
      style={{
        width: 74,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexShrink: 0,
        padding: "20px 0",
        background: c.panel,
        borderInlineEnd: `1px solid ${c.border}`,
        direction: "ltr",
      }}
    >
      {/* Det blå hovedlogo er bevaret */}
      <div
        title="MedLearn"
        className="sidebar-logo"
        style={{
          width: 42,
          height: 42,
          display: "grid",
          placeItems: "center",
          marginBottom: 26,
          borderRadius: 14,
          background: "linear-gradient(135deg,#1665ea,#5aa8ff)",
          color: "#fff",
          boxShadow: "0 10px 22px rgba(22,101,234,.32)",
        }}
      >
        <Icon name="logo" size={21} />
      </div>

      <div style={{ display: "grid", gap: 6, position: "relative" }}>
        <NavButton
          icon="home"
          title={t.home}
          active={route === "home"}
          onClick={() => {
            setRoute("home");
            setProfileOpen(false);
          }}
        />

        <NavButton
          icon="clipboard"
          title={t.clinicalMcq}
          active={route === "mcq"}
          badge={dueCount}
          onClick={() => {
            setRoute("mcq");
            setProfileOpen(false);
          }}
        />
      </div>

      <div
        style={{
          width: 28,
          height: 1,
          background: c.borderStrong,
          margin: "18px 0",
        }}
      />

      <div style={{ display: "grid", gap: 6 }}>
        <NavButton
          icon="notebook"
          title={t.notebook}
          active={notesOpen}
          onClick={() => {
            setNotesOpen((value) => !value);
            setCalendarOpen(false);
            setDrByteOpen(false);
            setProfileOpen(false);
          }}
        />

        <NavButton
          icon="calendar"
          title={t.calendar}
          active={calendarOpen}
          onClick={() => {
            if (calendarOpen) {
              onCloseCalendar();
            } else {
              setCalendarOpen(true);
              setNotesOpen(false);
              setDrByteOpen(false);
              setProfileOpen(false);
            }
          }}
        />

        <NavButton
          icon="chat"
          title={t.drByte}
          active={drByteOpen}
          onClick={() => {
            setDrByteOpen((value) => !value);
            setNotesOpen(false);
            setCalendarOpen(false);
            setProfileOpen(false);
          }}
        />
      </div>

      <div style={{ position: "relative", marginTop: "auto" }}>
        <button
          type="button"
          title={t.profile}
          onClick={() => setProfileOpen((value) => !value)}
          className="sidebar-profile-btn"
          style={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            border: `1px solid ${profileOpen ? c.blueBorder : c.border}`,
            background: profileOpen ? c.blueSoft : c.soft,
            color: profileOpen ? c.blue : c.secondary,
            cursor: "pointer",
          }}
        >
          <Icon name="user" size={18} />
        </button>

        {profileOpen && (
          <div
            className="fade-up"
            style={{
              position: "absolute",
              // Skal ligge over kalenderens fuldskærmswrapper (zIndex: 999) og
              // ligestillet med Modal (zIndex: 1000), så profilmenuen altid
              // er klikbar og synlig foran kalenderen, uanset visningstilstand.
              zIndex: 1000,
              left: 60,
              bottom: 0,
              width: 220,
              padding: 8,
              borderRadius: 18,
              background: c.panel,
              border: `1px solid ${c.border}`,
              boxShadow: c.shadowLg,
              direction: "inherit",
            }}
          >
            {[
              ["settings", "settings", t.settings],
              ["language", "globe", t.language],
              ["tutorial", "target", t.replayTutorial],
              ["admin", "book", t.adminPortal],
              ["logout", "logout", t.resetProfile],
              ["signout", "logout", t.signOutAction],
            ].map(([id, icon, label]) => (
              <button
                type="button"
                key={id}
                onClick={() => onProfileAction(id)}
                className="sidebar-menu-item"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "11px 10px",
                  border: 0,
                  borderRadius: 11,
                  color: id === "logout" || id === "signout" ? c.red : c.text,
                  background: "transparent",
                  textAlign: "left",
                  fontSize: 13,
                  fontWeight: 650,
                  cursor: "pointer",
                }}
              >
                <Icon name={icon} size={16} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function Modal({ c, children, onClose, size = "default" }) {
  const widthBySize = {
    default: "min(400px,100%)",
    large: "min(880px,94vw)",
  };
  const maxHeightBySize = {
    default: "88vh",
    large: "86vh",
  };
  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        // zIndex skal ligge over kalenderens fuldskærmswrapper (zIndex: 999),
        // så Indstillinger/Sprog/Admin/Logud-modalerne altid vises foran
        // kalenderen, uanset om den er åben i fuldskærm.
        zIndex: 1000,
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: c.overlay,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        className="fade-up"
        onMouseDown={(event) => event.stopPropagation()}
        style={{
          width: widthBySize[size] || widthBySize.default,
          maxHeight: maxHeightBySize[size] || maxHeightBySize.default,
          overflowY: "auto",
          padding: size === "large" ? 32 : 24,
          borderRadius: 22,
          background: c.panel,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadowLg,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   DR. BYTE — DOKTOR-SPEJDER-MUS MASCOT + KONTEKSTUEL MOTOR
   ============================================================ */

const MASCOT_COPY = {
  da: {
    name: "Dr. Byte",
    recordStreak: (n) =>
      `Ny personlig rekord! ${n} dages streak i træk — flot arbejde.`,
    recordAccuracy: (n) =>
      `Ny rekord: ${n}% nøjagtighed i en session. Det er dit bedste resultat endnu!`,
    recordQuestions: (n) =>
      `Personlig rekord: ${n} besvarede spørgsmål i alt. Bliv ved!`,
    recordPomodoro: (n) =>
      `Ny rekord: ${n} pomodoro-sessioner på en dag. Flot fokus!`,
    inactive: (days) =>
      `Jeg har ikke set dig i ${days} dage. Bare et par minutters repetition holder pensum varmt.`,
    morningGreetingWithGoal: (name, count) =>
      `Godmorgen, ${name}! I dag foreslår din studieplan ${count} ${
        count === 1 ? "opgave" : "opgaver"
      }. Skal vi komme i gang?`,
    morningGreetingNoGoal: (name) =>
      `Godmorgen, ${name}! Du har ingen aktiv studieplan endnu — vil du sætte en op?`,
    examCountdown: (days) =>
      `Kun ${days} dage til eksamen. Lad os holde fremdriften ved.`,
    adviceReview: (n) =>
      `Du har ${n} spørgsmål til repetition lige nu. Det er et godt tidspunkt at tage dem.`,
    adviceNew: (n) =>
      `Der er ${n} nye spørgsmål klar i dit modul. Skal vi prøve et par stykker?`,
    adviceStreakZero:
      "Din streak er nulstillet. Én kort session i dag genstarter den.",
    adviceLowAccuracy: (pct) =>
      `Din seneste nøjagtighed lå på ${pct}%. Lidt ekstra repetition kan hjælpe.`,
    adviceNoPlan:
      "Du har ingen aktiv studieplan. Vil du sætte et mål for eksamen?",
    adviceNoPomodoroToday:
      "Du har ikke haft en fokus-session i dag. Prøv 25 minutter med Pomodoro-timeren.",
    adviceExamSoon: (days) =>
      `Der er ${days} dage til eksamen. Overvej at prioritere de sidste forelæsninger.`,
    adviceAllCaughtUp:
      "Du er helt opdateret! Godt arbejde — måske en frisk gennemgang af et gammelt emne?",
    adviceBehindSchedule:
      "Du er lidt bagud med studieplanen. Vil du indhente forsinkelsen og omfordele resten af pensum?",
    adviceExceptionDayToday:
      "I dag er markeret som en fridag i din studieplan. Slap af — planen fortsætter i morgen.",
    dismiss: "Luk",
    start: "Kom i gang",
    tapHint: "Tryk for et godt råd",
    back: "Tilbage",
    next: "Næste",
  },
  en: {
    name: "Dr. Byte",
    recordStreak: (n) =>
      `New personal record! ${n}-day streak in a row — great work.`,
    recordAccuracy: (n) =>
      `New record: ${n}% accuracy in one session. Your best yet!`,
    recordQuestions: (n) =>
      `Personal record: ${n} questions answered in total. Keep going!`,
    recordPomodoro: (n) =>
      `New record: ${n} pomodoro sessions in one day. Great focus!`,
    inactive: (days) =>
      `I haven't seen you in ${days} days. A few minutes of review keeps it fresh.`,
    morningGreetingWithGoal: (name, count) =>
      `Good morning, ${name}! Your study plan suggests ${count} ${
        count === 1 ? "task" : "tasks"
      } today. Ready to start?`,
    morningGreetingNoGoal: (name) =>
      `Good morning, ${name}! You don't have an active study plan yet — want to set one up?`,
    examCountdown: (days) =>
      `Only ${days} days left until the exam. Let's keep the momentum.`,
    adviceReview: (n) =>
      `You have ${n} questions due for review right now. Good time to tackle them.`,
    adviceNew: (n) =>
      `There are ${n} new questions ready in your module. Want to try a few?`,
    adviceStreakZero:
      "Your streak reset. One short session today will start it again.",
    adviceLowAccuracy: (pct) =>
      `Your latest accuracy was ${pct}%. A bit of extra review could help.`,
    adviceNoPlan:
      "You don't have an active study plan. Want to set an exam goal?",
    adviceNoPomodoroToday:
      "You haven't had a focus session today. Try 25 minutes with the Pomodoro timer.",
    adviceExamSoon: (days) =>
      `There are ${days} days left until the exam. Consider prioritizing the last lectures.`,
    adviceAllCaughtUp:
      "You're fully caught up! Great work — maybe a fresh review of an old topic?",
    adviceBehindSchedule:
      "You're a bit behind on your study plan. Want to catch up and redistribute the rest of the syllabus?",
    adviceExceptionDayToday:
      "Today is marked as a day off in your study plan. Relax — the plan continues tomorrow.",
    dismiss: "Dismiss",
    start: "Let's go",
    tapHint: "Tap for a tip",
    back: "Back",
    next: "Next",
  },
  ar: {
    name: "د. بايت",
    recordStreak: (n) => `رقم قياسي جديد! ${n} يومًا متتاليًا — عمل رائع.`,
    recordAccuracy: (n) =>
      `رقم قياسي جديد: دقة ${n}% في جلسة واحدة. أفضل نتيجة لك حتى الآن!`,
    recordQuestions: (n) =>
      `رقم قياسي شخصي: ${n} سؤالاً تمت الإجابة عليها إجمالاً. واصل التقدم!`,
    recordPomodoro: (n) =>
      `رقم قياسي جديد: ${n} جلسات بومودورو في يوم واحد. تركيز رائع!`,
    inactive: (days) =>
      `لم أرك منذ ${days} أيام. بضع دقائق من المراجعة تكفي للحفاظ على المستوى.`,
    morningGreetingWithGoal: (name, count) =>
      `صباح الخير، ${name}! تقترح خطتك اليوم ${count} مهمة. هل نبدأ؟`,
    morningGreetingNoGoal: (name) =>
      `صباح الخير، ${name}! ليس لديك خطة دراسية نشطة بعد — أترغب في إنشاء واحدة؟`,
    examCountdown: (days) =>
      `${days} أيام فقط حتى الامتحان. لنحافظ على التقدم.`,
    adviceReview: (n) => `لديك ${n} سؤالاً للمراجعة الآن. وقت جيد لإنجازها.`,
    adviceNew: (n) => `هناك ${n} سؤالاً جديدًا جاهزًا في وحدتك. هل نجرب بعضها؟`,
    adviceStreakZero: "تم إعادة تعيين تتابعك. جلسة قصيرة اليوم ستعيده.",
    adviceLowAccuracy: (pct) =>
      `كانت دقتك الأخيرة ${pct}%. قليل من المراجعة الإضافية قد يساعد.`,
    adviceNoPlan: "ليس لديك خطة دراسية نشطة. هل تريد تحديد هدف للامتحان؟",
    adviceNoPomodoroToday:
      "لم تحظ بجلسة تركيز اليوم. جرّب 25 دقيقة مع مؤقت بومودورو.",
    adviceExamSoon: (days) =>
      `${days} أيام حتى الامتحان. فكر في إعطاء الأولوية للمحاضرات الأخيرة.`,
    adviceAllCaughtUp:
      "أنت محدث بالكامل! عمل رائع — ماذا عن مراجعة سريعة لموضوع قديم؟",
    adviceBehindSchedule:
      "أنت متأخر قليلاً عن خطتك الدراسية. هل تريد تعويض التأخير وإعادة توزيع باقي المنهج؟",
    adviceExceptionDayToday:
      "اليوم يوم راحة في خطتك الدراسية. استرخِ — تستمر الخطة غدًا.",
    dismiss: "إغلاق",
    start: "لنبدأ",
    tapHint: "اضغط للحصول على نصيحة",
    back: "رجوع",
    next: "التالي",
  },
};

const MASCOT_INTRO_COPY = {
  da: {
    welcome: (name) => {
      const hour = new Date().getHours();
      const greet =
        hour < 10 ? "Godmorgen" : hour < 18 ? "God dag" : "God aften";
      return `${greet}, ${name}! Klar til at studere?`;
    },
    factTemplate: (category, explanation) =>
      `Vidste du det? Om ${category}: ${explanation}`,
    factNone:
      "Tilføj et par spørgsmål til dit modul, så finder jeg et spændende fakta til dig.",
    planReview: (n) =>
      `Anbefaling: du har ${n} spørgsmål til repetition — godt sted at starte i dag.`,
    planNew: (n) =>
      `Anbefaling: prøv et par af de ${n} nye spørgsmål i dit modul.`,
    planExamSoon: (days) =>
      `Anbefaling: kun ${days} dage til eksamen — prioriter de sidste emner.`,
    planNoPlan:
      "Anbefaling: opret en studieplan, så jeg kan guide dig bedre dag for dag.",
    planAllGood:
      "Anbefaling: du er opdateret — måske en hurtig repetition af et gammelt emne?",
  },
  en: {
    welcome: (name) => {
      const hour = new Date().getHours();
      const greet =
        hour < 10 ? "Good morning" : hour < 18 ? "Good day" : "Good evening";
      return `${greet}, ${name}! Ready to study?`;
    },
    factTemplate: (category, explanation) =>
      `Did you know? About ${category}: ${explanation}`,
    factNone:
      "Add a few questions to your module and I'll find a fun fact for you.",
    planReview: (n) =>
      `Recommendation: you have ${n} questions due for review — good place to start today.`,
    planNew: (n) =>
      `Recommendation: try a few of the ${n} new questions in your module.`,
    planExamSoon: (days) =>
      `Recommendation: only ${days} days until the exam — prioritize the last topics.`,
    planNoPlan:
      "Recommendation: set up a study plan so I can guide you better day by day.",
    planAllGood:
      "Recommendation: you're all caught up — maybe a quick review of an old topic?",
  },
  ar: {
    welcome: (name) => {
      const hour = new Date().getHours();
      const greet =
        hour < 10 ? "صباح الخير" : hour < 18 ? "نهارك سعيد" : "مساء الخير";
      return `${greet}، ${name}! هل أنت جاهز للمذاكرة؟`;
    },
    factTemplate: (category, explanation) =>
      `هل تعلم؟ عن ${category}: ${explanation}`,
    factNone: "أضف بعض الأسئلة إلى وحدتك وسأجد لك حقيقة مثيرة.",
    planReview: (n) =>
      `التوصية: لديك ${n} سؤالاً للمراجعة — نقطة انطلاق جيدة اليوم.`,
    planNew: (n) => `التوصية: جرّب بعض الأسئلة الجديدة (${n}) في وحدتك.`,
    planExamSoon: (days) =>
      `التوصية: ${days} أيام فقط حتى الامتحان — رتّب أولوياتك حول المواضيع الأخيرة.`,
    planNoPlan: "التوصية: أنشئ خطة دراسية لأتمكن من مساعدتك يوميًا بشكل أفضل.",
    planAllGood:
      "التوصية: أنت محدث بالكامل — ماذا عن مراجعة سريعة لموضوع قديم؟",
  },
};

function todayIsoKey() {
  const d = new Date();
  return dateKey(d.getFullYear(), d.getMonth(), d.getDate());
}

function daysBetween(aIso, bIso) {
  const a = new Date(aIso + "T00:00:00");
  const b = new Date(bIso + "T00:00:00");
  return Math.round((b - a) / 86400000);
}

/* ---------- Doktor-spejder-mus avatar ----------
   Fuld, stående chibi-figur: mus-ører, snude, whiskers, doktorkittel,
   stetoskop, pandespejl og en lille skråtaske med rødt medicinsk kryds
   (spejder-detalje). Moods styrer øjenbryn, øjenform, mund og arm. */
function MascotAvatar({ size = 72, mood = "default" }) {
  const eyeColor = mood === "alert" ? "#ff7b85" : "#5aa8ff";
  const eyeShape =
    mood === "sleepy"
      ? { rx: 1.3, ry: 0.5 }
      : mood === "happy"
      ? { rx: 1.3, ry: 1.3 }
      : { rx: 1.15, ry: 1.4 };
  const mouth =
    mood === "happy"
      ? "M9.6 16.8c1 .9 3.8.9 4.8 0"
      : mood === "alert"
      ? "M9.8 17h4.4"
      : "M9.8 16.7h4.4";
  const browTilt = mood === "alert" ? 6 : mood === "happy" ? -3 : 0;
  const antennaGlow =
    mood === "alert" ? "#ff7b85" : mood === "happy" ? "#3fd79a" : "#5aa8ff";

  return (
    <div
      style={{
        pointerEvents: "none",
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: "linear-gradient(135deg,#1665ea,#4b93ff)",
        display: "grid",
        placeItems: "center",
        boxShadow: `0 ${size * 0.16}px ${size * 0.34}px rgba(22,101,234,.38)`,
      }}
    >
      <svg
        width={size * 0.62}
        height={size * 0.62}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="12" cy="3.2" r="1.15" fill={antennaGlow} />
        <path
          d="M12 4.3v2"
          stroke="#eaf2ff"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        <rect x="4.2" y="6.6" width="15.6" height="13" rx="4" fill="#eaf2ff" />
        <rect
          x="4.2"
          y="6.6"
          width="15.6"
          height="13"
          rx="4"
          stroke="#c9d9f8"
          strokeWidth="0.4"
        />

        <rect x="0.6" y="11.4" width="2.1" height="4.4" rx="1" fill="#eaf2ff" />
        <rect
          x="21.3"
          y="11.4"
          width="2.1"
          height="4.4"
          rx="1"
          fill="#eaf2ff"
        />

        <rect
          x="6.4"
          y="9.2"
          width="11.2"
          height="8.6"
          rx="3"
          fill="#0d1b33"
          transform={`rotate(${browTilt} 12 13.5)`}
        />

        <ellipse
          cx="9.4"
          cy="12.6"
          rx={eyeShape.rx}
          ry={eyeShape.ry}
          fill={eyeColor}
        />
        <ellipse
          cx="14.6"
          cy="12.6"
          rx={eyeShape.rx}
          ry={eyeShape.ry}
          fill={eyeColor}
        />
        <circle cx="9.05" cy="12.15" r="0.32" fill="#ffffff" />
        <circle cx="14.25" cy="12.15" r="0.32" fill="#ffffff" />

        <path
          d={mouth}
          stroke={eyeColor}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />

        <rect
          x="9.4"
          y="18.6"
          width="5.2"
          height="1.4"
          rx="0.7"
          fill="#c9d9f8"
        />
      </svg>
    </div>
  );
}

/* ---------- Genererer et kontekstuelt råd baseret på eksisterende data ---------- */
function buildAdviceTip({
  copy,
  user,
  spacedData,
  importedQuestions,
  questionOverrides,
  streakData,
  history,
  pomodoroLog,
  studyPlans,
}) {
  if (!user) return null;
  const todayIso = todayIsoKey();
  const streak = computeStreak(streakData.days || []);
  const allQ = getFullQuestionBank(importedQuestions, questionOverrides).filter(
    (q) => q.moduleId === user.module
  );
  const scoped = allQ.length
    ? allQ
    : getFullQuestionBank(importedQuestions, questionOverrides);
  const dueCount = scoped.filter(
    (q) => spacedData[q.id] && isDue(spacedData[q.id])
  ).length;
  const newCount = scoped.filter((q) => !spacedData[q.id]).length;
  const lastAccuracy = history.length
    ? history[history.length - 1].score || 0
    : null;
  const todayPomodoros = pomodoroLog[todayIso] || 0;
  const plan = studyPlans[user.module];

  const candidates = [];

  if (dueCount > 0)
    candidates.push({ priority: 5, text: copy.adviceReview(dueCount) });
  if (plan && plan.examDate) {
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(plan.examDate + "T00:00:00") - new Date()) / 86400000)
    );
    if (daysLeft > 0 && daysLeft <= 10)
      candidates.push({ priority: 4, text: copy.adviceExamSoon(daysLeft) });
  }
  if (lastAccuracy !== null && lastAccuracy < 70)
    candidates.push({
      priority: 4,
      text: copy.adviceLowAccuracy(lastAccuracy),
    });
  if (streak.current === 0)
    candidates.push({ priority: 3, text: copy.adviceStreakZero });
  if (!plan) candidates.push({ priority: 3, text: copy.adviceNoPlan });
  if (newCount > 0)
    candidates.push({ priority: 2, text: copy.adviceNew(newCount) });
  if (todayPomodoros === 0)
    candidates.push({ priority: 1, text: copy.adviceNoPomodoroToday });

  if (!candidates.length)
    return { text: copy.adviceAllCaughtUp, type: "advice" };

  candidates.sort((a, b) => b.priority - a.priority);
  return { text: candidates[0].text, type: "advice" };
}

/* ---------- Genererer et fakta trukket fra MCQ-databasen for det aktive modul ----------
   Bruger getFullQuestionBank, som allerede inkluderer importerede/nye spørgsmål
   og gemte overrides, så nye tilføjelser automatisk kan indgå i faktaene. */
function buildModuleFact({
  copy,
  user,
  importedQuestions,
  questionOverrides,
  language,
}) {
  const bank = getFullQuestionBank(importedQuestions, questionOverrides).filter(
    (q) => q.moduleId === user.module
  );
  if (!bank.length) return copy.factNone;
  const pick = bank[Math.floor(Math.random() * bank.length)];
  const category = translate(pick.category, language, "da");
  const explanation = translate(pick.explanation, language, "da");
  return copy.factTemplate(category, explanation);
}

/* ---------- Genererer en plan-anbefaling baseret på due/nye spørgsmål og studieplan ---------- */
function buildPlanRecommendation({
  copy,
  user,
  spacedData,
  importedQuestions,
  questionOverrides,
  studyPlans,
}) {
  const bank = getFullQuestionBank(importedQuestions, questionOverrides).filter(
    (q) => q.moduleId === user.module
  );
  const due = bank.filter(
    (q) => spacedData[q.id] && isDue(spacedData[q.id])
  ).length;
  const fresh = bank.filter((q) => !spacedData[q.id]).length;
  const plan = studyPlans[user.module];

  if (plan && plan.examDate) {
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(plan.examDate + "T00:00:00") - new Date()) / 86400000)
    );
    if (daysLeft > 0 && daysLeft <= 7) return copy.planExamSoon(daysLeft);
  }
  if (due > 0) return copy.planReview(due);
  if (fresh > 0) return copy.planNew(fresh);
  if (!plan) return copy.planNoPlan;
  return copy.planAllGood;
}

function useMascotEngine({
  user,
  language,
  spacedData,
  importedQuestions,
  questionOverrides,
}) {
  const [mascotState, setMascotState] = useStoredState(STORAGE.mascotState, {
    records: {
      bestStreak: 0,
      bestAccuracy: 0,
      totalQuestionsSeen: 0,
      bestPomodoroDay: 0,
    },
    lastCheckinDate: null,
    lastSeenDate: null,
    queue: [],
  });

  const [streakData] = useStoredState(STORAGE.streak, { days: [] });
  const [history] = useStoredState(STORAGE.quizHistory, []);
  const [pomodoroLog] = useStoredState(STORAGE.pomodoroLog, {});
  const [studyPlans] = useStoredState(STORAGE.studyPlans, {});

  const copy = MASCOT_COPY[language] || MASCOT_COPY.da;

  useEffect(() => {
    if (!user) return;
    const todayIso = todayIsoKey();
    const streak = computeStreak(streakData.days);
    const totalQuestionsAnswered = history.reduce(
      (sum, s) => sum + (s.answered || 0),
      0
    );
    const bestSessionAccuracy = history.reduce(
      (best, s) => Math.max(best, s.score || 0),
      0
    );
    const todayPomodoros = pomodoroLog[todayIso] || 0;
    const sortedDays = [...(streakData.days || [])].sort();
    const lastActivityIso = sortedDays.length
      ? sortedDays[sortedDays.length - 1]
      : null;

    const newTips = [];
    const records = { ...mascotState.records };

    if (streak.current > 2 && streak.current > records.bestStreak) {
      records.bestStreak = streak.current;
      newTips.push({
        id: `streak-${streak.current}-${todayIso}`,
        text: copy.recordStreak(streak.current),
        type: "record",
      });
    }
    if (bestSessionAccuracy > 0 && bestSessionAccuracy > records.bestAccuracy) {
      records.bestAccuracy = bestSessionAccuracy;
      newTips.push({
        id: `acc-${bestSessionAccuracy}-${todayIso}`,
        text: copy.recordAccuracy(bestSessionAccuracy),
        type: "record",
      });
    }
    if (
      totalQuestionsAnswered > 0 &&
      totalQuestionsAnswered - records.totalQuestionsSeen >= 25
    ) {
      records.totalQuestionsSeen = totalQuestionsAnswered;
      newTips.push({
        id: `q-${totalQuestionsAnswered}`,
        text: copy.recordQuestions(totalQuestionsAnswered),
        type: "record",
      });
    }
    if (todayPomodoros > 0 && todayPomodoros > records.bestPomodoroDay) {
      records.bestPomodoroDay = todayPomodoros;
      newTips.push({
        id: `pomo-${todayPomodoros}-${todayIso}`,
        text: copy.recordPomodoro(todayPomodoros),
        type: "record",
      });
    }

    if (lastActivityIso && lastActivityIso !== todayIso) {
      const gap = daysBetween(lastActivityIso, todayIso);
      if (gap >= 3 && mascotState.lastSeenDate !== todayIso) {
        newTips.push({
          id: `inactive-${todayIso}`,
          text: copy.inactive(gap),
          type: "inactive",
        });
      }
    }

    if (mascotState.lastCheckinDate !== todayIso) {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        const plan = studyPlans[user.module];
        if (plan) {
          const lectures = MODULE_LECTURES
            ? MODULE_LECTURES[user.module] || []
            : [];
          const pendingLectures = lectures.filter(
            (l) => !(plan.doneLectureIds || []).includes(l.id)
          );
          const allQ = getFullQuestionBank(
            importedQuestions,
            questionOverrides
          ).filter((q) => q.moduleId === user.module);
          const dueToday = allQ.filter(
            (q) => spacedData[q.id] && isDue(spacedData[q.id])
          ).length;
          const goalCount =
            plan.mode === "questions"
              ? Math.max(1, dueToday)
              : Math.max(1, pendingLectures.length > 0 ? 1 : 0);
          const isExceptionDayToday = (plan.excludedDates || []).includes(
            todayIso
          );
          if (isExceptionDayToday) {
            newTips.push({
              id: `exception-${todayIso}`,
              text: copy.adviceExceptionDayToday,
              type: "morning",
            });
          } else {
            newTips.push({
              id: `morning-${todayIso}`,
              text: copy.morningGreetingWithGoal(user.name, goalCount),
              type: "morning",
            });
          }
          if (plan.examDate) {
            const daysLeft = Math.max(
              0,
              Math.ceil(
                (new Date(plan.examDate + "T00:00:00") - new Date()) / 86400000
              )
            );
            if (daysLeft > 0 && daysLeft <= 7) {
              newTips.push({
                id: `exam-${todayIso}`,
                text: copy.examCountdown(daysLeft),
                type: "morning",
              });
            }
          }
          if (
            plan.mode === "lectures" &&
            lectures.length > 0 &&
            plan.examDate &&
            plan.createdAt
          ) {
            const planToday = new Date();
            planToday.setHours(0, 0, 0, 0);
            const planExamDate = new Date(plan.examDate + "T00:00:00");
            const totalPlanDays = Math.max(
              1,
              Math.ceil((planExamDate - new Date(plan.createdAt)) / 86400000)
            );
            const daysSinceCreated = Math.max(
              1,
              Math.ceil((planToday - new Date(plan.createdAt)) / 86400000)
            );
            const expectedFraction = Math.min(
              1,
              daysSinceCreated / totalPlanDays
            );
            const actualFraction =
              (plan.doneLectureIds || []).length / lectures.length;
            const behind =
              actualFraction < expectedFraction - 0.08 &&
              planExamDate > planToday;
            if (behind) {
              newTips.push({
                id: `behind-${todayIso}`,
                text: copy.adviceBehindSchedule,
                type: "morning",
              });
            }
          }
        } else {
          newTips.push({
            id: `morning-noplan-${todayIso}`,
            text: copy.morningGreetingNoGoal(user.name),
            type: "morning",
          });
        }
      }
    }

    if (
      newTips.length ||
      records.bestStreak !== mascotState.records.bestStreak
    ) {
      setMascotState((prev) => ({
        ...prev,
        records,
        lastSeenDate: todayIso,
        lastCheckinDate: newTips.some((t) => t.type === "morning")
          ? todayIso
          : prev.lastCheckinDate,
        queue: [
          ...prev.queue,
          ...newTips.filter((t) => !prev.queue.some((q) => q.id === t.id)),
        ],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.module,
    streakData.days.length,
    history.length,
    JSON.stringify(pomodoroLog),
  ]);

  function dismissCurrent() {
    setMascotState((prev) => ({ ...prev, queue: prev.queue.slice(1) }));
  }

  function requestAdvice() {
    return buildAdviceTip({
      copy,
      user,
      spacedData,
      importedQuestions,
      questionOverrides,
      streakData,
      history,
      pomodoroLog,
      studyPlans,
    });
  }

  const currentTip = mascotState.queue[0] || null;
  return { currentTip, dismissCurrent, requestAdvice };
}

/* ---------- Tre-boble intro-sekvens ved hvert sideload ----------
   1) Velkomst  2) Modul-fakta (fra MCQ-databasen, inkl. nye/importerede)
   3) Plan-anbefaling. Kører automatisk hver gang komponenten mountes. */

/* ---------- Altid-synlig flydende mascot i nederste højre hjørne ----------
   Klik åbner enten en ventende kontekstuel besked (rekord/inaktivitet/
   morgen-check-in) eller — hvis ingen findes — genererer et råd på
   stedet baseret på eksisterende data (forfaldne spørgsmål, streak,
   seneste nøjagtighed, studieplan, pomodoro-brug i dag osv.). */
function MascotAssistant({
  c,
  user,
  language,
  tutorialActive,
  spacedData,
  importedQuestions,
  questionOverrides,
  onNavigate,
  hidden = false,
}) {
  const { currentTip, dismissCurrent, requestAdvice } = useMascotEngine({
    user,
    language,
    spacedData,
    importedQuestions,
    questionOverrides,
  });
  const [studyPlans] = useStoredState(STORAGE.studyPlans, {});
  const copy = MASCOT_COPY[language] || MASCOT_COPY.da;
  const introCopy = MASCOT_INTRO_COPY[language] || MASCOT_INTRO_COPY.da;

  const [open, setOpen] = useState(false);
  const [activeMessage, setActiveMessage] = useState(null);
  const [introStage, setIntroStage] = useState(0);
  const timersRef = useRef([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function showIntroStage(stage) {
    clearTimers();
    setIntroStage(stage);

    if (stage === 1) {
      setActiveMessage({
        text: introCopy.welcome(user.name),
        mood: "happy",
        showActions: false,
        fromQueue: false,
      });
      setOpen(true);
      timersRef.current.push(setTimeout(() => showIntroStage(2), 4200));
    } else if (stage === 2) {
      setActiveMessage({
        text: buildModuleFact({
          copy: introCopy,
          user,
          importedQuestions,
          questionOverrides,
          language,
        }),
        mood: "default",
        showActions: false,
        fromQueue: false,
      });
      timersRef.current.push(setTimeout(() => showIntroStage(3), 4200));
    } else if (stage === 3) {
      setActiveMessage({
        text: buildPlanRecommendation({
          copy: introCopy,
          user,
          spacedData,
          importedQuestions,
          questionOverrides,
          studyPlans,
        }),
        mood: "alert",
        showActions: true,
        fromQueue: false,
      });
      timersRef.current.push(
        setTimeout(() => {
          setOpen(false);
          setActiveMessage(null);
          setIntroStage(0);
        }, 6200)
      );
    }
  }

  const introPlayedRef = useRef(false);

  useEffect(() => {
    if (!user || tutorialActive) return;
    if (introPlayedRef.current) return;
    let alreadyPlayed = false;
    try {
      alreadyPlayed =
        sessionStorage.getItem("medlearn-mascot-intro-played") === "1";
    } catch {
      alreadyPlayed = false;
    }
    if (alreadyPlayed) {
      introPlayedRef.current = true;
      return;
    }
    introPlayedRef.current = true;
    try {
      sessionStorage.setItem("medlearn-mascot-intro-played", "1");
    } catch {
      // Ignorer browser storage-fejl.
    }
    clearTimers();
    timersRef.current.push(setTimeout(() => showIntroStage(1), 500));
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name, tutorialActive]);

  useEffect(() => {
    if (hidden) {
      clearTimers();
      setOpen(false);
      setActiveMessage(null);
      setIntroStage(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  if (tutorialActive || !user || hidden) return null;

  function handleBubbleTap() {
    if (introStage > 0 && introStage < 3) {
      showIntroStage(introStage + 1);
    }
  }

  function handleIconTap() {
    if (open) {
      setOpen(false);
      return;
    }
    clearTimers();
    setIntroStage(0);
    if (currentTip) {
      setActiveMessage({
        text: currentTip.text,
        type: currentTip.type,
        showActions: true,
        fromQueue: true,
      });
    } else {
      setActiveMessage({
        ...requestAdvice(),
        showActions: true,
        fromQueue: false,
      });
    }
    setOpen(true);
  }

  function handleDismiss() {
    clearTimers();
    if (activeMessage?.fromQueue) dismissCurrent();
    setOpen(false);
    setActiveMessage(null);
    setIntroStage(0);
  }

  const mood =
    activeMessage?.mood ||
    (activeMessage?.type === "record"
      ? "happy"
      : activeMessage?.type === "inactive"
      ? "alert"
      : "default");

  return (
    <div
      style={{
        position: "fixed",
        insetInlineEnd: 24,
        bottom: 24,
        zIndex: 998,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 12,
        maxWidth: "calc(100vw - 48px)",
      }}
    >
      {open && activeMessage && (
        <div
          className="fade-up"
          onClick={
            introStage > 0 && introStage < 3 ? handleBubbleTap : undefined
          }
          style={{
            width: 300,
            padding: "16px 18px",
            borderRadius: 20,
            background: c.panel,
            border: `1px solid ${c.border}`,
            boxShadow: c.shadowLg,
            position: "relative",
            cursor: introStage > 0 && introStage < 3 ? "pointer" : "default",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: -8,
              insetInlineEnd: 22,
              width: 16,
              height: 16,
              background: c.panel,
              borderInlineEnd: `1px solid ${c.border}`,
              borderBottom: `1px solid ${c.border}`,
              transform: "rotate(45deg)",
            }}
          />
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                flexShrink: 0,
                transform: "scale(0.5)",
                transformOrigin: "top left",
                width: 36,
              }}
            >
              <MascotAvatar size={72} mood={mood} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: ".04em",
                  textTransform: "uppercase",
                  color: c.muted,
                  marginBottom: 4,
                }}
              >
                {copy.name}
              </div>
              <p
                style={{
                  margin: 0,
                  color: c.text,
                  fontSize: 12.5,
                  lineHeight: 1.55,
                }}
              >
                {activeMessage.text}
              </p>
            </div>
          </div>

          {introStage > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
              {[1, 2, 3].map((i) => (
                <span
                  key={i}
                  onClick={(event) => {
                    event.stopPropagation();
                    showIntroStage(i);
                  }}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 99,
                    background: i <= introStage ? c.blue : c.border,
                    transition: "background 200ms ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          )}

          {introStage > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                marginTop: 12,
              }}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  if (introStage > 1) showIntroStage(introStage - 1);
                }}
                disabled={introStage <= 1}
                style={{
                  height: 32,
                  padding: "0 12px",
                  border: `1px solid ${c.borderStrong}`,
                  borderRadius: 9,
                  background: "transparent",
                  color: introStage <= 1 ? c.muted : c.text,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: introStage <= 1 ? "default" : "pointer",
                  opacity: introStage <= 1 ? 0.45 : 1,
                }}
              >
                {copy.back}
              </button>
              {introStage < 3 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    showIntroStage(introStage + 1);
                  }}
                  style={{
                    height: 32,
                    padding: "0 14px",
                    border: 0,
                    borderRadius: 9,
                    background: "linear-gradient(135deg,#1665ea,#4b93ff)",
                    color: "#fff",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copy.next}
                </button>
              )}
            </div>
          )}

          {activeMessage.showActions && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                marginTop: 12,
              }}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleDismiss();
                }}
                style={{
                  border: 0,
                  background: "transparent",
                  color: c.secondary,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: "6px 8px",
                }}
              >
                {copy.dismiss}
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDismiss();
                    onNavigate("mcq");
                  }}
                  style={{
                    height: 34,
                    padding: "0 14px",
                    border: 0,
                    borderRadius: 10,
                    background: "linear-gradient(135deg,#1665ea,#4b93ff)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {copy.start}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleIconTap}
        title={copy.tapHint}
        className={!open ? "pulse-soft" : ""}
        style={{
          position: "relative",
          border: 0,
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          lineHeight: 0,
        }}
      >
        <MascotAvatar size={62} mood="default" />
        {currentTip && !open && (
          <span
            style={{
              position: "absolute",
              top: -2,
              insetInlineEnd: 6,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: c.red,
              border: `2px solid ${c.page}`,
            }}
          />
        )}
      </button>
    </div>
  );
}

function TutorialOverlay({ c, t, language, route, setRoute, onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const copy =
    {
      da: {
        skip: "Spring over",
        next: "Videre",
        back: "Tilbage",
        done: "Forstået",
        mascotName: "Dr. Byte",
        steps: [
          {
            route: "home",
            title: "Hej, jeg er Dr. Byte!",
            text: "Jeg viser dig rundt i MedLearn på et minut. Klik videre, når du er klar.",
          },
          {
            route: "home",
            title: "Kliniske MCQ\u2019er",
            text: "På forsiden finder du kortet til kliniske MCQ\u2019er, hvor du øver eksamenslignende spørgsmål organiseret efter modul og forelæsning.",
          },
          {
            route: "mcq",
            title: "Sådan fungerer det",
            text: "Vælg et emne, sæt en session i gang, og få direkte feedback med forklaringer efter hvert spørgsmål.",
          },
          {
            route: "home",
            title: "Indsigter",
            text: "Indsigter-kortet på forsiden viser din fremgang: samlet score, antal besvarede spørgsmål og sessioner.",
          },
          {
            route: "insights",
            title: "Dine tal",
            text: "Her ser du din samlede score, antal besvarede spørgsmål, og hvor mange sessioner du har gennemført.",
          },
          {
            route: "insights",
            title: "Udvikling over tid",
            text: "Grafen på siden viser din udvikling dag for dag, så du nemt kan se, hvor du forbedrer dig.",
          },
          {
            route: "insights",
            title: "Naviger rundt",
            text: "Brug menuen til venstre til at skifte mellem hjem, MCQ\u2019er, notesbog, kalender og din profil.",
          },
          {
            route: "insights",
            title: "Fokusuret",
            text: "Oppe i toppen kan du starte en fokus-session med Pomodoro-teknikken, når du skal koncentrere dig.",
          },
          {
            route: "home",
            title: "Sådan var det!",
            text: "Du er nu klar til at komme i gang. God fornøjelse med at læse!",
          },
        ],
      },
      en: {
        skip: "Skip",
        next: "Next",
        back: "Back",
        done: "Got it",
        mascotName: "Dr. Byte",
        steps: [
          {
            route: "home",
            title: "Hi, I'm Dr. Byte!",
            text: "I'll show you around MedLearn in a minute. Click next whenever you're ready.",
          },
          {
            route: "home",
            title: "Clinical MCQs",
            text: "On the home screen you'll find the Clinical MCQs card, where you practice exam-style questions organized by module and lecture.",
          },
          {
            route: "mcq",
            title: "How it works",
            text: "Choose a topic, start a session, and get instant feedback with explanations after each question.",
          },
          {
            route: "home",
            title: "Insights",
            text: "The Insights card on the home screen tracks your progress: overall score, questions answered, and sessions completed.",
          },
          {
            route: "insights",
            title: "Your numbers",
            text: "Here you can see your overall score, how many questions you've answered, and sessions completed.",
          },
          {
            route: "insights",
            title: "Progress over time",
            text: "The graph on this page shows your development day by day, so you can easily see where you're improving.",
          },
          {
            route: "insights",
            title: "Navigate around",
            text: "Use the menu on the left to switch between home, MCQs, notebook, calendar, and your profile.",
          },
          {
            route: "insights",
            title: "Focus timer",
            text: "Up top you can start a focus session using the Pomodoro technique whenever you need to concentrate.",
          },
          {
            route: "home",
            title: "That's it!",
            text: "You're all set to get started. Happy studying!",
          },
        ],
      },
      ar: {
        skip: "تخطي",
        next: "التالي",
        back: "رجوع",
        done: "فهمت",
        mascotName: "د. بايت",
        steps: [
          {
            route: "home",
            title: "مرحبًا، أنا د. بايت!",
            text: "سأدلك على تطبيق MedLearn في دقيقة واحدة. اضغط للمتابعة عندما تكون جاهزًا.",
          },
          {
            route: "home",
            title: "أسئلة سريرية متعددة الخيارات",
            text: "في الشاشة الرئيسية ستجد بطاقة الأسئلة السريرية، حيث تتدرب على أسئلة شبيهة بالامتحان منظمة حسب الوحدة والمحاضرة.",
          },
          {
            route: "mcq",
            title: "كيف يعمل",
            text: "اختر موضوعًا، ابدأ جلسة، واحصل على تغذية راجعة فورية مع تفسيرات بعد كل سؤال.",
          },
          {
            route: "home",
            title: "الإحصاءات",
            text: "بطاقة الإحصاءات في الشاشة الرئيسية تتابع تقدمك: النتيجة الإجمالية، الأسئلة المُجابة، والجلسات المكتملة.",
          },
          {
            route: "insights",
            title: "أرقامك",
            text: "هنا يمكنك رؤية نتيجتك الإجمالية، عدد الأسئلة المُجابة، والجلسات المكتملة.",
          },
          {
            route: "insights",
            title: "التقدم عبر الزمن",
            text: "يوضح الرسم البياني في هذه الصفحة تطورك يوميًا، لترى بسهولة أين تتحسن.",
          },
          {
            route: "insights",
            title: "التنقل",
            text: "استخدم القائمة على اليسار للتبديل بين الرئيسية والأسئلة ودفتر الملاحظات والتقويم وملفك الشخصي.",
          },
          {
            route: "insights",
            title: "مؤقت التركيز",
            text: "في الأعلى يمكنك بدء جلسة تركيز بتقنية بومودورو عندما تحتاج إلى التركيز.",
          },
          {
            route: "home",
            title: "هذا كل شيء!",
            text: "أنت جاهز للانطلاق. أتمنى لك دراسة موفقة!",
          },
        ],
      },
    }[language] || {};

  const steps = copy.steps || [];
  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!step) return;
    if (route !== step.route) setRoute(step.route);
  }, [stepIndex]);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  if (!step) return null;

  return (
    <div
      style={{
        position: "fixed",
        insetInlineEnd: 24,
        bottom: 24,
        zIndex: 999,
        display: "flex",
        alignItems: "flex-end",
        gap: 14,
        maxWidth: "calc(100vw - 48px)",
        pointerEvents: "none",
      }}
    >
      <div
        className={visible ? "fade-up" : ""}
        style={{
          pointerEvents: "auto",
          width: 300,
          padding: "18px 20px",
          borderRadius: 20,
          background: c.panel,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadowLg,
          position: "relative",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 22,
            insetInlineEnd: -9,
            width: 18,
            height: 18,
            background: c.panel,
            borderInlineEnd: `1px solid ${c.border}`,
            borderBottom: `1px solid ${c.border}`,
            transform: "rotate(-45deg)",
          }}
        />
        <div style={{ display: "flex", gap: 5, marginBottom: 12 }}>
          {steps.map((_, i) => (
            <span
              key={i}
              style={{
                height: 4,
                flex: 1,
                borderRadius: 4,
                background: i <= stepIndex ? c.accent || c.text : c.border,
                opacity: i <= stepIndex ? 1 : 0.6,
              }}
            />
          ))}
        </div>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 800,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            color: c.muted,
            marginBottom: 4,
          }}
        >
          {copy.mascotName}
        </div>
        <h3 style={{ margin: 0, color: c.text, fontSize: 15, fontWeight: 800 }}>
          {step.title}
        </h3>
        <p
          style={{
            margin: "8px 0 0",
            color: c.secondary,
            fontSize: 12.5,
            lineHeight: 1.55,
          }}
        >
          {step.text}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
            gap: 8,
          }}
        >
          <button
            type="button"
            onClick={onFinish}
            style={{
              border: 0,
              background: "transparent",
              color: c.muted,
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {copy.skip}
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {!isFirst && (
              <button
                type="button"
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                style={{
                  height: 36,
                  padding: "0 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  borderRadius: 11,
                  border: `1px solid ${c.borderStrong}`,
                  background: "transparent",
                  color: c.text,
                  cursor: "pointer",
                }}
              >
                {copy.back}
              </button>
            )}
            <PrimaryButton
              onClick={() => (isLast ? onFinish() : setStepIndex((i) => i + 1))}
              style={{ height: 36, padding: "0 16px", fontSize: 12 }}
            >
              {isLast ? copy.done : copy.next}
            </PrimaryButton>
          </div>
        </div>
      </div>

      <MascotAvatar size={64} mood="default" />
    </div>
  );
}

export default function useSupabaseSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return session;
}

function AuthScreen({ c, t, language, theme }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);

  const copy =
    {
      da: {
        loginTitle: "Log ind på MedLearn",
        signupTitle: "Opret en konto",
        email: "E-mail",
        password: "Adgangskode",
        loginButton: "Log ind",
        signupButton: "Opret konto",
        switchToSignup: "Har du ikke en konto? Opret en her",
        switchToLogin: "Har du allerede en konto? Log ind her",
        signupSuccess: "Konto oprettet. Bekræft din e-mail for at logge ind.",
        genericError:
          "Noget gik galt. Kontrollér dine oplysninger og prøv igen.",
      },
      en: {
        loginTitle: "Log in to MedLearn",
        signupTitle: "Create an account",
        email: "Email",
        password: "Password",
        loginButton: "Log in",
        signupButton: "Create account",
        switchToSignup: "Don't have an account? Sign up here",
        switchToLogin: "Already have an account? Log in here",
        signupSuccess: "Account created. Confirm your email to log in.",
        genericError: "Something went wrong. Check your details and try again.",
      },
      ar: {
        loginTitle: "تسجيل الدخول إلى MedLearn",
        signupTitle: "إنشاء حساب",
        email: "البريد الإلكتروني",
        password: "كلمة المرور",
        loginButton: "تسجيل الدخول",
        signupButton: "إنشاء حساب",
        switchToSignup: "ليس لديك حساب؟ أنشئ حسابًا هنا",
        switchToLogin: "لديك حساب بالفعل؟ سجل الدخول هنا",
        signupSuccess:
          "تم إنشاء الحساب. يرجى تأكيد بريدك الإلكتروني لتسجيل الدخول.",
        genericError: "حدث خطأ ما. تحقق من بياناتك وحاول مرة أخرى.",
      },
    }[language] || {};

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setInfoMessage(null);
    setLoading(true);
    try {
      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        setInfoMessage(copy.signupSuccess);
      }
    } catch (submitError) {
      setError(submitError.message || copy.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: c.background,
        padding: 20,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          padding: 28,
          borderRadius: 20,
          background: c.panel,
          border: `1px solid ${c.border}`,
          boxShadow: c.shadow,
          display: "grid",
          gap: 14,
        }}
      >
        <div
          style={{
            color: c.text,
            fontSize: 20,
            fontWeight: 800,
            textAlign: "center",
          }}
        >
          {mode === "login" ? copy.loginTitle : copy.signupTitle}
        </div>

        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: c.secondary,
              display: "block",
              marginBottom: 4,
            }}
          >
            {copy.email}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 10,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.text,
              fontSize: 14,
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: c.secondary,
              display: "block",
              marginBottom: 4,
            }}
          >
            {copy.password}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{
              width: "100%",
              height: 44,
              padding: "0 12px",
              borderRadius: 10,
              border: `1px solid ${c.border}`,
              background: c.soft,
              color: c.text,
              fontSize: 14,
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              background: c.redSoft,
              color: c.red,
              fontSize: 12,
              fontWeight: 650,
            }}
          >
            {error}
          </div>
        )}

        {infoMessage && (
          <div
            style={{
              padding: "9px 12px",
              borderRadius: 10,
              background: c.greenSoft,
              color: c.green,
              fontSize: 12,
              fontWeight: 650,
            }}
          >
            {infoMessage}
          </div>
        )}

        <PrimaryButton
          onClick={handleSubmit}
          disabled={loading}
          style={{ width: "100%" }}
        >
          {loading
            ? "..."
            : mode === "login"
            ? copy.loginButton
            : copy.signupButton}
        </PrimaryButton>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setInfoMessage(null);
          }}
          style={{
            background: "transparent",
            border: 0,
            color: c.blue,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          {mode === "login" ? copy.switchToSignup : copy.switchToLogin}
        </button>
      </form>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useStoredState(STORAGE.theme, "light");
  const [language, setLanguage] = useStoredState(STORAGE.language, "da");
  const [user, setUser] = useStoredState(STORAGE.user, null);
  const session = useSupabaseSession();
  useCloudSync(session?.user?.id);
  const [preferences, setPreferences] = useStoredState(STORAGE.preferences, {
    questionSize: 18,
    sound: true,
  });

  // State is local and synchronous; avoid an artificial loading screen on every visit.
  const [stage, setStage] = useState(() => (user ? "app" : "onboarding"));
  const [leaving, setLeaving] = useState(false);
  const [route, setRoute] = useState("home");
  const [notesOpen, setNotesOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarClosing, setCalendarClosing] = useState(false);

  function closeCalendarWithAnimation() {
    setCalendarClosing(true);
    setTimeout(() => {
      setCalendarOpen(false);
      setCalendarClosing(false);
    }, 220);
  }
  const [drByteOpen, setDrByteOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [spacedData, setSpacedData] = useStoredState(
    STORAGE.spacedRepetition,
    {}
  );
  const [deckSettingsById] = useStoredState(STORAGE.deckSettings, {
    default: SM2_DEFAULT_DECK_SETTINGS,
  });
  const deckSettingsFor = (deckId) =>
    deckSettingsById[deckId] ||
    deckSettingsById.default ||
    SM2_DEFAULT_DECK_SETTINGS;
  const [importedQuestions, setImportedQuestions] = useStoredState(
    STORAGE.importedQuestions,
    []
  );
  const [questionOverrides, setQuestionOverrides] = useStoredState(
    STORAGE.questionOverrides,
    {}
  );
  const [buriedCards, setBuriedCards] = useStoredState(STORAGE.buriedCards, {});
  const [sessionScope, setSessionScope] = useState(null);
  const [lectureMenu, setLectureMenu] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tutorialActive, setTutorialActive] = useState(false);
  const [fsOverlayVisible, setFsOverlayVisible] = useState(false);
  const [fsClock, setFsClock] = useState("");
  const [battery, setBattery] = useState(null);
  const fsHideTimerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    function handleFsChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) {
      setFsOverlayVisible(false);
      return undefined;
    }

    function handleMouseMove(event) {
      if (event.clientY <= 12) {
        setFsOverlayVisible(true);
        if (fsHideTimerRef.current) clearTimeout(fsHideTimerRef.current);
      } else if (event.clientY > 90) {
        if (fsHideTimerRef.current) clearTimeout(fsHideTimerRef.current);
        fsHideTimerRef.current = setTimeout(
          () => setFsOverlayVisible(false),
          900
        );
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (fsHideTimerRef.current) clearTimeout(fsHideTimerRef.current);
    };
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return undefined;
    function updateFsClock() {
      setFsClock(
        new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
    updateFsClock();
    const interval = setInterval(updateFsClock, 1000);
    return () => clearInterval(interval);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return undefined;
    let battRef = null;
    if (navigator.getBattery) {
      navigator.getBattery().then((batt) => {
        battRef = batt;
        const update = () =>
          setBattery({ level: batt.level, charging: batt.charging });
        update();
        batt.addEventListener("levelchange", update);
        batt.addEventListener("chargingchange", update);
      });
    }
    return () => {
      if (battRef) {
        battRef.removeEventListener?.("levelchange", () => {});
        battRef.removeEventListener?.("chargingchange", () => {});
      }
    };
  }, [isFullscreen]);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  const c = theme === "dark" ? DARK : LIGHT;
  const t = TEXT[language] || TEXT.da;
  const languageData =
    LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];

  function resetProfile() {
    try {
      localStorage.removeItem(STORAGE.user);
    } catch {
      // Ignorer.
    }

    setUser(null);
    setRoute("home");
    setModal(null);
    setStage("onboarding");
  }

  // Kræver et bekræftet Supabase-login, før appen overhovedet viser
  // onboarding eller det almindelige indhold. "session === undefined"
  // betyder at Supabase stadig tjekker for en eksisterende session
  // (fx efter en genindlæsning), så vi viser en tom skærm et kort øjeblik
  // i stedet for fejlagtigt at vise login-skærmen.
  if (session === undefined) {
    return (
      <>
        <GlobalStyles />
        <Loader
          c={c}
          t={t}
          leaving={false}
          theme={theme}
          moduleId={user?.module}
        />
      </>
    );
  }

  if (!session) {
    return (
      <>
        <GlobalStyles />
        <AuthScreen c={c} t={t} language={language} theme={theme} />
      </>
    );
  }

  if (stage === "loading") {
    return (
      <>
        <GlobalStyles />
        <Loader
          c={c}
          t={t}
          leaving={leaving}
          theme={theme}
          moduleId={user?.module}
        />
      </>
    );
  }

  if (stage === "onboarding" || !user) {
    return (
      <>
        <GlobalStyles />
        <Onboarding
          c={c}
          t={t}
          language={language}
          theme={theme}
          onComplete={(data) => {
            setUser(data);
            setStage("app");
            setRoute("home");
            setTutorialActive(true);
          }}
        />
      </>
    );
  }

  const sidebarFullBank = getFullQuestionBank(
    importedQuestions,
    questionOverrides
  );
  const sidebarModuleQuestions = user?.module
    ? sidebarFullBank.filter((q) => q.moduleId === user.module)
    : sidebarFullBank;
  const sidebarDueCount = sidebarModuleQuestions.filter(
    (q) => spacedData[q.id] && isDue(spacedData[q.id])
  ).length;

  return (
    <div
      lang={language}
      dir="ltr"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        overflow: "hidden",
        background: c.page,
        position: "relative",
      }}
    >
      <GlobalStyles />
      {theme === "light" && <div className="app-blue-hue" aria-hidden="true" />}
      {theme === "dark" && (
        <div className="app-blue-hue-dark" aria-hidden="true" />
      )}

      {isFullscreen && (
        <div
          className="fs-hover-overlay"
          style={{
            position: "fixed",
            top: fsOverlayVisible ? 14 : -60,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "9px 20px",
            borderRadius: 99,
            background: c.panelAlt,
            border: `1px solid ${c.border}`,
            boxShadow: c.shadowLg,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            opacity: fsOverlayVisible ? 1 : 0,
            pointerEvents: "none",
            transition:
              "top 320ms cubic-bezier(.16,1,.3,1), opacity 320ms ease",
          }}
        >
          <span
            className="clock-gradient-text"
            style={{
              fontFamily: '"Space Mono", "SFMono-Regular", Consolas, monospace',
              fontSize: 15,
              fontWeight: 750,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {fsClock}
          </span>

          {battery && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: c.secondary,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  position: "relative",
                  width: 22,
                  height: 11,
                  border: `1.5px solid ${c.secondary}`,
                  borderRadius: 3,
                  display: "inline-flex",
                  alignItems: "center",
                  padding: 1.5,
                }}
              >
                <span
                  style={{
                    height: "100%",
                    width: `${Math.max(4, Math.round(battery.level * 100))}%`,
                    borderRadius: 1.5,
                    background: battery.charging
                      ? c.green
                      : battery.level < 0.2
                      ? c.red
                      : c.secondary,
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    insetInlineEnd: -3.5,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 2,
                    height: 5,
                    borderRadius: 1,
                    background: c.secondary,
                  }}
                />
              </span>
              {Math.round(battery.level * 100)}%
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        title={isFullscreen ? t.fullscreenExit : t.fullscreenEnter}
        onClick={toggleFullscreen}
        style={{
          position: "absolute",
          bottom: 14,
          insetInlineEnd: 14,
          zIndex: 50,
          width: 30,
          height: 30,
          display: "grid",
          placeItems: "center",
          border: "none",
          background: "transparent",
          color: c.muted,
          opacity: 0.6,
          cursor: "pointer",
        }}
      >
        <Icon name={isFullscreen ? "collapse" : "expand"} size={16} />
      </button>

      <Sidebar
        c={c}
        t={t}
        route={route}
        setRoute={setRoute}
        notesOpen={notesOpen}
        setNotesOpen={setNotesOpen}
        calendarOpen={calendarOpen}
        setCalendarOpen={setCalendarOpen}
        onCloseCalendar={closeCalendarWithAnimation}
        drByteOpen={drByteOpen}
        setDrByteOpen={setDrByteOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
        dueCount={sidebarDueCount}
        onProfileAction={(action) => {
          setProfileOpen(false);
          if (action === "tutorial") {
            setRoute("home");
            setTutorialActive(true);
          } else if (action === "signout") {
            supabase.auth.signOut();
          } else {
            setModal(action);
          }
        }}
      />

      {calendarOpen && (
        <div
          className={
            calendarClosing
              ? "calendar-fullscreen-exit"
              : "calendar-fullscreen-enter"
          }
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            insetInlineStart: 74,
            insetInlineEnd: 0,
            zIndex: 999,
            background: c.panel,
          }}
        >
          <CalendarPanel
            c={c}
            t={t}
            language={language}
            theme={theme}
            module={user?.module}
            onClose={closeCalendarWithAnimation}
          />
        </div>
      )}

      <div
        dir={languageData.dir}
        className="app-surface"
        style={{
          minWidth: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Timer c={c} t={t} language={language} user={user} setUser={setUser} />

        <div
          className="app-main-area"
          style={{
            minHeight: 0,
            flex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          <main
            ref={scrollContainerRef}
            className="content-padding"
            style={{
              minWidth: 0,
              flex: 1,
              overflowY: "auto",
              padding: 38,
            }}
          >
            {route === "home" ? (
              <Dashboard
                c={c}
                t={t}
                user={user}
                language={language}
                spacedData={spacedData}
                onResetAllProgress={setSpacedData}
                importedQuestions={importedQuestions}
                questionOverrides={questionOverrides}
                onNavigate={(target, options) => {
                  if (target === "mcq") {
                    setSessionScope(
                      options && options.contentType
                        ? {
                            moduleId: user.module,
                            groupFilter: null,
                            lectureFilter: null,
                            mode: null,
                            contentType: options.contentType,
                          }
                        : null
                    );
                  }
                  setRoute(target);
                }}
              />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSessionScope(null);
                    setRoute("home");
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginBottom: 19,
                    padding: 0,
                    border: 0,
                    background: "transparent",
                    color: c.secondary,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Icon name="left" size={16} />
                  {t.home}
                </button>

                {route === "insights" ? (
                  <Insights c={c} t={t} language={language} user={user} />
                ) : route === "study-plan" ? (
                  <StudyPlan
                    c={c}
                    language={language}
                    user={user}
                    setUser={setUser}
                  />
                ) : sessionScope ? (
                  <MCQ
                    c={c}
                    t={t}
                    language={language}
                    questionSize={preferences.questionSize}
                    user={user}
                    questionPool={buildQuestionPool(
                      sessionScope,
                      spacedData,
                      importedQuestions,
                      questionOverrides,
                      buriedCards
                    )}
                    sessionScope={sessionScope}
                    buriedCards={buriedCards}
                    setBuriedCards={setBuriedCards}
                    deckSettings={deckSettingsFor(
                      sessionScope?.moduleId || "default"
                    )}
                    onResetProgress={() => {
                      const confirmed = window.confirm(
                        "Nulstil al MCQ-progress? Kortplaner og reviewhistorik slettes."
                      );
                      if (confirmed) {
                        setSpacedData({});
                        setBuriedCards({});
                      }
                      return confirmed;
                    }}
                    onOpenLectureList={() =>
                      setLectureMenu({
                        lecture: sessionScope?.lectureFilter
                          ? (MODULE_LECTURES[sessionScope.moduleId] || []).find(
                              (l) => l.id === sessionScope.lectureFilter
                            )
                          : { id: null, title: t.allTopics },
                        moduleId: sessionScope?.moduleId,
                      })
                    }
                    spacedData={spacedData}
                    setSpacedData={setSpacedData}
                    onExitToOverview={() => {
                      setSessionScope(null);
                      setRoute("mcq");
                    }}
                  />
                ) : (
                  <SessionSetup
                    c={c}
                    t={t}
                    language={language}
                    user={user}
                    spacedData={spacedData}
                    onResetAllProgress={setSpacedData}
                    importedQuestions={importedQuestions}
                    questionOverrides={questionOverrides}
                    onStart={(scope) => setSessionScope(scope)}
                    onCancel={() => setRoute("home")}
                    onOpenLectureMenu={(lecture, moduleId) =>
                      setLectureMenu({ lecture, moduleId })
                    }
                  />
                )}
              </>
            )}
          </main>

          <div
            className={notesOpen ? "notes-open" : ""}
            style={{
              width: notesOpen ? 385 : 0,
              height: "100%",
              flexShrink: 0,
              overflow: "hidden",
              opacity: notesOpen ? 1 : 0,
              transition: "width 280ms ease,opacity 190ms ease",
            }}
          >
            {notesOpen && (
              <Notebook c={c} t={t} onClose={() => setNotesOpen(false)} />
            )}
          </div>

          <div
            className={drByteOpen ? "notes-open" : ""}
            style={{
              width: drByteOpen ? 380 : 0,
              height: "100%",
              flexShrink: 0,
              overflow: "hidden",
              opacity: drByteOpen ? 1 : 0,
              borderInlineStart: drByteOpen ? `1px solid ${c.border}` : "none",
              transition: "width 280ms ease,opacity 190ms ease",
            }}
          >
            {drByteOpen && (
              <DrByteChat
                c={c}
                t={t}
                language={language}
                importedQuestions={importedQuestions}
                questionOverrides={questionOverrides}
                onClose={() => setDrByteOpen(false)}
                onOpenQuestion={(question) => {
                  setDrByteOpen(false);
                  setRoute("mcq");
                  setSessionScope({
                    moduleId: question.moduleId,
                    lectureFilter: question.lectureId || undefined,
                    contentType: question.lectureId ? "lectures" : "examSet",
                    mode: "all",
                    focusQuestionId: question.id,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>

      {modal === "settings" && (
        <SettingsModal
          c={c}
          t={t}
          theme={theme}
          setTheme={setTheme}
          preferences={preferences}
          setPreferences={setPreferences}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "language" && (
        <LanguageModal
          c={c}
          t={t}
          language={language}
          setLanguage={setLanguage}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "admin" && (
        <AdminPortal
          c={c}
          t={t}
          language={language}
          user={user}
          onClose={() => setModal(null)}
        />
      )}

      {lectureMenu && (
        <LectureMenuModal
          c={c}
          t={t}
          language={language}
          lecture={lectureMenu.lecture}
          moduleId={lectureMenu.moduleId}
          spacedData={spacedData}
          setSpacedData={setSpacedData}
          importedQuestions={importedQuestions}
          setImportedQuestions={setImportedQuestions}
          questionOverrides={questionOverrides}
          setQuestionOverrides={setQuestionOverrides}
          buriedCards={buriedCards}
          setBuriedCards={setBuriedCards}
          onClose={() => setLectureMenu(null)}
        />
      )}

      {modal === "logout" && (
        <Modal c={c} onClose={() => setModal(null)}>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              margin: 0,
              color: c.text,
              fontSize: 17,
            }}
          >
            <Icon name="logout" size={18} />
            {t.resetProfileTitle}
          </h2>

          <p
            style={{
              margin: "8px 0 20px",
              color: c.secondary,
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            {t.resetProfileDescription}
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <IconButton
              c={c}
              title={t.cancel}
              onClick={() => setModal(null)}
              style={{
                width: "auto",
                height: 40,
                padding: "0 14px",
                border: `1px solid ${c.borderStrong}`,
                color: c.text,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {t.cancel}
            </IconButton>

            <button
              type="button"
              onClick={resetProfile}
              style={{
                height: 40,
                padding: "0 14px",
                border: 0,
                borderRadius: 11,
                background: c.red,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {t.reset}
            </button>
          </div>
        </Modal>
      )}

      {tutorialActive && (
        <TutorialOverlay
          c={c}
          t={t}
          language={language}
          route={route}
          setRoute={setRoute}
          onFinish={() => setTutorialActive(false)}
        />
      )}

      {preferences.mascotEnabled !== false &&
        route === "home" &&
        !notesOpen &&
        !calendarOpen && (
          <MascotAssistant
            c={c}
            user={user}
            language={language}
            tutorialActive={tutorialActive}
            spacedData={spacedData}
            importedQuestions={importedQuestions}
            questionOverrides={questionOverrides}
            onNavigate={setRoute}
            hidden={drByteOpen}
          />
        )}
    </div>
  );
}
