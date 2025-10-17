import React, { useState, useEffect } from 'react';
import './DossierCarousel.css';

export default function DossierCarousel({ objects, onObjectClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Автоматическая прокрутка каждые 5 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, objects.length]);

  const handleNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % objects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + objects.length) % objects.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const getVisibleObjects = () => {
    const visible = [];
    const totalObjects = objects.length;
    const angleStep = 360 / totalObjects;
    const radius = 350; // Radius of the 3D circle
    
    for (let i = 0; i < totalObjects; i++) {
      const index = (currentIndex + i) % totalObjects;
      const angle = (i * angleStep * Math.PI) / 180;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const isFront = Math.abs(z) === Math.max(...Array.from({length: totalObjects}, (_, j) => Math.abs(Math.cos((j * angleStep * Math.PI) / 180) * radius)));
      
      visible.push({
        ...objects[index],
        position: i,
        x: x,
        z: z,
        rotateY: (i * angleStep),
        isFront: z > radius * 0.5, // Cards in front half
        scale: 0.7 + (z / radius) * 0.3, // Scale based on depth (0.7 to 1.0)
        opacity: 0.4 + (z / radius) * 0.6 // Opacity based on depth (0.4 to 1.0)
      });
    }
    return visible;
  };

  if (!objects || objects.length === 0) {
    return null;
  }

  const visibleObjects = getVisibleObjects();

  return (
    <div className="dossier-carousel">
      <div className="carousel-container">
        <button 
          className="carousel-btn carousel-btn-prev" 
          onClick={handlePrev}
          disabled={isTransitioning}
        >
          ‹
        </button>

        <div className="carousel-track">
          {visibleObjects.map((obj, idx) => (
            <div
              key={`${obj.id}-${idx}`}
              className={`carousel-card ${isTransitioning ? 'transitioning' : ''} ${obj.is_classified ? 'classified' : ''}`}
              onClick={() => obj.isFront && onObjectClick(obj)}
              onMouseEnter={() => setHoveredCard(obj.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: `rotateY(${obj.rotateY}deg) translateZ(${obj.z}px)`,
                opacity: obj.opacity,
                zIndex: Math.round(obj.z),
                pointerEvents: obj.isFront ? 'auto' : 'none'
              }}
            >
              <div className="carousel-card-header">
                <span className="carousel-number">ES-{obj.number}</span>
                {obj.is_classified && (
                  <span className="carousel-classified-badge">ЗАСЕКРЕЧЕНО</span>
                )}
              </div>
              <h3 className="carousel-name">{obj.name}</h3>
              <p className="carousel-codename">"{obj.codename}"</p>
              <div className="carousel-threat">
                <span className="carousel-threat-label">Класс угрозы:</span>
                <span className="carousel-threat-value">{obj.threat_class}</span>
              </div>
              {obj.isFront && (
                <button className="carousel-view-btn">Подробнее →</button>
              )}
            </div>
          ))}
        </div>

        <button 
          className="carousel-btn carousel-btn-next" 
          onClick={handleNext}
          disabled={isTransitioning}
        >
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {objects.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-indicator ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(idx);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
