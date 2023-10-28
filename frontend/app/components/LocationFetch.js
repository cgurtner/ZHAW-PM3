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
                const { latitude, longitude } = process.env.NEXT_PUBLIC_API_OVERWRITE_NEARBY_COORDS ?
                    { 'latitude': 47.49729966574743, 'longitude': 8.729624890038204 } :
                    position.coords 

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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}/nearby?lat=${lat}&lon=${lon}&types=${types.join(',')}&distance=${distance}`);
            const data = await response.json();
            setAmenities(data);
        } catch (err) {
            setError('Error fetching amenities!');
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-center">
                <button className="text-4xl bg-dark-dh hover:bg-light-dh text-white font-bold py-4 px-8 mb-12" onClick={getLocation}>
                    Nearby
                </button>
            </div>
            <div>
                {amenities.length > 0 && (
                    <div className="mt-4">
                        <div className="flex justify-center">
                            <h2 className="text-2xl text-4xl mb-6 font-medium">Locations</h2>
                        </div>
                        {amenities.map((amenity, index) => (
                            <div className="w-full text-4xl bg-dark-dh text-white py-4 px-8 mb-2 flex justify-between" key={amenity.id}>
                                <span>{amenity.name}</span>
                                <a href={`amenity/${amenity.id}`} className="text-right text-xl pt-1.5">Details</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LocationFetch