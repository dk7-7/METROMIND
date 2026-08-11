import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import IncidentList from '../pages/IncidentList';
import AddIncident from '../pages/AddIncident';
import EditIncident from '../pages/EditIncident';
import UtilityGridList from '../pages/UtilityGridList';
import AddUtilityGrid from '../pages/AddUtilityGrid';
import UtilityOutageList from '../pages/UtilityOutageList';
import AddUtilityOutage from '../pages/AddUtilityOutage';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes (Public) */}
      <Route 
        path="/login" 
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        } 
      />

      {/* Main Control Panel routes (Protected) */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/incidents" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <IncidentList />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/incidents/add" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddIncident />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/incidents/edit/:id" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditIncident />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/grids" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <UtilityGridList />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/grids/add" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddUtilityGrid />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/outages" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <UtilityOutageList />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/outages/add" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddUtilityOutage />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="*" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <NotFound />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
