'use client'

import { useState, useEffect } from "react";
import NavBar from "../NavBar";
import AmenityList from "./AmenityList";

export default function Explore() {
  const [amenityTypes, setAmenityTypes] = useState([])

  const fetchAmenityTypes = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_API_CLIENT_URL + 'amenity-types')
    const data = await res.json()

    setAmenityTypes(Object.entries(data).sort((a, b) => b[1] - a[1]));
  }

  useEffect(() => {
    fetchAmenityTypes()
  }, [])

  return (
    <main>
      <NavBar amenity={null} setAmenity={() => { return }} />
      <div className="flex justify-center">
        <div className="container">
          <AmenityList sortedList={amenityTypes} />
        </div>
      </div>
    </main>

  )
}
