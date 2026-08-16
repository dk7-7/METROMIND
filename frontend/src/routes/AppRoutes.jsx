import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import Dashboard from '../pages/Dashboard';
import TrafficIncidents from '../pages/TrafficIncidents';
import TrafficZones from '../pages/TrafficZones';
import UtilityGrids from '../pages/UtilityGrids';
import Outages from '../pages/Outages';
import Observations from '../pages/Observations';
import Alerts from '../pages/Alerts';

const AppRoutes = () => {
    const { isAuthenticated, token } = useSelector(state => state.auth);
    const isLoggedIn = isAuthenticated || !!token;

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {isLoggedIn ? (
                <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/incidents" element={<TrafficIncidents />} />
                    <Route path="/zones" element={<TrafficZones />} />
                    <Route path="/grids" element={<UtilityGrids />} />
                    <Route path="/outages" element={<Outages />} />
                    <Route path="/observations" element={<Observations />} />
                    <Route path="/alerts" element={<Alerts />} />
                </>
            ) : (
                <Route path="*" element={<Navigate to="/login" />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
