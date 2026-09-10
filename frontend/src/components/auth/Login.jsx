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

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error) {
      dispatch(clearError());
    }
    dispatch(login({ username, password }));
  };

  return (
    <div className="auth-wrapper login-wrapper">
      {/* Background Video Layer */}
      <div className="login-video-backdrop" aria-hidden="true">
        <video
          className="login-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={process.env.PUBLIC_URL + '/login.mp4'} type="video/mp4" />
        </video>
        <div className="login-bg-overlay" aria-hidden="true" />
      </div>

      <div className="auth-container login-card">
        <div className="auth-header">
          <h2 className="auth-title">MetroMind</h2>
          <p className="auth-subtitle">Command Center Login</p>
        </div>

        {error && (
          <div className="error-alert">
            {typeof error === 'string' ? error : error?.message || 'Authentication failed'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="password">Password</label>
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
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Need an account? </span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;