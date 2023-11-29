'use client'

import NavBar from "../NavBar";

export default function Explore() {
  return (
    <main>
      <NavBar amenity={null} setAmenity={() => { return }} />
      <div className="flex justify-center">
        <div className="container">
          Hello Explore Page!
        </div>
      </div>
    </main>

  )
}
