import React from 'react';
import {
  AlertTriangle,
  Zap,
  Activity,
  Car,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Radio,
  Flame
} from 'lucide-react';
import AnimatedCounter from '../common/AnimatedCounter';

const StatCards = (props) => {
  // Support both props.stats or direct props { totalIncidents, activeOutages, congestedZones, criticalAlerts }
  const totalIncidents = props.totalIncidents ?? props.stats?.totalIncidents ?? 0;
  const activeOutages = props.activeOutages ?? props.stats?.activeOutages ?? 0;
  const congestedZones = props.congestedZones ?? props.stats?.congestedZones ?? 0;
  const criticalAlerts = props.criticalAlerts ?? props.stats?.criticalAlerts ?? 0;

  const cards = [
    {
      title: 'Active Incidents',
      value: totalIncidents,
      type: 'incidents',
      icon: Flame,
      trend: '-12.4%',
      trendUp: false,
      subtext: 'Road collisions & lane hazards',
      sparkline: 'M 0 20 L 15 15 L 30 18 L 45 8 L 60 12 L 75 4 L 90 2',
      color: '#ef4444',
    },
    {
      title: 'Active Grid Outages',
      value: activeOutages,
      type: 'outages',
      icon: Zap,
      trend: '-25.0%',
      trendUp: false,
      subtext: 'Utility subgrids in restoration',
      sparkline: 'M 0 10 L 20 18 L 40 12 L 60 16 L 80 8 L 90 4',
      color: '#38bdf8',
    },
    {
      title: 'Critical Alerts',
      value: criticalAlerts,
      type: 'alerts',
      icon: ShieldAlert,
      trend: '+2 new',
      trendUp: true,
      subtext: 'High-priority emergency alerts',
      sparkline: 'M 0 18 L 20 14 L 40 22 L 60 10 L 80 12 L 90 20',
      color: '#f59e0b',
    },
    {
      title: 'Congested Corridors',
      value: congestedZones,
      type: 'zones',
      icon: Activity,
      trend: '+4.8%',
      trendUp: true,
      subtext: 'High saturation road corridors',
      sparkline: 'M 0 22 L 18 16 L 36 18 L 54 8 L 72 14 L 90 6',
      color: '#a855f7',
    },
  ];

  return (
    <div className="stat-cards stat-cards-grid">
      {cards.map((card, idx) => {
        const IconComp = card.icon || Activity;
        return (
          <div
            key={idx}
            className={`stat-card stat-card-${card.type} glass-panel`}
          >
            <div className="stat-card-top-row">
              <div
                className="stat-card-icon-box"
                style={{ backgroundColor: `${card.color}18`, color: card.color }}
              >
                <IconComp size={18} />
              </div>

              <div className={`trend-badge ${card.trendUp ? 'trend-up' : 'trend-down'}`}>
                {card.trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span>{card.trend}</span>
              </div>
            </div>

            <div className="stat-card-details">
              <p className="stat-card-label">{card.title}</p>
              <div className="stat-card-value-row">
                <h3 className="stat-card-value">
                  <AnimatedCounter value={card.value} />
                </h3>
                {/* Mini SVG Sparkline */}
                <div className="stat-card-sparkline">
                  <svg viewBox="0 0 90 24" width="72" height="20" fill="none">
                    <path
                      d={card.sparkline}
                      stroke={card.color}
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <p className="stat-card-sub">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;