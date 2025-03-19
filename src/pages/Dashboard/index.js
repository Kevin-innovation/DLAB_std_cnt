import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AttendanceButton from '../../components/AttendanceButton';
import ManagementPanel from '../../components/ManagementPanel';

function Dashboard() {
  const [managementOpen, setManagementOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <IconButton
        onClick={() => setManagementOpen(true)}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <SettingsIcon />
      </IconButton>

      <AttendanceButton />
      
      <ManagementPanel
        open={managementOpen}
        onClose={() => setManagementOpen(false)}
      />
    </Box>
  );
}

export default Dashboard; 