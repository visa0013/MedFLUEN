import React, { useState, useEffect, useRef } from "react";
import "./catalog751.css";

export function NativePdf751({ url, materialId, fileName = "PDF", savedState = {}, pageRequest, onDocumentPosition, onStateChange, annotations = [], language = "da" }) {
  const en = language === "en";
  const safePage = value => Math.min(10000, Math.max(1, Math.floor(Number(value) || 1)));
  const [position, setPosition] = useState({ materialId, page: safePage(savedState.page) });
  const page = position.materialId === materialId ? position.page : safePage(savedState.page);
  const callbacks = useRef({ onDocumentPosition, onStateChange });
  callbacks.current = { onDocumentPosition, onStateChange };
  const savedPage = useRef(savedState.page);
  savedPage.current = savedState.page;
  const manualPage = useRef(false);
  useEffect(() => { manualPage.current = false; }, [materialId]);
  // A delayed cloud response can restore position, but cannot undo a manual choice.
  useEffect(() => { if (!manualPage.current) setPosition({ materialId, page: safePage(savedPage.current) }); }, [materialId, savedState.remoteRevision]);
  useEffect(() => {
    if (pageRequest?.page && (!pageRequest.materialId || pageRequest.materialId === materialId)) {
      manualPage.current = true;
      setPosition({ materialId, page: safePage(pageRequest.page) });
    }
  }, [materialId, pageRequest]);
  useEffect(() => {
    callbacks.current.onDocumentPosition?.({ materialId, page, numPages: 0 });
    callbacks.current.onStateChange?.({ page });
  }, [materialId, page]);
  const allowed = typeof url === "string" && /^(https?:\/\/|blob:|\/[^/])/.test(url);
  const source = allowed ? `${url.split("#")[0]}#page=${page}` : "";
  function exportAnnotations() {
    const blob = new Blob([JSON.stringify({ materialId, fileName, annotations }, null, 2)], { type: "application/json" });
    const href = URL.createObjectURL(blob), anchor = document.createElement("a");
    anchor.href = href; anchor.download = "medfluen-markeringer.json"; anchor.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  }
  return <section className="mf751-native-pdf" aria-label={en ? "PDF reader" : "PDF-viser"}>
    <div className="mf751-native-actions">
      <span>{en ? "Browser PDF reader" : "Browserens PDF-viser"}</span>
      <div>{annotations.some(row => row.payload?.kind !== "slide-note") && <button type="button" onClick={exportAnnotations}>{en ? "Export saved annotations" : "Eksporter gemte markeringer"}</button>}
      {allowed && <a href={source} target="_blank" rel="noopener noreferrer">{en ? "Open PDF" : "Åbn PDF"} ↗</a>}</div>
    </div>
    {onDocumentPosition && <p className="mf751-native-hint">{en ? "Select the slide number in Notes yourself. Scrolling inside the browser reader cannot update Notes automatically." : "Vælg selv slidenummeret i Noter. Scroll i browserens PDF-viser kan ikke opdatere noternes sidenummer automatisk."}</p>}
    {source ? <iframe title={fileName} src={source} /> : <p role="status">{en ? "The document is not available. Reopen it from the material list." : "Dokumentet er ikke tilgængeligt. Åbn det igen fra materialelisten."}</p>}
  </section>;
}
