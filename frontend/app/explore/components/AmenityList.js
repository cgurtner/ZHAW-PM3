'use client'

import { useState } from 'react'

const AmenityList = ({ sortedList }) => {
    const [type, setType] = useState()
    const [amenityAttr, setAmenityAttr] = useState([])

    async function fetchAttributes(type) {
            setType(type)
            
            const res = await fetch(process.env.NEXT_PUBLIC_API_CLIENT_URL + 'explore/' + type)
            const data = await res.json()
            
            const sortedList = Object.entries(data).sort((a, b) => b[1] - a[1]);
            setAmenityAttr(sortedList)
    }

    return (
        <div className='grid grid-cols-2'>
            <div>
                <h1 className='mb-4'>Chosen Type: {type}</h1>
                <ul>
                    {
                        Object.entries(sortedList).map((entry) => {
                            const [type, count] = entry

                            return (
                                <li key={type}>
                                    <button onClick={() => { fetchAttributes(count[0]) }}>
                                        {count[0] + ': ' + count[1]}
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            <div>
                <ul>
                    {
                        amenityAttr.map((val, key) => {
                            return (<li key={key}>{val[0] + ': ' + val[1]}</li>)
                        })
                    }
                </ul>
            </div>
        </div>

    )
}

export default AmenityList