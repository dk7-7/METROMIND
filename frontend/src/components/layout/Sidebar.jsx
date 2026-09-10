import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Video,
  Flame,
  ShieldAlert,
  Sliders,
  BarChart2,
  Zap,
  Building2,
  ChevronLeft,
  ChevronRight,
  Radio,
  Layers,
  FileText
} from 'lucide-react';

const Sidebar = ({ activeSection, onSelectSection }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, path: '/dashboard', section: 'overview' },
    { id: 'twin', label: '3D Digital Twin City', icon: Layers, path: '/dashboard', section: 'twin' },
    { id: 'prediction', label: 'AI Traffic Prediction', icon: Cpu, path: '/dashboard', section: 'prediction' },
    { id: 'incidents', label: 'Incident Radar', icon: Flame, path: '/incidents', section: 'incidents' },
    { id: 'corridor', label: 'Emergency Vehicles', icon: ShieldAlert, path: '/dashboard', section: 'emergency' },
    { id: 'signals', label: 'Signal Controllers', icon: Sliders, path: '/traffic-zones', section: 'signals' },
    { id: 'cctv', label: 'CCTV Surveillance', icon: Video, path: '/dashboard', section: 'cctv' },
    { id: 'utilities', label: 'Smart Utilities', icon: Zap, path: '/utility-grids', section: 'utilities' },
    { id: 'analytics', label: 'City Analytics', icon: BarChart2, path: '/dashboard', section: 'analytics' },
    { id: 'registry', label: 'Master Registry', icon: Building2, path: '/official-registry', section: 'registry' },
  ];

  const handleNavClick = (item) => {
    if (onSelectSection && item.section) {
      onSelectSection(item.section);
    }
  };

  return (
    <aside className={`command-sidebar glass-panel ${collapsed ? 'collapsed' : 'expanded'}`}>
      {/* Sidebar Header with Toggle */}
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand-label">
            <Radio size={14} className="hud-icon-spin text-cyan" />
            <span>COMMAND MATRIX</span>
          </div>
        )}
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <ul className="sidebar-nav-list">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isRouteActive = location.pathname === item.path && (!activeSection || activeSection === item.section);
            const isSectionActive = activeSection === item.section;
            const isSelected = isSectionActive || (location.pathname === item.path && !activeSection);

            return (
              <li key={item.id} className="sidebar-nav-item">
                <Link
                  to={item.path}
                  className={`sidebar-nav-link ${isSelected ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                  title={collapsed ? item.label : undefined}
                >
                  <div className="nav-icon-wrap">
                    <IconComp size={18} />
                    {isSelected && <span className="active-glow-pip" />}
                  </div>

                  {!collapsed && (
                    <span className="nav-item-label">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Bottom Telemetry Status */}
      {!collapsed && (
        <div className="sidebar-footer-telemetry">
          <div className="sidebar-telemetry-card glass-panel">
            <div className="telemetry-row">
              <span className="dot-green live-pulse" />
              <span className="telemetry-label">Grid Health: 99.8%</span>
            </div>
            <div className="telemetry-sub">AI Copilot v4.2 Online</div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
