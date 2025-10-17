import React, { useState, useEffect } from 'react';
import './DossierCarousel.css';

export default function DossierCarousel({ objects, onObjectClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + objects.length) % objects.length;
      visible.push({ ...objects[index], position: i });
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
              className={`carousel-card position-${obj.position} ${isTransitioning ? 'transitioning' : ''} ${obj.is_classified ? 'classified' : ''}`}
              onClick={() => obj.position === 0 && onObjectClick(obj)}
              style={{
                transform: `translateX(${obj.position * 110}%) scale(${obj.position === 0 ? 1 : 0.8})`,
                opacity: obj.position === 0 ? 1 : 0.5,
                zIndex: obj.position === 0 ? 10 : 1,
                pointerEvents: obj.position === 0 ? 'auto' : 'none'
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
              {obj.position === 0 && (
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
