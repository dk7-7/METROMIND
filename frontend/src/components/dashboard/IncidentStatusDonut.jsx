import React from 'react';

const STATUS_COLORS = {
  REPORTED: '#3b82f6',
  DISPATCHED: '#eab308',
  INVESTIGATING: '#8b5cf6',
  RESOLVED: '#22c55e',
  CLOSED: '#64748b',
};

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
      <div
        className="incident-status-donut"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b' }}>
          Incident Status Distribution
        </h3>
        <p style={{ color: '#94a3b8', margin: '2rem 0' }}>No incident status data available.</p>
      </div>
    );
  }

  // Calculate SVG stroke dashes for donut chart
  let accumulatedPercent = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="incident-status-donut"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
      }}
    >
      <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: '#1e293b' }}>
        Incident Status Distribution
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '130px', height: '130px' }}>
          <svg viewBox="0 0 100 100" width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="14"
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
                  stroke={STATUS_COLORS[status] || '#94a3b8'}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{total}</span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: '#64748b' }}>TOTAL</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '140px' }}>
          {entries.map(([status, count]) => (
            <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: STATUS_COLORS[status] || '#94a3b8',
                  }}
                />
                <span style={{ color: '#475569' }}>{status}</span>
              </div>
              <span style={{ fontWeight: 600, color: '#1e293b' }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentStatusDonut;