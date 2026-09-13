import React from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/alertNotificationSlice';

const ShiftReportSection = ({
  incidents = [],
  observations = [],
}) => {
  const dispatch = useDispatch();

  const totalIncidents = incidents.length;
  const resolved = incidents.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'CLOSED'
  ).length;
  const inProgress = incidents.filter(
    (i) => i.status === 'IN_PROGRESS' || i.status === 'INVESTIGATING' || i.status === 'DISPATCHED'
  ).length;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolved / totalIncidents) * 100) : 100;

  const handleExportReport = () => {
    dispatch(
      addNotification({
        message: 'Shift operational summary generated & exported to official record.',
        type: 'success',
      })
    );
  };

  return (
    <div className="fs-report-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Shift Operational Report & Performance Log</h3>
          <p className="fs-section-subtitle">
            Shift Alpha-1 summary, SLA completion metrics, technician hours, and field sign-offs
          </p>
        </div>

        <button
          type="button"
          className="btn-primary fs-btn-export"
          onClick={handleExportReport}
        >
          📄 Export Official Shift Log
        </button>
      </div>

      <div className="fs-report-summary-cards">
        <div className="fs-report-stat-card">
          <span className="stat-card-tag">SHIFT DURATION</span>
          <div className="stat-card-value font-mono">06:42:18</div>
          <span className="stat-card-sub">Shift 1 (08:00 - 16:00 EST)</span>
        </div>

        <div className="fs-report-stat-card">
          <span className="stat-card-tag">RESOLUTION RATE</span>
          <div className="stat-card-value font-highlight">{resolutionRate}%</div>
          <span className="stat-card-sub">{resolved} / {totalIncidents} Incidents Closed</span>
        </div>

        <div className="fs-report-stat-card">
          <span className="stat-card-tag">FIELD INSPECTIONS</span>
          <div className="stat-card-value">{observations.length}</div>
          <span className="stat-card-sub">Sensor & Telemetry Validations</span>
        </div>

        <div className="fs-report-stat-card">
          <span className="stat-card-tag">AVERAGE SLA RESPONSE</span>
          <div className="stat-card-value font-mono">22.4m</div>
          <span className="stat-card-sub">Target: &lt; 45m Threshold</span>
        </div>
      </div>

      <div className="fs-report-timeline-card">
        <h4 className="fs-report-card-title">Shift Operational Event Log</h4>
        <div className="fs-report-timeline">
          <div className="fs-timeline-item">
            <span className="fs-timeline-time">14:15 EST</span>
            <div className="fs-timeline-dot" />
            <div className="fs-timeline-content">
              <strong>Supervisor Sign-off:</strong> Verified Substation 4 grounding and cleared incident #101.
            </div>
          </div>
          <div className="fs-timeline-item">
            <span className="fs-timeline-time">12:30 EST</span>
            <div className="fs-timeline-dot" />
            <div className="fs-timeline-content">
              <strong>Emergency Dispatch:</strong> Assigned Rapid Response Unit to clear traffic signal junction anomaly.
            </div>
          </div>
          <div className="fs-timeline-item">
            <span className="fs-timeline-time">10:05 EST</span>
            <div className="fs-timeline-dot" />
            <div className="fs-timeline-content">
              <strong>Sensor Inspection:</strong> Validated 12 IoT acoustic nodes in Central Sector.
            </div>
          </div>
          <div className="fs-timeline-item">
            <span className="fs-timeline-time">08:00 EST</span>
            <div className="fs-timeline-dot" />
            <div className="fs-timeline-content">
              <strong>Shift Inception:</strong> Shift Alpha-1 logged on duty. 5 Technicians active on radio channels.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftReportSection;
