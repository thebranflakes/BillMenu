import { menuData } from "../data.js";
import React from 'react';
import '../css/BreakfastSandwiches.css';

const BreakfastSandwiches = ({ sandwiches }) => {
  return (
    <div className="breakfast-section">
      <h2>Breakfast Sandwiches</h2>
      {sandwiches.map((sandwich) => (
        <div key={sandwich} className="breakfast-item">{sandwich}</div>
      ))}
    </div>
  );
};

export default BreakfastSandwiches;
