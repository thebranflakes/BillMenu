import React, { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("✅ AdminPage Component Mounted!");

    // Check if user is already authenticated
    if (localStorage.getItem("isAuthenticated") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  return isAuthenticated ? (
    <div className="admin-panel">
      <h2>Welcome to the Admin Panel</h2>
      <p>Here you can manage Bill’s Bagels!</p>
      <button
        onClick={() => {
          localStorage.removeItem("isAuthenticated"); // Logout
          window.location.href = "/admin"; // Refresh the page to show login again
        }}
      >
        Logout
      </button>
    </div>
  ) : (
    <AdminLogin setIsAuthenticated={setIsAuthenticated} />
  );
};

export default AdminPage;
