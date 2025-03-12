import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap';
import { getCurrentUser } from '../services/AuthService';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await getCurrentUser();
        setUserData(response.data);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      setUserData(null);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleToggle = () => {
    console.log('Toggling dropdown, current state:', isProfileOpen);
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-white text-[#FA8072] py-4">
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
          className="md:hidden text-[#FA8072]"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-[#FA8072] font-bold hover:text-black transition">
            Home
          </Link>
          <Link to="/about" className="text-[#FA8072] font-bold hover:text-black transition">
            About Us
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {!user && (
            <Link
              to="/login"
              className="text-[#FA8072] font-bold hover:text-black transition"
            >
              Login
            </Link>
          )}

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

          {user && (
            <Dropdown className="nav-item dropdown header-profile">
              <Dropdown.Toggle
                as="div"
                className="p-0 cursor-pointer bg-transparent border-none"
                onClick={handleToggle}
              >
                <div className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded transition">
                  <div className="relative w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full">
                    <User className="text-gray-700" size={20} />
                  </div>
                  <div className="header-info">
                    {loading ? (
                      <div
                        className="skeleton-line animate-pulse"
                        style={{ width: '120px', height: '16px', background: '#e0e0e0' }}
                      />
                    ) : error ? (
                      <span className="text-red-500 text-sm">Profile Error</span>
                    ) : (
                      <>
                        <span className="block text-dark font-bold">
                          {userData?.firstName} {userData?.lastName}
                        </span>
                        <small className="text-gray-600">
                        
                        </small>
                      </>
                    )}
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu
                show={isProfileOpen}
                className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-10"
              >
                <Dropdown.Item
                  as={Link}
                  to="/ProfilePage"
                  className="block px-4 py-2 text-gray-700 hover:text-[#FA8072]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Profile
                </Dropdown.Item>
                <Dropdown.Item
                  as={Link}
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:text-[#FA8072]"
                  onClick={() => setIsProfileOpen(false)}
                >
                  Settings
                </Dropdown.Item>
                <Dropdown.Item
                  as="button"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-700 hover:text-[#FA8072] w-full text-left"
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
            to="/about"
            className="text-lg text-[#FA8072] font-bold hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About Us
          </Link>
          {!user ? (
            <Link
              to="/login"
              className="text-lg text-[#FA8072] font-bold hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
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
          {user && !loading && !error && (
            <div className="text-center text-white">
              <span className="block text-[#FA8072] font-bold">
                {userData?.firstName} {userData?.lastName}
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;