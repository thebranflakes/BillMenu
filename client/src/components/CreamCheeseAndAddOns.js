import React, { useEffect, useState } from "react";
import "../css/CreamCheeseAndAddOns.css";
import Toppings from "./Toppings";
import soldOutImage from "../assets/soldout.png"; // Import Sold Out image
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreamCheeseAndAddOns = () => {
  const [creamCheese, setCreamCheese] = useState([]);
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Cream Cheese & Toppings Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [creamCheeseRes, toppingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/cream_cheese`),
          fetch(`${API_BASE_URL}/api/toppings`)
        ]);
  
        if (!creamCheeseRes.ok || !toppingsRes.ok) {
          throw new Error(`API error: ${creamCheeseRes.status} & ${toppingsRes.status}`);
        }
  
        const [creamCheeseData, toppingsData] = await Promise.all([
          creamCheeseRes.json(),
          toppingsRes.json()
        ]);
  
        setCreamCheese(creamCheeseData);
        setToppings(toppingsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="addons">
      <div className="section-title">Cream Cheese & More</div>
      <div className="addons-card">
        {/* Cream Cheese Section */}
        <div className="cream-cheese-section">
          <ul className="cream-cheese-list">
            {creamCheese.map((option, index) => (
              <li 
                key={index} 
                className={`cream-cheese-item ${option.stock !== 1 ? 'out-of-stock' : ''}`}
              >
                <span>{option.name}</span>
                <span className="dots"></span>
                <span>${option.price.toFixed(2)}</span>

                {/* Sold Out Overlay */}
                {option.stock !== 1 && (
                  <img
                    src={soldOutImage}
                    alt="SOLD OUT"
                    className="sold-out-overlay"
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Toppings Section */}
          <div className="toppings-section">
            <Toppings toppings={toppings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreamCheeseAndAddOns;
