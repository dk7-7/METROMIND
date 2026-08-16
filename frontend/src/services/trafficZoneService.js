import api from './api';

const trafficZoneService = {
    getAll: async () => {
        const response = await api.get('/zones');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/zones/${id}`);
        return response.data;
    },
    getCongested: async () => {
        const response = await api.get('/zones/congested');
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/zones/${id}`);
        return response.data;
    },
};

export default trafficZoneService;
