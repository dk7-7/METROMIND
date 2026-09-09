import React from 'react';

const EmptyState = ({ message = 'No data available.' }) => {
  return (
    <div
      className="empty-state"
      data-testid="empty-state"
    >
      <div
        className="empty-state-icon"
        aria-hidden="true"
      >
        📡
      </div>
      <p className="empty-state-message">
        {message}
      </p>
      <p className="empty-state-subtext">
        Municipal telemetry feed is active. No matching operational entries found.
      </p>
    </div>
  );
};

export default EmptyState;