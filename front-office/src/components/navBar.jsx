import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/authContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const profileDropdownRef = useRef(null);

  // Debug: Log user, loading, accessToken, and login condition
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Navbar - AccessToken:', token);
    console.log('Navbar - User:', user);
    console.log('Navbar - Loading:', loading);
    console.log('Navbar - Is User Logged In (user && !loading):', user && !loading);
  }, [user, loading]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="fixed top-0 z-[1000] left-0 right-0 bg-[#262626]/20 text-[#FA8072] py-4 backdrop-blur-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="/Logo-MenuFy.png"
            alt="Logo"
            className="h-8 md:h-10 max-w-[150px] object-contain"
          />
        </Link>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden md:flex space-x-8">

          <Link to="/about-us" className="text-white font-bold hover:text-[#FA8072] transition">
            About Us
          </Link>
          {user && !loading && (
            <>
              <Link
                to="/reservation"
                className="text-white font-bold hover:text-[#FA8072] transition"
              >
                Reservation
              </Link>
              <Link
                to="/my-complaints"
                className="text-white font-bold hover:text-[#FA8072] transition"
              >
                My Complaints
              </Link>
            </>
          )}
          <Link to="/restaurant" className="text-white font-bold hover:text-[#FA8072] transition">
            Restaurant
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {!user && !loading && (
            <Link to="/login" className="text-white font-bold hover:text-[#FA8072] transition">
              Login
            </Link>
          )}

          <div className="relative">
            <input
              type="text"
              className="bg-transparent text-white px-4 py-1 rounded-full w-48 focus:outline-none focus:ring-2 focus:ring-[#FA8072] transition-all"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2 text-gray-500" size={20} />
          </div>

          {user && !loading && (
            <div ref={profileDropdownRef} className="relative">
              <button
                className="flex items-center space-x-2 hover:bg-[#FA8072]/30 p-2 rounded-full transition"
                onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                <div className="relative w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-gray-700" size={20} />
                  )}
                </div>
                <span className="block text-white font-bold">
                  {user.firstName || 'User'} {user.lastName || ''}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072] hover:bg-[#FA8072]/10"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072] hover:bg-[#FA8072]/10"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072] hover:bg-[#FA8072]/10 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
            to="/about-us"
            className="text-lg text-[#FA8072] font-bold hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          {user && !loading && (
            <>
              <Link
                to="/reservation"
                className="text-lg text-[#FA8072] font-bold hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reservation
              </Link>
              <Link
                to="/my-complaints"
                className="text-lg text-[#FA8072] font-bold hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Complaints
              </Link>
            </>
          )}
          <Link
            to="/restaurant"
            className="text-lg text-[#FA8072] font-bold hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Restaurant
          </Link>
          {!user && !loading ? (
            <Link
              to="/login"
              className="text-lg text-[#FA8072] font-bold hover:text-white"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="text-lg text-[#FA8072] font-bold hover:text-white"
            >
              Logout
            </button>
          )}
          {user && !loading && (
            <div className="text-center text-white">
              <span className="block text-[#FA8072] font-bold">
                {user.firstName || 'User'} {user.lastName || ''}
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;