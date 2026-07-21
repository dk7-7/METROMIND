import React, { useState, useEffect } from 'react';
import AlertNotification from './AlertNotification';

export const AlertNotificationList = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handleAddNotification = (event) => {
      const { type, message, duration } = event.detail;
      const newNotification = {
        id: Date.now().toString(),
        type,
        message,
        duration: duration || 4000
      };
      setNotifications((prev) => [...prev, newNotification]);
    };

    window.addEventListener('add-notification', handleAddNotification);
    return () => {
      window.removeEventListener('add-notification', handleAddNotification);
    };
  }, []);

  const handleClose = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        zIndex: 99999,
        pointerEvents: 'auto',
      }}
    >
      {notifications.map((item) => (
        <AlertNotification
          key={item.id}
          id={item.id}
          type={item.type}
          message={item.message}
          duration={item.duration}
          onClose={handleClose}
        />
      ))}
    </div>
  );
};

export default AlertNotificationList;
