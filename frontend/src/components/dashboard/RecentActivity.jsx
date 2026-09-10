import React from 'react';

const RecentActivity = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <div className="recent-activity-container skeleton-activity-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Recent Activity</h3>
          <span className="live-feed-badge">
            <span className="live-dot" aria-hidden="true" />
            LIVE FEED
          </span>
        </div>
        <div className="skeleton-timeline">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton-timeline-row">
              <div className="skeleton-node" />
              <div className="skeleton-body" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="recent-activity-container">
        <div className="card-header-flex">
          <h3>Recent Activity</h3>
          <span className="live-feed-badge nominal-badge">
            <span className="live-dot" aria-hidden="true" />
            LIVE FEED
          </span>
        </div>
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No recent activity recorded.</p>
          <span className="empty-state-sub">City infrastructure is operating normally.</span>
        </div>
      </div>
    );
  }

  const getActivityIcon = (title = '') => {
    const t = title.toLowerCase();
    if (t.includes('incident')) return '🚨';
    if (t.includes('outage')) return '⚡';
    if (t.includes('grid')) return '🔌';
    if (t.includes('alert')) return '⚠️';
    if (t.includes('zone') || t.includes('traffic')) return '🚦';
    return '📋';
  };

  return (
    <div className="recent-activity-container">
      <div className="card-header-flex">
        <h3>Recent Activity</h3>
        <span className="live-feed-badge">
          <span className="live-dot" aria-hidden="true" />
          LIVE FEED
        </span>
      </div>

      <div className="activity-list activity-timeline">
        {activities.map((act, idx) => (
          <div key={idx} className="activity-item timeline-node">
            <div className="timeline-marker" aria-hidden="true">
              <span className="timeline-dot" />
              {idx < activities.length - 1 && <span className="timeline-line" />}
            </div>
            <div className="timeline-body">
              <div className="timeline-content-left">
                <span className="timeline-event-icon" aria-hidden="true">
                  {getActivityIcon(act.title || act.message)}
                </span>
                <p className="activity-title">{act.title || act.message || 'Activity'}</p>
              </div>
              {act.time && <span className="activity-time">{act.time}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;