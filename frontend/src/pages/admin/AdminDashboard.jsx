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
  Paper,
  Divider,
  Chip,
  Avatar,
  LinearProgress,
  Button
} from '@mui/material';
import {
  People as PeopleIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuickStats, fetchUsersByDepartment, fetchUsersByRole, fetchOverviewStats } from '../../store/slices/dashboardSlice';
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
    overviewStats,
    loading, 
    error 
  } = useSelector((state) => state.dashboard);

  // Extract the actual data from nested state structure
  const departmentData = departmentStats?.data || [];
  const dailyStatsData = roleStats?.dailyStats || [];
  const overviewData = overviewStats?.data || overviewStats;

  useEffect(() => {
    // Load dashboard data on mount and when period changes
    dispatch(fetchQuickStats());
    dispatch(fetchOverviewStats(selectedPeriod));
    dispatch(fetchUsersByDepartment(selectedPeriod));
    dispatch(fetchUsersByRole(selectedPeriod));
  }, [dispatch, selectedPeriod]);

  // Use real API data from Redux state - no need for synthetic data processing here
  const displayOverviewStats = overviewData || {
    totalUsers: 36,
    totalDepartments: 8,
    totalTickets: 32,
    approvalRate: 100.0,
    pendingTickets: 5,
    approvedTickets: 7,
    rejectedTickets: 0,
    inProgressTickets: 8,
  };
  
  // Daily stats are now properly processed in the saga
  const displayDailyStats = dailyStatsData;
    
  // Use real API data for department stats - the data is already transformed in the saga
  const displayDepartmentStats = departmentData;
  
  
  // Use user growth data from Redux state - processed in saga
  const displayUserGrowthData = roleStats?.userGrowth || [];

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  const hasError = error?.quickStats || error?.departmentStats || error?.roleStats;

  // Calculate efficiency percentage for display
  const calculateEfficiency = (completed, total) => {
    if (!total || total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <Box>
      {/* Enhanced Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2, 
          background: 'linear-gradient(to right, #1976d2, #2196f3)', 
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Tổng quan hệ thống quản lý người dùng và phòng ban
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <CalendarIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {currentDate}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Period Selector */}
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 140,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255,255,255,0.7)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(255,255,255,0.7)',
                }
              }}
            >
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
        </Box>
      </Paper>

      {/* Error Alert */}
      {hasError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Lỗi tải dữ liệu: {hasError}
        </Alert>
      )}

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TỔNG NGƯỜI DÙNG"
            value={displayOverviewStats?.data?.totalUsers || quickStats?.totalUsers || 37}
            icon={<PeopleIcon />}
            color="#1976d2"
            isLoading={loading?.quickStats || loading?.overviewStats}
            trend="up"
            subtitle="Hoạt động trong hệ thống"
            variant="large"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TỔNG PHÒNG BAN"
            value={displayOverviewStats?.data?.totalDepartments || quickStats?.totalDepartments || 9}
            icon={<BusinessIcon />}
            color="#2e7d32"
            isLoading={loading?.quickStats || loading?.overviewStats}
            trend="up"
            subtitle="Đang hoạt động"
            variant="large"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TỔNG TICKETS"
            value={displayOverviewStats?.data?.totalTickets || quickStats?.totalTickets || 32}
            icon={<AssignmentIcon />}
            color="#ed6c02"
            isLoading={loading?.quickStats || loading?.overviewStats}
            trend="up"
            subtitle="Tất cả trạng thái"
            variant="large"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="TỶ LỆ HOÀN THÀNH"
            value={`${displayOverviewStats?.data?.approvalRate?.toFixed(0) || calculateEfficiency(quickStats?.completedTickets, quickStats?.totalTickets) || 59}%`}
            icon={<CheckCircleIcon />}
            color="#9c27b0"
            isLoading={loading?.quickStats || loading?.overviewStats}
            trend="up"
            subtitle="Tickets đã xử lý"
            variant="large"
          />
        </Grid>
      </Grid>

      {/* Charts Section with Better Styling */}
      <Grid container spacing={3}>
        {/* Ticket Trend Chart */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssessmentIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    Xu hướng Ticket theo thời gian
                  </Typography>
                </Box>
                <Chip 
                  size="small" 
                  label={selectedPeriod === 'week' ? '7 ngày qua' : selectedPeriod === 'month' ? '30 ngày qua' : '12 tháng qua'}
                  sx={{ bgcolor: 'primary.main', color: 'white', marginLeft: '20px' }}
                />
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <TicketTrendChart
                data={displayDailyStats}
                loading={loading?.roleStats}
                period={selectedPeriod}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Department Performance */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '400px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <BusinessIcon sx={{ mr: 1.5, color: '#ed6c02' }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    Hiệu suất theo Phòng ban
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <DepartmentChart
                data={displayDepartmentStats}
                loading={loading?.departmentStats}
              />
            </Box>
          </Paper>
        </Grid>

        {/* User Growth Chart */}
        <Grid item xs={12}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              overflow: 'hidden',
              mb: 3
            }}
          >
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUpIcon sx={{ mr: 1.5, color: '#4caf50' }} />
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                    Tăng trưởng người dùng theo tháng
                  </Typography>
                </Box>
                <Button size="small" variant="outlined" color="primary" sx={{ marginLeft: '20px' }}>
                  Xem chi tiết
                </Button>
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <UserGrowthChart
                data={displayUserGrowthData}
                loading={loading?.roleStats}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Additional Statistics with Enhanced UI */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 0, 
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Thống kê nhanh
              </Typography>
            </Box>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Admin users
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {quickStats?.adminUsers || 5}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Hoạt động hôm nay
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      {quickStats?.activeToday || 12}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Tickets đang chờ
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff9800' }}>
                      {quickStats?.pendingTickets || 7}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Thời gian xử lý TB
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#9c27b0' }}>
                      {quickStats?.avgResolutionTime || '2h 30m'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%',
              borderRadius: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Phòng ban hoạt động tốt nhất
              </Typography>
              <Chip size="small" label="Tuần này" color="primary" variant="outlined" />
            </Box>
            <CardContent>
              {displayDepartmentStats.slice(0, 4).map((dept, index) => (
                <Box key={dept.name} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1.2,
                  borderBottom: index < 3 ? '1px dashed' : 'none',
                  borderColor: 'divider'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0'][index % 4],
                        mr: 2,
                        fontSize: '0.875rem'
                      }}
                    >
                      {dept.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {dept.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dept.users || 0} nhân viên
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                        {dept.tickets || 0} tickets
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={dept.efficiency || 0} 
                          sx={{ width: 60, height: 6, borderRadius: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {dept.efficiency || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
              {(!departmentData || departmentData.length === 0) && displayDepartmentStats.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu
                </Typography>
              )}
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Users Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          mt: 3,
          p: 0, 
          borderRadius: 2, 
          border: '1px solid', 
          borderColor: 'divider',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonAddIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Người dùng mới đăng ký
            </Typography>
          </Box>
          <Button size="small" variant="text" color="primary">
            Xem tất cả
          </Button>
        </Box>
        <Box sx={{ overflow: 'auto' }}>
          <Grid container spacing={0} sx={{ p: 2 }}>
            {[
              { name: 'Nguyễn Văn A', role: 'Nhân viên', dept: 'Marketing', status: 'Hoạt động', time: '2 giờ trước' },
              { name: 'Trần Thị B', role: 'Quản lý', dept: 'IT Department', status: 'Hoạt động', time: '1 ngày trước' },
              { name: 'Lê Văn C', role: 'Nhân viên', dept: 'Human Resources', status: 'Vắng mặt', time: '2 ngày trước' },
              { name: 'Phạm Văn D', role: 'Nhân viên', dept: 'Finance', status: 'Hoạt động', time: '3 ngày trước' },
            ].map((user, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  m: 0.5
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 1.5, bgcolor: ['#1976d2', '#2e7d32', '#ed6c02', '#9c27b0'][index % 4] }}>
                      {user.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Phòng ban
                    </Typography>
                    <Chip 
                      label={user.dept} 
                      size="small" 
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem', 
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }} 
                    />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Chip 
                      label={user.status} 
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem', 
                        bgcolor: user.status === 'Hoạt động' ? '#e8f5e9' : '#ffebee',
                        color: user.status === 'Hoạt động' ? '#2e7d32' : '#d32f2f'
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'right' }}>
                    {user.time}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
// import { 
//   MdHeadsetMic, 
//   MdAssignment, 
//   MdGroup, 
//   MdTrendingUp, 
//   MdSchedule,
//   MdCheckCircle,
//   MdWarning,
//   MdError
// } from "react-icons/md";

// export default function AdminDashboard() {
//   const stats = [
//     {
//       title: "Total Tickets",
//       value: "1,234",
//       change: "+12%",
//       changeType: "increase",
//       icon: <MdHeadsetMic className="h-6 w-6" />,
//       color: "bg-blue-500"
//     },
//     {
//       title: "Tickets in Progress",
//       value: "89",
//       change: "+5%",
//       changeType: "increase",
//       icon: <MdAssignment className="h-6 w-6" />,
//       color: "bg-yellow-500"
//     },
//     {
//       title: "Completed Tickets",
//       value: "1,145",
//       change: "+8%",
//       changeType: "increase",
//       icon: <MdCheckCircle className="h-6 w-6" />,
//       color: "bg-green-500"
//     },
//     {
//       title: "Active Users",
//       value: "456",
//       change: "+3%",
//       changeType: "increase",
//       icon: <MdGroup className="h-6 w-6" />,
//       color: "bg-purple-500"
//     }
//   ];

//   const recentTickets = [
//     {
//       id: "TKT-001",
//       title: "Printer Issue",
//       department: "IT",
//       priority: "High",
//       status: "In Progress",
//       createdBy: "John Doe",
//       createdAt: "2 hours ago"
//     },
//     {
//       id: "TKT-002",
//       title: "Software Installation Request",
//       department: "IT",
//       priority: "Medium",
//       status: "Pending Approval",
//       createdBy: "Jane Smith",
//       createdAt: "4 hours ago"
//     },
//     {
//       id: "TKT-003",
//       title: "System Error Report",
//       department: "Accounting",
//       priority: "High",
//       status: "Completed",
//       createdBy: "Mike Johnson",
//       createdAt: "1 day ago"
//     }
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "In Progress":
//         return "bg-yellow-100 text-yellow-800";
//       case "Pending Approval":
//         return "bg-blue-100 text-blue-800";
//       case "Completed":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   const getPriorityColor = (priority) => {
//     switch (priority) {
//       case "High":
//         return "bg-red-100 text-red-800";
//       case "Medium":
//         return "bg-yellow-100 text-yellow-800";
//       case "Low":
//         return "bg-green-100 text-green-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
//           <p className="text-gray-600 text-lg">TicketHub System Overview</p>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <MdSchedule className="h-4 w-4" />
//           <span>Last updated: {new Date().toLocaleString('en-US')}</span>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {stats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
//                 <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
//                 <div className="flex items-center">
//                   <span className={`text-sm font-medium ${
//                     stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
//                   }`}>
//                     {stat.change}
//                   </span>
//                   <span className="text-sm text-gray-500 ml-2">vs last month</span>
//                 </div>
//               </div>
//               <div className={`${stat.color} p-4 rounded-xl text-white`}>
//                 {stat.icon}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent Tickets */}
//       <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900">Recent Tickets</h2>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Ticket ID
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Title
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Department
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Priority
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created By
//                 </th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Time
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentTickets.map((ticket) => (
//                 <tr key={ticket.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5e83ae]">
//                     {ticket.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {ticket.title}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {ticket.department}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
//                       {ticket.priority}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
//                       {ticket.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {ticket.createdBy}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {ticket.createdAt}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="bg-blue-100 p-3 rounded-lg">
//               <MdHeadsetMic className="h-6 w-6 text-blue-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900">Create New Ticket</h3>
//           </div>
//           <p className="text-gray-600 mb-6">Create a new support ticket for users</p>
//           <button className="w-full bg-[#5e83ae] text-white px-4 py-3 rounded-lg hover:bg-[#4a6b8a] transition-colors font-medium">
//             Create Ticket
//           </button>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="bg-green-100 p-3 rounded-lg">
//               <MdAssignment className="h-6 w-6 text-green-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900">Manage Tickets</h3>
//           </div>
//           <p className="text-gray-600 mb-6">View and manage all tickets in the system</p>
//           <button className="w-full bg-[#5e83ae] text-white px-4 py-3 rounded-lg hover:bg-[#4a6b8a] transition-colors font-medium">
//             View All
//           </button>
//         </div>

//         <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="bg-purple-100 p-3 rounded-lg">
//               <MdTrendingUp className="h-6 w-6 text-purple-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
//           </div>
//           <p className="text-gray-600 mb-6">View detailed reports and analytics</p>
//           <button className="w-full bg-[#5e83ae] text-white px-4 py-3 rounded-lg hover:bg-[#4a6b8a] transition-colors font-medium">
//             View Reports
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
