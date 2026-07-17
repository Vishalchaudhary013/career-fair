import api from './api';

export const getAllEvents = async () => {
  const response = await api.get('/fair/all');
  return response.data.data;
};

export const getEvent = async (id) => {
  const response = await api.get(`/fair/${id}`);
  return response.data.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/fair/delete/${id}`);
  return response.data;
};
