import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { update as updateIncident } from '../../store/slices/trafficIncidentSlice';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const WorkOrdersSection = ({
  incidents = [],
  onSelectIncident,
  onOpenEscalation,
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('ALL');
  const [assignModalItem, setAssignModalItem] = useState(null);
  const [selectedTech, setSelectedTech] = useState('Alex Carter (Electrical Specialist)');
  const [workNotes, setWorkNotes] = useState('');

  // Map incidents to Work Order Phases
  const pendingDispatch = incidents.filter(
    (i) => i.status === 'REPORTED'
  );
  const enRoute = incidents.filter(
    (i) => i.status === 'DISPATCHED'
  );
  const onSiteActive = incidents.filter(
    (i) => i.status === 'INVESTIGATING' || i.status === 'IN_PROGRESS'
  );
  const awaitingVerification = incidents.filter(
    (i) => i.status === 'RESOLVED'
  );

  const handleVerifyAndClose = async (item) => {
    const id = item.incidentId || item.id;
    try {
      const updated = { ...item, status: 'CLOSED' };
      const res = await dispatch(updateIncident({ id, data: updated }));
      if (updateIncident.fulfilled.match(res)) {
        dispatch(
          addNotification({
            message: `Work Order #${id} verified & successfully closed.`,
            type: 'success',
          })
        );
      }
    } catch (e) {
      // handled
    }
  };

  const handleSaveTechAssignment = async (e) => {
    e.preventDefault();
    if (!assignModalItem) return;
    const id = assignModalItem.incidentId || assignModalItem.id;
    try {
      const updated = {
        ...assignModalItem,
        assignedTech: selectedTech,
        status: assignModalItem.status === 'REPORTED' ? 'DISPATCHED' : assignModalItem.status,
      };
      const res = await dispatch(updateIncident({ id, data: updated }));
      if (updateIncident.fulfilled.match(res)) {
        dispatch(
          addNotification({
            message: `Technician assigned & Work Order #${id} dispatched!`,
            type: 'success',
          })
        );
        setAssignModalItem(null);
      }
    } catch (e) {
      // handled
    }
  };

  const renderWorkOrderCard = (item, phaseLabel) => {
    const id = item.incidentId || item.id;
    const zoneLabel =
      item.zone?.zoneName ||
      item.zoneName ||
      (item.zoneId ? `Zone ${item.zoneId}` : 'Main Sector');

    return (
      <div key={id} className="fs-wo-card">
        <div className="fs-wo-header">
          <div className="fs-wo-title-group">
            <span className="fs-wo-id">WO-{id}</span>
            <span className={`fs-severity-tag fs-severity-${(item.severity || 'medium').toLowerCase()}`}>
              {item.severity || 'MEDIUM'}
            </span>
          </div>
          <span className="fs-phase-pill">{phaseLabel}</span>
        </div>

        <h4 className="fs-wo-title">{item.title}</h4>

        <div className="fs-wo-details">
          <div className="fs-wo-detail-item">
            <span className="fs-wo-label">Zone:</span>
            <span className="fs-wo-value">{zoneLabel}</span>
          </div>
          <div className="fs-wo-detail-item">
            <span className="fs-wo-label">Assigned Crew:</span>
            <span className="fs-wo-value font-highlight">
              {item.assignedTech || 'Awaiting Dispatch'}
            </span>
          </div>
        </div>

        <div className="fs-wo-actions">
          <button
            type="button"
            className="btn-secondary fs-wo-btn"
            onClick={() => onSelectIncident(item)}
          >
            Details
          </button>

          {item.status === 'REPORTED' && (
            <button
              type="button"
              className="btn-primary fs-wo-btn"
              onClick={() => {
                setAssignModalItem(item);
                setSelectedTech('Alex Carter (Electrical Specialist)');
              }}
            >
              Dispatch Crew
            </button>
          )}

          {(item.status === 'DISPATCHED' || item.status === 'INVESTIGATING') && (
            <button
              type="button"
              className="btn-primary fs-wo-btn"
              onClick={() => {
                const id = item.incidentId || item.id;
                dispatch(
                  updateIncident({
                    id,
                    data: { ...item, status: 'IN_PROGRESS' },
                  })
                );
              }}
            >
              Start Work
            </button>
          )}

          {item.status === 'IN_PROGRESS' && (
            <button
              type="button"
              className="btn-primary fs-wo-btn"
              onClick={() => {
                const id = item.incidentId || item.id;
                dispatch(
                  updateIncident({
                    id,
                    data: { ...item, status: 'RESOLVED' },
                  })
                );
              }}
            >
              Complete Work
            </button>
          )}

          {item.status === 'RESOLVED' && (
            <button
              type="button"
              className="btn-primary fs-wo-btn btn-success-glow"
              onClick={() => handleVerifyAndClose(item)}
            >
              Verify & Close
            </button>
          )}

          <button
            type="button"
            className="btn-danger-outline fs-wo-btn"
            onClick={() => onOpenEscalation(item)}
            title="Escalate"
          >
            🚨
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fs-work-orders-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Assigned Field Work Orders</h3>
          <p className="fs-section-subtitle">
            Coordinate dispatch, monitor real-time field progress, and verify completed infrastructure repairs
          </p>
        </div>

        <div className="fs-wo-tab-pills">
          <button
            type="button"
            className={`fs-wo-tab ${activeTab === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Work Orders ({incidents.length})
          </button>
          <button
            type="button"
            className={`fs-wo-tab ${activeTab === 'DISPATCH' ? 'active' : ''}`}
            onClick={() => setActiveTab('DISPATCH')}
          >
            Pending Dispatch ({pendingDispatch.length})
          </button>
          <button
            type="button"
            className={`fs-wo-tab ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            In-Progress ({onSiteActive.length + enRoute.length})
          </button>
          <button
            type="button"
            className={`fs-wo-tab ${activeTab === 'VERIFICATION' ? 'active' : ''}`}
            onClick={() => setActiveTab('VERIFICATION')}
          >
            Awaiting Verification ({awaitingVerification.length})
          </button>
        </div>
      </div>

      <div className="fs-wo-columns-grid">
        {/* Column 1: Pending Dispatch */}
        {(activeTab === 'ALL' || activeTab === 'DISPATCH') && (
          <div className="fs-wo-column">
            <div className="fs-wo-col-header col-header-pending">
              <span className="fs-wo-col-dot" />
              <h4>Pending Dispatch ({pendingDispatch.length})</h4>
            </div>
            <div className="fs-wo-col-list">
              {pendingDispatch.length === 0 ? (
                <div className="fs-wo-col-empty">No pending dispatches</div>
              ) : (
                pendingDispatch.map((i) => renderWorkOrderCard(i, 'Pending Dispatch'))
              )}
            </div>
          </div>
        )}

        {/* Column 2: En Route / In Transit */}
        {(activeTab === 'ALL' || activeTab === 'ACTIVE') && (
          <div className="fs-wo-column">
            <div className="fs-wo-col-header col-header-transit">
              <span className="fs-wo-col-dot" />
              <h4>En Route / Mobilized ({enRoute.length})</h4>
            </div>
            <div className="fs-wo-col-list">
              {enRoute.length === 0 ? (
                <div className="fs-wo-col-empty">No technicians in transit</div>
              ) : (
                enRoute.map((i) => renderWorkOrderCard(i, 'En Route'))
              )}
            </div>
          </div>
        )}

        {/* Column 3: Active On-Site Repair */}
        {(activeTab === 'ALL' || activeTab === 'ACTIVE') && (
          <div className="fs-wo-column">
            <div className="fs-wo-col-header col-header-active">
              <span className="fs-wo-col-dot" />
              <h4>On-Site Active ({onSiteActive.length})</h4>
            </div>
            <div className="fs-wo-col-list">
              {onSiteActive.length === 0 ? (
                <div className="fs-wo-col-empty">No active on-site repairs</div>
              ) : (
                onSiteActive.map((i) => renderWorkOrderCard(i, 'On-Site Active'))
              )}
            </div>
          </div>
        )}

        {/* Column 4: Awaiting Supervisor Verification */}
        {(activeTab === 'ALL' || activeTab === 'VERIFICATION') && (
          <div className="fs-wo-column">
            <div className="fs-wo-col-header col-header-verify">
              <span className="fs-wo-col-dot" />
              <h4>Awaiting Verification ({awaitingVerification.length})</h4>
            </div>
            <div className="fs-wo-col-list">
              {awaitingVerification.length === 0 ? (
                <div className="fs-wo-col-empty">No items awaiting verification</div>
              ) : (
                awaitingVerification.map((i) => renderWorkOrderCard(i, 'Needs Sign-Off'))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dispatch Technician Modal */}
      {assignModalItem && (
        <div className="modal-overlay" onClick={() => setAssignModalItem(null)}>
          <div
            className="modal-content fs-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="modal-header">
              <h2>Dispatch Technician for WO-#{assignModalItem.incidentId || assignModalItem.id}</h2>
              <button
                type="button"
                className="btn-close"
                onClick={() => setAssignModalItem(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTechAssignment}>
              <div className="form-group">
                <label>Incident / Work Target</label>
                <input
                  type="text"
                  value={assignModalItem.title}
                  readOnly
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tech-select-modal">Select Field Technician / Crew</label>
                <select
                  id="tech-select-modal"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="fs-select-input"
                >
                  <option value="Alex Carter (Electrical Specialist)">Alex Carter (Electrical Specialist - Available)</option>
                  <option value="Maya Lin (Traffic Signal Engineer)">Maya Lin (Traffic Signal Engineer - Available)</option>
                  <option value="Carlos Mendez (Structural Inspector)">Carlos Mendez (Structural Inspector - Available)</option>
                  <option value="Sam Davis (Grid Maintenance Unit)">Sam Davis (Grid Maintenance Unit - Available)</option>
                  <option value="Priya Patel (Sensor Telemetry Specialist)">Priya Patel (Sensor Telemetry Specialist - Available)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="wo-dispatch-notes">Dispatch Instructions & Safety Guidelines</label>
                <textarea
                  id="wo-dispatch-notes"
                  rows={3}
                  placeholder="Enter specific safety notes, site access codes, equipment needed..."
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  className="fs-textarea-input"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setAssignModalItem(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkOrdersSection;
