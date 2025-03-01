import React, { useState } from "react";
import "../css/AdminLogin.css"; // New styles added
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include", // Ensures cookies are sent!
      });

      if (!response.ok) {
        const data = await response.json();
        alert(`❌ Login Failed: ${data.message}`);
        return;
      }

      alert("✅ Login Successful!");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login error:", error);
      alert("🔴 Login request failed.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Admin Login</h2>
        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
