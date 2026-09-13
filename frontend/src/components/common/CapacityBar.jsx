import React from 'react';
import './CapacityBar.css';

const CapacityBar = ({ current = 0, total = 0, currentLoad, capacityUnits }) => {
  const cur = typeof currentLoad === 'number' ? currentLoad : Number(current) || 0;
  const tot = typeof capacityUnits === 'number' ? capacityUnits : Number(total) || 0;

  const percentage = tot > 0 ? (cur / tot) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  let colorClass = 'fill-green';
  if (percentage >= 90) {
    colorClass = 'fill-red';
  } else if (percentage >= 70) {
    colorClass = 'fill-amber';
  }

  return (
    <div className="capacity-bar-container" data-testid="capacity-bar">
      <div className="capacity-bar-info">
        <span className="capacity-bar-text">
          {cur} / {tot} ({percentage.toFixed(1)}%)
        </span>
      </div>
      <div className="capacity-bar-track">
        <div
          className={`capacity-bar-fill ${colorClass}`}
          data-testid="capacity-bar-fill"
          style={{ '--capacity-pct': `${clampedPercentage}%`, width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default CapacityBar;