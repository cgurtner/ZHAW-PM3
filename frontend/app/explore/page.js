import AmenityList from "./components/AmenityList";

export default async function Explore() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + 'amenity-types')
  const data = await res.json()

  const sortedList = Object.entries(data).sort((a, b) => b[1] - a[1]);

  return (
    <div className="container">
      <AmenityList sortedList={sortedList} /> 
    </div>
  )
}
