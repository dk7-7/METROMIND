import React from 'react';

const STATUS_COLORS = {
  REPORTED: '#3b82f6',
  DISPATCHED: '#f59e0b',
  INVESTIGATING: '#8b5cf6',
  RESOLVED: '#10b981',
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
        className="incident-status-donut card-command"
        style={{
          borderRadius: '16px',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 750, color: 'var(--text-main)' }}>
            Incident Status Distribution
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
            LIVE
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.6 }}>📊</div>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>No incident status data available.</p>
        </div>
      </div>
    );
  }

  // Calculate SVG stroke dashes for donut chart
  let accumulatedPercent = 0;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="incident-status-donut card-command"
      style={{
        borderRadius: '16px',
        padding: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 750, color: 'var(--text-main)' }}>
            Incident Status Distribution
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Telemetry by resolution workflow stage
          </p>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--brand-primary)',
            backgroundColor: 'var(--primary-50, rgba(37, 99, 235, 0.12))',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5)',
          }}
        >
          {total} Active
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1.5rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke="var(--bg-subtle)"
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
                  stroke={STATUS_COLORS[status] || '#94a3b8'}
                  strokeWidth="12"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
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
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1, display: 'block', fontVariantNumeric: 'tabular-nums' }}>
              {total}
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em', marginTop: '2px' }}>
              TOTAL
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1, minWidth: '160px' }}>
          {entries.map(([status, count]) => {
            const percent = ((count / total) * 100).toFixed(0);
            return (
              <div
                key={status}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.825rem',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.5)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: STATUS_COLORS[status] || '#94a3b8',
                      boxShadow: `0 0 6px ${STATUS_COLORS[status] || '#94a3b8'}`,
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{status}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', width: '32px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
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