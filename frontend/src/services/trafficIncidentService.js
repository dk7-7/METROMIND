import api from './api';

const trafficIncidentService = {
    getAll: () => api.get('/incidents').then(res => res.data),
    getById: (id) => api.get(`/incidents/${id}`).then(res => res.data),
    create: (data) => api.post('/incidents', data).then(res => res.data),
    update: (id, data) => api.put(`/incidents/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/incidents/${id}`).then(res => res.data),
    dispatch: (id) => api.put(`/incidents/${id}/dispatch`).then(res => res.data),
};
export default trafficIncidentService;
