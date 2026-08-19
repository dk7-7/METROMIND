import React from "react";

const StatCards = ({ stats }) => {
  const {
    totalIncidents = 0,
    activeOutages = 0,
    criticalAlerts = 0,
    congestedZones = 0,
  } = stats || {};

  return (
    <div className="stat-cards">
      <div className="stat-card">
        <h3>Total Incidents</h3>
        <p>{totalIncidents}</p>
      </div>
      <div className="stat-card">
        <h3>Active Outages</h3>
        <p>{activeOutages}</p>
      </div>
      <div className="stat-card">
        <h3>Critical Alerts</h3>
        <p>{criticalAlerts}</p>
      </div>
      <div className="stat-card">
        <h3>Congested Zones</h3>
        <p>{congestedZones}</p>
      </div>
    </div>
  );
};

export default StatCards;
