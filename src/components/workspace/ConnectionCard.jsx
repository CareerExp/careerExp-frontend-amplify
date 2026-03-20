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
import { messagesIcon, removeUserIcon } from '../../assets/assest';


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Follower card styles (Figma 900-68030)
const followerCardSx = {
    p: '20px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: '#FAFAFA',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
};
const followerAvatarSize = 56;
const followerNameSx = { fontFamily: fonts.sans, fontWeight: 600, fontSize: '18px', color: '#121212', mb: 0.5 };
const followerDateSx = { fontFamily: fonts.sans, fontSize: '14px', fontWeight: 400, color: '#686868' };
const followerInterestsLabelSx = { fontFamily: fonts.sans, fontSize: '14px', fontWeight: 500, color: '#121212', mb: 1 };
// Interest chips: light purple/pink bg + dark purple text (Figma typography)
const followerChipSx = (idx) => ({
    backgroundColor: idx === 0 ? '#EED6F6' : '#F8E6FC',
    color: idx === 0 ? '#69008C' : '#8C008D',
    fontFamily: fonts.sans,
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '24px',
    px: 1.5,
    py: 0.5,
});
const followerMessageBtnSx = {
    borderRadius: '24px',
    textTransform: 'none',
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: '16px',
    px: 2,
    py: 1.25,
    background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
    color: '#FFFFFF',
    boxShadow: 'none',
    '&:hover': { opacity: 0.9, boxShadow: 'none', background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)' },
};
const followerRemoveBtnSx = {
    borderRadius: '24px',
    textTransform: 'none',
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: '16px',
    px: 2,
    py: 1.25,
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D1D1',
    color: '#686868',
    '&:hover': { borderColor: '#D1D1D1', backgroundColor: '#FAFAFA' },
};

// Following card styles (Figma 900-68320)
const followingCardSx = {
    p: '20px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
};
const followingAvatarSize = 64;
const followingNameSx = { fontFamily: fonts.sans, fontWeight: 700, fontSize: '18px', color: '#000000' };
const followingMessageBtnSx = {
    width: '55%',
    borderRadius: '24px',
    textTransform: 'none',
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: '16px',
    px: 2,
    py: 1.25,
    background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)',
    color: '#FFFFFF',
    boxShadow: 'none',
    '&:hover': { opacity: 0.9, boxShadow: 'none', background: 'linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)' },
};
const followingUnfollowBtnSx = {
    width: '45%',
    borderRadius: '24px',
    textTransform: 'none',
    fontFamily: fonts.sans,
    fontWeight: 500,
    fontSize: '16px',
    px: 2,
    py: 1.25,
    backgroundColor: '#FFFFFF',
    border: '1px solid #D1D5DB',
    color: '#666666',
    '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
};

const ConnectionCard = ({
    user,
    type, // 'follower' or 'following'
    relationshipDate,
    onAction,
    onMessage,
    actionLoading
}) => {
    if (!user) return null;

    const interests = user.interests ? Object.keys(user.interests) : [];
    const isFollower = type === 'follower';

    if (isFollower) {
        // Follower card layout (Figma 900-68030): Avatar + Name/Date | Interests | Message + Remove
        return (
            <Paper elevation={0} sx={followerCardSx}>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                        src={user.profilePicture}
                        alt={user.firstName}
                        sx={{ width: followerAvatarSize, height: followerAvatarSize, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={followerNameSx}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography sx={followerDateSx}>
                            Followed on {formatDate(relationshipDate)}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography sx={followerInterestsLabelSx}>Interests:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {interests.length > 0 ? (
                            <>
                                {interests.slice(0, 3).map((interest, idx) => (
                                    <Chip key={idx} label={interest} size="small" sx={followerChipSx(idx)} />
                                ))}
                                {interests.length > 3 && (
                                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#667085', alignSelf: 'center' }}>
                                        +{interests.length - 3} more
                                    </Typography>
                                )}
                            </>
                        ) : (
                            <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#98A2B3', fontStyle: 'italic' }}>
                                No interests listed
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button variant="contained" onClick={() => onMessage(user)} sx={followerMessageBtnSx}>
                        Message
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => onAction(user)}
                        disabled={actionLoading}
                        sx={followerRemoveBtnSx}
                    >
                        {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Remove'}
                    </Button>
                </Box>
            </Paper>
        );
    }

    // Following card layout (Figma 900-68320): [Avatar] [Name + Role] [Message + Unfollow] on one row, then Bio | Interests | Followed on
    return (
        <Paper elevation={0} sx={followingCardSx}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Avatar
                    src={user.profilePicture}
                    alt={user.firstName}
                    sx={{ width: followingAvatarSize, height: followingAvatarSize, border: '1px solid #F2F4F7', flexShrink: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={followingNameSx}>
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#667085', fontWeight: 500 }}>
                    Followed on: <span style={{ color: '#101828' }}>{formatDate(relationshipDate)}</span>
                </Typography>
                </Box>
                
            </Box>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#98A2B3', pb: 1    }}>
                        Interests:
                    </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3, flexGrow: 1 }}>
                 
                {interests.length > 0 ? interests.slice(0, 3).map((interest, idx) => (
                    <Chip
                        key={idx}
                        label={interest}
                        size="small"
                        sx={{
                            backgroundColor: '#BF2F751A',
                            color: '#720361',
                            fontFamily: fonts.sans,
                            fontSize: '12px',
                            fontWeight: 500,
                            borderRadius: '12px',
                            textTransform: 'capitalize',
                        }}
                    />
                )) : (
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#98A2B3', fontStyle: 'italic' }}>
                        No interests listed
                    </Typography>
                )}
                {/* {interests.length > 3 && (
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: '#667085', alignSelf: 'center' }}>
                        +{interests.length - 3} more
                    </Typography>
                )} */}
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, width: '100%' }}>
                    <Button
                        variant="contained"
                        onClick={() => onMessage(user)}
                        sx={followingMessageBtnSx}
                        startIcon={<Box component="img" src={messagesIcon} alt="" sx={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }} />}
                    >
                        Message
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => onAction(user)}
                        disabled={actionLoading}
                        sx={followingUnfollowBtnSx}
                        startIcon={!actionLoading ? <Box component="img" src={removeUserIcon} alt="" sx={{ width: 20, height: 20 }} /> : null}
                    >
                        {actionLoading ? <CircularProgress size={20} color="inherit" /> : 'Remove'}
                    </Button>
                </Box>
        </Paper>
    );
};

export default ConnectionCard;
