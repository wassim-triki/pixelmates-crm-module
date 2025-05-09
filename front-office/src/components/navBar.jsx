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
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 mr-5">
          <img
            src="/Logo-MenuFy.png"
            alt="Logo"
            className="h-8 sm:h-9 md:h-10 w-auto max-w-[90px] sm:max-w-[110px] md:max-w-[120px] object-contain"
          />
        </Link>

        {/* Bouton menu mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-white"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation desktop */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
          <Link to="/about-us" className="text-white text-sm lg:text-base font-bold hover:text-[#FA8072] transition whitespace-nowrap">
            About Us
          </Link>
          {user && !loading && (
            <>
              <Link to="/reservation" className="text-white text-sm lg:text-base font-bold hover:text-[#FA8072] transition whitespace-nowrap">
                Reservation
              </Link>
              <Link to="/my-complaints" className="text-white text-sm lg:text-base font-bold hover:text-[#FA8072] transition whitespace-nowrap">
                Complaints
              </Link>
            </>
          )}
          <Link to="/restaurant" className="text-white text-sm lg:text-base font-bold hover:text-[#FA8072] transition whitespace-nowrap">
            Restaurants
          </Link>
        </div>

        {/* Section droite desktop */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
          {!user && !loading && (
            <Link to="/login" className="text-white text-sm lg:text-base font-bold hover:text-[#FA8072] transition whitespace-nowrap">
              Login
            </Link>
          )}

          <div className="relative">
            <input
              type="text"
              className="bg-transparent text-white px-4 py-1 rounded-full w-32 lg:w-48 focus:outline-none focus:ring-2 focus:ring-[#FA8072] transition-all text-sm lg:text-base"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-2 text-gray-500" size={20} />
          </div>

          {user && !loading && (
          <div ref={profileDropdownRef} className="relative flex-shrink-0">
            <button
              className="flex items-center space-x-1 hover:bg-[#FA8072]/30 p-1 lg:p-1.5 rounded-full transition"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center bg-gray-200 rounded-full overflow-hidden">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-gray-700" size={18} />
                )}
              </div>
              <div className="flex-shrink-0 min-w-[100px]">
                <span className="block text-white font-bold text-xs sm:text-sm md:text-base truncate">
    {user.firstName || 'User'} {user.lastName || ''} ({user.points ?? 0} pts)
  </span>

              </div>
            </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072] hover:bg-[#FA8072]/10 text-sm"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-gray-700 hover:text-[#FA8072] hover:bg-[#FA8072]/10 text-sm"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block  w-full px-4 py-2 text-gray-700 hover:text-[#FA8072] hover:bg-[#FA8072]/10 text-sm text-left"
                  >

                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/90 text-white w-full flex flex-col items-center py-6 space-y-6 relative">
          {/* Liens mobiles */}
          <Link to="/about-us" className="text-white text-lg font-bold hover:text-[#FA8072]" onClick={() => setIsMobileMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/restaurant" className="text-white text-lg font-bold hover:text-[#FA8072]" onClick={() => setIsMobileMenuOpen(false)}>
            Restaurants
          </Link>
          {user && !loading && (
            <>
              <Link to="/reservation" className="text-white text-lg font-bold hover:text-[#FA8072]" onClick={() => setIsMobileMenuOpen(false)}>
                Reservation
              </Link>
              <Link to="/my-complaints" className="text-white text-lg font-bold hover:text-[#FA8072]" onClick={() => setIsMobileMenuOpen(false)}>
                Complaints
              </Link>
            </>
          )}
          {!user && !loading && (
            <Link to="/login" className="text-white text-lg font-bold hover:text-[#FA8072]" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </Link>
          )}

          {/* Section profil mobile */}
          {user && !loading && (
              <div className="w-full px-4 text-center">
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    className="flex items-center justify-center space-x-2 w-full"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
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
                    <div className="flex-shrink-0 max-w-[160px]">
           <span className="block text-[#FA8072] font-bold text-sm sm:text-base truncate">
          {user.firstName || 'User'} {user.lastName || ''} ({user.points ?? 0} pts)
        </span>

                    </div>
                  </button>

                {isProfileOpen && (
                  <div className="mt-4 w-full bg-black/50 rounded-lg py-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-white hover:bg-[#FA8072]/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-3 text-white hover:bg-[#FA8072]/20"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-3 text-white hover:bg-[#FA8072]/20 text-center"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;