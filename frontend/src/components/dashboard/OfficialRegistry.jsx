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

      <div className="registry-tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`registry-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
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
