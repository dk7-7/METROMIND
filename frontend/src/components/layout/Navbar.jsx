import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { markAsRead, removeNotification } from '../../store/slices/alertNotificationSlice';
import ThemeToggle from '../common/ThemeToggle';
import GlobalSearch from '../common/GlobalSearch';
import {
  Activity,
  Bell,
  Radio,
  Shield,
  LogOut,
  User,
  Clock,
  Wifi,
  ChevronDown,
  X,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const alerts = useSelector((state) => state.alertNotification?.items || []);
  const notificationToasts = useSelector(
    (state) => state.alertNotification?.notifications || []
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check role from user object or stored role
  const role = user?.role || localStorage.getItem('role') || '';
  const username = user?.username || localStorage.getItem('username') || 'Commander';

  const unreadAlerts = alerts.filter((a) => !a.isRead);

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

  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <header className="app-header">
      {/* Top Telemetry & Health Ribbon */}
      <div className="telemetry-strip">
        <div className="telemetry-container">
          <div className="telemetry-left">
            <span className="telemetry-status">
              <span className="telemetry-status-dot live-pulse" />
              <span>LIVE TELEMETRY ACTIVE</span>
            </span>
            <span className="ticker-divider">|</span>
            <span className="ticker-text">
              <Wifi size={12} className="inline-icon text-cyan" /> 24ms LATENCY
            </span>
            <span className="ticker-divider">|</span>
            <span className="ticker-text">
              <Sparkles size={12} className="inline-icon text-purple" /> AI NEURAL TWIN 99.8% SYNC
            </span>
          </div>

          <div className="telemetry-right">
            <div className="digital-clock-pill">
              <Clock size={12} className="text-cyan" />
              <span className="clock-date">{formattedDate}</span>
              <span className="clock-time">{formattedTime}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Command Center Navbar */}
      <nav className="navbar" role="navigation">
        <div className="navbar-container">
          {/* Brand Logo & Name */}
          <div className="navbar-brand-section">
            <Link to="/" className="navbar-brand brand">
              <div className="brand-emblem-futuristic">
                <Shield size={20} className="emblem-shield-icon" />
                <span className="brand-dot-pulse" />
              </div>
              <div className="brand-text">
                <span className="brand-title">
                  Metro<span className="text-cyan">Mind</span>
                </span>
                <span className="brand-subtitle">
                  AI Smart City Command Center
                </span>
              </div>
            </Link>

            {/* Role Navigation Bar for authenticated users */}
            {isAuthenticated && (
              <div className="nav-links navbar-links">
                {role === 'CITY_ADMINISTRATOR' && (
                  <>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                      <Activity size={15} />
                      <span>Dashboard</span>
                    </Link>
                    <Link to="/incidents" className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}>
                      <Flame size={15} />
                      <span>Incidents</span>
                    </Link>
                    <Link to="/utility-grids" className={`nav-link ${isActive('/utility-grids') ? 'active' : ''}`}>
                      <span>⚡</span>
                      <span>Utility Grids</span>
                    </Link>
                    <Link to="/official-registry" className={`nav-link ${isActive('/official-registry') ? 'active' : ''}`}>
                      <span>🏛️</span>
                      <span>Official Registry</span>
                    </Link>
                  </>
                )}

                {role === 'TRAFFIC_CONTROLLER' && (
                  <>
                    <Link to="/incidents" className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}>
                      <Flame size={15} />
                      <span>Incidents</span>
                    </Link>
                    <Link to="/traffic-zones" className={`nav-link ${isActive('/traffic-zones') ? 'active' : ''}`}>
                      <span>🚦</span>
                      <span>Traffic Zones</span>
                    </Link>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                      <Activity size={15} />
                      <span>Command View</span>
                    </Link>
                  </>
                )}

                {role === 'UTILITY_SUPERVISOR' && (
                  <>
                    <Link to="/utility-grids" className={`nav-link ${isActive('/utility-grids') ? 'active' : ''}`}>
                      <span>⚡</span>
                      <span>Utility Grids</span>
                    </Link>
                    <Link to="/outages" className={`nav-link ${isActive('/outages') ? 'active' : ''}`}>
                      <span>🔌</span>
                      <span>Outages</span>
                    </Link>
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                      <Activity size={15} />
                      <span>Command View</span>
                    </Link>
                  </>
                )}

                {role === 'FIELD_TECHNICIAN' && (
                  <>
                    <Link to="/incidents" className={`nav-link ${isActive('/incidents') ? 'active' : ''}`}>
                      <Flame size={15} />
                      <span>Incidents</span>
                    </Link>
                    <Link to="/observations" className={`nav-link ${isActive('/observations') ? 'active' : ''}`}>
                      <span>📋</span>
                      <span>Observations</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Global Search Bar (Center/Right) */}
          <div className="navbar-search-area">
            <GlobalSearch />
          </div>

          {/* Right Action Icons & User Menu */}
          <div className="navbar-auth">
            {!isAuthenticated ? (
              <div className="auth-buttons">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            ) : (
              <div className="user-section">
                {/* Notification Center Trigger */}
                <div className="notif-center-wrapper">
                  <button
                    type="button"
                    className="btn-icon-notif"
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    aria-label="Toggle notifications center"
                  >
                    <Bell size={18} />
                    {unreadAlerts.length > 0 && (
                      <span className="notif-badge-bubble">
                        {unreadAlerts.length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Drawer */}
                  {isNotifOpen && (
                    <div className="notif-dropdown-drawer glass-panel animate-scale-up">
                      <div className="notif-drawer-header">
                        <div className="notif-header-title">
                          <Bell size={16} className="text-cyan" />
                          <span>Incident & System Alerts</span>
                        </div>
                        <span className="notif-unread-count">
                          {unreadAlerts.length} Unread
                        </span>
                      </div>

                      <div className="notif-drawer-list">
                        {alerts.length === 0 ? (
                          <div className="notif-empty-state">
                            <CheckCircle2 size={24} className="text-emerald" />
                            <p>All city telemetry operating nominal.</p>
                          </div>
                        ) : (
                          alerts.slice(0, 5).map((alert) => {
                            const isCrit = alert.severity === 'CRITICAL';
                            return (
                              <div
                                key={alert.alertId || alert.id}
                                className={`notif-drawer-item ${isCrit ? 'notif-crit' : ''}`}
                              >
                                <div className="notif-item-top">
                                  <span className={`notif-sev-tag sev-${(alert.severity || 'low').toLowerCase()}`}>
                                    {alert.severity}
                                  </span>
                                  <span className="notif-time">
                                    {alert.createdAt ? new Date(alert.createdAt).toLocaleTimeString() : 'Just now'}
                                  </span>
                                </div>
                                <h5 className="notif-item-title">{alert.title || 'System Alert'}</h5>
                                <p className="notif-item-msg">{alert.message}</p>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="notif-drawer-footer">
                        <Link
                          to="/alerts"
                          className="btn-view-all-alerts"
                          onClick={() => setIsNotifOpen(false)}
                        >
                          Open All Broadcast Alerts →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Identity Pill */}
                <div className="user-badge-pill">
                  <div className="user-avatar-futuristic">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{username}</span>
                    <span className="user-role">[{role || 'COMMANDER'}]</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-logout logout-btn"
                  onClick={handleLogout}
                  aria-label="Logout"
                  title="Disconnect Command Console"
                >
                  <LogOut size={15} />
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