import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Department API service - mapping tới 8 Department APIs đã có
export const departmentService = {
  // GET /api/departments - List all departments
  getAllDepartments: () => {
    return apiClient.get(API_ENDPOINTS.DEPARTMENTS);
  },

  // GET /api/departments?activeOnly=true - List active departments
  getActiveDepartments: () => {
    return apiClient.get(API_ENDPOINTS.DEPARTMENTS_ACTIVE);
  },

  // GET /api/departments/{id} - Get department by ID
  getDepartmentById: (id) => {
    return apiClient.get(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  },

  // GET /api/departments/{id}/users - Get users in department
  getDepartmentUsers: (id) => {
    return apiClient.get(API_ENDPOINTS.DEPARTMENTS_USERS(id));
  },

  // POST /api/departments - Create department
  createDepartment: (departmentData) => {
    return apiClient.post(API_ENDPOINTS.DEPARTMENTS, departmentData);
  },

  // PUT /api/departments/{id} - Update department
  updateDepartment: (id, departmentData) => {
    return apiClient.put(`${API_ENDPOINTS.DEPARTMENTS}/${id}`, departmentData);
  },

  // PUT /api/departments/{id}/deactivate - Deactivate department
  deactivateDepartment: (id) => {
    return apiClient.put(API_ENDPOINTS.DEPARTMENTS_DEACTIVATE(id));
  },

  // DELETE /api/departments/{id} - Delete department
  deleteDepartment: (id) => {
    return apiClient.delete(`${API_ENDPOINTS.DEPARTMENTS}/${id}`);
  },
};

export default departmentService;
