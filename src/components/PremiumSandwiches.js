import React from 'react';
import '../css/PremiumSandwiches.css';

const PremiumSandwiches = ({ sandwiches }) => {
  return (
    <div className="section-card">
      <h2 className="section-title">Premium Sandwiches</h2>
      <div className="premium-sandwiches">
        {sandwiches.map((sandwich, index) => (
          <div key={index} className="sandwich-card">
            <h3>{sandwich.name}</h3>
            <p>{sandwich.description}</p>
            {sandwich.options ? (
              <ul className="sandwich-options">
                {sandwich.options.map((option, idx) => (
                  <li key={idx}>
                    <span>{option.type}</span>
                    <span className="dots"></span>
                    <span>${option.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Price: ${sandwich.price.toFixed(2)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumSandwiches;
