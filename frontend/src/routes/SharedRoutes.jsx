import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRedirectPathByRole } from '../services/authService';
import Login from "../pages/shared/Login"; 
import IconGallery from "../pages/shared/IconGallery"; 

// Component để redirect user đã đăng nhập
const AuthenticatedRedirect = () => {
  const { isAuthenticated, getUserRole } = useAuth();
  
  if (isAuthenticated()) {
    const userRole = getUserRole();
    const redirectPath = getRedirectPathByRole(userRole);
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Navigate to="login" replace />;
};

const SharedRoutes = [
  {
    path: '',
    children: [
      {
        index: true,
        element: <AuthenticatedRedirect />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'icon',
        element: <IconGallery />,
      },
    ],
  },
];

export default SharedRoutes;
