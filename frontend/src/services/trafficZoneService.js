import api from './api';

const trafficZoneService = {
    getAll: () => api.get('/zones').then(res => res.data),
    getById: (id) => api.get(`/zones/${id}`).then(res => res.data),
    getCongested: () => api.get('/zones/congested').then(res => res.data),
    delete: (id) => api.delete(`/zones/${id}`).then(res => res.data),
};
export default trafficZoneService;
