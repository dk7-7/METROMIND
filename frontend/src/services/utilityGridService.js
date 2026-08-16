import api from './api';

const utilityGridService = {
    getAll: () => api.get('/grids').then(res => res.data),
    getById: (id) => api.get(`/grids/${id}`).then(res => res.data),
    update: (id, data) => api.put(`/grids/${id}`, data).then(res => res.data),
    registerOutage: (id, data) => api.post(`/grids/${id}/outages`, data).then(res => res.data),
};
export default utilityGridService;
