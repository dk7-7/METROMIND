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
    >
      <span className="error-handler-text">{errorText}</span>
    </div>
  );
};

export default ErrorHandler;
