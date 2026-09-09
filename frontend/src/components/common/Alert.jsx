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

  const typeConfig = {
    success: {
      bg: '#ecfdf5',
      text: '#065f46',
      border: '#a7f3d0',
      icon: '✓',
      iconBg: '#10b981',
    },
    error: {
      bg: '#fef2f2',
      text: '#991b1b',
      border: '#fecaca',
      icon: '✕',
      iconBg: '#ef4444',
    },
    warning: {
      bg: '#fffbeb',
      text: '#92400e',
      border: '#fde68a',
      icon: '!',
      iconBg: '#f59e0b',
    },
    info: {
      bg: '#eff6ff',
      text: '#1e40af',
      border: '#bfdbfe',
      icon: 'i',
      iconBg: '#3b82f6',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`alert alert-${type}`}
      data-testid="alert-box"
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.8rem 1.15rem',
        borderRadius: '8px',
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        marginBottom: '1rem',
        fontSize: '0.9rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: config.iconBg,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </span>
        <span style={{ fontWeight: 500 }}>{message}</span>
      </div>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: config.text,
          cursor: 'pointer',
          fontWeight: 'bold',
          marginLeft: '1rem',
          fontSize: '1.15rem',
          padding: '0 4px',
          opacity: 0.75,
          transition: 'opacity 0.15s ease',
        }}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
};

export default Alert;