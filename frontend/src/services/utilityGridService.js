import api from './api';

const utilityGridService = {
    getAll: async () => {
        const response = await api.get('/grids');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/grids/${id}`);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/grids/${id}`, data);
        return response.data;
    },
    registerOutage: async (id, data) => {
        const response = await api.post(`/grids/${id}/outages`, data);
        return response.data;
    },
};

export default utilityGridService;
