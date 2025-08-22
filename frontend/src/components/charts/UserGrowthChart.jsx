import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const UserGrowthChart = ({ data, loading, title = "Tăng trưởng người dùng" }) => {
  const theme = useTheme();

  // Default sample data if no data provided
  const defaultData = [
    { month: 'T1', totalUsers: 15, newUsers: 5, activeUsers: 12 },
    { month: 'T2', totalUsers: 18, newUsers: 3, activeUsers: 16 },
    { month: 'T3', totalUsers: 22, newUsers: 4, activeUsers: 20 },
    { month: 'T4', totalUsers: 28, newUsers: 6, activeUsers: 25 },
    { month: 'T5', totalUsers: 32, newUsers: 4, activeUsers: 28 },
    { month: 'T6', totalUsers: 36, newUsers: 4, activeUsers: 32 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        {title}
      </Typography>
      
      {loading ? (
        <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="text.secondary">Đang tải dữ liệu...</Typography>
        </Box>
      ) : (
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="month" 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <YAxis 
                stroke={theme.palette.text.secondary}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Area 
                type="monotone" 
                dataKey="totalUsers" 
                stroke="#1976d2" 
                fillOpacity={1} 
                fill="url(#colorTotal)"
                name="Tổng người dùng"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="#4caf50" 
                fillOpacity={1} 
                fill="url(#colorActive)"
                name="Người dùng hoạt động"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: 1 }} />
          <Typography variant="caption">Tổng người dùng</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 1 }} />
          <Typography variant="caption">Người dùng hoạt động</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserGrowthChart;
