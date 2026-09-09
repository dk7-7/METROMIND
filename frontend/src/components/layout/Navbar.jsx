import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import ThemeToggle from '../common/ThemeToggle';

const ROLE_BADGE_CONFIG = {
  CITY_ADMINISTRATOR: { label: 'CITY ADMIN', bg: 'rgba(59, 130, 246, 0.18)', border: '#3b82f6', text: '#93c5fd' },
  TRAFFIC_CONTROLLER: { label: 'TRAFFIC CTRL', bg: 'rgba(245, 158, 11, 0.18)', border: '#f59e0b', text: '#fde68a' },
  UTILITY_SUPERVISOR: { label: 'UTILITY SUP', bg: 'rgba(16, 185, 129, 0.18)', border: '#10b981', text: '#a7f3d0' },
  FIELD_TECHNICIAN: { label: 'FIELD TECH', bg: 'rgba(168, 85, 247, 0.18)', border: '#a855f7', text: '#e9d5ff' },
  CIVIC_ANALYST: { label: 'CIVIC ANALYST', bg: 'rgba(14, 165, 233, 0.18)', border: '#0ea5e9', text: '#bae6fd' },
};

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check role from user object or stored role
  const role = user?.role || localStorage.getItem('role') || '';
  const username = user?.username || localStorage.getItem('username') || 'Operator';
  const roleBadge = ROLE_BADGE_CONFIG[role] || { label: role, bg: 'rgba(148, 163, 184, 0.15)', border: '#64748b', text: '#cbd5e1' };

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
    <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      {/* Top Telemetry Ticker Strip */}
      <div
        className="telemetry-strip"
        style={{
          padding: '0.3rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.725rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontWeight: 600 }}>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
              }}
            />
            LIVE TELEMETRY ACTIVE
          </span>
          <span className="ticker-divider" style={{ opacity: 0.4 }}>|</span>
          <span className="ticker-text" style={{ fontWeight: 500 }}>MUNICIPAL SENSOR GRID ONLINE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="ticker-text" style={{ fontWeight: 500 }}>SECURE OPERATIONS PORTAL</span>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Command Navbar */}
      <nav
        className="navbar"
        role="navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
          <Link
            to="/"
            className="navbar-brand brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            {/* Municipal Shield Emblem */}
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.4)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1rem',
              }}
            >
              M
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="brand-title"
                style={{
                  fontSize: '1.1875rem', /* 19px */
                  fontWeight: 800,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                MetroMind
              </span>
              <span
                className="brand-subtitle"
                style={{
                  fontSize: '0.65rem',
                  color: '#0284c7',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Smart City Command
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <div className="nav-links navbar-links" style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
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

        <div className="navbar-auth" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {!isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Link
                to="/login"
                className="btn-secondary"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '0.45rem 0.9rem',
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  padding: '0.45rem 0.95rem',
                }}
              >
                Register
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* User Identity Pill */}
              <div
                className="user-badge-pill"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: '#ffffff',
                  }}
                >
                  {username.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="user-name" style={{ fontSize: '0.825rem', fontWeight: 600, lineHeight: 1.2 }}>
                    {username}
                  </span>
                  <span
                    style={{
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      color: roleBadge.text,
                      letterSpacing: '0.03em',
                    }}
                  >
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
      </nav>
    </header>
  );
};

export default Navbar;