import { menuData } from "../data.js";
import React from 'react';
import '../css/BagelsRow.css';

const BagelsRow = ({ bagels }) => {
  return (
    <div className="bagels-row">
      {bagels.map((bagel) => (
        <div key={bagel} className="bagel-item">{bagel}</div>
      ))}
    </div>
  );
};

export default BagelsRow;
