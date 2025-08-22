import React from 'react';
import { Box, Typography } from '@mui/material';

const SimpleAdminDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard - Simplified
      </Typography>
      <Typography variant="body1">
        This is a simplified admin dashboard to test if the component works.
      </Typography>
    </Box>
  );
};

export default SimpleAdminDashboard;
