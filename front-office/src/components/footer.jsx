import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  // Define the routes where the footer should be hidden
  const hideFooterRoutes = ['/login', '/signup'];

  // Check if the current route is in the hideFooterRoutes array
  if (hideFooterRoutes.includes(location.pathname)) {
    return null; // Do not render the footer on these routes
  }

  // Define the background color for each page
  const pageColors = {
    '/': '#444444', // Home page color
    '/aboutUs': '#123456', // About page color
    '/contact': '#654321', // Contact page color
    // Add more routes and colors as necessary
  };

  // Set the footer background color based on the current page's color
  const footerBgColor = pageColors[location.pathname] || '#444444'; // Default color if route not found

  return (
    <footer
      className="relative bottom-0 left-0 w-full text-[#FA8072] py-3 backdrop-blur-lg shadow-lg"
      style={{ backgroundColor: footerBgColor }} // Dynamically set the color
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {/* Logo Section */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-block">
              <img
                src="/Logo-MenuFy.png"
                alt="Logo"
                className="h-6 mx-auto md:mx-0 mb-2"
              />
            </Link>
            <p className="text-xs font-light opacity-90 max-w-xs mx-auto md:mx-0">
              Discover the best restaurants, cafes, and more.
            </p>
          </div>

          {/* Services Section */}
          <div className="text-center md:text-left">
            <h5 className="text-sm font-semibold mb-2">Services</h5>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-[#ffb6b3] transition-colors duration-300 block"
                >
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/about-us"
                  className="text-white hover:text-black font-semibold"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="text-center md:text-left">
            <h5 className="text-sm font-semibold mb-2">Contact Us</h5>
            <ul className="space-y-1">
              <li className="flex items-center justify-center md:justify-start gap-2 text-xs">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 384 512"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                  />
                </svg>
                Laval, Quebec, Canada H7T0B2
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-xs">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                  />
                </svg>
                +1 514 803 3030
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-xs">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 512 512"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                  />
                </svg>
                menu.comapp@gmail.com
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="text-center">
            <h5 className="text-sm font-semibold mb-2">Follow Us</h5>
            <div className="flex justify-center gap-4">
              <a
                href="https://ww.facebook.com/TheMenuFy"
                className="hover:opacity-75 transition-opacity"
                aria-label="Facebook"
              >
                <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/TheMenuFy"
                className="hover:opacity-75 transition-opacity"
                aria-label="Instagram"
              >
                <img src="/instagram.png" alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#FA8072]/30 mt-6 pt-3 text-center">
          <p className="text-xs font-light opacity-90">
            © 2025 TheMenuFy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
