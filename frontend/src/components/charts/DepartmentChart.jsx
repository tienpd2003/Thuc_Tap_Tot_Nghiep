import React from 'react';
import { Box, Typography, useTheme, Skeleton, List, ListItem, ListItemText, Divider, LinearProgress, Tooltip as MuiTooltip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';

const DepartmentChart = ({ data, loading }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = React.useState(null);

  // Default sample data if no data provided
  const defaultData = [
    { name: 'Marketing', tickets: 5, users: 5, efficiency: 100 },
    { name: 'Quality Assurance', tickets: 3, users: 3, efficiency: 100 },
    { name: 'Human Resources', tickets: 5, users: 5, efficiency: 100 },
    { name: 'IT Department', tickets: 5, users: 5, efficiency: 100 },
    { name: 'Operations', tickets: 3, users: 3, efficiency: 0 },
    { name: 'Research & Development', tickets: 3, users: 3, efficiency: 0 },
    { name: 'Customer Service', tickets: 5, users: 5, efficiency: 100 },
    { name: 'Finance', tickets: 3, users: 3, efficiency: 0 },
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

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: payload[0].color }}>
            {data.name}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Tickets:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {data.tickets}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Nhân viên:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {data.users}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              Hiệu suất:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {data.efficiency}%
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };

  // Custom active shape for pie chart
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.8}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  // Handle pie sector hover
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Custom legend
  const renderLegend = () => {
    return (
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
        gap: 1, 
        mt: 1,
        px: 1
      }}>
        {chartData.slice(0, 4).map((entry, index) => (
          <Box 
            key={`legend-${index}`} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              fontSize: '0.75rem',
              p: 0.5,
              borderRadius: 1,
              bgcolor: activeIndex === index ? 'action.hover' : 'transparent',
              transition: 'all 0.2s',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <Box sx={{ 
              width: 8, 
              height: 8, 
              backgroundColor: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length], 
              borderRadius: '50%',
              mr: 0.5
            }} />
            <Typography 
              variant="caption" 
              sx={{ 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                fontSize: '0.7rem'
              }}
            >
              {entry.name}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <>
      {loading ? (
        <Box sx={{ pt: 2, px: 2, height: '100%' }}>
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 3 }} />
          <Skeleton variant="circular" height={160} width={160} sx={{ mx: 'auto', mb: 2 }} />
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
          </Box>
        </Box>
      ) : (
        <Box sx={{ height: 360, display: 'flex', flexDirection: 'column' }}>
          {/* Pie Chart Section */}
          <Box sx={{ height: 180, pt: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  innerRadius={40}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="tickets"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Legend */}
          {renderLegend()}
          
          <Divider sx={{ mt: 1, mb: 1 }} />
          
          {/* Department Statistics List */}
          <Box sx={{ flex: 1, overflowY: 'auto', mx: 2 }}>
            <List dense disablePadding>
              {chartData.slice(0, 4).map((dept, index) => (
                <MuiTooltip 
                  key={dept.name} 
                  title={`${dept.name}: ${dept.tickets} tickets, ${dept.users} nhân viên`} 
                  arrow
                  placement="top"
                >
                  <ListItem 
                    disablePadding
                    sx={{ 
                      py: 0.5, 
                      px: 1, 
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: activeIndex === index ? 'action.hover' : 'transparent'
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Box 
                            sx={{ 
                              width: 8, 
                              height: 8, 
                              bgcolor: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length], 
                              borderRadius: '50%',
                              mr: 1 
                            }} 
                          />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {dept.name.length > 15 ? `${dept.name.substring(0, 15)}...` : dept.name}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: -0.5 }}>
                          <Box sx={{ flex: 1, mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={dept.efficiency} 
                              sx={{ 
                                height: 4, 
                                borderRadius: 2,
                                backgroundColor: 'rgba(0,0,0,0.05)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length],
                                }
                              }} 
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {dept.tickets} tickets
                          </Typography>
                        </Box>
                      }
                      primaryTypographyProps={{ variant: 'caption' }}
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                  </ListItem>
                </MuiTooltip>
              ))}
            </List>
          </Box>
        </Box>
      )}
    </>
  );
};

export default DepartmentChart;
