import React from "react";

const getColor = (percentage) => {
  if (percentage >= 90) return "#ef4444";
  if (percentage >= 70) return "#f59e0b";
  return "#22c55e";
};

const CapacityBar = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <div className="capacity-bar-track" data-testid="capacity-bar">
      <div
        className="capacity-bar-fill"
        style={{
          width: `${clamped}%`,
          backgroundColor: getColor(percentage),
        }}
      />
    </div>
  );
};

export default CapacityBar;
