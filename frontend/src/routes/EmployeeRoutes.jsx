import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import EmployeeLayout from '../layouts/EmployeeLayout';
import EmployeeHome from '../pages/employee/EmployeeHome';

const EmployeeRoutes = [
  {
    path: '/employee',
    element: (
      <ProtectedRoute requiredRoles={['EMPLOYEE']}>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      {
        path: 'home',
        element: <EmployeeHome />,
      },
    ],
  },
];

export default EmployeeRoutes;