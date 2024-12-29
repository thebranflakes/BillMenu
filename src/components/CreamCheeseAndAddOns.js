const CreamCheeseAndAddOns = ({ items }) => {
    if (!items || items.length === 0) return <p>No items available</p>;
  
    return (
      <div>
        <h2>Cream Cheese & Add-Ons</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default CreamCheeseAndAddOns;
  