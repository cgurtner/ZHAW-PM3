'use client'

import NavBar from "../NavBar";
import BarChart from "./BarChart";
import ScatterPlot from "./ScatterPlot";

export default function Explore() {
  return (
    <main>
      <NavBar amenity={null} setAmenity={() => { return }} />
      <div className="flex justify-center">
        <div className="container mt-12">
          <div className="flex justify-center text-8xl mb-12 font-semibold">
            <h1>Explore</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-32">
            <div>
              <BarChart />
            </div>
            <div>
              <ScatterPlot />
            </div>
            <div>
              <ScatterPlot />
            </div>
            <div>
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </main>

  )
}
