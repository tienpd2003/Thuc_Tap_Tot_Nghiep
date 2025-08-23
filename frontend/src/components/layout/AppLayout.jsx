// import React, { useState } from 'react';
// import { Box, CssBaseline, Toolbar } from '@mui/material';
// import { Outlet } from 'react-router-dom';
// import AdminSidebar from './AdminSidebar';
// import Header from './Header';

// const DRAWER_WIDTH = 280;

// const AppLayout = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
      
//       {/* Header Component */}
//       <Header 
//         drawerWidth={DRAWER_WIDTH}
//         onDrawerToggle={handleDrawerToggle}
//       />
      
//       {/* Sidebar Navigation */}
//       <AdminSidebar 
//         drawerWidth={DRAWER_WIDTH}
//         mobileOpen={mobileOpen}
//         onDrawerToggle={handleDrawerToggle}
//       />
      
//       {/* Main Content Area */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
//           minHeight: '100vh',
//           backgroundColor: '#f5f5f5',
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default AppLayout;
