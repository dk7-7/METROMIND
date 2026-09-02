import React from 'react';

const EmptyState = ({ message = 'No data available.' }) => {
  return (
    <div
      className="empty-state"
      data-testid="empty-state"
      style={{
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        color: '#64748b',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        border: '1px dashed #cbd5e1',
        margin: '1rem 0',
      }}
    >
      <div
        className="empty-state-icon"
        style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}
        aria-hidden="true"
      >
        📂
      </div>
      <p
        className="empty-state-message"
        style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}
      >
        {message}
      </p>
    </div>
  );
};

export default EmptyState;