import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserRole } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token và user info từ localStorage khi app khởi động
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userInfo');
    
    if (storedToken && storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userInfo);
      } catch (error) {
        console.error('Error parsing stored user info:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (loginResponse) => {
    const { token: authToken, user: userInfo } = loginResponse;
    
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    setToken(authToken);
    setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('rememberedCredentials');
    
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const getUserRole = () => {
    if (!user || !user.roleName) return null;
    return user.roleName.toUpperCase();
  };

  const hasRole = (requiredRole) => {
    const userRole = getUserRole();
    return userRole === requiredRole.toUpperCase();
  };

  const hasAnyRole = (requiredRoles) => {
    const userRole = getUserRole();
    return requiredRoles.some(role => role.toUpperCase() === userRole);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated,
    getUserRole,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
