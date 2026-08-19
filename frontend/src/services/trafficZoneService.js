import api from "./api";

const getAll = () => api.get("/zones");
const getById = (id) => api.get(`/zones/${id}`);
const getCongested = () => api.get("/zones/congested");
const create = (data) => api.post("/zones", data);
const update = (id, data) => api.put(`/zones/${id}`, data);
const remove = (id) => api.delete(`/zones/${id}`);

const trafficZoneService = { getAll, getById, getCongested, create, update, remove };
export default trafficZoneService;
