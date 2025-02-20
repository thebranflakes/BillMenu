import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // 🌟 Using universal styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const AdminBagels = () => {
  const [bagels, setBagels] = useState([]);

  // Fetch all bagels including hidden ones
  useEffect(() => {
    const fetchBagels = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/admin/bagels`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch bagels");

        const data = await response.json();
        setBagels(data);
      } catch (error) {
        console.error("Error fetching bagels:", error);
      }
    };

    fetchBagels();
  }, []);

  // 🟢 Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bagels/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setBagels((prev) =>
        prev.map((bagel) => (bagel.id === id ? { ...bagel, visible: newVisible } : bagel))
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // 🟢 Toggle In Stock / Out of Stock
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bagels/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setBagels((prev) =>
        prev.map((bagel) => (bagel.id === id ? { ...bagel, stock: newStock } : bagel))
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // 🗑️ Delete a Bagel (🔹 Fixed ID issue)
  const deleteBagel = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this bagel?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bagels/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete bagel");

      setBagels((prev) => prev.filter((bagel) => bagel.id !== id));
      alert("✅ Bagel deleted successfully!");
    } catch (error) {
      console.error("Error deleting bagel:", error);
      alert("❌ Error deleting bagel.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Bagels</h2>
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
          {bagels.map((bagel) => (
            <tr key={bagel.id}>
              <td>{bagel.name}</td>
              <td>
                <button
                  className={`stock-toggle ${bagel.stock ? "button-in-stock" : "button-out-of-stock"}`}
                  onClick={() => toggleStock(bagel.id, bagel.stock)}
                >
                  {bagel.stock ? "In Stock" : "OOS"}
                </button>
              </td>
              <td>
                <button
                  className={`visibility-toggle ${bagel.visible ? "visible" : "hidden"}`}
                  onClick={() => toggleVisibility(bagel.id, bagel.visible)}
                >
                  {bagel.visible ? "Visible" : "Hidden"}
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteBagel(bagel.id)}>
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

export default AdminBagels;
