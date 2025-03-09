import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react'; // Ajout de l'icône Hamburger
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
    <nav className="fixed top-0 left-0 w-full px-6 md:px-12 py-4 flex items-center justify-between bg-transparent z-50">
      {/* Logo Section */}
      <h1 className="text-2xl font-bold text-white">TheMenuFy</h1>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden text-white"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
        <Link to="/" className="text-white hover:text-yellow-500 transition">
          Home
        </Link>
        <Link
          to="/login"
          className="text-white hover:text-yellow-500 transition"
        >
          Login
        </Link>
        {/* <Link
          to="/code"
          className="text-white hover:text-yellow-500 transition"
        >
          Code
        </Link> */}
        <Link
          to="/signup"
          className="text-white hover:text-yellow-500 transition"
        >
          Signup
        </Link>
      </div>

      {/* Right Section: Search Bar & Profile */}
      <div className="hidden md:flex items-center space-x-6">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            className="bg-white text-black px-4 py-1 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
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
              className="relative w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full hover:ring-2 hover:ring-yellow-500 transition"
            >
              <User className="text-gray-700" size={20} />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2">
                <Link
                  to="/ProfilePage"
                  className="block px-4 py-2 text-gray-700 hover:text-yellow-500"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:text-yellow-500"
                >
                  Settings
                </Link>
                <Link
                  to="/login"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-700 hover:text-yellow-500"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/90 text-white flex flex-col items-center space-y-6 py-6">
          <Link
            to="/"
            className="text-lg hover:text-yellow-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/Login"
            className="text-lg hover:text-yellow-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/Register"
            className="text-lg hover:text-yellow-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/Reset"
            className="text-lg hover:text-yellow-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Reset
          </Link>
          <Link
            to="/ResetPasswordEmail"
            className="text-lg hover:text-yellow-500"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Reset Password Email
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
