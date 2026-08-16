import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ message }) => {
    return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
            <Inbox size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>{message}</p>
        </div>
    );
};

export default EmptyState;
