'use client'

import { useState } from 'react';
import NavBar from './NavBar';
import LocationFetch from './LocationFetch';
import Amenity from './Amenity/Amenity';

export default function Home() {
  const [amenity, setAmenity] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [location, setLocation] = useState(null);
  const [allAmenitiesData, setAllAmenitiesData] = useState([]);

  const fetchAmenity = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}amenity/${id}`);
      const data = await response.json();
      setAmenity(data);
    } catch (err) {
      console.error('Error fetching amenities!', err);
    }
  }

  return (
    <main>
      <NavBar amenity={amenity} setAmenity={setAmenity} />
      <div className="flex justify-center">
        {amenity ? (
          <PageAmenity amenity={amenity} location={location} allAmenitiesData={allAmenitiesData} />
        ) : (
          <PageNearby
            fetchAmenity={fetchAmenity}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            location={location}
            setLocation={setLocation}
            setAllAmenitiesData={setAllAmenitiesData}
          />
        )}
      </div>
    </main>
  );
}

const PageNearby = ({ fetchAmenity, selectedCuisine, onCuisineChange, location, setLocation, setAllAmenitiesData }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <div className="flex justify-center text-8xl mb-12 font-semibold">
        <h1>Welcome!</h1>
      </div>
      <div className="flex justify-center text-4xl mb-12">
        <h2>You give us a click, we give you a dining experience!</h2>
      </div>
      <div className="flex justify-center mb-12">
        <LocationFetch
          setAmenity={fetchAmenity}
          selectedCuisine={selectedCuisine}
          onCuisineChange={onCuisineChange}
          location={location}
          setLocation={setLocation}
          setAllAmenitiesData={setAllAmenitiesData}
        />
      </div>
    </div>
  </div>
);

const PageAmenity = ({ amenity, location, allAmenitiesData }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <div className="flex mb-12">
        <Amenity 
          amenity={amenity} 
          myLocation={location} 
          allAmenitiesData={allAmenitiesData}
        />
      </div>
    </div>
  </div>
);
