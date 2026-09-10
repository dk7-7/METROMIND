import React from 'react';

const CapacityBar = ({ current = 0, total = 0, currentLoad, capacityUnits }) => {
  const cur = typeof currentLoad === 'number' ? currentLoad : Number(current) || 0;
  const tot = typeof capacityUnits === 'number' ? capacityUnits : Number(total) || 0;

  const percentage = tot > 0 ? (cur / tot) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  let color = '#22c55e';
  if (percentage >= 90) {
    color = '#ef4444';
  } else if (percentage >= 70) {
    color = '#f59e0b';
  }

  return (
    <div className="capacity-bar-container" data-testid="capacity-bar">
      <div className="capacity-bar-info">
        <span className="capacity-bar-text">
          {cur} / {tot} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div
        className="capacity-bar-track"
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          className="capacity-bar-fill"
          data-testid="capacity-bar-fill"
          style={{
            width: `${clampedPercentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;