import React from 'react';
import { Box } from '@mui/material';
import ESPHero from '../components/orgESP/ESPHero';
import ESPInfoPanel from '../components/orgESP/ESPInfoPanel';
import ESPAnnouncements from '../components/orgESP/ESPAnnouncements';
import ESPCounsellors from '../components/orgESP/ESPCounsellors';
import ESPSharedContent from '../components/orgESP/ESPSharedContent';

const OrgESP = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        pt: '8rem',
        pb: 8,
        px: { xs: 0, md: '5rem' }
      }}
    >
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <ESPHero />
        <ESPInfoPanel />
        <ESPAnnouncements />
        <ESPCounsellors />
        <ESPSharedContent />
        {/* Further sections will be added here */}
      </Box>
    </Box>
  );
};

export default OrgESP;
