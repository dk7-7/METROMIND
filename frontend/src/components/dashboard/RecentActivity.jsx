import React from 'react';

const RecentActivity = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div
        className="recent-activity-container card-command"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recent Activity Feed
          </h3>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
            TIMELINE
          </span>
        </div>
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.6 }}>⏱️</div>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>
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
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '12px',
        padding: '1.5rem',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recent Activity Feed
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Real-time municipal events and operational updates
          </p>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--success-text)',
            backgroundColor: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
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
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
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
                    color: 'var(--text-main)',
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
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
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
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
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