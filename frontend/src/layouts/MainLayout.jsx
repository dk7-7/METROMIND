import React, { useState } from 'react';
import Navbar from '../Components/common/Navbar';
import Sidebar from '../Components/common/Sidebar';
import Footer from '../Components/common/Footer';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {sidebarOpen && <Sidebar />}
        
        <main 
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '30px 24px',
            overflowY: 'auto',
            minHeight: 'calc(100vh - var(--navbar-height))',
            background: 'radial-gradient(ellipse at top, rgba(99, 102, 241, 0.05), transparent 70%)',
          }}
        >
          <div style={{ maxWidth: '1400px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', flex: 1 }}>
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
