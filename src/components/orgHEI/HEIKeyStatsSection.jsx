import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { fonts } from '../../utility/fonts';
import { useSelector } from 'react-redux';
import { selectOrganizationProfile } from '../../redux/slices/organizationSlice';
const StatCard = ({ value, label }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: '15px',
      border: '1px solid rgba(0,0,0,0.08)',
      backgroundColor: '#fff',
      minWidth: '140px',
      flex: '1 1 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
      boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
    }}
  >
    <Typography
      sx={{
        fontFamily: fonts.sans,
        fontWeight: 700,
        fontSize: '20px',
        color: '#000',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: fonts.sans,
        fontWeight: 400,
        fontSize: '14px',
        color: 'rgba(0,0,0,0.6)',
        textAlign: 'center',
      }}
    >
      {label}
    </Typography>
  </Paper>
);

const HEIKeyStatsSection = () => {
  const orgProfile = useSelector(selectOrganizationProfile);
  const offers = orgProfile?.offers || [
    'Short courses',
    'Foundation',
    'Bachelors',
    'Pre-Masters',
    'Masters',
    'Doctoral',
  ];
  const stats = orgProfile?.heiStats || [
    { value: '5000+', label: 'Total number of students' },
    { value: '65% 35%', label: 'Student Gender division' },
    { value: '15%', label: 'International student %' },
    { value: '1:34', label: 'Staff to Student Ratio' },
    { value: '60%', label: 'Employment rate' },
  ];

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '0 0 20px 20px',
        width: '100%',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
        mt: -1,
        position: 'relative',
        zIndex: 1,
        p: 3,
        px: { xs: 2, md: 4 },
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: '16px',
          color: '#000',
          mb: 2,
        }}
      >
        Offers
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
        {offers.map((offer) => (
          <Chip
            key={offer}
            label={offer}
            sx={{
              backgroundColor: 'rgba(188, 40, 118, 0.1)',
              color: '#BC2876',
              fontFamily: fonts.sans,
              fontWeight: 500,
              fontSize: '14px',
              borderRadius: '90px',
              height: '36px',
              '& .MuiChip-label': { px: 2 },
            }}
          />
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {stats.map((stat, idx) => (
          <StatCard key={idx} value={stat.value} label={stat.label} />
        ))}
      </Box>
    </Box>
  );
};

export default HEIKeyStatsSection;
