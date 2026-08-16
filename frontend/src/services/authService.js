import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data; // Expected: token, username, role
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
    }
};
export default authService;
