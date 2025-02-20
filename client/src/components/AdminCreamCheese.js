import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // 🌟 Now using universal styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminCreamCheese = () => {
  const [creamCheeses, setCreamCheeses] = useState([]);

  // 🟢 Fetch all cream cheese items (including hidden)
  useEffect(() => {
    const fetchCreamCheese = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/cream_cheese`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch cream cheese items");

        const data = await response.json();
        setCreamCheeses(data);
      } catch (error) {
        console.error("Error fetching cream cheese:", error);
      }
    };

    fetchCreamCheese();
  }, []);

  // 🟢 Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cream_cheese/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setCreamCheeses((prev) =>
        prev.map((item) => (item.id === id ? { ...item, visible: newVisible } : item))
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // 🔄 Toggle In Stock / Out of Stock
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cream_cheese/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setCreamCheeses((prev) =>
        prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item))
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // 🗑️ Delete a Cream Cheese Item (🔹 Fixed ID issue)
  const deleteCreamCheese = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this cream cheese?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cream_cheese/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete cream cheese");

      setCreamCheeses((prev) => prev.filter((item) => item.id !== id));
      alert("✅ Cream cheese deleted successfully!");
    } catch (error) {
      console.error("Error deleting cream cheese:", error);
      alert("❌ Error deleting cream cheese.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Cream Cheese</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th> {/* Stock Status */}
            <th>Visible</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {creamCheeses.map((item) => (
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
                <button className="delete-button" onClick={() => deleteCreamCheese(item.id)}>
                  <i className="fas fa-trash"></i> {/* Font Awesome Trash Icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCreamCheese;
