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
    <div className="dashboard-container" style={{ padding: '2rem 1.5rem 3rem 1.5rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Executive Command Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div className="page-title-group">
          <h1 className="page-title" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem 0', letterSpacing: '-0.02em' }}>
            Smart City Operations Dashboard
          </h1>
          <p className="page-subtitle" style={{ color: '#64748b', margin: 0, fontSize: '0.925rem' }}>
            Real-time municipal situational awareness, infrastructure monitoring & active incidents
          </p>
        </div>

        {/* Operational Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
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
            <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Command Center Status
            </span>
            <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
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
