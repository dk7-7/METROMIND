import api from "./api";

const getAll = () => api.get("/incidents");

const getById = (id) => api.get(`/incidents/${id}`);

const create = (data) => api.post("/incidents", data);

const update = (id, data) => api.put(`/incidents/${id}`, data);

const remove = (id) => api.delete(`/incidents/${id}`);

const dispatchIncident = (id) =>
    api.put(`/incidents/${id}/dispatch`);

const trafficIncidentService = {
    getAll,
    getById,
    create,
    update,
    remove,
    dispatchIncident,
};

export default trafficIncidentService;