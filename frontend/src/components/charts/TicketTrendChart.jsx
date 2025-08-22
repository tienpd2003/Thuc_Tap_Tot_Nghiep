import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TicketTrendChart = ({ data, loading, title = "Xu hướng Ticket theo thời gian" }) => {
  const theme = useTheme();

  // Default sample data if no data provided
  const defaultData = [
    { period: 'T5', tickets: 8, completed: 6, pending: 2 },
    { period: 'T6', tickets: 8, completed: 7, pending: 1 },
    { period: 'T7', tickets: 8, completed: 5, pending: 3 },
    { period: 'T8', tickets: 8, completed: 4, pending: 4 },
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
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="period" 
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
              <Bar dataKey="completed" fill="#4caf50" name="Đã hoàn thành" radius={[2, 2, 0, 0]} />
              <Bar dataKey="pending" fill="#ff9800" name="Đang xử lý" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#4caf50', borderRadius: 1 }} />
          <Typography variant="caption">Đã hoàn thành</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#ff9800', borderRadius: 1 }} />
          <Typography variant="caption">Đang xử lý</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default TicketTrendChart;
