import React from 'react';
import { useNavigate } from 'react-router-dom';

const TrafficInfrastructureTelemetry = ({ zones = [], grids = [], loading = false }) => {
  const navigate = useNavigate();

  // Combine zones with grid telemetry to create balanced multi-domain rows
  const telemetryRows = [];

  // 1. Traffic Zone Telemetry
  zones.forEach((zone) => {
    const congestion = zone.currentCongestionLevel || 'LOW';
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
      title: zone.zoneName || 'Sector Zone',
      metricLabel: `Traffic Load ${loadPct}%`,
      statusLabel: flowStatus,
      speedOrDetail: zone.averageSpeed ? `${zone.averageSpeed} km/h avg` : 'Nominal Speed',
      progress: loadPct,
      variant: congestion === 'SEVERE' || congestion === 'HIGH' ? 'amber' : 'cyan',
      icon: '🚦',
      link: '/traffic-zones',
    });
  });

  // 2. Utility Grid Telemetry
  grids.forEach((grid) => {
    const cap = grid.capacityUnits || 100;
    const load = grid.currentLoad || 60;
    const loadPct = Math.min(100, Math.round((load / cap) * 100));
    const status = grid.status || 'OPERATIONAL';

    telemetryRows.push({
      id: `grid-${grid.gridId || grid.id || grid.gridName}`,
      domain: 'UTILITY GRID',
      title: `${grid.gridName} (${grid.district || 'Metro'})`,
      metricLabel: `Utility Capacity ${loadPct}%`,
      statusLabel: status === 'OPERATIONAL' ? 'Stable' : 'Attention',
      speedOrDetail: `${load} / ${cap} Units`,
      progress: loadPct,
      variant: status === 'OPERATIONAL' ? 'green' : 'amber',
      icon: '⚡',
      link: '/utility-grids',
    });
  });

  // Fallback defaults if store is empty yet
  if (telemetryRows.length === 0) {
    telemetryRows.push(
      {
        id: 'row-1',
        domain: 'TRAFFIC DENSITY',
        title: 'KOT Arterial Corridor',
        metricLabel: 'Traffic Load 55%',
        statusLabel: 'Flowing',
        speedOrDetail: '48 km/h avg',
        progress: 55,
        variant: 'cyan',
        icon: '🚦',
        link: '/traffic-zones',
      },
      {
        id: 'row-2',
        domain: 'UTILITY GRID',
        title: 'Sector 7 Power Substation',
        metricLabel: 'Utility Capacity 72%',
        statusLabel: 'Stable',
        speedOrDetail: '360 / 500 Units',
        progress: 72,
        variant: 'green',
        icon: '⚡',
        link: '/utility-grids',
      },
      {
        id: 'row-3',
        domain: 'WATER NETWORK',
        title: 'Zone 3 Aqueduct & Reservoir',
        metricLabel: 'Infrastructure Health 91%',
        statusLabel: 'Operational',
        speedOrDetail: 'Pressure 4.2 Bar',
        progress: 91,
        variant: 'cyan',
        icon: '💧',
        link: '/utility-grids',
      },
      {
        id: 'row-4',
        domain: 'COMMUNICATIONS',
        title: 'Downtown Optical Mesh Relay',
        metricLabel: 'Data Throughput 64%',
        statusLabel: 'Operational',
        speedOrDetail: '99.98% Uptime',
        progress: 64,
        variant: 'green',
        icon: '📡',
        link: '/utility-grids',
      }
    );
  }

  if (loading) {
    return (
      <div className="traffic-infra-telemetry-panel skeleton-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Traffic & Infrastructure Telemetry</h3>
        </div>
        <div className="skeleton-line" style={{ height: '140px' }} />
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

      <div className="telemetry-compact-grid">
        {telemetryRows.slice(0, 6).map((item) => {
          const isWarning = item.variant === 'amber' || item.statusLabel.toLowerCase().includes('restricted') || item.statusLabel.toLowerCase().includes('gridlock');
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
                  style={{ width: `${item.progress}%` }}
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
    </div>
  );
};

export default TrafficInfrastructureTelemetry;
