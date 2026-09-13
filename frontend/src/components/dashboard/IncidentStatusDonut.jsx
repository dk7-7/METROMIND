import React from 'react';
import { useNavigate } from 'react-router-dom';
import './IncidentStatusDonut.css';

const IncidentStatusDonut = ({ incidents = [], statusDistribution, loading = false }) => {
  const navigate = useNavigate();

  let distribution = statusDistribution;

  if (!distribution && Array.isArray(incidents)) {
    distribution = incidents.reduce((acc, inc) => {
      const status = inc.status || 'REPORTED';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }

  const entries = Object.entries(distribution || {}).filter(([_, count]) => count > 0);
  const total = entries.reduce((sum, [_, count]) => sum + count, 0);

  const criticalCount = incidents.filter(
    (i) => (i.severity === 'CRITICAL' || i.severity === 'HIGH') && i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;

  const activeCount = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;

  const statusColors = {
    REPORTED: '#38bdf8',
    DISPATCHED: '#00f0ff',
    INVESTIGATING: '#f59e0b',
    RESOLVED: '#22c55e',
    CLOSED: '#64748b',
    CRITICAL: '#ef4444',
  };

  if (loading) {
    return (
      <div className="incident-status-donut incident-operations-card skeleton-chart-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Incident Operations</h3>
        </div>
        <div className="skeleton-donut-placeholder" />
      </div>
    );
  }

  return (
    <div className="incident-status-donut incident-operations-card">
      <div className="card-header-flex">
        <div className="header-title-group">
          <span className="card-header-icon" aria-hidden="true">🚨</span>
          <h3>Incident Operations</h3>
        </div>
        <div className="header-badge-group">
          {criticalCount > 0 ? (
            <span className="telemetry-badge badge-critical-pulse">
              {criticalCount} HIGH PRIORITY
            </span>
          ) : (
            <span className="telemetry-badge nominal-badge">
              {activeCount} ACTIVE
            </span>
          )}
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No active incidents reported.</p>
          <span className="empty-state-sub">City transit channels are operating smoothly.</span>
        </div>
      ) : (
        <div className="donut-body">
          <div className="donut-chart-box">
            <svg viewBox="0 0 100 100" className="donut-svg" aria-hidden="true">
              <defs>
                <linearGradient id="incidentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="38" className="donut-bg-ring" />
              {entries.reduce(
                (acc, [status, count]) => {
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  const circumference = 2 * Math.PI * 38;
                  const strokeLength = (percentage / 100) * circumference;
                  const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
                  const strokeDashoffset = -acc.offset;
                  const color = statusColors[status] || '#38bdf8';

                  acc.elements.push(
                    <circle
                      key={status}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={color}
                      strokeWidth="8.5"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className="donut-segment"
                    />
                  );
                  acc.offset += strokeLength;
                  return acc;
                },
                { elements: [], offset: 0 }
              ).elements}
            </svg>
            <div className="donut-center-info">
              <span className="donut-center-value">{total}</span>
              <span className="donut-center-tag">LOGGED</span>
            </div>
          </div>

          <div className="donut-legend">
            {entries.map(([status, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={status} className="donut-legend-item">
                  <div className="legend-status-wrapper">
                    <span
                      className={`legend-dot dot-${status.toLowerCase()}`}
                      aria-hidden="true"
                    />
                    <span className="legend-status">{status}</span>
                  </div>
                  <div className="legend-value-group">
                    <span className="legend-percent">{pct}%</span>
                    <span className="legend-count">({count})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card-action-footer">
        <div className="card-footer-meta">
          <span className="meta-icon" aria-hidden="true">📍</span>
          <span>Active Response Protocol v4</span>
        </div>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => navigate('/incidents')}
          aria-label="View all incidents"
        >
          <span>View All Incidents</span>
          <span className="action-arrow" aria-hidden="true">➔</span>
        </button>
      </div>
    </div>
  );
};

export default IncidentStatusDonut;