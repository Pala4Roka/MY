import React, { useState, useEffect } from 'react';
import { adminAPI, scpAPI } from '../api';
import './AdminPanel.css';

export default function AdminPanel({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingObject, setEditingObject] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'objects') {
      fetchObjects();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchObjects = async () => {
    setLoading(true);
    try {
      const data = await scpAPI.getAll();
      setObjects(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch objects');
    } finally {
      setLoading(false);
    }
  };

  const handleClearanceChange = async (userId, newLevel) => {
    try {
      await adminAPI.updateClearance(userId, newLevel);
      fetchUsers();
    } catch (err) {
      setError('Failed to update clearance');
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await adminAPI.updateStatus(userId, !currentStatus);
      fetchUsers();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleDeleteObject = async (number) => {
    if (!window.confirm(`Delete object ${number}?`)) return;
    
    try {
      await scpAPI.delete(number);
      fetchObjects();
    } catch (err) {
      setError('Failed to delete object');
    }
  };

  const getClearanceName = (level) => {
    const names = {
      1: 'Уровень 1 - Ограниченный',
      2: 'Уровень 2 - Базовый',
      3: 'Уровень 3 - Расширенный',
      4: 'Уровень 4 - Секретный',
      5: 'Уровень 5 - Максимальный'
    };
    return names[level] || `Уровень ${level}`;
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h1>🛡️ АДМИН-ПАНЕЛЬ</h1>
          <p className="admin-user-info">
            Вошел как: <strong>{currentUser.username}</strong> (Уровень допуска: {currentUser.clearance_level})
          </p>
        </div>
        <button onClick={onLogout} className="logout-btn" data-testid="logout-btn">
          Выйти
        </button>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          data-testid="users-tab"
        >
          Пользователи
        </button>
        <button
          className={`tab ${activeTab === 'objects' ? 'active' : ''}`}
          onClick={() => setActiveTab('objects')}
          data-testid="objects-tab"
        >
          SCP Объекты
        </button>
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
          data-testid="info-tab"
        >
          Информация
        </button>
      </div>

      {error && (
        <div className="admin-error" data-testid="error-message">
          {error}
        </div>
      )}

      <div className="admin-content">
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : (
          <>
            {activeTab === 'users' && (
              <div className="users-section">
                <h2>Управление пользователями</h2>
                <div className="users-list">
                  {users.map((user) => (
                    <div key={user.id} className="user-card" data-testid={`user-${user.id}`}>
                      <div className="user-info">
                        <h3>{user.username}</h3>
                        <p>ID: {user.id}</p>
                        <p className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? '🟢 Активен' : '🔴 Неактивен'}
                        </p>
                      </div>
                      
                      <div className="user-controls">
                        <div className="clearance-control">
                          <label>Уровень допуска:</label>
                          <select
                            value={user.clearance_level}
                            onChange={(e) => handleClearanceChange(user.id, parseInt(e.target.value))}
                            disabled={user.id === currentUser.id}
                            data-testid={`clearance-${user.id}`}
                          >
                            {[1, 2, 3, 4, 5].map((level) => (
                              <option key={level} value={level}>
                                {getClearanceName(level)}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <button
                          onClick={() => handleStatusToggle(user.id, user.is_active)}
                          disabled={user.id === currentUser.id}
                          className="toggle-status-btn"
                          data-testid={`toggle-status-${user.id}`}
                        >
                          {user.is_active ? 'Деактивировать' : 'Активировать'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'objects' && (
              <div className="objects-section">
                <h2>Управление SCP объектами</h2>
                <p className="section-note">Всего объектов: {objects.length}</p>
                
                <div className="objects-grid">
                  {objects.map((obj) => (
                    <div key={obj.number} className="object-card" data-testid={`object-${obj.number}`}>
                      <div className="object-header">
                        <h3>SCP-{obj.number}</h3>
                        <span className={`threat-badge threat-${obj.threat_class.toLowerCase()}`}>
                          {obj.threat_class}
                        </span>
                      </div>
                      
                      <h4>{obj.name}</h4>
                      <p className="codename">"{obj.codename}"</p>
                      
                      <p className="description">
                        {obj.description.substring(0, 150)}...
                      </p>
                      
                      <div className="object-actions">
                        <button 
                          onClick={() => handleDeleteObject(obj.number)}
                          className="delete-btn"
                          data-testid={`delete-${obj.number}`}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="info-section">
                <h2>Информация о системе</h2>
                
                <div className="info-card">
                  <h3>Уровни допуска</h3>
                  <ul className="clearance-info">
                    <li><strong>Уровень 1-2:</strong> Доступ к объектам класса "Угроза (Threat)"</li>
                    <li><strong>Уровень 3:</strong> Доступ к "Опасность (Hazard)" и "Катаклизм (Cataclysm)"</li>
                    <li><strong>Уровень 4:</strong> Доступ к "Крушение (Collapse)" и "Предел (Apex)"</li>
                    <li><strong>Уровень 5:</strong> Полный доступ ко всем объектам, секретным данным и админ-панели</li>
                  </ul>
                </div>

                <div className="info-card">
                  <h3>Классы угроз</h3>
                  <ul className="threat-info">
                    <li><span className="threat-badge threat-threat">Threat</span> - Угроза</li>
                    <li><span className="threat-badge threat-hazard">Hazard</span> - Опасность</li>
                    <li><span className="threat-badge threat-cataclysm">Cataclysm</span> - Катаклизм</li>
                    <li><span className="threat-badge threat-collapse">Collapse</span> - Крушение</li>
                    <li><span className="threat-badge threat-apex">Apex</span> - Предел</li>
                    <li><span className="threat-badge threat-absolute">Absolute</span> - Абсолют</li>
                    <li><span className="threat-badge threat-annihilation">Annihilation</span> - Аннигиляция</li>
                  </ul>
                </div>

                <div className="info-card">
                  <h3>MAL0 Ассистент</h3>
                  <p>MAL0 теперь работает в профессиональном режиме как ассистент базы данных.</p>
                  <p>Секретные команды и романтическое поведение удалены.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
