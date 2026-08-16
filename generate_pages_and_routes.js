const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

const ensureDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const write = (filePath, content) => {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
};

const dashboardJsx = `
import React, { useEffect, useState } from 'react';
import StatCards from '../components/dashboard/StatCards';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalIncidents: 0, activeOutages: 0, congestedZones: 0, criticalAlerts: 0
    });

    useEffect(() => {
        // Ideally there's a dashboard endpoint, mocking the API call here as requested
        api.get('/dashboard/stats').then(res => setStats(res.data)).catch(err => console.log('Mocking stats'));
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <StatCards {...stats} />
        </div>
    );
};
export default Dashboard;
`;

const trafficZonesJsx = `
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllZones, deleteZone } from '../store/trafficZone/trafficZoneActions';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';

const TrafficZones = () => {
    const dispatch = useDispatch();
    const { zones, loading } = useSelector(state => state.trafficZone);
    const { role } = useSelector(state => state.auth);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(fetchAllZones());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this zone?')) {
            dispatch(deleteZone(id));
        }
    };

    const paginated = zones.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <h2>Traffic Zones</h2>
            {loading ? <p>Loading...</p> : 
                paginated.length === 0 ? <EmptyState message="No traffic zones found." /> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Zone Name</th>
                                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map(zone => (
                                <tr key={zone.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '0.75rem' }}>{zone.name}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {role === 'ADMIN' && <button onClick={() => handleDelete(zone.id)}>Delete</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalItems={zones.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
            )}
        </div>
    );
};
export default TrafficZones;
`;

const trafficIncidentsJsx = `
import React from 'react';
import TrafficIncidentList from '../components/trafficIncident/TrafficIncidentList';

const TrafficIncidents = () => {
    return <TrafficIncidentList />;
};
export default TrafficIncidents;
`;

const utilityGridsJsx = `
import React from 'react';
import UtilityGridList from '../components/utilityGrid/UtilityGridList';

const UtilityGrids = () => {
    return <UtilityGridList />;
};
export default UtilityGrids;
`;

const outagesJsx = `
import React from 'react';

const Outages = () => {
    return <div><h2>Outages</h2><p>Outages screen content.</p></div>;
};
export default Outages;
`;

const observationsJsx = `
import React from 'react';

const Observations = () => {
    return <div><h2>Observations</h2><p>Observations screen content.</p></div>;
};
export default Observations;
`;

const alertsJsx = `
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAlerts, markAlertRead } from '../store/alert/alertActions';

const Alerts = () => {
    const dispatch = useDispatch();
    const { alerts, loading } = useSelector(state => state.alert);

    useEffect(() => {
        dispatch(fetchAllAlerts());
    }, [dispatch]);

    return (
        <div>
            <h2>Alert Notifications</h2>
            {loading ? <p>Loading...</p> : alerts.map(alert => (
                <div key={alert.id} style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem', backgroundColor: alert.read ? '#f1f5f9' : 'white' }}>
                    <p>{alert.message}</p>
                    {!alert.read && <button onClick={() => dispatch(markAlertRead(alert.id))}>Mark Read</button>}
                </div>
            ))}
        </div>
    );
};
export default Alerts;
`;

const appRoutesJsx = `
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
`;

const appJsx = `
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
`;

const globalCss = `
body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
* {
    box-sizing: border-box;
}
`;

write(path.join(srcDir, 'pages', 'Dashboard.jsx'), dashboardJsx);
write(path.join(srcDir, 'pages', 'TrafficZones.jsx'), trafficZonesJsx);
write(path.join(srcDir, 'pages', 'TrafficIncidents.jsx'), trafficIncidentsJsx);
write(path.join(srcDir, 'pages', 'UtilityGrids.jsx'), utilityGridsJsx);
write(path.join(srcDir, 'pages', 'Outages.jsx'), outagesJsx);
write(path.join(srcDir, 'pages', 'Observations.jsx'), observationsJsx);
write(path.join(srcDir, 'pages', 'Alerts.jsx'), alertsJsx);
write(path.join(srcDir, 'routes', 'AppRoutes.jsx'), appRoutesJsx);
write(path.join(srcDir, 'App.jsx'), appJsx);
write(path.join(srcDir, 'styles', 'global.css'), globalCss);

console.log("Pages and routing generated successfully.");
