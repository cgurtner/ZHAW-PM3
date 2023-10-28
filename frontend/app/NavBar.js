import Link from 'next/link';

const NavBar = ({ amenity, setAmenity }) => {
    const navItems = [
        { name: 'Nearby', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'Team', path: '/team' }
    ]

    return (
        <div className="w-full bg-dark-dh text-white p-4 justify-between mb-12 shadow-lg">
            <div className="container flex justify-between mx-auto">
                <div className="px-3 py-1 flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00d68a" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>&nbsp;
                    YummiTummySearchy
                </div>
                <nav>
                    <ul className="flex space-x-6">
                        {
                            navItems.map(item => {
                                amenity = item.path == '/' ? false : amenity
                                return (
                                    <li
                                        onClick={() => setAmenity(amenity)}
                                        key={item.path}
                                        className={'hover:bg-light-dh transition duration-300 ease-in-out rounded-md px-3 py-1'}
                                    >
                                        <Link href={item.path}>{item.name}</Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default NavBar;