import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import EmployeeLayout from '../layouts/EmployeeLayout';
import EmployeeHome from '../pages/employee/EmployeeHome';

// Direct imports instead of lazy loading to avoid issues
import CreateTicket from '../pages/employee/CreateTicket';
import TicketList from '../pages/employee/TicketList';
import TicketHistory from '../pages/employee/TicketHistory';
import TicketDetail from '../pages/employee/TicketDetail';

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
      // Ticket routes
      {
        path: 'tickets',
        children: [
          {
            index: true,
            element: <TicketList />,
          },
          {
            path: 'create',
            element: <CreateTicket />,
          },
          {
            path: 'history',
            element: <TicketHistory />,
          },
          {
            path: ':ticketId',
            element: <TicketDetail />,
          },
        ],
      },
    ],
  },
];

export default EmployeeRoutes;