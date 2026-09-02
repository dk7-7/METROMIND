import React, { useState } from 'react';
import TrafficIncidentList from '../trafficIncident/TrafficIncidentList';
import TrafficZoneList from '../trafficZone/TrafficZoneList';
import UtilityGridList from '../utilityGrid/UtilityGridList';
import UtilityOutageList from '../utilityOutage/UtilityOutageList';
import FieldObservationList from '../fieldObservation/FieldObservationList';
import AlertNotificationList from '../alertNotification/AlertNotificationList';

const OfficialRegistry = () => {
  const [activeTab, setActiveTab] = useState('incidents');

  const tabs = [
    { id: 'incidents', label: 'Traffic Incidents' },
    { id: 'zones', label: 'Traffic Zones' },
    { id: 'grids', label: 'Utility Grids' },
    { id: 'outages', label: 'Outages' },
    { id: 'observations', label: 'Observations' },
    { id: 'alerts', label: 'Alerts' },
  ];

  return (
    <div className="official-registry-container" style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0' }}>
          Official Registry
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '0.95rem' }}>
          Central municipal master registry and asset administration
        </p>
      </div>

      <div
        className="registry-tabs"
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '1.5rem',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.625rem 1.25rem',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
              marginBottom: '-2px',
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              fontWeight: activeTab === tab.id ? 600 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
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

export default OfficialRegistry;
