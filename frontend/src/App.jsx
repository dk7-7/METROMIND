import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import { fetchAll as fetchIncidents } from './store/slices/trafficIncidentSlice';
import { fetchAll as fetchOutages } from './store/slices/utilityOutageSlice';
import { fetchAll as fetchZones } from './store/slices/trafficZoneSlice';
import { fetchAll as fetchAlerts } from './store/slices/alertNotificationSlice';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem('token');

  if (!isAuthenticated && !token && !storedToken) {
    return <Navigate to="/login" replace />;
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

  useEffect(() => {
    dispatch(fetchIncidents());
    dispatch(fetchOutages());
    dispatch(fetchZones());
    dispatch(fetchAlerts());
  }, [dispatch]);

  const totalIncidents = incidents.length;
  const activeOutages = outages.filter((o) => o.status !== 'RESTORED').length;
  const congestedZones = zones.filter(
    (z) => z.currentCongestionLevel === 'HIGH' || z.currentCongestionLevel === 'SEVERE'
  ).length;
  const criticalAlerts = alerts.filter(
    (a) => a.severity === 'CRITICAL' && !a.isRead
  ).length;

  const activities = [
    ...incidents.slice(0, 5).map((i) => ({
      title: `Incident: ${i.title}`,
      time: i.reportedAt ? new Date(i.reportedAt).toLocaleTimeString() : '',
    })),
    ...outages.slice(0, 3).map((o) => ({
      title: `Outage: ${o.affectedArea}`,
      time: o.startTime ? new Date(o.startTime).toLocaleTimeString() : '',
    })),
  ];

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <StatCards
        totalIncidents={totalIncidents}
        activeOutages={activeOutages}
        congestedZones={congestedZones}
        criticalAlerts={criticalAlerts}
      />
      <div className="dashboard-charts">
        <IncidentStatusDonut incidents={incidents} />
        <RecentActivity activities={activities} />
      </div>
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

  return <DashboardView />;
};

function App() {
  return (
    <div className="app">
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
              <ProtectedRoute>
                <TrafficIncidentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/traffic-zones"
            element={
              <ProtectedRoute>
                <TrafficZoneList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/utility-grids"
            element={
              <ProtectedRoute>
                <UtilityGridList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/outages"
            element={
              <ProtectedRoute>
                <UtilityOutageList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/observations"
            element={
              <ProtectedRoute>
                <FieldObservationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <AlertNotificationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-registry"
            element={
              <ProtectedRoute>
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
