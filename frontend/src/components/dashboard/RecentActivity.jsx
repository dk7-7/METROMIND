import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="recent-activity-container">
        <h3>Recent Activity</h3>
        <p>No recent activity recorded.</p>
      </div>
    );
  }

  return (
    <div className="recent-activity-container">
      <h3>Recent Activity</h3>
      <div className="activity-list">
        {activities.map((act, idx) => (
          <div key={idx} className="activity-item">
            <p className="activity-title">{act.title || act.message || 'Activity'}</p>
            {act.time && <span className="activity-time">{act.time}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;