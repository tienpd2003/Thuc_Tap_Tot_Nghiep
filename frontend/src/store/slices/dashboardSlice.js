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
    dailyStats: false,
  },
  
  // Error states
  error: {
    quickStats: null,
    overviewStats: null,
    departmentStats: null,
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
    
    setDailyStatsError: (state, action) => {
      state.error.dailyStats = action.payload;
      state.loading.dailyStats = false;
    },

    clearAllErrors: (state) => {
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
  setDailyStatsLoading,
  setQuickStatsError,
  setOverviewStatsError,
  setDepartmentStatsError,
  setDailyStatsError,
  clearAllErrors,
  setQuickStats,
  setOverviewStats,
  setDepartmentStats,
  setDailyStats,
  setSelectedPeriod,
  setSelectedDays,
  resetOverviewStats,
  resetDepartmentStats,
  resetDailyStats,
  resetDashboardState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
