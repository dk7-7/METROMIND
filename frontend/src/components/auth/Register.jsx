import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'CITY_ADMINISTRATOR',
    district: '',
    badgeNumber: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    if (error) dispatch(clearError());
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="auth-container animate-fade-in"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.25rem',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-card)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 0.35rem 0', letterSpacing: '-0.02em' }}>
            Metro<span style={{ color: 'var(--brand-primary)' }}>Mind</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>
            Municipal Personnel Credential Onboarding
          </p>
        </div>

        {error && (
          <div
            className="error-alert"
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              borderRadius: '8px',
              border: '1px solid var(--danger-border)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{typeof error === 'string' ? error : error.message || 'Registration failed'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.125rem' }}>
            <div>
              <label
                htmlFor="username"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Username <span style={{ color: 'var(--danger-text)' }}>*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose username"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Password <span style={{ color: 'var(--danger-text)' }}>*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Choose password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.125rem' }}>
            <label
              htmlFor="fullName"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              Full Legal Name <span style={{ color: 'var(--danger-text)' }}>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.125rem' }}>
            <label
              htmlFor="role"
              style={{
                display: 'block',
                marginBottom: '0.4rem',
                fontWeight: 600,
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
              }}
            >
              Operational Role <span style={{ color: 'var(--danger-text)' }}>*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            >
              <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
              <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
              <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
              <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label
                htmlFor="district"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Assigned District
              </label>
              <input
                id="district"
                name="district"
                type="text"
                placeholder="e.g. North District"
                value={formData.district}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="badgeNumber"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  color: 'var(--text-secondary)',
                }}
              >
                Official Badge ID
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                placeholder="e.g. MM-4029"
                value={formData.badgeNumber}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? 'var(--text-muted)' : 'var(--brand-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              minHeight: '44px',
            }}
          >
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Enrolling Personnel...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.8125rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have active credentials? </span>
          <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
