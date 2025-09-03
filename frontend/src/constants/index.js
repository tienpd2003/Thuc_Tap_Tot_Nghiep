// API Base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// Authentication API Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  RESET_PASSWORD: '/auth/reset-password',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  ...AUTH_ENDPOINTS,
  
  // User Management (7 APIs)
  USERS: '/users',
  USERS_SEARCH: '/users/search',
  USERS_DEACTIVATE: (id) => `/users/${id}/deactivate`,
  
  // Department Management (8 APIs)
  DEPARTMENTS: '/departments',
  DEPARTMENTS_ACTIVE: '/departments?activeOnly=true',
  DEPARTMENTS_USERS: (id) => `/departments/${id}/users`,
  DEPARTMENTS_DEACTIVATE: (id) => `/departments/${id}/deactivate`,
  
  // Roles (for user assignment only)
  ROLES: '/roles',
  ROLES_USERS: (id) => `/roles/${id}/users`,
  
  // Admin Dashboard Stats (6 APIs)
  ADMIN_STATS_OVERVIEW: '/admin/stats/overview',
  ADMIN_STATS_DEPARTMENTS: '/admin/stats/departments',
  ADMIN_STATS_DAILY: '/admin/stats/daily',
  ADMIN_STATS_QUICK: '/admin/stats/quick',
  ADMIN_STATS_USER_GROWTH: '/admin/stats/user-growth',
  ADMIN_STATS_RECENT_USERS: '/admin/stats/recent-users',
  
  // Employee APIs
  EMPLOYEE_DASHBOARD: (employeeId) => `/employee/${employeeId}/dashboard`,
  EMPLOYEE_TICKETS: (employeeId) => `/employee/${employeeId}/tickets`,
  EMPLOYEE_TICKETS_BY_STATUS: (employeeId, status) => `/employee/${employeeId}/tickets/status/${status}`,
  EMPLOYEE_TICKETS_SEARCH: (employeeId) => `/employee/${employeeId}/tickets/search`,
  EMPLOYEE_TICKETS_DATE_RANGE: (employeeId) => `/employee/${employeeId}/tickets/dateRange`,
  
  // Ticket APIs
  TICKETS: '/tickets',
  TICKET_BY_ID: (ticketId) => `/tickets/${ticketId}`,
  TICKET_UPDATE: (ticketId, employeeId) => `/tickets/${ticketId}/employee/${employeeId}`,
  TICKET_DELETE: (ticketId, employeeId) => `/tickets/${ticketId}/employee/${employeeId}`,
  TICKET_FORM_DATA: (ticketId) => `/tickets/${ticketId}/form-data`,
};

// Admin Navigation Routes
export const ROUTES = {
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: {
      LIST: '/admin/users',
      CREATE: '/admin/users/new',
      EDIT: (id) => `/admin/users/${id}/edit`,
    },
    DEPARTMENTS: {
      LIST: '/admin/departments', 
      CREATE: '/admin/departments/new',
      EDIT: (id) => `/admin/departments/${id}/edit`,
    },
    FORM_TEMPLATES: {
      LIST: '/admin/form-templates',
      CREATE: '/admin/form-templates/new',
      EDIT: (id) => `/admin/form-templates/${id}`,
    },
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  },
};

// User Roles (for admin role assignment)
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  APPROVER: 'APPROVER', 
  EMPLOYEE: 'EMPLOYEE',
};

// Role Labels (Vietnamese)
export const ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Quản trị viên',
  [USER_ROLES.APPROVER]: 'Người phê duyệt',
  [USER_ROLES.EMPLOYEE]: 'Nhân viên',
};

// Chart Colors for Admin Dashboard
export const CHART_COLORS = {
  primary: '#1976d2',
  secondary: '#dc004e', 
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1',
  palette: ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0', '#ff5722'],
};

// Admin Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
};

// Form Validation Messages (Vietnamese)
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  EMAIL_UNIQUE: 'Email đã tồn tại trong hệ thống',
  PHONE_INVALID: 'Số điện thoại không hợp lệ',
  EMPLOYEE_CODE_UNIQUE: 'Mã nhân viên đã tồn tại',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 6 ký tự',
  DEPARTMENT_REQUIRED: 'Phải chọn phòng ban',
  ROLE_REQUIRED: 'Phải chọn vai trò',
};

// Dashboard Stats Periods
export const STATS_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const PERIOD_LABELS = {
  [STATS_PERIODS.WEEK]: '7 ngày qua',
  [STATS_PERIODS.MONTH]: '30 ngày qua',
  [STATS_PERIODS.YEAR]: '1 năm qua',
};
