import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const EscalationCenter = ({
  incidents = [],
  escalationTargetIncident = null,
  onCloseModal,
}) => {
  const dispatch = useDispatch();
  const [selectedIncidentId, setSelectedIncidentId] = useState(
    escalationTargetIncident?.incidentId || escalationTargetIncident?.id || (incidents[0]?.incidentId || incidents[0]?.id || '')
  );
  const [escalationReason, setEscalationReason] = useState('Heavy Machinery / Crane Required');
  const [urgencyLevel, setUrgencyLevel] = useState('CRITICAL');
  const [escalationNotes, setEscalationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [escalationsList, setEscalationsList] = useState([
    {
      id: 'ESC-801',
      incidentId: 102,
      incidentTitle: 'Water Main Rupture - Sector 3',
      reason: 'Specialized High-Pressure Hydraulic Pump Needed',
      urgency: 'CRITICAL',
      escalatedTo: 'City Operations Command',
      timestamp: '25 mins ago',
      status: 'UNDER_REVIEW',
      supervisorNotes: 'Substation flooded, requires emergency city council authorization for perimeter shutdown.',
    },
    {
      id: 'ESC-789',
      incidentId: 105,
      incidentTitle: 'Traffic Signal Controller Failure - Junction 9',
      reason: 'Cross-District Traffic Gridlock Risk',
      urgency: 'HIGH',
      escalatedTo: 'Traffic Controller Central',
      timestamp: '1 hour ago',
      status: 'APPROVED',
      supervisorNotes: 'Manual traffic police deployment requested.',
    },
  ]);

  const handleCreateEscalation = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const target = incidents.find(
      (i) => (i.incidentId || i.id) === Number(selectedIncidentId) || String(i.incidentId || i.id) === String(selectedIncidentId)
    );

    const newEscalation = {
      id: `ESC-${Math.floor(100 + Math.random() * 900)}`,
      incidentId: selectedIncidentId,
      incidentTitle: target?.title || `Incident #${selectedIncidentId}`,
      reason: escalationReason,
      urgency: urgencyLevel,
      escalatedTo: 'City Operations Command & Administrator',
      timestamp: 'Just now',
      status: 'DISPATCHED_TO_COMMAND',
      supervisorNotes: escalationNotes || 'Priority hazard requiring elevated municipal authority.',
    };

    setEscalationsList([newEscalation, ...escalationsList]);
    setEscalationNotes('');
    setIsSubmitting(false);

    dispatch(
      addNotification({
        message: `🚨 Escalation ${newEscalation.id} transmitted to City Administrator for Incident #${selectedIncidentId}`,
        type: 'critical',
      })
    );

    if (onCloseModal) onCloseModal();
  };

  return (
    <div className="fs-escalation-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Emergency Escalation Center</h3>
          <p className="fs-section-subtitle">
            Escalate on-ground hazards, heavy equipment requirements, or structural blockers directly to Central Operations
          </p>
        </div>
      </div>

      <div className="fs-escalation-layout">
        {/* Left Column: Create Escalation Form */}
        <div className="fs-escalation-form-card">
          <div className="fs-card-header-flex">
            <span className="fs-live-indicator-dot alert-pulse" />
            <h4>Submit Critical Hazard Escalation</h4>
          </div>

          <form onSubmit={handleCreateEscalation} className="fs-escalation-form">
            <div className="form-group">
              <label htmlFor="escalate-incident-select">Target Field Incident</label>
              <select
                id="escalate-incident-select"
                value={selectedIncidentId}
                onChange={(e) => setSelectedIncidentId(e.target.value)}
                className="fs-select-input"
                required
              >
                {incidents.map((inc) => {
                  const id = inc.incidentId || inc.id;
                  return (
                    <option key={id} value={id}>
                      #{id} - {inc.title} ({inc.severity || 'MEDIUM'})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="escalation-reason-select">Escalation Justification / Resource Blocker</label>
              <select
                id="escalation-reason-select"
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                className="fs-select-input"
              >
                <option value="Heavy Machinery / Crane Required">Heavy Machinery / Crane Required</option>
                <option value="High-Voltage Electrical Hazard (Live Arc)">High-Voltage Electrical Hazard (Live Arc)</option>
                <option value="Cross-District Traffic Gridlock Risk">Cross-District Traffic Gridlock Risk</option>
                <option value="Emergency Road Closure Authorization Needed">Emergency Road Closure Authorization Needed</option>
                <option value="Structural Collapse / Sinkhole Hazard">Structural Collapse / Sinkhole Hazard</option>
                <option value="Hazardous Material / Chemical Spill Protocol">Hazardous Material / Chemical Spill Protocol</option>
                <option value="Inter-Agency Police / Fire Coordination">Inter-Agency Police / Fire Coordination</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="urgency-select">Urgency Classification</label>
              <select
                id="urgency-select"
                value={urgencyLevel}
                onChange={(e) => setUrgencyLevel(e.target.value)}
                className="fs-select-input"
              >
                <option value="CRITICAL">CRITICAL (Immediate Central Intervention)</option>
                <option value="HIGH">HIGH (Elevated Resource Request)</option>
                <option value="MEDIUM">MEDIUM (Operational Notification)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="escalation-notes">Supervisor On-Site Situation Report</label>
              <textarea
                id="escalation-notes"
                rows={4}
                required
                placeholder="Detail current on-site conditions, technician findings, and why field resolution is blocked without Central Ops action..."
                value={escalationNotes}
                onChange={(e) => setEscalationNotes(e.target.value)}
                className="fs-textarea-input"
              />
            </div>

            <button
              type="submit"
              className="btn-primary fs-btn-escalate-submit"
              disabled={isSubmitting}
            >
              🚨 Transmit Escalation to City Command
            </button>
          </form>
        </div>

        {/* Right Column: Active Escalation Audit Log */}
        <div className="fs-escalation-history-card">
          <div className="fs-card-header-flex">
            <h4>Active Escalation Directives ({escalationsList.length})</h4>
            <span className="fs-telemetry-pill">Command Line Live</span>
          </div>

          <div className="fs-escalation-items-list">
            {escalationsList.map((esc) => {
              const isCrit = esc.urgency === 'CRITICAL';

              return (
                <div
                  key={esc.id}
                  className={`fs-esc-item ${isCrit ? 'esc-item-crit' : 'esc-item-high'}`}
                >
                  <div className="fs-esc-item-header">
                    <div className="fs-esc-title-group">
                      <span className="badge-id">{esc.id}</span>
                      <span className={`fs-severity-tag fs-severity-${esc.urgency.toLowerCase()}`}>
                        {esc.urgency}
                      </span>
                    </div>
                    <span className="fs-esc-time">{esc.timestamp}</span>
                  </div>

                  <h5 className="fs-esc-incident">{esc.incidentTitle}</h5>

                  <div className="fs-esc-reason-badge">
                    <span>⚠️ {esc.reason}</span>
                  </div>

                  <p className="fs-esc-notes">{esc.supervisorNotes}</p>

                  <div className="fs-esc-footer">
                    <span className="fs-esc-target">Transmitted to: {esc.escalatedTo}</span>
                    <span className="fs-status-pill fs-status-investigating">
                      {esc.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalationCenter;
