import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// User API service - mapping tới 7 User APIs đã có
export const userService = {
  // GET /api/users - List all users
  getAllUsers: () => {
    return apiClient.get(API_ENDPOINTS.USERS);
  },

  // GET /api/users/{id} - Get user by ID
  getUserById: (id) => {
    return apiClient.get(`${API_ENDPOINTS.USERS}/${id}`);
  },

  // GET /api/users/search?name={name} - Search by name
  searchUsersByName: (name) => {
    return apiClient.get(`${API_ENDPOINTS.USERS_SEARCH}?name=${encodeURIComponent(name)}`);
  },

  // POST /api/users - Create user
  createUser: (userData) => {
    return apiClient.post(API_ENDPOINTS.USERS, userData);
  },

  // PUT /api/users/{id} - Update user (Cannot update employeeCode and username)
  updateUser: (id, userData) => {
    return apiClient.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
  },

  // PUT /api/users/{id}/deactivate - Deactivate user
  deactivateUser: (id) => {
    return apiClient.put(API_ENDPOINTS.USERS_DEACTIVATE(id));
  },

  // DELETE /api/users/{id} - Delete user
  deleteUser: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
  },

  // Role-related APIs (for user role assignment)
  getAllRoles: () => {
    return apiClient.get(API_ENDPOINTS.ROLES);
  },

  getUsersByRole: (roleId) => {
    return apiClient.get(API_ENDPOINTS.ROLES_USERS(roleId));
  },
};

export default userService;
