import React from 'react';
import './DossierModal.css';

export default function DossierModal({ object, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="modal-header">
          <div className="modal-number">ES-{object.number}</div>
          {object.is_classified && (
            <span className="modal-classified-badge">ЗАСЕКРЕЧЕНО</span>
          )}
        </div>
        
        <h2 className="modal-title">{object.name}</h2>
        <p className="modal-codename">"{object.codename}"</p>
        
        {object.image_url && !object.image_url.endsWith('.glb') && (
          <div className="modal-image">
            <img src={object.image_url} alt={object.name} />
          </div>
        )}
        
        <div className="modal-section">
          <h3>Класс угрозы</h3>
          <p className="threat-level">{object.threat_class}</p>
        </div>
        
        <div className="modal-section">
          <h3>Описание</h3>
          <p>{object.description}</p>
        </div>
        
        {object.special_procedures && (
          <div className="modal-section">
            <h3>Особые процедуры содержания</h3>
            <p>{object.special_procedures}</p>
          </div>
        )}
        
        {object.secret_data && (
          <div className="modal-section secret">
            <h3>Секретные данные</h3>
            <p>{object.secret_data}</p>
          </div>
        )}
      </div>
    </div>
  );
}
