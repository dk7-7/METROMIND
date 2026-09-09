import React from 'react';

const EmptyState = ({ message = 'No data available.' }) => {
  return (
    <div
      className="empty-state"
      data-testid="empty-state"
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1.5px dashed #cbd5e1',
        margin: '1.25rem 0',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div
        className="empty-state-icon"
        style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 1rem auto',
          borderRadius: '12px',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          color: '#64748b',
          border: '1px solid #e2e8f0',
        }}
        aria-hidden="true"
      >
        📡
      </div>
      <p
        className="empty-state-message"
        style={{
          fontSize: '0.975rem',
          fontWeight: 600,
          color: '#334155',
          margin: '0 0 0.35rem 0',
        }}
      >
        {message}
      </p>
      <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: 0 }}>
        Municipal telemetry feed is active. No matching operational entries found.
      </p>
    </div>
  );
};

export default EmptyState;