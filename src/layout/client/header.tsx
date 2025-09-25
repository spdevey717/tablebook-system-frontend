import { Link } from "react-router-dom";
import { useState } from "react";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="w-full glass sticky top-0 z-50">
            <div className="max-w-[1920px] h-20 m-auto flex justify-between items-center px-6">
                <Link to="/" className="text-3xl font-bold text-gradient">
                    TableBook.Me
                </Link>
                <nav className="flex space-x-8 items-center">
                    <Link to="/" className="text-gray-700 hover:text-primary-600 transition-all duration-300 font-medium relative group">
                        <div className="p-2">Home</div>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    
                    {/* Login Panel Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="btn-primary text-sm flex items-center"
                        >
                            Login Panel
                            <svg 
                                className={`ml-2 h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <Link
                                    to="/auth/signin"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">🔑</span>
                                        Sign In
                                    </div>
                                </Link>
                                <Link
                                    to="/auth/signup"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">👤</span>
                                        Sign Up
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
            
            {/* Overlay to close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;