import React from 'react';
import { Box } from '@mui/material';
import ESPHero from '../components/orgESP/ESPHero';
import HEIKeyStatsSection from '../components/orgHEI/HEIKeyStatsSection';
import HEIDescriptionTabs from '../components/orgHEI/HEIDescriptionTabs';
import ESPAnnouncements from '../components/orgESP/ESPAnnouncements';
import ESPCounsellors from '../components/orgESP/ESPCounsellors';
import ESPSharedContent from '../components/orgESP/ESPSharedContent';

const OrgHEI = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        pt: '10rem',
        pb: 8,
        px: { xs: 0, md: '5rem' }
      }}
    >
      <Box sx={{ width: '100%', mx: 'auto' }}>
        <ESPHero />
        <HEIKeyStatsSection />
        <HEIDescriptionTabs />
        <ESPAnnouncements />
        <ESPCounsellors />
        <ESPSharedContent />
      </Box>
    </Box>
  );
};

export default OrgHEI;
