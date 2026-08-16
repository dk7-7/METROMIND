import api from './api';
// Mostly handled by utilityGridService registerOutage, but if needed:
const outageService = {
    register: (gridId, data) => api.post(`/grids/${gridId}/outages`, data).then(res => res.data),
};
export default outageService;
