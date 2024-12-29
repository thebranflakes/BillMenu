import React from 'react';
import './css/global.css';
import Header from './components/Header';
import BagelsRow from './components/BagelsRow';
import CreamCheeseAndAddOns from './components/CreamCheeseAndAddOns';
import BreakfastSandwiches from './components/BreakfastSandwiches';
import SpecialtySandwiches from './components/SpecialtySandwiches';
import CoffeeAndShirts from './components/CoffeeAndShirts';
import Footer from './components/Footer';
import { menuData } from './data'; // Import menu data

const App = () => {
  return (
    <div className="container">
      <Header />
      <BagelsRow bagels={menuData.bagels} />
      <CreamCheeseAndAddOns items={menuData.creamCheeseAndAddOns} />
      <BreakfastSandwiches sandwiches={menuData.breakfastSandwiches} />
      <SpecialtySandwiches sandwiches={menuData.specialtySandwiches} />
      <CoffeeAndShirts />
      <Footer />
    </div>
  );
};

export default App;
