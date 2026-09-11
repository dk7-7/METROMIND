import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { update as updateIncident } from '../../store/slices/trafficIncidentSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const IncidentDetailDrawer = ({
  incident,
  onClose,
  onOpenEscalation,
  onStatusUpdated,
}) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(incident?.status || 'REPORTED');
  const [assignedTech, setAssignedTech] = useState(
    incident?.assignedTech || 'Tech Team Alpha (Alex Carter)'
  );
  const [supervisorNote, setSupervisorNote] = useState('');
  const [notesList, setNotesList] = useState([
    {
      id: 1,
      author: 'Field Ops Lead (Marcus Vance)',
      time: '15 mins ago',
      text: 'Dispatched secondary rapid containment unit to clear obstruction.',
    },
    {
      id: 2,
      author: 'Sensor Telemetry',
      time: '32 mins ago',
      text: 'Acoustic anomaly detected exceeding 82 dB threshold.',
    },
  ]);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!incident) return null;

  const incidentId = incident.incidentId || incident.id;
  const zoneLabel =
    incident.zone?.zoneName ||
    incident.zoneName ||
    (incident.zoneId ? `Zone ${incident.zoneId}` : 'Downtown Core Sector 4');

  // 5-Stage Lifecycle stages
  const stages = [
    { key: 'REPORTED', label: 'Reported', icon: '📝' },
    { key: 'DISPATCHED', label: 'Dispatched', icon: '🚚' },
    { key: 'INVESTIGATING', label: 'On-Site Inspection', icon: '🔍' },
    { key: 'IN_PROGRESS', label: 'Work In Progress', icon: '⚡' },
    { key: 'RESOLVED', label: 'Verified & Resolved', icon: '✅' },
  ];

  const getStageIndex = (status) => {
    switch (status) {
      case 'REPORTED':
        return 0;
      case 'DISPATCHED':
        return 1;
      case 'INVESTIGATING':
        return 2;
      case 'IN_PROGRESS':
        return 3;
      case 'RESOLVED':
      case 'CLOSED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStageIdx = getStageIndex(incident.status);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!supervisorNote.trim()) return;
    const newNote = {
      id: Date.now(),
      author: 'Field Supervisor (You)',
      time: 'Just now',
      text: supervisorNote.trim(),
    };
    setNotesList([newNote, ...notesList]);
    setSupervisorNote('');
    dispatch(
      addNotification({
        message: `Field note added to Incident #${incidentId}`,
        type: 'info',
      })
    );
  };

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const updatedData = {
        ...incident,
        status: selectedStatus,
        assignedTech: assignedTech,
      };

      const result = await dispatch(
        updateIncident({ id: incidentId, data: updatedData })
      );

      if (updateIncident.fulfilled.match(result)) {
        dispatch(
          addNotification({
            message: `Incident #${incidentId} status transitioned to ${selectedStatus}`,
            type: 'success',
          })
        );
        if (onStatusUpdated) onStatusUpdated(updatedData);
      }
    } catch (err) {
      // handled
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fs-drawer-overlay" onClick={onClose}>
      <div
        className="fs-drawer-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fs-drawer-title"
      >
        {/* Header */}
        <div className="fs-drawer-header">
          <div className="fs-drawer-title-group">
            <div className="fs-drawer-badge-row">
              <span className="fs-drawer-id">INCIDENT #{incidentId}</span>
              <span className={`fs-severity-badge fs-severity-${(incident.severity || 'medium').toLowerCase()}`}>
                {incident.severity || 'MEDIUM'}
              </span>
              <span className={`fs-status-pill fs-status-${(incident.status || 'reported').toLowerCase()}`}>
                {incident.status || 'REPORTED'}
              </span>
            </div>
            <h2 id="fs-drawer-title" className="fs-drawer-title">{incident.title}</h2>
          </div>
          <button
            type="button"
            className="fs-drawer-close"
            onClick={onClose}
            aria-label="Close Incident Details"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="fs-drawer-body">
          {/* Section 1: Lifecycle Progress Tracker */}
          <div className="fs-drawer-card">
            <h4 className="fs-drawer-card-title">Operational Lifecycle Progress</h4>
            <div className="fs-lifecycle-stepper">
              {stages.map((st, idx) => {
                const isPassed = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                return (
                  <div
                    key={st.key}
                    className={`fs-lifecycle-step ${isPassed ? 'step-passed' : ''} ${isCurrent ? 'step-current' : ''}`}
                  >
                    <div className="fs-step-indicator">
                      <span className="fs-step-icon">{st.icon}</span>
                      <span className="fs-step-num">{idx + 1}</span>
                    </div>
                    <span className="fs-step-label">{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Metadata Grid */}
          <div className="fs-drawer-card fs-metadata-grid">
            <div className="fs-meta-item">
              <span className="fs-meta-label">Location / Traffic Zone</span>
              <span className="fs-meta-val">{zoneLabel}</span>
            </div>
            <div className="fs-meta-item">
              <span className="fs-meta-label">Severity Level</span>
              <span className="fs-meta-val">{incident.severity || 'MEDIUM'}</span>
            </div>
            <div className="fs-meta-item">
              <span className="fs-meta-label">GPS Coordinates</span>
              <span className="fs-meta-val">
                {incident.latitude && incident.longitude
                  ? `${incident.latitude}, ${incident.longitude}`
                  : '40.7128° N, 74.0060° W'}
              </span>
            </div>
            <div className="fs-meta-item">
              <span className="fs-meta-label">Target SLA Window</span>
              <span className="fs-meta-val sla-badge">45 Mins (Response Nominal)</span>
            </div>
          </div>

          {/* Section 3: Status Transition & Technician Assignment */}
          <div className="fs-drawer-card">
            <h4 className="fs-drawer-card-title">Field Operations Management</h4>
            <div className="fs-form-row">
              <div className="fs-field-group">
                <label htmlFor="drawer-status-select">Transition Incident Status</label>
                <select
                  id="drawer-status-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="fs-select-input"
                >
                  <option value="REPORTED">REPORTED (Initial Triage)</option>
                  <option value="DISPATCHED">DISPATCHED (Technician En Route)</option>
                  <option value="INVESTIGATING">INVESTIGATING (On-Site Assessment)</option>
                  <option value="IN_PROGRESS">IN_PROGRESS (Active Repair)</option>
                  <option value="RESOLVED">RESOLVED (Completed & Signed Off)</option>
                  <option value="CLOSED">CLOSED (Archived Incident)</option>
                </select>
              </div>

              <div className="fs-field-group">
                <label htmlFor="drawer-tech-select">Assigned Field Crew</label>
                <select
                  id="drawer-tech-select"
                  value={assignedTech}
                  onChange={(e) => setAssignedTech(e.target.value)}
                  className="fs-select-input"
                >
                  <option value="Tech Team Alpha (Alex Carter)">Tech Team Alpha (Alex Carter - Electrical)</option>
                  <option value="Rapid Response Unit (Maya Lin)">Rapid Response Unit (Maya Lin - Signaling)</option>
                  <option value="Structural Crew 2 (Carlos Mendez)">Structural Crew 2 (Carlos Mendez)</option>
                  <option value="Grid Maintenance Unit (Sam Davis)">Grid Maintenance Unit (Sam Davis)</option>
                  <option value="Telemetry Inspection (Priya Patel)">Telemetry Inspection (Priya Patel)</option>
                </select>
              </div>
            </div>

            <div className="fs-action-btn-row">
              <button
                type="button"
                className="btn-primary fs-btn-update"
                onClick={handleUpdateStatus}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Apply Status Transition'}
              </button>

              <button
                type="button"
                className="btn-danger-outline fs-btn-escalate"
                onClick={() => {
                  onClose();
                  if (onOpenEscalation) onOpenEscalation(incident);
                }}
              >
                🚨 Escalate to Central Ops
              </button>
            </div>
          </div>

          {/* Section 4: Field Supervisor Notes & Evidence */}
          <div className="fs-drawer-card">
            <h4 className="fs-drawer-card-title">Field Inspection Log & Notes</h4>
            
            <form onSubmit={handleAddNote} className="fs-note-form">
              <textarea
                placeholder="Log supervisor observations, safety equipment status, or on-ground findings..."
                value={supervisorNote}
                onChange={(e) => setSupervisorNote(e.target.value)}
                rows={3}
                className="fs-textarea-input"
              />
              <button type="submit" className="btn-secondary fs-btn-add-note">
                + Add Supervisor Note
              </button>
            </form>

            <div className="fs-notes-timeline">
              {notesList.map((note) => (
                <div key={note.id} className="fs-note-bubble">
                  <div className="fs-note-meta">
                    <span className="fs-note-author">{note.author}</span>
                    <span className="fs-note-time">{note.time}</span>
                  </div>
                  <p className="fs-note-text">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="fs-drawer-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailDrawer;
