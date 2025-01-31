import React from 'react';
import '../css/Toppings.css';

const Toppings = ({ toppings }) => {
  if (!toppings || toppings.length === 0) return <p>No toppings available</p>;

  return (
    <div className="section">
      <div className="toppings-title">Toppings</div>
      <ul className="toppings-list">
        {toppings.map((topping, index) => (
          <li key={index} className="topping-item">
            {topping.name} - ${topping.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Toppings;
