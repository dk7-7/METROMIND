import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../store/slices/alertNotificationSlice';

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();
  const { id, message, type = 'info', duration = 4000 } = notification;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(id));
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, dispatch]);

  const handleDismiss = () => {
    dispatch(removeNotification(id));
  };

  const typeConfig = {
    success: {
      gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      border: '#10b981',
      icon: '✓',
    },
    error: {
      gradient: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      border: '#ef4444',
      icon: '✕',
    },
    warning: {
      gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      border: '#f59e0b',
      icon: '!',
    },
    info: {
      gradient: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '#3b82f6',
      icon: 'i',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`notification ${type}`}
      data-testid="notification-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.15rem',
        borderRadius: '10px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        marginBottom: '0.65rem',
        minWidth: '300px',
        maxWidth: '440px',
        animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        background: config.gradient,
        border: `1px solid ${config.border}55`,
        color: '#ffffff',
        fontSize: '0.9rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </span>
        <span style={{ fontWeight: 500, lineHeight: 1.3 }}>{message}</span>
      </div>
      <button
        type="button"
        className="btn-dismiss"
        onClick={handleDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '0 4px',
          fontSize: '1rem',
          opacity: 0.8,
          marginLeft: '0.75rem',
        }}
        aria-label="Dismiss"
      >
        X
      </button>
    </div>
  );
};

const NotificationStack = () => {
  const notifications = useSelector(
    (state) => state.alertNotification?.notifications || []
  );

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="notification-stack"
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default NotificationStack;