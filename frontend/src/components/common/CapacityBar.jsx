import React from 'react';

const CapacityBar = ({ current = 0, total = 0, currentLoad, capacityUnits }) => {
  const cur = typeof currentLoad === 'number' ? currentLoad : Number(current) || 0;
  const tot = typeof capacityUnits === 'number' ? capacityUnits : Number(total) || 0;

  let percentage = 0;
  if (tot > 0) {
    percentage = (cur / tot) * 100;
  }

  // Determine color based on threshold
  let barColor = '#22c55e'; // < 70%
  if (percentage >= 90) {
    barColor = '#ef4444'; // >= 90%
  } else if (percentage >= 70) {
    barColor = '#f59e0b'; // 70-90%
  }

  const clampedWidth = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="capacity-bar-container" style={{ width: '100%', minWidth: '120px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          marginBottom: '4px',
          color: '#64748b',
        }}
      >
        <span>{cur.toFixed(1)} / {tot.toFixed(1)}</span>
        <span style={{ fontWeight: 600, color: barColor }}>{percentage.toFixed(1)}%</span>
      </div>
      <div
        className="capacity-bar-track"
        style={{
          height: '10px',
          width: '100%',
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          overflow: 'hidden',
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
            transition: 'width 0.3s ease, background-color 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;