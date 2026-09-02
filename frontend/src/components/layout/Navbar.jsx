import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Check role from user object or stored role
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
    <nav className="navbar" role="navigation" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 2rem',
      backgroundColor: '#1e293b',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link
          to="/"
          className="navbar-brand"
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#38bdf8',
            textDecoration: 'none',
            letterSpacing: '0.5px'
          }}
        >
          MetroMind
        </Link>

        {isAuthenticated && (
          <div className="navbar-links" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            {role === 'CITY_ADMINISTRATOR' && (
              <>
                <Link to="/incidents" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Incidents
                </Link>
                <Link to="/utility-grids" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Utility Grids
                </Link>
                <Link to="/dashboard" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Dashboard
                </Link>
                <Link to="/official-registry" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Official Registry
                </Link>
              </>
            )}

            {role === 'TRAFFIC_CONTROLLER' && (
              <>
                <Link to="/incidents" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Incidents
                </Link>
                <Link to="/traffic-zones" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Traffic Zones
                </Link>
              </>
            )}

            {role === 'UTILITY_SUPERVISOR' && (
              <>
                <Link to="/utility-grids" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Utility Grids
                </Link>
                <Link to="/outages" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Outages
                </Link>
              </>
            )}

            {role === 'FIELD_TECHNICIAN' && (
              <>
                <Link to="/incidents" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Incidents
                </Link>
                <Link to="/observations" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '0.95rem' }}>
                  Observations
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      <div className="navbar-auth" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              style={{
                color: '#e2e8f0',
                textDecoration: 'none',
                fontSize: '0.9rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px'
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.9rem',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px'
              }}
            >
              Register
            </Link>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              {user?.username || localStorage.getItem('username')} ({role})
            </span>
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;