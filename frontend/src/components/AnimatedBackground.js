import React, { useState, useEffect } from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem('animated_background_enabled');
    return saved !== null ? saved === 'true' : true; // Default to true
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('animated_background_enabled', enabled.toString());
  }, [enabled]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button 
        className="background-toggle-btn"
        onClick={() => setEnabled(!enabled)}
        title={enabled ? "Отключить анимацию фона" : "Включить анимацию фона"}
      >
        {enabled ? '🌟' : '⭐'}
      </button>

      {enabled && (
        <div className="animated-background">
          {/* Floating particles */}
          <div className="particles">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>

          {/* Glowing orbs */}
          <div className="orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>

          {/* Grid overlay */}
          <div className="grid-overlay"></div>
        </div>
      )}
    </>
  );
}
