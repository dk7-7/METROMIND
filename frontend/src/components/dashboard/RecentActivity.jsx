import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div
        className="recent-activity-container card-command"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Recent Activity Feed
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            TIMELINE
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.6 }}>⏱️</div>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>
            No recent activity recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="recent-activity-container card-command"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Recent Activity Feed
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: '#64748b' }}>
            Real-time municipal events and operational updates
          </p>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#10b981',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
          }}
        >
          ● Live Stream
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {activities.map((act, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                flexShrink: 0,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {act.icon || '📌'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {act.title || act.message || 'System Event'}
                </p>
                {act.time && (
                  <span
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 600,
                      color: '#64748b',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {act.time}
                  </span>
                )}
              </div>
              {act.description && (
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.35 }}>
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