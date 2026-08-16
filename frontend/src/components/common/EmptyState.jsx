import React from 'react';

const EmptyState = ({ message }) => (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>ℹ️</div>
        <p>{message}</p>
    </div>
);

export default EmptyState;
