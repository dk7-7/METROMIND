import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className={`skeleton-grid ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="skeleton-card glass-panel shimmer">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-value" />
            <div className="skeleton-line skeleton-subtitle" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`skeleton-table-container glass-panel ${className}`}>
        <div className="skeleton-table-header shimmer">
          <div className="skeleton-line skeleton-col" />
          <div className="skeleton-line skeleton-col" />
          <div className="skeleton-line skeleton-col" />
          <div className="skeleton-line skeleton-col" />
        </div>
        {items.map((_, i) => (
          <div key={i} className="skeleton-table-row shimmer">
            <div className="skeleton-line skeleton-col-sm" />
            <div className="skeleton-line skeleton-col-lg" />
            <div className="skeleton-line skeleton-col-md" />
            <div className="skeleton-line skeleton-col-sm" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'cctv') {
    return (
      <div className={`skeleton-cctv-grid ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="skeleton-cctv-box glass-panel shimmer">
            <div className="skeleton-cctv-screen" />
            <div className="skeleton-cctv-footer">
              <div className="skeleton-line skeleton-text-short" />
              <div className="skeleton-badge-sm" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={`skeleton-chart glass-panel shimmer ${className}`}>
        <div className="skeleton-chart-header">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-subtitle" />
        </div>
        <div className="skeleton-chart-body" />
      </div>
    );
  }

  return (
    <div className={`skeleton shimmer ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="skeleton-line" />
      ))}
    </div>
  );
};

export default SkeletonLoader;
