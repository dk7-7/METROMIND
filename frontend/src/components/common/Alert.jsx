import React, { useEffect } from "react";

const Alert = ({ message, type = "info", duration = 3000, onDismiss }) => {
  useEffect(() => {
    if (!duration) return undefined;
    const timer = setTimeout(() => {
      if (onDismiss) onDismiss();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`} role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button aria-label="dismiss" onClick={onDismiss}>
          x
        </button>
      )}
    </div>
  );
};

export default Alert;
