import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { validatePassword, validateRequired } from '../../utils/validators';
import { LogIn, Key, Mail, ShieldAlert } from 'lucide-react';

export const LoginComponent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    const newErrors = {};
    if (!validateRequired(email)) newErrors.email = 'Please enter a valid username or email';
    if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      await login(email, password);
      // Dispatch custom event to trigger notification
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: { type: 'success', message: 'Operator Session Initialized Successfully!' }
      }));
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Invalid operator credentials');
      window.dispatchEvent(new CustomEvent('add-notification', {
        detail: { type: 'danger', message: 'Authentication Access Denied' }
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
        Operator Login
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
        Enter credentials to access the central terminal
      </p>

      {submitError && (
        <div 
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '12px',
            color: 'var(--color-danger)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <ShieldAlert size={16} />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="comp-email-input">Control Username</label>
          <div style={{ position: 'relative' }}>
            <Mail 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} 
            />
            <input
              id="comp-email-input"
              type="text"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin"
              disabled={loading}
            />
          </div>
          {errors.email && (
            <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" htmlFor="comp-password-input">Terminal Key</label>
          <div style={{ position: 'relative' }}>
            <Key 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} 
            />
            <input
              id="comp-password-input"
              type="password"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>
          {errors.password && (
            <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.password}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: '12px', display: 'flex', gap: '8px' }}
          disabled={loading}
        >
          <LogIn size={18} />
          {loading ? 'Initializing session...' : 'Access Control Terminal'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        New Operator?{' '}
        <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>
          Register Node
        </Link>
      </div>
    </div>
  );
};

export default LoginComponent;
