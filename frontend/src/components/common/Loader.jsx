import React from 'react';

export const Loader = ({ fullPage = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div 
        style={{
          borderTopColor: 'var(--accent-primary)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          animation: 'spin 1s linear infinite'
        }}
        className={`rounded-full ${sizeClasses[size] || sizeClasses.md}`}
      />
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '500' }}>
        Loading Utility Control Room...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loaderContent}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', minHeight: '200px', alignItems: 'center', justifyContent: 'center' }}>
      {loaderContent}
    </div>
  );
};

export default Loader;
