// components/Chatbot.js
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa'; // Import de l'icône FontAwesome
import { useAuth } from '../context/AuthContext'; // Importer le hook useAuth pour récupérer les informations de l'utilisateur

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Contrôle de l'ouverture et de la fermeture du chatbot
  const { user } = useAuth(); 

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      let botResponse = "I'm sorry, I didn't understand that."; // Réponse par défaut

      // Ajouter des réponses pour certaines questions fréquentes
      if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        botResponse = "Hello! How can I assist you today?";
      } else if (userInput.toLowerCase().includes('how are you')) {
        botResponse = "I'm doing great, thank you for asking!";
      } else if (userInput.toLowerCase().includes('what is your name')) {
        botResponse = `I am your friendly chatbot, and your name is ${user?.firstName} ${user?.lastName}!`;
      } else if (userInput.toLowerCase().includes('what is the date today') || userInput.toLowerCase().includes('what time is it')) {
        const currentDate = new Date();
        const dateString = currentDate.toLocaleString(); // Format date and time
        botResponse = `Today is ${dateString}`;
      } else if (userInput.toLowerCase().includes('what is my name') || userInput.toLowerCase().includes('who am i') || userInput.toLowerCase().includes('what is my full name')) {
        botResponse = `Your name is ${user?.lastName} ${user?.firstName}!`;
      }
      else if (userInput.toLowerCase().includes('what is the weather today')) {
        botResponse = "Sorry, I can't fetch live weather data right now, but you can check your local weather service for up-to-date information!";
      } else if (userInput.toLowerCase().includes('tell me a joke')) {
        botResponse = "Why don't skeletons fight each other? They don't have the guts!";
      } else if (userInput.toLowerCase().includes('can you help me with my order')) {
        botResponse = "Of course! I can assist you with tracking or updating your order. Could you provide your order number, please?";
      } else if (userInput.toLowerCase().includes('what is the time in')) {
        const cityMatch = userInput.match(/what is the time in (\w+)/i);
        if (cityMatch && cityMatch[1]) {
          const city = cityMatch[1];
          botResponse = `I don't have real-time access to time zone data, but you can easily check the time in ${city} using any world clock service!`;
        } else {
          botResponse = "Please provide a city to check the time.";
        }
      } else if (userInput.toLowerCase().includes('who are you')) {
        botResponse = "I am your friendly chatbot, here to assist you with whatever you need!";
      } else if (userInput.toLowerCase().includes('what can you do')) {
        botResponse = "I can assist with general questions, provide information about your account, give updates on orders, and more!";
      }

      setMessages([
        ...messages,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: botResponse },
      ]);
      setUserInput('');
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen); // Ouvre ou ferme le chatbot
  };

  return (
    <div>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-[#FA8072] hover:bg-[#f56a59] text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        {isOpen ? 'Close' : 'Chat with us'}
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border-2 border-[#FA8072] rounded-lg shadow-lg p-4 flex flex-col">
          {/* Icône de fermeture */}
          <div className="flex justify-end mb-2">
            <button onClick={toggleChatbot} className="text-[#FA8072] text-xl hover:text-[#f56a59]">
              <FaTimes />
            </button>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto mb-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`p-2 rounded-lg ${msg.sender === 'user' ? 'bg-[#FA8072] text-white' : 'bg-gray-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#FA8072] text-white p-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
