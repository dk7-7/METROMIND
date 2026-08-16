import api from './api';

const alertService = {
    getAll: async () => {
        const response = await api.get('/alerts');
        return response.data;
    },
    markRead: async (id) => {
        const response = await api.put(`/alerts/${id}/read`);
        return response.data;
    }
};

export default alertService;
