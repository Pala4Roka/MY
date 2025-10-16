import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';
import './ProfilePage.css';

export default function ProfilePage({ user }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await authAPI.getMe();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClearanceLevelName = (level) => {
    const levels = {
      1: 'Threat',
      2: 'Threat+',
      3: 'Hazard/Cataclysm',
      4: 'Collapse/Apex',
      5: 'Absolute/Annihilation'
    };
    return levels[level] || 'Unknown';
  };

  const getClearanceColor = (level) => {
    const colors = {
      1: '#4ade80',
      2: '#22d3ee',
      3: '#fbbf24',
      4: '#fb923c',
      5: '#dc2626'
    };
    return colors[level] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">Загрузка профиля...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-icon">👤</div>
            <div className="avatar-status"></div>
          </div>
          <h2>Личный кабинет</h2>
        </div>

        <div className="profile-info">
          <div className="info-card">
            <div className="info-label">Идентификатор</div>
            <div className="info-value">{userData?.id || 'N/A'}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Имя пользователя</div>
            <div className="info-value">{userData?.username || 'N/A'}</div>
          </div>

          <div className="info-card">
            <div className="info-label">Уровень допуска</div>
            <div 
              className="info-value clearance-badge"
              style={{ 
                backgroundColor: getClearanceColor(userData?.clearance_level),
                color: '#000',
                fontWeight: 'bold',
                padding: '8px 16px',
                borderRadius: '6px',
                display: 'inline-block'
              }}
            >
              Уровень {userData?.clearance_level || 1} - {getClearanceLevelName(userData?.clearance_level)}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">Статус</div>
            <div className="info-value status-badge">
              {userData?.is_active ? (
                <span className="status-active">
                  <span className="status-dot"></span> Активен
                </span>
              ) : (
                <span className="status-inactive">
                  <span className="status-dot"></span> Неактивен
                </span>
              )}
            </div>
          </div>

          <div className="info-card">
            <div className="info-label">Дата создания</div>
            <div className="info-value">
              {userData?.created_at 
                ? new Date(userData.created_at).toLocaleString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'N/A'}
            </div>
          </div>
        </div>

        {userData?.clearance_level >= 5 && (
          <div className="admin-badge-section">
            <div className="admin-badge">
              <div className="admin-badge-icon">🛡️</div>
              <div className="admin-badge-text">
                <div className="admin-badge-title">Статус администратора</div>
                <div className="admin-badge-desc">
                  У вас есть полный доступ ко всем функциям системы
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="clearance-info-section">
          <h3>Доступные объекты по уровню допуска</h3>
          <div className="clearance-levels">
            <div className={`clearance-level ${userData?.clearance_level >= 1 ? 'unlocked' : 'locked'}`}>
              <div className="level-number">1-2</div>
              <div className="level-name">Threat</div>
              <div className="level-desc">Базовые объекты</div>
            </div>
            <div className={`clearance-level ${userData?.clearance_level >= 3 ? 'unlocked' : 'locked'}`}>
              <div className="level-number">3</div>
              <div className="level-name">Hazard/Cataclysm</div>
              <div className="level-desc">Опасные объекты</div>
            </div>
            <div className={`clearance-level ${userData?.clearance_level >= 4 ? 'unlocked' : 'locked'}`}>
              <div className="level-number">4</div>
              <div className="level-name">Collapse/Apex</div>
              <div className="level-desc">Критические объекты</div>
            </div>
            <div className={`clearance-level ${userData?.clearance_level >= 5 ? 'unlocked' : 'locked'}`}>
              <div className="level-number">5</div>
              <div className="level-name">Absolute/Annihilation</div>
              <div className="level-desc">Все объекты + секретная информация</div>
            </div>
          </div>
        </div>

        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
