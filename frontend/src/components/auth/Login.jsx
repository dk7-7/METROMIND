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
    console.log({ username });
    dispatch(login({ username, password }));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container animate-fade-in">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
          <h2 className="auth-title">
            Metro<span className="text-primary">Mind</span>
          </h2>
          <p className="auth-subtitle">
            Municipal Operations & Utility Command Center
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{typeof error === 'string' ? error : error.message || 'Authentication failed'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              Operator ID / Username
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
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Security Credential
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
            />
          </div>

          <button
            type="submit"
            className="btn-submit btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Authenticating...
              </>
            ) : (
              'Access Command Console'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Authorized personnel without credentials? </span>
          <Link to="/register">
            Register access
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;