import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scpAPI } from '../api';
import ScrollToTop from '../components/ScrollToTop';
import { exportToTXT, exportToPDF, exportToDOC } from '../utils/dossierExport';
import './DossierDetailPage.css';

export default function DossierDetailPage() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchObject();
  }, [number]);

  const fetchObject = async () => {
    try {
      const data = await scpAPI.getByNumber(number);
      setObject(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching object:', error);
      if (error.response?.status === 403) {
        setError('Недостаточный уровень допуска для просмотра этого объекта');
      } else {
        setError('Ошибка загрузки объекта');
      }
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!object) return;
    
    setExporting(true);
    
    try {
      // Create formatted text content with proper UTF-8 encoding
      const content = `
╔═══════════════════════════════════════════════════════════════════════════╗
                          ETERNAL SENTINELS                             
                       ДОСЬЕ ES-${object.number}                                
╚═══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ОСНОВНАЯ ИНФОРМАЦИЯ]

Объект:            ES-${object.number}
Название:          ${object.name}
Кодовое имя:       "${object.codename}"
Класс угрозы:      ${object.threat_class}
Дата создания:     ${new Date(object.created_at).toLocaleString('ru-RU')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ОПИСАНИЕ]

${object.description}

${object.special_procedures ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[ПРОЦЕДУРЫ СОДЕРЖАНИЯ]

${object.special_procedures}
` : ''}

${object.secret_data && object.secret_data !== '[ТРЕБУЕТСЯ УРОВЕНЬ ДОПУСКА 5]' ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[СЕКРЕТНЫЕ ДАННЫЕ]

${object.secret_data}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Документ сгенерирован: ${new Date().toLocaleString('ru-RU')}
Организация: Eternal Sentinels (ES)
Классификация: КОНФИДЕНЦИАЛЬНО

╚═══════════════════════════════════════════════════════════════════════════╝
`;

      // Create blob with UTF-8 encoding (this preserves Cyrillic characters)
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ES-${object.number}-${object.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
      alert('Ошибка при экспорте досье');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="dossier-detail-page">
        <div className="loading">Загрузка досье...</div>
      </div>
    );
  }

  if (!object) {
    return (
      <div className="dossier-detail-page">
        <div className="error">Объект не найден</div>
        <button onClick={() => navigate('/')} className="back-btn">
          Вернуться
        </button>
      </div>
    );
  }

  return (
    <div className="dossier-detail-page">
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Назад к списку
        </button>
        <button onClick={exportToPDF} className="export-btn" disabled={exporting}>
          {exporting ? 'Экспорт...' : '📄 Скачать досье'}
        </button>
      </div>

      <div className="detail-container">
        <div className="detail-card">
          <div className="detail-header-section">
            <div className="object-number">ES-{object.number}</div>
            {object.is_classified && (
              <div className="classified-badge-large">ЗАСЕКРЕЧЕНО</div>
            )}
          </div>

          <h1 className="object-name">{object.name}</h1>
          <h2 className="object-codename">"{object.codename}"</h2>

          <div className="threat-section">
            <h3>Класс угрозы</h3>
            <div className="threat-value-large">{object.threat_class}</div>
          </div>

          <div className="detail-section">
            <h3>Описание</h3>
            <p className="detail-text">{object.description}</p>
          </div>

          {object.special_procedures && (
            <div className="detail-section">
              <h3>Процедуры содержания</h3>
              <p className="detail-text">{object.special_procedures}</p>
            </div>
          )}

          {object.secret_data && (
            <div className="detail-section secret">
              <h3>🔒 Секретные данные</h3>
              <p className="detail-text">{object.secret_data}</p>
            </div>
          )}

          <div className="detail-footer">
            <small>Создано: {new Date(object.created_at).toLocaleString('ru-RU')}</small>
          </div>
        </div>
      </div>
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
