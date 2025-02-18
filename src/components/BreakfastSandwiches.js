import React from 'react';
import '../css/BreakfastSandwiches.css';

const BreakfastSandwiches = ({ sandwiches, meats, cheeses }) => {
  return (
    <div className="section-card">
      <div className="section-title">Breakfast Sandwiches</div>

    <br></br>
      <ul className="sandwich-list">
        {sandwiches.map((sandwich, index) => (
          <li key={index} className="sandwich-item">
            <span>{sandwich.name}</span>
            <span className="dots"></span>
            <span>${sandwich.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>

      {/* Meats & Cheeses Sections Stacked */}
      <div className="subsections">
        <div className="meats-section">
          <h3 className="meats-title">Meats</h3>
          <ul className="meats-list">
            {meats.map((meat, index) => (
              <li key={index}>{meat.name}</li>
            ))}
          </ul>
        </div>

        <div className="cheeses-section">
          <h3 className="cheeses-title">Cheeses</h3>
          <ul className="cheeses-list">
            {cheeses.map((cheese, index) => (
              <li key={index}>{cheese.name}</li>
            ))}
          </ul>
        </div>

      <div className="additional-info">
        <span>All sandwiches come with House Aioli.</span>
        <span>Salt, Pepper, Ketchup & Hot Sauce Available.</span>
      </div>

      </div>
    </div>
  );
};

export default BreakfastSandwiches;
