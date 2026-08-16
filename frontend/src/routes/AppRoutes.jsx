import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Dashboard from '../pages/Dashboard';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import TrafficIncidents from '../pages/TrafficIncidents';
import TrafficZones from '../pages/TrafficZones';
import UtilityGrids from '../pages/UtilityGrids';
import Outages from '../pages/Outages';
import Observations from '../pages/Observations';
import Alerts from '../pages/Alerts';

const AppRoutes = () => {
    const { user, role } = useSelector(state => state.auth);

    const ProtectedRoute = ({ children, allowedRoles }) => {
        if (!user) {
            return <Navigate to="/login" />;
        }
        if (allowedRoles && !allowedRoles.includes(role)) {
            return <Navigate to="/" />;
        }
        return children;
    };

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/incidents" element={<ProtectedRoute><TrafficIncidents /></ProtectedRoute>} />
            <Route path="/zones" element={<ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'TRAFFIC_CONTROLLER']}><TrafficZones /></ProtectedRoute>} />
            <Route path="/grids" element={<ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'UTILITY_SUPERVISOR']}><UtilityGrids /></ProtectedRoute>} />
            <Route path="/outages" element={<ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR', 'UTILITY_SUPERVISOR']}><Outages /></ProtectedRoute>} />
            <Route path="/observations" element={<ProtectedRoute><Observations /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
            <Route path="/registry" element={<ProtectedRoute allowedRoles={['CITY_ADMINISTRATOR']}><div>Official Registry</div></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;
