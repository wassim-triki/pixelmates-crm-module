import React, { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '../context/authContext';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Gemini API key (move to environment variable in production)
  const geminiApiKey = "AIzaSyDotkJj_EF4Ba0TZ7xWIHPxE2PTma7JEd8";

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Function to call Gemini API
  const callGeminiAPI = async (userMessage) => {
    try {
      setIsTyping(true);
      setError(null);

      // Prepare conversation history for Gemini
      const apiMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Add the new user message
      apiMessages.push({
        role: 'user',
        parts: [{ text: userMessage }]
      });

      console.log("Sending request to Gemini API with messages:", apiMessages);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: apiMessages
          })
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data.candidates && data.candidates.length > 0) {
        const botResponse = data.candidates[0].content.parts[0].text;
        return botResponse;
      } else {
        throw new Error("No valid response from Gemini API");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setError(`Failed to get response from Gemini: ${error.message}`);
      return "Sorry, I couldn't process your request. Please try again later.";
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user message to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: 'user', text: userInput }
    ]);

    const userMessage = userInput;
    setUserInput(''); // Clear input field

    // Get response from Gemini
    const botResponse = await callGeminiAPI(userMessage);

    // Add bot response to chat
    setMessages(prevMessages => [
      ...prevMessages,
      { sender: 'bot', text: botResponse }
    ]);
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
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      width: isOpen ? '350px' : '60px',
      height: isOpen ? '500px' : '60px',
      transition: 'all 0.3s ease-in-out'
    }}>
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
              {error && <div className="text-left text-red-500 p-2">Error: {error}</div>}
            </div>

            <div className="flex space-x-2 relative">
              <input
                id="user-input"
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full p-2 border border-gray-300 rounded-lg pl-3"
                placeholder="Type a message..."
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || !userInput.trim()}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[black] hover:text-[#f56a59] transition-all duration-300"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;