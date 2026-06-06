import React from "react";

export default function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="muted">{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6 }}>{value}</div>
      {hint ? <div className="muted" style={{ marginTop: 6 }}>{hint}</div> : null}
    </div>
  );
}
