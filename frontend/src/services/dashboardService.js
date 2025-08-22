import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Admin Dashboard API service - mapping to AdminController endpoints
export const dashboardService = {
  // GET /api/admin/stats/quick - Quick stats for dashboard widgets
  getQuickStats: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN_STATS_QUICK);
  },

  // GET /api/admin/stats/overview?period=week|month|year - Dashboard overview
  getOverviewStats: (period = 'month') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_OVERVIEW}?period=${period}`);
  },

  // GET /api/admin/stats/departments?period=week|month|year - Department statistics
  getDepartmentStats: (period = 'month') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_DEPARTMENTS}?period=${period}`);
  },

  // GET /api/admin/stats/daily?days=7|30|365 - Daily trend data for charts
  getDailyStats: (days = 30) => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_DAILY}?days=${days}`);
  },

  // For compatibility with saga - mapping to correct endpoints
  getUsersByDepartment: (period = 'month') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_DEPARTMENTS}?period=${period}`);
  },

  getUsersByRole: (period = 'month') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_OVERVIEW}?period=${period}`);
  },

  // Alias for getOverviewStats to maintain compatibility
  getStatisticsByPeriod: (period = 'month') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_OVERVIEW}?period=${period}`);
  },
};

export default dashboardService;
