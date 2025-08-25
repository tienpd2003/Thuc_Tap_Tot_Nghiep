import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import { ROUTES } from '../constants';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import TestDashboard from '../pages/admin/TestDashboard';
import UserList from '../pages/admin/users/UserList';
import UserForm from '../pages/admin/users/UserForm';
import DepartmentList from '../pages/admin/departments/DepartmentList';
import DepartmentForm from '../pages/admin/departments/DepartmentForm';
import FormTemplateManagement from '../pages/admin/form-templates/FormTemplateManagement';
import ViewFormTemplate from '../features/form-templates/ViewFormTemplate';
import PreviewFormTemplate from '../features/form-templates/PreviewFormTemplate';
import CreateFormTemplate from '../features/form-templates/CreateFormTemplate';

const AdminRoutes = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'test-dashboard',
        element: <TestDashboard />,
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
      // Form Builder Routes
      {
        path: 'form-templates',
        children: [
          {
            index: true,
            element: <FormTemplateManagement />,
          },
          {
            path: 'new',
            element: <CreateFormTemplate />,
          },
          {
            path: ':templateId',
            element: <CreateFormTemplate />,
          },
          {
            path: ':id/view',
            element: <PreviewFormTemplate />,
          },
          {
            path: ':id/fill',
            element: <ViewFormTemplate />,
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
];

export default AdminRoutes;