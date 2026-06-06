// src/auth.jsx

import { http } from "./api/http";

export const login = async (email, password) => {
  try {
    const res = await http.post("/api/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("email", res.data.email);
    return true;
  } catch (err) {
    return false;
  }
};

export const register = async (email, password) => {
  try {
    await http.post("/api/auth/register", { email, password });
    return true;
  } catch (err) {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getEmail = () => {
  return localStorage.getItem("email");
};