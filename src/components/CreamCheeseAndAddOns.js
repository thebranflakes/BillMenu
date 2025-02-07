import React from 'react';
import PropTypes from 'prop-types';
import '../css/CreamCheeseAndAddOns.css';
import Toppings from './Toppings';

const CreamCheeseAndAddOns = ({ creamCheeseAndMore, toppings }) => {
  return (
    <div className="addons">
      <div className="section-title">Cream Cheese & More</div>
      <div className="addons-card">
        {/* Cream Cheese Section */}
        <div className="cream-cheese-section">
        <ul className="cream-cheese-list">
          {creamCheeseAndMore.map((option, index) => (
            <li key={index} className="cream-cheese-item">
              <span>{option.name}</span>
              <span className="dots"></span>
              <span>${option.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
            {/* Toppings Section */}
          <div className="toppings-section">
          <Toppings toppings={toppings} />
        </div>
        </div>
      </div>
    </div>
  );
};

// Prop validation
CreamCheeseAndAddOns.propTypes = {
  creamCheeseAndMore: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  toppings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default CreamCheeseAndAddOns;
