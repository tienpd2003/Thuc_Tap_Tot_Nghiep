import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchQuickStats } from '../../store/slices/dashboardSlice';
import { CHART_COLORS } from '../../constants';

// Quick Stats Card Component
const QuickStatsCard = ({ title, value, icon, color, isLoading }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
            {isLoading ? <CircularProgress size={32} /> : value || 0}
          </Typography>
        </Box>
        <Avatar
          sx={{
            backgroundColor: color,
            width: 56,
            height: 56,
            position: 'absolute',
            right: 16,
            top: -8,
            boxShadow: 3,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { quickStats, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchQuickStats());
  }, [dispatch]);

  // Sample chart data (will be replaced with real data)
  const departmentUserData = [
    { name: 'IT', users: 12 },
    { name: 'HR', users: 8 },
    { name: 'Finance', users: 6 },
    { name: 'Marketing', users: 10 },
  ];

  const roleDistributionData = [
    { name: 'Employees', value: 28, color: CHART_COLORS.primary },
    { name: 'Managers', value: 6, color: CHART_COLORS.secondary },
    { name: 'Admins', value: 2, color: CHART_COLORS.success },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tổng quan hệ thống quản lý người dùng và phòng ban
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Tổng người dùng"
            value={quickStats?.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Tổng phòng ban"
            value={quickStats?.totalDepartments}
            icon={<BusinessIcon />}
            color="#2e7d32"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Người dùng hoạt động"
            value={quickStats?.activeUsers}
            icon={<CheckCircleIcon />}
            color="#ed6c02"
            isLoading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Tổng vai trò"
            value={quickStats?.totalRoles}
            icon={<AssignmentIcon />}
            color="#9c27b0"
            isLoading={loading}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Department Users Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Số lượng người dùng theo phòng ban
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentUserData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="users" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Role Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Phân bố vai trò
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {roleDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Hoạt động gần đây
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Tính năng theo dõi hoạt động sẽ được triển khai trong phiên bản tiếp theo.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
