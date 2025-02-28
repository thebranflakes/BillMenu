import React, { useState, useEffect } from 'react';
import '../css/CoffeeAndShirts.css';
import BagelCarousel from './BagelCarousel'; 
import soldOutImage from '../assets/soldout.png'; 
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CoffeeAndExtras = () => {
  const [extras, setExtras] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch extras data from the API
  const fetchExtras = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/extras`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setExtras(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching extras:", error);
    }
  };

  useEffect(() => {
    // Fetch immediately on mount
    fetchExtras();

    // Set up polling every 30 seconds
    const intervalId = setInterval(() => {
      fetchExtras();
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="section-card">
      <div className="section-title">Coffee & Extras</div>

      <br />

      <ul className="extras-list">
        {extras.map((item, index) => {
          const isSoldOut = item.stock !== 1;

          if (item.name === 'Precipice Coffee') {
            return (
              <li key={index} className="extras-item coffee-label">
                {item.name}
              </li>
            );
          }

          if (item.name === 'Hot' || item.name === 'Cold Brew') {
            return (
              <li key={index} className={`extras-item sub-item ${isSoldOut ? 'out-of-stock' : ''}`}>
                <span>{item.name}</span>
                <span className="dots"></span>
                <span>${item.price.toFixed(2)}</span>
                {isSoldOut && (
                  <img
                    src={soldOutImage}
                    alt="SOLD OUT"
                    className="sold-out-overlay"
                  />
                )}
              </li>
            );
          }

          return (
            <li key={index} className={`extras-item ${isSoldOut ? 'out-of-stock' : ''}`}>
              <span>{item.name}</span>
              <span className="dots"></span>
              <span>${item.price.toFixed(2)}</span>
              {isSoldOut && (
                <img
                  src={soldOutImage}
                  alt="SOLD OUT"
                  className="sold-out-overlay"
                />
              )}
            </li>
          );
        })}
      </ul>

      <br />
      <br />

      <BagelCarousel /> 
    </div>
  );
};

export default CoffeeAndExtras;
