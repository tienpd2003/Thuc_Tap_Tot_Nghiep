import { createSlice } from '@reduxjs/toolkit';

// Initial state cho department management
const initialState = {
  departments: [],
  selectedDepartment: null,
  departmentUsers: [],
  loading: false,
  error: null,
  filters: {
    activeOnly: false,
    searchQuery: '',
  },
  pagination: {
    page: 0,
    pageSize: 10,
    total: 0,
  },
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Error handling
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },

    // Departments data management
    setDepartments: (state, action) => {
      state.departments = action.payload;
      state.loading = false;
      state.error = null;
    },

    addDepartment: (state, action) => {
      state.departments.push(action.payload);
    },

    updateDepartment: (state, action) => {
      const index = state.departments.findIndex(dept => dept.id === action.payload.id);
      if (index !== -1) {
        state.departments[index] = action.payload;
      }
    },

    removeDepartment: (state, action) => {
      state.departments = state.departments.filter(dept => dept.id !== action.payload);
    },

    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },

    // Department users
    setDepartmentUsers: (state, action) => {
      state.departmentUsers = action.payload;
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetDepartmentState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setDepartments,
  addDepartment,
  updateDepartment,
  removeDepartment,
  setSelectedDepartment,
  setDepartmentUsers,
  setFilters,
  clearFilters,
  setPagination,
  resetDepartmentState,
} = departmentSlice.actions;

export default departmentSlice.reducer;
