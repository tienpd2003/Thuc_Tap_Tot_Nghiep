import apiClient from './apiClient';

export const login = async ({ username, password }) => {
  const response = await apiClient.post(`/auth/login`, {
    username,
    password,
  });
  return response.data;
};

export const requestPasswordReset = async (identifier) => {
  const response = await apiClient.post(`/auth/forgot-password`, {
    identifier,
  });
  return response.data;
};


