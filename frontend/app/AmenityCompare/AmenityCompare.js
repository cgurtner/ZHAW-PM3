import { useState } from 'react';
import RadarChart from './Radar';

export default function AmenityCompare({ amenity, amenityList }) {
    const [compare, setCompare] = useState(amenityList[0])

    const wrapSetCompare = (val) => {
        const foundAmenity = amenityList.find(amenity => amenity.id == val);
        setCompare(foundAmenity);
    }

    return <div className="mb-1.5">
        <div className="mb-1 flex justify-end">
            <select
                className=" text-white font-bold py-1 px-2 bg-dark-dh hover:bg-light-dh text-white font-bold cursor-pointer"
                onChange={(e) => wrapSetCompare(e.target.value)}
            >
                {
                    amenityList.map((k, e) => {
                        return amenity.id !== k.id ? (<option key={k.id} value={k.id}>{k.name}</option>) : null
                    })
                }
            </select>

        </div>
        <div className="justify-center flex md:h-[750px]">
            <RadarChart amenity={amenity} compare={compare} />
        </div>
    </div>
}