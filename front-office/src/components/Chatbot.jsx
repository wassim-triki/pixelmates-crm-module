import React, { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa'; // Change to FaPaperPlane
import { useAuth } from '../context/authContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      let botResponse = "I'm sorry, I didn't understand that."; // Default response

      // Normalize the user input to lowercase for easier matching
      const normalizedInput = userInput.toLowerCase().trim();

      // Start typing indicator
      setIsTyping(true);

      // Greeting variations
      if (/\b(hello|hi|salem|hey|hiya|hola|howdy)\b/.test(normalizedInput)) {
        botResponse = "Hello! How can I assist you today?";
      }
      // How are you?
      else if (/\b(how are you|how's it going|how are you doing|how do you do|how are u|how are u doing)\b/.test(normalizedInput)) {
        botResponse = "I'm doing great, thank you for asking!";
      }
      // User's name (if authenticated)
      else if (/\b(what is your name|who are you|what's your name|who are u)\b/.test(normalizedInput)) {
        if (user) {
          botResponse = `I am your friendly chatbot, and your name is ${user.firstName} ${user.lastName}!`;
        } else {
          botResponse = "Please log in so I can know your name!";
        }
      }
      // Date/Time
      else if (/\b(what is the date today|what time is it|current time|what's the date today)\b/.test(normalizedInput)) {
        const currentDate = new Date();
        const dateString = currentDate.toLocaleString();
        botResponse = `Today is ${dateString}`;
      }
      // Asking about the user's name (if authenticated)
      else if (/\b(what is my name|who am i|what is my full name|what's my name|what's my full name)\b/.test(normalizedInput)) {
        if (user) {
          botResponse = `Your name is ${user.lastName} ${user.firstName}!`;
        } else {
          botResponse = "Please log in to get your full name!";
        }
      }
      // Weather
      else if (/\b(what is the weather today|how's the weather|what's the weather today)\b/.test(normalizedInput)) {
        botResponse = "Sorry, I can't fetch live weather data right now, but you can check your local weather service for up-to-date information!";
      }
      // Jokes
      else if (/\b(tell me a joke|make me laugh|give me a joke|joke)\b/.test(normalizedInput)) {
        botResponse = "Why don't skeletons fight each other? They don't have the guts!";
      }
      // Order help
      else if (/\b(can you help me with my order|order assistance|help with my order)\b/.test(normalizedInput)) {
        botResponse = "Of course! I can assist you with tracking or updating your order. Could you provide your order number, please?";
      }
      // Time in a city
      else if (/\b(what is the time in)\b/.test(normalizedInput)) {
        const cityMatch = normalizedInput.match(/what is the time in (\w+)/i);
        if (cityMatch && cityMatch[1]) {
          const city = cityMatch[1];
          botResponse = `I don't have real-time access to time zone data, but you can easily check the time in ${city} using any world clock service!`;
        } else {
          botResponse = "Please provide a city to check the time.";
        }
      }
      // Handle 'Who are you' or 'What can you do'
      else if (/\b(what can u do|what can you do)\b/.test(normalizedInput)) {
        botResponse = "I am your friendly chatbot, here to assist you with whatever you need!";
      }
      //  "How do I contact support?"
      else if (/\b(how do i contact support|how to contact support|how to contact u|your contact|give me your contact)\b/.test(normalizedInput)) {
        botResponse = "You can contact support through our support page or by emailing menu.comapp@gmail.com!";
      }
      // Handle "What is your purpose?"
      else if (/\b(what is your purpose|what can you help with|why are you here|why are u here|what can u do|what can u help|help me )\b/.test(normalizedInput)) {
        botResponse = "I'm here to assist you with your questions and help you navigate the website!";
      }
      // Fallback response for unrecognized input
      else {
        botResponse = "I'm not sure about that. Could you clarify your question?";
      }

      // Stop typing indicator after response is set
      setIsTyping(false);

      // Respond with the user's message and bot's response
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: userInput },
        { sender: 'bot', text: botResponse },
      ]);
      setUserInput('');
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen); // Open/close the chatbot
  };

  useEffect(() => {
    // Automatically scroll to the bottom when a new message is added
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Auto-focus the input field when the chatbot is opened
      const inputElement = document.getElementById('user-input');
      if (inputElement) inputElement.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Add default welcome message when the chatbot is opened
    if (isOpen && messages.length === 0) {
      setMessages([ { sender: 'bot', text: "Hello! I'm MenuFy Assistant, how can I assist you today?" } ]);
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
        <div className=" fixed bottom-4 right-4 w-[450px] max-h-[80vh] overflow-auto bg-white border-2 border-[#FA8072] rounded-lg shadow-lg p-4 flex flex-col">
          {/* Title */}
          <div className="text-center font-semibold text-lg mb-4">Ask MenuFy Assistant</div>

          {/* Close button */}
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
              {/* Display typing indicator */}
              {isTyping && (
                <div className="text-left text-gray-500 p-2 animate-pulse">Bot is typing...</div>
              )}
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
