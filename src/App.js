import React from 'react';
import './css/global.css';
import Header from './components/Header';
import BagelsRow from './components/BagelsRow';
import CreamCheeseAndAddOns from './components/CreamCheeseAndAddOns';
import BreakfastSandwiches from './components/BreakfastSandwiches';
import SpecialtySandwiches from './components/SpecialtySandwiches';
import CoffeeAndShirts from './components/CoffeeAndShirts';
import Footer from './components/Footer';
import { menuData } from './data';

const App = () => {
  return (
    <div className="container">
      {/* Bagels Section */}
      <div className="bagels">
        <Header />
        <BagelsRow bagels={menuData.bagels} />
        <CreamCheeseAndAddOns items={menuData.creamCheeseAndAddOns} />
      </div>

      {/* Sandwiches Section */}
      <div className="sandwiches">
        <h2>Sandwiches</h2>
        <BreakfastSandwiches sandwiches={menuData.breakfastSandwiches} />
      </div>

      {/* Specialties Section */}
      <div className="specialties">
        <h2>Specialties</h2>
        <SpecialtySandwiches sandwiches={menuData.specialtySandwiches} />
      </div>

      {/* Add-Ons Section */}
      <div className="addons">
        <h2>Add-Ons</h2>
        <CreamCheeseAndAddOns items={menuData.addOns} />
      </div>

      {/* Coffee and Extras Section */}
      <div className="coffee">
        <CoffeeAndShirts />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
