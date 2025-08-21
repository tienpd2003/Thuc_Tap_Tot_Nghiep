import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

// Import reducers - ADMIN FOCUSED ONLY
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import departmentReducer from './slices/departmentSlice';
import dashboardReducer from './slices/dashboardSlice';
// Note: roleReducer included for user role assignment functionality

// Import root saga
import rootSaga from './sagas/index';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store với Redux Toolkit
const store = configureStore({
  reducer: {
    auth: authReducer,           // Simple role switching for testing
    users: userReducer,          // *** User management (MyJob)
    departments: departmentReducer, // *** Department management (MyJob)
    dashboard: dashboardReducer, // *** Admin dashboard statistics (MyJob)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore redux-saga actions
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }).concat(sagaMiddleware),
  devTools: import.meta.env.DEV,
});

// Run the root saga
sagaMiddleware.run(rootSaga);

export default store;
