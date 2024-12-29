import { menuData } from "../data.js";
import React from 'react';
import '../css/BagelsRow.css';

const BagelsRow = ({ bagels }) => {
    console.log("Bagels prop:", bagels);
    if (!bagels) return <p>No bagels available</p>;
  
    return (
      <div>
        <h2>Bagels</h2>
        <ul>
          {bagels.map((bagel, index) => (
            <li key={index}>{bagel.name}</li>
          ))}
        </ul>
      </div>
    );
  };

export default BagelsRow;
