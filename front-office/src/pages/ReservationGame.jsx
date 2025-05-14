import React, { useState, useEffect } from 'react';
import Confetti from 'react-dom-confetti';
import { motion } from 'framer-motion';

const ReservationGame = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [choices, setChoices] = useState([]);
  const [streak, setStreak] = useState(0);
  const [confetti, setConfetti] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [highestStreak, setHighestStreak] = useState(0);

  const timeSlots = {
    easy: ['12:00', '12:30', '1:00', '6:00', '6:30', '7:00'],
    medium: ['11:30', '12:00', '12:30', '1:00', '1:30', '6:00', '6:30', '7:00', '7:30'],
    hard: ['11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '1:00', '1:15', '5:45', '6:00', '6:15', '6:30', '6:45', '7:00', '7:15']
  };

  const partySizes = [2, 3, 4, 5, 6, 8, 10];

  const generateChallenge = () => {
    const customer = `Party of ${partySizes[Math.floor(Math.random() * partySizes.length)]}`;
    const correctTime = timeSlots[difficulty][Math.floor(Math.random() * timeSlots[difficulty].length)];
    
    let options = timeSlots[difficulty]
      .filter(t => t !== correctTime)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    options.push(correctTime);
    options = options.sort(() => 0.5 - Math.random());

    setCurrentChallenge({ customer, correctTime });
    setChoices(options);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setTimeLeft(difficulty === 'easy' ? 35 : difficulty === 'medium' ? 25 : 20);
    setGameActive(true);
    generateChallenge();
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

    return () => clearInterval(timer);
  }, [gameActive, difficulty]);

  const handleAnswer = (selectedTime) => {
    if (selectedTime === currentChallenge.correctTime) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      const pointsEarned = 5 + (newStreak >= 3 ? Math.floor(newStreak / 3) : 0);
      setScore(prev => prev + pointsEarned);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 500);
      generateChallenge();
    } else {
      setStreak(0);
      setTimeLeft(prev => Math.max(0, prev - (difficulty === 'hard' ? 5 : 3)));
    }
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
            {['⏰', '🕒', '🕓', '🕔'][i % 4]}
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
            <h1 className="text-4xl font-bold text-white mb-2">⏳ Time Crunch</h1>
            <p className="text-lg text-gray-200 max-w-md mx-auto">
              Match customers to their reservation times in this fast-paced restaurant challenge!
            </p>
          </div>

          {!gameActive ? (
            <div className="space-y-8 text-center">
              <div className="bg-white/10 p-6 rounded-lg border border-[#FA8072]/30">
                <h2 className="text-2xl font-semibold mb-4 text-white">How to Play</h2>
                <ul className="text-left list-disc pl-5 space-y-2 max-w-md mx-auto text-gray-200">
                  <li>Match the party size with the correct time slot</li>
                  <li>Each correct answer gives you 5 points</li>
                  <li>Build streaks to earn bonus points</li>
                  <li>Wrong answers reduce your time</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Difficulty</label>
                  <div className="flex justify-center gap-4">
                    {['easy', 'medium', 'hard'].map((level) => (
                      <motion.button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`px-4 py-2 rounded-full capitalize ${difficulty === level 
                          ? 'bg-[#FA8072] text-white' 
                          : 'bg-gray-200/20 text-gray-200 hover:bg-gray-300/20'}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={startGame}
                  className="px-8 py-3 bg-[#FA8072] hover:bg-black text-white text-lg font-semibold rounded-lg transition-all transform hover:scale-105 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Game
                </motion.button>
              </div>

              {score > 0 && (
                <div className="mt-6 p-4 bg-[#FA8072]/10 rounded-lg border border-[#FA8072]/30">
                  <div className="text-xl font-medium text-white">
                    Last Score: <span className="text-[#FA8072]">{score}</span>
                  </div>
                  <div className="text-gray-200">
                    Highest Streak: <span className="font-medium">{highestStreak}x</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white/10 p-4 rounded-lg border border-[#FA8072]/30">
                <div className="text-xl font-semibold text-white">
                  Score: <span className="text-[#FA8072]">{score}</span>
                  {streak >= 3 && (
                    <span className="ml-2 bg-yellow-500/20 text-yellow-200 text-sm px-2 py-1 rounded-full">
                      Streak: {streak}x 🔥
                    </span>
                  )}
                </div>
                <div className="text-xl font-semibold text-white">
                  Time: <span className={timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}>{timeLeft}s</span>
                </div>
              </div>

              <div className="bg-white/10 border border-[#FA8072]/30 p-6 rounded-lg shadow-sm text-center">
                <div className="mb-4">
                  <span className="inline-block bg-blue-400/20 text-blue-200 text-lg px-4 py-2 rounded-full">
                    {currentChallenge.customer}
                  </span>
                </div>
                <p className="text-gray-200 mb-6">needs a reservation at:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {choices.map((time, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(time)}
                      className="p-4 bg-white/10 border-2 border-[#FA8072]/30 hover:border-[#FA8072] rounded-xl text-xl font-medium text-white transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {time}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Confetti active={confetti} config={{ elementCount: 50, spread: 70 }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationGame;