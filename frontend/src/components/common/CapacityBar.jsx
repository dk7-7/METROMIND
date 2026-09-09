import React from 'react';

const CapacityBar = ({ current = 0, total = 0, currentLoad, capacityUnits }) => {
  const cur = typeof currentLoad === 'number' ? currentLoad : Number(current) || 0;
  const tot = typeof capacityUnits === 'number' ? capacityUnits : Number(total) || 0;

  let percentage = 0;
  if (tot > 0) {
    percentage = (cur / tot) * 100;
  }

  let statusClass = 'status-normal';
  let statusText = 'NORMAL';

  if (percentage >= 90) {
    statusClass = 'status-critical';
    statusText = 'CRITICAL';
  } else if (percentage >= 70) {
    statusClass = 'status-elevated';
    statusText = 'ELEVATED';
  }

  return (
    <div className={`capacity-bar-container ${statusClass}`}>
      <div className="capacity-bar-labels">
        <span className="capacity-bar-values">
          {cur.toFixed(1)} <span className="capacity-bar-total">/ {tot.toFixed(1)}</span>
        </span>
        <div className="capacity-bar-status-wrapper">
          <span className="capacity-bar-badge">
            {statusText}
          </span>
          <span className="capacity-bar-percent">
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="capacity-bar-track">
        <div
          className="capacity-bar-fill"
          data-testid="capacity-bar-fill"
        />
      </div>
    </div>
  );
};

export default CapacityBar;