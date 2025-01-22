import React from 'react';
import './css/global.css';
import Header from './components/Header';
import BagelsRow from './components/BagelsRow';
import CreamCheeseAndAddOns from './components/CreamCheeseAndAddOns';
import BreakfastSandwiches from './components/BreakfastSandwiches';
import PremiumSandwiches from './components/PremiumSandwiches';
import CoffeeAndShirts from './components/CoffeeAndShirts';
import { menuData } from './data';

const App = () => {
  return (
    <div className="container">
      {/* Bagels Section */}
      <div className="bagels section-card">
        <BagelsRow bagels={menuData.bagels} />
      </div>

      {/* Logo Section */}
      <div className="logo section-card">
        <h1>BB</h1>
      </div>

      {/* Breakfast Sandwiches Section */}
      <div className="breakfast section-card">
        <BreakfastSandwiches
          sandwiches={menuData.breakfastSandwiches}
          meats={menuData.meats}
          cheeses={menuData.cheeses}
        />
      </div>

      {/* Add-ons Section */}
      <div className="addons section-card">
        <CreamCheeseAndAddOns
          creamCheeseAndMore={menuData.creamCheeseAndMore}
          toppings={menuData.toppings}
        />
      </div>

      {/* Coffee & Extras Section */}
      <div className="coffee section-card">
        <CoffeeAndShirts />
      </div>

      {/* Premium Sandwiches Section */}
      <div className="premium section-card">
        <PremiumSandwiches sandwiches={menuData.premiumSandwiches} />
      </div>
    </div>
  );
};

export default App;
