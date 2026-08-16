import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <AppRoutes />
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
