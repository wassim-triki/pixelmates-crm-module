import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ComplaintGame = () => {
  const moods = [
    { emoji: '😠', name: 'Furious' },
    { emoji: '😡', name: 'Angry' },
    { emoji: '🤬', name: 'Enraged' },
    { emoji: '😤', name: 'Frustrated' },
    { emoji: '😒', name: 'Annoyed' },
    { emoji: '🙂', name: 'Neutral' },
    { emoji: '😊', name: 'Pleased' },
    { emoji: '😄', name: 'Happy' },
    { emoji: '😍', name: 'Delighted' }
  ];

  const [currentMood, setCurrentMood] = useState(moods[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [customersHelped, setCustomersHelped] = useState(0);
  const [powerUps, setPowerUps] = useState([
    { emoji: '🍷', effect: 1, text: 'Wine', uses: 3, cooldown: 0 },
    { emoji: '🍰', effect: 2, text: 'Dessert', uses: 2, cooldown: 0 },
    { emoji: '💺', effect: 3, text: 'Better Table', uses: 1, cooldown: 0 }
  ]);

  const actions = [
    { emoji: '😊', effect: 1, text: 'Smile' },
    { emoji: '💬', effect: 1, text: 'Apologize' },
    { emoji: '🔄', effect: 1, text: 'Replace Dish' },
    { emoji: '👨‍🍳', effect: 2, text: 'Call Chef' }
  ];

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    setCurrentMood(moods[0]);
    setCustomersHelped(0);
    setPowerUps(powerUps.map(p => ({ ...p, uses: p.text === 'Wine' ? 3 : p.text === 'Dessert' ? 2 : 1, cooldown: 0 })));
  };

  useEffect(() => {
    if (!gameActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const cooldownTimer = setInterval(() => {
      setPowerUps(prev => prev.map(p => ({
        ...p,
        cooldown: p.cooldown > 0 ? p.cooldown - 1 : 0
      })));
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(cooldownTimer);
    };
  }, [gameActive]);

  const handleAction = (effect) => {
    const currentIndex = moods.findIndex(m => m.emoji === currentMood.emoji);
    const newIndex = Math.min(currentIndex + effect, moods.length - 1);
    setCurrentMood(moods[newIndex]);
    
    if (newIndex >= 5) { // Happy customer
      const pointsEarned = (newIndex - 4) * 10;
      setScore(prev => prev + pointsEarned);
      setCustomersHelped(prev => prev + 1);
      
      setTimeout(() => {
        setCurrentMood(moods[Math.floor(Math.random() * 3)]); // New angry customer
      }, 1000);
    }
  };

  const usePowerUp = (index) => {
    if (powerUps[index].uses <= 0 || powerUps[index].cooldown > 0) return;
    
    handleAction(powerUps[index].effect);
    setPowerUps(prev => prev.map((p, i) => 
      i === index ? { ...p, uses: p.uses - 1, cooldown: 5 } : p
    ));
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
            {['😄','❗', '❓', '😡', '😤','😍'][i % 4]}
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
            <h1 className="text-4xl font-bold text-white mb-2">😃 Mood Booster</h1>
            <p className="text-lg text-gray-200 max-w-md mx-auto">
              Turn angry customers into happy ones with your service skills!
            </p>
          </div>

          {!gameActive ? (
            <div className="space-y-8 text-center">
              <div className="bg-white/10 p-6 rounded-lg border border-[#FA8072]/30">
                <h2 className="text-2xl font-semibold mb-4 text-white">How to Play</h2>
                <ul className="text-left list-disc pl-5 space-y-2 max-w-md mx-auto text-gray-200">
                  <li>Use actions to improve customer mood</li>
                  <li>Basic actions always available</li>
                  <li>Power-ups have limited uses</li>
                  <li>Each happy customer earns points based on satisfaction level</li>
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
                    Customers helped: <span className="font-medium">{customersHelped}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white/10 p-4 rounded-lg border border-[#FA8072]/30">
                <div className="text-xl font-semibold text-white">
                  Score: <span className="text-[#FA8072]">{score}</span>
                </div>
                <div className="text-xl font-semibold text-white">
                  Time: <span className={timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}>{timeLeft}s</span>
                </div>
              </div>

              <motion.div 
                className="bg-white/20 p-8 rounded-lg shadow text-center border border-[#FA8072]/30"
                animate={{ 
                  backgroundColor: currentMood.emoji === '😠' ? 'rgba(254, 226, 226, 0.2)' : 
                                currentMood.emoji === '😡' ? 'rgba(255, 237, 213, 0.2)' : 
                                currentMood.emoji === '🤬' ? 'rgba(254, 243, 199, 0.2)' :
                                currentMood.emoji === '😤' ? 'rgba(236, 252, 203, 0.2)' :
                                currentMood.emoji === '😒' ? 'rgba(220, 252, 231, 0.2)' :
                                currentMood.emoji === '🙂' ? 'rgba(204, 251, 241, 0.2)' :
                                currentMood.emoji === '😊' ? 'rgba(224, 242, 254, 0.2)' :
                                currentMood.emoji === '😄' ? 'rgba(219, 234, 254, 0.2)' : 'rgba(237, 233, 254, 0.2)'
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="text-9xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                  key={currentMood.emoji}
                >
                  {currentMood.emoji}
                </motion.div>
                <h3 className="text-2xl font-semibold text-white">{currentMood.name}</h3>
              </motion.div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-3 text-white">Power-Ups</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {powerUps.map((powerUp, index) => (
                      <motion.button
                        key={index}
                        onClick={() => usePowerUp(index)}
                        disabled={powerUp.uses <= 0 || powerUp.cooldown > 0}
                        className={`p-3 rounded-lg flex flex-col items-center transition ${
                          powerUp.uses <= 0 ? 'bg-gray-500/20 text-gray-400' :
                          powerUp.cooldown > 0 ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-purple-500/20 hover:bg-purple-500/30 text-purple-200'
                        } border border-[#FA8072]/30`}
                        whileHover={{ scale: powerUp.uses > 0 && powerUp.cooldown <= 0 ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-3xl">{powerUp.emoji}</span>
                        <span className="text-sm mt-1">{powerUp.text}</span>
                        <div className="text-xs mt-1">
                          {powerUp.uses > 0 ? (
                            powerUp.cooldown > 0 ? `Cooldown: ${powerUp.cooldown}s` : `Uses: ${powerUp.uses}`
                          ) : 'Used up'}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-3 text-white">Actions</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {actions.map((action, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAction(action.effect)}
                        className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg flex flex-col items-center transition border border-[#FA8072]/30 text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-3xl">{action.emoji}</span>
                        <span className="text-sm mt-1">{action.text}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintGame;