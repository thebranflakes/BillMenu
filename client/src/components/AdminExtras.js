import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // ✅ Uses universal styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminExtras = () => {
  const [extras, setExtras] = useState([]);

  // 🟢 Fetch all extras (including hidden ones)
  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/extras`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch extras");
        }

        const data = await response.json();
        setExtras(data);
      } catch (error) {
        console.error("Error fetching extras:", error);
      }
    };

    fetchExtras();
  }, []);

  // 🟢 Toggle Visibility (Show/Hide an Extra)
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/extras/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setExtras((prev) =>
        prev.map((extra) =>
          extra.id === id ? { ...extra, visible: newVisible } : extra
        )
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // 🔄 Toggle Stock (In Stock / Out of Stock)
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/extras/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setExtras((prev) =>
        prev.map((extra) =>
          extra.id === id ? { ...extra, stock: newStock } : extra
        )
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // ❌ Delete an Extra Item
  const deleteExtra = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this extra?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/extras/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete extra");

      setExtras((prev) => prev.filter((extra) => extra.id !== id));
      alert("✅ Extra deleted successfully!");
    } catch (error) {
      console.error("Error deleting extra:", error);
      alert("❌ Error deleting extra.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Extras</h2>
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
          {extras.map((extra) => (
            <tr key={extra.id}>
              <td>{extra.name}</td>
              <td>
                <button
                  className={`stock-toggle ${extra.stock ? "button-in-stock" : "button-out-of-stock"}`}
                  onClick={() => toggleStock(extra.id, extra.stock)}
                >
                  {extra.stock ? "In Stock" : "OOS"}
                </button>
              </td>
              <td>
                <button
                  className={`visibility-toggle ${extra.visible ? "visible" : "hidden"}`}
                  onClick={() => toggleVisibility(extra.id, extra.visible)}
                >
                  {extra.visible ? "Visible" : "Hidden"}
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteExtra(extra.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminExtras;
