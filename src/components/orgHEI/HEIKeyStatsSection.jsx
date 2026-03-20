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

/** HEI data may be at top level (public org profile) or under organization (userProfile.organization). */
function getHeiProfile(profile) {
  return profile?.organization ?? profile;
}

const HEIKeyStatsSection = ({ profile: profileProp }) => {
  const profileFromRedux = useSelector(selectOrganizationProfile);
  const profile = profileProp ?? profileFromRedux;
  const hei = getHeiProfile(profile);

  const programs = hei?.programs ?? [];

  const stats = [];
  if (hei?.totalStudents != null) {
    stats.push({ value: String(hei.totalStudents), label: 'Total number of students' });
  }
  if (hei?.maleStudentsPercent != null && hei?.femaleStudentsPercent != null) {
    stats.push({
      value: `${hei.maleStudentsPercent}% / ${hei.femaleStudentsPercent}%`,
      label: 'Student Gender division',
    });
  }
  if (hei?.internationalStudentsPercent != null) {
    stats.push({ value: `${hei.internationalStudentsPercent}%`, label: 'International student %' });
  }
  if (hei?.staffToStudentRatio) {
    stats.push({ value: String(hei.staffToStudentRatio), label: 'Staff to Student Ratio' });
  }
  if (hei?.employmentRatePercent != null) {
    stats.push({ value: `${hei.employmentRatePercent}%`, label: 'Employment rate' });
  }

  const hasStats = stats.length > 0;
  const hasPrograms = programs.length > 0;

  if (!hasPrograms && !hasStats) return null;

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
      {hasPrograms && (
        <>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '16px',
              color: '#000',
              mb: 2,
            }}
          >
            Programs
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
            {programs.map((program) => (
              <Chip
                key={program}
                label={program}
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
        </>
      )}
      {hasStats && (
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
      )}
    </Box>
  );
};

export default HEIKeyStatsSection;
