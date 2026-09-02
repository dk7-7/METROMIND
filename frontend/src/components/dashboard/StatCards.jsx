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
      color: '#2563eb',
      bgColor: '#eff6ff',
      icon: '🚨',
    },
    {
      title: 'Active Outages',
      value: activeOutages,
      color: '#ea580c',
      bgColor: '#fff7ed',
      icon: '⚡',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      color: '#dc2626',
      bgColor: '#fef2f2',
      icon: '⚠️',
    },
    {
      title: 'Congested Zones',
      value: congestedZones,
      color: '#d97706',
      bgColor: '#fffbeb',
      icon: '🚦',
    },
  ];

  return (
    <div
      className="stat-cards-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="stat-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            padding: '1.25rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#64748b',
                marginBottom: '0.35rem',
              }}
            >
              {card.title}
            </p>
            <h3
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              {card.value}
            </h3>
          </div>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: card.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;