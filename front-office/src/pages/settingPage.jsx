import React, { useState } from 'react';
import { Sun, Moon, Bell, Globe } from 'lucide-react'; // Icônes
import BlurContainer from '../components/blurContainer'; // Conteneur avec effet blur
import Button from '../components/button'; // Bouton stylisé
import Footer from '../components/footer'; // Footer

const Settings = () => {
  // États pour les préférences
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* Main Content */}
      <main className="relative flex-grow flex items-center justify-center py-6 px-4 sm:px-6 lg:px-20">
        <div className="w-full max-w-md sm:w-[480px] p-10 rounded-2xl bg-white/20 backdrop-blur-xl flex flex-col justify-between">
          {/* Centered Title */}
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-white pt-4">Settings</h1>
          </div>

          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="text-[#FA8072]" size={22} />
                ) : (
                  <Sun className="text-[#FA8072]" size={22} />
                )}
                <span className="text-white">Dark Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  darkMode ? 'bg-[#FA8072]' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-0'
                  } transition`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="text-[#FA8072]" size={22} />
                <span className="text-white">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  notifications ? 'bg-[#FA8072]' : 'bg-gray-500'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  } transition`}
                />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="text-[#FA8072]" size={22} />
                <span className="text-white">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white border border-gray-300/30 rounded-md px-2 py-1 focus:outline-none"
              >
                <option className="text-black" value="English">
                  English
                </option>
                <option className="text-black" value="Français">
                  Français
                </option>
                <option className="text-black" value="Español">
                  Español
                </option>
              </select>
            </div>

            {/* Save Button */}
            <Button className="w-full bg-[#FA8072] hover:bg-[#FA8072] text-white hover:text-white border-2 border-[#FA8072] font-semibold py-3 px-6 rounded-full transition-all duration-300">
              Save Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
