import api from './api';

export const getAll = async () => {
  const response = await api.get('/alerts');
  return response.data;
};

export const markRead = async (id) => {
  const response = await api.put(`/alerts/${id}/read`);
  return response.data;
};

export const markAsRead = markRead;

export const create = async (data) => {
  const response = await api.post('/alerts', data);
  return response.data;
};

const alertNotificationService = {
  getAll,
  markRead,
  markAsRead,
  create,
};

export default alertNotificationService;