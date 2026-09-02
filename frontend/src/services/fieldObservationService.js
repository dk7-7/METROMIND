import api from './api';

export const getAll = async () => {
  const response = await api.get('/observations');
  return response.data;
};

export const getById = async (id) => {
  const response = await api.get(`/observations/${id}`);
  return response.data;
};

export const create = async (data) => {
  const response = await api.post('/observations', data);
  return response.data;
};

const fieldObservationService = {
  getAll,
  getById,
  create,
};

export default fieldObservationService;