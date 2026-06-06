// src/components/Navbar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../auth.jsx";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated()); // ← uses auth.jsx
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();                          // ← clears "token" via auth.jsx
    setLoggedIn(false);
    navigate("/home");
    window.dispatchEvent(new Event("logout"));
  };

  useEffect(() => {
    const onLogin  = () => setLoggedIn(true);
    const onLogout = () => setLoggedIn(false);
    window.addEventListener("login",  onLogin);
    window.addEventListener("logout", onLogout);
    return () => {
      window.removeEventListener("login",  onLogin);
      window.removeEventListener("logout", onLogout);
    };
  }, []);

  // also dispatch "login" event from Login.jsx after successful login
  // so Navbar updates instantly without page refresh

  const linkStyle = ({ isActive }) => ({
    padding: "8px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 500,
    transition: "0.3s",
    background: isActive ? "#4f46e5" : "transparent",
    color: isActive ? "#fff" : "#374151",
  });

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>

        {/* LOGO */}
        <div style={styles.logoSection}>
          <div style={styles.logoBox} />
          <div style={styles.title}>lrw-frontend</div>
        </div>

        {/* NAV LINKS */}
        <div style={styles.navLinks}>
          {!loggedIn ? (
            <>
              <NavLink to="/login"    style={linkStyle}>Login</NavLink>
              <NavLink to="/register" style={linkStyle}>Register</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
              <NavLink to="/upload"    style={linkStyle}>Upload</NavLink>
              <NavLink to="/search"    style={linkStyle}>Search</NavLink>
              <NavLink to="/home"      style={linkStyle}>Home</NavLink>
              <div style={styles.userBadge}>👤 User</div>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  container: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoBox: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(to right, #4f46e5, #06b6d4)",
  },
  title: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#111827",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoutBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
  userBadge: {
    background: "#eef2ff",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#3730a3",
  },
};