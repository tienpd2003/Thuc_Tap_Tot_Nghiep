import React, { useState } from 'react';
import { Box, Typography, useTheme, Skeleton, Chip } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart,
  ReferenceLine
} from 'recharts';

const UserGrowthChart = ({ data, loading }) => {
  const theme = useTheme();
  const [chartType, setChartType] = useState('area');

  // Default sample data if no data provided
  const defaultData = [
    { month: 'Tuần 1', totalUsers: 20, newUsers: 0, activeUsers: 15 },
    { month: 'Tuần 2', totalUsers: 25, newUsers: 5, activeUsers: 20 },
    { month: 'Tuần 3', totalUsers: 28, newUsers: 3, activeUsers: 25 },
    { month: 'Tuần 4', totalUsers: 32, newUsers: 4, activeUsers: 28 },
    { month: 'Tuần 5', totalUsers: 35, newUsers: 3, activeUsers: 30 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;
  
  // Calculate total growth percentage for display
  const calculateGrowth = () => {
    if (chartData.length < 2) return { percentage: 0, isPositive: true };
    const firstValue = chartData[0]?.totalUsers || 0;
    const lastValue = chartData[chartData.length - 1]?.totalUsers || 0;
    if (firstValue === 0) return { percentage: 0, isPositive: true };
    
    const growthPercentage = ((lastValue - firstValue) / firstValue) * 100;
    return {
      percentage: Math.abs(growthPercentage).toFixed(1),
      isPositive: growthPercentage >= 0
    };
  };
  
  const growth = calculateGrowth();

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1.5, 
          border: '1px solid', 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: theme.shadows[3],
          minWidth: 180
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: entry.color,
                    mr: 1
                  }} 
                />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {entry.name}:
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 500, color: entry.color }}>
                {entry.value}
              </Typography>
            </Box>
          ))}
          {payload.find(p => p.dataKey === 'newUsers') && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              pt: 1, 
              mt: 1, 
              borderTop: '1px dashed', 
              borderColor: 'divider' 
            }}>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Tỷ lệ hoạt động:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {payload.find(p => p.dataKey === 'totalUsers')?.value > 0 
                  ? Math.round((payload.find(p => p.dataKey === 'activeUsers')?.value / 
                      payload.find(p => p.dataKey === 'totalUsers')?.value) * 100) 
                  : 0}%
              </Typography>
            </Box>
          )}
        </Box>
      );
    }
    return null;
  };

  const toggleChartType = () => {
    setChartType(prev => prev === 'area' ? 'line' : 'area');
  };

  return (
    <>
      {loading ? (
        <Box sx={{ pt: 2, px: 2 }}>
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={300} />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 3 }}>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
          </Box>
        </Box>
      ) : (
        <Box sx={{ px: 2, pt: 1 }}>
          {/* Growth Stats & Chart Type Selector */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`${growth.isPositive ? '+' : '-'}${growth.percentage}%`} 
                size="small" 
                color={growth.isPositive ? "success" : "error"}
                sx={{ mr: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                so với kỳ trước
              </Typography>
            </Box>
            
            <Box>
              <Chip
                label={chartType === 'area' ? 'Dạng diện tích' : 'Dạng đường'}
                size="small"
                onClick={toggleChartType}
                sx={{ 
                  cursor: 'pointer',
                  bgcolor: theme.palette.grey[100],
                  '&:hover': {
                    bgcolor: theme.palette.grey[200],
                  }
                }}
              />
            </Box>
          </Box>

          {/* Chart */}
          <Box sx={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart 
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9800" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff9800" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="month" 
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    tickCount={5}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                  <ReferenceLine y={chartData[0]?.totalUsers || 0} 
                    stroke={theme.palette.divider} 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: 'Ban đầu', 
                      position: 'insideBottomLeft',
                      fontSize: 10,
                      fill: theme.palette.text.secondary
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
                    activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 1, fill: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#4caf50" 
                    fillOpacity={1} 
                    fill="url(#colorActive)"
                    name="Người dùng hoạt động"
                    strokeWidth={2}
                    activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 1, fill: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#ff9800" 
                    fillOpacity={1} 
                    fill="url(#colorNew)"
                    name="Người dùng mới"
                    strokeWidth={2}
                    activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 1, fill: '#fff' }}
                  />
                </AreaChart>
              ) : (
                <LineChart 
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                  <XAxis 
                    dataKey="month" 
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    tickCount={5}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={chartData[0]?.totalUsers || 0} 
                    stroke={theme.palette.divider} 
                    strokeDasharray="3 3" 
                    label={{ 
                      value: 'Ban đầu', 
                      position: 'insideBottomLeft',
                      fontSize: 10,
                      fill: theme.palette.text.secondary
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="totalUsers" 
                    stroke="#1976d2" 
                    name="Tổng người dùng"
                    strokeWidth={2}
                    dot={{ r: 3, stroke: '#1976d2', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 1, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#4caf50" 
                    name="Người dùng hoạt động"
                    strokeWidth={2}
                    dot={{ r: 3, stroke: '#4caf50', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, stroke: '#4caf50', strokeWidth: 1, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="newUsers" 
                    stroke="#ff9800" 
                    name="Người dùng mới"
                    strokeWidth={2}
                    dot={{ r: 3, stroke: '#ff9800', strokeWidth: 1, fill: '#fff' }}
                    activeDot={{ r: 6, stroke: '#ff9800', strokeWidth: 1, fill: '#fff' }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 2, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#1976d2', borderRadius: 1 }} />
              <Typography variant="caption">Tổng người dùng</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 1 }} />
              <Typography variant="caption">Người dùng hoạt động</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: 1 }} />
              <Typography variant="caption">Người dùng mới</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default UserGrowthChart;
