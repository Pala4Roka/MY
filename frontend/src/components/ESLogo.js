import React from 'react';
import './ESLogo.css';

export default function ESLogo({ size = 'large' }) {
  return (
    <div className={`es-logo-container ${size}`}>
      <div className="es-logo-content">
        {/* Outer circles */}
        <svg className="es-logo-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Background glow */}
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
            </radialGradient>
            
            {/* Blue glow for eye */}
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8">
                <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
              </stop>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Outer ring with particles */}
          <circle cx="100" cy="100" r="90" fill="url(#glow)" />
          
          {/* Outer decorative rings */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.6">
            <animate attributeName="opacity" values="0.6;0.3;0.6" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="100" r="75" fill="none" stroke="#dc2626" strokeWidth="1.5" opacity="0.4">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          {/* Circuit pattern */}
          <circle cx="100" cy="35" r="8" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.7"/>
          <circle cx="100" cy="165" r="8" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.7"/>
          <circle cx="35" cy="100" r="8" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.7"/>
          <circle cx="165" cy="100" r="8" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.7"/>
          
          {/* Eye shape */}
          <ellipse cx="100" cy="100" rx="40" ry="25" fill="none" stroke="#f0f0f0" strokeWidth="3" opacity="0.9"/>
          
          {/* Inner eye circles - Blue with blinking animation */}
          <circle cx="100" cy="100" r="20" fill="url(#eyeGlow)" opacity="0.5">
            <animate attributeName="r" values="20;18;20" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="100" cy="100" r="15" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.8">
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          {/* Central pupil - Blue with intense glow */}
          <circle cx="100" cy="100" r="8" fill="#3b82f6" opacity="1">
            <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="r" values="8;6;8" dur="3s" repeatCount="indefinite"/>
          </circle>
          
          {/* Technical marks */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const x1 = 100 + Math.cos(angle) * 60;
            const y1 = 100 + Math.sin(angle) * 60;
            const x2 = 100 + Math.cos(angle) * (i % 3 === 0 ? 68 : 65);
            const y2 = 100 + Math.sin(angle) * (i % 3 === 0 ? 68 : 65);
            return (
              <line 
                key={i} 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="#dc2626" 
                strokeWidth={i % 3 === 0 ? "2" : "1"} 
                opacity="0.6"
              />
            );
          })}
        </svg>
        
        <div className="es-subtitle">ETERNAL SENTINELS</div>
        <div className="es-code">SE EST ES</div>
      </div>
    </div>
  );
}
