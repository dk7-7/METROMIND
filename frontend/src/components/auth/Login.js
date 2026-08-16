import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Login = () => {
  const { error } = useSelector((state) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    // Login logic handled by parent or dispatch
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '32px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
        MetroMind Login
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
        Enter credentials to access the control terminal
      </p>

      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            padding: '12px',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {error}
        </div>
      )}

      {submitError && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '6px',
            padding: '12px',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '20px',
          }}
        >
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="username" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f1f5f9',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="password" style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#e2e8f0' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(15, 23, 42, 0.6)',
              color: '#f1f5f9',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
