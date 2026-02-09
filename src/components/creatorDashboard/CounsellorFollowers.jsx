import React from 'react';
import { Box, Typography } from '@mui/material';
import { fonts } from '../../utility/fonts';
import SocialConnectionsContainer from '../workspace/SocialConnectionsContainer';

const CounsellorFollowers = () => {
    return (
        <Box sx={{ p: 4, minHeight: '100%' }}>
            <Typography
                sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: '26px',
                    color: '#000',
                    mb: 4
                }}
            >
                My Community
            </Typography>
            
            <SocialConnectionsContainer />
        </Box>
    );
};

export default CounsellorFollowers;
