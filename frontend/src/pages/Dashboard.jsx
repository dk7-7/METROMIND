import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";
import StatCards from "../components/dashboard/StatCards";
import IncidentStatusDonut from "../components/dashboard/IncidentStatusDonut";

const Dashboard = () => {
  const { items: incidents } = useSelector((state) => state.trafficIncident);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get("/dashboard/stats")
      .then((res) => {
        if (mounted) setStats(res.data);
      })
      .catch((err) => {
        if (mounted) {
          setError(
            (err.response && err.response.data && err.response.data.error) ||
              "Unable to load dashboard stats"
          );
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="page-container">
      <h2>Civic Dashboard Overview</h2>
      {error && <div className="error-alert">{error}</div>}
      <StatCards stats={stats} />
      <IncidentStatusDonut incidents={incidents} />
    </div>
  );
};

export default Dashboard;
