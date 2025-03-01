import React, { useEffect, useState } from "react";
import "../css/Toppings.css";
import soldOutImage from "../assets/soldout.png"; // Import Sold Out overlay image
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Toppings = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch toppings data
  const fetchToppings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/toppings`);
      if (!response.ok) {
        throw new Error(`Failed to fetch toppings, status: ${response.status}`);
      }
      const data = await response.json();
      setToppings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching toppings:", error);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchToppings();

    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchToppings();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!toppings || toppings.length === 0) {
    return <p className="no-toppings">No toppings available</p>;
  }

  return (
    <div className="section">
      <div className="toppings-title">Toppings</div>
      <div className="toppings-section">
        <ul className="toppings-list">
          {toppings.map((topping, index) => (
            <li key={index} className={`topping-item ${topping.stock === 0 ? "out-of-stock" : ""}`}>
              {topping.name} - ${topping.price.toFixed(2)}
              {topping.stock === 0 && <img src={soldOutImage} alt="SOLD OUT" className="sold-out-overlay" />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Toppings;
