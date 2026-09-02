import React from 'react';

const ErrorHandler = ({ error, message, errorMessage, err }) => {
  const errorObj = error || message || errorMessage || err;
  if (!errorObj) return null;

  const errorText =
    typeof errorObj === 'string'
      ? errorObj
      : errorObj?.response?.data?.message ||
        errorObj?.response?.data?.error ||
        errorObj?.message ||
        errorObj?.error ||
        'An error occurred';

  return (
    <div
      className="error-handler error-alert alert-error"
      data-testid="error-handler"
      role="alert"
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
      {errorText}
    </div>
  );
};

export default ErrorHandler;
