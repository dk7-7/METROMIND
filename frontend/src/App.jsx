import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import Navbar from './components/layout/Navbar';
import NotificationStack from './components/NotificationStack';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TrafficIncidentList from './components/trafficIncident/TrafficIncidentList';
import TrafficZoneList from './components/trafficZone/TrafficZoneList';
import UtilityGridList from './components/utilityGrid/UtilityGridList';
import UtilityOutageList from './components/utilityOutage/UtilityOutageList';
import FieldObservationList from './components/fieldObservation/FieldObservationList';
import AlertNotificationList from './components/alertNotification/AlertNotificationList';
import StatCards from './components/dashboard/StatCards';
import IncidentStatusDonut from './components/dashboard/IncidentStatusDonut';
import RecentActivity from './components/dashboard/RecentActivity';
import CityHealthSummary from './components/dashboard/CityHealthSummary';
import UtilityAlertsCard from './components/dashboard/UtilityAlertsCard';
import TrafficInfrastructureTelemetry from './components/dashboard/TrafficInfrastructureTelemetry';
import { fetchAll as fetchIncidents } from './store/slices/trafficIncidentSlice';
import { fetchAll as fetchOutages } from './store/slices/utilityOutageSlice';
import { fetchAll as fetchZones } from './store/slices/trafficZoneSlice';
import { fetchAll as fetchAlerts } from './store/slices/alertNotificationSlice';
import { fetchAll as fetchGrids } from './store/slices/utilityGridSlice';

// Access Denied (403) View
const AccessDeniedView = () => (
  <div className="access-denied-container" style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center',
    color: 'var(--text-primary, #ffffff)',
    padding: '2rem'
  }}>
    <div style={{ fontSize: '4.5rem', fontWeight: '800', color: '#ef4444', marginBottom: '0.5rem', lineHeight: 1 }}>403</div>
    <h2 style={{ fontSize: '1.75rem', fontWeight: '600', marginBottom: '0.75rem' }}>Access Denied</h2>
    <p style={{ opacity: 0.8, maxWidth: '460px', fontSize: '1rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
      You do not have permission to access this page. Dashboard access is restricted to City Administrators only.
    </p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem('token');
  const isAuth = isAuthenticated || !!token || !!storedToken;
  const role = user?.role || localStorage.getItem('role') || '';

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <AccessDeniedView />;
  }

  return children;
};

// Dashboard View
const DashboardView = () => {
  const dispatch = useDispatch();
  const incidents = useSelector((state) => state.trafficIncident?.items || []);
  const outages = useSelector((state) => state.utilityOutage?.items || []);
  const zones = useSelector((state) => state.trafficZone?.items || []);
  const alerts = useSelector((state) => state.alertNotification?.items || []);
  const grids = useSelector((state) => state.utilityGrid?.items || []);
  const loading = useSelector(
    (state) =>
      state.trafficIncident?.loading ||
      state.utilityOutage?.loading ||
      state.trafficZone?.loading ||
      state.alertNotification?.loading ||
      state.utilityGrid?.loading ||
      false
  );

  const [lastUpdated, setLastUpdated] = useState(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  useEffect(() => {
    dispatch(fetchIncidents());
    dispatch(fetchOutages());
    dispatch(fetchZones());
    dispatch(fetchAlerts());
    dispatch(fetchGrids());

    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [dispatch]);

  const totalIncidents = incidents.length;
  const resolvedIncidents = incidents.filter(
    (i) => i.status === 'RESOLVED' || i.status === 'CLOSED'
  ).length;
  const activeOutages = outages.filter((o) => o.status !== 'RESTORED').length;
  const congestedZones = zones.filter(
    (z) => z.currentCongestionLevel === 'HIGH' || z.currentCongestionLevel === 'SEVERE'
  ).length;
  const criticalAlerts = alerts.filter(
    (a) => a.severity === 'CRITICAL' && !a.isRead
  ).length;

  // Compute utility load dynamically from actual grid items
  let calculatedLoad = 0;
  if (grids.length > 0) {
    const totalCap = grids.reduce((s, g) => s + (Number(g.capacityUnits) || 0), 0);
    const totalLoad = grids.reduce((s, g) => s + (Number(g.currentLoad) || 0), 0);
    if (totalCap > 0) {
      calculatedLoad = Math.round((totalLoad / totalCap) * 100);
    }
  }

  return (
    <div className="dashboard-container">
      {/* 1. Header Section */}
      <div className="dashboard-header-row">
        <div className="dashboard-title-group">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Real-time city infrastructure overview</p>
        </div>
        <div className="dashboard-header-right">
          <div className="dashboard-status-indicator">
            <span className="operational-dot" aria-hidden="true" />
            <span className="operational-text">SYSTEM OPERATIONAL</span>
            <span className="operational-divider" aria-hidden="true">•</span>
            <span className="operational-sync">Telemetry Synced</span>
          </div>
          <div className="dashboard-last-updated">
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* 2. Unified City Operations Health Summary Strip */}
      <CityHealthSummary
        incidents={incidents}
        outages={outages}
        zones={zones}
        alerts={alerts}
        grids={grids}
        loading={loading}
      />

      {/* 3. Balanced Unified KPI Cards */}
      <StatCards
        totalIncidents={totalIncidents}
        resolvedIncidents={resolvedIncidents}
        activeOutages={activeOutages}
        criticalAlerts={criticalAlerts}
        congestedZones={congestedZones}
        utilityLoad={calculatedLoad}
        loading={loading}
      />

      {/* 4. Main Dashboard Operations Section */}
      <div className="dashboard-two-column-grid">
        <IncidentStatusDonut incidents={incidents} loading={loading} />
        <RecentActivity incidents={incidents} loading={loading} />
      </div>

      {/* 5. Utility Alerts & Maintenance */}
      <UtilityAlertsCard outages={outages} alerts={alerts} grids={grids} loading={loading} />

      {/* 6. Full-Width Traffic & Infrastructure Telemetry Section */}
      <TrafficInfrastructureTelemetry zones={zones} grids={grids} loading={loading} />
    </div>
  );
};

// Official Registry View
const OfficialRegistryView = () => {
  const [activeTab, setActiveTab] = useState('incidents');

  return (
    <div className="official-registry-container">
      <h1>Official Registry</h1>
      <div className="registry-tabs">
        <button
          type="button"
          className={activeTab === 'incidents' ? 'active' : ''}
          onClick={() => setActiveTab('incidents')}
        >
          Incidents
        </button>
        <button
          type="button"
          className={activeTab === 'zones' ? 'active' : ''}
          onClick={() => setActiveTab('zones')}
        >
          Traffic Zones
        </button>
        <button
          type="button"
          className={activeTab === 'grids' ? 'active' : ''}
          onClick={() => setActiveTab('grids')}
        >
          Utility Grids
        </button>
        <button
          type="button"
          className={activeTab === 'outages' ? 'active' : ''}
          onClick={() => setActiveTab('outages')}
        >
          Outages
        </button>
        <button
          type="button"
          className={activeTab === 'observations' ? 'active' : ''}
          onClick={() => setActiveTab('observations')}
        >
          Observations
        </button>
        <button
          type="button"
          className={activeTab === 'alerts' ? 'active' : ''}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts
        </button>
      </div>

      <div className="registry-content">
        {activeTab === 'incidents' && <TrafficIncidentList />}
        {activeTab === 'zones' && <TrafficZoneList />}
        {activeTab === 'grids' && <UtilityGridList />}
        {activeTab === 'outages' && <UtilityOutageList />}
        {activeTab === 'observations' && <FieldObservationList />}
        {activeTab === 'alerts' && <AlertNotificationList />}
      </div>
    </div>
  );
};

// Role-aware Home View
const HomeView = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem('role') || '';

  if (role === 'CITY_ADMINISTRATOR') {
    return <DashboardView />;
  }
  if (role === 'TRAFFIC_CONTROLLER') {
    return <TrafficIncidentList />;
  }
  if (role === 'UTILITY_SUPERVISOR') {
    return <UtilityGridList />;
  }
  if (role === 'FIELD_TECHNICIAN') {
    return <FieldObservationList />;
  }

  return <TrafficIncidentList />;
};

function App() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Gracefully handle browser autoplay policy
        });
      }
    }
  }, []);

  return (
    <div className="app">
      {/* Global Background Video Layer */}
      <div className="app-video-backdrop" aria-hidden="true">
        <video
          ref={videoRef}
          className="app-bg-video"
          src={process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/login.mp4` : '/login.mp4'}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/login.mp4` : '/login.mp4'} type="video/mp4" />
          <source src="/login.mp4" type="video/mp4" />
        </video>
      </div>
      <Navbar />
      <NotificationStack />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incidents"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER', 'FIELD_TECHNICIAN']}>
                <TrafficIncidentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/traffic-zones"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER']}>
                <TrafficZoneList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/utility-grids"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'UTILITY_SUPERVISOR']}>
                <UtilityGridList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outages"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'UTILITY_SUPERVISOR']}>
                <UtilityOutageList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/observations"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'FIELD_TECHNICIAN']}>
                <FieldObservationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR']}>
                <AlertNotificationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR']}>
                <DashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-registry"
            element={
              <ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR']}>
                <OfficialRegistryView />
              </ProtectedRoute>
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
