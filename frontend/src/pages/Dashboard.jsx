// src/pages/Dashboard.jsx

import { useNavigate } from "react-router-dom";
import { logout } from "../auth";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h2>Dashboard</h2>
      <p>You are logged in ✅</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}>
        <button onClick={() => navigate("/upload")}>Upload Document</button>
        <button onClick={() => navigate("/search")}>Search</button>
        <button onClick={() => navigate("/processing")}>Processing</button>
        <button onClick={() => navigate("/home")}>Home</button>
      </div>

      <br /><br />
      <button onClick={handleLogout} style={{ color: "red" }}>Logout</button>
    </div>
  );
};

export default Dashboard;