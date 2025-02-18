import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Make sure bcryptjs is installed
import "./css/global.css";
import BagelsRow from "./components/BagelsRow";
import CreamCheeseAndAddOns from "./components/CreamCheeseAndAddOns";
import BreakfastSandwiches from "./components/BreakfastSandwiches";
import PremiumSandwiches from "./components/PremiumSandwiches";
import CoffeeAndShirts from "./components/CoffeeAndShirts";
import AdminPage from "./components/AdminPage";
import Logo from "./components/Logo";
import { menuData } from "./data";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Ensure `useNavigate` is used inside a Router

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        navigate("/admin"); // ✅ Redirect to Admin Page
      } else {
        alert(data.message || "Incorrect password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Error connecting to server");
    }
  };

  return (
    <Routes>
      <Route
        path="/admin"
        element={
          isAuthenticated ? (
            <AdminPage />
          ) : (
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
          )
        }
      />
      <Route
        path="/"
        element={
          <div className="parent-grid">
            <div className="bagels section-card">
              <BagelsRow />
            </div>
            <div className="logo section-card">
              <Logo />
            </div>
            <div className="breakfast section-card">
              <BreakfastSandwiches />
            </div>
            <div className="addons section-card">
              <CreamCheeseAndAddOns toppings={menuData.toppings} />
            </div>
            <div className="coffee section-card">
              <CoffeeAndShirts />
            </div>
            <div className="premium section-card">
              <PremiumSandwiches />
            </div>
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
