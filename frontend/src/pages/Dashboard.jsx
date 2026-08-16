import React, { useEffect, useState } from 'react';
import StatCards from '../components/dashboard/StatCards';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalIncidents: 0,
        activeOutages: 0,
        congestedZones: 0,
        criticalAlerts: 0
    });

    useEffect(() => {
        // Fetch stats - Assuming there's a dashboard endpoint or we aggregate
        // The spec implies we get these from an API, maybe /dashboard or aggregating
        const fetchStats = async () => {
            try {
                // In a real app, this might be a single endpoint. 
                // We'll mock it if no specific endpoint is provided, 
                // but let's try a common pattern or aggregate.
                // Spec says: Dashboard DTO fields from the client API: totalIncidents activeOutages congestedZones criticalAlerts
                const res = await api.get('/dashboard/stats');
                if (res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
            <StatCards 
                totalIncidents={stats.totalIncidents} 
                activeOutages={stats.activeOutages} 
                congestedZones={stats.congestedZones} 
                criticalAlerts={stats.criticalAlerts} 
            />
        </div>
    );
};

export default Dashboard;
