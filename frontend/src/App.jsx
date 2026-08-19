import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import TrafficIncidentList from "./components/trafficIncident/TrafficIncidentList";
import TrafficZoneList from "./components/trafficZone/TrafficZoneList";
import UtilityGridList from "./components/utilityGrid/UtilityGridList";
import UtilityOutageList from "./components/utilityOutage/UtilityOutageList";
import AlertNotificationList from "./components/alertNotification/AlertNotificationList";
import FieldObservationList from "./components/fieldObservation/FieldObservationList";
import ProtectedRoute from "./components/common/ProtectedRoute";

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="page-container">
      <h2>Welcome back, {user ? user.username : "Guest"}</h2>
      <p>Use the navigation bar above to monitor traffic, utilities, and civic alerts.</p>
    </div>
  );
};

function App() {
  return (
  <>
  <div>
    <h1>
      Hello World
    </h1>
  </div>
  </> 
  );
}

export default App;
