// src/components/AppLayout.jsx

import Navbar from "./Navbar.jsx";

export default function AppLayout({ children }) {
  return (
    <div style={styles.wrapper}>
      <Navbar />
      <main style={styles.content}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f7f9fc",
    fontFamily: "'Inter', sans-serif",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "30px 20px",
  },
};