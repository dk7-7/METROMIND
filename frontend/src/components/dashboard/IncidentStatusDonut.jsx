import React from 'react';

const IncidentStatusDonut = ({ incidents = [], statusDistribution }) => {
  // Compute distribution from incidents array or use provided distribution
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

  if (total === 0) {
    return (
      <div className="incident-status-donut card-command">
        <div className="card-header-row">
          <h3 className="card-title">
            Incident Status Distribution
          </h3>
          <span className="badge-live">
            LIVE
          </span>
        </div>
        <div className="empty-donut-state">
          <div className="empty-donut-icon">📊</div>
          <p className="empty-donut-text">No incident status data available.</p>
        </div>
      </div>
    );
  }

  // Calculate SVG stroke dashes for donut chart
  let accumulatedPercent = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="incident-status-donut card-command">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">
            Incident Status Distribution
          </h3>
          <p className="card-subtitle">
            Telemetry by resolution workflow stage
          </p>
        </div>
        <span className="badge-active-count">
          {total} Active
        </span>
      </div>

      <div className="donut-content-row">
        <div className="donut-chart-wrapper">
          <svg viewBox="0 0 100 100" width="140" height="140" className="donut-svg">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              className="donut-track"
              strokeWidth="12"
            />
            {entries.map(([status, count]) => {
              const percent = count / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={status}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  className={`donut-segment donut-segment-${status.toLowerCase()}`}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="donut-center-label">
            <span className="donut-center-total">
              {total}
            </span>
            <span className="donut-center-text">
              TOTAL
            </span>
          </div>
        </div>

        <div className="donut-legend-list">
          {entries.map(([status, count]) => {
            const percent = ((count / total) * 100).toFixed(0);
            return (
              <div
                key={status}
                className={`donut-legend-item donut-legend-${status.toLowerCase()}`}
              >
                <div className="legend-name-group">
                  <span className={`legend-dot legend-dot-${status.toLowerCase()}`} />
                  <span className="legend-status-name">{status}</span>
                </div>
                <div className="legend-values-group">
                  <span className="legend-count">{count}</span>
                  <span className="legend-percent">
                    {percent}%
                  </span>
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