import React from 'react';
import './ESLogo.css';

export default function ESLogo({ size = 'large' }) {
  return (
    <div className={`es-logo-container ${size}`}>
      <div className="es-logo-content">
        <div className="es-text">
          <span className="es-letter">E</span>
          <span className="es-eye">
            <span className="eye-pupil"></span>
          </span>
          <span className="es-letter">S</span>
        </div>
        <div className="es-subtitle">ETERNAL SENTINELS</div>
      </div>
    </div>
  );
}
