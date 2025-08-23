import React from 'react';
import { Navigate } from 'react-router-dom';
import Login from "../pages/shared/Login"; 
import IconGallery from "../pages/shared/IconGallery"; 

const SharedRoutes = [
  {
    path: '',
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
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
