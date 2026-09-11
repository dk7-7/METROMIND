import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/slices/alertNotificationSlice';
import CapacityBar from '../common/CapacityBar';

const InfrastructureAssetsSection = ({
  grids = [],
  zones = [],
  loading = false,
}) => {
  const dispatch = useDispatch();
  const [assetTab, setAssetTab] = useState('GRIDS');
  const [reportedDefects, setReportedDefects] = useState({});

  const handleFlagDefect = (assetName, assetType) => {
    setReportedDefects((prev) => ({ ...prev, [assetName]: true }));
    dispatch(
      addNotification({
        message: `Field maintenance defect flagged for ${assetType}: ${assetName}. Inspection scheduled.`,
        type: 'warning',
      })
    );
  };

  return (
    <div className="fs-assets-section">
      <div className="fs-section-header-row">
        <div>
          <h3 className="fs-section-title">Infrastructure Assets & Operational Health</h3>
          <p className="fs-section-subtitle">
            Sector telemetry for power grids, substations, signaling zones, and traffic corridors
          </p>
        </div>

        <div className="fs-wo-tab-pills">
          <button
            type="button"
            className={`fs-wo-tab ${assetTab === 'GRIDS' ? 'active' : ''}`}
            onClick={() => setAssetTab('GRIDS')}
          >
            ⚡ Utility Grids ({grids.length})
          </button>
          <button
            type="button"
            className={`fs-wo-tab ${assetTab === 'ZONES' ? 'active' : ''}`}
            onClick={() => setAssetTab('ZONES')}
          >
            🚦 Traffic Corridors ({zones.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading infrastructure asset telemetry...</div>
      ) : assetTab === 'GRIDS' ? (
        <div className="fs-assets-grid">
          {grids.length === 0 ? (
            <div className="fs-empty-card">No utility grids configured.</div>
          ) : (
            grids.map((grid) => {
              const id = grid.gridId || grid.id;
              const cap = Number(grid.capacityUnits) || 100;
              const load = Number(grid.currentLoad) || 0;
              const pct = Math.round((load / cap) * 100);
              const isFlagged = reportedDefects[grid.gridName];

              return (
                <div key={id} className="fs-asset-card">
                  <div className="fs-asset-header">
                    <div className="fs-asset-title-group">
                      <span className="fs-asset-badge">GRID-#{id}</span>
                      <h4 className="fs-asset-name">{grid.gridName}</h4>
                    </div>
                    <span className={`fs-status-pill ${grid.status === 'OPERATIONAL' ? 'fs-status-resolved' : 'fs-status-dispatched'}`}>
                      {grid.status || 'OPERATIONAL'}
                    </span>
                  </div>

                  <div className="fs-asset-metric-row">
                    <div className="fs-asset-metric">
                      <span className="metric-label">Current Load</span>
                      <span className="metric-val">{load} MW</span>
                    </div>
                    <div className="fs-asset-metric">
                      <span className="metric-label">Rated Capacity</span>
                      <span className="metric-val">{cap} MW</span>
                    </div>
                    <div className="fs-asset-metric">
                      <span className="metric-label">Load Percentage</span>
                      <span className="metric-val">{pct}%</span>
                    </div>
                  </div>

                  <div className="fs-asset-bar-wrap">
                    <CapacityBar currentLoad={load} capacityUnits={cap} />
                  </div>

                  <div className="fs-asset-footer">
                    <span className="fs-asset-loc">📍 Grid Sector Substation #{id}</span>
                    <button
                      type="button"
                      className={`fs-btn-flag ${isFlagged ? 'flagged' : ''}`}
                      disabled={isFlagged}
                      onClick={() => handleFlagDefect(grid.gridName, 'Utility Grid')}
                    >
                      {isFlagged ? '⚠️ Defect Flagged' : 'Flag Asset Issue'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="fs-assets-grid">
          {zones.length === 0 ? (
            <div className="fs-empty-card">No traffic zones configured.</div>
          ) : (
            zones.map((zone) => {
              const id = zone.zoneId || zone.id;
              const isFlagged = reportedDefects[zone.zoneName];

              return (
                <div key={id} className="fs-asset-card">
                  <div className="fs-asset-header">
                    <div className="fs-asset-title-group">
                      <span className="fs-asset-badge">ZONE-#{id}</span>
                      <h4 className="fs-asset-name">{zone.zoneName}</h4>
                    </div>
                    <span
                      className={`fs-status-pill ${
                        zone.currentCongestionLevel === 'LOW'
                          ? 'fs-status-resolved'
                          : zone.currentCongestionLevel === 'MODERATE'
                          ? 'fs-status-investigating'
                          : 'fs-status-critical'
                      }`}
                    >
                      {zone.currentCongestionLevel || 'MODERATE'}
                    </span>
                  </div>

                  <div className="fs-asset-metric-row">
                    <div className="fs-asset-metric">
                      <span className="metric-label">Speed Limit</span>
                      <span className="metric-val">{zone.speedLimitKmph || 50} km/h</span>
                    </div>
                    <div className="fs-asset-metric">
                      <span className="metric-label">Active Sensors</span>
                      <span className="metric-val">12 Online</span>
                    </div>
                    <div className="fs-asset-metric">
                      <span className="metric-label">Flow Rating</span>
                      <span className="metric-val">Optimal</span>
                    </div>
                  </div>

                  <div className="fs-asset-footer">
                    <span className="fs-asset-loc">📍 Sector Traffic Grid #{id}</span>
                    <button
                      type="button"
                      className={`fs-btn-flag ${isFlagged ? 'flagged' : ''}`}
                      disabled={isFlagged}
                      onClick={() => handleFlagDefect(zone.zoneName, 'Traffic Zone')}
                    >
                      {isFlagged ? '⚠️ Defect Flagged' : 'Flag Signaling Anomaly'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default InfrastructureAssetsSection;
