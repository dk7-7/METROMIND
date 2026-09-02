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

  return (
    <div
      className={`notification ${type}`}
      data-testid="notification-item"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '0.5rem',
        minWidth: '280px',
        maxWidth: '420px',
        animation: 'slideIn 0.2s ease-out',
        backgroundColor: type === 'success' ? '#15803d' : type === 'error' ? '#b91c1c' : '#1e293b',
        color: '#ffffff',
        fontSize: '0.9rem',
      }}
    >
      <span style={{ marginRight: '0.75rem' }}>{message}</span>
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