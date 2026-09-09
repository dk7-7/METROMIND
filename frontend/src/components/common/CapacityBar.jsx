import React from 'react';

const CapacityBar = ({ current = 0, total = 0, currentLoad, capacityUnits }) => {
  const cur = typeof currentLoad === 'number' ? currentLoad : Number(current) || 0;
  const tot = typeof capacityUnits === 'number' ? capacityUnits : Number(total) || 0;

  let percentage = 0;
  if (tot > 0) {
    percentage = (cur / tot) * 100;
  }

  // Determine color and status badge based on threshold
  let barColor = '#10b981'; // < 70% (Optimal)
  let statusText = 'NORMAL';
  let badgeBg = '#ecfdf5';
  let badgeText = '#047857';

  if (percentage >= 90) {
    barColor = '#ef4444'; // >= 90% (Critical)
    statusText = 'CRITICAL';
    badgeBg = '#fef2f2';
    badgeText = '#b91c1c';
  } else if (percentage >= 70) {
    barColor = '#f59e0b'; // 70-90% (Elevated)
    statusText = 'ELEVATED';
    badgeBg = '#fffbeb';
    badgeText = '#b45309';
  }

  const clampedWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="capacity-bar-container" style={{ width: '100%', minWidth: '150px' }}>
      <div
        className="capacity-bar-labels"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          marginBottom: '5px',
          color: '#475569',
        }}
      >
        <span style={{ fontWeight: 600, color: '#1e293b' }}>
          {cur.toFixed(1)} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {tot.toFixed(1)}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span
            style={{
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              backgroundColor: badgeBg,
              color: badgeText,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}
          >
            {statusText}
          </span>
          <span style={{ fontWeight: 700, color: barColor, fontVariantNumeric: 'tabular-nums' }}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div
        className="capacity-bar-track"
        style={{
          height: '8px',
          width: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)',
        }}
      >
        <div
          className="capacity-bar-fill"
          data-testid="capacity-bar-fill"
          style={{
            height: '100%',
            width: `${clampedWidth}%`,
            backgroundColor: barColor,
            borderRadius: '9999px',
            transition: 'width 0.4s ease, background-color 0.4s ease',
            boxShadow: `0 0 6px ${barColor}66`,
          }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;