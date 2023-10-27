'use client'

import { useState } from "react"

const LocationFetch = () => {
    const [location, setLocation] = useState()

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser!');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            () => {
                setError('Unable to retrieve your location!');
            }
        );
    }

    return (
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
        </div>
    )
}

export default LocationFetch