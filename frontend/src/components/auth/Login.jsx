import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated || user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) {
      dispatch(clearError());
    }
    dispatch(login({ username, password }));
  };

  return (
    <div
      className="auth-container"
      style={{
        maxWidth: '400px',
        margin: '4rem auto',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#ffffff',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
          MetroMind
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Sign in to your smart-city operations console
        </p>
      </div>

      {error && (
        <div
          className="error-alert"
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            borderRadius: '6px',
            border: '1px solid #fca5a5',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          {typeof error === 'string' ? error : error.message || 'Authentication failed'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.25rem' }}>
          <label
            htmlFor="username"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#334155',
            }}
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => {
              if (error) dispatch(clearError());
              setUsername(e.target.value);
            }}
            required
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#334155',
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              if (error) dispatch(clearError());
              setPassword(e.target.value);
            }}
            required
            style={{
              width: '100%',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.95rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: loading ? '#94a3b8' : '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <span style={{ color: '#64748b' }}>Don't have an account? </span>
        <Link to="/register" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;