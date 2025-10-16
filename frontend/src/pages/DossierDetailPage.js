import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scpAPI } from '../api';
import jsPDF from 'jspdf';
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
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text('ETERNAL SENTINELS', 105, 20, { align: 'center' });
    
    // Object Number
    doc.setFontSize(16);
    doc.text(`Объект ES-${object.number}`, 105, 35, { align: 'center' });
    
    // Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    let y = 50;
    
    doc.text(`Имя: ${object.name}`, 20, y);
    y += 10;
    doc.text(`Кодовое имя: ${object.codename}`, 20, y);
    y += 10;
    doc.text(`Класс угрозы: ${object.threat_class}`, 20, y);
    y += 15;
    
    doc.text('Описание:', 20, y);
    y += 7;
    const descLines = doc.splitTextToSize(object.description, 170);
    doc.text(descLines, 20, y);
    y += descLines.length * 7 + 10;
    
    if (object.special_procedures) {
      doc.text('Процедуры содержания:', 20, y);
      y += 7;
      const procLines = doc.splitTextToSize(object.special_procedures, 170);
      doc.text(procLines, 20, y);
      y += procLines.length * 7 + 10;
    }
    
    if (object.secret_data && !object.is_classified) {
      doc.text('Секретные данные:', 20, y);
      y += 7;
      const secretLines = doc.splitTextToSize(object.secret_data, 170);
      doc.text(secretLines, 20, y);
    }
    
    doc.save(`ES-${object.number}-${object.name}.pdf`);
    setExporting(false);
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
          {exporting ? 'Экспорт...' : '📄 Экспорт в PDF'}
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
    </div>
  );
}
