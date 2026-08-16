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
