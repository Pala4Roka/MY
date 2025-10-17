import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ChatInterface from '../components/ChatInterface';
import DossierList from '../components/DossierList';
import ESLogo from '../components/ESLogo';
import OrganizationInfo from '../components/OrganizationInfo';
import { scpAPI, getUser } from '../api';

export default function HomePage({ onAdminClick }) {
  const navigate = useNavigate();
  const [sessionId] = useState(() => uuidv4());
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getUser();

  useEffect(() => {
    fetchObjects();
  }, []);

  const fetchObjects = async () => {
    try {
      const data = await scpAPI.getAll();
      setObjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching objects:', error);
      setLoading(false);
    }
  };

  const handleObjectClick = (object) => {
    navigate(`/dossier/${object.number}`);
  };

  return (
    <>
      <header className="header">
        <div className="header-top">
          <div className="header-logo">
            <ESLogo size="large" />
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/profile')} 
              className="profile-btn"
              title="Личный кабинет"
            >
              👤 Профиль
            </button>
            {currentUser && currentUser.clearance_level >= 5 && (
              <button onClick={onAdminClick} className="admin-btn" data-testid="admin-btn">
                🛡️ Админ-панель
              </button>
            )}
          </div>
        </div>
        <h1 className="title">ETERNAL SENTINELS DATABASE</h1>
        <p className="subtitle">Наблюдай • Содержи • Защищай</p>
        {currentUser && (
          <p className="user-info">
            Вошел как: <strong>{currentUser.username}</strong> | Уровень допуска: <strong>{currentUser.clearance_level}</strong>
          </p>
        )}
      </header>

      {/* Chat Interface */}
      <ChatInterface 
        sessionId={sessionId}
      />

      {/* Dossier List */}
      <div className="dossier-container">
        <DossierList 
          objects={objects}
          onObjectClick={handleObjectClick}
          loading={loading}
          currentUser={currentUser}
        />
      </div>
    </>
  );
}
