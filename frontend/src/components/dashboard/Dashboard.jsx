import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../services/api';
import { fetchAll as fetchIncidents } from '../../store/slices/trafficIncidentSlice';
import { fetchAll as fetchOutages } from '../../store/slices/utilityOutageSlice';
import { fetchAll as fetchZones } from '../../store/slices/trafficZoneSlice';
import { fetchAll as fetchAlerts } from '../../store/slices/alertNotificationSlice';
import StatCards from './StatCards';
import IncidentStatusDonut from './IncidentStatusDonut';
import RecentActivity from './RecentActivity';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    totalIncidents: 0,
    activeOutages: 0,
    congestedZones: 0,
    criticalAlerts: 0,
  });

  const incidents = useSelector((state) => state.trafficIncident?.items || []);
  const outages = useSelector((state) => state.utilityOutage?.items || []);
  const zones = useSelector((state) => state.trafficZone?.items || []);
  const alerts = useSelector((state) => state.alertNotification?.items || []);

  useEffect(() => {
    dispatch(fetchIncidents());
    dispatch(fetchOutages());
    dispatch(fetchZones());
    dispatch(fetchAlerts());

    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        if (response.data) {
          setStats(response.data);
        }
      } catch (err) {
        // Fallback to calculated stats from slices
      }
    };

    fetchStats();
  }, [dispatch]);

  // Combine calculated stats if backend stats are empty
  const computedStats = {
    totalIncidents: stats.totalIncidents || incidents.length,
    activeOutages: stats.activeOutages || outages.filter((o) => o.status !== 'RESTORED').length,
    congestedZones: stats.congestedZones || zones.filter((z) => z.currentCongestionLevel === 'HIGH' || z.currentCongestionLevel === 'SEVERE').length,
    criticalAlerts: stats.criticalAlerts || alerts.filter((a) => a.severity === 'CRITICAL' && !a.isRead).length,
  };

  const recentActivities = [
    ...incidents.slice(0, 3).map((i) => ({
      icon: '🚨',
      title: `Incident: ${i.title}`,
      description: `Status: ${i.status || 'REPORTED'} - Severity: ${i.severity}`,
      time: i.reportedAt ? new Date(i.reportedAt).toLocaleTimeString() : 'Recent',
    })),
    ...outages.slice(0, 2).map((o) => ({
      icon: '⚡',
      title: `Outage: ${o.affectedArea}`,
      description: `Type: ${o.outageType} - Status: ${o.status || 'ACTIVE'}`,
      time: o.startTime ? new Date(o.startTime).toLocaleTimeString() : 'Recent',
    })),
  ];

  return (
    <div className="dashboard-container">
      {/* Executive Command Header */}
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">
            Smart City Operations Dashboard
          </h1>
          <p className="page-subtitle">
            Real-time municipal situational awareness, infrastructure monitoring & active incidents
          </p>
        </div>

        {/* Operational Status Pill */}
        <div
          className="user-badge-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            minHeight: '44px',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Command Center Status
            </span>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Live Telemetry Connected
            </span>
          </div>
        </div>
      </div>

      <StatCards
        totalIncidents={computedStats.totalIncidents}
        activeOutages={computedStats.activeOutages}
        congestedZones={computedStats.congestedZones}
        criticalAlerts={computedStats.criticalAlerts}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <IncidentStatusDonut incidents={incidents} />
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;
