import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, FileText, AlertTriangle, Skull } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import './MainPage.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MainPage = () => {
  const [dossiers, setDossiers] = useState([]);
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mal0Position, setMal0Position] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const chatEndRef = useRef(null);
  const mal0Ref = useRef(null);

  // Fetch dossiers on mount
  useEffect(() => {
    fetchDossiers();
    fetchChatHistory();
  }, []);

  const fetchDossiers = async () => {
    try {
      const response = await axios.get(`${API}/dossiers`);
      setDossiers(response.data);
    } catch (error) {
      console.error('Error fetching dossiers:', error);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${API}/chat/history/${sessionId}`);
      setChatMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animate MAL0 to follow cursor with smooth delay
  useEffect(() => {
    const interval = setInterval(() => {
      setMal0Position(prev => {
        const dx = mousePosition.x - prev.x;
        const dy = mousePosition.y - prev.y;
        const speed = 0.05;

        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed
        };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [mousePosition]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message immediately
    setChatMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage
      });

      // Add AI response
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Ошибка соединения. Попробуйте снова.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDangerIcon = (dangerClass) => {
    if (dangerClass.includes('Annihilation') || dangerClass.includes('Уничтожение')) {
      return <Skull className="danger-icon annihilation" />;
    } else if (dangerClass.includes('Apex') || dangerClass.includes('Предел')) {
      return <AlertTriangle className="danger-icon apex" />;
    }
    return <AlertTriangle className="danger-icon" />;
  };

  return (
    <div className="main-container" data-testid="main-container">
      {/* Animated Background */}
      <div className="bg-grid"></div>
      <div className="bg-gradient"></div>

      {/* MAL0 Character */}
      <div
        ref={mal0Ref}
        className="mal0-character"
        style={{
          left: `${mal0Position.x}px`,
          top: `${mal0Position.y}px`,
        }}
        data-testid="mal0-character"
      >
        <img 
          src="https://customer-assets.emergentagent.com/job_animated-mal0-docs/artifacts/dkznieh6_image.png" 
          alt="MAL0"
          className="mal0-image"
        />
      </div>

      {/* Header */}
      <header className="header" data-testid="header">
        <div className="header-content">
          <div className="logo">
            <Skull className="logo-icon" />
            <h1>ETERNAL SENTINELS</h1>
          </div>
          <div className="subtitle">Observe • Contain • Defend</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="content">
        {/* Dossiers Library */}
        <section className="dossiers-section" data-testid="dossiers-section">
          <h2 className="section-title">
            <FileText className="section-icon" />
            БИБЛИОТЕКА ДОСЬЕ
          </h2>
          <div className="dossiers-grid">
            {dossiers.map((dossier) => (
              <div
                key={dossier.id}
                className="dossier-card"
                onClick={() => setSelectedDossier(dossier)}
                data-testid={`dossier-card-${dossier.id}`}
              >
                <div className="dossier-header">
                  {getDangerIcon(dossier.danger_class)}
                  <div className="dossier-id">ОБЪЕКТ-{dossier.id}</div>
                </div>
                <h3 className="dossier-name">{dossier.code_name}</h3>
                <div className="dossier-class">{dossier.danger_class}</div>
                <p className="dossier-preview">{dossier.description.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chat Section */}
        <section className="chat-section" data-testid="chat-section">
          <h2 className="section-title">
            <Skull className="section-icon" />
            СВЯЗЬ С MAL0
          </h2>
          <div className="chat-container">
            <ScrollArea className="chat-messages" data-testid="chat-messages">
              {chatMessages.length === 0 ? (
                <div className="chat-welcome">
                  <p>Привет, я MAL0 (Объект 1471) 💀</p>
                  <p>Задай мне вопрос о досье или просто поговори со мной...</p>
                </div>
              ) : (
                chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`chat-message ${msg.role}`}
                    data-testid={`chat-message-${msg.role}-${idx}`}
                  >
                    <div className="message-content">{msg.content}</div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="chat-message assistant" data-testid="chat-loading">
                  <div className="message-content typing">MAL0 печатает...</div>
                </div>
              )}
              <div ref={chatEndRef} />
            </ScrollArea>
            <div className="chat-input-container">
              <Input
                type="text"
                placeholder="Напиши сообщение MAL0..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isLoading}
                className="chat-input"
                data-testid="chat-input"
              />
              <Button 
                onClick={sendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="chat-send-btn"
                data-testid="chat-send-btn"
              >
                ОТПРАВИТЬ
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Dossier Modal */}
      <Dialog open={!!selectedDossier} onOpenChange={() => setSelectedDossier(null)}>
        <DialogContent className="dossier-modal" data-testid="dossier-modal">
          {selectedDossier && (
            <>
              <DialogHeader>
                <div className="modal-header">
                  {getDangerIcon(selectedDossier.danger_class)}
                  <div>
                    <DialogTitle className="modal-title">
                      ОБЪЕКТ-{selectedDossier.id}: {selectedDossier.code_name}
                    </DialogTitle>
                    <DialogDescription className="modal-class">
                      {selectedDossier.danger_class}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <ScrollArea className="modal-content">
                <div className="modal-section">
                  <h4 className="modal-section-title">ОПИСАНИЕ</h4>
                  <p>{selectedDossier.description}</p>
                </div>
                <div className="modal-section">
                  <h4 className="modal-section-title">ОСОБЕННОСТИ</h4>
                  <ul>
                    {selectedDossier.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="modal-section">
                  <h4 className="modal-section-title">СЕКРЕТНЫЕ ДАННЫЕ</h4>
                  <p>{selectedDossier.secret_data}</p>
                </div>
                <div className="modal-section">
                  <h4 className="modal-section-title">УСЛОВИЯ СОДЕРЖАНИЯ</h4>
                  <p>{selectedDossier.containment}</p>
                </div>
                <div className="modal-section">
                  <h4 className="modal-section-title">УГРОЗА</h4>
                  <p>{selectedDossier.threat}</p>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPage;