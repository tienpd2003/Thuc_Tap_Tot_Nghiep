import { createSlice } from '@reduxjs/toolkit';

// Initial state cho user management
const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    department: '',
    role: '',
    isActive: null,
  },
  pagination: {
    page: 0,
    pageSize: 10,
    total: 0,
  },
};

const userSlice = createSlice({
  name: 'users',
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

    // Users data management
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
      state.error = null;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },

    removeUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },

    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    // Search and filter
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },

    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchQuery = '';
    },

    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Reset state
    resetUserState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUsers,
  addUser,
  updateUser,
  removeUser,
  setSelectedUser,
  setSearchQuery,
  setFilters,
  clearFilters,
  setPagination,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
