import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Amenity({ amenity }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null)
  const [pointsOfInterest, setPointsOfInterest] = useState([])

  const fetchAmenities = async (lat, lon, distance) => {
    const types = ['bar', 'pub', 'nightclub', 'bicycle_parking', 'charging_station']
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}nearby?lat=${lat}&lon=${lon}&types=${types.join(',')}&distance=${distance}`);
      const data = await response.json();
      setPointsOfInterest(data)
    } catch (err) {
      setError('Error fetching amenities!');
    }
  };

  useEffect(() => {
    fetchAmenities(amenity.lat, amenity.lon, 1000);
  }, []);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([amenity.lat, amenity.lon], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    L.marker([amenity.lat, amenity.lon], { icon: redIcon }).addTo(map);
    setMapInstance(map)

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (mapInstance  && pointsOfInterest.length > 0) {
      const greyIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      pointsOfInterest.map((elem, key) => {
        const poiMarker = L.marker([elem.lat, elem.lon], { icon: greyIcon }).addTo(mapInstance);
        poiMarker.bindPopup('<strong>' +  elem.type.toUpperCase() + '</strong><br/>' + elem.name);
      })
    }
  }, [mapInstance, pointsOfInterest])

  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1">
        <div className="flex justify-center text-8xl mb-12 font-semibold">
          <h1>{amenity.name}</h1>
        </div>
        <div ref={mapRef} style={{ height: "750px", width: "100%" }}></div>
      </div>
    </div>
  )
}
