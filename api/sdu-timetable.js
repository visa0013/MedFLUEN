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
  "B1 Celler og væv": { aliases: ["b1", "celler og væv"], uva: ["S100103101", "S100100101", "S100096101", "S100039101"] },
  "B2 Bevægeapparatet": { aliases: ["b2", "bevægeapparatet"], uva: ["S100047101"] },
  "B3 Molekylær medicin": { aliases: ["b3", "molekylær medicin"], uva: ["S100108101", "S100049101"] },
  "B4 Genetik": { aliases: ["b4", "genetik"], uva: ["S100052101"] },
  "B5 Kredsløb og respiration": { aliases: ["b5", "kredsløb og respiration"], uva: ["S100094101", "S100071101"] },
  "B6 Ernæring og vækst": { aliases: ["b6", "ernæring og vækst"], uva: ["S100057101"] },
  "B7 Reproduktion og farmakodynamik": { aliases: ["b7", "reproduktion og farmakodynamik"], uva: ["S100060101"] },
  "B8 Homeostase": { aliases: ["b8", "homeostase"], uva: ["S100095101", "S100074101"] },
  "B9 Hjerne og sanser": { aliases: ["b9", "hjerne og sanser"], uva: ["S100063101"] },
  "B10 Angreb og forsvar": { aliases: ["b10", "angreb og forsvar"], uva: ["S100067101"] },
  "B11 Bachelorprojektet": { aliases: ["b11", "bachelorprojekt", "bachelorprojektet"], uva: ["S100044101"] },
  "B12 Fra rask til syg": { aliases: ["b12", "fra rask til syg"], uva: ["S100069101"] },
  "K1 Hjerte, lunger og nyrer": { aliases: ["k1", "hjerte", "lunger", "luftveje", "ønh"], uva: ["S150080101", "S150014101"] },
  "K2 Bevægeapparatet og bloddannende organer": { aliases: ["k2", "bevægeapparatet", "bloddannende organer"], uva: ["S150081101", "S150002101"] },
  "K3 Fordøjelseskanalen, ernæring og metabolisme": { aliases: ["k3", "fordøjelseskanalen", "ernæring og metabolisme"], uva: ["S150090101", "S150082101", "S150000101"] },
  "K5 Nervesystem og psykiatri": { aliases: ["k5", "nervesystem", "psykiatri", "somatiske og psykiske sygdomme"], uva: ["S150100101", "S150083101", "S150004101"] },
  "K6 Retsmedicin, nyrer, urinveje og kræft": { aliases: ["k6", "retsmedicin", "nyrer", "urinveje", "kræft"], uva: ["S150115101", "S150005101"] },
  "K8 Mor og barn": { aliases: ["k8", "mor og barn", "kvinde mor og barn"], uva: ["S150085101", "S150019101"] },
  "K9 Hud, øjne, farmakologi og ældre": { aliases: ["k9", "hud", "øjne", "farmakologi", "ældre"], uva: ["S150102101", "S150030101"] },
  "K10 Forberedelse til KBU": { aliases: ["k10", "forberedelse til kbu"], uva: ["S150103101", "S150068101"] },
});

const TERM_RE = /^[EF]\d{2}$/i;
const FETCH_TIMEOUT_MS = 16000;

function send(res, status, payload) {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.json(payload);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9æøå]+/g, " ")
    .trim();
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveModule(input) {
  const direct = MODULE_CATALOG[input];
  if (direct) return { name: input, ...direct };
  const normalized = normalizeText(input);
  const modulePrefix = normalized.match(/^(b\d+|k\d+)/)?.[1] || "";
  const hit = Object.entries(MODULE_CATALOG).find(([name, config]) => {
    const nameNormalized = normalizeText(name);
    if (modulePrefix && nameNormalized.startsWith(modulePrefix)) return true;
    return config.aliases.some((alias) => normalized.includes(normalizeText(alias)));
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

function assertAllowedTerm(term) {
  if (!TERM_RE.test(term)) return { ok: false, reason: "INVALID_TERM" };
  const bounds = termBounds(term);
  const now = new Date();
  const oldestAllowed = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1));
  const newestAllowed = new Date(Date.UTC(now.getUTCFullYear() + 2, 11, 31));
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
        "User-Agent": "MedFLUEN-SDU-Schedule/1.0",
        Accept: options.accept || "text/html,application/xhtml+xml,text/calendar,application/json;q=0.9,*/*;q=0.8",
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
      const raw = (match[1] || match[0]).replace(/\\\//g, "/").replace(/&amp;/g, "&");
      try { urls.add(baseUrl ? new URL(raw, baseUrl).toString() : new URL(raw).toString()); } catch { /* ignore malformed URL */ }
    }
  });
  return [...urls];
}

function exactTermScheduleLinks(html, term, uva, baseUrl = "https://odin.sdu.dk/") {
  const lowerTerm = term.toLowerCase();
  const links = extractUrls(html, baseUrl)
    .filter((url) => /skemaplan\.sdu\.dk|mitsdu\.sdu\.dk\/skema\/activity/i.test(url))
    .filter((url) => new RegExp(`(?:/|=)${lowerTerm}(?:[/?&#]|$)`, "i").test(url))
    .filter((url) => !uva || normalizeText(url).includes(normalizeText(uva)));
  return [...new Set(links)];
}

async function resolveOfficialOffering(moduleConfig, term) {
  const checked = [];
  for (const candidate of moduleConfig.uva) {
    const urls = [
      `https://odin.sdu.dk/sitecore/index.php?a=searchfagbesk&uva=${candidate.toLowerCase()}&lang=da&periode`,
      `https://odinlister.sdu.dk/fagbesk/uva/${candidate}/da`,
    ];
    for (const url of urls) {
      try {
        const result = await fetchText(url);
        const text = stripHtml(result.text);
        const declaredUva = text.match(/UVA-kode\s*:?\s*(S\d{9})/i)?.[1]?.toUpperCase() || candidate;
        const scheduleLinks = exactTermScheduleLinks(result.text, term, declaredUva, result.url);
        checked.push({ uva: declaredUva, url: result.url, scheduleTerms: extractUrls(result.text, result.url).filter((item) => /skemaplan\.sdu\.dk|mitsdu\.sdu\.dk\/skema\/activity/i.test(item)).map((item) => item.match(/\/(e|f)\d{2}(?:[/?&#]|$)/i)?.[0]?.replace(/[/?&#]/g, "").toUpperCase()).filter(Boolean) });
        if (scheduleLinks.length) {
          return {
            uvaCode: declaredUva,
            odinUrl: result.url,
            scheduleUrl: scheduleLinks[0],
            scheduleLinks,
            checked,
          };
        }
      } catch (error) {
        checked.push({ uva: candidate, url, error: error?.message || String(error) });
      }
    }
  }
  return { checked };
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
  extractUrls(html || "", scheduleUrl).forEach((url) => {
    if (/\.ics(?:[?#]|$)|ical|calendar|subscribe|subscription|export|download/i.test(url)) add(url);
  });
  [
    `${scheduleUrl}?format=ics`, `${scheduleUrl}?format=ical`, `${scheduleUrl}?download=ics`,
    `${scheduleUrl.replace(/\/$/, "")}/calendar.ics`, `${scheduleUrl.replace(/\/$/, "")}/export.ics`,
    `https://mitsdu.sdu.dk/skema/activity/${uva}/${term.toLowerCase()}`,
  ].forEach(add);
  return [...candidates].slice(0, 30);
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
        const scheduleRelated = /\.ics(?:[?#]|$)|ical|calendar|subscribe|subscription|export|download|reservation|timetable|schedule/i.test(url);
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
    if (!offering.scheduleUrl) {
      return send(res, 404, {
        ok: false,
        code: "SCHEDULE_NOT_PUBLISHED",
        message: `SDU har endnu ikke offentliggjort et skema for ${moduleConfig.name} i ${term}. Ingen ældre termin er blevet anvendt.`,
        module: moduleConfig.name,
        term,
        checked: offering.checked,
      });
    }

    const fetched = await fetchScheduleEvents({ scheduleUrl: offering.scheduleUrl, uvaCode: offering.uvaCode, term });
    const deduped = dedupeEvents(fetched.events);
    const validation = validateEventsForTerm(deduped, term);
    if (!validation.valid) {
      return send(res, 502, {
        ok: false,
        code: "SCHEDULE_DATA_UNAVAILABLE",
        message: `Det officielle ${term}-link blev fundet, men kalenderaktiviteterne kunne ikke læses sikkert. Ingen gamle aktiviteter er importeret.`,
        module: moduleConfig.name,
        term,
        uvaCode: offering.uvaCode,
        scheduleUrl: offering.scheduleUrl,
        checkedSources: fetched.checkedSources,
      });
    }

    const events = validation.inTerm.map(({ startTimestamp, endTimestamp, ...event }) => event);
    return send(res, 200, {
      ok: true,
      module: moduleConfig.name,
      term,
      uvaCode: offering.uvaCode,
      odinUrl: offering.odinUrl,
      scheduleUrl: offering.scheduleUrl,
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
