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

export const getAvailableLanguages = async () => {
  const response = await api.get('/fair/config/languages');
  return response.data.data;
};

export const getEmployerDashboard = async () => {
  const response = await api.get('/employer/my-dashboard');
  return response.data;
};

export const joinAsPartner = async (id, formData) => {
  const response = await api.post(`/employer/${id}/join-as-partner`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEmployerJob = async (id, jobId, formData) => {
  const response = await api.put(`/employer/${id}/job/${jobId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteEmployerJob = async (id, jobId) => {
  const response = await api.delete(`/employer/${id}/job/${jobId}`);
  return response.data;
};
