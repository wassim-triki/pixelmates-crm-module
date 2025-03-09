import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/button';
import BlurContainer from '../components/blurContainer';

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

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />
      <div className="relative min-h-screen flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-16">
        <div className="w-full max-w-7xl pt-8">
          <BlurContainer
            blur="xl"
            opacity={50}
            padding={8}
            rounded="2xl"
            className="w-full mx-auto p-6"
          >
            <div className="flex flex-col space-y-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold text-white">
                    Welcome to TheMenuFy!
                  </h1>
                  <p className="text-lg text-white">
                    Manage your restaurant menus with ease and style. Customize,
                    update in real-time, and enhance customer experiences.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-all">
                      Buy now
                    </Button>
                    <Button className="!bg-transparent hover:!bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300">
                      See menu
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-center overflow-hidden">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
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
                      <p className="text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-white">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurContainer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
