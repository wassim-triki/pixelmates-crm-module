import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/button';
import BlurContainer from '../components/blurContainer';
import Chatbot from '../components/Chatbot';  
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; 

const HomePage = () => {
  const menuItems = [
    { id: 1, name: 'Must Explain', price: '$15.00', image: '/test.png' },
    { id: 2, name: 'Must Explain', price: '$25.00', image: '/1.png' },
    { id: 3, name: 'Must Explain', price: '$25.00', image: '/2.png' },
    { id: 4, name: 'Must Explain', price: '$15.00', image: '/3.png' },
  ];

  const [mainImage, setMainImage] = useState(menuItems[0].image);
  const [direction, setDirection] = useState(1);

  const handleHover = (newImage) => {
    if (newImage !== mainImage) {
      setDirection(newImage > mainImage ? 1 : -1);
      setMainImage(newImage);
    }
  };

  useEffect(() => {
    const mapContainer = document.getElementById('map');
  
    if (!mapContainer) {
      console.warn('Map container not found');
      return;
    }
      if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null; 
    }
  
    const map = L.map(mapContainer).setView([36.8065, 10.1815], 6);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  
    const restaurants = [
      { name: 'Tunis', lat: 36.8065, lng: 10.1815 },
      { name: 'Sfax', lat: 34.7406, lng: 10.7603 },
    ];
  
    restaurants.forEach((r) => {
      L.marker([r.lat, r.lng])
        .addTo(map)
        .bindPopup(`${r.name} - Restaurant partenaire 🍽️`);
    });
  
    const getCityCountry = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || '';
        const country = data.address.country || '';
        return `${city}, ${country}`;
      } catch (error) {
        console.error('Erreur lors du géocodage inverse :', error);
        return 'Lieu inconnu';
      }
    };
  
    map.on('click', async function (e) {
      const { lat, lng } = e.latlng;
      const locationName = await getCityCountry(lat, lng);
  
      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `<strong>${locationName}</strong><br>Latitude: ${lat.toFixed(4)}<br>Longitude: ${lng.toFixed(4)}`
        )
        .openPopup();
    });
  
    return () => {
      map.remove(); 
    };
  }, []);  
    
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      {/* Background section */}
      <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
          }}
      />
      
      <div className="relative z-1 relative flex-grow flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-8">
          <BlurContainer
            blur="xl"
            opacity={50}
            padding={8}
            rounded="2xl"
            className="w-full mx-auto p-6"
          >
            <div className="flex flex-col space-y-20">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                    Welcome to TheMenuFy!
                  </h1>
                  <p className="text-lg sm:text-xl text-white">
                    Manage your restaurant menus with ease and style. Customize,
                    update in real-time, and enhance customer experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button className="bg-[#FA8072] hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-all">
                      Book Now
                    </Button>
                    <Button className="!bg-transparent hover:!bg-[#FA8072] text-black hover:text-white border-2 border-black font-semibold py-3 px-6 rounded-full transition-all duration-300">
                      See menu
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center overflow-hidden mt-8 md:mt-0">
                  <motion.img
                    key={mainImage}
                    src={mainImage}
                    alt="MenuFy Preview"
                    className="w-3/4 max-w-sm rounded-xl object-contain"
                    initial={{ x: direction * 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -direction * 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              {/* Menu Items Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/10 rounded-xl p-4 backdrop-blur-sm group hover:bg-black/20 transition-all flex flex-col items-center text-center"
                    onMouseEnter={() => handleHover(item.image)}
                  >
                    <div className="w-full aspect-square relative flex justify-center items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      <p className="text-sm text-white">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurContainer>
        </div>
      </div>

      {/* Extended Features Section */}
      <div className="bg-white py-20 px-4 sm:px-6 lg:px-16">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore more features of TheMenuFy!
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-gray-600">
            Customize your restaurant experience with advanced tools that help you grow your business.
            Track reservations, improve customer interactions and boost your kitchen's efficiency.
          </p>
          <div className="flex justify-center mt-8">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-all">
              Discover More
            </Button>
          </div>
        </div>

      <div className="flex justify-center ">
        <div className="flex flex-col md:flex-row items-center justify-between w-[90%] md:w-[80%]">
          {/* Map */}
          <div className="rounded-2xl shadow-lg overflow-hidden w-full md:w-[60%] h-[300px]">
            <div id="map" className="w-full h-full" />
          </div>
          <div
            className="md:w-[35%] mt-4 md:mt-0 md:ml-8 text-center md:text-left bg-black/10 backdrop-blur-sm p-6 rounded-lg shadow-lg"
            id="map-text-container"
          >
            <h3 className="text-2xl font-bold text-white text-center">Explore Our Partnered Locations</h3>
            <p className="mt-4 text-lg text-white text-center">
              Click on the map to explore partnered restaurants. Find out more about each restaurant's
              offerings and locations by clicking on their markers.
            </p>
          </div>
          </div>
         </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default HomePage;
