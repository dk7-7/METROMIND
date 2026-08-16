import React, { useEffect, useState } from 'react';

// Simplistic Alert component. In a real app, you might use a global alert context for stacking.
const Alert = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration && duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!visible || !message) return null;

    const styles = {
        success: { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' },
        error: { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' },
        warning: { backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' },
        info: { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' }
    };

    const currentStyle = styles[type] || styles.info;

    return (
        <div style={{ 
            ...currentStyle, 
            padding: '1rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1000
        }}>
            {message}
        </div>
    );
};

export default Alert;
