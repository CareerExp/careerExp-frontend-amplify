import React from 'react';
import { Box, Typography } from '@mui/material';
import { fonts } from '../../utility/fonts';
import SocialConnectionsContainer from '../workspace/SocialConnectionsContainer';

const CounsellorFollowers = () => {
    return (
        <Box sx={{  minHeight: '100%' }}>
            <Typography
                sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.8rem" },
                    color: '#000',
                    mb: 4,
                    marginTop: "2rem"
                }}
            >
                My Community
            </Typography>
            
            <SocialConnectionsContainer />
        </Box>
    );
};

export default CounsellorFollowers;
