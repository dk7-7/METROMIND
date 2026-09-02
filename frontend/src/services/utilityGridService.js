import api from './api';

export const getAll = async () => {
  const response = await api.get('/grids');
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/grids/${id}`);
  return response.data;
};

export const create = async (data) => {
  const response = await api.post('/grids', data);
  return response.data;
};

export const update = async (id, data) => {
  const response = await api.put(`/grids/${id}`, data);
  return response.data;
};

export const registerOutage = async (id, data) => {
  const response = await api.post(`/grids/${id}/outages`, data);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/grids/${id}`);
  return response.data;
};

const utilityGridService = {
  getAll,
  getById,
  create,
  update,
  registerOutage,
  deleteRecord,
};

export default utilityGridService;