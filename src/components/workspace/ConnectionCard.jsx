import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Chip,
    Paper,
    CircularProgress,
} from '@mui/material';
import { fonts } from '../../utility/fonts';

const ConnectionCard = ({ 
    user, 
    type, // 'follower' or 'following'
    relationshipDate, 
    onAction, 
    onMessage,
    actionLoading 
}) => {
    if (!user) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Interests can be a Map or Object based on API docs. Convert to array.
    const interests = user.interests ? Object.keys(user.interests) : [];

    return (
        <Paper
            elevation={0}
            sx={{
                p: '20px',
                borderRadius: '16px',
                border: '1px solid #EAECF0',
                backgroundColor: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0px 12px 24px -4px rgba(16, 24, 40, 0.08)'
                }
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Avatar
                    src={user.profilePicture}
                    alt={user.firstName}
                    sx={{ width: 64, height: 64, border: '1px solid #F2F4F7' }}
                />
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {type === 'following' && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => onMessage(user)}
                            sx={{
                                borderRadius: '90px',
                                textTransform: 'none',
                                fontFamily: fonts.sans,
                                fontWeight: 600,
                                fontSize: '14px',
                                px: 2,
                                py: 0.75,
                                borderColor: '#D0D5DD',
                                color: '#344054',
                                '&:hover': { borderColor: '#D0D5DD', backgroundColor: '#F9FAFB' }
                            }}
                        >
                            Message
                        </Button>
                    )}
                    <Button
                        variant={type === 'follower' ? 'outlined' : 'contained'}
                        size="small"
                        onClick={() => onAction(user)}
                        disabled={actionLoading}
                        sx={{
                            borderRadius: '90px',
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '14px',
                            px: 2.5,
                            py: 0.75,
                            minWidth: '100px',
                            ...(type === 'follower' ? {
                                borderColor: '#D0D5DD',
                                color: '#344054',
                                '&:hover': { borderColor: '#D92D20', color: '#D92D20', backgroundColor: 'rgba(217, 45, 32, 0.05)' }
                            } : {
                                background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
                                color: '#fff',
                                boxShadow: 'none',
                                '&:hover': { opacity: 0.9, boxShadow: 'none' }
                            })
                        }}
                    >
                        {actionLoading ? <CircularProgress size={20} color="inherit" /> : (
                            type === 'follower' ? 'Remove' : 'Following'
                        )}
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mb: 1.5 }}>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 700,
                        fontSize: '18px',
                        color: '#101828',
                        mb: 0.5
                    }}
                >
                    {user.firstName} {user.lastName}
                </Typography>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontSize: '13px',
                        color: '#BC2876',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}
                >
                    {Array.isArray(user.role) ? user.role[0] : user.role || 'User'}
                </Typography>
            </Box>

            <Typography
                sx={{
                    fontFamily: fonts.sans,
                    fontSize: '14px',
                    color: '#475467',
                    lineHeight: 1.5,
                    mb: 2,
                    height: '42px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                }}
            >
                {user.introBio || 'No bio provided.'}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, flexGrow: 1 }}>
                {interests.length > 0 ? interests.slice(0, 3).map((interest, idx) => (
                    <Chip
                        key={idx}
                        label={interest}
                        size="small"
                        sx={{
                            backgroundColor: '#F2F4F7',
                            color: '#344054',
                            fontFamily: fonts.sans,
                            fontSize: '12px',
                            fontWeight: 500,
                            borderRadius: '6px'
                        }}
                    />
                )) : (
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#98A2B3', fontStyle: 'italic' }}>
                        No interests listed
                    </Typography>
                )}
                {interests.length > 3 && (
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#667085', alignSelf: 'center' }}>
                        +{interests.length - 3} more
                    </Typography>
                )}
            </Box>

            <Box sx={{ pt: 2, borderTop: '1px solid #EAECF0' }}>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontSize: '12px',
                        color: '#667085',
                        fontWeight: 500
                    }}
                >
                    Followed on: <span style={{ color: '#101828' }}>{formatDate(relationshipDate)}</span>
                </Typography>
            </Box>
        </Paper>
    );
};

export default ConnectionCard;
