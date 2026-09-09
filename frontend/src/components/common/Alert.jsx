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

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      case 'info':
      default:
        return 'i';
    }
  };

  return (
    <div
      className={`alert alert-${type}`}
      data-testid="alert-box"
      role="alert"
    >
      <div className="alert-content">
        <span className="alert-icon">
          {getIcon()}
        </span>
        <span className="alert-message">{message}</span>
      </div>
      <button
        type="button"
        className="alert-close-btn"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Alert;