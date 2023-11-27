'use client'

import { useState } from 'react';
import NavBar from './NavBar';
import LocationFetch from './LocationFetch';
import Amenity from './amenity/page';
import CuisineFilter from './CuisineFilter';

export default function Home() {
  const [amenity, setAmenity] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('all'); 
  const [error, setError] = useState('');

  const fetchAmenity = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}amenity/${id}`)
      const data = await response.json()
      setAmenity(data);
    } catch (err) {
      setError('Error fetching amenities!');
    }
  }

  const PageComponent = amenity ? <PageAmenity amenity={amenity} /> : <PageNearby fetchAmenity={fetchAmenity} />

  return (
    <main>
      <NavBar amenity={amenity} setAmenity={setAmenity} />
      {/* CuisineFilter is removed from here */}
      <div className="flex justify-center">
        {amenity ? (
          <PageAmenity amenity={amenity} />
        ) : (
          <PageNearby
            fetchAmenity={fetchAmenity}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            setError={setError}
          />
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </main>
  );
}

const PageNearby = ({ fetchAmenity, selectedCuisine, onCuisineChange, setError }) => (
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
          setError={setError}
        />
      </div>
    </div>
  </div>
);

const PageAmenity = ({ amenity }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <div className="flex mb-12">
        <Amenity amenity={amenity} />
      </div>
    </div>
  </div>
)