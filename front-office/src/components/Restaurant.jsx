import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 8;
  const indexOfLast = currentPage * restaurantsPerPage;
  const indexOfFirst = indexOfLast - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirst,
    indexOfLast
  );

  useEffect(() => {
    const getRestaurants = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/restaurants'
        );
        setRestaurants(response.data.restaurants);
        setFilteredRestaurants(response.data.restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    getRestaurants();
  }, []);

  useEffect(() => {
    const filterRestaurants = () => {
      let filtered = restaurants;

      if (searchTerm) {
        filtered = filtered.filter((r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (addressSearch) {
        filtered = filtered.filter((r) =>
          r.address.toLowerCase().includes(addressSearch.toLowerCase())
        );
      }

      if (selectedCuisine) {
        filtered = filtered.filter((r) => r.cuisineType === selectedCuisine);
      }

      setFilteredRestaurants(filtered);
      setCurrentPage(1);
    };

    filterRestaurants();
  }, [searchTerm, addressSearch, selectedCuisine, restaurants]);

  const cuisines = [...new Set(restaurants.map((r) => r.cuisineType))];

  return (
    <div className="min-h-screen -sz-10 bg-gray-100 flex flex-col items-center justify-center px-4 py-10 pt-40 relative">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 w-full max-w-7xl pt-20">
        <h1 className="text-4xl font-bold text-yellow-300 text-center mb-12 drop-shadow-md">
          🍽️ Our Partnered Restaurants
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center items-center mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black shadow-md"
          />
          <input
            type="text"
            placeholder="Search by address..."
            value={addressSearch}
            onChange={(e) => setAddressSearch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black shadow-md"
          />
          <select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-black shadow-md"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : currentRestaurants.length === 0 ? (
          <p className="text-white text-center text-lg">
            No restaurants found.
          </p>
        ) : (
          <>
            <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant._id}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:bg-white/20 hover:scale-[1.02] text-white"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <img
                    src={restaurant.logo || '/test.png'}
                    alt={restaurant.name}
                    className="w-full h-40 object-cover bg-white rounded-lg mb-4 p-2"
                  />
                  <h3 className="text-xl font-semibold mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm opacity-90 mb-1">
                    {restaurant.address}
                  </p>
                  <p className="text-sm opacity-90 mb-1">
                    Cuisine: {restaurant.cuisineType}
                  </p>
                  <p className="text-sm opacity-90 mb-1">
                    Rating: {restaurant.note} ⭐
                  </p>
                  {restaurant.promotion && (
                    <p className="text-sm text-yellow-400 mt-2">
                      🔥 Promo: {restaurant.promotion}
                    </p>
                  )}
                  <button className="mt-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all">
                    View Details
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
              {Array.from(
                {
                  length: Math.ceil(
                    filteredRestaurants.length / restaurantsPerPage
                  ),
                },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white text-black'
                    } shadow-md`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
