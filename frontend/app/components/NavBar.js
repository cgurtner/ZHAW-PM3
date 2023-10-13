const NavBar = () => (
    <div className="w-full bg-violet-900 text-white p-4 justify-between mb-12 shadow-lg">
        <div className="container mx-auto">
            <div className="flex items-center">
                <nav>
                    <ul className="flex space-x-6">
                        <li className="hover:bg-violet-600 transition duration-300 ease-in-out rounded-md px-4 py-2">
                            <a href="/">Home</a>    
                        </li>
                        <li className="hover:bg-violet-600 transition duration-300 ease-in-out rounded-md px-4 py-2">   
                            <a href="/team">Team</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
)

export default NavBar;