import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FA8072] text-white py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Logo Section */}
          <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
            <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
              <img
                src="/Logo-MenuFy.png"
                alt="Logo"
                className=""
                loading="lazy"
              />
            </div>
            <p>Discover the best restaurants, cafes <br></br>and more.</p>
          </div>
          {/* Services Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-4">Services</h5>
            <ul>
              <li className="mb-2">
                <a href="" className="text-white ">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="" className="text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h5 className="text-lg font-semibold mb-4">Contact Us</h5>
            <ul>
              <li className="mb-2 flex items-center">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="location-dot"
                  className="svg-inline--fa fa-location-dot mr-2 text-white"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    fill="currentColor"
                    d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
                  ></path>
                </svg>
                Laval, Quebec, Canada H7T0B2
              </li>
              <li className="mb-2 flex items-center">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="phone"
                  className="svg-inline--fa fa-phone mr-2 text-white"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    fill="currentColor"
                    d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                  ></path>
                </svg>
                +1 514 803 3030
              </li>
              <li className="flex items-center">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="envelope"
                  className="svg-inline--fa fa-envelope mr-2 text-white"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  style={{ width: "20px", height: "20px" }}
                >
                  <path
                    fill="currentColor"
                    d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                  ></path>
                </svg>
                menu.comapp@gmail.com
              </li>
            </ul>
          </div>



          {/* Social Media Section */}
          <div className="w-full md:w-1/4 text-center">
            <h5 className="text-lg font-semibold mb-4">Follow Us</h5>
            <div className="flex justify-center space-x-4">
              <a
                href="https://ww.facebook.com/TheMenuFy"
                className="text-blue-500 text-2xl"
              >
                <img src="/facebook.png" alt="Facebook" className="w-8 h-8" />
              </a>
            </div>
            <div className="flex justify-center space-x-4 mt-2">
              <a
                href="https://www.instagram.com/TheMenuFy"
                className="text-pink-500 text-2xl"
              >
                <img src="/instagram.png" alt="Instagram" className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-white text-center p-3 mt-4">
        <div
          className="border-t border-white mt-4"
          style={{ width:"84%", margin: "0 auto", marginTop: "2.5rem", paddingTop: "1rem" }}
        >
          © 2025 The MenuFy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
