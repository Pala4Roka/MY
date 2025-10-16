import React from 'react';
import './DossierList.css';

export default function DossierList({ objects, onObjectClick, loading }) {
  if (loading) {
    return <div className="loading">Loading dossiers...</div>;
  }

  return (
    <div className="dossier-list">
      <h2 className="dossier-list-title">ДОСЬЕ ОБЪЕКТОВ</h2>
      <div className="dossier-grid">
        {objects.map(obj => (
          <div 
            key={obj.id}
            className={`dossier-card ${obj.is_classified ? 'classified' : ''}`}
            onClick={() => onObjectClick(obj)}
          >
            <div className="dossier-card-header">
              <span className="dossier-number">ES-{obj.number}</span>
              {obj.is_classified && (
                <span className="classified-badge">ЗАСЕКРЕЧЕНО</span>
              )}
            </div>
            <h3 className="dossier-name">{obj.name}</h3>
            <p className="dossier-codename">"{obj.codename}"</p>
            <div className="dossier-threat">
              <span className="threat-label">Класс угрозы:</span>
              <span className="threat-value">{obj.threat_class}</span>
            </div>
            <button className="view-btn">Подробнее</button>
          </div>
        ))}
      </div>
    </div>
  );
}
