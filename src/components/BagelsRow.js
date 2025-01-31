import React from 'react';
import '../css/BagelsRow.css';

const BagelsRow = ({ bagels }) => {
  if (!bagels || bagels.length === 0) return <p>No bagels available</p>;

  return (
    <div className="section-card">
      <div className="section-title">Bagels</div>
      <ul className="bagels-list">
        {bagels.map((bagel, index) => (
          <li key={index} className="bagel-item">
            {bagel.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BagelsRow;
