import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading spinner khi đang kiểm tra authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FaSpinner className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu role cụ thể, kiểm tra role
  if (requiredRoles.length > 0) {
    const userRole = getUserRole();
    const hasRequiredRole = requiredRoles.some(role => 
      role.toUpperCase() === userRole
    );

    if (!hasRequiredRole) {
      // Redirect về trang phù hợp với role của user
      const redirectPath = getRedirectPathByRole(userRole);
      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

// Helper function để lấy redirect path theo role
const getRedirectPathByRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/';
    case 'EMPLOYEE':
      return '/employee/';
    case 'APPROVER':
      return '/approver/';
    default:
      return '/login';
  }
};

export default ProtectedRoute;
