import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // Universal styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminBreakfastSandwiches = () => {
  const [breakfastSandwiches, setBreakfastSandwiches] = useState([]);

  // Fetch all breakfast sandwiches (including hidden ones)
  useEffect(() => {
    const fetchBreakfastSandwiches = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/breakfast_sandwiches`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch breakfast sandwiches");
        }

        const data = await response.json();
        setBreakfastSandwiches(data);
      } catch (error) {
        console.error("Error fetching breakfast sandwiches:", error);
      }
    };

    fetchBreakfastSandwiches();
  }, []);

  // Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/breakfast_sandwiches/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setBreakfastSandwiches((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, visible: newVisible } : item
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // Toggle In Stock / Out of Stock
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/breakfast_sandwiches/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setBreakfastSandwiches((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: newStock } : item
        )
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // Delete a Breakfast Sandwich
  const deleteBreakfastSandwich = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this breakfast sandwich?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/breakfast_sandwiches/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete breakfast sandwich");

      setBreakfastSandwiches((prev) => prev.filter((item) => item.id !== id));
      alert("✅ Breakfast sandwich deleted successfully!");
    } catch (error) {
      console.error("Error deleting breakfast sandwich:", error);
      alert("❌ Error deleting breakfast sandwich.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Breakfast Sandwiches</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th> {/* In Stock / OOS */}
            <th>Visible</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {breakfastSandwiches.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <button
                  className={`stock-toggle ${item.stock ? "button-in-stock" : "button-out-of-stock"}`}
                  onClick={() => toggleStock(item.id, item.stock)}
                >
                  {item.stock ? "In Stock" : "OOS"}
                </button>
              </td>
              <td>
                <button
                  className={`visibility-toggle ${item.visible ? "visible" : "hidden"}`}
                  onClick={() => toggleVisibility(item.id, item.visible)}
                >
                  {item.visible ? "Visible" : "Hidden"}
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteBreakfastSandwich(item.id)}>
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

export default AdminBreakfastSandwiches;
