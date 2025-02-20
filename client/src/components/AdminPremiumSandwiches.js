import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // Using universal admin styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminPremiumSandwiches = () => {
  const [sandwiches, setSandwiches] = useState([]);

  // 🥪 Fetch all premium sandwiches
  useEffect(() => {
    const fetchSandwiches = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/premium_sandwiches`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch sandwiches");

        const data = await response.json();
        setSandwiches(data);
      } catch (error) {
        console.error("Error fetching premium sandwiches:", error);
      }
    };

    fetchSandwiches();
  }, []);

  // 👁️ Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/premium_sandwiches/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setSandwiches((prev) =>
        prev.map((sandwich) =>
          sandwich.id === id ? { ...sandwich, visible: newVisible } : sandwich
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // 🔄 Toggle In-Stock / Out-of-Stock
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/premium_sandwiches/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setSandwiches((prev) =>
        prev.map((sandwich) =>
          sandwich.id === id ? { ...sandwich, stock: newStock } : sandwich
        )
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // 🗑️ Delete a Sandwich
  const deleteSandwich = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sandwich?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/premium_sandwiches/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete sandwich");

      setSandwiches((prev) => prev.filter((sandwich) => sandwich.id !== id));
      alert("✅ Sandwich deleted successfully!");
    } catch (error) {
      console.error("Error deleting sandwich:", error);
      alert("❌ Error deleting sandwich.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Premium Sandwiches</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Visible</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {sandwiches.map((sandwich) => (
            <tr key={sandwich.id}>
              <td>{sandwich.name}</td>
              <td>
                <button
                  className={`stock-toggle ${sandwich.stock ? "button-in-stock" : "button-out-of-stock"}`}
                  onClick={() => toggleStock(sandwich.id, sandwich.stock)}
                >
                  {sandwich.stock ? "In Stock" : "OOS"}
                </button>
              </td>
              <td>
                <button
                  className={`visibility-toggle ${sandwich.visible ? "visible" : "hidden"}`}
                  onClick={() => toggleVisibility(sandwich.id, sandwich.visible)}
                >
                  {sandwich.visible ? "Visible" : "Hidden"}
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteSandwich(sandwich.id)}>
                  <i className="fas fa-trash"></i> {/* Trash Icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPremiumSandwiches;
