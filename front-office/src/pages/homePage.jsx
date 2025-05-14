import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/button';
import BlurContainer from '../components/blurContainer';
import Chatbot from '../components/Chatbot';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const menuItems = [
    { id: 1, name: 'Must Explain', price: '$15.00', image: '/test.png' },
    { id: 2, name: 'Must Explain', price: '$25.00', image: '/1.png' },
    { id: 3, name: 'Must Explain', price: '$25.00', image: '/2.png' },
    { id: 4, name: 'Must Explain', price: '$15.00', image: '/3.png' },
  ];

  const [mainImage, setMainImage] = useState(menuItems[0].image);
  const [direction, setDirection] = useState(1);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleHover = (newImage) => {
    if (newImage !== mainImage) {
      setDirection(newImage > mainImage ? 1 : -1);
      setMainImage(newImage);
    }
  };

  // Quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const restaurantQuiz = [
    {
      question: "What's the best practice for making a reservation?",
      options: [
        "Call right before arriving",
        "Use our online system in advance",
        "Send a text message to the restaurant",
        "Arrive without a reservation"
      ],
      correct: 1,
      explanation: "Online reservations guarantee your table and help the restaurant better organize their service."
    },
    {
      question: "What should you do if you have a complaint?",
      options: [
        "Leave without saying anything",
        "Talk immediately to the manager",
        "Post a negative comment online",
        "Wait for your next visit"
      ],
      correct: 1,
      explanation: "Speaking directly to the manager often helps resolve the issue immediately."
    },
    {
      question: "When should you cancel a reservation if you can't make it?",
      options: [
        "Don't cancel",
        "At least 2 hours in advance",
        "The next day",
        "1 hour after the reserved time"
      ],
      correct: 1,
      explanation: "Canceling at least 2 hours in advance allows the restaurant to offer the table to other customers."
    },
    {
      question: "How can you earn loyalty points?",
      options: [
        "By making reservations",
        "By leaving constructive reviews",
        "By participating in our quizzes",
        "All of the above"
      ],
      correct: 3,
      explanation: "All these actions help you accumulate points and benefits!"
    }
  ];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === restaurantQuiz[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < restaurantQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  useEffect(() => {
    const mapContainer = document.getElementById('map');

    if (!mapContainer) {
      console.warn('Map container not found');
      return;
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
        .bindPopup(`${r.name} - Partner restaurant 🍽️`);
    });

    const getCityCountry = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        const city =
          data.address.city || data.address.town || data.address.village || '';
        const country = data.address.country || '';
        return `${city}, ${country}`;
      } catch (error) {
        console.error('Error during reverse geocoding:', error);
        return 'Unknown location';
      }
    };

    map.on('click', async function (e) {
      const { lat, lng } = e.latlng;
      const locationName = await getCityCountry(lat, lng);

      L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `<strong>${locationName}</strong><br>Latitude: ${lat.toFixed(
            4
          )}<br>Longitude: ${lng.toFixed(4)}`
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
              {/* Header and Buttons Before Login */}
              {!user ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                  <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
                      Welcome to The MenuFy!
                    </h1>
                    <p className="text-lg sm:text-xl text-white">
                    Elevating restaurant experiences with seamless menu management, effortless reservations, 
                    smart complaint handling and personalized loyalty rewards.
                    </p>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button
                        onClick={() => navigate('/login')} 
                        className="bg-[#FA8072] hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-all"
                      >
                       👤 Get Started
                      </Button>
                      <Button
                        onClick={() => navigate('/about-us')} 
                        className="!bg-transparent hover:!bg-[#FA8072] text-black hover:text-white border-2 border-black font-semibold py-3 px-6 rounded-full transition-all duration-300"
                      >
                        📚 Learn More
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
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                  <div className="flex flex-col space-y-6 md:w-1/2 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">
                      Welcome back to The MenuFy, {user.lastName} {user.firstName}!
                    </h1>
                    <p className="text-lg sm:text-xl text-white">
                    Elevate your restaurant's operations with real-time menu management, smart reservations
                     and seamless customer service. Empower your team and delight your customers!
                    </p>
                    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                    <Button
                        onClick={() => navigate('/restaurant')} 
                        className="bg-[#FA8072] hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-all"
                      >
                        🍽️ Manage Menu
                      </Button>
                      <Button
                        onClick={() => navigate('/reservation')} 
                        className="!bg-transparent hover:!bg-[#FA8072] text-black hover:text-white border-2 border-black font-semibold py-3 px-6 rounded-full transition-all duration-300"
                      >
                        📅 Reserve Now
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
              )}

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
                      <p className="text-lg font-bold text-white">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quiz Section */}
              <div className="bg-black/10 py-16 px-4 sm:px-6 lg:px-16 backdrop-blur-md rounded-xl">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                    Reservations & Complaints Quiz 🧠
                  </h2>
                  {!quizStarted ? (
                    <div>
                      <p className="text-white mb-8 text-lg">
                        Test your knowledge about our reservation system and earn loyalty points!
                      </p>
                      <Button
                        onClick={() => setQuizStarted(true)}
                        className="bg-[#FA8072] hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-all"
                      >
                        Start Quiz
                      </Button>
                    </div>
                  ) : showResult ? (
                    <div className="bg-white/10 p-8 rounded-xl">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Your score: {score}/{restaurantQuiz.length}
                      </h3>
                      <p className="text-white mb-6">
                        {score === restaurantQuiz.length 
                          ? "Excellent! You perfectly master our system!" 
                          : score > restaurantQuiz.length/2 
                            ? "Good score! You know our system well!" 
                            : "Thanks for participating! You know more now!"}
                      </p>
                      <div className="mt-6 space-y-4 text-left">
                        {restaurantQuiz.map((question, index) => (
                          <div key={index} className="bg-black/20 p-4 rounded-lg">
                            <p className="font-semibold text-white">{question.question}</p>
                            <p className="text-sm text-white/80 mt-2">{question.explanation}</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={resetQuiz}
                        className="mt-6 bg-[#FA8072] hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-all"
                      >
                        Retake Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white/10 p-8 rounded-xl text-left">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">
                          Question {currentQuestion + 1}/{restaurantQuiz.length}
                        </h3>
                        <span className="text-white font-semibold">Score: {score}</span>
                      </div>
                      <p className="text-white text-lg mb-6">{restaurantQuiz[currentQuestion].question}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {restaurantQuiz[currentQuestion].options.map((option, index) => (
                          <Button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            className="bg-black/20 hover:bg-[#FA8072] text-white font-semibold py-3 px-6 rounded-full transition-all text-left"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

{/* Enhanced Mini Games Section */}
<section className="mt-20 flex flex-col items-center space-y-12">
  <h1 className="text-4xl font-bold text-center text-white">🎮 Play & Earn Reward Points</h1>
  <p className="text-white max-w-x3l text-center">Complete fun challenges to earn points you can redeem for discounts and special offers!</p>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
    {/* Food Catch Game */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-40 bg-gradient-to-r from-orange-400 to-pink-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <span className="text-6xl z-10">🍣</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-center">🍽️ Dish Dash</h3>
        <p className="text-gray-600 mb-4">Catch falling dishes before they hit the ground!</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">High Score: <span className="text-[#FA8072]">250</span></span>
          <span className="text-sm font-medium">Reward: <span className="text-green-500">10 pts</span></span>
        </div>
        <Button 
          onClick={() => navigate('/games/food')} 
          className="w-full bg-[#FA8072] hover:bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play Now
        </Button>
      </div>
    </div>

    {/* Reservation Challenge */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-40 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <span className="text-6xl z-10">⏱️</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-center">⏳ Time Crunch</h3>
        <p className="text-gray-600 mb-4">Match customers to their reservation times before time runs out!</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">High Score: <span className="text-[#FA8072]">18/20</span></span>
          <span className="text-sm font-medium">Reward: <span className="text-green-500">15 pts</span></span>
        </div>
        <Button 
          onClick={() => navigate('/games/reservation')} 
          className="w-full bg-[#FA8072] hover:bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play Now
        </Button>
      </div>
    </div>

    {/* Customer Satisfaction Game */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <div className="relative h-40 bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <span className="text-6xl z-10">😊</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-center">😃 Mood Booster</h3>
        <p className="text-gray-600 mb-4">Turn angry customers into happy ones with your service skills!</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">High Score: <span className="text-[#FA8072]">95%</span></span>
          <span className="text-sm font-medium">Reward: <span className="text-green-500">20 pts</span></span>
        </div>
        <Button 
          onClick={() => navigate('/games/complaint')} 
          className="w-full bg-[#FA8072] hover:bg-black text-white py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Play Now
        </Button>
      </div>
    </div>
  </div>
</section>

              {/* Testimonials Section */}
              <div className="bg-black/10 py-16 px-2 sm:px-6 lg:px-16 backdrop-blur-md">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                    What Our Customers Say 🌟
                  </h2>
                  <div className="grid gap-8 md:grid-cols-3">
                    {[
                      {
                        name: 'Sami M.',
                        comment:
                          'TheMenuFy has completely transformed how we handle our daily menu updates. Fast, elegant, and super easy to use!',
                      },
                      {
                        name: 'Leila B.',
                        comment:
                          'I love how intuitive and beautiful the platform is. Our clients appreciate the sleek digital menu too!',
                      },
                      {
                        name: 'Khaled Z.',
                        comment:
                          'The reservation tools and location map are fantastic. We have seen more foot traffic since we joined!',
                      },
                    ].map((testimonial, index) => (
                      <div
                        key={index}
                        className="bg-white/10 text-white p-6 rounded-xl shadow-md hover:bg-white/20 transition-all"
                      >
                        <p className="text-lg italic">
                          "{testimonial.comment}"
                        </p>
                        <p className="mt-4 font-semibold">{testimonial.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meet Our Chefs Section */}
              <div className="bg-black/10 py-16 px-4 sm:px-6 lg:px-16 backdrop-blur-md">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                    Meet Our Talented Chefs
                  </h2>
                  <p className="text-white mb-12 max-w-2xl mx-auto text-lg">
                    Behind every delicious menu item is a passionate chef
                    crafting unique culinary experiences.
                  </p>
                  <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                    {[
                      {
                        name: 'Chef Fares',
                        role: 'Head of Fusion Cuisine',
                        image: '/chef1.jpg',
                      },
                      {
                        name: 'Chef Youssef',
                        role: 'Pastry Expert',
                        image: '/chef2.jpg',
                      },
                      {
                        name: 'Chef Lina',
                        role: 'Mediterranean Specialist',
                        image: '/chef3.jpg',
                      },
                    ].map((chef, index) => (
                      <div
                        key={index}
                        className="bg-white/10 p-6 rounded-xl text-white flex flex-col items-center hover:bg-white/20 transition-all"
                      >
                        <img
                          src={chef.image}
                          alt={chef.name}
                          className="w-32 h-32 object-cover rounded-full shadow-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold">{chef.name}</h3>
                        <p className="text-sm italic mt-1">{chef.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Our Story Section */}
              <div className="bg-black/10 py-16 px-4 sm:px-6 lg:px-16 backdrop-blur-md">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                    Our Story
                  </h2>
                  <p className="text-white mb-12 max-w-2xl mx-auto text-lg">
                    At TheMenuFy, our vision is to provide customers with a
                    memorable culinary experience by combining creativity,
                    freshness and authenticity. We are committed to helping
                    restaurants enhance their customer experience through
                    innovative features like smart reservation management,
                    intelligent complaint handling and a customer loyalty
                    program. Our journey began with the goal of simplifying menu
                    management and today, we're empowering restaurants to offer
                    exceptional dining experiences.
                  </p>

                  <Button
                    onClick={() => navigate('/about-us')}
                    className="bg-[#FA8072] hover:bg-black text-white font-semibold py-3 px-6 rounded-full transition-all"
                  >
                    More Details 
                  </Button>
                </div>
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
            Customize your restaurant experience with advanced tools that help
            you grow your business. Track reservations, improve customer
            interactions and boost your kitchen's efficiency.
          </p>
          <div className="flex justify-center mt-8">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-full transition-all">
              Discover More
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col md:flex-row items-center justify-between w-[90%] md:w-[80%]">
            {/* Map */}
            <div className="rounded-2xl shadow-lg overflow-hidden w-full md:w-[60%] h-[300px]">
              <div id="map" className="w-full h-full" />
            </div>
            <div
              className="md:w-[35%] mt-4 md:mt-0 md:ml-8 text-center md:text-left bg-black/10 backdrop-blur-sm p-6 rounded-lg shadow-lg"
              id="map-text-container"
            >
              <h3 className="text-2xl font-bold text-white text-center">
                Explore Our Partnered Locations
              </h3>
              <p className="mt-4 text-lg text-white text-center">
                Click on the map to explore partnered restaurants. Find out more
                about each restaurant's offerings and locations by clicking on
                their markers.
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