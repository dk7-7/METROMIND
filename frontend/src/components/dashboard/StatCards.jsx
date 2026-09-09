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
      accentColor: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      icon: '🚨',
      subtext: 'Active traffic & utility alerts',
    },
    {
      title: 'Active Outages',
      value: activeOutages,
      color: '#ea580c',
      accentColor: '#f97316',
      bgColor: '#fff7ed',
      borderColor: '#fed7aa',
      icon: '⚡',
      subtext: 'Grids undergoing restoration',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      color: '#dc2626',
      accentColor: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      icon: '⚠️',
      subtext: 'High priority broadcasts',
    },
    {
      title: 'Congested Zones',
      value: congestedZones,
      color: '#d97706',
      accentColor: '#f59e0b',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      icon: '🚦',
      subtext: 'High/severe traffic volume',
    },
  ];

  return (
    <div
      className="stat-cards stat-cards-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="stat-card"
          style={{
            borderRadius: '16px',
            padding: '1.4rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '124px',
          }}
        >
          {/* Top accent bar */}
          <div
            className="stat-card-accent-bar"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3.5px',
              backgroundColor: card.accentColor,
              boxShadow: `0 1px 6px ${card.accentColor}88`,
            }}
          />

          <div>
            <p
              className="stat-card-label"
              style={{
                margin: 0,
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginBottom: '0.45rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {card.title}
            </p>
            <h3
              className="stat-card-value"
              style={{
                margin: 0,
                fontSize: '2.1rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
              }}
            >
              {card.value}
            </h3>
            <p
              className="stat-card-sub"
              style={{
                margin: '0.45rem 0 0 0',
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {card.subtext}
            </p>
          </div>

          <div
            className="stat-card-icon-box"
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: card.bgColor,
              border: `1px solid ${card.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              flexShrink: 0,
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