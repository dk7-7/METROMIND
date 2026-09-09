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
    { id: 'incidents', label: 'Traffic Incidents', icon: '🚨' },
    { id: 'zones', label: 'Traffic Zones', icon: '🚦' },
    { id: 'grids', label: 'Utility Grids', icon: '⚡' },
    { id: 'outages', label: 'Outages', icon: '🔌' },
    { id: 'observations', label: 'Observations', icon: '📋' },
    { id: 'alerts', label: 'Alerts', icon: '⚠️' },
  ];

  return (
    <div className="official-registry-container">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">
            <span>🏛️</span> Official Municipal Registry
          </h1>
          <p className="page-subtitle">
            Central municipal master registry, asset administration, and system-wide data records
          </p>
        </div>
      </div>

      <div
        className="registry-tabs"
        style={{
          display: 'flex',
          gap: '0.45rem',
          padding: '0.5rem',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                border: isActive ? '1px solid rgba(37, 99, 235, 0.3)' : '1px solid transparent',
                borderRadius: '10px',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
                transform: isActive ? 'translateY(-1px)' : 'none',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
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
