import React from 'react';

const CuisineFilter = ({ selectedCuisine, onCuisineChange }) => {
    const cuisines = ['all', 'regional', 'italian', 'kebab', 'asian', 'mexican', 'chinese'];

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
  
    return (
      <div className="cuisine-filter">
        <select 
          className="text-4xl bg-dark-dh hover:bg-light-dh text-white font-bold py-4 px-8 cursor-pointer"
          style={{ transform: 'scale(0.75)', width: 'auto', minWidth: '300px' }}
          value={selectedCuisine} 
          onChange={(e) => onCuisineChange(e.target.value)}
        >
          {cuisines.map(cuisine => (
            <option key={cuisine} value={cuisine}>{capitalizeFirstLetter(cuisine)}</option>
          ))}
        </select>
      </div>
    );
};

export default CuisineFilter;
