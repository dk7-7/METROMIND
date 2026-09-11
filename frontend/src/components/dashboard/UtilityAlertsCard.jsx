import React from 'react';
import { useNavigate } from 'react-router-dom';

const UtilityAlertsCard = ({ outages = [], alerts = [], grids = [], loading = false }) => {
  const navigate = useNavigate();

  // Combine outages, alerts, and maintenance items
  const utilityItems = [];

  // Outages
  outages.forEach((outage) => {
    utilityItems.push({
      id: `outage-${outage.outageId || outage.id || Math.random()}`,
      category: outage.outageType || 'Power Grid',
      area: outage.affectedArea || 'Sector 7',
      status: outage.status === 'RESTORED' ? 'Restored' : outage.severity === 'CRITICAL' ? 'Critical Alert' : 'Active Outage',
      priority: outage.severity || 'HIGH',
      time: outage.startTime ? new Date(outage.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:49 PM',
      type: 'outage',
      icon: '⚡',
    });
  });

  // Alerts related to utility or infrastructure
  alerts.forEach((alert) => {
    if (!utilityItems.some((u) => u.id === alert.alertId)) {
      utilityItems.push({
        id: `alert-${alert.alertId || alert.id || Math.random()}`,
        category: alert.alertType || 'Infrastructure Warning',
        area: alert.targetAudience || 'Zone 3',
        status: alert.severity === 'CRITICAL' ? 'Emergency' : 'Scheduled Maintenance',
        priority: alert.severity || 'MEDIUM',
        time: alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:15 PM',
        type: 'alert',
        icon: '⚠️',
      });
    }
  });

  // If no items in store yet, provide initial baseline telemetry events
  if (utilityItems.length === 0) {
    utilityItems.push(
      {
        id: 'mock-1',
        category: 'Power Grid Substation 4',
        area: 'Sector 7',
        status: 'Warning',
        priority: 'MEDIUM',
        time: '10:49 PM',
        type: 'outage',
        icon: '⚡',
      },
      {
        id: 'mock-2',
        category: 'Water Supply Mainline',
        area: 'Zone 3',
        status: 'Scheduled Maintenance',
        priority: 'LOW',
        time: '09:30 PM',
        type: 'maintenance',
        icon: '💧',
      },
      {
        id: 'mock-3',
        category: 'Smart Street Lighting Mesh',
        area: 'Zone 5',
        status: 'Operational',
        priority: 'NOMINAL',
        time: '08:15 PM',
        type: 'nominal',
        icon: '💡',
      }
    );
  }

  const getPriorityBadgeClass = (priority = '', status = '') => {
    const p = `${priority} ${status}`.toUpperCase();
    if (p.includes('CRITICAL') || p.includes('EMERGENCY')) return 'badge-critical';
    if (p.includes('WARNING') || p.includes('HIGH')) return 'badge-warning';
    if (p.includes('MAINTENANCE') || p.includes('MEDIUM')) return 'badge-maintenance';
    return 'badge-nominal';
  };

  if (loading) {
    return (
      <div className="utility-alerts-card skeleton-chart-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Utility Alerts & Maintenance</h3>
        </div>
        <div className="skeleton-line" style={{ height: '180px' }} />
      </div>
    );
  }

  return (
    <div className="utility-alerts-card">
      <div className="card-header-flex">
        <div className="header-title-group">
          <span className="card-header-icon" aria-hidden="true">🛠️</span>
          <h3>Utility Alerts & Maintenance</h3>
        </div>
        <span className="telemetry-badge">
          {utilityItems.length} NOTIFICATIONS
        </span>
      </div>

      <div className="utility-alerts-list">
        {utilityItems.slice(0, 4).map((item) => {
          const badgeClass = getPriorityBadgeClass(item.priority, item.status);

          return (
            <div
              key={item.id}
              className="utility-alert-row"
              onClick={() => navigate('/outages')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/outages');
                }
              }}
            >
              <div className="alert-row-left">
                <span className="alert-icon-wrap" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="alert-text-block">
                  <div className="alert-category-title">
                    <span className="alert-cat-name">{item.category}</span>
                    <span className="alert-sep">•</span>
                    <span className="alert-area">{item.area}</span>
                  </div>
                  <div className="alert-meta-time">
                    <span>Logged at {item.time}</span>
                  </div>
                </div>
              </div>

              <div className="alert-row-right">
                <span className={`utility-status-pill ${badgeClass}`}>
                  {item.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-action-footer">
        <div className="card-footer-meta">
          <span className="meta-icon" aria-hidden="true">🛡️</span>
          <span>Municipal Service Feed</span>
        </div>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => navigate('/outages')}
          aria-label="View all utility alerts"
        >
          <span>View Outages & Alerts</span>
          <span className="action-arrow" aria-hidden="true">➔</span>
        </button>
      </div>
    </div>
  );
};

export default UtilityAlertsCard;
