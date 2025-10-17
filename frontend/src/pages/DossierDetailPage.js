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
  const [exportFormat, setExportFormat] = useState('');
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

  const handleExport = async (format) => {
    if (!object) return;
    
    setExporting(true);
    setExportFormat(format);
    
    try {
      if (format === 'txt') {
        exportToTXT(object);
      } else if (format === 'pdf') {
        await exportToPDF(object);
      } else if (format === 'doc') {
        await exportToDOC(object);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert(`Ошибка при экспорте досье в формат ${format.toUpperCase()}`);
    } finally {
      setExporting(false);
      setExportFormat('');
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
        <div className="export-buttons">
          <button 
            onClick={() => handleExport('txt')} 
            className="export-btn export-txt"
            disabled={exporting}
            title="Скачать в формате TXT"
          >
            {exporting && exportFormat === 'txt' ? '⏳' : '📄'} TXT
          </button>
          <button 
            onClick={() => handleExport('pdf')} 
            className="export-btn export-pdf"
            disabled={exporting}
            title="Скачать в формате PDF"
          >
            {exporting && exportFormat === 'pdf' ? '⏳' : '📕'} PDF
          </button>
          <button 
            onClick={() => handleExport('doc')} 
            className="export-btn export-doc"
            disabled={exporting}
            title="Скачать в формате DOC"
          >
            {exporting && exportFormat === 'doc' ? '⏳' : '📘'} DOC
          </button>
        </div>
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
