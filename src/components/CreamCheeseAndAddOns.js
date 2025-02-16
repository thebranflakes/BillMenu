import React from 'react';
import PropTypes from 'prop-types';
import '../css/CreamCheeseAndAddOns.css';
import Toppings from './Toppings';
import soldOutImage from '../assets/soldout.png'; // Import Sold Out image

const CreamCheeseAndAddOns = ({ creamCheeseAndMore, toppings }) => {
  return (
    <div className="addons">
      <div className="section-title">Cream Cheese & More</div>
      <div className="addons-card">
        {/* Cream Cheese Section */}
        <div className="cream-cheese-section">
          <ul className="cream-cheese-list">
            {creamCheeseAndMore.map((option, index) => (
              <li 
                key={index} 
                className={`cream-cheese-item ${option.stock !== 1 ? 'out-of-stock' : ''}`}
              >
                <span>{option.name}</span>
                <span className="dots"></span>
                <span>${option.price.toFixed(2)}</span>

                {/* Sold Out Overlay */}
                {option.stock !== 1 && (
                  <img
                    src={soldOutImage}
                    alt="SOLD OUT"
                    className="sold-out-overlay"
                  />
                )}
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
      stock: PropTypes.number.isRequired, // Ensure stock is checked
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
