import React, { useState, useEffect } from 'react';
import './AnimatedBackground.css';

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="animated-background">
      {/* Floating anomaly particles */}
      <div className="anomaly-particles">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i} 
            className="anomaly-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      {/* Glitch scanlines */}
      <div className="scanlines"></div>

      {/* Pulsating containment fields */}
      <div className="containment-fields">
        <div className="field field-1"></div>
        <div className="field field-2"></div>
        <div className="field field-3"></div>
      </div>

      {/* Data stream overlay */}
      <div className="data-stream">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="stream-line"
            style={{
              left: `${20 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Hexagonal grid pattern */}
      <div className="hex-grid"></div>
    </div>
  );
}
