import React, { useState } from "react";

const AdminLogin = ({ setIsAuthenticated }) => {
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Login Successful!");
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true); // Update state to show admin panel
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
