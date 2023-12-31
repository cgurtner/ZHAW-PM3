export default function Tabs({tab, setTab}) {
    return(
        <div className="mb-1 flex justify-end">
            <button className={`bg-dark-dh hover:bg-light-dh text-white font-bold py-1 px-2 mr-1 ${tab == 'map' ? 'bg-light-dh' : 'bg-dark-dh'}`} onClick={() => { setTab('map') }}>Karte</button>
            <button className={`bg-dark-dh hover:bg-light-dh text-white font-bold py-1 px-2 mr-1 ${tab == 'explore' ? 'bg-light-dh' : 'bg-dark-dh'}`} onClick={() => { setTab('explore') }}>Erkunden</button>
            <button className={`bg-dark-dh hover:bg-light-dh text-white font-bold py-1 px-2  ${tab == 'compare' ? 'bg-light-dh' : 'bg-dark-dh'}`} onClick={() => { setTab('compare') }}>Vergleichen</button>
        </div>
    )
}