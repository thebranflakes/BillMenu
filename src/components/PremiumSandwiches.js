import React, { useEffect, useState } from 'react';
import '../css/PremiumSandwiches.css';
import soldOutImage from "../assets/soldout.png"; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PremiumSandwiches = () => {
  const [sandwiches, setSandwiches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSandwiches = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/premium_sandwiches`);
        if (!response.ok) {
          throw new Error(`Failed to fetch sandwiches, status: ${response.status}`);
        }
        const data = await response.json();
        setSandwiches(data);
      } catch (error) {
        console.error("Error fetching premium sandwiches:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSandwiches();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!sandwiches || sandwiches.length === 0) {
    return <p style={{ color: "red" }}>No sandwiches found!</p>;
  }

  return (
    <div className="section-card">
      <h2 className="section-title">Premium Sandwiches</h2>
      <div className="premium-sandwiches">
        {sandwiches.map((sandwich, index) => (
          <div key={index} className={`sandwich-card ${sandwich.stock === 0 ? "out-of-stock" : ""}`}>
            <h3>{sandwich.name}</h3>
            <p>{sandwich.description}</p>

            {sandwich.options && sandwich.options.length > 0 ? (
              <ul className="sandwich-options">
                {sandwich.options.map((option, idx) => (
                  <li key={idx}>
                    <span>{option.type}</span>
                    <span className="dots"></span>
                    <span>${option.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Price: ${sandwich.price?.toFixed(2)}</p>
            )}

            {/* Sold Out Overlay */}
            {sandwich.stock === 0 && (
              <img
              src={soldOutImage}
              alt="SOLD OUT"
              className="sold-out-overlay"
            />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumSandwiches;
