import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const videoRef = useRef(null);

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser policy delays autoplay
        });
      }
    }
  }, []);

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
          ref={videoRef}
          className="login-bg-video"
          src={process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/login.mp4` : '/login.mp4'}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/login.mp4` : '/login.mp4'} type="video/mp4" />
          <source src="/login.mp4" type="video/mp4" />
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