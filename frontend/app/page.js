import LocationFetch from "./components/LocationFetch";

export default function Home() {
  return (
    <div className="container mt-12">
      <div className="grid grid-cols-1">
        <div className="flex justify-center text-8xl mb-12">
          <h1>Welcome!</h1>
        </div>
        <div className="flex justify-center text-4xl mb-12">
          <h2>You give us a click, we give you a dining experience!</h2>
        </div>
        <div className="flex justify-center mb-12">
          <LocationFetch />
        </div>
      </div>
    </div>
  )
}
