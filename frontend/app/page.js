'use client'

import { useState } from 'react';
import NavBar from './NavBar';
import LocationFetch from './LocationFetch';
import Amenity from './Amenity/Amenity';

export default function Home() {
  const [amenity, setAmenity] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [location, setLocation] = useState();

  const fetchAmenity = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}amenity/${id}`)
      const data = await response.json()
      setAmenity(data);
    } catch (err) {
      console.error('Error fetching amenities!');
    }
  }

  return (
    <main>
      <NavBar amenity={amenity} setAmenity={setAmenity} />
      <div className="flex justify-center">
        {amenity ? (
          <PageAmenity amenity={amenity} location={location} />
        ) : (
          <PageNearby
            fetchAmenity={fetchAmenity}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            location={location}
            setLocation={setLocation}
          />
        )}
      </div>
    </main>
  );
}

const PageNearby = ({ fetchAmenity, selectedCuisine, onCuisineChange, location, setLocation }) => (
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
        />
      </div>
    </div>
  </div>
);

const PageAmenity = ({ amenity, location }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <div className="flex mb-12">
        <Amenity amenity={amenity} myLocation={location} />
      </div>
    </div>
  </div>
)