const SpecialtySandwiches = ({ sandwiches }) => {
    if (!sandwiches || sandwiches.length === 0) return <p>No specialty sandwiches available</p>;
  
    return (
      <div>
        <h2>Specialty Sandwiches</h2>
        <ul>
          {sandwiches.map((sandwich, index) => (
            <li key={index}>{sandwich.name}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default SpecialtySandwiches;
  