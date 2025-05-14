import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FoodGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const gameAreaRef = useRef(null);
  const dishTypes = ['🍕', '🍣', '🍔', '🌮', '🥗', '🍝', '🍤', '🥘'];
  const specialDishes = ['🍰', '🎂', '🍾'];

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setTimeLeft(30);
    setGameActive(true);
    setDishes([]);
  };

  useEffect(() => {
    if (!gameActive) return;

    const dishInterval = setInterval(() => {
      const isSpecial = Math.random() < 0.15;
      setDishes(prev => [
        ...prev,
        {
          id: Date.now(),
          type: isSpecial 
            ? specialDishes[Math.floor(Math.random() * specialDishes.length)]
            : dishTypes[Math.floor(Math.random() * dishTypes.length)],
          position: Math.floor(Math.random() * 80) + 10,
          caught: false,
          isSpecial,
          speed: 1 + Math.random() * 2
        }
      ]);
    }, 600);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(dishInterval);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(dishInterval);
    };
  }, [gameActive]);

  const catchDish = (id, isSpecial) => {
    setDishes(prev => prev.map(dish => 
      dish.id === id ? {...dish, caught: true} : dish
    ));
    
    const points = isSpecial ? 25 : 10;
    setScore(prev => prev + points);
    
    const newCombo = combo + 1;
    setCombo(newCombo);
    if (newCombo > highestCombo) setHighestCombo(newCombo);
    
    setTimeout(() => {
      setCombo(prev => prev > 0 ? prev - 1 : 0);
    }, 2000);
  };

  const getGameAreaHeight = () => {
    return gameAreaRef.current?.clientHeight || 400;
  };

  return (
    <div className="min-h-screen relative pt-20 pb-12 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#FA8072]/10 text-4xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {['🍕', '🍣', '🍔', '🌮'][i % 4]}
          </motion.div>
        ))}
      </div>

      {/* Dark blurred background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Backg_Login.png')",
          filter: 'brightness(0.5) blur(5px)',
        }}
      />
      
      <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-xl rounded-xl shadow-lg overflow-hidden border border-[#FA8072]/30">
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">🍽️ Dish Dash</h1>
            <p className="text-lg text-gray-200 max-w-md mx-auto">
              Catch falling dishes to earn points in this frantic kitchen game!
            </p>
          </div>

          {!gameActive ? (
            <div className="space-y-8 text-center">
              <div className="bg-white/10 p-6 rounded-lg border border-[#FA8072]/30">
                <h2 className="text-2xl font-semibold mb-4 text-white">How to Play</h2>
                <ul className="text-left list-disc pl-5 space-y-2 max-w-md mx-auto text-gray-200">
                  <li>Click on falling dishes to catch them</li>
                  <li>Regular dishes: 10 points</li>
                  <li>Special dishes (cake, champagne): 25 points</li>
                  <li>Build combos for bonus points</li>
                  <li>Don't let any hit the floor!</li>
                </ul>
              </div>

              <motion.button
                onClick={startGame}
                className="px-8 py-3 bg-[#FA8072] hover:bg-black text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Game
              </motion.button>

              {score > 0 && (
                <div className="mt-6 p-4 bg-[#FA8072]/10 rounded-lg border border-[#FA8072]/30">
                  <div className="text-xl font-medium text-white">
                    Last Score: <span className="text-[#FA8072]">{score}</span>
                  </div>
                  <div className="text-gray-200">
                    Highest Combo: <span className="font-medium">{highestCombo}x</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/10 p-4 rounded-lg border border-[#FA8072]/30">
                <div className="text-xl font-semibold text-white">
                  Score: <span className="text-[#FA8072]">{score}</span>
                  {combo >= 3 && (
                    <span className="ml-2 bg-yellow-500/20 text-yellow-200 text-sm px-2 py-1 rounded-full">
                      Combo: {combo}x 🔥
                    </span>
                  )}
                </div>
                <div className="text-xl font-semibold text-white">
                  Time: <span className={timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}>{timeLeft}s</span>
                </div>
              </div>

              <div 
                ref={gameAreaRef}
                className="relative h-96 w-full bg-white/10 rounded-lg border-2 border-dashed border-[#FA8072]/30 overflow-hidden"
              >
                <AnimatePresence>
                  {dishes.map(dish => (
                    !dish.caught && (
                      <motion.button
                        key={dish.id}
                        className={`absolute text-4xl cursor-pointer ${dish.isSpecial ? 'animate-bounce' : ''}`}
                        style={{ left: `${dish.position}%` }}
                        initial={{ top: -50 }}
                        animate={{ top: getGameAreaHeight() }}
                        transition={{ duration: dish.speed, ease: "linear" }}
                        onClick={() => catchDish(dish.id, dish.isSpecial)}
                        onAnimationComplete={() => {
                          setDishes(prev => prev.filter(d => d.id !== dish.id));
                          setCombo(0);
                        }}
                      >
                        {dish.type}
                      </motion.button>
                    )
                  ))}
                </AnimatePresence>
              </div>

              <div className="text-center text-gray-200">
                <p>Special dishes: {specialDishes.join(' ')} = 25 points!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodGame;