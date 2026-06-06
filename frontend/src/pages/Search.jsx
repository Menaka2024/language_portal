//search.jsx
import React, { useEffect, useState } from "react";
import Table from "../components/Table.jsx";
import { searchDocuments } from "../api/documentsApi.js";
import { Link } from "react-router-dom";

export default function Search() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [source, setSource] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    try {
      const res = await searchDocuments({ query, language, source });
      setRows(res.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    run();
  }, []);

  const columns = [
    { key: "id", header: "ID" },
    { key: "language", header: "Language" },
    { key: "excerpt", header: "Excerpt" },
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <Link to={`/document/${r.id}`} style={styles.viewBtn}>  {/* ← fixed */}
    View
  </Link>
      ),
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Search & Results</h1>
        <p style={styles.subtitle}>
          Search documents with filters like Language & Source
        </p>

        {/* 🔹 ROW 1 */}
        <div style={styles.filterRow}>
          <div style={styles.field}>
            <label style={styles.label}>Search</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={styles.select}
            >
              <option value="">All</option>
              <option value="Tamil">Tamil</option>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* 🔹 ROW 2 */}
        <div style={styles.filterRow}>
          <div style={styles.field}>
            <label style={styles.label}>Source</label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="ex: Manual / Newspaper"
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button
              onClick={run}
              disabled={loading}
              style={{ ...styles.btn, ...styles.primaryBtn }}
            >
              {loading ? "Searching..." : "Search"}
            </button>

            <button
              onClick={() => {
                setQuery("");
                setLanguage("");
                setSource("");
                setTimeout(run, 0); // ← re-fetch with empty filters
              }}
              style={{ ...styles.btn, ...styles.secondaryBtn }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* 🔹 TABLE */}
        <div style={styles.tableWrapper}>
          <Table columns={columns} rows={rows} />
        </div>
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
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "1000px",
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
  },

  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3a8a",
  },

  subtitle: {
    fontSize: "15px",
    color: "#6b7280",
    marginBottom: "30px",
  },

  filterRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minWidth: "220px",
  },

  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: "6px",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },

  select: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
  },

  btn: {
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
  },

  secondaryBtn: {
    background: "#fff",
    color: "#4f46e5",
    border: "2px solid #4f46e5",
  },

  tableWrapper: {
    marginTop: "10px",
    overflowX: "auto",
  },

  viewBtn: {
    background: "#4f46e5",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },
};