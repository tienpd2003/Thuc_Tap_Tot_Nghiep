import React from 'react';
import { Box, Typography } from '@mui/material';

const TestDashboard = () => {
  console.log('TestDashboard component rendered');
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Test Dashboard
      </Typography>
      <Typography variant="body1">
        This is a simple test component to debug the white screen issue.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        If you can see this, the routing and basic components are working.
      </Typography>
    </Box>
  );
};

export default TestDashboard;
