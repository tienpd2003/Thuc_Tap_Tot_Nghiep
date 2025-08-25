import React from 'react';
import { Box, Typography, useTheme, Skeleton } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TicketTrendChart = ({ data, loading, period = 'month' }) => {
  const theme = useTheme();

  // Ensure data is in correct format and not empty
  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }

    return data.map(item => ({
      period: item.period || item.date?.slice(5) || 'N/A',
      tickets: item.tickets || (item.completed + item.pending + item.rejected + item.created) || 0,
      completed: item.completed || item.approvedTickets || 0,
      pending: item.pending || item.pendingTickets || 0,
      rejected: item.rejected || item.rejectedTickets || 0,
      created: item.created || item.createdTickets || 0,
      date: item.date || item.dateString || new Date().toISOString().split('T')[0],
      dayOfWeek: item.dayOfWeek || 'Unknown'
    }));
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]?.payload;
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
            {dataPoint?.date ? new Date(dataPoint.date).toLocaleDateString('vi-VN', { 
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
          {dataPoint?.tickets > 0 && (
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
                {dataPoint.tickets}
              </Typography>
            </Box>
          )}
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

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ pt: 2, px: 2 }}>
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={300} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 3 }}>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={100} />
        </Box>
      </Box>
    );
  }

  // Show empty state if no data
  if (!chartData || chartData.length === 0) {
    return (
      <Box sx={{ 
        height: 360, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'text.secondary'
      }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Không có dữ liệu
        </Typography>
        <Typography variant="body2">
          Chưa có dữ liệu xu hướng ticket cho {period === 'week' ? 'tuần này' : period === 'month' ? 'tháng này' : 'năm này'}
        </Typography>
      </Box>
    );
  }

  return (
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
  );
};

export default TicketTrendChart;
