import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      try {
        sessionStorage.setItem('sessionMessage', 'Session expired. Please log in again.');
        sessionStorage.setItem('sessionExpired', 'true');
        sessionStorage.setItem('error', 'Session expired. Please log in again.');
      } catch (e) {
        // ignore storage errors
      }

      const expiryMsg = 'Session expired. Please log in again.';
      if (!error.response.data) {
        error.response.data = { message: expiryMsg, error: expiryMsg, status: 401 };
      } else if (typeof error.response.data === 'string') {
        error.response.data = { message: expiryMsg, error: expiryMsg, status: 401 };
      } else if (typeof error.response.data === 'object') {
        error.response.data.message = error.response.data.message || expiryMsg;
      }
      error.message = expiryMsg;

      if (typeof window !== 'undefined' && window.location && window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;