import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const TeamTechniciansSection = ({ onDispatchToTech }) => {
  const dispatch = useDispatch();
  const [selectedTechForMessage, setSelectedTechForMessage] = useState(null);
  const [dispatchNote, setDispatchNote] = useState('');

  const technicians = [
    {
      id: 'TECH-01',
      name: 'Alex Carter',
      specialty: 'High-Voltage Electrical & Substation Repairs',
      status: 'AVAILABLE',
      location: 'Substation Alpha (Zone 1)',
      activeTasks: 1,
      completedToday: 4,
      phone: '+1 (555) 019-2834',
      badge: 'Level 3 Specialist',
    },
    {
      id: 'TECH-02',
      name: 'Maya Lin',
      specialty: 'Intelligent Traffic Signaling & Fiber Optic',
      status: 'ON_SITE',
      location: 'Central Corridor (Zone 3)',
      activeTasks: 2,
      completedToday: 3,
      phone: '+1 (555) 019-4821',
      badge: 'Rapid Response Lead',
    },
    {
      id: 'TECH-03',
      name: 'Carlos Mendez',
      specialty: 'Structural Integrity & Concrete Assessment',
      status: 'IN_TRANSIT',
      location: 'En Route to West Grid',
      activeTasks: 1,
      completedToday: 2,
      phone: '+1 (555) 019-7712',
      badge: 'Structural Tech',
    },
    {
      id: 'TECH-04',
      name: 'Sam Davis',
      specialty: 'Grid Transformer Maintenance & Power Distribution',
      status: 'AVAILABLE',
      location: 'Depot South',
      activeTasks: 0,
      completedToday: 5,
      phone: '+1 (555) 019-9031',
      badge: 'Senior Tech',
    },
    {
      id: 'TECH-05',
      name: 'Priya Patel',
      specialty: 'IoT Sensor Calibration & Acoustic Diagnostics',
      status: 'AVAILABLE',
      location: 'Sector 2 IoT Node',
      activeTasks: 1,
      completedToday: 3,
      phone: '+1 (555) 019-3356',
      badge: 'Telemetry Specialist',
    },
  ];

  const handleSendRadioDispatch = (e) => {
    e.preventDefault();
    if (!selectedTechForMessage) return;
    dispatch(
      addNotification({
        message: `Field dispatch message transmitted to ${selectedTechForMessage.name} on Channel Alpha.`,
        type: 'info',
      })
    );
    setSelectedTechForMessage(null);
    setDispatchNote('');
  };

  return (
    <div className="fs-team-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Field Team & Technician Coordination</h3>
          <p className="fs-section-subtitle">
            Active shift crew roster, live deployment status, skill specializations, and direct radio dispatch
          </p>
        </div>
      </div>

      <div className="fs-team-grid">
        {technicians.map((tech) => {
          const isAvail = tech.status === 'AVAILABLE';
          const isOnSite = tech.status === 'ON_SITE';

          return (
            <div key={tech.id} className="fs-tech-card">
              <div className="fs-tech-header">
                <div className="fs-tech-avatar-wrap">
                  <div className="fs-tech-avatar">👷</div>
                  <div>
                    <h4 className="fs-tech-name">{tech.name}</h4>
                    <span className="fs-tech-id-badge">{tech.id} • {tech.badge}</span>
                  </div>
                </div>
                <span
                  className={`fs-status-pill ${
                    isAvail
                      ? 'fs-status-resolved'
                      : isOnSite
                      ? 'fs-status-dispatched'
                      : 'fs-status-investigating'
                  }`}
                >
                  {tech.status.replace('_', ' ')}
                </span>
              </div>

              <p className="fs-tech-specialty">{tech.specialty}</p>

              <div className="fs-tech-stats-grid">
                <div className="fs-tech-stat">
                  <span className="stat-num">{tech.activeTasks}</span>
                  <span className="stat-lbl">Active Jobs</span>
                </div>
                <div className="fs-tech-stat">
                  <span className="stat-num">{tech.completedToday}</span>
                  <span className="stat-lbl">Done Today</span>
                </div>
                <div className="fs-tech-stat">
                  <span className="stat-num font-highlight">100%</span>
                  <span className="stat-lbl">SLA Rate</span>
                </div>
              </div>

              <div className="fs-tech-meta-row">
                <span className="fs-tech-loc">📍 {tech.location}</span>
                <span className="fs-tech-phone">📞 {tech.phone}</span>
              </div>

              <div className="fs-tech-actions">
                <button
                  type="button"
                  className="btn-primary fs-btn-tech"
                  onClick={() => setSelectedTechForMessage(tech)}
                >
                  📻 Radio Dispatch
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Radio Dispatch Modal */}
      {selectedTechForMessage && (
        <div className="modal-overlay" onClick={() => setSelectedTechForMessage(null)}>
          <div
            className="modal-content fs-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>Transmit Radio Dispatch — {selectedTechForMessage.name}</h2>
              <button
                type="button"
                className="btn-close"
                onClick={() => setSelectedTechForMessage(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRadioDispatch}>
              <div className="form-group">
                <label>Target Field Unit</label>
                <input
                  type="text"
                  value={`${selectedTechForMessage.name} (${selectedTechForMessage.id}) - Channel 4 Secured`}
                  readOnly
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="radio-message-input">Dispatch Directive / Site Coordination Note</label>
                <textarea
                  id="radio-message-input"
                  rows={4}
                  required
                  placeholder="Enter directive (e.g., Proceed to Substation 4, verify high-voltage circuit breaker lockouts)..."
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  className="fs-textarea-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedTechForMessage(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Transmit Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamTechniciansSection;
