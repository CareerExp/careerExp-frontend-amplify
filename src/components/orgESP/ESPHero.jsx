import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { fonts } from '../../utility/fonts';
import { defaultHeroBG, organizationLogo } from '../../assets/assest';
import { selectOrganizationProfile } from '../../redux/slices/organizationSlice';
import { selectToken, selectUserId } from '../../redux/slices/authSlice';
import { toggleFollow } from '../../redux/slices/followerSlice';
import { getDashboardFollowing } from '../../redux/slices/dashboardActivitySlice';
import { selectDashboardFollowing } from '../../redux/slices/dashboardActivitySlice';
import { checkFollowStatus, selectIsFollowing } from '../../redux/slices/creatorSlice';
import { notify } from '../../redux/slices/alertSlice';

/** Public org page URL for this organization */
function getOrgPublicUrl(profile) {
    if (!profile) return null;
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const path = profile.organizationType === 'HEI'
        ? `/org-hei/${profile.slug || profile.userId || profile._id}`
        : `/org-esp/${profile.slug || profile.userId || profile._id}`;
    return `${base}${path}`;
}

const ESPHero = ({ skipFollowCheck = false }) => {
    const dispatch = useDispatch();
    const orgProfile = useSelector(selectOrganizationProfile);
    const token = useSelector(selectToken);
    const userId = useSelector(selectUserId);
    const { items: followingItems } = useSelector(selectDashboardFollowing);
    const isFollowingFromCheck = useSelector(selectIsFollowing);
    const [followLoading, setFollowLoading] = useState(false);

    const orgTargetId = orgProfile?.userId || orgProfile?._id;
    const isFollowing = skipFollowCheck
        ? !!orgTargetId && isFollowingFromCheck
        : !!orgTargetId && followingItems.some(
            (item) => item.id === orgTargetId || item.userId === orgTargetId
        );

    useEffect(() => {
        if (skipFollowCheck && token && orgTargetId && userId && userId !== orgTargetId) {
            dispatch(checkFollowStatus({ userId, targetUserId: orgTargetId, token }));
        }
        if (!skipFollowCheck && token && orgTargetId) {
            dispatch(getDashboardFollowing({ token }));
        }
    }, [dispatch, token, orgTargetId, userId, skipFollowCheck]);

    const handleFollowClick = async () => {
        if (!token) {
            dispatch(notify({ message: 'Please sign in to follow', type: 'error' }));
            return;
        }
        if (!orgTargetId) return;
        if (userId === orgTargetId) return;
        setFollowLoading(true);
        try {
            const result = await dispatch(toggleFollow({ targetUserId: orgTargetId, token }));
            if (toggleFollow.fulfilled.match(result)) {
                dispatch(notify({
                    message: isFollowing ? 'Unfollowed successfully' : 'Following successfully',
                    type: 'success',
                }));
                if (skipFollowCheck) {
                    dispatch(checkFollowStatus({ userId, targetUserId: orgTargetId, token }));
                } else {
                    dispatch(getDashboardFollowing({ token }));
                }
            } else {
                dispatch(notify({
                    message: result.payload?.error || 'Failed to update follow',
                    type: 'error',
                }));
            }
        } finally {
            setFollowLoading(false);
        }
    };

    const shareUrl = getOrgPublicUrl(orgProfile);
    const handleShare = async () => {
        if (!shareUrl) return;
        const title = orgProfile?.organizationName || 'Organization';
        try {
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: orgProfile?.subtitle || '',
                    url: shareUrl,
                });
                dispatch(notify({ message: 'Link shared!', type: 'success' }));
            } else {
                await navigator.clipboard.writeText(shareUrl);
                dispatch(notify({ message: 'Link copied to clipboard', type: 'success' }));
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    dispatch(notify({ message: 'Link copied to clipboard', type: 'success' }));
                } catch {
                    dispatch(notify({ message: 'Could not share or copy link', type: 'error' }));
                }
            }
        }
    };

    return (
        <Box sx={{ position: 'relative' }}>
            {/* Banner */}
            <Box
                sx={{
                    height: '182px',
                    backgroundImage: `url(${orgProfile?.bannerImage || defaultHeroBG})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '20px 20px 0 0',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.2)', // Overlay to make text pop
                        pointerEvents: 'none',
                    },
                }}
            />

            {/* Profile Info Container (Logo + Text + Actions) */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: { xs: 2, md: 4 },
                    mt: '-120px', // Overlap effect for logo
                    position: 'relative',
                    zIndex: 2,
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, md: 3 }
                }}
            >
                {/* Logo */}
                <Box
                    sx={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#fff',
                        borderRadius: '20px 20px 0 0',
                        border: '4px solid #fff',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        component="img"
                        src={orgProfile?.logo || organizationLogo}
                        sx={{ width: '80%', height: '80%', objectFit: 'contain' }}
                    />
                </Box>

                {/* Company Name & Subtitle */}
                <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: { xs: '22px', md: '28px' },
                            color: '#fff',
                            lineHeight: 1.2,
                            textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        {orgProfile?.organizationName || "BYJU'S"}
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 500,
                            fontSize: { xs: '16px', md: '20px' },
                            color: '#fff',
                            mt: 0.5,
                            textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        {orgProfile?.subtitle || "Subtitle will be here"}
                    </Typography>
                </Box>

                {/* Action Buttons: Follow + Share (Flag/bookmark removed) */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mt: { xs: 2, md: 0 }
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={handleFollowClick}
                        disabled={followLoading || !orgTargetId || userId === orgTargetId}
                        sx={{
                            backgroundColor: '#fafafa',
                            borderRadius: '90px',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 700,
                            fontSize: '18px',
                            '& .MuiTypography-root': {
                                background: 'linear-gradient(146.73deg, #BF2F75 3.87%, #720361 63.8%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            },
                            '&:hover': {
                                backgroundColor: '#fff',
                                opacity: 0.9
                            }
                        }}
                    >
                        {followLoading ? (
                            <CircularProgress size={20} sx={{ color: '#720361' }} />
                        ) : (
                            <Typography sx={{ fontWeight: 700, fontSize: '18px' }}>
                                {isFollowing ? 'Following' : 'Follow'}
                            </Typography>
                        )}
                    </Button>
                    <Tooltip title="Share">
                        <IconButton
                            onClick={handleShare}
                            aria-label="Share company page"
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                color: '#fff',
                                width: '48px',
                                height: '48px',
                                border: '1.5px solid #fff',
                                backdropFilter: 'blur(22px)',
                                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.4)' }
                            }}
                        >
                            <ShareIcon sx={{ fontSize: '20px' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default ESPHero;
