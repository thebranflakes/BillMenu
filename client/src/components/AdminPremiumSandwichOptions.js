import React, { useEffect, useState } from "react";
import "../css/AdminTables.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AdminPremiumSandwichOptions = () => {
  const [options, setOptions] = useState([]);

  // Fetch all premium sandwich options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/premium_sandwich_options`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch premium sandwich options");

        const data = await response.json();

        // Group options by sandwich name
        const groupedOptions = data.reduce((acc, option) => {
          if (!acc[option.sandwich_name]) {
            acc[option.sandwich_name] = [];
          }
          acc[option.sandwich_name].push(option);
          return acc;
        }, {});

        setOptions(groupedOptions);
      } catch (error) {
        console.error("Error fetching premium sandwich options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Toggle visibility
  const toggleVisibility = async (id, currentVisible) => {
    const newVisible = currentVisible === 1 ? 0 : 1;
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/premium_sandwich_options/${id}/visibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ visible: newVisible }),
      });
  
      if (!response.ok) throw new Error("Failed to update visibility");
  
      // 🔹 ✅ Force React to update the state immediately
      setOptions((prev) => {
        const updatedOptions = { ...prev };
        for (const sandwich in updatedOptions) {
          updatedOptions[sandwich] = updatedOptions[sandwich].map((opt) =>
            opt.id === id ? { ...opt, visible: newVisible } : opt
          );
        }
        return updatedOptions;
      });
  
      console.log(`✅ Updated visibility for ID ${id}: ${newVisible}`);
  
    } catch (error) {
      console.error("❌ Error updating visibility:", error);
    }
  };
  
  
  

  // Delete option
  const deleteOption = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this option?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/premium_sandwich_options/${id}/delete`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete option");

      setOptions((prev) => {
        const updatedOptions = { ...prev };
        for (const sandwich in updatedOptions) {
          updatedOptions[sandwich] = updatedOptions[sandwich].filter((opt) => opt.id !== id);
        }
        return updatedOptions;
      });

      alert("✅ Option deleted successfully!");
    } catch (error) {
      console.error("Error deleting option:", error);
      alert("❌ Error deleting option.");
    }
  };

  return (
    <div className="premium-sandwich-options-section">
      <h2>Premium Sandwich Options</h2>
      <div className="premium-sandwich-container">
        {Object.keys(options).map((sandwich) => (
          <div key={sandwich} className="premium-sandwich-group">
            <h3>{sandwich}</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Visible</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {options[sandwich].map((option) => (
                  <tr key={option.id}>
                    <td>{option.type}</td>
                    <td>
                      <button
                        className={`visibility-toggle ${option.visible ? "visible" : "hidden"}`}
                        onClick={() => toggleVisibility(option.id, option.visible)}
                      >
                        {option.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => deleteOption(option.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPremiumSandwichOptions;
