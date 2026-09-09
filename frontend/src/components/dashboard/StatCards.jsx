import React from 'react';

const StatCards = (props) => {
  // Support both props.stats or direct props { totalIncidents, activeOutages, congestedZones, criticalAlerts }
  const totalIncidents = props.totalIncidents ?? props.stats?.totalIncidents ?? 0;
  const activeOutages = props.activeOutages ?? props.stats?.activeOutages ?? 0;
  const congestedZones = props.congestedZones ?? props.stats?.congestedZones ?? 0;
  const criticalAlerts = props.criticalAlerts ?? props.stats?.criticalAlerts ?? 0;

  const cards = [
    {
      title: 'Total Incidents',
      value: totalIncidents,
      type: 'incidents',
      icon: '🚨',
      subtext: 'Active traffic & utility alerts',
    },
    {
      title: 'Active Outages',
      value: activeOutages,
      type: 'outages',
      icon: '⚡',
      subtext: 'Grids undergoing restoration',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      type: 'alerts',
      icon: '⚠️',
      subtext: 'High priority broadcasts',
    },
    {
      title: 'Congested Zones',
      value: congestedZones,
      type: 'zones',
      icon: '🚦',
      subtext: 'High/severe traffic volume',
    },
  ];

  return (
    <div className="stat-cards stat-cards-grid">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`stat-card stat-card-${card.type}`}
        >
          <div className="stat-card-accent-bar" />

          <div className="stat-card-details">
            <p className="stat-card-label">
              {card.title}
            </p>
            <h3 className="stat-card-value">
              {card.value}
            </h3>
            <p className="stat-card-sub">
              {card.subtext}
            </p>
          </div>

          <div className="stat-card-icon-box">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;