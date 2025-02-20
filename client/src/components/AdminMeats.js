import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // Universal styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminMeats = () => {
  const [meats, setMeats] = useState([]);

  // Fetch all meats (including hidden ones)
  useEffect(() => {
    const fetchMeats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/meats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch meats");
        }

        const data = await response.json();
        setMeats(data);
      } catch (error) {
        console.error("Error fetching meats:", error);
      }
    };

    fetchMeats();
  }, []);

  // Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/meats/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setMeats((prev) =>
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
      const response = await fetch(`${API_BASE_URL}/api/meats/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setMeats((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: newStock } : item
        )
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // Delete a Meat Item
  const deleteMeat = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this meat item?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/meats/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete meat");

      setMeats((prev) => prev.filter((item) => item.id !== id));
      alert("✅ Meat item deleted successfully!");
    } catch (error) {
      console.error("Error deleting meat:", error);
      alert("❌ Error deleting meat item.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Meats</h2>
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
          {meats.map((item) => (
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
                <button className="delete-button" onClick={() => deleteMeat(item.id)}>
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

export default AdminMeats;
