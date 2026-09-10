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
    },
    {
      title: 'Active Outages',
      value: activeOutages,
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
    },
    {
      title: 'Congested Zones',
      value: congestedZones,
    },
  ];

  return (
    <div className="stat-cards">
      {cards.map((card, idx) => (
        <div key={idx} className="stat-card">
          <p className="stat-card-label">{card.title}</p>
          <h3 className="stat-card-value">{card.value}</h3>
        </div>
      ))}
    </div>
  );
};

export default StatCards;