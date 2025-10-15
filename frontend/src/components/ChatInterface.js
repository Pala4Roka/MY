import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatInterface.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ChatInterface({ sessionId, onUnlockClassified }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speak = (text) => {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    
    // Try to find a female Russian voice, fallback to any female voice
    const femaleVoice = voices.find(voice => 
      (voice.lang.includes('ru') && voice.name.toLowerCase().includes('female')) ||
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman')
    ) || voices[0];
    
    utterance.voice = femaleVoice;
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    synth.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: input,
        session_id: sessionId
      });

      const assistantMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speak(response.data.response);

      // Check if classified was unlocked
      if (response.data.unlocked_classified) {
        onUnlockClassified();
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка. Попробуйте еще раз.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-title">
          <span className="chat-icon">👁</span>
          <h3>MAL0 - Объятия тени</h3>
        </div>
        <div className="chat-status">Online</div>
      </div>
      
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Добро пожаловать в базу данных Eternal Sentinels.</p>
            <p>Я MAL0, ваш ассистент. Чем могу помочь?</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message assistant loading">
            <div className="message-content">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          rows={2}
          disabled={loading}
        />
        <button 
          className="chat-send-btn"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
