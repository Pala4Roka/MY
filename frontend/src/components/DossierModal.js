import React, { useState } from 'react';
import './DossierModal.css';
import { scpAPI } from '../api';

export default function DossierModal({ object, onClose, onUpdate, onDelete, userClearance = 1 }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedObject, setEditedObject] = useState(object);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = userClearance >= 5;

  const handleChange = (field, value) => {
    setEditedObject(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      
      // Validate required fields
      if (!editedObject.name || !editedObject.codename || !editedObject.description) {
        setError('Пожалуйста, заполните все обязательные поля');
        setSaving(false);
        return;
      }

      // Call API to update
      await scpAPI.updateObject(object.number, {
        name: editedObject.name,
        codename: editedObject.codename,
        threat_class: editedObject.threat_class,
        description: editedObject.description,
        special_procedures: editedObject.special_procedures,
        secret_data: editedObject.secret_data,
        image_url: editedObject.image_url,
        is_classified: editedObject.is_classified
      });

      if (onUpdate) onUpdate(editedObject);
      setIsEditing(false);
      setSaving(false);
    } catch (err) {
      console.error('Error saving object:', err);
      setError('Ошибка при сохранении: ' + (err.message || 'Неизвестная ошибка'));
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить объект ES-${object.number}?`)) {
      return;
    }

    try {
      setSaving(true);
      await scpAPI.deleteObject(object.number);
      if (onDelete) onDelete(object.number);
      onClose();
    } catch (err) {
      console.error('Error deleting object:', err);
      setError('Ошибка при удалении: ' + (err.message || 'Неизвестная ошибка'));
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} disabled={saving}>
          ✕
        </button>
        
        <div className="modal-header">
          <div className="modal-number">ES-{object.number}</div>
          {object.is_classified && (
            <span className="modal-classified-badge">ЗАСЕКРЕЧЕНО</span>
          )}
        </div>

        {error && (
          <div style={{
            background: '#dc2626',
            color: 'white',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {isEditing ? (
          <>
            {/* Edit Mode */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                Название *
              </label>
              <input
                type="text"
                value={editedObject.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '16px'
                }}
                disabled={saving}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                Кодовое имя *
              </label>
              <input
                type="text"
                value={editedObject.codename}
                onChange={(e) => handleChange('codename', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
                disabled={saving}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                Класс угрозы
              </label>
              <select
                value={editedObject.threat_class}
                onChange={(e) => handleChange('threat_class', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
                disabled={saving}
              >
                <option value="Threat">Threat</option>
                <option value="Hazard">Hazard</option>
                <option value="Cataclysm">Cataclysm</option>
                <option value="Collapse">Collapse</option>
                <option value="Apex">Apex</option>
                <option value="Absolute">Absolute</option>
                <option value="Annihilation">Annihilation</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                Описание *
              </label>
              <textarea
                value={editedObject.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                disabled={saving}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                Особые процедуры содержания
              </label>
              <textarea
                value={editedObject.special_procedures || ''}
                onChange={(e) => handleChange('special_procedures', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                disabled={saving}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                Секретные данные
              </label>
              <textarea
                value={editedObject.secret_data || ''}
                onChange={(e) => handleChange('secret_data', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                disabled={saving}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#dc2626', fontWeight: 'bold' }}>
                URL изображения
              </label>
              <input
                type="text"
                value={editedObject.image_url || ''}
                onChange={(e) => handleChange('image_url', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #dc2626',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '14px'
                }}
                disabled={saving}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1
                }}
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={() => {
                  setEditedObject(object);
                  setIsEditing(false);
                  setError('');
                }}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#555',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                Отмена
              </button>
            </div>
          </>
        ) : (
          <>
            {/* View Mode */}
            <h2 className="modal-title">{object.name}</h2>
            <p className="modal-codename">"{object.codename}"</p>
            
            {object.image_url && !object.image_url.endsWith('.glb') && (
              <div className="modal-image">
                <img src={object.image_url} alt={object.name} />
              </div>
            )}
            
            <div className="modal-section">
              <h3>Класс угрозы</h3>
              <p className="threat-level">{object.threat_class}</p>
            </div>
            
            <div className="modal-section">
              <h3>Описание</h3>
              <p>{object.description}</p>
            </div>
            
            {object.special_procedures && (
              <div className="modal-section">
                <h3>Особые процедуры содержания</h3>
                <p>{object.special_procedures}</p>
              </div>
            )}
            
            {object.secret_data && (
              <div className="modal-section secret">
                <h3>Секретные данные</h3>
                <p>{object.secret_data}</p>
              </div>
            )}

            {isAdmin && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #dc2626' }}>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#2563eb'}
                  onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
                >
                  ✏️ Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => !saving && (e.target.style.background = '#b91c1c')}
                  onMouseLeave={(e) => e.target.style.background = '#dc2626'}
                >
                  🗑️ Удалить
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
