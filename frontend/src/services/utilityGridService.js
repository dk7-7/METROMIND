import api from "./api";

const getAll = () => api.get("/grids");
const getById = (id) => api.get(`/grids/${id}`);
const update = (id, data) => api.put(`/grids/${id}`, data);
const registerOutage = (id, data) => api.post(`/grids/${id}/outages`, data);

const utilityGridService = { getAll, getById, update, registerOutage };
export default utilityGridService;
