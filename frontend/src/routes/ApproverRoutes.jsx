import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import ApproverLayout from '../layouts/ApproverLayout';
import ApproverHome from '../pages/approver/ApproverHome';

const ApproverRoutes = [
  {
    path: '/approver',
    element: (
      <ProtectedRoute requiredRoles={['APPROVER']}>
        <ApproverLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      {
        path: 'home',
        element: <ApproverHome />,
      },
    ],
  },
];

export default ApproverRoutes;