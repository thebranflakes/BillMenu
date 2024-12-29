const BreakfastSandwiches = ({ sandwiches }) => {
    if (!sandwiches || sandwiches.length === 0) return <p>No sandwiches available</p>;
  
    return (
      <div>
        <h2>Breakfast Sandwiches</h2>
        <ul>
          {sandwiches.map((sandwich, index) => (
            <li key={index}>{sandwich.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default BreakfastSandwiches;
  