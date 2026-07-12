import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '24px',
      }}
      className="fade-in"
    >
      <div 
        style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          padding: '20px',
          borderRadius: '50%',
          color: 'var(--color-danger)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ShieldAlert size={48} />
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
        404 - Grid Segment Unknown
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '14px', marginBottom: '32px' }}>
        The grid node or control terminal sector you requested could not be resolved or does not exist.
      </p>

      <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>
        <Home size={16} />
        Return to Control Room
      </Link>
    </div>
  );
};

export default NotFound;
