import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get(`/superadmin/stats`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get(`/superadmin/users`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/superadmin/users/${id}`);
  return response.data;
};

export const getAllEvents = async () => {
  const response = await api.get(`/superadmin/events`);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/superadmin/events/${id}`);
  return response.data;
};

export const impersonateUser = async (id) => {
  const response = await api.post(`/superadmin/users/${id}/impersonate`, {});
  return response.data;
};

export const changeUserPassword = async (id, password, notifyUser) => {
  const response = await api.put(`/superadmin/users/${id}/password`, { password, notifyUser });
  return response.data;
};

export const updateSuperAdminProfile = async (profileData) => {
  const response = await api.put(`/superadmin/profile`, profileData);
  return response.data;
};

export const approveAdmin = async (id) => {
  const response = await api.get(`/superadmin/approve-admin/${id}`);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get("/superadmin/bookings");
  return response.data;
};
