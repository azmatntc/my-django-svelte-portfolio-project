import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

function ChatbotComponent() {
  const [showBot, setShowBot] = useState(Cookies.get('ai_features') !== 'disabled');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi! How can I help you explore the portfolio?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    Cookies.set('ai_features', showBot ? 'enabled' : 'disabled', { expires: 7 });
  }, [showBot]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('/api/ai-chat/', { query: input });
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response || 'Sorry, no response available.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, there was an error. Please try again.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (!showBot) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-accent text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          Chat
        </button>
      )}
      {isOpen && (
        <div className="bg-gray-800 rounded-lg shadow-lg w-80 h-96 flex flex-col">
          <div className="flex justify-between items-center p-3 bg-gray-700 rounded-t-lg">
            <h3 className="text-white font-semibold">Portfolio Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-red-500"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-accent text-white' : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about projects..."
              className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-accent"
            />
            <div className="flex justify-between mt-2">
              <button
                onClick={handleSend}
                className="bg-accent text-white py-1 px-3 rounded hover:bg-green-600"
              >
                Send
              </button>
              <button
                onClick={() => setShowBot(false)}
                className="text-gray-300 hover:text-red-500 text-sm"
              >
                Disable AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatbotComponent;