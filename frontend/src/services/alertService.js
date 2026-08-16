import api from './api';

const alertService = {
    getAll: () => api.get('/alerts').then(res => res.data),
    markRead: (id) => api.put(`/alerts/${id}/read`).then(res => res.data),
};
export default alertService;
