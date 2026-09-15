import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../../store/slices/authSlice';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'CITY_ADMINISTRATOR',
    district: '',
    badgeNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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
    const payload = {
      username: formData.username.trim(),
      password: formData.password,
      fullName: formData.fullName.trim(),
      role: formData.role,
      district: formData.district?.trim() || null,
      badgeNumber: formData.badgeNumber?.trim() || null,
    };
    const resultAction = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/login');
    }
  };

  return (
    <div className="auth-wrapper register-wrapper">
      <div className="auth-container register-card liquid-glass-panel">
        {/* Specular Edge Highlight Glow */}
        <div className="glass-specular-glow" aria-hidden="true" />

        {/* Header & Smart City Branding */}
        <div className="auth-header">
          <div className="login-brand-icon-wrapper">
            <div className="brand-icon-glow" />
            <div className="brand-icon-inner">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="7" r="4" stroke="#38bdf8" strokeWidth="2"/>
                <path d="M19 8v6m3-3h-6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <h2 className="auth-title">MetroMind</h2>
          <p className="auth-subtitle">Municipal Personnel Registration</p>
          <div className="login-telemetry-badge">
            <span className="status-live-beacon" />
            <span className="status-badge-text">CADRE ONBOARDING PORTAL</span>
          </div>
        </div>

        {/* Error Feedback Banner */}
        {error && (
          <div className="error-alert login-error-banner" role="alert">
            <span className="alert-icon" aria-hidden="true">⚠️</span>
            <span className="alert-text">
              {typeof error === 'string' ? error : error?.message || 'Registration failed. Please verify submitted details.'}
            </span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="register-form-container" noValidate>
          <div className="form-group">
            <label htmlFor="username">
              <span className="label-text">Username</span>
              <span className="label-tag">OPERATOR ID</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose username handle"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <span className="label-text">Password</span>
              <span className="label-tag">SECURITY KEY</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create secure password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">
              <span className="label-text">Full Name</span>
              <span className="label-tag">LEGAL IDENTITY</span>
            </label>
            <div className="input-field-wrapper">
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Officer full legal name"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <span className="label-text">Assigned Role</span>
              <span className="label-tag">CLEARANCE TIER</span>
            </label>
            <div className="input-field-wrapper select-field-wrapper">
              <span className="input-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </span>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="custom-role-select"
              >
                <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR — City-Wide Authority</option>
                <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER — Traffic Management</option>
                <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR — Power & Water Grids</option>
                <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN — On-Site Inspection</option>
              </select>
              <span className="select-chevron" aria-hidden="true">▼</span>
            </div>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label htmlFor="district">
                <span className="label-text">District</span>
                <span className="label-tag">OPTIONAL</span>
              </label>
              <div className="input-field-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </span>
                <input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="e.g. Central, North"
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="badgeNumber">
                <span className="label-text">Badge No.</span>
                <span className="label-tag">OPTIONAL</span>
              </label>
              <div className="input-field-wrapper">
                <span className="input-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="9" x2="20" y2="9"></line>
                    <line x1="4" y1="15" x2="20" y2="15"></line>
                    <line x1="10" y1="3" x2="8" y2="21"></line>
                    <line x1="16" y1="3" x2="14" y2="21"></line>
                  </svg>
                </span>
                <input
                  id="badgeNumber"
                  name="badgeNumber"
                  type="text"
                  placeholder="e.g. TC-402"
                  value={formData.badgeNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit register-submit-btn"
            disabled={loading}
          >
            <span className="btn-content-flex">
              {loading ? (
                <>
                  <span className="btn-spinner" aria-hidden="true" />
                  <span>REGISTERING PERSONNEL...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <span className="btn-arrow" aria-hidden="true">➔</span>
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer & Login Navigation */}
        <div className="auth-footer login-footer-meta">
          <div className="auth-footer-nav">
            <span className="footer-prompt">Already have an account? </span>
            <Link to="/login" className="register-link">
              Login to Command Center
            </Link>
          </div>
        </div>

        {/* Bottom Security Compliance Stamp */}
        <div className="login-security-stamp">
          <span className="stamp-icon" aria-hidden="true">🛡️</span>
          <span>PERSONNEL REGISTRY SECURED • SHA-256 / BCRYPT VERIFIED</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
