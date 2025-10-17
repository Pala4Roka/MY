import React from 'react';
import './Footer.css';

export default function Footer() {
  const socialLinks = [
    { name: 'Email', icon: '📧', url: '#', disabled: true },
    { name: 'Telegram', icon: '📱', url: '#', disabled: true },
    { name: 'YouTube', icon: '📺', url: '#', disabled: true },
    { name: 'TikTok', icon: '🎵', url: '#', disabled: true }
  ];

  return (
    <footer className="es-footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div className="footer-emblem">🛡️</div>
          <h3>ETERNAL SENTINELS</h3>
          <p className="footer-motto">Наблюдай • Содержи • Защищай</p>
        </div>

        <div className="footer-section">
          <h4>О нас</h4>
          <p className="footer-text">
            Eternal Sentinels - секретная организация, посвященная защите всех реальностей 
            от известных и неизвестных угроз. Мы наблюдаем, сдерживаем и защищаем.
          </p>
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <div className="social-links">
            {socialLinks.map((link, index) => (
              <div key={index} className="social-item">
                <a 
                  href={link.url}
                  className={`social-link ${link.disabled ? 'disabled' : ''}`}
                  title={link.name}
                  onClick={(e) => link.disabled && e.preventDefault()}
                >
                  <span className="social-icon">{link.icon}</span>
                  <span className="social-name">{link.name}</span>
                </a>
              </div>
            ))}
          </div>
          <p className="footer-note">Контактные данные будут добавлены позже</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Eternal Sentinels. Все права защищены. | 
          Уровень безопасности: МАКСИМАЛЬНЫЙ | 
          Доступ: ОГРАНИЧЕН
        </p>
      </div>
    </footer>
  );
}
