import React, { useState } from 'react';
import './OrganizationInfo.css';

export default function OrganizationInfo() {
  const [showClearanceModal, setShowClearanceModal] = useState(false);
  const [showThreatModal, setShowThreatModal] = useState(false);

  return (
    <div className="organization-info">
      <div className="org-header">
        <h2>О ОРГАНИЗАЦИИ ETERNAL SENTINELS</h2>
        <div className="org-buttons">
          <button 
            className="info-btn"
            onClick={() => setShowClearanceModal(true)}
          >
            📋 Уровни допуска
          </button>
          <button 
            className="info-btn"
            onClick={() => setShowThreatModal(true)}
          >
            ⚠️ Классы угроз
          </button>
        </div>
      </div>

      <div className="org-content">
        <h3>История организации</h3>
        <p>
          После многолетней борьбы с разрушительными силами мультивселенной и осознания того, что никто не способен 
          справляться с угрозами на столь масштабном уровне, <strong>█ █ █ █ █ █ █ █ (Объект 0000)</strong> и его союзник 
          <strong> █ █ █ █ █ █ █ (Объект 0004)</strong> приняли решение создать собственную организацию.
        </p>
        <p>
          Их целью стала защита всего существующего от разрушения — как известного, так и неизвестного. 
          <strong> Eternal Sentinels (ES)</strong>, что переводится как "Вечные Стражи", — это тайная организация, 
          в основе которой лежат принципы наблюдения, контроля и защиты всех реальностей.
        </p>

        <h3>Миссия Eternal Sentinels</h3>
        <ul>
          <li><strong>Observe (Наблюдать):</strong> следить за всеми известными и неизвестными угрозами, предотвращая их распространение.</li>
          <li><strong>Contain (Сдерживать):</strong> удерживать силы, которые могут уничтожить или дестабилизировать реальности.</li>
          <li><strong>Defend (Защищать):</strong> активное вмешательство для спасения миров от угроз, включая защиту от разрушительных событий.</li>
        </ul>

        <h3>Независимость и секретность</h3>
        <p>
          Eternal Sentinels действуют независимо и вне системы каких-либо организаций, включая SCP Foundation и другие 
          подобные структуры. Фонд и прочие организации даже не подозревают о существовании ES, так как её основатели 
          предприняли все меры для полного сокрытия своих действий и операций.
        </p>
        <p>
          Информация об Eternal Sentinels доступна лишь тем, кто имеет непосредственное отношение к структуре.
        </p>
      </div>

      {/* Clearance Levels Modal */}
      {showClearanceModal && (
        <div className="modal-overlay" onClick={() => setShowClearanceModal(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowClearanceModal(false)}>✕</button>
            <h2>Уровни допуска</h2>
            <div className="clearance-list">
              <div className="clearance-item">
                <h3>Уровень 1-2</h3>
                <p>Доступ к объектам класса "Угроза (Threat)"</p>
              </div>
              <div className="clearance-item">
                <h3>Уровень 3</h3>
                <p>Доступ к "Опасность (Hazard)" и "Катаклизм (Cataclysm)"</p>
              </div>
              <div className="clearance-item">
                <h3>Уровень 4</h3>
                <p>Доступ к "Крушение (Collapse)" и "Предел (Apex)"</p>
              </div>
              <div className="clearance-item">
                <h3>Уровень 5</h3>
                <p>Полный доступ ко всем объектам, секретным данным и админ-панели</p>
              </div>
              <div className="clearance-item classified">
                <h3>Уровень ██████</h3>
                <p>[ЗАСЕКРЕЧЕНО]</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threat Classes Modal */}
      {showThreatModal && (
        <div className="modal-overlay" onClick={() => setShowThreatModal(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowThreatModal(false)}>✕</button>
            <h2>Классы угроз</h2>
            <div className="threat-list">
              <div className="threat-item threat-1">
                <h3>THREAT - Угроза</h3>
                <p>Существа низкого уровня опасности. Представляют локальную угрозу.</p>
              </div>
              <div className="threat-item threat-2">
                <h3>HAZARD - Опасность</h3>
                <p>Средний уровень опасности. Способны нанести серьёзный вред.</p>
              </div>
              <div className="threat-item threat-3">
                <h3>CATACLYSM - Катаклизм</h3>
                <p>Способны уничтожать города и вызывать массовые катастрофы.</p>
              </div>
              <div className="threat-item threat-4">
                <h3>COLLAPSE - Крушение</h3>
                <p>Могут разрушить целые цивилизации, угрожая всему человечеству.</p>
              </div>
              <div className="threat-item threat-5">
                <h3>APEX - Предел</h3>
                <p>Максимальная угроза. Способны уничтожить всю планету.</p>
              </div>
              <div className="threat-item classified">
                <h3>██████████ - [ЗАСЕКРЕЧЕНО]</h3>
                <p>[ДАННЫЕ УДАЛЕНЫ]</p>
              </div>
              <div className="threat-item classified">
                <h3>███████████████ - [ЗАСЕКРЕЧЕНО]</h3>
                <p>[ДАННЫЕ УДАЛЕНЫ]</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
