import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UtilityHealthCard.css';

const UtilityHealthCard = ({ grids = [], outages = [], loading = false }) => {
  const navigate = useNavigate();

  const getGridIcon = (type = '', name = '') => {
    const t = `${type} ${name}`.toUpperCase();
    if (t.includes('POWER') || t.includes('ELECTRIC') || t.includes('ENERGY')) return '⚡';
    if (t.includes('WATER') || t.includes('HYDRO') || t.includes('AQUEDUCT')) return '💧';
    if (t.includes('GAS') || t.includes('FUEL')) return '🔥';
    if (t.includes('LIGHT') || t.includes('ILLUMINATION')) return '💡';
    if (t.includes('WASTE') || t.includes('SANITATION')) return '♻️';
    if (t.includes('TELECOM') || t.includes('FIBER') || t.includes('NETWORK')) return '📡';
    return '🔌';
  };

  const getGridHealth = (grid, hasOutage) => {
    if (hasOutage) return 72;
    const status = (grid.status || 'OPERATIONAL').toUpperCase();
    if (status === 'OPERATIONAL') {
      const load = grid.capacityUnits && grid.capacityUnits > 0 ? (grid.currentLoad / grid.capacityUnits) : 0.7;
      return Math.max(85, Math.min(100, Math.round(100 - (load > 0.85 ? 12 : 3))));
    }
    if (status === 'DEGRADED') return 74;
    if (status === 'MAINTENANCE') return 65;
    return 40;
  };

  const getGridCondition = (grid, hasOutage) => {
    if (hasOutage) return 'Outage Active';
    const cap = grid.capacityUnits || 0;
    const load = grid.currentLoad || 0;
    if (cap > 0) {
      const pct = Math.round((load / cap) * 100);
      return `Load: ${pct}% (${load}/${cap} Units)`;
    }
    return grid.status || 'Active';
  };

  const overallHealth =
    grids.length > 0
      ? Math.round(
          grids.reduce((sum, g) => {
            const hasOutage = outages.some(
              (o) => o.gridId === (g.gridId || g.id) && o.status !== 'RESTORED'
            );
            return sum + getGridHealth(g, hasOutage);
          }, 0) / grids.length
        )
      : outages.length > 0
      ? Math.max(0, 100 - outages.filter((o) => o.status !== 'RESTORED').length * 15)
      : 100;

  if (loading) {
    return (
      <div className="utility-health-card skeleton-chart-panel" aria-busy="true">
        <div className="card-header-flex">
          <h3>Utility Infrastructure Health</h3>
        </div>
        <div className="skeleton-line skeleton-utility-health" />
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

      {grids.length === 0 ? (
        <div className="empty-state-compact">
          <span className="empty-state-dot" aria-hidden="true" />
          <p className="no-data-text">No utility grids registered in system.</p>
          <span className="empty-state-sub">Create or monitor utility grids to track infrastructure health.</span>
        </div>
      ) : (
        <div className="utility-list-compact">
          {grids.slice(0, 5).map((grid) => {
            const gridId = grid.gridId || grid.id;
            const hasOutage = outages.some(
              (o) => o.gridId === gridId && o.status !== 'RESTORED'
            );
            const health = getGridHealth(grid, hasOutage);
            const condition = getGridCondition(grid, hasOutage);
            const icon = getGridIcon(grid.gridType, grid.gridName);
            const statusText = hasOutage ? 'Outage' : grid.status || 'OPERATIONAL';

            const isWarning = hasOutage || (grid.status && (grid.status === 'DEGRADED' || grid.status === 'WARNING'));
            const isMaintenance = grid.status === 'MAINTENANCE';
            const statusClass = isWarning ? 'badge-warning' : isMaintenance ? 'badge-maintenance' : 'badge-nominal';
            const progressClass = isWarning ? 'progress-amber' : isMaintenance ? 'progress-purple' : 'progress-cyan';

            return (
              <div
                key={gridId || grid.gridName}
                className="utility-row-item"
                onClick={() => navigate('/utility-grids')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/utility-grids');
                  }
                }}
              >
                <div className="utility-row-top">
                  <div className="utility-name-group">
                    <span className="utility-icon" aria-hidden="true">{icon}</span>
                    <span className="utility-name">{grid.gridName}</span>
                  </div>
                  <div className="utility-status-group">
                    <span className={`utility-status-pill ${statusClass}`}>
                      {statusText}
                    </span>
                    <span className="utility-health-number">{health}%</span>
                  </div>
                </div>

                <div className="utility-progress-track" aria-hidden="true">
                  <div
                    className={`utility-progress-fill ${progressClass}`}
                    style={{ '--utility-health-pct': `${health}%`, width: `${health}%` }}
                  />
                </div>

                <div className="utility-row-bottom">
                  <span className="utility-condition-label">{condition}</span>
                  <span className="utility-grid-count">{grid.district ? `District: ${grid.district}` : 'Grid Online'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card-action-footer">
        <div className="card-footer-meta">
          <span className="meta-icon" aria-hidden="true">🔌</span>
          <span>{grids.length} Active Infrastructure Grids</span>
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
