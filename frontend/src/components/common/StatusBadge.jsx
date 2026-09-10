import React from 'react';

const StatusBadge = ({ status = 'NORMAL', pulse = false, size = 'md', className = '' }) => {
  const norm = String(status).toUpperCase();

  let colorClass = 'status-normal';
  if (['CRITICAL', 'SEVERE', 'EMERGENCY', 'OUTAGE', 'DISRUPTED'].includes(norm)) {
    colorClass = 'status-critical';
  } else if (['HIGH', 'WARNING', 'CONGESTED', 'INVESTIGATING', 'DEGRADED'].includes(norm)) {
    colorClass = 'status-warning';
  } else if (['MEDIUM', 'MODERATE', 'DISPATCHED'].includes(norm)) {
    colorClass = 'status-medium';
  } else if (['LOW', 'NORMAL', 'RESOLVED', 'ONLINE', 'RESTORED', 'CLEAR'].includes(norm)) {
    colorClass = 'status-normal';
  } else if (['ACTIVE', 'AI_MONITORED', 'OPTIMIZED'].includes(norm)) {
    colorClass = 'status-ai';
  }

  return (
    <span className={`cyber-badge ${colorClass} cyber-badge-${size} ${pulse ? 'badge-pulse' : ''} ${className}`}>
      <span className="cyber-badge-dot" />
      <span className="cyber-badge-text">{status}</span>
    </span>
  );
};

export default StatusBadge;
