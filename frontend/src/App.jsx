import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import Dashboard from './components/dashboard/Dashboard';
import OfficialRegistry from './components/dashboard/OfficialRegistry';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem('token');

  if (!isAuthenticated && !token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Home Redirect or Landing depending on Role
const HomeView = () => {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || localStorage.getItem('role') || '';

  if (role === 'CITY_ADMINISTRATOR') {
    return <Dashboard />;
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

  return <Dashboard />;
};

function App() {
  return (
    <div className="app-container">
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
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/official-registry"
            element={
              <ProtectedRoute>
                <OfficialRegistry />
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
