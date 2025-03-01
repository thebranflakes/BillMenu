import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminPage.css";
import AdminLogin from "./AdminLogin";
import AddItem from "./AddItem";
import AdminBagels from "./AdminBagels";
import AdminCreamCheese from "./AdminCreamCheese";
import AdminToppings from "./AdminToppings";
import AdminBreakfastSandwiches from "./AdminBreakfastSandwiches";
import AdminMeats from "./AdminMeats";
import AdminCheeses from "./AdminCheeses";
import AdminExtras from "./AdminExtras";
import AdminPremiumSandwiches from "./AdminPremiumSandwiches";
import AdminPremiumSandwichOptions from "./AdminPremiumSandwichOptions";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 Check if admin is logged in via the cookie
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/check`, {
          method: "GET",
          credentials: "include", // ✅ Sends cookies with the request
        });

        if (response.ok) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
      }
    };

    checkAdmin();
  }, []);

  return isAuthenticated ? (
    <div className="admin-panel">
      <h2 className="admin-title">Admin Panel</h2>
  
      <div className="admin-header">
      <button className="logout-btn" onClick={async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
            method: "POST",
            credentials: "include", // ✅ Ensures cookies are sent with request
          });

          if (response.ok) {
            setIsAuthenticated(false);
            window.location.href = "/admin"; // ✅ Redirects to login page
          } else {
            console.error("Logout failed");
          }
        } catch (error) {
          console.error("Error logging out:", error);
        }
      }}>
        Logout
      </button>
  
        <button className="add-item-btn" onClick={() => navigate("/admin/add-item")}>
          ➕ Add New Item
        </button>
      </div>
  
      <AdminBagels />
      <AdminCreamCheese />
      <AdminToppings />
      <AdminBreakfastSandwiches />
      <AdminMeats />
      <AdminCheeses />
      <AdminExtras />
      <AdminPremiumSandwiches />
      <AdminPremiumSandwichOptions />
    </div>
  ) : (
    <AdminLogin setIsAuthenticated={setIsAuthenticated} />
  );
  
};

export default AdminPage;
