import React from 'react';
import { Cpu } from 'lucide-react';

export const AuthLayout = ({ children }) => {
  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#070a13',
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.15), transparent 40%)',
        padding: '24px',
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        className="fade-in"
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div 
            style={{
              background: 'var(--accent-gradient)',
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Cpu size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '1px' }}>
            GRID<span className="gradient-text">SENTINEL</span>
          </span>
        </div>

        {/* Form Panel */}
        <div 
          style={{
            width: '100%',
            padding: '40px 32px',
          }}
          className="glass-panel"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
