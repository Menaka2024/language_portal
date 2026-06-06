import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchDocuments } from "../api/documentsApi.js";

export default function Home() {
  const nav = useNavigate();
  const [stats, setStats] = useState({ documents: 0, tokens: 0, posTagged: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await searchDocuments({ query: "" });
        const items = res.items || [];

        const tokens = items.reduce(
          (sum, d) => sum + (d.tokens?.length || 0),
          0
        );

        const posTagged = items.filter(
          (d) => (d.pos?.length || 0) > 0
        ).length;

        setStats({ documents: items.length, tokens, posTagged });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div style={styles.container}>
      
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2>NLP Document Manager</h2>
        <span>Welcome, User 👋</span>
      </div>

      {/* HERO */}
      <div style={styles.hero}>
        <h1>Smart NLP Processing Dashboard</h1>
        <p>
          Upload raw text, extract tokens, perform POS tagging, and manage your
          document corpus efficiently.
        </p>

        <div style={styles.heroBtns}>
          <button style={styles.primaryBtn} onClick={() => nav("/upload")}>
            Upload Document
          </button>

          <button style={styles.secondaryBtn} onClick={() => nav("/search")}>
            Search Documents
          </button>
        </div>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        <Stat title="Documents" value={loading ? "..." : stats.documents} />
        <Stat title="Tokens" value={loading ? "..." : stats.tokens} />
        <Stat title="NLP Processed" value={loading ? "..." : stats.posTagged} />
      </div>

      {/* PROJECT INFO */}
      <div style={styles.card}>
        <h3>📌 About This System</h3>
        <p>
          This system allows users to upload text datasets and perform Natural
          Language Processing tasks such as tokenization and Part-of-Speech
          tagging. The structured output can be searched and exported for
          linguistic analysis and research.
        </p>
      </div>

      {/* RECENT ACTIVITY */}
      <div style={styles.card}>
        <h3>🕒 Recent Activity</h3>
        <p>Latest uploaded and processed documents will appear here.</p>
      </div>
    </div>
  );
}

/* SMALL STAT COMPONENT */

function Stat({ title, value }) {
  return (
    <div style={styles.statCard}>
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}

/* 🎨 STYLES */

const styles = {
  container: { padding: "25px", background: "#f4f6f9", minHeight: "100vh" },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  hero: {
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    padding: "40px",
    borderRadius: "15px",
    color: "white",
    marginBottom: "25px",
  },

  heroBtns: { marginTop: "20px", display: "flex", gap: "10px" },

  primaryBtn: {
    background: "white",
    color: "#007bff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "transparent",
    border: "2px solid white",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  statCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
};