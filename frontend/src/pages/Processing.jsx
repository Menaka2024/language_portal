// src/pages/Processing.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobStatus } from "../api/documentsApi.js";

function Step({ done, failed, label }) {
  const bg = failed ? "#fee2e2" : done ? "#dcfce7" : "#fef9c3";
  const icon = failed ? "✗" : done ? "✓" : "…";
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <span style={{
        background: bg,
        color: "#111",
        padding: "2px 10px",
        borderRadius: "999px",
        fontWeight: "bold",
        fontSize: "13px"
      }}>
        {icon}
      </span>
      <div>{label}</div>
    </div>
  );
}

export default function Processing() {
  const { jobId } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let t;
    async function tick() {
      try {
        const res = await getJobStatus(jobId);
        setData(res);

        if (res.status === "failed") return; // stop polling on failure

        if (res.status === "done" && res.documentId) {
          setTimeout(() => nav(`/document/${res.documentId}`), 800); // ← fixed route
          return;
        }

        t = setTimeout(tick, 1200); // keep polling if still processing
      } catch (e) {
        setError("Could not reach server. Showing mock data.");
        t = setTimeout(tick, 3000); // retry slower on error
      }
    }
    tick();
    return () => clearTimeout(t);
  }, [jobId, nav]);

  const steps = data?.steps || { extracting: false, cleaning: false, nlp: false };
  const failed = data?.status === "failed";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Processing Document</h1>
        <p style={styles.subtitle}>
          Extracting Text → Cleaning Text → Applying NLP
        </p>

        {error && (
          <p style={{ color: "#b45309", background: "#fef9c3", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
            ⚠ {error}
          </p>
        )}

        {failed && (
          <p style={{ color: "#dc2626", background: "#fee2e2", padding: "10px 14px", borderRadius: 8, fontSize: 13 }}>
            ✗ Processing failed. Please try uploading again.
          </p>
        )}

        <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Step done={!!steps.extracting} failed={failed} label="Extracting Text" />
          <Step done={!!steps.cleaning} failed={failed} label="Cleaning Text" />
          <Step done={!!steps.nlp}      failed={failed} label="Running NLP Analysis" />
        </div>

        <hr style={{ margin: "20px 0", borderColor: "#e5e7eb" }} />

        <p style={{ fontSize: 13, color: "#6b7280" }}>
          Job: <b>{jobId}</b> | Status: <b>{data?.status || "processing"}</b>
        </p>

        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button
            onClick={() => nav("/upload")}
            style={styles.secondaryBtn}
          >
            ← Upload Another
          </button>
          <button
            onClick={() => nav("/search")}
            style={styles.primaryBtn}
          >
            Go to Search
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f7f9fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    maxWidth: "560px",
    width: "100%",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e3a8a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  primaryBtn: {
    padding: "10px 20px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryBtn: {
    padding: "10px 20px",
    background: "#fff",
    color: "#4f46e5",
    border: "2px solid #4f46e5",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
};