import React, { useState } from "react";
import { Sun, Moon, Bell, Globe } from "lucide-react"; // Icônes
import BlurContainer from "../components/blurContainer"; // Conteneur avec effet blur
import Button from "../components/button"; // Bouton stylisé
import Footer from "../components/footer"; // Footer

const Settings = () => {
  // États pour les préférences
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <h1 className="text-3xl font-bold text-center mb-6">Settings</h1>

          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="text-yellow-500" size={22} />
                ) : (
                  <Sun className="text-yellow-500" size={22} />
                )}
                <span className="text-white">Dark Mode</span>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  darkMode ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  } transition`}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="text-yellow-500" size={22} />
                <span className="text-white">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  notifications ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    notifications ? "translate-x-6" : "translate-x-0"
                  } transition`}
                />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="text-yellow-500" size={22} />
                <span className="text-white">Language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
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
            <Button className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300">
              Save Settings
            </Button>
          </div>
        </BlurContainer>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
