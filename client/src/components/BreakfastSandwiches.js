import React, { useEffect, useState } from "react";
import "../css/BreakfastSandwiches.css";
import soldOutImage from "../assets/soldout.png"; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BreakfastSandwiches = () => {
  const [sandwiches, setSandwiches] = useState([]);
  const [meats, setMeats] = useState([]);
  const [cheeses, setCheeses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const [sandwichesRes, meatsRes, cheesesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/breakfast_sandwiches`),
        fetch(`${API_BASE_URL}/api/meats`),
        fetch(`${API_BASE_URL}/api/cheeses`),
      ]);

      if (!sandwichesRes.ok || !meatsRes.ok || !cheesesRes.ok) {
        throw new Error("One or more requests failed.");
      }

      const [sandwichesData, meatsData, cheesesData] = await Promise.all([
        sandwichesRes.json(),
        meatsRes.json(),
        cheesesRes.json(),
      ]);

      setSandwiches(sandwichesData);
      setMeats(meatsData);
      setCheeses(cheesesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchData();

    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="section-card">
      <div className="section-title">Breakfast Sandwiches</div>

      <br />

      <ul className="sandwich-list">
        {sandwiches.map((sandwich, index) => (
          <li 
            key={index} 
            className={`sandwich-item ${sandwich.stock !== 1 ? 'out-of-stock' : ''}`}
          >
            <span>{sandwich.name}</span>
            <span className="dots"></span>
            <span>${sandwich.price.toFixed(2)}</span>

            {/* Sold Out Overlay */}
            {sandwich.stock !== 1 && (
              <img 
                src={soldOutImage} 
                alt="SOLD OUT" 
                className="sold-out-overlay"
              />
            )}
          </li>
        ))}
      </ul>

      {/* Meats & Cheeses Sections Stacked */}
      <div className="subsections">
        <div className="meats-section">
          <h3 className="meats-title">Meats</h3>
          <ul className="meats-list">
            {meats.map((meat, index) => (
              <li 
                key={index} 
                className={`meat-item ${meat.stock !== 1 ? 'out-of-stock' : ''}`}
              >
                {meat.name}
                {meat.stock !== 1 && (
                  <img 
                    src={soldOutImage} 
                    alt="SOLD OUT" 
                    className="sold-out-overlay-small"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="cheeses-section">
          <h3 className="cheeses-title">Cheeses</h3>
          <ul className="cheeses-list">
            {cheeses.map((cheese, index) => (
              <li 
                key={index} 
                className={`cheese-item ${cheese.stock !== 1 ? 'out-of-stock' : ''}`}
              >
                {cheese.name}
                {cheese.stock !== 1 && (
                  <img 
                    src={soldOutImage} 
                    alt="SOLD OUT" 
                    className="sold-out-overlay-small"
                  />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="additional-info">
          <span>All sandwiches come with House Aioli.</span>
          <span>Salt, Pepper, Ketchup & Hot Sauce Available.</span>
        </div>
      </div>
    </div>
  );
};

export default BreakfastSandwiches;
