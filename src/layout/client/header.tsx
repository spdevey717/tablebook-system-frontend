import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="w-full glass sticky top-0 z-50">
            <div className="max-w-[1200px] h-20 m-auto flex justify-between items-center px-6">
                <Link to="/" className="text-3xl font-bold text-gradient">
                    TableBook.Me
                </Link>
                <nav className="flex space-x-8">
                    <Link to="/" className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/page1" className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                        Restaurants
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link to="/admin" className="btn-primary text-sm">
                        Admin Panel
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;