import apiClient from './apiClient';
import { AUTH_ENDPOINTS } from '../constants';

export const login = async ({ username, password }) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
    username,
    password,
  });
  return response.data;
};

export const requestPasswordReset = async (identifier) => {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    identifier,
  });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  return response.data;
};

// Helper function to get user role from login response
export const getUserRole = (loginResponse) => {
  if (!loginResponse || !loginResponse.user || !loginResponse.user.roleName) {
    return null;
  }
  return loginResponse.user.roleName.toUpperCase();
};

// Helper function to get redirect path based on role
export const getRedirectPathByRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/';
    case 'EMPLOYEE':
      return '/employee/';
    case 'APPROVER':
      return '/approver/';
    default:
      return '/login';
  }
};


