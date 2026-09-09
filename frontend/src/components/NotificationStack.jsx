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
      className={`notification ${type}`}
      data-testid="notification-item"
    >
      <div className="notification-content">
        <span className="notification-icon">
          {getIcon()}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <button
        type="button"
        className="btn-dismiss"
        onClick={handleDismiss}
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
    <div className="notification-stack">
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
};

export default NotificationStack;