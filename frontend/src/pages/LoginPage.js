import React, { useState } from 'react';
import { authAPI, setToken, setUser } from '../api';
import './AuthPages.css';
import ESLogo from '../components/ESLogo';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isRegister
        ? await authAPI.register(username, password)
        : await authAPI.login(username, password);

      setToken(response.access_token);
      setUser(response.user);
      onLogin(response.user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка аутентификации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <ESLogo size="medium" />
          <p className="auth-subtitle">КОНТРОЛЬ ДОСТУПА К БАЗЕ ДАННЫХ</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите имя пользователя"
              required
              disabled={loading}
              data-testid="username-input"
            />
          </div>

          <div className="form-group">
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              disabled={loading}
              data-testid="password-input"
            />
          </div>

          {error && (
            <div className="error-message" data-testid="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-btn" 
            disabled={loading}
            data-testid="submit-btn"
          >
            {loading ? 'ОБРАБОТКА...' : (isRegister ? 'РЕГИСТРАЦИЯ' : 'ВОЙТИ')}
          </button>

          <div className="auth-toggle">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="toggle-btn"
              data-testid="toggle-auth-btn"
            >
              {isRegister
                ? 'Уже есть аккаунт? Войти'
                : 'Нужен аккаунт? Регистрация'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <p>НАБЛЮДАЙ • СОДЕРЖИ • ЗАЩИЩАЙ</p>
        </div>
      </div>
    </div>
  );
}
