import React from 'react';

const IncidentStatusDonut = ({ incidents = [], statusDistribution }) => {
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
      <div className="incident-status-donut">
        <h3>Incident Status Distribution</h3>
        <p>No incident status data available.</p>
      </div>
    );
  }

  return (
    <div className="incident-status-donut">
      <h3>Incident Status Distribution</h3>
      <div className="donut-legend">
        {entries.map(([status, count]) => (
          <div key={status} className="donut-legend-item">
            <span className="legend-status">{status}: </span>
            <span className="legend-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncidentStatusDonut;