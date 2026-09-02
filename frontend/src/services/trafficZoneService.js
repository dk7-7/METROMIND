import api from './api';

export const getAll = async () => {
  const response = await api.get('/zones');
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/zones/${id}`);
  return response.data;
};

export const getCongested = async () => {
  const response = await api.get('/zones/congested');
  return response.data;
};

export const create = async (data) => {
  const response = await api.post('/zones', data);
  return response.data;
};

export const update = async (id, data) => {
  const response = await api.put(`/zones/${id}`, data);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/zones/${id}`);
  return response.data;
};

const trafficZoneService = {
  getAll,
  getById,
  getCongested,
  create,
  update,
  deleteRecord,
};

export default trafficZoneService;