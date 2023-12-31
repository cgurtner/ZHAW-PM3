import { useState, useEffect } from 'react';

import AmenityExplore from './../AmenityExplore/AmenityExplore';
import AmenityCompare from './../AmenityCompare/AmenityCompare';
import AmenityMapWrapper from './../AmenityMap/AmenityMapWrapper';

import Tabs from './Tabs';
import RatingStars from './RatingStars';
import Ratings from './Ratings';

export default function Amenity({ amenity, myLocation, allAmenitiesData }) {
  const [ratings, setRatings] = useState([]);
  const [ratingFields, setRatingFields] = useState({ text: '', food: 0, service: 0, comfort: 0, location: 0, price: 0 });
  const [textareaError, setTextareaError] = useState('');
  const [ratingSaved, setRatingSaved] = useState(false);
  const [tab, setTab] = useState('map');

  useEffect(() => {
    fetchRatings(amenity.id);
  }, [amenity.id]);

  const fetchRatings = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}ratings/${id}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setRatings(data);
    } catch (err) {
      console.error('Error fetching amenity ratings!', err);
    }
  };

  const website = amenity.website ? <><a href={amenity.website} className="hover:text-light-dh" target="_blank" rel="noopener noreferrer">Website</a></> : null
  const phone = amenity.phone ? <>{amenity.phone}<br /></> : null
  const email = amenity.email ? <>{amenity.email}<br /></> : null
  const street = amenity.address['addr:street'] + (amenity.address['addr:housenumber'] ? ' ' + amenity.address['addr:housenumber'] : '')
  const city = amenity.address['addr:postcode'] + ' ' + amenity.address['addr:city']
  const cuisine = amenity.cuisine.length > 0 ? amenity.cuisine.join(', ') : undefined
  const showContact = website != null || phone != null || email != null ? true : false

  const hours = amenity.opening_hours ? amenity.opening_hours.split(';') : []
  const openingHours = amenity.opening_hours ? <>{
    hours.map((line, index) => (
      <p key={'opening-hours-' + index}>{line}</p>
    ))
  }</> : null

  const setRatingField = (category, newRating) => {
    setRatingFields(prevRatings => ({
      ...prevRatings,
      [category]: newRating
    }));
  };

  const submitRating = async (event) => {
    event.preventDefault();

    if (!ratingFields.text.trim()) {
      setTextareaError('Bitte gib einen Bewertungstext ein!');
      return;
    }
    setTextareaError('');

    const postData = {
      id: amenity.id,
      ...ratingFields
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}add-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        setRatingSaved(true)
        fetchRatings(amenity.id)
      } else {
        console.error('Server responded with non-OK status');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const gridClass = "bg-dark-dh flex mb-6 p-3 text-white grid grid-cols-1 md:grid-cols-4 gap-y-3 justify-between";

  return (
    <>
      <div className="flex justify-center text-center text-6xl md:text-8xl mb-12 font-semibold">
        <h1>{amenity.name}</h1>
      </div>
      <div className={gridClass}>
        <div>
          <h2 className="font-semibold text-2xl mb-3">Adresse</h2>
          <span className="font-semibold">{amenity.name}</span><br />
          {
            cuisine ? (
              <>
                <span className="font-semibold">{cuisine}</span><br />
              </>
            ) : null
          }
          {street}<br />
          {city}
        </div>
        {
          showContact ? (
            <div>
              <h2 className="font-semibold text-2xl mb-3">Kontakt</h2>
              {phone}
              {email}
              {website}
            </div>
          ) : <div></div>
        }
        {
          hours.length > 0 ? (
            <div>
              <h2 className="font-semibold text-2xl mb-3">Öffnungszeiten</h2>
              {openingHours}
            </div>
          ) : <div></div>
        }
        <div>
          <h2 className="font-semibold text-2xl mb-3">Bewertung</h2>
          <div className="flex justify-between">
            <span>Essen:</span>
            <RatingStars rating={amenity.averages.food} />
          </div>
          <div className="flex justify-between">
            <span>Service:</span>
            <RatingStars rating={amenity.averages.service} />
          </div>
          <div className="flex justify-between">
            <span>Komfort:</span>
            <RatingStars rating={amenity.averages.comfort} />
          </div>
          <div className="flex justify-between">
            <span>Standort:</span>
            <RatingStars rating={amenity.averages.location} />
          </div>
          <div className="flex justify-between">
            <span>Value:</span>
            <RatingStars rating={amenity.averages.price} />
          </div>
        </div>
      </div>
      <Tabs tab={tab} setTab={setTab} />
      {
        tab == 'compare' ? <AmenityCompare amenity={amenity} amenityList={allAmenitiesData.filter(item => item.id != amenity.id)} /> : tab == 'explore' ?
          <AmenityExplore selectedAmenityData={amenity} amenitiesData={allAmenitiesData} /> : <AmenityMapWrapper amenity={amenity} myLocation={myLocation} />
      }
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
        {
          ratingSaved ? <></> : (
            <div className="bg-light-dh p-3">
              <h3 className="text-xl mb-3">Bewertung</h3>
              <form>
                <div className="mb-3">
                  <textarea
                    className="w-full h-32 p-1 border border-dark-dh bg-light-dh mb-3"
                    placeholder=""
                    defaultValue={ratingFields.text}
                    onChange={(e) => setRatingField('text', e.target.value)}
                  >
                  </textarea>
                  {textareaError && <div className="text-red-500 text-sm mt-1">{textareaError}</div>}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Essen:</span>
                    <RatingStars rating={ratingFields.food} category={'food'} setRating={setRatingField} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Service:</span>
                    <RatingStars rating={ratingFields.service} category={'service'} setRating={setRatingField} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Komfort:</span>
                    <RatingStars rating={ratingFields.comfort} category={'comfort'} setRating={setRatingField} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Standort:</span>
                    <RatingStars rating={ratingFields.location} category={'location'} setRating={setRatingField} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="center">Value:</span>
                    <RatingStars
                      rating={ratingFields.price} category={'price'} setRating={setRatingField} />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="bg-dark-dh hover:bg-light-dh text-white py-2 px-4" onClick={submitRating}>
                    Bewerten!
                  </button>
                </div>
              </form>
            </div>
          )
        }
        <Ratings ratings={ratings} />
      </div>
    </>
  )
}
