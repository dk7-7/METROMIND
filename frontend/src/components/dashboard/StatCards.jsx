import React from 'react';

const StatCards = ({ totalIncidents, activeOutages, criticalAlerts, congestedZones }) => {
    const Card = ({ title, value, color }) => (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1 }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{title}</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{value || 0}</div>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Card title="Total Incidents" value={totalIncidents} color="#3b82f6" />
            <Card title="Active Outages" value={activeOutages} color="#ef4444" />
            <Card title="Critical Alerts" value={criticalAlerts} color="#f59e0b" />
            <Card title="Congested Zones" value={congestedZones} color="#8b5cf6" />
        </div>
    );
};
export default StatCards;
