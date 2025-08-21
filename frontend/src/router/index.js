import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { ROUTES } from '../constants';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserList from '../pages/admin/users/UserList';
import UserForm from '../pages/admin/users/UserForm';
import DepartmentList from '../pages/admin/departments/DepartmentList';
import DepartmentForm from '../pages/admin/departments/DepartmentForm';

// Error Pages
import NotFound from '../pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
  },
  {
    path: '/admin',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      // User Management Routes
      {
        path: 'users',
        children: [
          {
            index: true,
            element: <UserList />,
          },
          {
            path: 'new',
            element: <UserForm />,
          },
          {
            path: ':id/edit',
            element: <UserForm />,
          },
        ],
      },
      // Department Management Routes
      {
        path: 'departments',
        children: [
          {
            index: true,
            element: <DepartmentList />,
          },
          {
            path: 'new',
            element: <DepartmentForm />,
          },
          {
            path: ':id/edit',
            element: <DepartmentForm />,
          },
        ],
      },
      // System Routes (placeholder)
      {
        path: 'reports',
        element: <div>Reports Page - Coming Soon</div>,
      },
      {
        path: 'settings',
        element: <div>Settings Page - Coming Soon</div>,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
