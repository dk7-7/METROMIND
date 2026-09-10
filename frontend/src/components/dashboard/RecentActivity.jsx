import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="recent-activity-container">
        <h3>Recent Activity</h3>
        <p className="no-data-text">No recent activity recorded.</p>
      </div>
    );
  }

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
              <p className="activity-title">{act.title || act.message || 'Activity'}</p>
              {act.time && <span className="activity-time">{act.time}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;