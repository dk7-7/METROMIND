import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div
        className="recent-activity-container"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#1e293b' }}>
          Recent Activity
        </h3>
        <p style={{ color: '#94a3b8', textAlign: 'center', margin: '2rem 0', fontSize: '0.9rem' }}>
          No recent activity recorded.
        </p>
      </div>
    );
  }

  return (
    <div
      className="recent-activity-container"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
      }}
    >
      <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', color: '#1e293b' }}>
        Recent Activity
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activities.map((act, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.625rem 0.75rem',
              borderRadius: '6px',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{act.icon || '📌'}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>
                {act.title || act.message || 'System Event'}
              </p>
              {act.description && (
                <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                  {act.description}
                </p>
              )}
            </div>
            {act.time && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                {act.time}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;