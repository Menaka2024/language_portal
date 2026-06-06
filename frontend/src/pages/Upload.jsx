//upload.jsx
import React, { useMemo, useState } from "react";
import { uploadDocument } from "../api/documentsApi.js";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const nav = useNavigate();
  const [inputType, setInputType] = useState("text");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    domain: "",
    language: "Tamil",
    source: "Manual",
    license: "CC BY",
    text: "",
    url: "",
    file: null,
  });

  const accept = useMemo(() => {
    if (inputType === "pdf") return ".pdf";
    if (inputType === "image") return "image/*";
    if (inputType === "audio") return "audio/*";
    return "*/*";
  }, [inputType]);

  const canSubmit =
    (inputType === "text" && form.text.trim().length > 0) ||
    (inputType === "url" && form.url.trim().length > 0) ||
    (["pdf", "image", "audio"].includes(inputType) && !!form.file);

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    try {
      const payload = {
        inputType,
        title: form.title,
        domain: form.domain,
        language: form.language,
        source: form.source,
        license: form.license,
      };

      if (inputType === "text") payload.text = form.text;
      if (inputType === "url") payload.url = form.url;
      if (["pdf", "image", "audio"].includes(inputType)) payload.file = form.file;

      const res = await uploadDocument(payload);
      nav(`/processing/${res.jobId}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Upload Data</h1>
        <p style={styles.subtitle}>
          Upload Text / PDF / Image / Audio / URL with metadata and license
        </p>

        <form onSubmit={onSubmit} style={styles.form}>
          {/* Input Type & Language */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Input Type</label>
              <select
                value={inputType}
                onChange={(e) => {
                  setInputType(e.target.value);
                  setForm((p) => ({ ...p, text: "", url: "", file: null }));
                }}
                style={styles.select}
              >
                <option value="text">Text</option>
                <option value="pdf">PDF</option>
                <option value="image">Image (OCR)</option>
                <option value="audio">Audio (STT)</option>
                <option value="url">URL</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}
                style={styles.select}
              >
                <option>Tamil</option>
                <option>Sinhala</option>
                <option>English</option>
                <option>Mixed</option>
              </select>
            </div>
          </div>

          {/* Source & License */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Source</label>
              <input
                type="text"
                placeholder="e.g., Newspaper / Manual / Website"
                value={form.source}
                onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>License</label>
              <select
                value={form.license}
                onChange={(e) => setForm((p) => ({ ...p, license: e.target.value }))}
                style={styles.select}
              >
                <option>Public Domain</option>
                <option>CC BY</option>
                <option>CC BY-SA</option>
                <option>CC BY-NC</option>
                <option>All Rights Reserved</option>
              </select>
            </div>
          </div>

          {/* Title & Domain */}
          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Title (Optional)</label>
              <input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Domain (Optional)</label>
              <input
                value={form.domain}
                onChange={(e) => setForm((p) => ({ ...p, domain: e.target.value }))}
                placeholder="e.g., News / Education / Social"
                style={styles.input}
              />
            </div>
          </div>

          {/* Dynamic Input Area */}
          {inputType === "text" && (
            <div style={styles.fieldFull}>
              <label style={styles.label}>Enter Text</label>
              <textarea
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                placeholder="Paste your text here..."
                style={styles.textarea}
              />
            </div>
          )}

          {inputType === "url" && (
            <div style={styles.fieldFull}>
              <label style={styles.label}>Enter URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
                style={styles.input}
              />
            </div>
          )}

          {["pdf", "image", "audio"].includes(inputType) && (
            <div style={styles.fieldFull}>
              <label style={styles.label}>Choose File</label>
              <input
                type="file"
                accept={accept}
                onChange={(e) => setForm((p) => ({ ...p, file: e.target.files?.[0] || null }))}
                style={styles.fileInput}
              />
              {form.file && <p style={styles.fileName}>Selected: {form.file.name}</p>}
            </div>
          )}

          {/* Buttons */}
          <div style={styles.actions}>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{ ...styles.btn, ...styles.primaryBtn }}
            >
              {loading ? "Uploading..." : "Upload & Process"}
            </button>
            <button
              type="button"
              onClick={() => nav("/search")}
              style={{ ...styles.btn, ...styles.secondaryBtn }}
            >
              Go to Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    padding: "30px",
    minHeight: "100vh",
    background: "#f7f9fc",
    fontFamily: "'Inter', sans-serif",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "#1e3a8a",
  },

  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  row: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },

  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  fieldFull: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#4b5563",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    transition: "0.3s",
  },

  select: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },

  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    minHeight: "120px",
    outline: "none",
    resize: "vertical",
  },

  fileInput: {
    fontSize: "14px",
  },

  fileName: {
    marginTop: "6px",
    fontSize: "13px",
    color: "#6b7280",
  },

  actions: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  btn: {
    padding: "14px 28px",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "0.3s",
    border: "none",
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    boxShadow: "0 5px 15px rgba(79,70,229,0.3)",
  },

  secondaryBtn: {
    background: "#fff",
    color: "#4f46e5",
    border: "2px solid #4f46e5",
  },
};