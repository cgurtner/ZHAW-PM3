'use client'

import { useState, useEffect } from 'react';
import CuisineFilter from './CuisineFilter';
import RatingStars from './Amenity/RatingStars';

const LocationFetch = ({ setAmenity, selectedCuisine, onCuisineChange, setError }) => {
  const [location, setLocation] = useState();
  const [amenities, setAmenities] = useState([]);
  const [availableCuisines, setAvailableCuisines] = useState([]);

  useEffect(() => {
    if (location) {
      fetchAmenities(location.latitude, location.longitude, ['restaurant', 'cafe', 'fast_food', 'biergarten'], 1000);
    }
  }, [location, selectedCuisine]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser!');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = process.env.NEXT_PUBLIC_API_OVERWRITE_NEARBY_COORDS ?
          { 'latitude': 47.49729966574743, 'longitude': 8.729624890038204 } :
          position.coords;

        setLocation({ latitude, longitude });
        fetchAmenities(latitude, longitude, ['restaurant', 'cafe', 'fast_food', 'biergarten'], 1000);
      },
      () => {
        setError('Unable to retrieve your location!');
      }
    );
  }

  const fetchAmenities = async (lat, lon, types, distance) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_CLIENT_URL}nearby?lat=${lat}&lon=${lon}&types=${types.join(',')}&distance=${distance}`;
      const response = await fetch(url);
      let data = await response.json();
  
      let fetchedCuisines = data.flatMap(amenity =>
        amenity.cuisine?.split(';').map(cuisine => cuisine.trim().toLowerCase()) || []
      ).filter(Boolean);
  
      let uniqueCuisines = ['all', ...new Set(fetchedCuisines)];
      setAvailableCuisines(uniqueCuisines);
  
      if (selectedCuisine && selectedCuisine !== 'all') {
        data = data.filter(amenity =>
          amenity.cuisine?.toLowerCase().split(';').map(cuisine => cuisine.trim()).includes(selectedCuisine.toLowerCase())
        );
      }
  
      data.sort((a, b) => (b.averages?.overall || 0) - (a.averages?.overall || 0));
  
      setAmenities(data);
    } catch (err) {
      console.error('Error fetching amenities:', err);
    }
  };
  

  // useEffect(() => {
  //   setAmenity(5887023528)
  // });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-6">
        <button
          className="text-4xl bg-dark-dh hover:bg-light-dh text-white font-bold py-4 px-8"
          onClick={getLocation}
        >
          Nearby
        </button>
      </div>
      {amenities.length > 0 && (
        <div className="mt-4 w-full">
          <div className="flex justify-end mb-3">
            <CuisineFilter
              selectedCuisine={selectedCuisine}
              onCuisineChange={onCuisineChange}
              cuisines={availableCuisines}
            />
          </div>
          {amenities.map((amenity, index) => (
            <div
              className="w-full text-4xl bg-dark-dh text-white py-4 px-8 mb-2 flex justify-between hover:bg-light-dh transition hover:cursor-pointer duration-300 ease-in-out"
              key={amenity.id}
              onClick={() => setAmenity(amenity.id)}
            >
              <span>{amenity.name}</span>
              <div className="overall-rating">
                <RatingStars rating={amenity.averages.overall} />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  )
}

export default LocationFetch