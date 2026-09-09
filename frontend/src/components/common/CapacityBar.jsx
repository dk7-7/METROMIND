import React from 'react';

const CapacityBar = ({ current = 0, total = 0, currentLoad, capacityUnits }) => {
  const cur = typeof currentLoad === 'number' ? currentLoad : Number(current) || 0;
  const tot = typeof capacityUnits === 'number' ? capacityUnits : Number(total) || 0;

  let percentage = 0;
  if (tot > 0) {
    percentage = (cur / tot) * 100;
  }

  // Determine color and status badge based on threshold
  let barColor = 'var(--status-success-solid, #10b981)'; // < 70% (Optimal)
  let statusText = 'NORMAL';
  let badgeBg = 'var(--status-success-bg, #ecfdf5)';
  let badgeText = 'var(--status-success-text, #047857)';
  let badgeBorder = 'var(--status-success-border, #a7f3d0)';

  if (percentage >= 90) {
    barColor = 'var(--status-critical-solid, #ef4444)'; // >= 90% (Critical)
    statusText = 'CRITICAL';
    badgeBg = 'var(--status-critical-bg, #fef2f2)';
    badgeText = 'var(--status-critical-text, #b91c1c)';
    badgeBorder = 'var(--status-critical-border, #fecaca)';
  } else if (percentage >= 70) {
    barColor = 'var(--status-warning-solid, #f59e0b)'; // 70-90% (Elevated)
    statusText = 'ELEVATED';
    badgeBg = 'var(--status-warning-bg, #fffbeb)';
    badgeText = 'var(--status-warning-text, #b45309)';
    badgeBorder = 'var(--status-warning-border, #fde68a)';
  }

  const clampedWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="capacity-bar-container" style={{ width: '100%', maxWidth: '280px', textAlign: 'left' }}>
      <div
        className="capacity-bar-labels"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8125rem',
          marginBottom: '6px',
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
          {cur.toFixed(1)} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {tot.toFixed(1)}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              backgroundColor: badgeBg,
              color: badgeText,
              border: `1px solid ${badgeBorder}`,
              fontSize: '0.675rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            {statusText}
          </span>
          <span style={{ fontWeight: 700, color: barColor, fontVariantNumeric: 'tabular-nums', fontSize: '0.775rem' }}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div
        className="capacity-bar-track"
        style={{
          height: '8px',
          width: '100%',
          backgroundColor: 'var(--bg-muted, #e2e8f0)',
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