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
      className="auth-container"
      style={{
        maxWidth: '460px',
        margin: '3rem auto',
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
          Create your smart-city personnel account
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
          {typeof error === 'string' ? error : error.message || 'Registration failed'}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="username"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
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
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
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
            placeholder="Choose a password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="fullName"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#334155',
            }}
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="role"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#334155',
            }}
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
            }}
          >
            <option value="CITY_ADMINISTRATOR">CITY_ADMINISTRATOR</option>
            <option value="TRAFFIC_CONTROLLER">TRAFFIC_CONTROLLER</option>
            <option value="UTILITY_SUPERVISOR">UTILITY_SUPERVISOR</option>
            <option value="FIELD_TECHNICIAN">FIELD_TECHNICIAN</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="district"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#334155',
            }}
          >
            District
          </label>
          <input
            id="district"
            name="district"
            type="text"
            placeholder="Enter district"
            value={formData.district}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="badgeNumber"
            style={{
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#334155',
            }}
          >
            Badge Number
          </label>
          <input
            id="badgeNumber"
            name="badgeNumber"
            type="text"
            placeholder="Enter badge number"
            value={formData.badgeNumber}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
        <span style={{ color: '#64748b' }}>Already have an account? </span>
        <Link to="/login" style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>
          Login here
        </Link>
      </div>
    </div>
  );
};

export default Register;
