import AmenityList from "./components/AmenityList";

export default async function Explore() {
  const res = await fetch('http://api:5000/api/amenity-types')
  const data = await res.json()

  const sortedList = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="container">
      <AmenityList sortedList={sortedList} /> 
    </div>
  )
}
