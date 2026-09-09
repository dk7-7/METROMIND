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
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.15rem',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        borderRadius: '8px',
        border: '1px solid #fecaca',
        marginBottom: '1.25rem',
        fontSize: '0.9rem',
        boxShadow: '0 1px 3px rgba(239, 68, 68, 0.1)',
      }}
    >
      <span
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        !
      </span>
      <span style={{ fontWeight: 500 }}>{errorText}</span>
    </div>
  );
};

export default ErrorHandler;
