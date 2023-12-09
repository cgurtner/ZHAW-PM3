'use client'

import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import LocationFetch from './LocationFetch';
import Amenity from './Amenity/Amenity';

export default function Home() {
  const [amenity, setAmenity] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [location, setLocation] = useState();
  const [inLocation, setInLocation] = useState();

  const fetchAmenity = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}amenity/${id}`)
      const data = await response.json()
      setAmenity(data);
    } catch (err) {
      console.error('Error fetching amenities!');
    }
  }

  const searchInLocation = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_CLIENT_URL}nearby?lat=${location.latitude}&lon=${location.longitude}&types=${['restaurant', 'cafe', 'fast_food', 'biergarten'].join(',')}&distance=5`;
    const response = await fetch(url);
    let data = await response.json();
    if (data.length > 0) {
      setInLocation(data[0])
    }
  }

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
      },
      () => {
        console.err('Unable to retrieve your location!');
      }
    );
  }

  useEffect(() => {
    if (!location) {
      getLocation()
      return
    }
    if (!inLocation) {
      searchInLocation()
    }
  })

  return (
    <main>
      <NavBar amenity={amenity} setAmenity={setAmenity} />
      <div className="flex justify-center">
        {amenity ? (
          <PageAmenity amenity={amenity} location={location} />
        ) : (
          <PageNearby
            setAmenity={setAmenity}
            inLocation={inLocation}
            fetchAmenity={fetchAmenity}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            location={location}
            getLocation={getLocation}
          />
        )}
      </div>
    </main>
  );
}

const PageNearby = ({ inLocation, fetchAmenity, selectedCuisine, onCuisineChange, location, getLocation }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <div className="flex justify-center text-8xl mb-12 font-semibold">
        <h1>Welcome!</h1>
      </div>
      <div className="flex justify-center text-4xl mb-12">
        <h2>You give us a click, we give you a dining experience!</h2>
      </div>
      {
        inLocation ? (
          <div className="flex justify-center text-4xl mb-12 items-center">
            <h2>Are you here?</h2>&nbsp;
            <button
                className="text-4xl bg-dark-dh hover:bg-light-dh text-white font-bold py-4 px-8"
                onClick={() => {fetchAmenity(inLocation.id)}}
              >
                {inLocation.name}
              </button>
          </div>
        ) : <></>
      }
      <div className="flex justify-center mb-12">
        <LocationFetch
          setAmenity={fetchAmenity}
          selectedCuisine={selectedCuisine}
          onCuisineChange={onCuisineChange}
          location={location}
          getLocation={getLocation}
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