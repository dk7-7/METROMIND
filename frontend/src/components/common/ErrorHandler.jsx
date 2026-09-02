import React from 'react';

const ErrorHandler = ({ error }) => {
  if (!error) return null;

  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || error?.error || 'An error occurred';

  return (
    <div
      className="error-handler error-alert"
      data-testid="error-handler"
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
      {errorMessage}
    </div>
  );
};

export default ErrorHandler;
