import { useState, useEffect, useRef } from 'react';

import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';

export default function AmenityMap({ amenity, myLocation }) {
    const mapRef = useRef(null)
    const [mapInstance, setMapInstance] = useState(null)
    const [pointsOfInterest, setPointsOfInterest] = useState([])

    const fetchAmenities = async (lat, lon, distance) => {
        const types = ['bar', 'pub', 'nightclub']
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}nearby?lat=${lat}&lon=${lon}&types=${types.join(',')}&distance=${distance}`)
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json()
            setPointsOfInterest(data)
        } catch (err) {
            console.error('Error fetching amenities!')
        }
    };

    useEffect(() => {
        fetchAmenities(amenity.lat, amenity.lon, 1000)
        const map = L.map(mapRef.current).setView([amenity.lat, amenity.lon], 17)

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

        const blueIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(myLocation.latitude, myLocation.longitude),
                L.latLng(amenity.lat, amenity.lon)
            ],
            routeWhileDragging: true,
            draggableWaypoints: false,
            show: false,
            createMarker: function (i, waypoint, n) {
                const icon = i === 0 ? redIcon : blueIcon;

                return L.marker(waypoint.latLng, {
                    icon: icon
                });
            }
        }).addTo(map);

        routingControl._container.style.display = 'None';

        routingControl.on('routesfound', function (e) {
            var routes = e.routes;
            var bounds = L.latLngBounds();

            routes.forEach(route => {
                bounds.extend(route.coordinates);
            });

            map.fitBounds(bounds, {
                padding: [50, 50]
            });
        });

        setMapInstance(map)

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        if (mapInstance && pointsOfInterest.length > 0) {
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
                poiMarker.bindPopup('<strong>' + elem.type.toUpperCase() + '</strong><br/>' + elem.name);
            })
        }
    }, [mapInstance, pointsOfInterest])

    return (
        <>
            <div ref={mapRef} className="mb-6" style={{ height: "750px", width: "100%" }}></div>
        </>
    )
}