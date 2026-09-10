import React, { useState } from 'react';
import { BarChart2 } from 'lucide-react';

const AnalyticsSection = () => {
  const [timeRange, setTimeRange] = useState('TODAY');
  const [activeChartTab, setActiveChartTab] = useState('VOLUME');

  // 24-hr Traffic Volume vs Baseline Data (simulated high fidelity)
  const hourlyVolumeData = [
    { hour: '00:00', volume: 420, capacity: 1200, speed: 64 },
    { hour: '02:00', volume: 210, capacity: 1200, speed: 68 },
    { hour: '04:00', volume: 180, capacity: 1200, speed: 70 },
    { hour: '06:00', volume: 650, capacity: 1200, speed: 56 },
    { hour: '08:00', volume: 1420, capacity: 1200, speed: 38 }, // Rush
    { hour: '10:00', volume: 1180, capacity: 1200, speed: 45 },
    { hour: '12:00', volume: 1280, capacity: 1200, speed: 42 },
    { hour: '14:00', volume: 1100, capacity: 1200, speed: 48 },
    { hour: '16:00', volume: 1350, capacity: 1200, speed: 40 },
    { hour: '18:00', volume: 1680, capacity: 1200, speed: 28 }, // Peak Rush
    { hour: '20:00', volume: 1290, capacity: 1200, speed: 44 },
    { hour: '22:00', volume: 780, capacity: 1200, speed: 58 },
  ];

  // District congestion heatmap data (Sector 1-4 across 4 time periods)
  const heatmapData = [
    { sector: 'Sector 1 (Downtown Core)', morning: 85, afternoon: 62, evening: 92, night: 24 },
    { sector: 'Sector 2 (Tech Corridor)', morning: 74, afternoon: 48, evening: 78, night: 18 },
    { sector: 'Sector 3 (Harbor Bridge)', morning: 91, afternoon: 68, evening: 88, night: 32 },
    { sector: 'Sector 4 (Outer Ring Link)', morning: 38, afternoon: 28, evening: 44, night: 14 },
  ];

  const maxVolume = 1800;

  const getHeatmapColor = (val) => {
    if (val >= 80) return 'rgba(239, 68, 68, 0.85)'; // Critical Crimson
    if (val >= 60) return 'rgba(245, 158, 11, 0.85)'; // Amber
    if (val >= 40) return 'rgba(0, 240, 255, 0.7)'; // Cyan
    return 'rgba(16, 185, 129, 0.7)'; // Emerald Green
  };

  return (
    <div className="analytics-section-container glass-panel">
      {/* Header */}
      <div className="analytics-header">
        <div className="analytics-title-group">
          <div className="analytics-badge">
            <BarChart2 size={14} className="hud-icon-spin text-purple" />
            <span>MUNICIPAL DATA INTELLIGENCE & PATTERNS</span>
          </div>
          <h3 className="analytics-title">
            Smart City Traffic Dynamics & Operational Analytics
          </h3>
          <p className="analytics-subtitle">
            Longitudinal congestion index, speed distributions & multi-district telemetry matrices
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="time-range-pills">
          {['TODAY', 'THIS WEEK', 'THIS MONTH', 'CUSTOM RANGE'].map((range) => (
            <button
              key={range}
              type="button"
              className={`time-pill ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Main Layout Grid */}
      <div className="analytics-main-grid">
        {/* Left Card: 24-hr Traffic Volume vs Road Capacity Interactive Area Chart */}
        <div className="analytics-chart-card glass-panel">
          <div className="chart-card-header">
            <div>
              <h4 className="chart-title">24-Hour Traffic Volume vs Nominal Road Capacity</h4>
              <p className="chart-subtitle">Vehicles per hour across municipal key corridors</p>
            </div>
            <div className="chart-tab-pills">
              <button
                type="button"
                className={`chart-tab ${activeChartTab === 'VOLUME' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('VOLUME')}
              >
                Volume Flow
              </button>
              <button
                type="button"
                className={`chart-tab ${activeChartTab === 'SPEED' ? 'active' : ''}`}
                onClick={() => setActiveChartTab('SPEED')}
              >
                Avg Speed
              </button>
            </div>
          </div>

          {/* SVG Visual Area Chart */}
          <div className="svg-chart-wrapper">
            <svg viewBox="0 0 700 240" className="analytics-svg-chart">
              <defs>
                <linearGradient id="volumeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="speedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="30" x2="680" y2="30" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="680" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="40" y1="130" x2="680" y2="130" stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <line x1="40" y1="180" x2="680" y2="180" stroke="rgba(255,255,255,0.12)" />

              {/* Nominal Capacity Threshold Reference Line */}
              <line x1="40" y1="75" x2="680" y2="75" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="670" y="70" fill="#ef4444" fontSize="9" textAnchor="end" fontFamily="monospace">
                Capacity Limit (1,200 veh/hr)
              </text>

              {/* Path calculation for volume */}
              {activeChartTab === 'VOLUME' ? (
                <>
                  {/* Area fill */}
                  <path
                    d={`M 40 180 ${hourlyVolumeData
                      .map((d, i) => {
                        const x = 40 + (i / (hourlyVolumeData.length - 1)) * 640;
                        const y = 180 - (d.volume / maxVolume) * 150;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')} L 680 180 Z`}
                    fill="url(#volumeAreaGrad)"
                  />
                  {/* Stroke line */}
                  <path
                    d={`M 40 ${180 - (hourlyVolumeData[0].volume / maxVolume) * 150} ${hourlyVolumeData
                      .map((d, i) => {
                        const x = 40 + (i / (hourlyVolumeData.length - 1)) * 640;
                        const y = 180 - (d.volume / maxVolume) * 150;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Data Points */}
                  {hourlyVolumeData.map((d, i) => {
                    const x = 40 + (i / (hourlyVolumeData.length - 1)) * 640;
                    const y = 180 - (d.volume / maxVolume) * 150;
                    const isCongested = d.volume > d.capacity;

                    return (
                      <g key={i} className="chart-node">
                        <circle
                          cx={x}
                          cy={y}
                          r={isCongested ? 4.5 : 3.5}
                          fill={isCongested ? '#ef4444' : '#00f0ff'}
                          stroke="#0b1322"
                          strokeWidth="2"
                        />
                        <text x={x} y="200" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {d.hour}
                        </text>
                      </g>
                    );
                  })}
                </>
              ) : (
                <>
                  {/* Speed Area fill */}
                  <path
                    d={`M 40 180 ${hourlyVolumeData
                      .map((d, i) => {
                        const x = 40 + (i / (hourlyVolumeData.length - 1)) * 640;
                        const y = 180 - (d.speed / 80) * 150;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')} L 680 180 Z`}
                    fill="url(#speedAreaGrad)"
                  />
                  {/* Speed Stroke line */}
                  <path
                    d={`M 40 ${180 - (hourlyVolumeData[0].speed / 80) * 150} ${hourlyVolumeData
                      .map((d, i) => {
                        const x = 40 + (i / (hourlyVolumeData.length - 1)) * 640;
                        const y = 180 - (d.speed / 80) * 150;
                        return `L ${x} ${y}`;
                      })
                      .join(' ')}`}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Data Points */}
                  {hourlyVolumeData.map((d, i) => {
                    const x = 40 + (i / (hourlyVolumeData.length - 1)) * 640;
                    const y = 180 - (d.speed / 80) * 150;
                    return (
                      <g key={i} className="chart-node">
                        <circle cx={x} cy={y} r="3.5" fill="#a855f7" stroke="#0b1322" strokeWidth="2" />
                        <text x={x} y="200" fill="#64748b" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {d.hour}
                        </text>
                      </g>
                    );
                  })}
                </>
              )}
            </svg>
          </div>

          <div className="chart-summary-row">
            <div className="chart-summary-stat">
              <span className="s-label">Peak Inflow Period:</span>
              <span className="s-val text-crimson">18:00 (1,680 veh/hr • 140% Capacity)</span>
            </div>
            <div className="chart-summary-stat">
              <span className="s-label">Off-Peak Flow:</span>
              <span className="s-val text-emerald">02:00 - 05:00 (Free Velocity: 68 km/h)</span>
            </div>
          </div>
        </div>

        {/* Right Card: Multi-District Hourly Congestion Heatmap Matrix */}
        <div className="analytics-heatmap-card glass-panel">
          <div className="chart-card-header">
            <div>
              <h4 className="chart-title">District Congestion Intensity Heatmap</h4>
              <p className="chart-subtitle">Real-time saturation index across municipal sectors</p>
            </div>
          </div>

          <div className="heatmap-matrix-table">
            <div className="heatmap-matrix-header">
              <div className="col-sector">Sector Corridor</div>
              <div className="col-time">08:00 (Morning)</div>
              <div className="col-time">13:00 (Midday)</div>
              <div className="col-time">18:00 (Evening)</div>
              <div className="col-time">23:00 (Night)</div>
            </div>

            <div className="heatmap-matrix-rows">
              {heatmapData.map((row, idx) => (
                <div key={idx} className="heatmap-row">
                  <div className="col-sector sector-label">{row.sector}</div>
                  <div className="col-time heatmap-cell" style={{ backgroundColor: getHeatmapColor(row.morning) }}>
                    <span>{row.morning}%</span>
                  </div>
                  <div className="col-time heatmap-cell" style={{ backgroundColor: getHeatmapColor(row.afternoon) }}>
                    <span>{row.afternoon}%</span>
                  </div>
                  <div className="col-time heatmap-cell" style={{ backgroundColor: getHeatmapColor(row.evening) }}>
                    <span>{row.evening}%</span>
                  </div>
                  <div className="col-time heatmap-cell" style={{ backgroundColor: getHeatmapColor(row.night) }}>
                    <span>{row.night}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap Legend */}
          <div className="heatmap-legend-row">
            <div className="legend-entry">
              <span className="legend-swatch" style={{ backgroundColor: 'rgba(16, 185, 129, 0.85)' }} />
              <span>&lt;40% Smooth</span>
            </div>
            <div className="legend-entry">
              <span className="legend-swatch" style={{ backgroundColor: 'rgba(0, 240, 255, 0.85)' }} />
              <span>40-60% Flow</span>
            </div>
            <div className="legend-entry">
              <span className="legend-swatch" style={{ backgroundColor: 'rgba(245, 158, 11, 0.85)' }} />
              <span>60-80% Moderate</span>
            </div>
            <div className="legend-entry">
              <span className="legend-swatch" style={{ backgroundColor: 'rgba(239, 68, 68, 0.85)' }} />
              <span>&gt;80% Congested</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
