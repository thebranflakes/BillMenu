import { menuData } from "../data.js";
import React from 'react';
import '../css/CreamCheeseAndAddOns.css';

const CreamCheeseAndAddOns = ({ items }) => {
  return (
    <div className="cream-cheese-section">
      <h2>Cream Cheese & Add-Ons</h2>
      <div className="add-ons">
        {items.map((item) => (
          <div key={item} className="add-on-item">{item}</div>
        ))}
      </div>
    </div>
  );
};

export default CreamCheeseAndAddOns;
