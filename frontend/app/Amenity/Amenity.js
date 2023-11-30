import { useState, useEffect } from 'react';
import AmenityMap from './../AmenityMap/AmenityMap';
import RatingStars from './RatingStars';
import Ratings from './Ratings';

export default function Amenity({ amenity }) {
  const [ratings, setRatings] = useState([])
  const [ratingFields, setRatingFields] = useState({ text: '', food: 0, service: 0, comfort: 0, location: 0 })
  const [ratingSaved, setRatingSaved] = useState(false)

  useEffect(() => {
    fetchRatings(amenity.id)
  }, [])

  const fetchRatings = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_CLIENT_URL}ratings/${id}`)
      const data = await response.json()
      setRatings(data)
    } catch (err) {
      console.error('Error fetching amenity ratings!')
    }
  }

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

  const submitRating = async (event) => {
    event.preventDefault();

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
        <AmenityMap amenity={amenity} />
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-3">
          {
            ratingSaved ? <></> : (
              <div className="bg-light-dh p-3">
                <h3 className="text-xl mb-3">Leave your rating here!</h3>
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
                    <button className="bg-dark-dh hover:bg-light-dh text-white py-2 px-4" onClick={submitRating}>
                      Rate!
                    </button>
                  </div>
                </form>
              </div>
            )
          }
          <Ratings ratings={ratings} />
        </div>
      </div>
    </div>
  )
}