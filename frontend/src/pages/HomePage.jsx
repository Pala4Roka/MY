import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, Send } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const [objects, setObjects] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchObjects();
    
    // Add welcome message from MAL0
    setChatHistory([
      {
        sender: "mal0",
        message: "Добро пожаловать в базу данных Eternal Sentinels. Я MAL0, ваш ассистент. Чем могу помочь?"
      }
    ]);
  }, []);

  const fetchObjects = async () => {
    try {
      const response = await axios.get(`${API}/objects`);
      setObjects(response.data);
    } catch (error) {
      console.error("Error fetching objects:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    // Add user message
    const userMsg = { sender: "user", message: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: chatMessage
      });

      // Add MAL0 response
      const mal0Msg = { sender: "mal0", message: response.data.response };
      setChatHistory(prev => [...prev, mal0Msg]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setChatMessage("");
  };

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / 20;
      const deltaY = (e.clientY - centerY) / 20;
      
      setMousePosition({ x: deltaX, y: deltaY });
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-red-900/30 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-bold text-red-600">Eternal Sentinels</h1>
              <p className="text-xs text-gray-400">Observe • Contain • Defend</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* MAL0 Chat Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* MAL0 Image */}
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg p-6 border border-red-900/30 backdrop-blur-sm">
            <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
              <img
                ref={imageRef}
                src="https://customer-assets.emergentagent.com/job_scp-database-1/artifacts/zeveinwp_4309243.picsmall.jpg"
                alt="MAL0"
                className="max-w-full max-h-full object-contain transition-transform duration-100"
                style={{
                  transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
                }}
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-bold text-red-500">MAL0 - Объятия тени</h3>
              <p className="text-green-500 text-sm flex items-center justify-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          {/* Chat Box */}
          <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg p-6 border border-red-900/30 backdrop-blur-sm flex flex-col">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-64">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.sender === "mal0"
                      ? "bg-red-900/20 border border-red-900/30 text-gray-200"
                      : "bg-gray-700/30 border border-gray-600/30 text-gray-300 ml-8"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Отправить"
                className="flex-1 bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
              />
              <button
                onClick={handleSendMessage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Objects Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-red-600 border-b border-red-900/30 pb-3">
            ДОСЬЕ ОБЪЕКТОВ
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objects.map((obj) => (
              <div
                key={obj.id}
                className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-lg border border-red-900/30 overflow-hidden hover:border-red-600/50 transition-all cursor-pointer backdrop-blur-sm group"
                onClick={() => navigate(`/object/${obj.id}`)}
              >
                {obj.image_url && (
                  <div className="w-full h-48 bg-black/50 flex items-center justify-center overflow-hidden">
                    <img
                      src={obj.image_url}
                      alt={obj.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <p className="text-xs text-red-400 font-mono mb-1">{obj.number}</p>
                  <h3 className="text-xl font-bold mb-1 text-white">{obj.name}</h3>
                  <p className="text-sm text-gray-400 italic mb-3">"{obj.codename}"</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      Класс угрозы: <span className="text-red-500 font-semibold">{obj.threat_class}</span>
                    </p>
                  </div>
                  <button className="mt-4 w-full bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded border border-red-900/50 transition-colors text-sm">
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
