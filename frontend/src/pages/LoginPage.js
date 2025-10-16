import React, { useState } from 'react';
import { authAPI, setToken, setUser } from '../api';
import './AuthPages.css';

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
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="es-logo">🛡️</div>
          <h1>ETERNAL SENTINELS</h1>
          <p className="auth-subtitle">DATABASE ACCESS CONTROL</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
              data-testid="username-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
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
            {loading ? 'PROCESSING...' : (isRegister ? 'REGISTER' : 'LOGIN')}
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
                ? 'Already have an account? Login'
                : 'Need an account? Register'}
            </button>
          </div>

          {!isRegister && (
            <div className="default-creds">
              <p><small>Default Admin: <strong>admin / admin123</strong></small></p>
            </div>
          )}
        </form>

        <div className="auth-footer">
          <p>OBSERVE • CONTAIN • DEFEND</p>
        </div>
      </div>
    </div>
  );
}
