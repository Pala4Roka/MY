import React, { useState, useMemo, useEffect } from 'react';
import './DossierList.css';
import DossierCarousel from './DossierCarousel';

const THREAT_LEVELS = [
  { key: 'all', label: 'Все объекты', color: '#6b7280' },
  { key: 'Threat', label: 'Угроза (Threat)', color: '#4ade80' },
  { key: 'Hazard', label: 'Опасность (Hazard)', color: '#fbbf24' },
  { key: 'Cataclysm', label: 'Катаклизм (Cataclysm)', color: '#fb923c' },
  { key: 'Collapse', label: 'Крушение (Collapse)', color: '#f87171' },
  { key: 'Apex', label: 'Предел (Apex)', color: '#dc2626' },
  { key: 'Absolute', label: 'Абсолют (Absolute)', color: '#991b1b' },
  { key: 'Annihilation', label: 'Аннигиляция (Annihilation)', color: '#7f1d1d' }
];

export default function DossierList({ objects, onObjectClick, loading, externalThreatFilter = 'all' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedThreat, setSelectedThreat] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_DISPLAY_COUNT = 6;

  // Sync with external filter
  useEffect(() => {
    setSelectedThreat(externalThreatFilter);
  }, [externalThreatFilter]);

  const filteredObjects = useMemo(() => {
    let filtered = objects;

    // Filter by threat level
    if (selectedThreat !== 'all') {
      filtered = filtered.filter(obj => 
        obj.threat_class && obj.threat_class.includes(selectedThreat)
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(obj =>
        obj.number.toLowerCase().includes(search) ||
        obj.name.toLowerCase().includes(search) ||
        obj.codename.toLowerCase().includes(search) ||
        obj.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [objects, selectedThreat, searchTerm]);

  // Рандомные досье для карусели
  const randomObjects = useMemo(() => {
    const shuffled = [...objects].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10); // Показываем 10 случайных досье в карусели
  }, [objects]);

  // Досье для отображения под каруселью
  const displayedObjects = useMemo(() => {
    if (showAll || searchTerm || selectedThreat !== 'all') {
      return filteredObjects;
    }
    return filteredObjects.slice(0, INITIAL_DISPLAY_COUNT);
  }, [filteredObjects, showAll, searchTerm, selectedThreat]);

  if (loading) {
    return <div className="loading">Загрузка досье...</div>;
  }

  return (
    <div className="dossier-list">
      {/* Карусель с рандомными досье */}
      {!searchTerm && selectedThreat === 'all' && (
        <DossierCarousel 
          objects={randomObjects} 
          onObjectClick={onObjectClick}
        />
      )}

      <h2 className="dossier-list-title">ДОСЬЕ ОБЪЕКТОВ</h2>
      
      {/* Search Bar */}
      <div className="dossier-search">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Поиск по номеру, имени, кодовому имени..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => setSearchTerm('')}
            title="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>

      {/* Results Info */}
      {(searchTerm || selectedThreat !== 'all') && (
        <div className="results-info">
          Найдено объектов: <strong>{filteredObjects.length}</strong>
          {selectedThreat !== 'all' && ` в категории "${THREAT_LEVELS.find(l => l.key === selectedThreat)?.label}"`}
        </div>
      )}

      {/* Dossier Grid */}
      <div className="dossier-grid">
        {displayedObjects.length === 0 ? (
          <div className="no-results">
            <p>Объекты не найдены</p>
            <button 
              className="reset-filters-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedThreat('all');
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          displayedObjects.map(obj => (
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
              <button className="view-btn">Подробнее →</button>
            </div>
          ))
        )}
      </div>

      {/* Кнопка "Показать все" */}
      {!showAll && !searchTerm && selectedThreat === 'all' && filteredObjects.length > INITIAL_DISPLAY_COUNT && (
        <div className="show-all-container">
          <button 
            className="show-all-btn"
            onClick={() => setShowAll(true)}
          >
            📂 Показать все досье ({filteredObjects.length})
          </button>
        </div>
      )}

      {/* Кнопка "Скрыть" */}
      {showAll && !searchTerm && selectedThreat === 'all' && (
        <div className="show-all-container">
          <button 
            className="show-all-btn"
            onClick={() => {
              setShowAll(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            ⬆️ Скрыть
          </button>
        </div>
      )}
    </div>
  );
}
