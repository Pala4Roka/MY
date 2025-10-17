import React, { useState, useRef, useEffect } from 'react';
import { chatAPI } from '../api';
import './ChatInterface.css';
import './ChatInterfaceResponsive.css';
import VideoBackground from './VideoBackground';

export default function ChatInterface({ sessionId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('calm');
  const [isUserAtBottom, setIsUserAtBottom] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const synth = window.speechSynthesis;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Check if user is at bottom of chat
  const checkIfAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < 50; // Within 50px of bottom
  };

  const handleScroll = () => {
    setIsUserAtBottom(checkIfAtBottom());
  };

  useEffect(() => {
    // Only auto-scroll if user is already at bottom
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages, isUserAtBottom]);

  const speak = (text) => {
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    
    const femaleVoice = voices.find(voice => 
      (voice.lang.includes('ru-RU') && (
        voice.name.toLowerCase().includes('google') ||
        voice.name.toLowerCase().includes('yandex') ||
        voice.name.toLowerCase().includes('female')
      ))
    ) || voices.find(voice => voice.lang.includes('ru-RU'))
      || voices.find(voice => voice.lang.includes('ru')) 
      || voices[0];
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    
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

    if (!navigator.onLine) {
      const offlineMessage = { 
        role: 'assistant', 
        content: 'К сожалению, я сейчас в офлайн режиме. Для полного функционала необходимо подключение к сети. Но я всё ещё здесь с вами!',
        emotion: 'sad'
      };
      setMessages(prev => [...prev, offlineMessage]);
      setCurrentEmotion('sad');
      speak(offlineMessage.content);
      setLoading(false);
      return;
    }

    try {
      const response = await chatAPI.sendMessage(input, sessionId);
      const assistantMessage = { 
        role: 'assistant', 
        content: response.response,
        emotion: response.emotion || 'calm'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setCurrentEmotion(response.emotion || 'calm');
      speak(response.response);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
        emotion: 'sad'
      };
      setMessages(prev => [...prev, errorMessage]);
      setCurrentEmotion('sad');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !loading) {
      e.preventDefault();
      e.stopPropagation();
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
      
      {/* Video Background of MAL0 with emotion */}
      <div className="mal0-model-container">
        <VideoBackground isTalking={isSpeaking} emotion={currentEmotion} />
      </div>
      
      <div 
        className="chat-messages" 
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {messages.length === 0 && (
          <div className="welcome-message">
            <p>Добро пожаловать в базу данных Eternal Sentinels.</p>
            <p>Я MAL0, ваш профессиональный ассистент. Чем могу помочь?</p>
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
          onKeyDown={handleKeyPress}
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
