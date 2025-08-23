import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

const Sidebar = ({ drawerWidth, mobileOpen, onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Admin Navigation Items (only MyJob functions)
  const adminMenuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: ROUTES.ADMIN.DASHBOARD,
      description: 'Tổng quan thống kê'
    },
    {
      text: 'User Management',
      icon: <PeopleIcon />,
      path: ROUTES.ADMIN.USERS.LIST,
      description: 'Quản lý người dùng'
    },
    {
      text: 'Department Management',
      icon: <BusinessIcon />,
      path: ROUTES.ADMIN.DEPARTMENTS.LIST,
      description: 'Quản lý phòng ban'
    },
    {
      text: 'Form Template Management',
      icon: <DescriptionIcon />,
      path: ROUTES.ADMIN.FORM_TEMPLATES.LIST,
      description: 'Quản lý mẫu form'
    },
  ];

  const systemMenuItems = [
    {
      text: 'Reports',
      icon: <BarChartIcon />,
      path: '/admin/reports',
      description: 'Báo cáo hệ thống'
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
      description: 'Cài đặt hệ thống'
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Main Admin Functions */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 'bold',
            px: 3,
            fontSize: '0.75rem',
          }}
        >
          QUẢN LÝ CHÍNH
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {adminMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                secondary={item.description}
                secondaryTypographyProps={{
                  sx: {
                    color: isActive(item.path) ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    fontSize: '0.75rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1 }} />

      {/* System Functions */}
      <Box sx={{ px: 2, py: 1 }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.secondary',
            fontWeight: 'bold',
            px: 2,
            fontSize: '0.75rem',
          }}
        >
          HỆ THỐNG
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {systemMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                color: isActive(item.path) ? 'white' : 'text.primary',
                '&:hover': {
                  backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path) ? 'white' : 'text.secondary',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                secondary={item.description}
                secondaryTypographyProps={{
                  sx: {
                    color: isActive(item.path) ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                    fontSize: '0.75rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Admin Dashboard v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ 
        width: { sm: drawerWidth }, 
        flexShrink: { sm: 0 },
        height: '100%',
        backgroundColor: '#fafafa',
        borderRight: '1px solid #e0e0e0',
      }}
      aria-label="admin navigation"
    >
      {/* Mobile - Overlay */}
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          backgroundColor: 'rgba(0,0,0,0.5)',
          visibility: mobileOpen ? 'visible' : 'hidden',
          opacity: mobileOpen ? 1 : 0,
          transition: 'visibility 0s, opacity 0.3s',
        }}
        onClick={onDrawerToggle}
      />
      
      {/* Mobile - Sidebar */}
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          position: 'fixed',
          top: 0,
          left: 0,
          width: drawerWidth,
          height: '100vh',
          zIndex: 1201,
          backgroundColor: '#fafafa',
          borderRight: '1px solid #e0e0e0',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <SidebarContent />
      </Box>

      {/* Desktop - Always visible */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'block' },
          width: drawerWidth,
          height: '100%',
        }}
      >
        <SidebarContent />
      </Box>
    </Box>
  );
};

export default Sidebar;
