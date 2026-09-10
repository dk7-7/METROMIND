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

  return (
    <div
      className={`alert alert-${type}`}
      data-testid="alert-box"
      role="alert"
    >
      <span className="alert-message">{message}</span>
      <button
        type="button"
        className="alert-close-btn"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Close"
      >
        X
      </button>
    </div>
  );
};

export default Alert;