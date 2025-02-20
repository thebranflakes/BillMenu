import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // Universal styling
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminCheeses = () => {
  const [cheeses, setCheeses] = useState([]);

  // 🟢 Fetch all cheeses including hidden ones
  useEffect(() => {
    const fetchCheeses = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/cheeses`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cheeses");
        }

        const data = await response.json();
        setCheeses(data);
      } catch (error) {
        console.error("Error fetching cheeses:", error);
      }
    };

    fetchCheeses();
  }, []);

  // 🟢 Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cheeses/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setCheeses((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, visible: newVisible } : item
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // 🟢 Toggle In Stock / Out of Stock
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cheeses/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setCheeses((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: newStock } : item
        )
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // 🗑️ Delete a Cheese Item
  const deleteCheese = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this cheese?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cheeses/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete cheese");

      setCheeses((prev) => prev.filter((item) => item.id !== id));
      alert("✅ Cheese deleted successfully!");
    } catch (error) {
      console.error("Error deleting cheese:", error);
      alert("❌ Error deleting cheese.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Cheeses</h2>
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
          {cheeses.map((item) => (
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
                <button className="delete-button" onClick={() => deleteCheese(item.id)}>
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

export default AdminCheeses;
