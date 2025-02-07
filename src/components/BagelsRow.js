import React from 'react';
import '../css/BagelsRow.css';
import soldOutImage from '../assets/soldout.png';

const BagelsRow = ({ bagels }) => {
  if (!bagels || bagels.length === 0) return <p>No bagels available</p>;

  return (
    <div className="section-card">
      <div className="section-title">Bagels</div>
      <ul className="bagels-list">
        {bagels.map((bagel, index) => (
          <li
            key={index}
            className={`bagel-item ${bagel.stock !== 1 ? 'out-of-stock' : ''}`}
          >
            {bagel.name}
            {bagel.stock !== 1 && (
              <img
                src={soldOutImage}
                alt="SOLD OUT"
                className="sold-out-overlay"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BagelsRow;
