// src/pages/Register.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
  if (!email || !password) {
    setError("Please fill in all fields");
    return;
  }
  if (password.length < 4) {
    setError("Password must be at least 4 characters");
    return;
  }
  const result = await register(email, password);
  if (result) {
    setSuccess("Account created! Please check your email to verify your account.");
  } else {
    setError("Registration failed. Email may already be in use.");
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>Register</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        onKeyDown={handleKeyDown}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => { setPassword(e.target.value); setError(""); }}
        onKeyDown={handleKeyDown}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <p
        onClick={() => navigate("/login")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;