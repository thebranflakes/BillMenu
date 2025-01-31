import React from 'react';
import '../css/BreakfastSandwiches.css';

const BreakfastSandwiches = ({ sandwiches, meats, cheeses }) => {
  return (
    <div className="section-card">
      <div className="section-title">Breakfast Sandwiches</div>
        <ul className="sandwich-list">
          {sandwiches.map((sandwich, index) => (
            <li key={index} className="sandwich-item">
              {sandwich.name} - ${sandwich.price.toFixed(2)}
            </li>
          ))}
        </ul>

        <div className="subsections">
          <div className="meats-section">
            <h3>Meats</h3>
            <ul className="meats-list">
              {meats.map((meat, index) => (
                <li key={index} className="meat-item">{meat.name}</li>
              ))}
            </ul>
          </div>
          <div className="cheeses-section">
            <h3>Cheeses</h3>
            <ul className="cheeses-list">
              {cheeses.map((cheese, index) => (
                <li key={index} className="cheese-item">{cheese.name}</li>
              ))}
            </ul>
          </div>
        </div>
    </div>
  );
};

export default BreakfastSandwiches;
