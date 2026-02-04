import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { fonts } from '../../utility/fonts';
import { counsellorData } from '../../utility/counsellorData';
import ESPSlider from './ESPSlider';

const CounsellorCard = ({ data }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '189px',
        p: '15px',
        borderRadius: '15px',
        boxShadow: '0px 6px 9px 0px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '13px',
        scrollSnapAlign: 'start',
      }}
    >
      <Box
        sx={{
          width: '159px',
          height: '160px',
          backgroundColor: '#f0f0f0', // Placeholder for image
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: '16px',
            color: '#000',
            lineHeight: '1.2',
            mb: '3px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {data.name}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 400,
            fontSize: '12px',
            color: 'rgba(0,0,0,0.5)',
            lineHeight: '1.2',
          }}
        >
          {data.role}
        </Typography>
      </Box>
    </Paper>
  );
};

const ESPCounsellors = () => {
  return (
    <ESPSlider title="Counsellors & Advisers">
      {counsellorData.map((counsellor) => (
        <CounsellorCard key={counsellor.id} data={counsellor} />
      ))}
    </ESPSlider>
  );
};

export default ESPCounsellors;
