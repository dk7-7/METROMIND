import api from './api';

export const getAll = async () => {
  const response = await api.get('/incidents');
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/incidents/${id}`);
  return response.data;
};

export const create = async (data) => {
  const response = await api.post('/incidents', data);
  return response.data;
};

export const update = async (id, data) => {
  const response = await api.put(`/incidents/${id}`, data);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data;
};

export const dispatchResponse = async (id) => {
  const response = await api.put(`/incidents/${id}/dispatch`);
  return response.data;
};

const trafficIncidentService = {
  getAll,
  getById,
  create,
  update,
  deleteRecord,
  dispatchResponse,
};

export default trafficIncidentService;