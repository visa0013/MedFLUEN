// Answer availability is explicit metadata, not a claim about automatic grading.
export function examAnswerMode75(document = {}) {
  const explicit = (document.parseMeta || document.parse_meta || {}).answerMode;
  if (["none", "separate", "embedded", "unknown"].includes(explicit)) return explicit;
  return document.answerStoragePath || document.answer_storage_path ? "separate" : "unknown";
}

export function examMatchesAnswerFilter75(document, filter = "all") {
  const mode = examAnswerMode75(document);
  if (filter === "with") return mode === "separate" || mode === "embedded";
  if (filter === "without") return mode === "none";
  return true;
}

export function examAnswerPath75(document = {}) {
  const mode = examAnswerMode75(document);
  if (mode === "none") return null;
  if (mode === "embedded") return document.questionStoragePath || document.question_storage_path || null;
  return document.answerStoragePath || document.answer_storage_path || null;
}

export function examUploadError75(dialog = {}) {
  if (dialog.mode === "upload" && !dialog.questionFile) return "question-required";
  if (dialog.answerMode === "separate" && !dialog.answerFile && !dialog.document?.answerStoragePath) return "answer-required";
  return "";
}

export function examDuplicate75(rows, questionSha, excludeId) {
  if (!questionSha) return null;
  return (Array.isArray(rows) ? rows : []).find(row => row.id !== excludeId &&
    (row.question_sha256 === questionSha || row.content_sha256 === questionSha)) || null;
}
