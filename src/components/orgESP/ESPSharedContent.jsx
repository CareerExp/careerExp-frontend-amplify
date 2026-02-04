import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { fonts } from '../../utility/fonts';
import { sharedContentData } from '../../utility/sharedContentData';
import ESPSlider from './ESPSlider';

const ContentCard = ({ data }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                width: '287.5px', // 267.5px image width + 20px padding
                p: '10px',
                borderRadius: '15px',
                boxShadow: '0px 6px 9px 0px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                flexShrink: 0,
                scrollSnapAlign: 'start',
            }}
        >
            <Box
                sx={{
                    width: '267.5px',
                    height: '150.5px',
                    backgroundColor: '#f0f0f0', // Placeholder for image
                    borderRadius: '8px',
                    mb: '12px',
                }}
            />
            <Box sx={{ px: 0.5 }}>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#000',
                        lineHeight: '1.2',
                        mb: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {data.title}
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
                    {data.type}
                </Typography>
            </Box>
        </Paper>
    );
};

const ESPSharedContent = () => {
    return (
        <ESPSlider title="Shared Content">
            {sharedContentData.map((content) => (
                <ContentCard key={content.id} data={content} />
            ))}
        </ESPSlider>
    );
};

export default ESPSharedContent;
