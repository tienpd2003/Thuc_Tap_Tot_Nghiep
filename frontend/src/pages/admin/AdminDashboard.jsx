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
  Alert,
  Skeleton,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { fetchQuickStats, fetchUsersByDepartment, fetchUsersByRole } from '../../store/slices/dashboardSlice';
import { CHART_COLORS } from '../../constants';

// Enhanced Quick Stats Card Component
const QuickStatsCard = ({ title, value, icon, color, isLoading, trend, trendValue }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>
            {isLoading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              value || 0
            )}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend === 'up' ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
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
  const { 
    quickStats, 
    departmentStats, 
    overviewStats,
    loading,
    error
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Fetch all dashboard data
    dispatch(fetchQuickStats());
    dispatch(fetchUsersByDepartment());
    dispatch(fetchUsersByRole());
  }, [dispatch]);

  // Use data from Redux store
  const departmentChartData = departmentStats?.data || [];
  const roleChartData = overviewStats?.data || [];
  const hasError = error?.quickStats || error?.departmentStats || error?.overviewStats;

  // Sample trend data (will be replaced with real API data later)
  const userTrendData = [
    { month: 'T1', users: 15 },
    { month: 'T2', users: 18 },
    { month: 'T3', users: 22 },
    { month: 'T4', users: 28 },
    { month: 'T5', users: 32 },
    { month: 'T6', users: quickStats?.totalUsers || 36 },
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

      {/* Error Alert */}
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Lỗi tải dữ liệu: {hasError}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Tổng người dùng"
            value={quickStats?.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="+5.2% so với tháng trước"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Tổng phòng ban"
            value={quickStats?.totalDepartments}
            icon={<BusinessIcon />}
            color="#2e7d32"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="+2 phòng ban mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Người dùng hoạt động"
            value={quickStats?.activeUsers}
            icon={<CheckCircleIcon />}
            color="#ed6c02"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="87% tỷ lệ hoạt động"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <QuickStatsCard
            title="Tổng vai trò"
            value={quickStats?.totalRoles}
            icon={<AssignmentIcon />}
            color="#9c27b0"
            isLoading={loading?.quickStats}
            trend="down"
            trendValue="3 vai trò active"
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
            {loading?.departmentStats ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : departmentChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Số người dùng']}
                    labelFormatter={(label) => `Phòng ban: ${label}`}
                  />
                  <Bar dataKey="users" fill={CHART_COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography color="text.secondary">Đang tải dữ liệu phòng ban...</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Role Distribution Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Phân bố vai trò
            </Typography>
            {loading?.overviewStats ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <CircularProgress />
              </Box>
            ) : roleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roleChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography color="text.secondary">Đang tải dữ liệu vai trò...</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* User Trend Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Xu hướng người dùng theo tháng
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Số người dùng']}
                  labelFormatter={(label) => `Tháng: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke={CHART_COLORS.primary} 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
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
              {loading?.quickStats ? (
                <Box>
                  <Skeleton variant="text" width="100%" height={24} />
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={24} />
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📊 Dashboard statistics đã được cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    👥 Có {quickStats?.totalUsers || 0} người dùng active trong hệ thống
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    🏢 Tổng {quickStats?.totalDepartments || 0} phòng ban đang hoạt động
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
