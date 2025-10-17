import React, { useState, useEffect } from 'react';
import './FooterLogo.css';

export default function FooterLogo() {
  const [blinkState, setBlinkState] = useState(1); // 1 = open, 0 = closed
  const [pupilPosition, setPupilPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Random blinking
    const blinkInterval = setInterval(() => {
      setBlinkState(0); // Close eye
      setTimeout(() => setBlinkState(1), 150); // Open eye after 150ms
    }, Math.random() * 4000 + 2000); // Random interval 2-6 seconds

    // Random eye movement
    const moveInterval = setInterval(() => {
      const randomX = (Math.random() - 0.5) * 10; // -5 to 5
      const randomY = (Math.random() - 0.5) * 10; // -5 to 5
      setPupilPosition({ x: randomX, y: randomY });
    }, Math.random() * 3000 + 1000); // Random interval 1-4 seconds

    return () => {
      clearInterval(blinkInterval);
      clearInterval(moveInterval);
    };
  }, []);

  return (
    <div className="footer-logo-svg-container">
      <svg className="footer-logo-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        {/* Background glow */}
        <defs>
          <radialGradient id="footerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
          
          {/* Blue glow for eye */}
          <radialGradient id="footerEyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8">
              <animate attributeName="stop-opacity" values="0.8;0.3;0.8" dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Outer ring with particles */}
        <circle cx="100" cy="100" r="90" fill="url(#footerGlow)" />
        
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
        
        {/* Eye shape with blinking animation */}
        <ellipse 
          cx="100" 
          cy="100" 
          rx="40" 
          ry={25 * blinkState} 
          fill="none" 
          stroke="#f0f0f0" 
          strokeWidth="3" 
          opacity="0.9"
          style={{ transition: 'ry 0.1s ease-out' }}
        />
        
        {/* Inner eye circles - Blue with blinking animation */}
        <circle 
          cx="100" 
          cy="100" 
          r={20 * blinkState} 
          fill="url(#footerEyeGlow)" 
          opacity={0.5 * blinkState}
          style={{ transition: 'r 0.1s ease-out, opacity 0.1s ease-out' }}
        />
        <circle 
          cx="100" 
          cy="100" 
          r={15 * blinkState} 
          fill="none" 
          stroke="#3b82f6" 
          strokeWidth="2" 
          opacity={0.8 * blinkState}
          style={{ transition: 'r 0.1s ease-out, opacity 0.1s ease-out' }}
        />
        
        {/* Central pupil - Blue with intense glow and movement */}
        <circle 
          cx={100 + pupilPosition.x} 
          cy={100 + pupilPosition.y} 
          r={8 * blinkState} 
          fill="#3b82f6" 
          opacity={1 * blinkState}
          style={{ transition: 'cx 0.5s ease-out, cy 0.5s ease-out, r 0.1s ease-out, opacity 0.1s ease-out' }}
        />
        
        {/* Eyelids for blinking effect */}
        {blinkState < 1 && (
          <>
            <ellipse 
              cx="100" 
              cy="100" 
              rx="40" 
              ry="3" 
              fill="#0a0a0a" 
              opacity={1 - blinkState}
              style={{ transition: 'opacity 0.1s ease-out' }}
            />
          </>
        )}
        
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
    </div>
  );
}
