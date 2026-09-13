import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TrafficInfrastructureTelemetry.css';

const TrafficInfrastructureTelemetry = ({ zones = [], grids = [], loading = false }) => {
  const navigate = useNavigate();

  // Combine real zones and real grids from Redux store
  const telemetryRows = [];

  // 1. Real Traffic Zone Telemetry
  zones.forEach((zone) => {
    const congestion = (zone.currentCongestionLevel || 'LOW').toUpperCase();
    const loadPct = Math.min(
      100,
      Math.round(
        congestion === 'SEVERE'
          ? 95
          : congestion === 'HIGH'
          ? 80
          : congestion === 'MODERATE'
          ? 55
          : 25
      )
    );
    const flowStatus =
      congestion === 'SEVERE'
        ? 'Gridlock Alert'
        : congestion === 'HIGH'
        ? 'Restricted'
        : congestion === 'MODERATE'
        ? 'Moderate Flow'
        : 'Flowing';

    telemetryRows.push({
      id: `zone-${zone.id || zone.zoneName}`,
      domain: 'TRAFFIC DENSITY',
      title: zone.zoneName || (zone.zoneCode ? `Zone ${zone.zoneCode}` : 'Traffic Sector'),
      metricLabel: `Traffic Load ${loadPct}%`,
      statusLabel: flowStatus,
      speedOrDetail: zone.averageSpeed ? `${zone.averageSpeed} km/h avg` : (zone.signalCycleSeconds ? `${zone.signalCycleSeconds}s cycle` : 'Nominal Speed'),
      progress: loadPct,
      variant: congestion === 'SEVERE' || congestion === 'HIGH' ? 'amber' : 'cyan',
      icon: '🚦',
      link: '/traffic-zones',
    });
  });

  // 2. Real Utility Grid Telemetry
  grids.forEach((grid) => {
    const cap = grid.capacityUnits || 100;
    const load = grid.currentLoad || 0;
    const loadPct = cap > 0 ? Math.min(100, Math.round((load / cap) * 100)) : 0;
    const status = (grid.status || 'OPERATIONAL').toUpperCase();

    telemetryRows.push({
      id: `grid-${grid.gridId || grid.id || grid.gridName}`,
      domain: grid.gridType ? `${grid.gridType} GRID` : 'UTILITY GRID',
      title: grid.gridName ? `${grid.gridName}${grid.district ? ` (${grid.district})` : ''}` : 'Utility Substation',
      metricLabel: `Utility Capacity ${loadPct}%`,
      statusLabel: status === 'OPERATIONAL' ? 'Stable' : status,
      speedOrDetail: `${load} / ${cap} Units`,
      progress: loadPct,
      variant: status === 'OPERATIONAL' ? 'green' : 'amber',
      icon: (grid.gridType || '').toUpperCase().includes('WATER') ? '💧' : '⚡',
      link: '/utility-grids',
    });
  });

  if (loading) {
    return (
      <div className="traffic-infra-telemetry-panel skeleton-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Traffic & Infrastructure Telemetry</h3>
        </div>
        <div className="skeleton-line skeleton-telemetry" />
      </div>
    );
  }

  return (
    <div className="dashboard-overview-panel traffic-infra-telemetry-panel">
      <div className="card-header-flex">
        <div className="header-title-group">
          <span className="card-header-icon" aria-hidden="true">🌐</span>
          <h3>Traffic & Infrastructure Telemetry</h3>
        </div>
        <span className="telemetry-badge">
          {telemetryRows.length} NODES MONITORED
        </span>
      </div>

      {telemetryRows.length === 0 ? (
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No traffic zones or utility grids available for telemetry.</p>
          <span className="empty-state-sub">Registered traffic zones and utility grids will automatically stream telemetry here.</span>
        </div>
      ) : (
        <div className="telemetry-compact-grid">
          {telemetryRows.map((item) => {
            const isWarning = item.variant === 'amber' || item.statusLabel.toLowerCase().includes('restricted') || item.statusLabel.toLowerCase().includes('gridlock') || item.statusLabel.toLowerCase().includes('degraded');
            const pillClass = isWarning ? 'badge-warning' : 'badge-nominal';
            const fillClass = isWarning ? 'progress-amber' : item.variant === 'green' ? 'progress-green' : 'progress-cyan';

            return (
              <div
                key={item.id}
                className="telemetry-node-card"
                onClick={() => navigate(item.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(item.link);
                  }
                }}
              >
                <div className="telemetry-node-top">
                  <div className="node-domain-wrap">
                    <span className="node-icon" aria-hidden="true">{item.icon}</span>
                    <span className="node-domain">{item.domain}</span>
                  </div>
                  <span className={`telemetry-status-pill ${pillClass}`}>
                    {item.statusLabel}
                  </span>
                </div>

                <h4 className="telemetry-node-title">{item.title}</h4>

                <div className="telemetry-progress-track" aria-hidden="true">
                  <div
                    className={`telemetry-progress-fill ${fillClass}`}
                    style={{ '--telemetry-progress': `${item.progress}%`, width: `${item.progress}%` }}
                  />
                </div>

                <div className="telemetry-node-bottom">
                  <span className="telemetry-metric-text">{item.metricLabel}</span>
                  <span className="telemetry-detail-text">{item.speedOrDetail}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrafficInfrastructureTelemetry;
