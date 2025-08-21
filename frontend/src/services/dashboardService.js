import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

// Admin Dashboard API service - mapping tới 4 Admin Stats APIs đã có
export const dashboardService = {
  // GET /api/admin/stats/overview?period=week|month|year - Dashboard tổng quan
  getOverviewStats: (period = 'week') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_OVERVIEW}?period=${period}`);
  },

  // GET /api/admin/stats/departments?period=week|month|year - Thống kê phòng ban
  getDepartmentStats: (period = 'week') => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_DEPARTMENTS}?period=${period}`);
  },

  // GET /api/admin/stats/daily?days=7|30|365 - Dữ liệu biểu đồ xu hướng
  getDailyStats: (days = 7) => {
    return apiClient.get(`${API_ENDPOINTS.ADMIN_STATS_DAILY}?days=${days}`);
  },

  // GET /api/admin/stats/quick - Quick metrics cho widgets
  getQuickStats: () => {
    return apiClient.get(API_ENDPOINTS.ADMIN_STATS_QUICK);
  },
};

export default dashboardService;
