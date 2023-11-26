import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RatingStars from './RatingStars';
import Rating from './Rating';

export default function Amenity({ amenity }) {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null)
  const [pointsOfInterest, setPointsOfInterest] = useState([])
  const [ratingFields, setRatingFields] = useState({
    text: '',
    food: 0,
    service: 0,
    comfort: 0,
    location: 0
  });

  const fetchAmenities = async (lat, lon, distance) => {
    const types = ['bar', 'pub', 'nightclub']
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

  const website = amenity.website ? <><a href={amenity.website} className="hover:text-light-dh" target="_blank" rel="noopener noreferrer">Website</a></> : null
  const phone = amenity.phone ? <>{amenity.phone}<br /></> : null
  const email = amenity.email ? <>{amenity.email}<br /></> : null
  const street = amenity.address['addr:street'] + (amenity.address['addr:housenumber'] ? ' ' + amenity.address['addr:housenumber'] : '')
  const city = amenity.address['addr:postcode'] + ' ' + amenity.address['addr:city']

  const hours = amenity.opening_hours ? amenity.opening_hours.split(';') : []
  const openingHours = amenity.opening_hours ? <>{
    hours.map((line, index) => (
      <p key={'opening-hours-' + index}>{line}</p>
    ))
  }<br /></> : null


  const setRatingField = (category, newRating) => {
    setRatingFields(prevRatings => ({
      ...prevRatings,
      [category]: newRating
    }));
  };

  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1">
        <div className="flex justify-center text-8xl mb-12 font-semibold">
          <h1>{amenity.name}</h1>
        </div>
        <div className={"bg-dark-dh mb-6 p-3 text-white grid " + (hours.length > 0 ? "grid-cols-4" : "grid-cols-3 gap-48")}>
          <div>
            <h2 className="font-semibold text-2xl mb-3">Address</h2>
            {amenity.name}<br />
            {street}<br />
            {city}
          </div>
          <div>
            <h2 className="font-semibold text-2xl mb-3">Contact</h2>
            {phone}
            {email}
            {website}
          </div>
          {
            hours.length > 0 ? <div>
              <h2 className="font-semibold text-2xl mb-3">Opening Hours</h2>
              {openingHours}
            </div> : null
          }
          <div>
            <h2 className="font-semibold text-2xl mb-3">Rating</h2>
            <div className="flex justify-between">
              <span>Food:</span>
              <RatingStars rating={amenity.averages.food} />
            </div>
            <div className="flex justify-between">
              <span>Service:</span>
              <RatingStars rating={amenity.averages.service} />
            </div>
            <div className="flex justify-between">
              <span>Comfort:</span>
              <RatingStars rating={amenity.averages.comfort} />
            </div>
            <div className="flex justify-between">
              <span>Location:</span>
              <RatingStars rating={amenity.averages.location} />
            </div>
          </div>
        </div>
        <div ref={mapRef} className="mb-6" style={{ height: "750px", width: "100%" }}></div>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
          <div className="bg-light-dh p-3">
            <h3 className="text-xl mb-3">UserRandom</h3>
            <form>
              <div className="mb-3">
                <textarea 
                className="w-full h-32 p-1 border border-dark-dh bg-light-dh" 
                placeholder="" 
                defaultValue={ratingFields.text}
                onChange={(e) => setRatingField('text', e.target.value)}
                >
                </textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span>Food:</span>
                  <RatingStars rating={ratingFields.food} category={'food'} setRating={setRatingField} />
                </div>
                <div className="flex justify-between">
                  <span>Service:</span>
                  <RatingStars rating={ratingFields.service} category={'service'} setRating={setRatingField} />
                </div>
                <div className="flex justify-between">
                  <span>Comfort:</span>
                  <RatingStars rating={ratingFields.comfort} category={'comfort'} setRating={setRatingField} />
                </div>
                <div className="flex justify-between">
                  <span>Location:</span>
                  <RatingStars rating={ratingFields.location} category={'location'} setRating={setRatingField} />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button className="bg-dark-dh hover:bg-light-dh text-white py-2 px-4">
                  Rate!
                </button>
              </div>
            </form>
          </div>
          {
            amenity.ratings.map((rating, key) => {
              return <Rating rating={rating} key={"rating" + rating.id + rating.name} />
            })
          }
        </div>
      </div>
    </div>
  )
}
