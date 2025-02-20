import React, { useEffect, useState } from "react";
import "../css/AdminTables.css"; // Using universal styles
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminToppings = () => {
  const [toppings, setToppings] = useState([]);

  // 🟢 Fetch all toppings including hidden ones
  useEffect(() => {
    const fetchToppings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/toppings`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch toppings");

        const data = await response.json();
        setToppings(data);
      } catch (error) {
        console.error("Error fetching toppings:", error);
      }
    };

    fetchToppings();
  }, []);

  // 👀 Toggle Visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/toppings/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });

      if (!response.ok) throw new Error("Failed to update visibility");

      setToppings((prev) =>
        prev.map((topping) => (topping.id === id ? { ...topping, visible: newVisible } : topping))
      );
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  // 🔄 Toggle In Stock / Out of Stock
  const toggleStock = async (id, currentStock) => {
    const newStock = currentStock === 1 ? 0 : 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/toppings/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stock: newStock }),
      });

      if (!response.ok) throw new Error("Failed to update stock status");

      setToppings((prev) =>
        prev.map((topping) => (topping.id === id ? { ...topping, stock: newStock } : topping))
      );
    } catch (error) {
      console.error("Error updating stock status:", error);
    }
  };

  // 🗑️ Delete a Topping
  const deleteTopping = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this topping?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/toppings/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete topping");

      setToppings((prev) => prev.filter((topping) => topping.id !== id));
      alert("✅ Topping deleted successfully!");
    } catch (error) {
      console.error("Error deleting topping:", error);
      alert("❌ Error deleting topping.");
    }
  };

  return (
    <div className="admin-section">
      <h2>Toppings</h2>
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
          {toppings.map((topping) => (
            <tr key={topping.id}>
              <td>{topping.name}</td>
              <td>
                <button
                  className={`stock-toggle ${topping.stock ? "button-in-stock" : "button-out-of-stock"}`}
                  onClick={() => toggleStock(topping.id, topping.stock)}
                >
                  {topping.stock ? "In Stock" : "OOS"}
                </button>
              </td>
              <td>
                <button
                  className={`visibility-toggle ${topping.visible ? "visible" : "hidden"}`}
                  onClick={() => toggleVisibility(topping.id, topping.visible)}
                >
                  {topping.visible ? "Visible" : "Hidden"}
                </button>
              </td>
              <td>
                <button className="delete-button" onClick={() => deleteTopping(topping.id)}>
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

export default AdminToppings;
