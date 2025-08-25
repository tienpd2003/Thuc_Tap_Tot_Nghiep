import React from 'react';
import { Box, Typography, useTheme, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TicketTrendChart = ({ data, loading }) => {
  const theme = useTheme();

  // Default sample data if no data provided - better visualization
  const defaultData = [
    { period: '08-13', tickets: 8, completed: 6, pending: 2, date: '2025-08-13' },
    { period: '08-16', tickets: 12, completed: 8, pending: 4, date: '2025-08-16' },
    { period: '08-19', tickets: 6, completed: 4, pending: 2, date: '2025-08-19' },
    { period: '08-22', tickets: 10, completed: 7, pending: 3, date: '2025-08-22' },
    { period: '08-23', tickets: 9, completed: 5, pending: 4, date: '2025-08-23' },
    { period: '08-24', tickets: 7, completed: 6, pending: 1, date: '2025-08-24' },
    { period: '08-25', tickets: 11, completed: 8, pending: 3, date: '2025-08-25' },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

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
            {payload[0]?.payload.date ? new Date(payload[0].payload.date).toLocaleDateString('vi-VN', { 
              weekday: 'long',
              day: 'numeric',
              month: 'numeric' 
            }) : label}
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
              <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                {entry.value}
              </Typography>
            </Box>
          ))}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            pt: 1, 
            mt: 1, 
            borderTop: '1px dashed', 
            borderColor: 'divider' 
          }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Tổng:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {payload[0]?.payload.tickets || payload.reduce((sum, entry) => sum + entry.value, 0)}
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Custom legend renderer
  const renderLegend = (props) => {
    const { payload } = props;
    
    return (
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 1 }}>
        {payload.map((entry, index) => (
          <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                width: 12, 
                height: 12, 
                backgroundColor: entry.color,
                borderRadius: 1 
              }} 
            />
            <Typography variant="caption">{entry.value}</Typography>
          </Box>
        ))}
      </Box>
    );
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
        <Box sx={{ height: 360, px: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 30,
              }}
              barGap={0}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4caf50" stopOpacity={0.5}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff9800" stopOpacity={0.5}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis 
                dataKey="period" 
                stroke={theme.palette.text.secondary}
                fontSize={12}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                stroke={theme.palette.text.secondary}
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickCount={5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
              <Legend content={renderLegend} />
              <Bar 
                dataKey="completed" 
                fill="url(#colorCompleted)" 
                name="Đã hoàn thành" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
              <Bar 
                dataKey="pending" 
                fill="url(#colorPending)" 
                name="Đang xử lý" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </>
  );
};

export default TicketTrendChart;
