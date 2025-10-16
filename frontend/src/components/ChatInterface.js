import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './ChatInterface.css';
// import MAL0Model from './MAL0Model';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ChatInterface({ sessionId, onUnlockClassified }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
    
    // Try to find the best female Russian voice with priority for natural sounding voices
    const femaleVoice = voices.find(voice => 
      (voice.lang.includes('ru-RU') && (
        voice.name.toLowerCase().includes('google') ||
        voice.name.toLowerCase().includes('yandex') ||
        voice.name.toLowerCase().includes('female') ||
        voice.name.toLowerCase().includes('woman') ||
        voice.name.toLowerCase().includes('elena') ||
        voice.name.toLowerCase().includes('irina') ||
        voice.name.toLowerCase().includes('milena') ||
        voice.name.toLowerCase().includes('anna')
      ))
    ) || voices.find(voice => voice.lang.includes('ru-RU'))
      || voices.find(voice => voice.lang.includes('ru')) 
      || voices[0];
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Настройки для сексуального, нежного, манящего голоса
    utterance.rate = 0.8; // Медленнее для более чувственного эффекта
    utterance.pitch = 1.15; // Немного выше для женственности, но не слишком высоко
    utterance.volume = 1.0; // Полная громкость для четкости
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synth.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Check if online
    if (!navigator.onLine) {
      const offlineMessage = { 
        role: 'assistant', 
        content: 'К сожалению, я сейчас в офлайн режиме. Для полного функционала необходимо подключение к сети. Но я всё ещё здесь с вами!' 
      };
      setMessages(prev => [...prev, offlineMessage]);
      speak(offlineMessage.content);
      setLoading(false);
      return;
    }

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
        <div className="chat-status">{isSpeaking ? 'Говорит...' : 'Online'}</div>
      </div>
      
      {/* 3D Model of MAL0 - Temporarily disabled */}
      {/* <div className="mal0-model-container">
        <MAL0Model isTalking={isSpeaking} />
      </div> */}
      
      <div className="mal0-placeholder">
        <div style={{textAlign: 'center', padding: '60px', color: '#666'}}>
          <div style={{fontSize: '80px'}}>🐺💀</div>
          <p>MAL0 - 3D модель загружается...</p>
        </div>
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
