import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Paper,
    Grid,
    Avatar,
    Divider,
    Stack,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import TagIcon from '@mui/icons-material/Tag';
import { fonts } from '../../utility/fonts';

const EventDetail = ({ event, onBack, onEdit, onDelete }) => {
    if (!event) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    // Use ctaResponses from the event object if available, otherwise use empty array
    const responses = event.ctaResponses || [];

    return (
        <Box sx={{ p: 4, minHeight: '100%' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={onBack} sx={{ p: 0 }}>
                        <Box
                            sx={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                border: '1px solid #EAECF0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#fff'
                            }}
                        >
                            <ArrowBackIcon sx={{ color: '#000' }} />
                        </Box>
                    </IconButton>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 700,
                            fontSize: '26px',
                            color: '#000',
                        }}
                    >
                        Event Detail
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                        onClick={() => onDelete(event)}
                        sx={{
                            height: '48px',
                            px: 3,
                            borderRadius: '90px',
                            border: '1px solid #D0D5DD',
                            color: '#344054',
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '16px',
                            backgroundColor: '#fff',
                            '&:hover': { backgroundColor: '#F9FAFB' }
                        }}
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() => onEdit(event)}
                        variant="contained"
                        sx={{
                            height: '48px',
                            px: 3,
                            borderRadius: '90px',
                            background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
                            color: '#fff',
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '16px',
                            '&:hover': { opacity: 0.9 }
                        }}
                    >
                        Edit Event
                    </Button>
                </Box>
            </Box>

            {/* Main Content Card */}
            <Paper
                elevation={0}
                sx={{
                    p: '30px',
                    borderRadius: '15px',
                    backgroundColor: '#fff',
                    boxShadow: '0px 6px 9px 0px rgba(0,0,0,0.1)',
                    mb: 4
                }}
            >
                {/* Date Row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <CalendarTodayIcon sx={{ color: '#545454', fontSize: '20px' }} />
                        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '14px', color: '#545454' }}>
                            {formatDate(event.createdAt)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: 'rgba(21, 140, 255, 0.1)',
                            borderRadius: '10px',
                            px: 1.5,
                            py: 0.5,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#158CFF',
                                textTransform: 'capitalize'
                            }}
                        >
                            {event.mode?.toLowerCase() || 'Online'}
                        </Typography>
                    </Box>
                </Box>

                {/* Title */}
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 700,
                        fontSize: '32px',
                        color: '#000',
                        mb: 4,
                        lineHeight: 1.2
                    }}
                >
                    {event.title}
                </Typography>

                {/* Banner with Overlay */}
                <Box
                    sx={{
                        width: '100%',
                        height: '400px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        mb: 4,
                        backgroundColor: '#f2f2f2'
                    }}
                >
                    <Box
                        component="img"
                        src={event.coverImage || event.image}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Overlay Text */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            backdropFilter: 'blur(3.5px)',
                            backgroundColor: 'rgba(0, 0, 0, 0.58)',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                            p: '20px',
                            borderBottomLeftRadius: '8px',
                            borderTopRightRadius: '8px'
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontWeight: 500,
                                fontSize: '24px',
                                color: '#fff',
                                letterSpacing: '-0.48px',
                                lineHeight: '30px'
                            }}
                        >
                            {event.title}
                        </Typography>
                    </Box>
                </Box>

                {/* Description */}
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#545454',
                        lineHeight: '28px',
                        whiteSpace: 'pre-wrap',
                        mb: 4
                    }}
                >
                    {event.description}
                </Typography>

                {/* Event Info Grid */}
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: '18px', color: '#BC2876' }} />
                                <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', fontWeight: 600, color: '#BC2876' }}>
                                    Live Start
                                </Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fonts.sans, fontSize: '15px', color: '#101828', pl: '26px' }}>
                                {formatDate(event.liveStartDate)}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AccessTimeIcon sx={{ fontSize: '18px', color: '#BC2876' }} />
                                <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', fontWeight: 600, color: '#BC2876' }}>
                                    Live End
                                </Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fonts.sans, fontSize: '15px', color: '#101828', pl: '26px' }}>
                                {formatDate(event.liveEndDate)}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LanguageIcon sx={{ fontSize: '18px', color: '#BC2876' }} />
                                <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', fontWeight: 600, color: '#BC2876' }}>
                                    Mode
                                </Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fonts.sans, fontSize: '15px', color: '#101828', pl: '26px', textTransform: 'capitalize' }}>
                                {event.mode?.toLowerCase() || 'Online'}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TagIcon sx={{ fontSize: '18px', color: '#BC2876' }} />
                                <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', fontWeight: 600, color: '#BC2876' }}>
                                    Reference No
                                </Typography>
                            </Box>
                            <Typography sx={{ fontFamily: fonts.sans, fontSize: '15px', color: '#101828', pl: '26px' }}>
                                {event.referenceNumber || 'N/A'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                {/* Registration Deadline (if exists) */}
                {event.registrationDeadline && (
                    <Box
                        sx={{
                            mt: 4,
                            backgroundColor: 'rgba(191, 47, 117, 0.1)',
                            borderLeft: '4px solid #bc2876',
                            borderRadius: '10px',
                            px: 3,
                            py: 2,
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontWeight: 600,
                                fontSize: '16px',
                                color: '#bc2876',
                            }}
                        >
                            Registration Deadline: {formatDate(event.registrationDeadline)}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* CTAs Received Section */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                    boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.08)'
                }}
            >
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 700,
                        fontSize: '24px',
                        color: '#000',
                        mb: 3
                    }}
                >
                    CTAs received
                </Typography>

                {responses.length > 0 ? (
                    <Grid container spacing={2.5}>
                        {responses.map((resp) => {
                            const user = resp.userId || {};
                            const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Unknown';
                            return (
                                <Grid item key={resp._id} xs={12} sm={6} md={4}>
                                    <Box
                                        sx={{
                                            backgroundColor: '#f4f7fe',
                                            borderRadius: '12px',
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Avatar
                                            src={user.profilePicture}
                                            sx={{ width: 48, height: 48, backgroundColor: '#e5e7eb' }}
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.sans,
                                                    fontWeight: 600,
                                                    fontSize: '16px',
                                                    color: '#000',
                                                }}
                                            >
                                                {displayName}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontFamily: fonts.sans,
                                                    fontWeight: 400,
                                                    fontSize: '14px',
                                                    color: '#666',
                                                }}
                                            >
                                                {formatDate(resp.respondedAt)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : (
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#667085', py: 2 }}>
                        No responses received yet.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default EventDetail;
