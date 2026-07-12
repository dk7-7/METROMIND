import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';
import { UserPlus, User, Mail, Key, ShieldAlert, CheckCircle } from 'lucide-react';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validate
    const newErrors = {};
    if (!validateRequired(name)) newErrors.name = 'Full name is required';
    if (!validateEmail(email)) newErrors.email = 'Please enter a valid email address';
    if (!validatePassword(password)) newErrors.password = 'Password must be at least 6 characters';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setSubmitError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
        Register Node
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
        Register a new operator profile with central control
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

      {success && (
        <div 
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '12px',
            color: 'var(--color-success)',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <CheckCircle size={16} />
          <span>Node Registered! Redirecting to login...</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name-input">Full Name</label>
          <div style={{ position: 'relative' }}>
            <User 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} 
            />
            <input
              id="name-input"
              type="text"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marcus Vance"
              disabled={loading || success}
            />
          </div>
          {errors.name && (
            <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email-input">Control Email</label>
          <div style={{ position: 'relative' }}>
            <Mail 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} 
            />
            <input
              id="email-input"
              type="email"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@utility.com"
              disabled={loading || success}
            />
          </div>
          {errors.email && (
            <span style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label" htmlFor="password-input">Terminal Key</label>
          <div style={{ position: 'relative' }}>
            <Key 
              size={18} 
              style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} 
            />
            <input
              id="password-input"
              type="password"
              className="form-control"
              style={{ paddingLeft: '40px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading || success}
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
          disabled={loading || success}
        >
          <UserPlus size={18} />
          {loading ? 'Authorizing key...' : 'Register Operator Node'}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Already registered?{' '}
        <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Register;
