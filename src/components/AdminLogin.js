import React, { useState } from "react";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Login Successful!");
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true); 
    } else {
      alert("❌ Incorrect Password!");
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
