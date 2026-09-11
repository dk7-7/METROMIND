import React from 'react';
import { useNavigate } from 'react-router-dom';

const UtilityAlertsCard = ({ outages = [], alerts = [], grids = [], loading = false }) => {
  const navigate = useNavigate();

  // Combine actual real outages and alerts from Redux store
  const utilityItems = [];

  // Real Outages
  outages.forEach((outage) => {
    const isRestored = outage.status === 'RESTORED';
    utilityItems.push({
      id: `outage-${outage.outageId || outage.id}`,
      category: outage.outageType ? `${outage.outageType} Outage` : 'Utility Outage',
      area: outage.affectedArea || (outage.gridId ? `Grid #${outage.gridId}` : 'Municipal Area'),
      status: isRestored ? 'Restored' : outage.severity === 'CRITICAL' ? 'Critical Alert' : 'Active Outage',
      priority: outage.severity || 'HIGH',
      time: outage.startTime ? new Date(outage.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (outage.createdAt ? new Date(outage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged'),
      type: 'outage',
      icon: '⚡',
      link: '/outages',
    });
  });

  // Real Alerts (Filter for infrastructure / utility alerts or general notifications)
  alerts.forEach((alert) => {
    if (!utilityItems.some((u) => u.id === `alert-${alert.alertId || alert.id}`)) {
      utilityItems.push({
        id: `alert-${alert.alertId || alert.id}`,
        category: alert.alertType || 'System Alert',
        area: alert.targetAudience || 'Municipal Network',
        status: alert.severity === 'CRITICAL' ? 'Emergency' : alert.severity === 'HIGH' ? 'High Priority' : 'Notification',
        priority: alert.severity || 'MEDIUM',
        time: alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Logged',
        type: 'alert',
        icon: alert.severity === 'CRITICAL' ? '🚨' : '⚠️',
        link: '/alerts',
      });
    }
  });

  const getPriorityBadgeClass = (priority = '', status = '') => {
    const p = `${priority} ${status}`.toUpperCase();
    if (p.includes('CRITICAL') || p.includes('EMERGENCY')) return 'badge-critical';
    if (p.includes('WARNING') || p.includes('HIGH') || p.includes('ACTIVE OUTAGE')) return 'badge-warning';
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

      {utilityItems.length === 0 ? (
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No active utility alerts or outages.</p>
          <span className="empty-state-sub">Municipal power, water, and utility infrastructure networks are operational.</span>
        </div>
      ) : (
        <div className="utility-alerts-list">
          {utilityItems.slice(0, 5).map((item) => {
            const badgeClass = getPriorityBadgeClass(item.priority, item.status);

            return (
              <div
                key={item.id}
                className="utility-alert-row"
                onClick={() => navigate(item.link || '/outages')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(item.link || '/outages');
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
                      <span>{item.time}</span>
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
      )}

      <div className="card-action-footer">
        <div className="card-footer-meta">
          <span className="meta-icon" aria-hidden="true">🛡️</span>
          <span>{outages.filter(o => o.status !== 'RESTORED').length} Active Outages • {alerts.filter(a => !a.isRead).length} Unread</span>
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
