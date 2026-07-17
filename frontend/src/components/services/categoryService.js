import api from './api';

export const getCategories = async () => {
  // Try to fetch categories from the backend, or just return an empty array if not supported yet
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    return [];
  }
};
