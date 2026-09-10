import React from 'react';

const IncidentStatusDonut = ({ incidents = [], statusDistribution, loading = false }) => {
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

  if (loading) {
    return (
      <div className="incident-status-donut skeleton-chart-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Incident Status Distribution</h3>
        </div>
        <div className="skeleton-donut-placeholder" />
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="incident-status-donut">
        <div className="card-header-flex">
          <h3>Incident Status Distribution</h3>
          <span className="telemetry-badge nominal-badge">0 ACTIVE</span>
        </div>
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No incident status data available.</p>
        </div>
      </div>
    );
  }

  const statusColors = {
    REPORTED: '#38bdf8',
    DISPATCHED: '#00f0ff',
    INVESTIGATING: '#f59e0b',
    RESOLVED: '#22c55e',
    CLOSED: '#64748b',
    CRITICAL: '#ef4444',
  };

  return (
    <div className="incident-status-donut">
      <div className="card-header-flex">
        <h3>Incident Status Distribution</h3>
        <span className="telemetry-badge">{total} LOGGED</span>
      </div>

      <div className="donut-body">
        <div className="donut-chart-box">
          <svg viewBox="0 0 100 100" className="donut-svg" aria-hidden="true">
            <defs>
              <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
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
            <span className="donut-center-tag">ACTIVE</span>
          </div>
        </div>

        <div className="donut-legend">
          {entries.map(([status, count]) => {
            const color = statusColors[status] || '#38bdf8';
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <div key={status} className="donut-legend-item">
                <div className="legend-status-wrapper">
                  <span className="legend-dot" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} aria-hidden="true" />
                  <span className="legend-status">{status}: </span>
                </div>
                <div className="legend-value-group">
                  <span className="legend-percent">{pct}%</span>
                  <span className="legend-count">{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IncidentStatusDonut;