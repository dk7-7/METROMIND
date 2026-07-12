import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const AlertNotification = ({ id, type = 'info', message, duration = 4000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      
      if (elapsed >= duration) {
        clearInterval(interval);
        onClose(id);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      color: 'var(--color-success)',
      bg: 'rgba(16, 185, 129, 0.12)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      icon: CheckCircle
    },
    danger: {
      color: 'var(--color-danger)',
      bg: 'rgba(239, 68, 68, 0.12)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      icon: AlertTriangle
    },
    warning: {
      color: 'var(--color-warning)',
      bg: 'rgba(245, 158, 11, 0.12)',
      border: '1px solid rgba(245, 158, 11, 0.25)',
      icon: AlertTriangle
    },
    info: {
      color: 'var(--color-info)',
      bg: 'rgba(59, 130, 246, 0.12)',
      border: '1px solid rgba(59, 130, 246, 0.25)',
      icon: Info
    }
  };

  const current = typeConfig[type] || typeConfig.info;
  const Icon = current.icon;

  return (
    <div 
      style={{
        background: 'var(--bg-secondary)',
        border: current.border,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'var(--glass-backdrop)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '320px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn var(--transition-fast)',
        zIndex: 9999,
      }}
    >
      {/* Content */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ color: current.color, display: 'flex', alignItems: 'center', marginTop: '2px' }}>
          <Icon size={20} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: current.color, letterSpacing: '0.5px' }}>
            {type === 'danger' ? 'SYSTEM ALERT' : `${type.toUpperCase()} EVENT`}
          </span>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
            {message}
          </p>
        </div>
        
        {/* Dismiss Button */}
        <button 
          onClick={() => onClose(id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress Bar indicator */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: current.color,
          width: `${progress}%`,
          opacity: 0.8,
          transition: 'width 30ms linear'
        }}
      />
    </div>
  );
};

export default AlertNotification;
