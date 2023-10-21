import Link from 'next/link';

const NavBar = () => {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Team', path: '/team' }
    ]

    return (
        <div className="w-full bg-dark-dh text-white p-4 justify-between mb-12 shadow-lg">
            <div className="container flex justify-between mx-auto">
                <div className="px-3 py-1">
                    OSM Explorer
                </div>
                <nav>
                    <ul className="flex space-x-6">
                        {
                            navItems.map(item => (
                                <li
                                    key={item.path}
                                    className={'hover:bg-light-dh transition duration-300 ease-in-out rounded-md px-3 py-1'}
                                >
                                    <Link href={item.path}>{item.name}</Link>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default NavBar;