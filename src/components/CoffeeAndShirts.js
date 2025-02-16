import React from 'react';
import '../css/CoffeeAndShirts.css';
import BagelCarousel from './BagelCarousel'; // Import the carousel

const CoffeeAndExtras = ({ extras }) => {
  return (
    <div className="section-card">
      <div className="section-title">Coffee & Extras</div>

      <br></br>

      <ul className="extras-list">
        {extras.map((item, index) => {
          if (item.name === 'Precipice Coffee') {
            return (
              <li key={index} className="extras-item coffee-label">
                {item.name}
              </li>
            );
          }

          if (item.name === 'Hot' || item.name === 'Cold Brew') {
            return (
              <li key={index} className="extras-item sub-item">
                <span>{item.name}</span>
                <span className="dots"></span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            );
          }

          return (
            <li key={index} className="extras-item">
              <span>{item.name}</span>
              <span className="dots"></span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          );
        })}
      </ul>

      <br></br>
      <br></br>
      <br></br>

      <BagelCarousel />

    </div>
  );
};

export default CoffeeAndExtras;
