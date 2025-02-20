import React, { useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const handleLogin = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", // Important: Ensures cookies are sent!
    });

    if (!response.ok) {
      const data = await response.json();
      alert(`❌ Login Failed: ${data.message}`);
      return;
    }

    alert("✅ Login Successful!");
    setIsAuthenticated(true); // Re-render component
  } catch (error) {
    console.error("Login error:", error);
    alert("🔴 Login request failed.");
  }
};

  
  
  

  return (
    <div className="login-container">
      <h2>Admin Login</h2>
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
