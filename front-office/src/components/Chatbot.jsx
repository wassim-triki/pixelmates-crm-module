import React, { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/authContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  const apiKey = "73676677ec625895ec0e633a2c792e3a";

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const getWeather = async (city = "Paris") => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`
      );
      const data = await response.json();
  
      if (data.cod === 200) {
        const temp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const visibility = data.visibility;
        const windSpeed = data.wind.speed;
        const windDeg = data.wind.deg;
        const description = data.weather[0].description;
  
        const windDirection = degToCompass(windDeg);
  
        const message = `
  🌤️ **Weather Report for ${city}:**\n
  - 🌥️ **Condition**: ${description}\n
  - 🌡️ **Temperature**: ${temp.toFixed(1)}°C (Feels like: ${feelsLike.toFixed(1)}°C)\n
  - 💧 **Humidity**: ${humidity}%\n
  - 🌬️ **Wind Speed**: ${windSpeed} m/s from ${windDirection}\n
  - 🌫️ **Visibility**: ${(visibility / 1000).toFixed(1)} km\n
  - 🧭 **Pressure**: ${pressure} hPa\n
  - 🌪️ **Wind Direction**: ${windDirection} (from ${windDeg}°)\n
  - 💧 **Humidity Level**: ${humidity >= 90 ? 'High humidity 🌧️' : 'Comfortable 🌤️'}\n\n
  📍 Stay safe and enjoy your day!
  `;
  
        return message;
      } else {
        return `Error: ${data.message}`;
      }
    } catch (error) {
      return "Something went wrong while fetching the weather.";
    }
  };
  
  // Convert wind degrees to compass direction
  const degToCompass = (num) => {
    const val = Math.floor((num / 22.5) + 0.5);
    const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                 "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[val % 16];
  };
  
  
  

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const normalizedInput = userInput.toLowerCase().trim();
      setIsTyping(true);

      let botResponse = "I'm sorry, I didn't understand that.";

      if (/\b(hello|hi|salem|hey|hiya|hola|howdy)\b/.test(normalizedInput)) {
        botResponse = "Hello! How can I assist you today?";
      } else if (/\b(how are you|how's it going|how are you doing|how do you do|how are u|how are u doing)\b/.test(normalizedInput)) {
        botResponse = "I'm doing great, thank you for asking!";
      } else if (/\b(what is your name|who are you|what's your name|who are u)\b/.test(normalizedInput)) {
        if (user) {
          botResponse = `I am your friendly chatbot, and your name is ${user.firstName} ${user.lastName}!`;
        } else {
          botResponse = "Please log in so I can know your name!";
        }
      } else if (/\b(what is my name|who am i|what is my full name|what's my name|what's my full name)\b/.test(normalizedInput)) {
        if (user) {
          botResponse = `Your name is ${user.lastName} ${user.firstName}!`;
        } else {
          botResponse = "Please log in to get your full name!";
        }
      } else if (/\b(what is the date today|what time is it|current time|what's the date today)\b/.test(normalizedInput)) {
        const currentDate = new Date();
        const dateString = currentDate.toLocaleString();
        botResponse = `Today is ${dateString}`;
      } else if (/\b(tell me a joke|make me laugh|give me a joke|joke)\b/.test(normalizedInput)) {
        botResponse = "Why don't skeletons fight each other? They don't have the guts!";
      } else if (/\b(can you help me with my order|order assistance|help with my order)\b/.test(normalizedInput)) {
        botResponse = "Of course! I can assist you with tracking or updating your order. Could you provide your order number, please?";
      } else if (/\b(what is the weather today|how's the weather|what's the weather today)\b/.test(normalizedInput)) {
        botResponse = await getWeather(); 
      } else if (/\b(what is the time in)\b/.test(normalizedInput)) {
        const cityMatch = normalizedInput.match(/what is the time in (\w+)/i);
        if (cityMatch && cityMatch[1]) {
          const city = cityMatch[1];
          botResponse = `I don't have real-time access to time zone data, but you can easily check the time in ${city} using any world clock service!`;
        } else {
          botResponse = "Please provide a city to check the time.";
        }
      } else if (/\b(what is the weather in|how is the weather in|weather in)\b/.test(normalizedInput)) {
        const cityMatch = normalizedInput.match(/(?:weather in|what is the weather in|how is the weather in) ([a-zA-Z\s]+)/);
        if (cityMatch && cityMatch[1]) {
          const city = cityMatch[1].trim();
          botResponse = await getWeather(city);
        } else {
          botResponse = "Could you please specify the location you'd like to know the weather for?";
        }
      } else if (/\b(what can u do|what can you do)\b/.test(normalizedInput)) {
        botResponse = "I am your friendly chatbot, here to assist you with whatever you need!";
      } else if (/\b(how do i contact support|how to contact support|how to contact u|your contact|give me your contact)\b/.test(normalizedInput)) {
        botResponse = "You can contact support through our support page or by emailing menu.comapp@gmail.com!";
      } else if (/\b(what is your purpose|what can you help with|why are you here|why are u here|what can u help|help me )\b/.test(normalizedInput)) {
        botResponse = "I'm here to assist you with your questions and help you navigate the website!";
      } else {
        botResponse = "I'm not sure about that. Could you clarify your question?";
      }

      setIsTyping(false);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: botResponse },
      ]);
      setUserInput('');
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      const inputElement = document.getElementById('user-input');
      if (inputElement) inputElement.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ sender: 'bot', text: "Hello! I'm MenuFy Assistant, how can I assist you today?" }]);
    }
  }, [isOpen, messages]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-[#FA8072] hover:bg-[#f56a59] text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        {isOpen ? 'Close' : 'MenuFy Assistant'}
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-[450px] max-h-[80vh] overflow-auto bg-white border-2 border-[#FA8072] rounded-lg shadow-lg p-4 flex flex-col">
          <div className="text-center font-semibold text-lg mb-4">Ask MenuFy Assistant</div>

          <div className="flex justify-end mb-2">
            <button onClick={toggleChatbot} className="text-[#FA8072] text-xl hover:text-[#f56a59]">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col h-full">
            <div id="chat-container" className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-[#FA8072] text-white' : 'bg-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-left text-gray-500 p-2 animate-pulse">Bot is typing...</div>}
            </div>

            <div className="flex space-x-2 relative">
              <input
                id="user-input"
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border border-gray-300 rounded-lg pl-10"
                placeholder="Type a message..."
              />
              <FaPaperPlane
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[black] cursor-pointer hover:text-[#f56a59] transition-all duration-300"
                onClick={handleSendMessage}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
