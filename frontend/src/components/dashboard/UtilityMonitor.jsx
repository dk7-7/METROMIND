import React, { useState } from 'react';
import {
  Zap,
  Sun,
  Droplets,
  Activity,
  Wind,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Sliders
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import AnimatedCounter from '../common/AnimatedCounter';

const UtilityMonitor = ({ grids = [], outages = [] }) => {
  const [activeTab, setActiveTab] = useState('ALL');

  const utilitySectors = [
    {
      id: 'sec-power',
      type: 'ELECTRICITY',
      title: 'Municipal Power Grids',
      health: 82,
      status: 'OPTIMAL',
      primaryStat: '428 MW / 520 MW',
      primaryLabel: 'Grid Load Utilization',
      icon: Zap,
      accentColor: '#38bdf8',
      metrics: [
        { label: 'Substations Active', val: '14 / 14' },
        { label: 'Voltage Stability', val: '230.2 V' },
        { label: 'Renewable Feed', val: '28.4% Solar/Wind' },
      ],
      notice: 'All high-voltage substations operating within safe frequency bandwidth (50.02 Hz).',
    },
    {
      id: 'sec-lights',
      type: 'LIGHTING',
      title: 'Smart Street Lights Network',
      health: 94,
      status: 'OPTIMAL',
      primaryStat: '12,480 / 13,200',
      primaryLabel: 'Active LED Luminares',
      icon: Sun,
      accentColor: '#f59e0b',
      metrics: [
        { label: 'Adaptive Dimming', val: '65% (Eco Mode)' },
        { label: 'Power Conserved', val: '42.8 MWh / month' },
        { label: 'Faults Detected', val: '18 units flagged' },
      ],
      notice: 'Twilight photosensor auto-scheduling engaged citywide.',
    },
    {
      id: 'sec-water',
      type: 'WATER',
      title: 'Water Supply & Hydraulic Pressure',
      health: 71,
      status: 'WARNING',
      primaryStat: '68.4 PSI Avg',
      primaryLabel: 'Main Distribution Pressure',
      icon: Droplets,
      accentColor: '#00f0ff',
      metrics: [
        { label: 'Reservoir Capacity', val: '78.2%' },
        { label: 'Flow Rate', val: '4,850 L/min' },
        { label: 'Purity Index', val: '99.1% Potable' },
      ],
      notice: 'Secondary booster pump in Sector 3 undergoing scheduled hydraulic balancing.',
    },
    {
      id: 'sec-drain',
      type: 'DRAINAGE',
      title: 'Drainage & Flood Level Radar',
      health: 89,
      status: 'OPTIMAL',
      primaryStat: '24.2% Capacity',
      primaryLabel: 'Stormwater Sump Level',
      icon: Wind,
      accentColor: '#10b981',
      metrics: [
        { label: 'Sump Sensors', val: '108 Online' },
        { label: 'Sluice Gates', val: 'Automated Ready' },
        { label: 'Flood Risk Level', val: 'LOW (Green)' },
      ],
      notice: 'Runoff drainage flowing smoothly toward northern retention basin.',
    },
  ];

  const filteredSectors = activeTab === 'ALL'
    ? utilitySectors
    : utilitySectors.filter((s) => s.type === activeTab);

  return (
    <div className="utility-monitor-container glass-panel">
      {/* Header */}
      <div className="utility-header">
        <div className="utility-title-group">
          <div className="utility-badge">
            <Zap size={14} className="hud-icon-spin text-cyan" />
            <span>MUNICIPAL CRITICAL INFRASTRUCTURE GRID</span>
          </div>
          <h3 className="utility-title">
            Smart Utility & Resource Telemetry Monitor
          </h3>
          <p className="utility-subtitle">
            Autonomous health diagnostics for power substations, smart lighting, hydraulic systems & stormwater grids
          </p>
        </div>

        {/* Filter tabs */}
        <div className="utility-filter-tabs">
          {['ALL', 'ELECTRICITY', 'LIGHTING', 'WATER', 'DRAINAGE'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`filter-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Utility Infrastructure Cards */}
      <div className="utility-cards-grid">
        {filteredSectors.map((sector) => {
          const IconComp = sector.icon || Zap;

          return (
            <div key={sector.id} className="utility-card glass-panel">
              {/* Top Row */}
              <div className="utility-card-top">
                <div className="utility-type-box">
                  <div
                    className="utility-icon-pill"
                    style={{ backgroundColor: `${sector.accentColor}20`, color: sector.accentColor }}
                  >
                    <IconComp size={18} />
                  </div>
                  <div>
                    <h4 className="utility-card-title">{sector.title}</h4>
                    <span className="utility-type-tag">{sector.type} SECTOR</span>
                  </div>
                </div>

                <StatusBadge status={sector.status} size="sm" />
              </div>

              {/* Big Health Percentage Gauge */}
              <div className="utility-gauge-row">
                <div className="utility-gauge-metric">
                  <div className="gauge-number" style={{ color: sector.accentColor }}>
                    <AnimatedCounter value={sector.health} suffix="%" />
                  </div>
                  <span className="gauge-label">Operational Health Index</span>
                </div>

                <div className="utility-primary-stat-box">
                  <span className="stat-val">{sector.primaryStat}</span>
                  <span className="stat-label">{sector.primaryLabel}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="utility-progress-track">
                <div
                  className="utility-progress-fill"
                  style={{
                    width: `${sector.health}%`,
                    backgroundColor: sector.accentColor,
                    boxShadow: `0 0 12px ${sector.accentColor}80`,
                  }}
                />
              </div>

              {/* Metrics Grid */}
              <div className="utility-metrics-subgrid">
                {sector.metrics.map((m, idx) => (
                  <div key={idx} className="metric-box-sub">
                    <span className="m-label">{m.label}</span>
                    <span className="m-val">{m.val}</span>
                  </div>
                ))}
              </div>

              {/* Notice Banner */}
              <div className="utility-notice-strip">
                <span className="notice-icon">ℹ️</span>
                <span className="notice-text">{sector.notice}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UtilityMonitor;
