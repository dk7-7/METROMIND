import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check role from user object or stored role
  const role = user?.role || localStorage.getItem('role') || '';
  const username = user?.username || localStorage.getItem('username') || 'Operator';

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="app-header">
      {/* Top Telemetry Ticker Strip */}
      <div className="telemetry-strip">
        <div className="telemetry-container">
          <div className="telemetry-left">
            <span className="telemetry-status">
              <span className="telemetry-status-dot" />
              LIVE TELEMETRY ACTIVE
            </span>
            <span className="ticker-divider">|</span>
            <span className="ticker-text">MUNICIPAL SENSOR GRID ONLINE</span>
          </div>
          <div className="telemetry-right">
            <span className="ticker-text">SECURE OPERATIONS PORTAL</span>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Command Navbar */}
      <nav className="navbar" role="navigation">
        <div className="navbar-container">
          <div className="navbar-brand-section">
            <Link
              to="/"
              className="navbar-brand brand"
            >
              {/* Municipal Shield Emblem */}
              <div className="brand-emblem">
                M
              </div>
              <div className="brand-text">
                <span className="brand-title">
                  MetroMind
                </span>
                <span className="brand-subtitle">
                  Smart City Command
                </span>
              </div>
            </Link>

            {isAuthenticated && (
              <div className="nav-links navbar-links">
                {role === 'CITY_ADMINISTRATOR' && (
                  <>
                    <Link to="/incidents" className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}>
                      <span>🚨</span> Incidents
                    </Link>
                    <Link to="/utility-grids" className={`nav-link ${isActive('/utility-grids') ? 'active' : ''}`}>
                      <span>⚡</span> Utility Grids
                    </Link>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                      <span>📊</span> Dashboard
                    </Link>
                    <Link to="/official-registry" className={`nav-link ${isActive('/official-registry') ? 'active' : ''}`}>
                      <span>🏛️</span> Official Registry
                    </Link>
                  </>
                )}

                {role === 'TRAFFIC_CONTROLLER' && (
                  <>
                    <Link to="/incidents" className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}>
                      <span>🚨</span> Incidents
                    </Link>
                    <Link to="/traffic-zones" className={`nav-link ${isActive('/traffic-zones') ? 'active' : ''}`}>
                      <span>🚦</span> Traffic Zones
                    </Link>
                  </>
                )}

                {role === 'UTILITY_SUPERVISOR' && (
                  <>
                    <Link to="/utility-grids" className={`nav-link ${isActive('/utility-grids') ? 'active' : ''}`}>
                      <span>⚡</span> Utility Grids
                    </Link>
                    <Link to="/outages" className={`nav-link ${isActive('/outages') ? 'active' : ''}`}>
                      <span>🔌</span> Outages
                    </Link>
                  </>
                )}

                {role === 'FIELD_TECHNICIAN' && (
                  <>
                    <Link to="/incidents" className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}>
                      <span>🚨</span> Incidents
                    </Link>
                    <Link to="/observations" className={`nav-link ${isActive('/observations') ? 'active' : ''}`}>
                      <span>📋</span> Observations
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="navbar-auth">
            {!isAuthenticated ? (
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="btn-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="user-section">
                {/* User Identity Pill */}
                <div className="user-badge-pill">
                  <div className="user-avatar">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">
                      {username}
                    </span>
                    <span className="user-role">
                      ({role})
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-logout logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                >
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;