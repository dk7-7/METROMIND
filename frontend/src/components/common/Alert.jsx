import React, { useState, useEffect } from 'react';

const Alert = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!visible || !message) return null;

  const bgColors = {
    success: '#dcfce7',
    error: '#fee2e2',
    warning: '#fef3c7',
    info: '#e0f2fe',
  };

  const textColors = {
    success: '#15803d',
    error: '#b91c1c',
    warning: '#b45309',
    info: '#0369a1',
  };

  const borderColors = {
    success: '#86efac',
    error: '#fca5a5',
    warning: '#fde047',
    info: '#7dd3fc',
  };

  return (
    <div
      className={`alert alert-${type}`}
      data-testid="alert-box"
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        backgroundColor: bgColors[type] || bgColors.info,
        color: textColors[type] || textColors.info,
        border: `1px solid ${borderColors[type] || borderColors.info}`,
        marginBottom: '0.75rem',
        fontSize: '0.925rem',
      }}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginLeft: '1rem',
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Alert;