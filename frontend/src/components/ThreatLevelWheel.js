import React, { useState } from 'react';
import './ThreatLevelWheel.css';

const THREAT_LEVELS = [
  { key: 'all', label: 'Все', color: '#6b7280', icon: '⚡' },
  { key: 'Threat', label: 'Угроза', color: '#4ade80', icon: '🟢' },
  { key: 'Hazard', label: 'Опасность', color: '#fbbf24', icon: '🟡' },
  { key: 'Cataclysm', label: 'Катаклизм', color: '#fb923c', icon: '🟠' },
  { key: 'Collapse', label: 'Крушение', color: '#f87171', icon: '🔴' },
  { key: 'Apex', label: 'Предел', color: '#dc2626', icon: '🔺' },
  { key: 'Absolute', label: 'Абсолют', color: '#991b1b', icon: '⬛' },
  { key: 'Annihilation', label: 'Аннигиляция', color: '#7f1d1d', icon: '💀' }
];

export default function ThreatLevelWheel({ onSelectLevel, currentLevel = 'all' }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWheel = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectLevel = (level) => {
    onSelectLevel(level.key);
    setIsOpen(false);
  };

  return (
    <div className="threat-wheel-container">
      {/* Main button */}
      <button 
        className={`threat-wheel-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleWheel}
        title="Фильтр по уровню угрозы"
      >
        <span className="btn-icon">⚠️</span>
        <span className="btn-text">Все объекты</span>
      </button>

      {/* Circular wheel menu */}
      {isOpen && (
        <>
          <div className="wheel-backdrop" onClick={() => setIsOpen(false)} />
          <div className="threat-wheel">
            {THREAT_LEVELS.map((level, index) => {
              const angle = (360 / THREAT_LEVELS.length) * index - 90;
              const radius = 150;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <button
                  key={level.key}
                  className={`wheel-item ${currentLevel === level.key ? 'selected' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    borderColor: level.color,
                    backgroundColor: currentLevel === level.key ? `${level.color}30` : 'rgba(20, 20, 30, 0.95)',
                    animationDelay: `${index * 0.05}s`
                  }}
                  onClick={() => handleSelectLevel(level)}
                  title={level.label}
                >
                  <span className="wheel-item-icon">{level.icon}</span>
                  <span className="wheel-item-label" style={{ color: level.color }}>
                    {level.label}
                  </span>
                </button>
              );
            })}
            
            {/* Center info */}
            <div className="wheel-center">
              <div className="wheel-center-icon">🛡️</div>
              <div className="wheel-center-text">ES</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
