// src/pages/Login.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  if (!email || !password) {
    setError("Please enter email and password");
    return;
  }
  const result = await login(email, password);
  if (result) {
    window.dispatchEvent(new Event("login"));
    navigate("/dashboard");
  } else {
    setError("Invalid email or password or email not verified");
  }
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>Login</h2>

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

      <button onClick={handleLogin}>Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p
        onClick={() => navigate("/register")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        Create an account
      </p>
    </div>
  );
};

export default Login;