const {
  SYSTEM_PROMPT,
  sanitizeLabels,
  resolveQuestionSchema,
  patternSchema,
  buildResolveInstruction,
  buildPatternInstruction,
} = require("./exam-resolver-contract.cjs");

const MAX_BODY_CHARS = 4_000_000;
const MAX_IMAGE_CHARS = 1_500_000;
const MAX_PATTERN_PAGES = 3;

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") {
    if (req.body.length > MAX_BODY_CHARS) throw httpError(413, "Request body is too large.");
    try { return JSON.parse(req.body); } catch { throw httpError(400, "Request body must be valid JSON."); }
  }
  return {};
}

function bearerToken(req) {
  const header = String(req.headers?.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function verifySupabaseUser(token) {
  const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) throw new Error("Server-side Supabase environment variables are missing.");
  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    headers: { apikey: publishableKey, Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return null;
  return response.json();
}

function validDataImage(value) {
  return typeof value === "string"
    && value.length <= MAX_IMAGE_CHARS
    && /^data:image\/(?:jpeg|jpg|png|webp);base64,[a-z0-9+/=]+$/i.test(value);
}

function outputText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  let text = "";
  (data?.output || []).forEach((item) => {
    if (item?.type !== "message") return;
    (item?.content || []).forEach((part) => {
      if (part?.type === "output_text" && part?.text) text += part.text;
    });
  });
  return text.trim();
}

function finiteUnit(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 1;
}

function validBoundingBox(box) {
  return Boolean(box && typeof box === "object" && typeof box.found === "boolean"
    && [box.x, box.y, box.width, box.height].every(finiteUnit));
}

function validateResolveResult(result, labels) {
  const valid = new Set(sanitizeLabels(labels));
  if (!result || typeof result !== "object") return false;
  if (!(result.detectedLabel == null || valid.has(String(result.detectedLabel).toUpperCase()))) return false;
  if (typeof result.documentEvidencePresent !== "boolean" || !finiteUnit(result.confidence) || !validBoundingBox(result.boundingBox)) return false;
  if (typeof result.markerType !== "string" || typeof result.evidenceText !== "string" || typeof result.reason !== "string") return false;
  if (!(result.page == null || Number.isInteger(Number(result.page)))) return false;
  if (!result.documentEvidencePresent && result.detectedLabel != null) return false;
  return true;
}

function validatePatternResult(result) {
  return Boolean(result && typeof result === "object"
    && typeof result.patternSummary === "string"
    && typeof result.stableAnswerConvention === "boolean"
    && typeof result.markerMeansCorrectAnswer === "boolean"
    && typeof result.requiresQuestionSpecificCheck === "boolean"
    && Array.isArray(result.markerTypes) && result.markerTypes.every((item) => typeof item === "string")
    && Array.isArray(result.colors) && result.colors.every((item) => typeof item === "string")
    && typeof result.answerPlacement === "string"
    && finiteUnit(result.confidence)
    && typeof result.notes === "string");
}

async function callOpenAI({ schema, schemaName, instruction, images }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured in Vercel.");
  const model = process.env.OPENAI_EXAM_MODEL || "gpt-5.6";
  const content = [{ type: "input_text", text: instruction }];
  images.forEach((image) => content.push({ type: "input_image", image_url: image, detail: "high" }));
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      store: false,
      input: [
        { role: "developer", content: [{ type: "input_text", text: SYSTEM_PROMPT }] },
        { role: "user", content },
      ],
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          strict: true,
          schema,
        },
      },
      max_output_tokens: 1200,
    }),
  });
  const raw = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = raw?.error?.message || `OpenAI request failed (${response.status}).`;
    throw new Error(message);
  }
  const text = outputText(raw);
  if (!text) throw new Error("The document resolver returned no structured output.");
  let result;
  try { result = JSON.parse(text); } catch { throw new Error("The document resolver returned invalid structured output."); }
  return { result, model, responseId: raw?.id || null };
}

module.exports = async function examResolver(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "Method not allowed." });
  }
  try {
    const token = bearerToken(req);
    if (!token) return send(res, 401, { error: "Authentication required." });
    const user = await verifySupabaseUser(token);
    if (!user?.id) return send(res, 401, { error: "Invalid session." });

    const body = readBody(req);
    const serializedLength = JSON.stringify(body).length;
    if (serializedLength > MAX_BODY_CHARS) return send(res, 413, { error: "Document analysis request is too large." });

    if (body.mode === "discover_pattern") {
      const pages = (Array.isArray(body.pages) ? body.pages : []).slice(0, MAX_PATTERN_PAGES);
      const images = pages.map((page) => page?.imageDataUrl).filter(validDataImage);
      if (!images.length) return send(res, 400, { error: "At least one valid rendered PDF page is required." });
      const result = await callOpenAI({
        schema: patternSchema,
        schemaName: "exam_answer_marking_pattern",
        instruction: buildPatternInstruction({ pages }),
        images,
      });
      if (!validatePatternResult(result.result)) throw new Error("The document resolver returned an invalid pattern profile.");
      return send(res, 200, { result: result.result, meta: { model: result.model, responseId: result.responseId, mode: body.mode } });
    }

    if (body.mode === "resolve_question") {
      if (!validDataImage(body.imageDataUrl)) return send(res, 400, { error: "A valid rendered PDF crop is required." });
      const labels = sanitizeLabels((body.question?.options || []).map((option) => option?.label));
      if (labels.length < 2) return send(res, 400, { error: "At least two option labels are required." });
      const result = await callOpenAI({
        schema: resolveQuestionSchema(labels),
        schemaName: "exam_document_answer_evidence",
        instruction: buildResolveInstruction(body),
        images: [body.imageDataUrl],
      });
      if (!validateResolveResult(result.result, labels)) throw new Error("The document resolver returned invalid answer evidence.");
      if (Number.isFinite(Number(body.page))) result.result.page = Number(body.page);
      return send(res, 200, { result: result.result, meta: { model: result.model, responseId: result.responseId, mode: body.mode } });
    }

    return send(res, 400, { error: "Unknown resolver mode." });
  } catch (error) {
    const statusCode = Number(error?.statusCode) || 500;
    if (statusCode >= 500) console.error("exam-resolver error", error);
    return send(res, statusCode, { error: String(error?.message || error || "Resolver failed.").slice(0, 500) });
  }
};
