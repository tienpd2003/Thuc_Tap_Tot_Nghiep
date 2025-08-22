import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuickStats, fetchUsersByDepartment, fetchUsersByRole } from '../../store/slices/dashboardSlice';
import { 
  StatsCard, 
  TicketTrendChart, 
  DepartmentChart, 
  UserGrowthChart 
} from '../../components/charts';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  const { 
    quickStats, 
    departmentStats, 
    roleStats, 
    loading, 
    error 
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    // Load dashboard data on mount
    dispatch(fetchQuickStats());
    dispatch(fetchUsersByDepartment(selectedPeriod));
    dispatch(fetchUsersByRole(selectedPeriod));
  }, [dispatch, selectedPeriod]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const hasError = error?.quickStats || error?.departmentStats || error?.roleStats;

  // Calculate efficiency percentage for display
  const calculateEfficiency = (completed, total) => {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tổng quan hệ thống quản lý người dùng và phòng ban
          </Typography>
        </Box>
        
        {/* Period Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Thời gian</InputLabel>
          <Select
            value={selectedPeriod}
            label="Thời gian"
            onChange={handlePeriodChange}
          >
            <MenuItem value="week">Tuần này</MenuItem>
            <MenuItem value="month">Tháng này</MenuItem>
            <MenuItem value="year">Năm này</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error Alert */}
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Lỗi tải dữ liệu: {hasError}
        </Alert>
      )}

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tổng người dùng"
            value={quickStats?.totalUsers}
            icon={<PeopleIcon />}
            color="#1976d2"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="+5.2% so với tháng trước"
            subtitle="Hoạt động trong hệ thống"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tổng phòng ban"
            value={quickStats?.totalDepartments}
            icon={<BusinessIcon />}
            color="#2e7d32"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="+2 phòng ban mới"
            subtitle="Đang hoạt động"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tổng tickets"
            value={quickStats?.totalTickets}
            icon={<AssignmentIcon />}
            color="#ed6c02"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="+15% so với tuần trước"
            subtitle="Tất cả trạng thái"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Tỷ lệ hoàn thành"
            value={`${calculateEfficiency(quickStats?.completedTickets, quickStats?.totalTickets)}%`}
            icon={<CheckCircleIcon />}
            color="#9c27b0"
            isLoading={loading?.quickStats}
            trend="up"
            trendValue="+3% hiệu quả hơn"
            subtitle="Tickets đã xử lý"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Ticket Trend Chart */}
        <Grid item xs={12} lg={8}>
          <TicketTrendChart
            data={roleStats?.dailyStats}
            loading={loading?.roleStats}
            title="Xu hướng Ticket theo thời gian"
          />
        </Grid>

        {/* Department Performance */}
        <Grid item xs={12} lg={4}>
          <DepartmentChart
            data={departmentStats}
            loading={loading?.departmentStats}
            title="Hiệu suất theo Phòng ban"
          />
        </Grid>

        {/* User Growth Chart */}
        <Grid item xs={12}>
          <UserGrowthChart
            data={roleStats?.userGrowth}
            loading={loading?.roleStats}
            title="Tăng trưởng người dùng theo tháng"
          />
        </Grid>
      </Grid>

      {/* Additional Statistics */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thống kê nhanh
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Admin users
                  </Typography>
                  <Typography variant="h6">
                    {quickStats?.adminUsers || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Active today
                  </Typography>
                  <Typography variant="h6">
                    {quickStats?.activeToday || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Pending tickets
                  </Typography>
                  <Typography variant="h6">
                    {quickStats?.pendingTickets || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Avg. resolution time
                  </Typography>
                  <Typography variant="h6">
                    {quickStats?.avgResolutionTime || '0h'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Departments
              </Typography>
              {departmentStats?.data?.slice(0, 3).map((dept, index) => (
                <Box key={dept.name} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1,
                  borderBottom: index < 2 ? '1px solid' : 'none',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2">
                    {dept.name}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    {dept.tickets || 0} tickets
                  </Typography>
                </Box>
              ))}
              {(!departmentStats || departmentStats.length === 0) && (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
