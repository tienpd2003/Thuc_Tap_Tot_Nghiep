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
