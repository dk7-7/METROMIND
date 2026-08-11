import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import AlertNotificationList from './components/alertNotification/AlertNotificationList';
import './assets/styles/global.css';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <AlertNotificationList />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
