import React, { useState, useEffect } from 'react';

const Alert = ({ message, type = 'info', duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!visible || !message) return null;

  const typeColors = {
    success: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', color: '#10b981' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', color: '#f59e0b' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' },
    info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', color: '#3b82f6' },
  };

  const colors = typeColors[type] || typeColors.info;

  return (
    <div
      role="alert"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '6px',
        padding: '12px 16px',
        color: colors.color,
        fontSize: '13px',
        marginBottom: '12px',
      }}
    >
      {message}
    </div>
  );
};

export default Alert;
