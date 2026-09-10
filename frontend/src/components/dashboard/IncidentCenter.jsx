import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  Car,
  Video,
  Radio,
  Clock,
  MapPin,
  Send,
  CheckCircle2,
  Filter,
  Eye,
  Plus
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const IncidentCenter = ({ incidents = [], onReportClick, onSelectIncident }) => {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [dispatchedUnits, setDispatchedUnits] = useState({});

  // Real mock + Redux items unified
  const baseIncidents = [
    {
      id: 'INC-901',
      title: 'Multi-Vehicle Collision on Harbor Bridge Loop',
      category: 'Accident Detected',
      severity: 'CRITICAL',
      location: 'Coastal Arterial, Sector 3 (KM 14.2)',
      time: '3 mins ago',
      status: 'INVESTIGATING',
      camera: 'CAM-04',
      affectedLanes: 'Lanes 1 & 2 Blocked',
      icon: Flame,
    },
    {
      id: 'INC-889',
      title: 'Heavy Freight Vehicle Breakdown',
      category: 'Vehicle Breakdown',
      severity: 'HIGH',
      location: 'Central Metro Expressway, Near Junction 4A',
      time: '12 mins ago',
      status: 'DISPATCHED',
      camera: 'CAM-01',
      affectedLanes: 'Right Shoulder Obstructed',
      icon: Car,
    },
    {
      id: 'INC-874',
      title: 'Adaptive Signal Sensor Malfunction',
      category: 'Signal Malfunction',
      severity: 'HIGH',
      location: 'Tech Park Blvd & 8th Cross',
      time: '26 mins ago',
      status: 'REPORTED',
      camera: 'CAM-03',
      affectedLanes: 'Manual Traffic Control Required',
      icon: AlertTriangle,
    },
    {
      id: 'INC-862',
      title: 'Roadway Debris / Cargo Spill Obstruction',
      category: 'Road Blockage',
      severity: 'MEDIUM',
      location: 'Sector 5 Outer Ring Bypass',
      time: '45 mins ago',
      status: 'INVESTIGATING',
      camera: 'CAM-02',
      affectedLanes: 'Single Lane Restricted',
      icon: AlertTriangle,
    },
    {
      id: 'INC-850',
      title: 'Unauthorized Bus Lane Speed Violation',
      category: 'Traffic Violation',
      severity: 'LOW',
      location: 'Downtown Bus Rapid Corridor',
      time: '1 hour ago',
      status: 'CLOSED',
      camera: 'CAM-01',
      affectedLanes: 'Automated E-Challan Issued',
      icon: Radio,
    },
  ];

  // Merge with Redux incidents
  const mappedRedux = (incidents || []).map((inc, idx) => ({
    id: `INC-DB-${inc.incidentId || inc.id || idx}`,
    title: inc.title || 'Municipal Incident',
    category: inc.category || 'Roadway Incident',
    severity: inc.severity || 'MEDIUM',
    location: inc.zone?.zoneName || inc.zoneName || 'City Central Zone',
    time: inc.reportedAt ? new Date(inc.reportedAt).toLocaleTimeString() : 'Recent',
    status: inc.status || 'REPORTED',
    camera: `CAM-0${(idx % 4) + 1}`,
    affectedLanes: inc.description || 'Monitored via AI',
    icon: inc.severity === 'CRITICAL' ? Flame : AlertTriangle,
  }));

  const allItems = [...mappedRedux, ...baseIncidents];

  const filteredItems = filterSeverity === 'ALL'
    ? allItems
    : allItems.filter((i) => i.severity === filterSeverity);

  const handleDispatch = (id) => {
    setDispatchedUnits((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  return (
    <div className="incident-center-container glass-panel">
      {/* Header */}
      <div className="incident-center-header">
        <div className="incident-title-group">
          <div className="incident-badge">
            <span className="telemetry-dot live-pulse text-crimson" />
            <span>CRISIS & COLLISION RADAR</span>
          </div>
          <h3 className="incident-center-title">
            Accident & Incident Management Center
          </h3>
          <p className="incident-center-subtitle">
            Autonomous computer-vision anomaly detection & emergency response dispatch console
          </p>
        </div>

        {/* Action & Filter Bar */}
        <div className="incident-header-actions">
          {/* Severity Filter Pills */}
          <div className="severity-filter-pills">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                type="button"
                className={`filter-pill ${filterSeverity === sev ? 'active' : ''}`}
                onClick={() => setFilterSeverity(sev)}
              >
                {sev}
              </button>
            ))}
          </div>

          {onReportClick && (
            <button
              type="button"
              className="btn-report-incident btn-primary"
              onClick={onReportClick}
            >
              <Plus size={14} />
              <span>Report Incident</span>
            </button>
          )}
        </div>
      </div>

      {/* Incidents Stream Grid */}
      <div className="incident-cards-stream">
        {filteredItems.slice(0, 6).map((item) => {
          const IconComp = item.icon || AlertTriangle;
          const isCritical = item.severity === 'CRITICAL';
          const isDispatched = dispatchedUnits[item.id];

          return (
            <div
              key={item.id}
              className={`incident-stream-card ${isCritical ? 'critical-pulse-card' : ''}`}
            >
              <div className="incident-card-top">
                <div className="incident-type-group">
                  <div className={`incident-icon-pill severity-${item.severity.toLowerCase()}`}>
                    <IconComp size={16} />
                  </div>
                  <div>
                    <span className="incident-id-tag">{item.id}</span>
                    <span className="incident-category">{item.category}</span>
                  </div>
                </div>

                <div className="incident-badges-row">
                  <StatusBadge status={item.severity} pulse={isCritical} size="sm" />
                  <span className={`status-pill pill-${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <h4 className="incident-card-title">{item.title}</h4>

              <div className="incident-meta-grid">
                <div className="meta-item">
                  <MapPin size={13} className="text-cyan" />
                  <span>{item.location}</span>
                </div>
                <div className="meta-item">
                  <Clock size={13} className="text-muted" />
                  <span>{item.time}</span>
                </div>
                <div className="meta-item">
                  <Video size={13} className="text-purple" />
                  <span>Feed: {item.camera}</span>
                </div>
              </div>

              <div className="incident-lanes-notice">
                <span>⚠️ {item.affectedLanes}</span>
              </div>

              <div className="incident-card-actions">
                <button
                  type="button"
                  className={`btn-action-dispatch ${isDispatched ? 'dispatched-state' : ''}`}
                  onClick={() => handleDispatch(item.id)}
                >
                  {isDispatched ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Unit En Route</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>Dispatch Response</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-action-view"
                  onClick={() => onSelectIncident && onSelectIncident(item)}
                >
                  <Eye size={13} />
                  <span>View Telemetry</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncidentCenter;
