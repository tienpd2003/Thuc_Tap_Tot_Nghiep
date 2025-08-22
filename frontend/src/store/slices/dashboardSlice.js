import { createSlice } from '@reduxjs/toolkit';

// Initial state cho dashboard
const initialState = {
  // Quick stats data
  quickStats: {
    totalUsers: 0,
    totalDepartments: 0,
    totalTickets: 0,
    processingRate: 0,
  },
  
  // Overview stats with period filtering
  overviewStats: {
    period: 'week', // week, month, year
    data: null,
  },
  
  // Department performance stats
  departmentStats: {
    period: 'week',
    data: [],
  },
  
  // Role-based user stats
  roleStats: {
    period: 'week',
    data: [],
    dailyStats: [],
    userGrowth: [],
  },
  
  // Daily trend data for charts
  dailyStats: {
    days: 7, // 7, 30, 365
    data: [],
  },
  
  // Loading states
  loading: {
    quickStats: false,
    overviewStats: false,
    departmentStats: false,
    roleStats: false,
    dailyStats: false,
  },
  
  // Error states
  error: {
    quickStats: null,
    overviewStats: null,
    departmentStats: null,
    roleStats: null,
    dailyStats: null,
  },
  
  // UI state
  selectedPeriod: 'week',
  selectedDays: 7,
  lastUpdated: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Loading states cho từng loại data
    setQuickStatsLoading: (state, action) => {
      state.loading.quickStats = action.payload;
    },
    
    setOverviewStatsLoading: (state, action) => {
      state.loading.overviewStats = action.payload;
    },
    
    setDepartmentStatsLoading: (state, action) => {
      state.loading.departmentStats = action.payload;
    },
    
    setRoleStatsLoading: (state, action) => {
      state.loading.roleStats = action.payload;
    },
    
    setDailyStatsLoading: (state, action) => {
      state.loading.dailyStats = action.payload;
    },

    // Error handling
    setQuickStatsError: (state, action) => {
      state.error.quickStats = action.payload;
      state.loading.quickStats = false;
    },
    
    setOverviewStatsError: (state, action) => {
      state.error.overviewStats = action.payload;
      state.loading.overviewStats = false;
    },
    
    setDepartmentStatsError: (state, action) => {
      state.error.departmentStats = action.payload;
      state.loading.departmentStats = false;
    },
    
    setRoleStatsError: (state, action) => {
      state.error.roleStats = action.payload;
      state.loading.roleStats = false;
    },
    
    setDailyStatsError: (state, action) => {
      state.error.dailyStats = action.payload;
      state.loading.dailyStats = false;
    },    clearAllErrors: (state) => {
      state.error = initialState.error;
    },

    // Data setters
    setQuickStats: (state, action) => {
      state.quickStats = action.payload;
      state.loading.quickStats = false;
      state.error.quickStats = null;
      state.lastUpdated = Date.now();
    },

    setOverviewStats: (state, action) => {
      state.overviewStats.data = action.payload;
      state.loading.overviewStats = false;
      state.error.overviewStats = null;
    },

    setDepartmentStats: (state, action) => {
      state.departmentStats.data = action.payload;
      state.loading.departmentStats = false;
      state.error.departmentStats = null;
    },

    setRoleStats: (state, action) => {
      state.roleStats.data = action.payload.data || action.payload;
      state.roleStats.dailyStats = action.payload.dailyStats || [];
      state.roleStats.userGrowth = action.payload.userGrowth || [];
      state.loading.roleStats = false;
      state.error.roleStats = null;
    },

    setDailyStats: (state, action) => {
      state.dailyStats.data = action.payload;
      state.loading.dailyStats = false;
      state.error.dailyStats = null;
    },

    // Period and filter setters
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
      state.overviewStats.period = action.payload;
      state.departmentStats.period = action.payload;
    },

    setSelectedDays: (state, action) => {
      state.selectedDays = action.payload;
      state.dailyStats.days = action.payload;
    },

    // Reset specific data when needed
    resetOverviewStats: (state) => {
      state.overviewStats.data = null;
      state.error.overviewStats = null;
    },

    resetDepartmentStats: (state) => {
      state.departmentStats.data = [];
      state.error.departmentStats = null;
    },

    resetRoleStats: (state) => {
      state.roleStats.data = [];
      state.roleStats.dailyStats = [];
      state.roleStats.userGrowth = [];
      state.error.roleStats = null;
    },

    resetDailyStats: (state) => {
      state.dailyStats.data = [];
      state.error.dailyStats = null;
    },

    // Reset entire dashboard state
    resetDashboardState: () => initialState,
  },
});

export const {
  setQuickStatsLoading,
  setOverviewStatsLoading,
  setDepartmentStatsLoading,
  setRoleStatsLoading,
  setDailyStatsLoading,
  setQuickStatsError,
  setOverviewStatsError,
  setDepartmentStatsError,
  setRoleStatsError,
  setDailyStatsError,
  clearAllErrors,
  setQuickStats,
  setOverviewStats,
  setDepartmentStats,
  setRoleStats,
  setDailyStats,
  setSelectedPeriod,
  setSelectedDays,
  resetOverviewStats,
  resetDepartmentStats,
  resetRoleStats,
  resetDailyStats,
  resetDashboardState,
} = dashboardSlice.actions;

// Action creators for sagas
export const fetchQuickStats = () => ({ type: 'dashboard/fetchQuickStats' });
export const fetchUsersByDepartment = (period = 'month') => ({ 
  type: 'dashboard/fetchUsersByDepartment', 
  payload: { period } 
});
export const fetchUsersByRole = (period = 'month') => ({ 
  type: 'dashboard/fetchUsersByRole', 
  payload: { period } 
});
export const fetchOverviewStats = (period = 'month') => ({ 
  type: 'dashboard/fetchOverviewStats', 
  payload: { period } 
});

export default dashboardSlice.reducer;
