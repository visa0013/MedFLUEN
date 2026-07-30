/* 
 * MedFLUEN Segment 4.4 — SDU timetable resolver
 * Vercel serverless function. No npm dependency required.
 *
 * GET /api/sdu-timetable?module=K5%20Nervesystem%20og%20psykiatri&term=E26
 *
 * Safety rule: the function only accepts an exact requested term and never
 * falls back to a schedule link belonging to an older semester.
 */

const MODULE_CATALOG = Object.freeze({
  "B1 Celler og væv": {
    code: "B1",
    level: "Bachelor",
    aliases: ["celler og væv", "cells and tissue"],
  },
  "B2 Bevægeapparatet": {
    code: "B2",
    level: "Bachelor",
    aliases: ["bevægeapparatet", "musculoskeletal system"],
  },
  "B3 Molekylær medicin": {
    code: "B3",
    level: "Bachelor",
    aliases: ["molekylær medicin", "molecular medicine"],
  },
  "B4 Genetik": {
    code: "B4",
    level: "Bachelor",
    aliases: ["genetik", "genetics"],
  },
  "B5 Kredsløb og respiration": {
    code: "B5",
    level: "Bachelor",
    aliases: ["kredsløb og respiration", "circulation and respiration"],
  },
  "B6 Ernæring og vækst": {
    code: "B6",
    level: "Bachelor",
    aliases: ["ernæring og vækst", "nutrition and growth", "fordøjelsessystemet", "digestive system"],
  },
  "B7 Reproduktion og farmakodynamik": {
    code: "B7",
    level: "Bachelor",
    aliases: [
      "reproduktion og farmakodynamik",
      "reproduction and pharmacodynamics",
      "endokrinologi reproduktion og toksikologi",
    ],
  },
  "B8 Homeostase": {
    code: "B8",
    level: "Bachelor",
    aliases: ["homeostase", "homeostasis", "nyrefysiologi og farmakologi"],
  },
  "B9 Hjerne og sanser": {
    code: "B9",
    level: "Bachelor",
    aliases: ["hjerne og sanser", "brain and senses"],
  },
  "B10 Angreb og forsvar": {
    code: "B10",
    level: "Bachelor",
    aliases: ["angreb og forsvar", "infection and immunity", "immunologi og mikrobiologi"],
  },
  "B11 Bachelorprojektet": {
    code: "B11",
    level: "Bachelor",
    aliases: ["bachelorprojekt", "bachelorprojektet", "bachelor project"],
  },
  "B12 Fra rask til syg": {
    code: "B12",
    level: "Bachelor",
    aliases: ["fra rask til syg", "from healthy to ill"],
  },
  "K1 Hjerte, lunger og nyrer": {
    code: "K1",
    level: "Kandidat",
    aliases: ["hjerte lunger og nyrer", "hjerte luftveje og ønh", "heart lungs and kidneys"],
  },
  "K2 Bevægeapparatet og bloddannende organer": {
    code: "K2",
    level: "Kandidat",
    aliases: ["bevægeapparatet og bloddannende organer", "musculoskeletal and hematological systems"],
  },
  "K3 Fordøjelseskanalen, ernæring og metabolisme": {
    code: "K3",
    level: "Kandidat",
    aliases: ["fordøjelseskanalen ernæring og metabolisme", "gastrointestinal system nutrition and metabolism"],
  },
  "K5 Nervesystem og psykiatri": {
    code: "K5",
    level: "Kandidat",
    aliases: [
      "nervesystem og psykiatri",
      "nervesystem somatiske og psykiske sygdomme",
      "nervous system somatic and psychiatric disorders",
    ],
  },
  "K6 Retsmedicin, nyrer, urinveje og kræft": {
    code: "K6",
    level: "Kandidat",
    aliases: ["retsmedicin nyrer urinveje og kræft", "forensics kidneys urinary tract and cancer"],
  },
  "K8 Mor og barn": {
    code: "K8",
    level: "Kandidat",
    aliases: ["mor og barn", "kvinde mor og barn", "mother and child"],
  },
  "K9 Hud, øjne, farmakologi og ældre": {
    code: "K9",
    level: "Kandidat",
    aliases: ["hud øjne farmakologi og ældre", "hud øjne anvendt farmakologi og ældre"],
  },
  "K10 Forberedelse til KBU": {
    code: "K10",
    level: "Kandidat",
    aliases: ["forberedelse til kbu", "preparation for internship"],
  },
});

const PROGRAM_SOURCES = Object.freeze({
  Bachelor: {
    publicStructureUrl:
      "https://www.sdu.dk/da/uddannelse/bachelor/medicin-odense/uddannelsens_opbygning",
    studyRegulationsUrl:
      "https://mitsdu.dk/da/mit_studie/bachelor/medicin_bachelor/uddannelsens_opbygning/studieordninger",
    fallbackOverviewUrls: [
      "https://odin.sdu.dk/sitecore/?a=view&kode=FB14999",
    ],
  },
  Kandidat: {
    publicStructureUrl:
      "https://www.sdu.dk/da/uddannelse/kandidat/medicin/uddannelsens_opbygning",
    studyRegulationsUrl:
      "https://mitsdu.dk/da/mit_studie/kandidat/medicin_kandidat/uddannelsens_opbygning/studieordninger",
    fallbackOverviewUrls: [
      "https://odin.sdu.dk/sitecore/?a=view&kode=FB14998",
    ],
  },
});

const TERM_RE = /^[EF]\d{2}$/i;
const FETCH_TIMEOUT_MS = 16000;
const DISCOVERY_FETCH_TIMEOUT_MS = 9000;
const MAX_COURSE_PAGES = 72;
const DISCOVERY_CONCURRENCY = 6;

function send(res, status, payload) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.json(payload);
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)));
}

function normalizeText(value) {
  return decodeHtml(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9æøå]+/g, " ")
    .trim();
}

function stripHtml(html) {
  return normalizeWhitespace(
    decodeHtml(
      String(html || "")
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
    )
  );
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function resolveModule(input) {
  const direct = MODULE_CATALOG[input];
  if (direct) return { name: input, ...direct };
  const normalized = normalizeText(input);
  const modulePrefix = normalized.match(/^(b\d+|k\d+)/)?.[1]?.toUpperCase() || "";
  const hit = Object.entries(MODULE_CATALOG).find(([name, config]) => {
    if (modulePrefix && config.code === modulePrefix) return true;
    const searchable = [name, ...(config.aliases || [])].map(normalizeText);
    return searchable.some((alias) => alias && (normalized.includes(alias) || alias.includes(normalized)));
  });
  return hit ? { name: hit[0], ...hit[1] } : null;
}

function termBounds(term) {
  const normalized = String(term).toUpperCase();
  const year = 2000 + Number(normalized.slice(1));
  if (normalized.startsWith("F")) {
    return {
      start: new Date(Date.UTC(year, 0, 1, 0, 0, 0)),
      end: new Date(Date.UTC(year, 7, 15, 23, 59, 59)),
    };
  }
  return {
    start: new Date(Date.UTC(year, 6, 1, 0, 0, 0)),
    end: new Date(Date.UTC(year + 1, 1, 15, 23, 59, 59)),
  };
}

function termLabel(term) {
  const normalized = String(term).toUpperCase();
  const year = 2000 + Number(normalized.slice(1));
  return `${normalized.startsWith("E") ? "Efterår" : "Forår"} ${year}`;
}

function assertAllowedTerm(term) {
  if (!TERM_RE.test(term)) return { ok: false, reason: "INVALID_TERM" };
  const bounds = termBounds(term);
  const now = new Date();
  const oldestAllowed = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1));
  const newestAllowed = new Date(Date.UTC(now.getUTCFullYear() + 3, 11, 31));
  if (bounds.end < oldestAllowed) return { ok: false, reason: "PAST_TERM" };
  if (bounds.start > newestAllowed) return { ok: false, reason: "TERM_TOO_FAR_AHEAD" };
  return { ok: true, bounds };
}

async function fetchText(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout || FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": "MedFLUEN-SDU-Schedule/2.0",
        Accept:
          options.accept ||
          "text/html,application/xhtml+xml,text/calendar,application/json;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return {
      url: response.url,
      contentType: response.headers.get("content-type") || "",
      text: await response.text(),
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractUrls(html, baseUrl) {
  const urls = new Set();
  const patterns = [
    /(?:href|src|data-url|download-url)\s*=\s*["']([^"']+)["']/gi,
    /https?:\\?\/\\?\/[^"'<>\s]+/gi,
  ];
  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(html))) {
      const raw = decodeHtml(match[1] || match[0]).replace(/\\\//g, "/");
      try {
        urls.add(baseUrl ? new URL(raw, baseUrl).toString() : new URL(raw).toString());
      } catch {
        // Ignore malformed URLs from inline scripts.
      }
    }
  });
  return [...urls];
}

function extractLinks(html, baseUrl) {
  const links = [];
  const anchorRe = /<a\b([^>]*)href\s*=\s*["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorRe.exec(String(html || "")))) {
    try {
      links.push({
        url: new URL(decodeHtml(match[2]), baseUrl).toString(),
        text: stripHtml(match[4]),
        context: stripHtml(String(html).slice(Math.max(0, match.index - 240), anchorRe.lastIndex + 240)),
      });
    } catch {
      // Ignore malformed links.
    }
  }
  return links;
}

function isOdinCourseUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "odin.sdu.dk" &&
      (/\ba=fagbesk\b/i.test(parsed.search) || /\ba=searchfagbesk\b/i.test(parsed.search))
    );
  } catch {
    return false;
  }
}

function isOdinOverviewUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname === "odin.sdu.dk" &&
      (/\ba=view\b/i.test(parsed.search) || /\ba=sto\b/i.test(parsed.search))
    );
  } catch {
    return false;
  }
}

function moduleCodeAppears(value, code) {
  const raw = decodeHtml(value)
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const exact = new RegExp(`(?:^|[^A-Z0-9])(?:MODUL\\s+)?${escaped}(?:\\s*:|[^A-Z0-9]|$)`, "i");
  const range = new RegExp(
    `(?:${escaped}\\s*[-–/]\\s*[BK]\\d+|[BK]\\d+\\s*[-–/]\\s*${escaped})`,
    "i"
  );
  return exact.test(raw) && !range.test(raw);
}

function titleSimilarity(title, moduleConfig) {
  const stopwords = new Set([
    "modul", "module", "og", "and", "i", "of", "the", "til", "for", "samt", "somatiske", "sygdomme",
  ]);
  const titleTokens = new Set(
    normalizeText(title)
      .split(" ")
      .filter((token) => token.length > 2 && !stopwords.has(token) && token.toUpperCase() !== moduleConfig.code)
  );
  const aliases = [moduleConfig.name, ...(moduleConfig.aliases || [])];
  let best = 0;
  aliases.forEach((alias) => {
    const aliasTokens = normalizeText(alias)
      .split(" ")
      .filter((token) => token.length > 2 && !stopwords.has(token) && token.toUpperCase() !== moduleConfig.code);
    if (!aliasTokens.length) return;
    const matched = aliasTokens.filter((token) => titleTokens.has(token)).length;
    best = Math.max(best, matched / aliasTokens.length);
  });
  return best;
}

function exactTermEvidence(html, text, term) {
  const normalizedTerm = String(term).toUpperCase();
  const label = termLabel(normalizedTerm);
  const termRe = new RegExp(`(?:^|[^A-Z0-9])${normalizedTerm}(?:[^A-Z0-9]|$)`, "i");
  const labelRe = new RegExp(label.replace(" ", "\\s+"), "i");
  const headerSlice = stripHtml(String(html || "").slice(0, 9000));
  if (labelRe.test(headerSlice)) return 3;
  if (labelRe.test(text)) return 2;
  if (termRe.test(text)) return 1;
  return 0;
}

function parseApprovalDate(text) {
  const match = String(text || "").match(/Godkendelsesdato\s*:?\s*(\d{2})[-./](\d{2})[-./](\d{4})/i);
  if (!match) return 0;
  return Date.UTC(Number(match[3]), Number(match[2]) - 1, Number(match[1]));
}

function parseCoursePage(result, moduleConfig, term) {
  const html = result.text;
  const text = stripHtml(html);
  const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const titleFromField = text.match(/Fagets navn\s+(.+?)(?:UVA-kode|STADS ID|ECTS-point|Ansvarligt studienævn)/i)?.[1];
  const title = normalizeWhitespace(stripHtml(heading || titleFromField || ""));
  const uvaCode =
    text.match(/(?:UVA-kode|STADS ID\s*\(UVA\)|Fagnummer)\s*:?\s*([A-Z]\d{9})/i)?.[1]?.toUpperCase() ||
    result.url.match(/[?&]uva=([A-Z]\d{9})/i)?.[1]?.toUpperCase() ||
    result.url.match(/[?&]bbcourseid=([A-Z]\d{9})-/i)?.[1]?.toUpperCase() ||
    null;
  const level = text.match(/Niveau\s*:?\s*(Bachelor|Kandidat)/i)?.[1] || "";
  const cities = text.match(/Udbudssteder\s*:?\s*([^#]+?)(?:Niveau|Udbudsterminer|Varighed|Formål)/i)?.[1] || "";
  const archived = /Version\s*:?\s*Arkiv/i.test(text);
  const moduleCodeMatch = moduleCodeAppears(title || text.slice(0, 500), moduleConfig.code);
  const similarity = titleSimilarity(title, moduleConfig);
  const termEvidence = exactTermEvidence(html, text, term);
  const medicineBoard = /Studienævn for medicin/i.test(text);
  const odense = /Odense/i.test(cities || text.slice(0, 1800));
  const correctLevel = normalizeText(level).startsWith(normalizeText(moduleConfig.level));

  let score = 0;
  if (moduleCodeMatch) score += 60;
  score += Math.round(similarity * 35);
  score += termEvidence * 30;
  if (medicineBoard) score += 12;
  if (correctLevel) score += 12;
  if (odense) score += 8;
  if (archived) score -= 80;

  return {
    title,
    uvaCode,
    odinUrl: result.url,
    level,
    cities: normalizeWhitespace(cities),
    archived,
    moduleCodeMatch,
    titleSimilarity: similarity,
    termEvidence,
    approvalDate: parseApprovalDate(text),
    medicineBoard,
    odense,
    correctLevel,
    score,
    valid:
      Boolean(uvaCode) &&
      moduleCodeMatch &&
      termEvidence > 0 &&
      medicineBoard &&
      correctLevel &&
      odense &&
      !archived,
  };
}

function inlineUvaCourseUrls(html, baseUrl, moduleConfig) {
  const urls = new Set();
  const raw = String(html || "");
  const uvaRe = /[A-Z]\d{9}/gi;
  let match;
  while ((match = uvaRe.exec(raw))) {
    const context = stripHtml(raw.slice(Math.max(0, match.index - 500), match.index + 500));
    if (!moduleCodeAppears(context, moduleConfig.code)) continue;
    const uva = match[0].toUpperCase();
    urls.add(`https://odin.sdu.dk/sitecore/index.php?a=searchfagbesk&lang=da&periode=&uva=${uva.toLowerCase()}`);
  }

  extractUrls(raw, baseUrl)
    .filter(isOdinCourseUrl)
    .forEach((url) => {
      let needle = "";
      try {
        const parsed = new URL(url);
        needle =
          parsed.searchParams.get("id") ||
          parsed.searchParams.get("uva") ||
          parsed.searchParams.get("bbcourseid") ||
          "";
      } catch {
        return;
      }
      if (!needle) return;
      const index = raw.toLowerCase().indexOf(String(needle).toLowerCase());
      if (index < 0) return;
      const context = stripHtml(raw.slice(Math.max(0, index - 650), index + 650));
      if (moduleCodeAppears(context, moduleConfig.code)) urls.add(url);
    });

  return [...urls];
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      try {
        results[index] = await mapper(items[index], index);
      } catch (error) {
        results[index] = { error };
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

async function discoverOfficialCourseCandidates(moduleConfig, term) {
  const program = PROGRAM_SOURCES[moduleConfig.level];
  const checkedDiscoveryPages = [];
  const discoveryPages = [program.publicStructureUrl, program.studyRegulationsUrl];
  const overviewUrls = new Set(program.fallbackOverviewUrls);
  const courseLinkMap = new Map();

  for (const sourceUrl of discoveryPages) {
    try {
      const result = await fetchText(sourceUrl, { timeout: DISCOVERY_FETCH_TIMEOUT_MS });
      checkedDiscoveryPages.push({ url: result.url, ok: true });
      const links = extractLinks(result.text, result.url);
      links.filter((link) => isOdinOverviewUrl(link.url)).forEach((link) => overviewUrls.add(link.url));
      links
        .filter((link) => isOdinCourseUrl(link.url))
        .forEach((link) => {
          const relevant = moduleCodeAppears(`${link.text} ${link.context}`, moduleConfig.code);
          const previous = courseLinkMap.get(link.url);
          courseLinkMap.set(link.url, { ...link, relevant: relevant || previous?.relevant || false });
        });
      inlineUvaCourseUrls(result.text, result.url, moduleConfig).forEach((url) => {
        if (!courseLinkMap.has(url)) courseLinkMap.set(url, { url, text: "", context: "", relevant: true });
      });
    } catch (error) {
      checkedDiscoveryPages.push({ url: sourceUrl, ok: false, error: error?.message || String(error) });
    }
  }

  for (const overviewUrl of [...overviewUrls].slice(0, 10)) {
    try {
      const result = await fetchText(overviewUrl, { timeout: DISCOVERY_FETCH_TIMEOUT_MS });
      checkedDiscoveryPages.push({ url: result.url, ok: true, overview: true });
      const links = extractLinks(result.text, result.url);
      links
        .filter((link) => isOdinCourseUrl(link.url))
        .forEach((link) => {
          const relevant = moduleCodeAppears(`${link.text} ${link.context}`, moduleConfig.code);
          const previous = courseLinkMap.get(link.url);
          courseLinkMap.set(link.url, { ...link, relevant: relevant || previous?.relevant || false });
        });
      inlineUvaCourseUrls(result.text, result.url, moduleConfig).forEach((url) => {
        if (!courseLinkMap.has(url)) courseLinkMap.set(url, { url, text: "", context: "", relevant: true });
      });
    } catch (error) {
      checkedDiscoveryPages.push({ url: overviewUrl, ok: false, overview: true, error: error?.message || String(error) });
    }
  }

  const links = [...courseLinkMap.values()]
    .sort((a, b) => Number(b.relevant) - Number(a.relevant))
    .slice(0, MAX_COURSE_PAGES);

  const fetched = await mapWithConcurrency(links, DISCOVERY_CONCURRENCY, async (link) => {
    const result = await fetchText(link.url, { timeout: DISCOVERY_FETCH_TIMEOUT_MS });
    return { link, result, candidate: parseCoursePage(result, moduleConfig, term) };
  });

  const candidates = fetched
    .filter((item) => item?.candidate)
    .map((item) => item.candidate)
    .sort((a, b) => b.score - a.score || b.approvalDate - a.approvalDate);

  return {
    candidates,
    checkedDiscoveryPages,
    checkedCoursePages: fetched.map((item, index) => {
      if (item?.candidate) {
        const candidate = item.candidate;
        return {
          url: candidate.odinUrl,
          title: candidate.title,
          uvaCode: candidate.uvaCode,
          score: candidate.score,
          valid: candidate.valid,
          termEvidence: candidate.termEvidence,
        };
      }
      return {
        url: links[index]?.url,
        error: item?.error?.message || String(item?.error || "Unknown error"),
      };
    }),
  };
}

function exactTermScheduleLinks(html, term, uva, baseUrl = "https://odin.sdu.dk/") {
  const lowerTerm = term.toLowerCase();
  const links = extractUrls(html, baseUrl)
    .filter((url) => /skemaplan\.sdu\.dk|mitsdu\.sdu\.dk\/skema\/activity/i.test(url))
    .filter((url) => new RegExp(`(?:/|=)${lowerTerm}(?:[/?&#]|$)`, "i").test(url))
    .filter((url) => !uva || normalizeText(url).includes(normalizeText(uva)));
  return [...new Set(links)];
}

function directSkemaplanUrl(uva, term) {
  return `https://skemaplan.sdu.dk/${encodeURIComponent(String(uva).toUpperCase())}/${String(term).toLowerCase()}`;
}

async function resolveOfficialOffering(moduleConfig, term) {
  const discovery = await discoverOfficialCourseCandidates(moduleConfig, term);
  const valid = discovery.candidates.filter((candidate) => candidate.valid);
  if (!valid.length) {
    return {
      discoveryMode: "dynamic-official-discovery",
      checked: discovery.checkedDiscoveryPages,
      checkedCoursePages: discovery.checkedCoursePages,
      candidates: discovery.candidates.slice(0, 8),
    };
  }

  const best = valid[0];
  const second = valid[1];
  const ambiguous =
    second &&
    second.uvaCode !== best.uvaCode &&
    Math.abs(best.score - second.score) <= 8 &&
    best.termEvidence === second.termEvidence;

  if (ambiguous) {
    return {
      ambiguous: true,
      discoveryMode: "dynamic-official-discovery",
      candidates: valid.slice(0, 5),
      checked: discovery.checkedDiscoveryPages,
      checkedCoursePages: discovery.checkedCoursePages,
    };
  }

  let courseHtml = "";
  try {
    courseHtml = (await fetchText(best.odinUrl, { timeout: DISCOVERY_FETCH_TIMEOUT_MS })).text;
  } catch {
    // The candidate was already validated. A second fetch is only used to find
    // an explicit Skemaplan link, so direct UVA/term lookup remains available.
  }
  const officialLinks = exactTermScheduleLinks(courseHtml, term, best.uvaCode, best.odinUrl);
  const scheduleUrl = officialLinks[0] || directSkemaplanUrl(best.uvaCode, term);

  return {
    uvaCode: best.uvaCode,
    odinUrl: best.odinUrl,
    officialTitle: best.title,
    scheduleUrl,
    scheduleLinks: officialLinks.length ? officialLinks : [scheduleUrl],
    scheduleLinkMode: officialLinks.length ? "official-link" : "direct-uva-term",
    discoveryMode: "dynamic-official-discovery",
    selectedCandidate: best,
    candidates: valid.slice(0, 5),
    checked: discovery.checkedDiscoveryPages,
    checkedCoursePages: discovery.checkedCoursePages,
  };
}


function unfoldIcs(text) {
  const rows = String(text || "").split(/\r?\n/);
  const unfolded = [];
  rows.forEach((row) => {
    if (/^[ \t]/.test(row) && unfolded.length) unfolded[unfolded.length - 1] += row.slice(1);
    else unfolded.push(row);
  });
  return unfolded;
}

function decodeIcs(value) {
  return String(value || "")
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseIcsDate(raw, params = "") {
  if (!raw) return null;
  const value = String(raw).trim();
  const allDay = /VALUE=DATE/i.test(params) || /^\d{8}$/.test(value);
  const utc = value.endsWith("Z");
  const clean = value.replace(/Z$/, "");
  const year = Number(clean.slice(0, 4));
  const month = Number(clean.slice(4, 6));
  const day = Number(clean.slice(6, 8));
  if (![year, month, day].every(Number.isFinite)) return null;
  if (allDay) {
    const date = new Date(Date.UTC(year, month - 1, day));
    return { date, allDay: true };
  }
  const hour = Number(clean.slice(9, 11) || 0);
  const minute = Number(clean.slice(11, 13) || 0);
  const second = Number(clean.slice(13, 15) || 0);
  const date = utc
    ? new Date(Date.UTC(year, month - 1, day, hour, minute, second))
    : new Date(year, month - 1, day, hour, minute, second);
  return Number.isNaN(date.getTime()) ? null : { date, allDay: false };
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function localTime(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function classifyActivity(event) {
  const haystack = normalizeText(`${event.title} ${event.description} ${event.location}`);
  if (/\b(tbl|irat|trat|tapp)\b|team based learning/.test(haystack)) return "tbl";
  if (/forelæs|forelaes|lecture|miniforelæs|miniforelaes|plenum/.test(haystack)) return "lecture";
  if (/holdtime|holdundervis|klasse|class|gruppe|seminar|øvelse|ovelse|færdighed|faerdighed|klinik|case|workshop|demonstration|laborator/.test(haystack)) return "class";
  return "other";
}

function stableHash(value) {
  let hash = 2166136261;
  const input = String(value || "");
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function parseIcs(text, sourceUrl) {
  const rows = unfoldIcs(text);
  const events = [];
  let current = null;
  rows.forEach((row) => {
    if (row === "BEGIN:VEVENT") { current = {}; return; }
    if (row === "END:VEVENT") {
      if (current?.DTSTART) events.push(current);
      current = null;
      return;
    }
    if (!current) return;
    const separator = row.indexOf(":");
    if (separator < 0) return;
    const left = row.slice(0, separator);
    const value = decodeIcs(row.slice(separator + 1));
    const [key, ...paramParts] = left.split(";");
    current[key.toUpperCase()] = value;
    current[`${key.toUpperCase()}_PARAMS`] = paramParts.join(";");
  });

  return events.map((raw, index) => {
    const start = parseIcsDate(raw.DTSTART, raw.DTSTART_PARAMS);
    const end = parseIcsDate(raw.DTEND, raw.DTEND_PARAMS);
    if (!start) return null;
    const uid = raw.UID || `${raw.SUMMARY || "event"}-${raw.DTSTART}-${index}`;
    const normalized = {
      sourceId: String(uid),
      title: raw.SUMMARY || "SDU-aktivitet",
      rawTitle: raw.SUMMARY || "SDU-aktivitet",
      date: localDateKey(start.date),
      time: start.allDay ? "" : localTime(start.date),
      endTime: end && localDateKey(end.date) === localDateKey(start.date) && !end.allDay ? localTime(end.date) : "",
      allDay: start.allDay,
      description: raw.DESCRIPTION || "",
      location: raw.LOCATION || "",
      url: raw.URL || sourceUrl,
      sourceUrl,
      teacher: raw.CONTACT || raw.ORGANIZER || "",
      startTimestamp: start.date.getTime(),
      endTimestamp: end?.date?.getTime() || start.date.getTime() + 60 * 60 * 1000,
    };
    return { ...normalized, activityType: classifyActivity(normalized), stableId: `sdu-${stableHash(`${uid}|${raw.DTSTART}`)}` };
  }).filter(Boolean);
}

function parseJsonEvents(text, sourceUrl) {
  let parsed;
  try { parsed = JSON.parse(text); } catch { return []; }
  const candidates = Array.isArray(parsed) ? parsed : (parsed.events || parsed.data || parsed.items || []);
  if (!Array.isArray(candidates)) return [];
  return candidates.map((raw, index) => {
    const startValue = raw.start || raw.startDate || raw.startTime || raw.from || raw.begin;
    const endValue = raw.end || raw.endDate || raw.endTime || raw.to;
    const start = new Date(startValue);
    const end = endValue ? new Date(endValue) : new Date(start.getTime() + 60 * 60 * 1000);
    if (Number.isNaN(start.getTime())) return null;
    const sourceId = String(raw.id || raw.uid || `${raw.title || raw.name}-${start.toISOString()}-${index}`);
    const normalized = {
      sourceId,
      title: raw.title || raw.name || raw.summary || "SDU-aktivitet",
      rawTitle: raw.title || raw.name || raw.summary || "SDU-aktivitet",
      date: localDateKey(start),
      time: raw.allDay ? "" : localTime(start),
      endTime: localDateKey(end) === localDateKey(start) && !raw.allDay ? localTime(end) : "",
      allDay: Boolean(raw.allDay),
      description: raw.description || raw.notes || "",
      location: raw.location || raw.room || "",
      url: raw.url || sourceUrl,
      sourceUrl,
      teacher: raw.teacher || raw.organizer || "",
      startTimestamp: start.getTime(),
      endTimestamp: end.getTime(),
    };
    return { ...normalized, activityType: classifyActivity(normalized), stableId: `sdu-${stableHash(`${sourceId}|${start.toISOString()}`)}` };
  }).filter(Boolean);
}

function dedupeEvents(events) {
  const map = new Map();
  events.forEach((event) => {
    const key = event.sourceId || `${event.title}|${event.date}|${event.time}|${event.location}`;
    if (!map.has(key)) map.set(key, event);
  });
  return [...map.values()].sort((a, b) => a.startTimestamp - b.startTimestamp || a.title.localeCompare(b.title));
}

function validateEventsForTerm(events, term) {
  const { start, end } = termBounds(term);
  const inTerm = events.filter((event) => event.startTimestamp >= start.getTime() && event.startTimestamp <= end.getTime());
  const outOfTerm = events.length - inTerm.length;
  return { inTerm, outOfTerm, valid: inTerm.length > 0 };
}

function sourceCandidates(scheduleUrl, uva, term, html) {
  const candidates = new Set();
  const add = (value) => { try { candidates.add(new URL(value, scheduleUrl).toString()); } catch { /* ignore */ } };
  const scheduleOrigin = new URL(scheduleUrl).origin;

  extractUrls(html || "", scheduleUrl).forEach((url) => {
    let parsed;
    try { parsed = new URL(url); } catch { return; }
    const exportLike = /\.ics(?:[?#]|$)|\.csv(?:[?#]|$)|ical|calendar|subscribe|subscription|export|download|timeedit/i.test(url);
    const skemaplanResource = parsed.hostname === "skemaplan.sdu.dk" && /\.(?:js|json)(?:[?#]|$)/i.test(parsed.pathname);
    if (exportLike || skemaplanResource) add(url);
  });

  [
    `${scheduleUrl}?format=ics`, `${scheduleUrl}?format=ical`, `${scheduleUrl}?download=ics`,
    `${scheduleUrl.replace(/\/$/, "")}/calendar.ics`, `${scheduleUrl.replace(/\/$/, "")}/export.ics`,
    `${scheduleOrigin}/appsettings.json`, `${scheduleOrigin}/manifest.json`, `${scheduleOrigin}/_framework/blazor.boot.json`,
    `https://mitsdu.sdu.dk/skema/activity/${encodeURIComponent(uva)}/${term.toLowerCase()}`,
  ].forEach(add);
  return [...candidates].slice(0, 45);
}

async function fetchScheduleEvents({ scheduleUrl, uvaCode, term }) {
  const checkedSources = [];
  const direct = await fetchText(scheduleUrl);
  checkedSources.push({ url: direct.url, contentType: direct.contentType });
  if (/BEGIN:VCALENDAR/i.test(direct.text)) return { events: parseIcs(direct.text, direct.url), checkedSources };
  if (/application\/json/i.test(direct.contentType)) {
    const events = parseJsonEvents(direct.text, direct.url);
    if (events.length) return { events, checkedSources };
  }

  // Optional production adapter. It must return either ICS or { events: [...] }.
  if (process.env.SDU_TIMETABLE_PROXY_URL) {
    const proxyUrl = new URL(process.env.SDU_TIMETABLE_PROXY_URL);
    proxyUrl.searchParams.set("uva", uvaCode);
    proxyUrl.searchParams.set("term", term.toUpperCase());
    proxyUrl.searchParams.set("scheduleUrl", scheduleUrl);
    try {
      const proxy = await fetchText(proxyUrl.toString());
      checkedSources.push({ url: proxy.url, contentType: proxy.contentType, proxy: true });
      const events = /BEGIN:VCALENDAR/i.test(proxy.text) ? parseIcs(proxy.text, proxy.url) : parseJsonEvents(proxy.text, proxy.url);
      if (events.length) return { events, checkedSources };
    } catch (error) {
      checkedSources.push({ url: proxyUrl.toString(), proxy: true, error: error?.message || String(error) });
    }
  }

  const queue = sourceCandidates(scheduleUrl, uvaCode, term, direct.text);
  const visited = new Set([direct.url]);
  while (queue.length && visited.size < 45) {
    const candidate = queue.shift();
    if (!candidate || visited.has(candidate)) continue;
    visited.add(candidate);
    try {
      const result = await fetchText(candidate, { timeout: 10000 });
      checkedSources.push({ url: result.url, contentType: result.contentType });
      const events = /BEGIN:VCALENDAR/i.test(result.text)
        ? parseIcs(result.text, result.url)
        : parseJsonEvents(result.text, result.url);
      if (events.length) return { events, checkedSources };

      // TimeEdit/Skemaplan export pages often reveal the actual iCal endpoint
      // one level later. Follow only schedule-related links and same-site
      // scripts, never arbitrary page navigation.
      extractUrls(result.text, result.url).forEach((url) => {
        let parsed;
        try { parsed = new URL(url); } catch { return; }
        const scheduleRelated = /\.ics(?:[?#]|$)|\.csv(?:[?#]|$)|ical|calendar|subscribe|subscription|export|download|reservation|timetable|schedule|timeedit/i.test(url);
        const sameSkemaplanScript = parsed.hostname === "skemaplan.sdu.dk" && /\.(?:js|json)(?:[?#]|$)/i.test(parsed.pathname);
        if ((scheduleRelated || sameSkemaplanScript) && !visited.has(url) && queue.length < 60) queue.push(url);
      });
    } catch (error) {
      checkedSources.push({ url: candidate, error: error?.message || String(error) });
    }
  }

  return { events: [], checkedSources };
}

function summarize(events) {
  const counts = { lecture: 0, class: 0, tbl: 0, other: 0 };
  events.forEach((event) => { counts[event.activityType] = (counts[event.activityType] || 0) + 1; });
  return {
    total: events.length,
    firstDate: events[0]?.date || null,
    lastDate: events[events.length - 1]?.date || null,
    counts,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { ok: false, code: "METHOD_NOT_ALLOWED", message: "Kun GET understøttes." });

  const moduleConfig = resolveModule(String(req.query.module || ""));
  const term = String(req.query.term || "").toUpperCase();
  if (!moduleConfig) return send(res, 400, { ok: false, code: "UNKNOWN_MODULE", message: "Modulet findes ikke i MedFLUENs SDU-katalog." });
  const termCheck = assertAllowedTerm(term);
  if (!termCheck.ok) {
    const message = termCheck.reason === "PAST_TERM"
      ? "Det valgte semester er afsluttet. MedFLUEN importerer ikke gamle skemaer."
      : "Semesterkoden er ugyldig eller ligger for langt fremme.";
    return send(res, 400, { ok: false, code: termCheck.reason, message });
  }

  try {
    const offering = await resolveOfficialOffering(moduleConfig, term);
    if (offering.ambiguous) {
      return send(res, 409, {
        ok: false,
        code: "AMBIGUOUS_MODULE_OFFERING",
        message: `SDU viser flere mulige fagversioner for ${moduleConfig.name} i ${term}. MedFLUEN importerer ikke automatisk, før én version kan identificeres entydigt.`,
        module: moduleConfig.name,
        term,
        discoveryMode: offering.discoveryMode,
        candidates: offering.candidates,
        checked: offering.checked,
      });
    }
    if (!offering.scheduleUrl) {
      return send(res, 404, {
        ok: false,
        code: "MODULE_OFFERING_NOT_FOUND",
        message: `SDU har ikke en entydig, officiel fagversion for ${moduleConfig.name} i ${term}. Ingen tidligere UVA-kode eller ældre termin er blevet anvendt.`,
        module: moduleConfig.name,
        term,
        discoveryMode: offering.discoveryMode,
        candidates: offering.candidates,
        checked: offering.checked,
        checkedCoursePages: offering.checkedCoursePages,
      });
    }

    const fetched = await fetchScheduleEvents({ scheduleUrl: offering.scheduleUrl, uvaCode: offering.uvaCode, term });
    const deduped = dedupeEvents(fetched.events);
    const validation = validateEventsForTerm(deduped, term);
    if (!validation.valid) {
      const directLookup = offering.scheduleLinkMode === "direct-uva-term";
      return send(res, directLookup ? 404 : 502, {
        ok: false,
        code: directLookup ? "SCHEDULE_NOT_PUBLISHED" : "SCHEDULE_DATA_UNAVAILABLE",
        message: directLookup
          ? `Skemaplan blev kontrolleret direkte med UVA ${offering.uvaCode} og termin ${term}, men der blev ikke fundet aktiviteter i den termin. Ingen ældre aktiviteter er importeret.`
          : `Det officielle ${term}-link blev fundet, men kalenderaktiviteterne kunne ikke læses sikkert. Ingen gamle aktiviteter er importeret.`,
        module: moduleConfig.name,
        term,
        uvaCode: offering.uvaCode,
        scheduleUrl: offering.scheduleUrl,
        scheduleLinkMode: offering.scheduleLinkMode,
        checkedSources: fetched.checkedSources,
      });
    }

    const events = validation.inTerm.map(({ startTimestamp, endTimestamp, ...event }) => event);
    return send(res, 200, {
      ok: true,
      module: moduleConfig.name,
      term,
      uvaCode: offering.uvaCode,
      officialTitle: offering.officialTitle,
      odinUrl: offering.odinUrl,
      scheduleUrl: offering.scheduleUrl,
      scheduleLinkMode: offering.scheduleLinkMode,
      discoveryMode: offering.discoveryMode,
      fetchedAt: new Date().toISOString(),
      summary: { ...summarize(events), rejectedOutsideTerm: validation.outOfTerm },
      events,
    });
  } catch (error) {
    return send(res, 502, {
      ok: false,
      code: "SDU_FETCH_FAILED",
      message: "SDU-skemaet kunne ikke hentes lige nu. Prøv igen senere; der er ikke importeret et ældre skema.",
      detail: process.env.NODE_ENV === "development" ? (error?.stack || String(error)) : undefined,
    });
  }
}
