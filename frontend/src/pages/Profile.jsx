import React from 'react';
import useAuth from '../hooks/useAuth';
import { User, Shield, Mail, Key, Bell, Check } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          Operator Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Manage your security clearances, node keys, and telemetry filters
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        
        {/* Left Side: Avatar Card */}
        <div className="glass-panel" style={{ padding: '30px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', height: 'fit-content' }}>
          <img 
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80'} 
            alt="avatar" 
            style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px solid var(--accent-primary)', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)' }}
          />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{user.name}</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: Operator-{user.id}</span>
          </div>
          
          <div 
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--accent-primary)',
            }}
          >
            <Shield size={12} />
            {user.role} Authorization
          </div>
        </div>

        {/* Right Side: Settings Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Profile Details */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              Terminal Profile
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-name">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input id="user-name" type="text" className="form-control" style={{ paddingLeft: '40px' }} value={user.name} readOnly />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-email">Operator Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input id="user-email" type="email" className="form-control" style={{ paddingLeft: '40px' }} value={user.email} readOnly />
                </div>
              </div>
            </div>
          </div>

          {/* Alert Telemetry Config */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
              Telemetry filters &amp; Notifications
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bell size={18} style={{ color: 'var(--color-danger)' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>Critical Alerts</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Receive sound notifications on critical grid events</p>
                  </div>
                </div>
                <div style={{ background: 'var(--accent-gradient)', width: '38px', height: '20px', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ background: '#fff', width: '16px', height: '16px', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.01)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Key size={18} style={{ color: 'var(--color-success)' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '600' }}>Terminal Audits</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Keep full audit log files of configuration overrides</p>
                  </div>
                </div>
                <div style={{ background: 'var(--accent-gradient)', width: '38px', height: '20px', borderRadius: '10px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ background: '#fff', width: '16px', height: '16px', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }} />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
