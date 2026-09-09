import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="recent-activity-container card-command">
        <div className="card-header-row">
          <h3 className="card-title">
            Recent Activity Feed
          </h3>
          <span className="badge-timeline">
            TIMELINE
          </span>
        </div>
        <div className="empty-activity-state">
          <div className="empty-activity-icon">⏱️</div>
          <p className="empty-activity-text">
            No recent activity recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity-container card-command">
      <div className="card-header-row">
        <div>
          <h3 className="card-title">
            Recent Activity Feed
          </h3>
          <p className="card-subtitle">
            Real-time municipal events and operational updates
          </p>
        </div>
        <span className="badge-live-stream">
          ● Live Stream
        </span>
      </div>

      <div className="activity-list">
        {activities.map((act, idx) => (
          <div
            key={idx}
            className="activity-item"
          >
            <div className="activity-icon-box">
              {act.icon || '📌'}
            </div>
            <div className="activity-details">
              <div className="activity-title-row">
                <p className="activity-title">
                  {act.title || act.message || 'System Event'}
                </p>
                {act.time && (
                  <span className="activity-time">
                    {act.time}
                  </span>
                )}
              </div>
              {act.description && (
                <p className="activity-description">
                  {act.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;