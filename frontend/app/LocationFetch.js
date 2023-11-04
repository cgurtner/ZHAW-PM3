'use client'

import React, { useState, useEffect } from 'react';
import CuisineFilter from './CuisineFilter';

const LocationFetch = ({ setAmenity, selectedCuisine, onCuisineChange, setError }) => {
    const [location, setLocation] = useState();
    const [amenities, setAmenities] = useState([]);

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

            if (selectedCuisine && selectedCuisine !== 'all') {
                data = data.filter(amenity => amenity.cuisine?.toLowerCase() === selectedCuisine.toLowerCase());
            }

            setAmenities(data);
        } catch (err) {
            console.error('Error fetching amenities:', err);
            setError('Error fetching amenities!');
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
          <div className="mb-4">
            <button
              className="text-4xl bg-dark-dh hover:bg-light-dh text-white font-bold py-4 px-8"
              onClick={getLocation}
            >
              Nearby
            </button>
          </div>
          <p className="text-xl mb-2 font-semibold text-center">What type of food are you looking for?</p>
          <div className="mb-6">
            <CuisineFilter
              selectedCuisine={selectedCuisine}
              onCuisineChange={onCuisineChange}
            />
          </div>
          {amenities.length > 0 && (
            <div className="mt-4 w-full">
              <div className="flex justify-center">
                <h2 className="text-2xl text-4xl mb-6 font-medium">Locations</h2>
              </div>
              {amenities.map((amenity, index) => (
                <div
                  className="w-full text-4xl bg-dark-dh text-white py-4 px-8 mb-2 flex justify-between hover:bg-light-dh transition hover:cursor-pointer duration-300 ease-in-out"
                  key={amenity.id}
                  onClick={() => setAmenity(amenity.id)}
                >
                  <span>{amenity.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )      
}

export default LocationFetch