import React, { useState, useEffect } from 'react';

const Alert = ({ message, type = 'info', duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!visible) return null;

    const getBgColor = () => {
        switch (type) {
            case 'success': return '#dcfce7'; // green-100
            case 'error': return '#fee2e2'; // red-100
            case 'warning': return '#fef3c7'; // yellow-100
            case 'info':
            default: return '#e0f2fe'; // blue-100
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success': return '#166534'; // green-800
            case 'error': return '#991b1b'; // red-800
            case 'warning': return '#92400e'; // yellow-800
            case 'info':
            default: return '#075985'; // blue-800
        }
    };

    return (
        <div style={{
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: getBgColor(),
            color: getTextColor(),
            borderRadius: '0.375rem',
            border: `1px solid ${getTextColor()}20`
        }}>
            {message}
        </div>
    );
};

export default Alert;
