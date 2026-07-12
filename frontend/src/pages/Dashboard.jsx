import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/dashboardService';
import Loader from '../Components/common/Loader';
import { AlertTriangle, Clock, Layers, Users, ArrowRight } from 'lucide-react';
import { formatDate, getSeverityBadgeClass, getStatusBadgeClass } from '../utils/helpers';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Failed to load control room data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div style={{ color: 'var(--color-danger)', padding: '24px' }}>Error: {error}</div>;

  const cardStyle = {
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  };

  const statNumberStyle = {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: '4px 0',
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Title */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Terminal Center
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Real-time diagnostics and grid event notifications
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Card 1: Active Incidents */}
        <div style={cardStyle} className="glass-panel">
          <div 
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '12px',
              borderRadius: '12px',
              color: 'var(--color-danger)',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>Active Incidents</p>
            <p style={statNumberStyle}>{stats.activeIncidents}</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              {stats.resolvedIncidents} recently resolved
            </span>
          </div>
        </div>

        {/* Card 2: Active Outages */}
        <div style={cardStyle} className="glass-panel">
          <div 
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '12px',
              borderRadius: '12px',
              color: 'var(--color-warning)',
            }}
          >
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>Active Outages</p>
            <p style={statNumberStyle}>{stats.activeOutages}</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Planned: {stats.totalOutages - stats.activeOutages}
            </span>
          </div>
        </div>

        {/* Card 3: Impacted Customers */}
        <div style={cardStyle} className="glass-panel">
          <div 
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '12px',
              borderRadius: '12px',
              color: 'var(--color-info)',
            }}
          >
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>Impacted Connections</p>
            <p style={statNumberStyle}>{stats.totalAffectedCustomers.toLocaleString()}</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Across active sectors
            </span>
          </div>
        </div>

        {/* Card 4: Critical Sectors */}
        <div style={cardStyle} className="glass-panel">
          <div 
            style={{
              background: 'rgba(139, 92, 246, 0.1)',
              padding: '12px',
              borderRadius: '12px',
              color: 'var(--accent-secondary)',
            }}
          >
            <Layers size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: '600' }}>Critical Sectors</p>
            <p style={statNumberStyle}>{stats.criticalGrids}</p>
            <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
              Total monitored: {stats.totalGrids}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Status Overview (Premium Graphical Detail) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Grid Capacity Loads</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          {stats.grids.map(grid => {
            const capacityVal = parseInt(grid.capacity) || 100;
            const loadVal = parseInt(grid.currentLoad) || 0;
            const percentage = Math.min(Math.round((loadVal / capacityVal) * 100), 100);
            
            let color = 'var(--color-success)';
            if (percentage > 85) color = 'var(--color-danger)';
            else if (percentage > 70) color = 'var(--color-warning)';

            return (
              <div key={grid.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ fontWeight: '600' }}>{grid.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{percentage}%</span>
                </div>
                {/* Custom Styled Load Indicator */}
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 1s ease-out' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>Load: {grid.currentLoad}</span>
                  <span>Cap: {grid.capacity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tables Row: Recent Incidents vs Recent Outages */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Left Side: Recent Incidents */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Recent Incidents</h3>
            <Link 
              to="/incidents" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}
            >
              All incidents <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentIncidents.map(inc => (
              <div 
                key={inc.id} 
                style={{ 
                  padding: '14px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: 'var(--border-radius-sm)',
                  borderLeft: `3px solid ${inc.severity === 'CRITICAL' ? 'var(--color-danger)' : inc.severity === 'HIGH' ? 'var(--color-warning)' : 'var(--color-info)'}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{inc.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatDate(inc.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`badge ${getSeverityBadgeClass(inc.severity)}`}>{inc.severity}</span>
                  <span className={`badge ${getStatusBadgeClass(inc.status)}`}>{inc.status.replace('_', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Recent Outages */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Active &amp; Planned Outages</h3>
            <Link 
              to="/outages" 
              style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}
            >
              All outages <ArrowRight size={14} />
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentOutages.map(out => (
              <div 
                key={out.id} 
                style={{ 
                  padding: '14px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: 'var(--border-radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>{out.title}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Customers Affected: {out.affectedCustomers}</span>
                </div>
                <span className={`badge ${getStatusBadgeClass(out.status)}`}>{out.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
