import React from 'react';

const StatCards = (props) => {
  const totalIncidents = props.totalIncidents ?? props.stats?.totalIncidents ?? 0;
  const activeOutages = props.activeOutages ?? props.stats?.activeOutages ?? 0;
  const criticalAlerts = props.criticalAlerts ?? props.stats?.criticalAlerts ?? 0;
  const congestedZones = props.congestedZones ?? props.stats?.congestedZones ?? 0;

  const cards = [
    {
      title: 'Total Incidents',
      value: totalIncidents,
      variant: 'incident',
      icon: '🚨',
      tag: 'INCIDENT TELEMETRY',
    },
    {
      title: 'Active Outages',
      value: activeOutages,
      variant: 'outage',
      icon: '⚡',
      tag: 'GRID MONITOR',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      variant: 'alert',
      icon: '⚠️',
      tag: 'PRIORITY QUEUE',
    },
    {
      title: 'Congested Zones',
      value: congestedZones,
      variant: 'zone',
      icon: '🚦',
      tag: 'TRAFFIC DENSITY',
    },
  ];

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
        </div>
      ))}
    </div>
  );
};

export default StatCards;