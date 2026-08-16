import React from 'react';

const ErrorHandler = ({ error }) => {
    if (!error) return null;

    return (
        <div data-testid="error-handler" style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '0.375rem',
            marginBottom: '1rem',
            border: '1px solid #f87171'
        }}>
            {typeof error === 'string' ? error : error.message || 'An unexpected error occurred'}
        </div>
    );
};

export default ErrorHandler;
