import Link from 'next/link';

const NavBar = () => {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Team', path: '/team' }
    ]

    return (
        <div className="w-full bg-dark-dh text-white p-4 justify-between mb-12 shadow-lg">
            <div className="container flex justify-between mx-auto">
                <div className="px-3 py-1 flex">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>&nbsp;
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