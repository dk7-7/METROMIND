import React from 'react';

export const Footer = () => {
  return (
    <footer 
      style={{
        padding: '20px 24px',
        textAlign: 'center',
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--glass-border)',
        color: 'var(--text-muted)',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
      }}
    >
      <div>
        &copy; {new Date().getFullYear()} GridSentinel Control System. All rights reserved.
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>Security Layer: v2.4.1</span>
        <span>Node: Sentinel-Main-01</span>
      </div>
    </footer>
  );
};

export default Footer;
