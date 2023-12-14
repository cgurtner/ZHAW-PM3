import Link from 'next/link';

const NavBar = ({ amenity, setAmenity }) => {
    const navItems = [
        { name: 'Suche', path: '/' }
    ]

    return (
        <div className="w-full bg-dark-dh text-white p-4 justify-between mb-12 shadow-lg">
            <div className="container flex justify-between mx-auto">
                <div className="px-3 py-1 flex">
                    <img src="/nav-logo.png" alt="Logo NearbAI" className="inline h-5" />&nbsp;
                    NearbAI
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
                                        className={'hover:bg-light-dh transition duration-300 ease-in-out px-3 py-1'}
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