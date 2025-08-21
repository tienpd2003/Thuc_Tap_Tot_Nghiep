import React from 'react';
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

// Enhanced Quick Stats Card Component
const QuickStatsCard = ({ title, value, icon, color, isLoading, trend, trendValue }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography color="textSecondary" gutterBottom variant="overline" sx={{ fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>
            {isLoading ? (
              <Skeleton variant="text" width={60} height={40} />
            ) : (
              value || 0
            )}
          </Typography>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {trend === 'up' ? (
                <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend === 'up' ? 'success.main' : 'error.main',
                  fontWeight: 'medium'
                }}
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        <Avatar
          sx={{
            backgroundColor: color,
            width: 56,
            height: 56,
            position: 'absolute',
            right: 16,
            top: -8,
            boxShadow: 3,
          }}
        >
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  console.log('AdminDashboard component rendering...');
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Admin Dashboard - Testing
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Testing if basic dashboard renders correctly
        </Typography>
      </Box>

      {/* Simple Test Content */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Dashboard is loading...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          If you can see this, the basic component structure is working.
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
