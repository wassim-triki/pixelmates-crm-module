import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react'; // Add the hamburger icon
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="bg-white text-[#FA8072] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo Section */}
        <Link to="/">
          <img
            src="/Logo-MenuFy.png"
            alt="Logo"
            className="h-8 md:h-10 max-w-[150px] object-contain"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-[#FA8072]"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-[#FA8072] font-bold hover:text-black transition">
            Home
          </Link>
          <Link to="/about" className="text-[#FA8072] font-bold hover:text-black transition">
            About Us
          </Link>
        </div>

        {/* Right Section: Login Button */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/login"
            className="text-[#FA8072] font-bold hover:text-black transition"
          >
            Login
          </Link>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              className="bg-white text-black px-4 py-1 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-[#FA8072] transition-all"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2 text-gray-500" size={20} />
          </div>

          {/* Profile Icon */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="relative w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-[#FA8072] transition"
              >
                <User className="text-gray-700" size={20} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
                  <Link
                    to="/ProfilePage"
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072]"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072]"
                  >
                    Settings
                  </Link>
                  <Link
                    to="/login"
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072]"
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 text-white flex flex-col items-center py-6 space-y-6">
          <Link
            to="/"
            className="text-lg text-[#FA8072] font-bold hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-lg text-[#FA8072] font-bold hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            to="/login"
            className="text-lg text-[#FA8072] font-bold hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
