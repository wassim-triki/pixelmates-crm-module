import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaTwitter,
} from 'react-icons/fa';
import { FaMapLocationDot } from 'react-icons/fa6';
import { IoIosMail } from 'react-icons/io';
const Footer = () => {
  const location = useLocation();

  // Define the routes where the footer should be hidden
  const hideFooterRoutes = ['/login', '/signup'];

  // Check if the current route is in the hideFooterRoutes array
  // if (hideFooterRoutes.includes(location.pathname)) {
  //   return null; // Do not render the footer on these routes
  // }

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
    //    <footer className="absolsute bottom-0 left-0 right-0 z-10 bg-[#444444] py-3 text-center border-t border-gray-500/30">
    //   <p className="text-xs font-light opacity-90 text-white">
    //     © 2025 TheMenuFy. All rights reserved.
    //   </p>
    // </footer>
    <footer className="relative bottom-0 left-0 w-full text-[#FA8072] !text-white py-3 backdrop-blur-lg shadow-lg z-10 !bg-[#25262B]">
      <div className="container mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-4 px-4 pt-8 pb-4 gap-10 md:gap-20 items-start">
          {/* Logo Section */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-block">
              <img
                src="/Logo-MenuFy.png"
                alt="Logo"
                className="h-6 mx-auto md:mx-0 mb-2"
              />
            </Link>
            <p className="text-sm max-w-xs mx-auto md:mx-0">
              Discover the best restaurants, cozy cafés, and hidden gems near
              you for every occasion.
            </p>
          </div>

          {/* Services Section */}
          <div className="text-center md:text-left flex flex-col gap-4">
            <p className="text-lg font-semibold flex flex-col items-center  transition-colors duration-300 md:block">
              Company
              <span className=" mt-1.5 block w-16 h-0.5 bg-[#F07D70]"></span>
            </p>
            <Link
              to="/about-us"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              About Us
            </Link>
            <Link
              to="/services"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              Our Services
            </Link>
            <Link
              to="/privacy-policy"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              Privacy Policy
            </Link>
            <Link
              to="/partners"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              Partners
            </Link>
          </div>

          <div className="text-center md:text-left flex flex-col gap-4">
            <p className="text-lg font-semibold flex flex-col items-center  transition-colors duration-300 md:block">
              Ressources
              <span className=" mt-1.5 block w-16 h-0.5 bg-[#F07D70]"></span>
            </p>
            <Link
              to="/"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              Home
            </Link>
            <Link
              to="/contact-us"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className="text-sm hover:text-[#EF7D70] md:w-fit transition-colors duration-300 block opacity-80"
            >
              FAQ
            </Link>
          </div>
          <div className="text-center md:text-left flex flex-col gap-4">
            <p className="text-lg font-semibold flex flex-col items-center  transition-colors duration-300 md:block">
              Reach Us At
              <span className=" mt-1.5 block w-16 h-0.5 bg-[#F07D70]"></span>
            </p>
            <div className="flex flex-col gap-2 mx-auto md:mx-0">
              <a
                href="#"
                className="flex gap-3 items-center hover:text-[#EF7D70] opacity-80  transition-colors duration-300"
              >
                <FaMapLocationDot className="text-2xl" />
                <p className="font-normal text-sm">
                  Laval, Quebec, Canada H7T0B2
                </p>
              </a>
              <a
                href="mailto:menu.comapp@gmail.com"
                className="flex gap-3 items-center hover:text-[#EF7D70] opacity-80 transition-colors duration-300 "
              >
                <IoIosMail className="text-2xl" />
                <p className="font-normal text-sm">menu.comapp@gmail.com</p>
              </a>
              <a
                href="tel:+15148033030"
                className="flex gap-3 items-center hover:text-[#EF7D70] opacity-80 transition-colors duration-300 "
              >
                <FaPhone className="rotate-90 text-2xl" />
                <p className="font-normal text-sm">+1 514 803 3030</p>
              </a>
            </div>
          </div>
          {/* <div className="text-center md:text-left flex flex-col gap-4">
            <p className="text-lg font-semibold hover:text-[#EF7D70] transition-colors duration-300 block">
              Follow Us
              <span className=" mt-1.5 block w-16 h-0.5 bg-[#F07D70]"></span>
            </p>
            <div className="flex gap-4">
              <Link
                to={'#'}
                className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
              >
                <FaFacebookF />
              </Link>
              <Link
                to={'#'}
                className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
              >
                <FaTwitter />
              </Link>
              <Link
                to={'#'}
                className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
              >
                <FaInstagram />
              </Link>
              <Link
                to={'#'}
                className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
              >
                <FaLinkedinIn />
              </Link>
            </div>
          </div> */}
        </div>

        {/* Copyright Section */}
        <div className="border-t border-[#474749] px-4 mt-6 pt-3 text-center flex items-center justify-between">
          <p className="text-sm ">© 2025 TheMenuFy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link
              to={'#'}
              className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
            >
              <FaFacebookF />
            </Link>
            <Link
              to={'#'}
              className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
            >
              <FaTwitter />
            </Link>
            <Link
              to={'#'}
              className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
            >
              <FaInstagram />
            </Link>
            <Link
              to={'#'}
              className=" bg-[#555555] p-3 rounded-full hover:bg-[#EF7D70] transition-colors duration-300 text-lg"
            >
              <FaLinkedinIn />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
