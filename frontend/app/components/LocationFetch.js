'use client'

import { useState } from "react"

const LocationFetch = () => {
    const [location, setLocation] = useState()
    const [amenities, setAmenities] = useState([]);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser!');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
                fetchAmenities(latitude, longitude, ["restaurant", "pub"], 1000);
            },
            () => {
                setError('Unable to retrieve your location!');
            }
        );
    }

    const fetchAmenities = async (lat, lon, types, distance) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}/nearby?lat=${lat}&lon=${lon}&types=${types.join(',')}&distance=${distance}`);
            const data = await response.json();
            console.log(data)
            setAmenities(data);
        } catch (err) {
            setError('Error fetching amenities!');
        }
    };

    return (
        <div>
            <div>
                <button className="text-4xl bg-dark-dh hover:bg-light-dh text-white font-bold py-4 px-8 mb-12" onClick={getLocation}>
                    Get My Location
                </button>
                {
                    location && (
                        <div className="mt-4">
                            <h2 className="text-2xl mb-2">Your Location</h2>
                            <p>Latitude: {location.latitude}</p>
                            <p>Longitude: {location.longitude}</p>
                        </div>
                    )
                }
                {amenities.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-2xl mb-2">Locations</h2>
                        <ul>
                            {amenities.map((amenity, index) => (
                                <li key={index}>{amenity.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LocationFetch