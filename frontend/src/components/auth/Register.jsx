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
    <div className="auth-wrapper">
      <div className="auth-container animate-fade-in">
        {/* Brand Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
          </div>
          <h2 className="auth-title">
            Metro<span className="text-primary">Mind</span>
          </h2>
          <p className="auth-subtitle">
            Municipal Personnel Credential Onboarding
          </p>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{typeof error === 'string' ? error : error.message || 'Registration failed'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="username">
                Username <span className="required-star">*</span>
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required-star">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Choose password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">
              Full Legal Name <span className="required-star">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Operational Role <span className="required-star">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
              <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
              <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
              <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
            </select>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="district">
                Assigned District
              </label>
              <input
                id="district"
                name="district"
                type="text"
                placeholder="e.g. North District"
                value={formData.district}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="badgeNumber">
                Official Badge ID
              </label>
              <input
                id="badgeNumber"
                name="badgeNumber"
                type="text"
                placeholder="e.g. MM-4029"
                value={formData.badgeNumber}
                onChange={handleChange}
              />
            </div>
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
                Enrolling Personnel...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have active credentials? </span>
          <Link to="/login">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
