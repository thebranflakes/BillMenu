import React, { useEffect, useState } from "react";
import "../css/BagelsRow.css";
import soldOutImage from "../assets/soldout.png";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BagelsRow = () => {
  const [bagels, setBagels] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/bagels`) // ✅ Uses environment variable for API base URL
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setBagels(data))
      .catch((err) => console.error("Error fetching bagels:", err));
  }, []);

  if (!bagels.length) return <p>Loading bagels...</p>;

  return (
    <div className="section-card">
      <div className="section-title">Bagels</div>

      <ul className="bagels-list">
        {bagels.map((bagel, index) => (
          <li key={index} className={`bagel-item ${bagel.stock !== 1 ? "out-of-stock" : ""}`}>
            {bagel.name}
            {bagel.stock !== 1 && <img src={soldOutImage} alt="SOLD OUT" className="sold-out-overlay" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BagelsRow;
