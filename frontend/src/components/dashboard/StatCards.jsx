import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatCards = ({
  totalIncidents = 0,
  activeOutages = 0,
  criticalAlerts = 0,
  congestedZones = 0,
  resolvedIncidents = 0,
  utilityHealth = 98.5,
  utilityLoad = 72,
  loading = false,
  stats,
}) => {
  const navigate = useNavigate();

  // Support props or stats object
  const incidentsCount = stats?.totalIncidents ?? totalIncidents;
  const outagesCount = stats?.activeOutages ?? activeOutages;
  const alertsCount = stats?.criticalAlerts ?? criticalAlerts;
  const resolvedCount = stats?.resolvedIncidents ?? resolvedIncidents;
  const healthRate = stats?.utilityHealth ?? utilityHealth;
  const loadRate = stats?.utilityLoad ?? utilityLoad;

  const resolutionPct =
    incidentsCount > 0
      ? Math.min(100, Math.round((resolvedCount / incidentsCount) * 100))
      : 100;

  const cards = [
    // 1. Total Incidents
    {
      category: 'INCIDENT TELEMETRY',
      title: 'Total Incidents',
      value: incidentsCount,
      icon: '🚨',
      subText: incidentsCount > 0 ? `${incidentsCount} Active Log${incidentsCount > 1 ? 's' : ''}` : 'All Clear',
      status: incidentsCount > 0 ? 'Active' : 'Nominal',
      state: incidentsCount > 0 ? 'elevated' : 'nominal',
      link: '/incidents',
      accent: 'cyan',
    },
    // 2. Critical Alerts
    {
      category: 'EMERGENCY DISPATCH',
      title: 'Critical Alerts',
      value: alertsCount,
      icon: '⚠️',
      subText: alertsCount > 0 ? `${alertsCount} Requires Action` : '0 Immediate Action',
      status: alertsCount > 0 ? 'Action Req' : 'Normal',
      state: alertsCount > 0 ? 'critical' : 'nominal',
      link: '/alerts',
      accent: alertsCount > 0 ? 'red' : 'green',
    },
    // 3. Incident Resolution
    {
      category: 'OPERATIONAL METRICS',
      title: 'Incident Resolution',
      value: `${resolutionPct}%`,
      icon: '✅',
      subText: `${resolvedCount} of ${incidentsCount || 1} Resolved`,
      status: resolutionPct >= 80 ? 'Optimal' : 'In Progress',
      state: resolutionPct >= 80 ? 'nominal' : 'warning',
      progress: resolutionPct,
      link: '/incidents',
      accent: 'green',
    },
    // 4. Active Outages
    {
      category: 'UTILITY INFRASTRUCTURE',
      title: 'Active Outages',
      value: outagesCount,
      icon: '⚡',
      subText: outagesCount > 0 ? `${outagesCount} Grid Area${outagesCount > 1 ? 's' : ''}` : 'Zero Outages',
      status: outagesCount > 0 ? `${outagesCount} Outage${outagesCount > 1 ? 's' : ''}` : 'Nominal',
      state: outagesCount > 0 ? 'warning' : 'nominal',
      link: '/outages',
      accent: outagesCount > 0 ? 'amber' : 'green',
    },
    // 5. Utility Health
    {
      category: 'GRID INTEGRITY',
      title: 'Utility Health',
      value: typeof healthRate === 'number' ? `${healthRate.toFixed(1)}%` : `${healthRate}%`,
      icon: '🛡️',
      subText: 'Infrastructure Online',
      status: 'Operational',
      state: 'nominal',
      progress: typeof healthRate === 'number' ? healthRate : 98,
      link: '/utility-grids',
      accent: 'cyan',
    },
    // 6. Utility Load
    {
      category: 'POWER & RESOURCE DEMAND',
      title: 'Utility Load',
      value: `${loadRate}%`,
      icon: '📊',
      subText: 'Average City Demand',
      status: loadRate > 85 ? 'High Load' : 'Balanced',
      state: loadRate > 85 ? 'warning' : 'nominal',
      progress: loadRate,
      link: '/utility-grids',
      accent: 'purple',
    },
  ];

  if (loading) {
    return (
      <div className="stat-cards-six-grid" aria-busy="true">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="stat-card skeleton-card">
            <div className="skeleton-line skeleton-title" />
            <div className="skeleton-line skeleton-value" />
            <div className="skeleton-line skeleton-sub" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="stat-cards-six-grid" role="region" aria-label="Key Performance Indicators">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`stat-card stat-card-hoverable accent-${card.accent}`}
          onClick={() => card.link && navigate(card.link)}
          tabIndex={0}
          role="button"
          aria-label={`${card.title}: ${card.value}, ${card.subText}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              card.link && navigate(card.link);
            }
          }}
        >
          <div className="stat-card-top">
            <span className="stat-card-tag">{card.category}</span>
            <span className="stat-card-icon" aria-hidden="true">
              {card.icon}
            </span>
          </div>

          <p className="stat-card-label">{card.title}</p>

          <div className="stat-card-metric-row">
            <h3 className="stat-card-value">{card.value}</h3>
            <span className={`stat-pill-badge badge-${card.state}`}>
              <span className="status-indicator-dot" aria-hidden="true" />
              {card.status}
            </span>
          </div>

          {card.progress !== undefined && (
            <div className="stat-card-progress-wrap" aria-hidden="true">
              <div className="stat-card-progress-track">
                <div
                  className={`stat-card-progress-fill progress-${card.accent}`}
                  style={{ width: `${Math.min(100, Math.max(0, card.progress))}%` }}
                />
              </div>
            </div>
          )}

          <div className="stat-card-footer">
            <span className="stat-card-subtext">{card.subText}</span>
            <span className="stat-card-nav-arrow" aria-hidden="true">➔</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;