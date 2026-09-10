import React, { useState } from 'react';
import {
  Activity,
  ShieldAlert,
  Navigation,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Zap,
  Sliders
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const EmergencyTracking = ({ onToggleCorridor, corridorActive = false }) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState('AMB-104');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [activeAmbulances, setActiveAmbulances] = useState([
    {
      id: 'AMB-104',
      name: 'Advanced Cardiac Life Support (Unit 104)',
      vehicleType: 'Ambulance',
      driver: 'Capt. Ryan / Paramedic Maya',
      currentLocation: 'Sector 4 Metro Expressway (KM 8.4)',
      destination: 'City General Trauma & Emergency Hospital',
      distanceRemaining: '3.4 km',
      speed: '84 km/h',
      eta: '3 mins 40 sec',
      trafficAhead: 'Green Corridor Clear',
      corridorStatus: 'ACTIVE_PREEMPTION',
      preemptedSignals: ['Junction 4A', 'Junction 7B', 'Hospital Gate North'],
      heartRateTelemetry: 'Patient Vitals: Stable (120/80 mmHg)',
    },
    {
      id: 'AMB-209',
      name: 'Pediatric ICU Transport (Unit 209)',
      vehicleType: 'Ambulance',
      driver: 'Off. David / Paramedic Sarah',
      currentLocation: 'Northern Tech Bypass Gate 1',
      destination: 'Metro Children Specialist Hospital',
      distanceRemaining: '7.1 km',
      speed: '62 km/h',
      eta: '8 mins 15 sec',
      trafficAhead: 'Moderate Flow (Signal Loop Sync)',
      corridorStatus: 'STANDBY',
      preemptedSignals: ['Tech Park Blvd', 'North Ring Link'],
      heartRateTelemetry: 'Patient Vitals: Monitoring',
    },
    {
      id: 'FR-02',
      name: 'Rapid Fire & Rescue Squad (Unit 02)',
      vehicleType: 'Fire Rescue',
      driver: 'Commander Miller',
      currentLocation: 'Harbor Coastal Station',
      destination: 'Sector 3 Industrial Park',
      distanceRemaining: '5.2 km',
      speed: '76 km/h',
      eta: '5 mins 50 sec',
      trafficAhead: 'Corridor Prepared',
      corridorStatus: 'STANDBY',
      preemptedSignals: ['Harbor Bridge', 'Sector 3 Crossing'],
      heartRateTelemetry: 'Hazmat Team on Standby',
    },
  ]);

  const currentUnit = activeAmbulances.find((a) => a.id === selectedAmbulance) || activeAmbulances[0];

  const handleActivateClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmCorridor = () => {
    if (onToggleCorridor) {
      onToggleCorridor();
    }
    setConfirmModalOpen(false);
  };

  return (
    <div className="emergency-tracking-container glass-panel">
      {/* Header */}
      <div className="emergency-header">
        <div className="emergency-title-group">
          <div className="emergency-badge">
            <ShieldAlert size={14} className="hud-icon-spin text-cyan" />
            <span>RAPID EMERGENCY PREEMPTION SYSTEM</span>
          </div>
          <h3 className="emergency-title">
            Emergency Fleet & Green Corridor Command
          </h3>
          <p className="emergency-subtitle">
            Dynamic V2I (Vehicle-to-Infrastructure) automated traffic signal overrides for life-saving transit
          </p>
        </div>

        {/* Status Indicator */}
        <div className="corridor-status-pill">
          <span className={`corridor-lamp ${corridorActive ? 'lamp-active' : 'lamp-standby'}`} />
          <span className="corridor-text">
            {corridorActive ? 'GREEN CORRIDOR ENGAGED' : 'STANDARD ADAPTIVE MODE'}
          </span>
        </div>
      </div>

      {/* Fleet Selector Tabs */}
      <div className="emergency-fleet-tabs">
        {activeAmbulances.map((unit) => {
          const isSelected = selectedAmbulance === unit.id;
          return (
            <button
              key={unit.id}
              type="button"
              className={`fleet-unit-tab ${isSelected ? 'active' : ''}`}
              onClick={() => setSelectedAmbulance(unit.id)}
            >
              <div className="tab-left">
                <span className="unit-id-badge">{unit.id}</span>
                <span className="unit-name">{unit.name}</span>
              </div>
              <div className="tab-right">
                <span className="unit-eta text-cyan">ETA {unit.eta}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Unit Telemetry Card */}
      <div className="emergency-telemetry-grid">
        {/* Left Column: Route & Dispatch Overview */}
        <div className="telemetry-col-main">
          <div className="unit-overview-header">
            <div>
              <h4 className="unit-display-name">{currentUnit.name}</h4>
              <p className="unit-driver-text">Personnel: {currentUnit.driver}</p>
            </div>
            <StatusBadge
              status={corridorActive ? 'ACTIVE_PREEMPTION' : 'STANDBY'}
              pulse={corridorActive}
            />
          </div>

          <div className="route-trajectory-box">
            <div className="trajectory-step">
              <div className="step-marker marker-origin" />
              <div className="step-content">
                <span className="step-label">Current Position</span>
                <span className="step-val">{currentUnit.currentLocation}</span>
              </div>
            </div>
            <div className="trajectory-connector" />
            <div className="trajectory-step">
              <div className="step-marker marker-destination" />
              <div className="step-content">
                <span className="step-label">Destination Trauma Facility</span>
                <span className="step-val text-cyan">{currentUnit.destination}</span>
              </div>
            </div>
          </div>

          {/* Vitals / Sensor Stream */}
          <div className="telemetry-vitals-strip">
            <Activity size={15} className="text-emerald" />
            <span>{currentUnit.heartRateTelemetry}</span>
          </div>
        </div>

        {/* Right Column: Speed, ETA & Preemption Signals */}
        <div className="telemetry-col-side">
          <div className="telemetry-metrics-row">
            <div className="emergency-metric-box">
              <span className="metric-label">Live Velocity</span>
              <span className="metric-val text-cyan">{currentUnit.speed}</span>
            </div>
            <div className="emergency-metric-box">
              <span className="metric-label">Est. Time of Arrival</span>
              <span className="metric-val text-purple">{currentUnit.eta}</span>
            </div>
            <div className="emergency-metric-box">
              <span className="metric-label">Distance to ER</span>
              <span className="metric-val text-emerald">{currentUnit.distanceRemaining}</span>
            </div>
          </div>

          <div className="preempted-signals-box">
            <span className="signals-box-title">Synchronized Signals on Corridor:</span>
            <div className="signals-pills-row">
              {currentUnit.preemptedSignals.map((sig, idx) => (
                <div key={idx} className="preempt-pill">
                  <span className={`signal-dot ${corridorActive ? 'dot-green' : 'dot-yellow'}`} />
                  <span>{sig} ({corridorActive ? 'PREEMPTED GREEN' : 'SYNCED'})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            className={`btn-corridor-trigger ${corridorActive ? 'btn-corridor-active' : 'btn-primary'}`}
            onClick={handleActivateClick}
          >
            <ShieldAlert size={16} />
            <span>
              {corridorActive ? 'Disengage Green Corridor' : 'Activate Green Corridor (Preempt All Signals)'}
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content form-modal animate-scale-up">
            <div className="modal-header">
              <div className="modal-title-group">
                <h3 className="modal-title text-cyan">
                  {corridorActive ? 'Disengage Green Corridor Preemption?' : 'Confirm Green Corridor Activation'}
                </h3>
                <p className="modal-subtitle">
                  Autonomous municipal V2I traffic signal priority authorization
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setConfirmModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="corridor-modal-body">
              <div className="warning-notice-box">
                <AlertTriangle size={20} className="text-amber" />
                <p>
                  {corridorActive
                    ? 'Disengaging will return all intersecting corridors (Junction 4A, 7B) to standard adaptive loop cycles.'
                    : 'Activating will preemptively turn all signals along the 3.4 km corridor to GREEN and extend cycle duration until Ambulance AMB-104 passes.'}
                </p>
              </div>

              <div className="modal-unit-summary">
                <div className="summary-row">
                  <span>Authorized Unit:</span>
                  <strong>{currentUnit.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Destination:</span>
                  <strong>{currentUnit.destination}</strong>
                </div>
                <div className="summary-row">
                  <span>Expected Travel Duration:</span>
                  <strong className="text-cyan">{currentUnit.eta}</strong>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-submit btn-primary"
                onClick={handleConfirmCorridor}
              >
                {corridorActive ? 'Confirm Disengage' : 'Authorize & Broadcast Priority'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyTracking;
