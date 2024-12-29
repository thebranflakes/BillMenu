import { menuData } from "../data.js";
import React from 'react';
import '../css/SpecialtySandwiches.css';

const SpecialtySandwiches = ({ sandwiches }) => {
  return (
    <div className="specialty-sandwiches">
      {sandwiches.map((sandwich) => (
        <div key={sandwich} className="sandwich-item">{sandwich}</div>
      ))}
    </div>
  );
};

export default SpecialtySandwiches;
