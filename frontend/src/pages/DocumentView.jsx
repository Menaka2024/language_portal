// src/pages/DocumentView.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { downloadCsv, downloadJson, getDocumentById } from "../api/documentsApi.js";

export default function DocumentView() {
  const { id } = useParams();
  const nav = useNavigate();
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await getDocumentById(id);
      setDoc(res);
    })();
  }, [id]);

  const csvRows = useMemo(() => {
    if (!doc) return [];
    return [{
      id: doc.id,
      language: doc.language,
      source: doc.source,
      license: doc.license,
      cleanText: doc.cleanText,
      tokens: (doc.tokens || []).join(" "),
    }];
  }, [doc]);

  if (!doc) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p style={styles.muted}>Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.inner}>

        {/* Header Card */}
        <div style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <span style={styles.badge}>Document #{doc.id}</span>
              <h1 style={styles.h1}>{doc.title || "Document Detail"}</h1>
              <p style={styles.muted}>
                {doc.language} • {doc.source} • {doc.license} • {doc.createdAt}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={styles.secondaryBtn} onClick={() => nav("/search")}>← Back</button>
              <button style={styles.btn} onClick={() => downloadJson(doc, `doc-${doc.id}.json`)}>Download JSON</button>
              <button style={styles.btn} onClick={() => downloadCsv(csvRows, `doc-${doc.id}.csv`)}>Download CSV</button>
            </div>
          </div>
        </div>

        {/* Raw Text */}
        <div style={styles.card}>
          <h2 style={styles.h2}>Original Text</h2>
          <p style={{ ...styles.muted, marginTop: 8, whiteSpace: "pre-wrap" }}>{doc.rawText}</p>
        </div>

        {/* Clean Text */}
        <div style={styles.card}>
          <h2 style={styles.h2}>Clean Text</h2>
          <p style={{ ...styles.muted, marginTop: 8, whiteSpace: "pre-wrap" }}>{doc.cleanText}</p>
        </div>

        {/* Tokens */}
        <div style={styles.card}>
          <h2 style={styles.h2}>Tokens</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {(doc.tokens || []).map((t, i) => (
              <span key={i} style={styles.badge}>{t}</span>
            ))}
          </div>
        </div>

        {/* POS Tags */}
        <div style={styles.card}>
          <h2 style={styles.h2}>POS Tags</h2>
          {(doc.pos || []).length === 0 ? (
            <p style={{ ...styles.muted, marginTop: 8 }}>No POS data</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              {doc.pos.map((p, i) => (
                <span key={i} style={styles.posBadge}>
                  {p.token} <span style={{ opacity: 0.6 }}>: {p.tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f7f9fc",
    display: "flex",
    justifyContent: "center",
  },

  inner: {
    width: "100%",
    maxWidth: "900px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px 32px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },

  h1: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e3a8a",
    margin: "8px 0 4px",
  },

  h2: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#1e3a8a",
  },

  muted: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
  },

  badge: {
    display: "inline-block",
    background: "#ede9fe",
    color: "#4f46e5",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  posBadge: {
    display: "inline-block",
    background: "#f0fdf4",
    color: "#166534",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
  },

  btn: {
    padding: "10px 18px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "10px 18px",
    background: "#fff",
    color: "#4f46e5",
    border: "2px solid #4f46e5",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
  },
};