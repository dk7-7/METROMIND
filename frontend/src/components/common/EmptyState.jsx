import React from 'react';

const EmptyState = ({ message = 'No data available.' }) => {
  return (
    <div
      className="empty-state"
      data-testid="empty-state"
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        borderRadius: '16px',
        margin: '1.25rem 0',
      }}
    >
      <div
        className="empty-state-icon"
        style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 1rem auto',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.75rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6), 0 4px 8px rgba(0, 0, 0, 0.04)',
        }}
        aria-hidden="true"
      >
        📡
      </div>
      <p
        className="empty-state-message"
        style={{
          fontSize: '0.975rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          margin: '0 0 0.35rem 0',
        }}
      >
        {message}
      </p>
      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0 }}>
        Municipal telemetry feed is active. No matching operational entries found.
      </p>
    </div>
  );
};

export default EmptyState;