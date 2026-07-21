import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, AlertTriangle, Layers, Clock, User, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: AlertTriangle },
    { name: 'Utility Grids', path: '/grids', icon: Layers },
    { name: 'Outages', path: '/outages', icon: Clock },
    { name: 'Profile Settings', path: '/profile', icon: User },
  ];

  return (
    <aside 
      style={{
        width: 'var(--sidebar-width)',
        height: 'calc(100vh - var(--navbar-height))',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--glass-border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 'var(--navbar-height)',
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p 
          style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--text-muted)',
            fontWeight: 'bold',
            paddingLeft: '12px',
            marginBottom: '12px',
          }}
        >
          OPERATIONAL HUB
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '14px',
                transition: 'all var(--transition-fast)',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.style.background.includes('var(--accent-gradient)')) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.style.background.includes('var(--accent-gradient)')) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div>
        <button
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: '#ef4444',
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.1)';
          }}
        >
          <LogOut size={18} />
          <span>Exit Session</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
