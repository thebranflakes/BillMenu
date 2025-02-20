import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AddItem.css"; // Import styles

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AddItem = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("bagels");
  const [formData, setFormData] = useState({ name: "", price: "", description: "", type: "", sandwich_id: "" });
  const [sandwiches, setSandwiches] = useState([]); // Stores existing sandwiches

  // Define form fields per category
  const formFields = {
    bagels: ["name"],
    cream_cheese: ["name", "price"],
    toppings: ["name", "price"],
    breakfast_sandwiches: ["name", "price"],
    meats: ["name"],
    cheeses: ["name"],
    extras: ["name", "price"],
    premium_sandwiches: ["name", "description"],
    premium_sandwich_options: ["sandwich_id", "type", "price"],
  };

  // Fetch existing sandwiches when "Premium Sandwich Options" is selected
  useEffect(() => {
    if (category === "premium_sandwich_options") {
      fetch(`${API_BASE_URL}/api/premium_sandwiches`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setSandwiches(data))
        .catch((err) => console.error("Error fetching sandwiches:", err));
    }
  }, [category]);

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => formFields[category].includes(key) && value.trim() !== "")
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/${category}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(filteredData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`✅ Successfully added "${formData.name || formData.type}" to ${category}!`);
        setFormData({ name: "", price: "", description: "", type: "", sandwich_id: "" });
        navigate("/admin");
      } else {
        alert(`❌ Failed to add item: ${data.message}`);
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("❌ Error adding item.");
    }
  };

  return (
    <div className="add-item-container">
      <h2>Add New Item</h2>

      {/* Category Selection Dropdown */}
      <label>Choose a category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {Object.keys(formFields).map((key) => (
          <option key={key} value={key}>
            {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        {formFields[category].map((field) => (
          <div key={field}>
            <label>{field.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}:</label>
            
            {/* Dropdown for Sandwich ID when "Premium Sandwich Options" is selected */}
            {category === "premium_sandwich_options" && field === "sandwich_id" ? (
              <select name="sandwich_id" value={formData.sandwich_id} onChange={handleInputChange} required>
                <option value="">Select a Sandwich</option>
                {sandwiches.map((sandwich) => (
                  <option key={sandwich.id} value={sandwich.id}>
                    {sandwich.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field === "price" ? "number" : "text"}
                name={field}
                value={formData[field] || ""}
                onChange={handleInputChange}
                required
              />
            )}
          </div>
        ))}

        <button type="submit">Add {category.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}</button>
      </form>

      <button className="back-btn" onClick={() => navigate("/admin")}>
        ⬅️ Back to Admin
      </button>
    </div>
  );
};

export default AddItem;
