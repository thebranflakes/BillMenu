import React from 'react';
import '../css/CoffeeAndShirts.css';

const CoffeeAndExtras = ({ extras }) => {
  return (
    <div className="section-card">
      <div className="section-title">Coffee & Extras</div>
      <ul className="extras-list">
        {extras.map((item, index) => {
          if (item.name === 'Precipice Coffee') {
            return (
              <React.Fragment key={index}>
                <li className="extras-item">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)}</span>
                </li>
                {/* Add sub-items explicitly for Precipice Coffee */}
                <li className="sub-item">
                  <span>Hot</span>
                  <span>$2.00</span>
                </li>
                <li className="sub-item">
                  <span>Cold Brew</span>
                  <span>$4.00</span>
                </li>
              </React.Fragment>
            );
          }
          // Exclude "Hot" and "Cold Brew" from rendering again
          if (item.name === 'Hot' || item.name === 'Cold Brew') {
            return null;
          }
          return (
            <li key={index} className="extras-item">
              <span>{item.name}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CoffeeAndExtras;
