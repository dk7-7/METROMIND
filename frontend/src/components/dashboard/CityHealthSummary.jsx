import React from 'react';
import './CityHealthSummary.css';

const CityHealthSummary = ({
  incidents = [],
  outages = [],
  zones = [],
  alerts = [],
  grids = [],
  loading = false,
}) => {
  const activeIncidents = incidents.filter(
    (i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED'
  ).length;
  const criticalAlerts = alerts.filter(
    (a) => a.severity === 'CRITICAL' && !a.isRead
  ).length;
  const activeOutages = outages.filter((o) => o.status !== 'RESTORED').length;
  const severeCongestion = zones.filter(
    (z) => z.currentCongestionLevel === 'HIGH' || z.currentCongestionLevel === 'SEVERE'
  ).length;

  const incidentStatus =
    criticalAlerts > 0 || activeIncidents > 3
      ? { text: 'Attention Required', state: 'warning', dot: 'amber' }
      : { text: 'Stable & Monitored', state: 'nominal', dot: 'green' };

  const trafficStatus =
    severeCongestion > 0
      ? { text: `${severeCongestion} Sector${severeCongestion > 1 ? 's' : ''} Restricted`, state: 'warning', dot: 'amber' }
      : { text: 'Flowing Normally', state: 'nominal', dot: 'green' };

  const overallCityStatus =
    criticalAlerts > 0 || activeOutages > 1 || severeCongestion > 1
      ? { text: 'ATTENTION REQUIRED', state: 'elevated', dot: 'amber' }
      : { text: 'SYSTEM OPERATIONAL', state: 'nominal', dot: 'green' };

  if (loading) {
    return (
      <div className="city-health-summary skeleton-panel" aria-busy="true">
        <div className="skeleton-line skeleton-city-health" />
      </div>
    );
  }

  return (
    <section className="city-health-summary-panel" aria-label="City Operations Health">
      <div className="health-summary-header">
        <div className="health-summary-title-wrap">
          <span className="summary-beacon-icon" aria-hidden="true">🌐</span>
          <span className="health-summary-title">CITY OPERATIONS HEALTH</span>
        </div>
        <div className="health-overall-pill">
          <span className={`beacon-dot beacon-${overallCityStatus.dot}`} aria-hidden="true" />
          <span className="health-overall-label">{overallCityStatus.text}</span>
        </div>
      </div>

      <div className="health-metrics-grid">
        {/* 1. Incident Health */}
        <div className="health-metric-item">
          <div className="metric-header">
            <span className={`metric-dot dot-${incidentStatus.dot}`} />
            <span className="metric-label">Incident Health</span>
          </div>
          <div className="metric-value-row">
            <span className={`metric-badge badge-${incidentStatus.state}`}>
              {incidentStatus.text}
            </span>
          </div>
        </div>

        {/* 2. Traffic Health */}
        <div className="health-metric-item">
          <div className="metric-header">
            <span className={`metric-dot dot-${trafficStatus.dot}`} />
            <span className="metric-label">Traffic Health</span>
          </div>
          <div className="metric-value-row">
            <span className={`metric-badge badge-${trafficStatus.state}`}>
              {trafficStatus.text}
            </span>
          </div>
        </div>

        {/* 4. Overall City Status */}
        <div className="health-metric-item highlight-item">
          <div className="metric-header">
            <span className="metric-dot dot-cyan" />
            <span className="metric-label">Grid Telemetry</span>
          </div>
          <div className="metric-value-row">
            <span className="metric-badge badge-cyan">
              TLS 1.3 Active • 100% Synced
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityHealthSummary;
