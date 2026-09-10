import React from 'react';

const StatCards = (props) => {
  const totalIncidents = props.totalIncidents ?? props.stats?.totalIncidents ?? 0;
  const activeOutages = props.activeOutages ?? props.stats?.activeOutages ?? 0;
  const criticalAlerts = props.criticalAlerts ?? props.stats?.criticalAlerts ?? 0;
  const congestedZones = props.congestedZones ?? props.stats?.congestedZones ?? 0;
  const loading = props.loading ?? false;

  const cards = [
    {
      title: 'Total Incidents',
      value: totalIncidents,
      variant: 'incident',
      icon: '🚨',
      tag: 'INCIDENT TELEMETRY',
      status: totalIncidents > 0 ? `${totalIncidents} active logs` : 'Operational',
      isNormal: totalIncidents === 0,
    },
    {
      title: 'Active Outages',
      value: activeOutages,
      variant: 'outage',
      icon: '⚡',
      tag: 'GRID MONITOR',
      status: activeOutages > 0 ? `${activeOutages} grid events` : 'All grids nominal',
      isNormal: activeOutages === 0,
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      variant: 'alert',
      icon: '⚠️',
      tag: 'PRIORITY QUEUE',
      status: criticalAlerts > 0 ? 'Action required' : 'No unread alerts',
      isNormal: criticalAlerts === 0,
    },
    {
      title: 'Congested Zones',
      value: congestedZones,
      variant: 'zone',
      icon: '🚦',
      tag: 'TRAFFIC DENSITY',
      status: congestedZones > 0 ? 'Flow restricted' : 'Smooth transit',
      isNormal: congestedZones === 0,
    },
  ];

  if (loading) {
    return (
      <div className="stat-cards" aria-busy="true">
        {[1, 2, 3, 4].map((n) => (
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
    <div className="stat-cards">
      {cards.map((card, idx) => (
        <div key={idx} className={`stat-card stat-card-${card.variant}`}>
          <div className="stat-card-top">
            <span className="stat-card-icon" aria-hidden="true">
              {card.icon}
            </span>
            <span className="stat-card-tag">{card.tag}</span>
          </div>
          <p className="stat-card-label">{card.title}</p>
          <div className="stat-card-metric-row">
            <h3 className="stat-card-value">{card.value}</h3>
            <span className="stat-card-pulse" aria-hidden="true" />
          </div>
          <div className="stat-card-footer">
            <span className={`stat-card-status ${card.isNormal ? 'status-nominal' : 'status-elevated'}`}>
              <span className="status-indicator-dot" aria-hidden="true" />
              {card.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;