import React from 'react';
import '../css/BagelsRow.css';

const BagelsRow = ({ bagels }) => {
  console.log("Bagels prop: ", bagels);

  // Check for undefined or empty bagels array
  if (!bagels || bagels.length === 0) return <p>No bagels available</p>;

  return (
    <div className="section-card">
      <h2>Bagels</h2>
      <ul className="bagels-list">
        {bagels.map((bagel, index) => (
          <li key={index} className="bagel-item">{bagel.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default BagelsRow;
