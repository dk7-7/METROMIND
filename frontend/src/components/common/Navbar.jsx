import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { LogOut, Bell, Cpu } from 'lucide-react';

export const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav 
      style={{
        height: 'var(--navbar-height)',
        background: 'var(--glass-bg)',
        borderBottom: '1px solid var(--glass-border)',
        backdropFilter: 'var(--glass-backdrop)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Logo & Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'none', // Shown only on mobile screens via CSS media queries
          }}
          className="mobile-sidebar-toggle"
        >
          ☰
        </button>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div 
            style={{
              background: 'var(--accent-gradient)',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Cpu size={20} color="#fff" />
          </div>
          <span 
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: 'var(--text-primary)',
            }}
          >
            GRID<span className="gradient-text">SENTINEL</span>
          </span>
        </Link>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Status Indicator */}
        <div 
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--color-success)',
          }}
        >
          <div 
            style={{
              width: '8px',
              height: '8px',
              background: 'var(--color-success)',
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--color-success)',
              animation: 'pulse-slow 2s infinite',
            }}
          />
          GRID OPERATIONAL
        </div>

        {/* Warning notification */}
        <div style={{ position: 'relative', cursor: 'pointer', color: 'var(--text-secondary)' }}>
          <Bell size={20} />
          <span 
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: 'var(--color-danger)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 'bold',
              borderRadius: '50%',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            3
          </span>
        </div>

        {/* User profile dropdown info */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link 
              to="/profile" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'} 
                alt="avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--accent-primary)' }}
              />
              <div className="user-nav-details" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: '600' }}>{user.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{user.role}</span>
              </div>
            </Link>

            {/* Logout button */}
            <button 
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              title="Logout Operator Session"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
