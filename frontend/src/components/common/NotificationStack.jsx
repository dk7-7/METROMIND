import React, { useState, useCallback } from "react";
import Alert from "./Alert";

let idCounter = 0;

const NotificationStack = ({ notifications = [], onRemove }) => {
  return (
    <div className="notification-stack">
      {notifications.map((n) => (
        <Alert
          key={n.id}
          message={n.message}
          type={n.type}
          duration={n.duration || 3000}
          onDismiss={() => onRemove(n.id)}
        />
      ))}
    </div>
  );
};

// Helper hook other components can use to manage a stack of notifications.
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = "info", duration = 3000) => {
    idCounter += 1;
    const id = idCounter;
    setNotifications((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return { notifications, addNotification, removeNotification };
};

export default NotificationStack;
