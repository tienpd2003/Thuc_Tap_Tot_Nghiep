import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

// Import route modules
import AdminRoutes from './AdminRoutes';
import EmployeeRoutes from './EmployeeRoutes';
import ApproverRoutes from './ApproverRoutes';
import SharedRoutes from './SharedRoutes';

// Error Pages
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
  },
  // Admin Routes
  ...AdminRoutes,
  // Employee Routes  
  ...EmployeeRoutes,
  // Approver Routes
  ...ApproverRoutes,
  // Shared Routes
  ...SharedRoutes,
  // 404 Route
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
