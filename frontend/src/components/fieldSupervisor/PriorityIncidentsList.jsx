import React from 'react';

const PriorityIncidentsList = ({
  incidents = [],
  loading = false,
  onSelectIncident,
  onOpenEscalation,
  onDispatchTech,
}) => {
  // Filter for high/critical incidents or active ones needing immediate action
  const priorityItems = incidents.filter(
    (i) =>
      i.severity === 'CRITICAL' ||
      i.severity === 'HIGH' ||
      i.status === 'REPORTED' ||
      i.status === 'DISPATCHED'
  ).slice(0, 4);

  if (loading && priorityItems.length === 0) {
    return (
      <div className="fs-priority-section skeleton-loading">
        <div className="fs-section-header">
          <h3 className="fs-section-title">Priority Field Incidents & Immediate Actions</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fs-priority-section">
      <div className="fs-section-header">
        <div className="fs-section-title-wrap">
          <span className="fs-live-indicator-dot" aria-hidden="true" />
          <h3 className="fs-section-title">Priority Field Incidents & Urgent Actions</h3>
        </div>
        <span className="fs-priority-badge">{priorityItems.length} Urgent Operations</span>
      </div>

      {priorityItems.length === 0 ? (
        <div className="fs-empty-card">
          <span className="fs-empty-icon">🛡️</span>
          <p>No critical incidents currently pending in your sector.</p>
        </div>
      ) : (
        <div className="fs-priority-grid">
          {priorityItems.map((item) => {
            const id = item.incidentId || item.id;
            const zoneLabel =
              item.zone?.zoneName ||
              item.zoneName ||
              (item.zoneId ? `Zone ${item.zoneId}` : 'Sector Alpha');
            const isCritical = item.severity === 'CRITICAL';

            return (
              <div
                key={id}
                className={`fs-priority-card ${isCritical ? 'priority-card-critical' : 'priority-card-high'}`}
              >
                <div className="fs-card-top-row">
                  <div className="fs-card-badge-group">
                    <span className="fs-card-id">#{id}</span>
                    <span className={`fs-severity-tag fs-severity-${(item.severity || 'medium').toLowerCase()}`}>
                      {item.severity || 'MEDIUM'}
                    </span>
                    <span className={`fs-status-pill fs-status-${(item.status || 'reported').toLowerCase()}`}>
                      {item.status || 'REPORTED'}
                    </span>
                  </div>
                  <span className="fs-timer-badge">⏱️ SLA Active</span>
                </div>

                <h4 className="fs-card-title">{item.title}</h4>

                <div className="fs-card-meta-list">
                  <div className="fs-card-meta-item">
                    <span className="fs-meta-icon">📍</span>
                    <span>{zoneLabel}</span>
                  </div>
                  <div className="fs-card-meta-item">
                    <span className="fs-meta-icon">👷</span>
                    <span>{item.assignedTech || 'Tech Team Alpha (Alex Carter)'}</span>
                  </div>
                </div>

                <div className="fs-card-actions">
                  <button
                    type="button"
                    className="btn-primary fs-btn-sm"
                    onClick={() => onSelectIncident(item)}
                  >
                    View Timeline & Actions
                  </button>
                  <button
                    type="button"
                    className="btn-danger-outline fs-btn-sm"
                    onClick={() => onOpenEscalation(item)}
                  >
                    Escalate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PriorityIncidentsList;
