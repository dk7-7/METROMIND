import React from 'react';

const StatCards = ({ totalIncidents = 0, activeOutages = 0, congestedZones = 0, criticalAlerts = 0 }) => {
    const Card = ({ title, value, color }) => (
        <div style={{ padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', borderTop: `4px solid ${color}`, flex: '1 1 200px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '0.875rem', textTransform: 'uppercase' }}>{title}</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{value}</div>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Card title="Total Incidents" value={totalIncidents} color="#3b82f6" />
            <Card title="Active Outages" value={activeOutages} color="#f59e0b" />
            <Card title="Critical Alerts" value={criticalAlerts} color="#ef4444" />
            <Card title="Congested Zones" value={congestedZones} color="#8b5cf6" />
        </div>
    );
};

export default StatCards;
