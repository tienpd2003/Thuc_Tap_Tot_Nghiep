import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const DepartmentChart = ({ data, loading, title = "Hiệu suất theo Phòng ban" }) => {
  const theme = useTheme();

  // Default sample data if no data provided
  const defaultData = [
    { name: 'IT Department', tickets: 12, users: 4, efficiency: 85 },
    { name: 'Human Resources', tickets: 8, users: 3, efficiency: 90 },
    { name: 'Finance', tickets: 6, users: 3, efficiency: 78 },
    { name: 'Marketing', tickets: 10, users: 3, efficiency: 82 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  // Colors for different departments
  const DEPARTMENT_COLORS = [
    '#1976d2', // Blue
    '#2e7d32', // Green
    '#ed6c02', // Orange
    '#9c27b0', // Purple
    '#d32f2f', // Red
    '#0288d1', // Light Blue
    '#7b1fa2', // Deep Purple
    '#f57c00', // Amber
  ];

  // Custom label function for pie chart
  const renderLabel = (entry) => {
    return `${entry.name}: ${entry.tickets}`;
  };

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
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="tickets"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
                formatter={(value, name) => [
                  name === 'tickets' ? `${value} tickets` : value,
                  name === 'tickets' ? 'Số tickets' : name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
      
      {/* Department Statistics Table */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Chi tiết hiệu suất phòng ban:
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
          {chartData.slice(0, 4).map((dept, index) => (
            <Box key={dept.name} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              fontSize: '0.75rem',
              p: 0.5,
              borderRadius: 1,
              backgroundColor: theme.palette.action.hover 
            }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                backgroundColor: DEPARTMENT_COLORS[index], 
                borderRadius: '50%' 
              }} />
              <Typography variant="caption">
                {dept.name.substring(0, 12)}...: {dept.tickets} tickets
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default DepartmentChart;
