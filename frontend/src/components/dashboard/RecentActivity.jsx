import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecentActivity = ({ activities = [], incidents = [], loading = false }) => {
  const navigate = useNavigate();

  // If incidents are passed directly, synthesize structured activity list
  let activityItems = activities;
  if ((!activityItems || activityItems.length === 0) && Array.isArray(incidents) && incidents.length > 0) {
    activityItems = incidents.slice(0, 5).map((i) => ({
      title: i.title || 'Traffic Incident',
      sector: i.zoneName || (i.zoneId ? `Zone ${i.zoneId}` : 'Sector 7'),
      time: i.reportedAt ? new Date(i.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
      status: i.status || 'REPORTED',
      severity: i.severity || 'MEDIUM',
      type: i.incidentType || 'INCIDENT',
    }));
  }

  const getActivityIcon = (type = '', title = '') => {
    const t = `${type} ${title}`.toLowerCase();
    if (t.includes('accident') || t.includes('collision')) return '💥';
    if (t.includes('road') || t.includes('traffic') || t.includes('congestion')) return '🚦';
    if (t.includes('outage') || t.includes('power')) return '⚡';
    if (t.includes('hazard') || t.includes('critical')) return '⚠️';
    if (t.includes('observation')) return '👁️';
    return '🚨';
  };

  const getStatusClass = (status = '') => {
    const s = status.toUpperCase();
    if (s === 'RESOLVED' || s === 'CLOSED') return 'badge-nominal';
    if (s === 'INVESTIGATING' || s === 'DISPATCHED') return 'badge-cyan';
    if (s === 'CRITICAL' || s === 'HIGH') return 'badge-critical';
    return 'badge-warning';
  };

  if (loading) {
    return (
      <div className="recent-activity-container skeleton-activity-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Recent Incident Activity</h3>
          <span className="live-feed-badge">
            <span className="live-dot" aria-hidden="true" />
            LIVE FEED
          </span>
        </div>
        <div className="skeleton-timeline">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="skeleton-timeline-row">
              <div className="skeleton-node" />
              <div className="skeleton-body" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity-container">
      <div className="card-header-flex">
        <div className="header-title-group">
          <span className="card-header-icon" aria-hidden="true">⏱️</span>
          <h3>Recent Incident Activity</h3>
        </div>
        <span className="live-feed-badge">
          <span className="live-dot" aria-hidden="true" />
          LIVE STREAM
        </span>
      </div>

      {(!activityItems || activityItems.length === 0) ? (
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No recent incident activity recorded.</p>
          <span className="empty-state-sub">Municipal response units are on standby.</span>
        </div>
      ) : (
        <div className="activity-timeline-feed">
          {activityItems.slice(0, 5).map((act, idx) => {
            const title = act.title || act.message || 'Incident Logged';
            const sector = act.sector || act.location || 'Sector 7';
            const time = act.time || '10:10 PM';
            const status = act.status || 'ACTIVE';
            const icon = getActivityIcon(act.type, title);

            return (
              <div
                key={idx}
                className="activity-timeline-item"
                onClick={() => navigate('/incidents')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/incidents');
                  }
                }}
              >
                <div className="timeline-rail" aria-hidden="true">
                  <div className="timeline-node-dot">
                    <span className="node-inner" />
                  </div>
                  {idx < Math.min(activityItems.length, 5) - 1 && <div className="timeline-segment-line" />}
                </div>

                <div className="timeline-content-card">
                  <div className="timeline-card-header">
                    <div className="event-icon-title">
                      <span className="event-symbol" aria-hidden="true">{icon}</span>
                      <span className="event-title">{title}</span>
                    </div>
                    <span className={`timeline-status-pill ${getStatusClass(status)}`}>
                      {status}
                    </span>
                  </div>

                  <div className="timeline-card-meta">
                    <span className="meta-sector-tag">📍 {sector}</span>
                    <span className="meta-dot-sep">•</span>
                    <span className="meta-timestamp">🕒 {time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card-action-footer">
        <div className="card-footer-meta">
          <span className="meta-icon" aria-hidden="true">📡</span>
          <span>Automatic 30s Poll</span>
        </div>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => navigate('/incidents')}
          aria-label="View all activity"
        >
          <span>View All Activity</span>
          <span className="action-arrow" aria-hidden="true">➔</span>
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;