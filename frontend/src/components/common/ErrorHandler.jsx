import React from 'react';

const ErrorHandler = ({ error }) => {
    if (!error) return null;
    return (
        <div data-testid="error-handler" style={{ color: 'red', padding: '0.5rem', backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '4px', marginBottom: '1rem' }}>
            {error}
        </div>
    );
};

export default ErrorHandler;
