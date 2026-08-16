import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        MetroMind
      </Link>
      <div className="nav-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && role === "CITY_ADMINISTRATOR" && (
          <>
            <Link to="/incidents">Incidents</Link>
            <Link to="/grids">Utility Grids</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/registry">Official Registry</Link>
          </>
        )}

        {user && role === "TRAFFIC_CONTROLLER" && (
          <>
            <Link to="/incidents">Incidents</Link>
            <Link to="/zones">Traffic Zones</Link>
          </>
        )}

        {user && role === "UTILITY_SUPERVISOR" && (
          <>
            <Link to="/grids">Utility Grids</Link>
            <Link to="/outages">Outages</Link>
          </>
        )}

        {user && role === "FIELD_TECHNICIAN" && (
          <Link to="/observations">Field Observations</Link>
        )}

        {user && <Link to="/alerts">Alerts</Link>}

        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
