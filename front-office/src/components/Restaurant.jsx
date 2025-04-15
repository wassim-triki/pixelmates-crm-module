import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    getRestaurants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10 relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/bg.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
        }}
      />
      
      <div className="relative z-10 w-full max-w-7xl">
        <h1 className="text-4xl font-bold text-white text-center mb-10">
          🍽️ Our Partnered Restaurants
        </h1>

        {restaurants.length === 0 ? (
          <p className="text-white text-center text-lg">No restaurants found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant._id}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg transition-all hover:bg-white/20 hover:scale-[1.02] text-white"
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src="/test.png"
                  alt={restaurant.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                <p className="text-sm opacity-80 mb-1">{restaurant.address}</p>
                <p className="text-sm opacity-80 mb-1">Cuisine: {restaurant.cuisineType}</p>
                {restaurant.promotion && (
                  <p className="text-sm text-yellow-400 mt-2">
                    🔥 Promo: {restaurant.promotion}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
