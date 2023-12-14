'use client'

import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import LocationFetch from './LocationFetch';
import Amenity from './Amenity/Amenity';

export default function Home() {
  const [amenity, setAmenity] = useState(null);
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [location, setLocation] = useState();
  const [inLocation, setInLocation] = useState();
  const [allAmenitiesData, setAllAmenitiesData] = useState([]);

  const fetchAmenity = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}amenity/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setAmenity(data);
    } catch (err) {
      console.error('Error fetching amenities!', err);
    }
  }

  const searchInLocation = async () => {
    const url = (amenity === false && process.env.NEXT_PUBLIC_API_OVERWRITE_NEARBY_COORDS) ? `${process.env.NEXT_PUBLIC_API_CLIENT_URL}nearby?lat=47.4979559&lon=8.7313352&types=${['restaurant', 'cafe', 'fast_food', 'biergarten'].join(',')}&distance=10` :
      `${process.env.NEXT_PUBLIC_API_CLIENT_URL}nearby?lat=${location.latitude}&lon=${location.longitude}&types=${['restaurant', 'cafe', 'fast_food', 'biergarten'].join(',')}&distance=10`

    if (amenity === false && process.env.NEXT_PUBLIC_API_OVERWRITE_NEARBY_COORDS) {
      setLocation({ 'latitude': 47.49791035705619, 'longitude': 8.731462391719466 });
    }

    const response = await fetch(url);
    let data = await response.json();
    if (data.length > 0) {
      setInLocation(data[0])
    }
  }

  const getLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser!');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = process.env.NEXT_PUBLIC_API_OVERWRITE_NEARBY_COORDS ?
          { 'latitude': 47.49788451416509, 'longitude': 8.72646118588123 } :
          position.coords;
        setLocation({ latitude, longitude });
      },
      () => {
        console.error('Unable to retrieve your location!');
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
      <div className="flex justify-center px-2">
        {amenity ? (
          <PageAmenity amenity={amenity} location={location} allAmenitiesData={allAmenitiesData} />
        ) : (
          <PageNearby
            setAmenity={setAmenity}
            inLocation={inLocation}
            fetchAmenity={fetchAmenity}
            selectedCuisine={selectedCuisine}
            onCuisineChange={setSelectedCuisine}
            location={location}
            setAllAmenitiesData={setAllAmenitiesData}
            getLocation={getLocation}
          />
        )}
      </div>
    </main>
  );
}

const PageNearby = ({ inLocation, fetchAmenity, selectedCuisine, onCuisineChange, location, getLocation, setAllAmenitiesData }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <div className="flex justify-center text-6xl md:text-8xl mb-12 font-semibold">
        <h1>Willkommen!</h1>
      </div>
      <div className="flex justify-center text-center text-2xl md:text-6xl mb-12">
        <h2>Du klickst, wir bieten Dir ein kulinarisches Erlebnis!</h2>
      </div>
      {
        inLocation ? (
          <div className="flex justify-center text-2xl md:text-4xl mb-12 items-center">
            <h2>Bist Du hier?</h2>&nbsp;
            <button
              className="text-xl md:text-2xl bg-dark-dh hover:bg-light-dh text-white font-bold py-2 px-4"
              onClick={() => { fetchAmenity(inLocation.id) }}
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
          setAllAmenitiesData={setAllAmenitiesData}
          getLocation={getLocation}
        />
      </div>
    </div>
  </div>
);

const PageAmenity = ({ amenity, location, allAmenitiesData }) => (
  <div className="container mt-12">
    <div className="grid grid-cols-1">
      <Amenity
        amenity={amenity}
        myLocation={location}
        allAmenitiesData={allAmenitiesData}
      />
    </div>
  </div>
);
