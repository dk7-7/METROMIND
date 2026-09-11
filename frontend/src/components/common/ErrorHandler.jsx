import React from 'react';

const ErrorHandler = ({ error, message, errorMessage, err, status }) => {
  const errorObj = error || message || errorMessage || err;
  const statusCode =
    status ||
    errorObj?.response?.status ||
    errorObj?.status ||
    (typeof errorObj === 'number' ? errorObj : null);

  if (!errorObj && !statusCode) return null;

  let errorText = '';

  if (statusCode === 401) {
    errorText = 'Session expired. Please log in again.';
  } else if (typeof errorObj === 'string') {
    const lower = errorObj.toLowerCase();
    if (
      lower.includes('401') ||
      lower.includes('unauthorized') ||
      lower.includes('session expired') ||
      lower.includes('token expired')
    ) {
      errorText = 'Session expired. Please log in again.';
    } else {
      errorText = errorObj;
    }
  } else if (errorObj?.response?.data?.message) {
    errorText = errorObj.response.data.message;
  } else if (errorObj?.response?.data?.error) {
    errorText = errorObj.response.data.error;
  } else if (errorObj?.message) {
    errorText = errorObj.message;
  } else if (errorObj?.error) {
    errorText = errorObj.error;
  } else {
    errorText = 'An error occurred';
  }

  if (typeof errorText === 'string') {
    const lower = errorText.toLowerCase();
    if (lower.includes('401') || lower.includes('unauthorized')) {
      errorText = 'Session expired. Please log in again.';
    }
  }

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
