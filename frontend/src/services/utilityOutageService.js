import api from './api';

export const getAll = async () => {
  const response = await api.get('/outages');
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/outages/${id}`);
  return response.data;
};

export const create = async (data) => {
  if (data.gridId) {
    const response = await api.post(`/grids/${data.gridId}/outages`, data);
    return response.data;
  }
  const response = await api.post('/outages', data);
  return response.data;
};

export const update = async (id, data) => {
  const response = await api.put(`/outages/${id}`, data);
  return response.data;
};

export const resolveOutage = async (id) => {
  const response = await api.put(`/outages/${id}/resolve`);
  return response.data;
};

export const deleteRecord = async (id) => {
  const response = await api.delete(`/outages/${id}`);
  return response.data;
};

const utilityOutageService = {
  getAll,
  getById,
  create,
  update,
  resolveOutage,
  deleteRecord,
};

export default utilityOutageService;