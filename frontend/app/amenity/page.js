export default function Amenity({amenity}) {
  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1">
        <div className="flex justify-center text-8xl mb-12 font-semibold">
          <h1>This is an Amenity! {amenity}</h1>
        </div>
      </div>
    </div>
  )
}
