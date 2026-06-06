// src/components/Table.jsx

export default function Table({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return (
      <div style={styles.empty}>
        No results found.
      </div>
    );
  }

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={styles.th}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={row.id || i}
            style={i % 2 === 0 ? styles.rowEven : styles.rowOdd}
          >
            {columns.map((col) => (
              <td key={col.key} style={styles.td}>
                {col.render ? col.render(row) : row[col.key] ?? "—"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },

  th: {
    textAlign: "left",
    padding: "12px 16px",
    background: "#f1f5f9",
    color: "#374151",
    fontWeight: "600",
    fontSize: "13px",
    borderBottom: "2px solid #e5e7eb",
  },

  td: {
    padding: "12px 16px",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  },

  rowEven: {
    background: "#ffffff",
  },

  rowOdd: {
    background: "#f9fafb",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#9ca3af",
    fontSize: "14px",
  },
};