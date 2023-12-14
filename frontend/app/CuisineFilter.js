const CuisineFilter = ({ selectedCuisine, onCuisineChange, cuisines }) => {
  return (
    <div className="cuisine-filter">
      <select
        className="text-xl md:text-2xl bg-dark-dh hover:bg-light-dh text-white font-bold py-2 px-4 cursor-pointer"
        value={selectedCuisine} 
        onChange={(e) => onCuisineChange(e.target.value)}
      >
        {cuisines.map(cuisine => (
          <option key={cuisine} value={cuisine}>{(cuisine == 'All' ? 'Alle' : cuisine)}</option>
        ))}
      </select>
    </div>
  );
};

export default CuisineFilter;

