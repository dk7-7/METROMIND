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
      <div className="auth-container">
        <div className="auth-header">
          <h2 className="auth-title">MetroMind</h2>
          <p className="auth-subtitle">Personnel Registration</p>
        </div>

        {error && (
          <div className="error-alert">
            {typeof error === 'string' ? error : error?.message || 'Registration failed'}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Choose a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
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

          <div className="form-group">
            <label htmlFor="district">District</label>
            <input
              id="district"
              name="district"
              type="text"
              placeholder="Enter district"
              value={formData.district}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="badgeNumber">Badge Number</label>
            <input
              id="badgeNumber"
              name="badgeNumber"
              type="text"
              placeholder="Enter badge number"
              value={formData.badgeNumber}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already registered? </span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
