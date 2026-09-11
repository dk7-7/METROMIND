import React from 'react';
import { useNavigate } from 'react-router-dom';

const UtilityHealthCard = ({ grids = [], outages = [], loading = false }) => {
  const navigate = useNavigate();

  // If grids exist in store, calculate or group by type
  // Default base utility infrastructure rows
  const utilityCategories = [
    {
      id: 'power',
      name: 'Power Grid',
      icon: '⚡',
      typeMatch: ['ELECTRIC', 'POWER', 'GRID', 'SUBSTATION'],
      defaultHealth: 98,
      defaultStatus: 'Operational',
      defaultCondition: 'High Efficiency',
    },
    {
      id: 'water',
      name: 'Water Supply',
      icon: '💧',
      typeMatch: ['WATER', 'AQUEDUCT', 'HYDRO'],
      defaultHealth: 94,
      defaultStatus: 'Stable',
      defaultCondition: 'Pressure Normal',
    },
    {
      id: 'waste',
      name: 'Waste Management',
      icon: '♻️',
      typeMatch: ['WASTE', 'SANITATION', 'RECYCLING'],
      defaultHealth: 91,
      defaultStatus: 'Operational',
      defaultCondition: 'Capacity 68%',
    },
    {
      id: 'lighting',
      name: 'Street Lighting',
      icon: '💡',
      typeMatch: ['LIGHT', 'LIGHTING', 'ILLUMINATION'],
      defaultHealth: 88,
      defaultStatus: 'Maintenance',
      defaultCondition: 'Scheduled Check',
    },
  ];

  // Dynamically enrich utility data if grids are available
  const utilities = utilityCategories.map((cat) => {
    const matchingGrids = grids.filter((g) => {
      const gType = (g.gridType || g.gridName || '').toUpperCase();
      return cat.typeMatch.some((m) => gType.includes(m));
    });

    const activeOutageForCat = outages.some((o) => {
      const oType = (o.outageType || o.affectedArea || '').toUpperCase();
      return cat.typeMatch.some((m) => oType.includes(m));
    });

    let health = cat.defaultHealth;
    let status = cat.defaultStatus;
    let condition = cat.defaultCondition;

    if (matchingGrids.length > 0) {
      const totalCap = matchingGrids.reduce((s, g) => s + (g.capacityUnits || 100), 0);
      const totalLoad = matchingGrids.reduce((s, g) => s + (g.currentLoad || 50), 0);
      const loadRatio = totalCap > 0 ? (totalLoad / totalCap) * 100 : 70;
      health = Math.max(75, Math.min(100, Math.round(100 - (activeOutageForCat ? 18 : loadRatio * 0.15))));
      condition = activeOutageForCat ? 'Outage Reported' : `Load: ${Math.round(loadRatio)}%`;
      status = activeOutageForCat ? 'Attention Req' : health >= 90 ? 'Operational' : 'Maintenance';
    } else if (activeOutageForCat) {
      health = 82;
      status = 'Warning';
      condition = 'Outage Active';
    }

    return {
      ...cat,
      health,
      status,
      condition,
    };
  });

  const overallHealth = Math.round(
    utilities.reduce((sum, u) => sum + u.health, 0) / utilities.length
  );

  if (loading) {
    return (
      <div className="utility-health-card skeleton-chart-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Utility Infrastructure Health</h3>
        </div>
        <div className="skeleton-line" style={{ height: '180px' }} />
      </div>
    );
  }

  return (
    <div className="utility-health-card">
      <div className="card-header-flex">
        <div className="header-title-group">
          <span className="card-header-icon" aria-hidden="true">⚡</span>
          <h3>Utility Infrastructure Health</h3>
        </div>
        <div className="header-badge-group">
          <span className="telemetry-badge health-overall-badge">
            <span className="status-live-beacon" aria-hidden="true" />
            {overallHealth}% OPERATIONAL
          </span>
        </div>
      </div>

      <div className="utility-list-compact">
        {utilities.map((item) => {
          const isWarning = item.status.toLowerCase().includes('warning') || item.status.toLowerCase().includes('attention');
          const isMaintenance = item.status.toLowerCase().includes('maintenance');
          const statusClass = isWarning ? 'badge-warning' : isMaintenance ? 'badge-maintenance' : 'badge-nominal';
          const progressClass = isWarning ? 'progress-amber' : isMaintenance ? 'progress-purple' : 'progress-cyan';

          return (
            <div key={item.id} className="utility-row-item">
              <div className="utility-row-top">
                <div className="utility-name-group">
                  <span className="utility-icon" aria-hidden="true">{item.icon}</span>
                  <span className="utility-name">{item.name}</span>
                </div>
                <div className="utility-status-group">
                  <span className={`utility-status-pill ${statusClass}`}>
                    {item.status}
                  </span>
                  <span className="utility-health-number">{item.health}%</span>
                </div>
              </div>

              <div className="utility-progress-track" aria-hidden="true">
                <div
                  className={`utility-progress-fill ${progressClass}`}
                  style={{ width: `${item.health}%` }}
                />
              </div>

              <div className="utility-row-bottom">
                <span className="utility-condition-label">{item.condition}</span>
                <span className="utility-grid-count">Telemetry Nominal</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-action-footer">
        <div className="card-footer-meta">
          <span className="meta-icon" aria-hidden="true">🔌</span>
          <span>Municipal Grid Sync Active</span>
        </div>
        <button
          type="button"
          className="btn-card-action"
          onClick={() => navigate('/utility-grids')}
          aria-label="View utility grids"
        >
          <span>View Utility Grids</span>
          <span className="action-arrow" aria-hidden="true">➔</span>
        </button>
      </div>
    </div>
  );
};

export default UtilityHealthCard;
