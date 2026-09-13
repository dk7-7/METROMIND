import React from 'react';
import './EmptyState.css';

const EmptyState = ({ message = 'No records found.' }) => {
  return (
    <div className="empty-state" data-testid="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        ℹ️
      </div>
      <p className="empty-state-message">{message}</p>
    </div>
  );
};

export default EmptyState;