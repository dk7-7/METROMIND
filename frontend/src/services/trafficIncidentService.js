import api from './api';

const trafficIncidentService = {
    getAll: async () => {
        const response = await api.get('/incidents');
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/incidents/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/incidents', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/incidents/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/incidents/${id}`);
        return response.data;
    },
    dispatch: async (id) => {
        const response = await api.put(`/incidents/${id}/dispatch`);
        return response.data;
    },
};

export default trafficIncidentService;
