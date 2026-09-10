import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, token } = useSelector((state) => state.auth);
  const storedToken = localStorage.getItem('token');
  const isAuth = isAuthenticated || !!token || !!storedToken;
  const role = user?.role || localStorage.getItem('role') || '';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          MetroMind
        </Link>

        <div className="navbar-menu">
          {!isAuth ? (
            <div className="navbar-auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </div>
          ) : (
            <div className="navbar-nav-links">
              {role === 'CITY_ADMINISTRATOR' && (
                <>
                  <Link to="/incidents" className="nav-link">
                    Incidents
                  </Link>
                  <Link to="/utility-grids" className="nav-link">
                    Utility Grids
                  </Link>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/official-registry" className="nav-link">
                    Official Registry
                  </Link>
                </>
              )}

              {role === 'TRAFFIC_CONTROLLER' && (
                <>
                  <Link to="/incidents" className="nav-link">
                    Incidents
                  </Link>
                  <Link to="/traffic-zones" className="nav-link">
                    Traffic Zones
                  </Link>
                </>
              )}

              {role === 'UTILITY_SUPERVISOR' && (
                <>
                  <Link to="/utility-grids" className="nav-link">
                    Utility Grids
                  </Link>
                  <Link to="/outages" className="nav-link">
                    Outages
                  </Link>
                </>
              )}

              {role === 'FIELD_TECHNICIAN' && (
                <>
                  <Link to="/incidents" className="nav-link">
                    Incidents
                  </Link>
                  <Link to="/observations" className="nav-link">
                    Observations
                  </Link>
                </>
              )}

              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;