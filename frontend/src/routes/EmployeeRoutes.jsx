import React from 'react';
import { Navigate } from 'react-router-dom';
import EmployeeLayout from '../layouts/EmployeeLayout';
import EmployeeHome from '../pages/employee/EmployeeHome';

const EmployeeRoutes = [
  {
    path: '/employee',
    element: <EmployeeLayout />,
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