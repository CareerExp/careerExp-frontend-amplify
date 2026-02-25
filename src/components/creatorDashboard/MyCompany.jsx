import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, Button, Divider, CircularProgress } from '@mui/material';
import { fonts } from '../../utility/fonts';
import ESPHero from '../orgESP/ESPHero';
import ESPInfoPanel from '../orgESP/ESPInfoPanel';
import OrgPublicAnnouncementsAndEvents from '../orgESP/OrgPublicAnnouncementsAndEvents';
import OrgPublicServices from '../orgESP/OrgPublicServices';
import OrgPublicSharedContent from '../orgESP/OrgPublicSharedContent';
import OrgPublicCounsellors from '../orgESP/OrgPublicCounsellors';
import {
    getMyCompanyInvitations,
    respondToInvitation,
    selectCreatorInvitations,
    selectCreatorLoading
} from '../../redux/slices/creatorSlice';
import { getOrganizationProfileById, selectOrganizationProfile } from '../../redux/slices/organizationSlice';
import { selectToken } from '../../redux/slices/authSlice';
import { selectUserProfile } from '../../redux/slices/profileSlice';
import { notify } from '../../redux/slices/alertSlice';
import { bannerPlaceholder, logoPlaceholder } from '../../assets/assest';

const InvitationCard = ({ invite, onRespond }) => {
    const [isResponding, setIsResponding] = useState(false);

    const handleAction = async (status) => {
        setIsResponding(true);
        await onRespond(invite._id, invite.organizationUserId, status);
        setIsResponding(false);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '360px',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0px 6px 9px 0px rgba(0,0,0,0.1)',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                position: 'relative'
            }}
        >
            {isResponding && (
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <CircularProgress size={30} sx={{ color: '#BC2876' }} />
                </Box>
            )}
            {/* Banner & Logo Section */}
            <Box sx={{ position: 'relative', height: '159px' }}>
                {/* Banner */}
                <Box
                    sx={{
                        height: '129px',
                        backgroundColor: '#ff8a00',
                        backgroundImage: `url(${invite.organizationId?.bannerImage || bannerPlaceholder})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Logo */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '0',
                        left: '16px',
                        width: '68px',
                        height: '68px',
                        backgroundColor: '#fff',
                        borderRadius: '8px',
                        border: '2px solid #fff',
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        component="img"
                        src={invite.logo || logoPlaceholder}
                        sx={{ width: '80%', height: '80%', objectFit: 'contain' }} 
                    />
                </Box>
            </Box>

            {/* Content Section */}
            <Box sx={{ p: '20px', pt: '10px' }}>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 600,
                        fontSize: '18px',
                        color: '#000',
                        mb: 0.5,
                    }}
                >
                    {invite?.organizationName}
                </Typography>
                <Typography
                    sx={{
                        fontFamily: fonts.sans,
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#787876',
                        mb: 2,
                    }}
                >
                    {invite.organizationId?.organizationType === 'ESP' ? 'Education Service Provider' : 'Higher Education Institution'}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#545454',
                            mb: 0.5,
                        }}
                    >
                        Message:
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 400,
                            fontSize: '14px',
                            color: '#545454',
                            lineHeight: 1.4,
                        }}
                    >
                        {invite.message || "You have been invited to join this organization."}
                    </Typography>
                </Box>

                {/* Buttons */}
                <Box sx={{ display: 'flex', gap: '12px' }}>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleAction('accepted')}
                        sx={{
                            background: 'linear-gradient(155.92deg, #BF2F75 3.87%, #720361 63.8%)',
                            borderRadius: '90px',
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            textWrap: 'nowrap',
                            fontSize: '14px',
                            height: '40px',
                            '&:hover': { opacity: 0.9 },
                        }}
                    >
                        Accept Invitation
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => handleAction('rejected')}
                        sx={{
                            borderColor: '#787876',
                            color: '#787876',
                            borderRadius: '90px',
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '14px',
                            height: '40px',
                            '&:hover': { borderColor: '#545454', backgroundColor: 'rgba(0,0,0,0.05)' },
                        }}
                    >
                        Decline
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

const MyCompany = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const userData = useSelector(selectUserProfile);
    const invitations = useSelector(selectCreatorInvitations);
    const isLoading = useSelector(selectCreatorLoading);

    // If user is already part of an organization, show the home page view
    // Using organization object directly from userData as per latest requirement
    const isMember = !!(userData?.organization?.organizationId);

    // Fetch invitations if not a member
    useEffect(() => {
        if (token && !isMember) {
            dispatch(getMyCompanyInvitations({ token }));
        }
    }, [dispatch, token, isMember]);

    // When membership is detected, fetch the organization profile using the dedicated API
    useEffect(() => {
        if (isMember && userData?.organization?.organizationId) {
            dispatch(getOrganizationProfileById({
                organizationId: userData.organization.organizationId,
                token
            }));
        }
    }, [dispatch, isMember, userData?.organization?.organizationId, token]);

    const handleRespond = async (invitationId, organizationUserId, status) => {
        try {
            const resultAction = await dispatch(respondToInvitation({ invitationId, organizationUserId, status, token }));
            if (respondToInvitation.fulfilled.match(resultAction)) {
                dispatch(notify({
                    message: `Invitation ${status === 'accepted' ? 'accepted' : 'declined'} successfully!`,
                    type: "success"
                }));
                if (status === 'accepted') {
                    // Refresh user profile to pick up the new organizationId
                    window.location.reload();
                }
            } else {
                dispatch(notify({
                    message: resultAction.payload?.error || `Failed to ${status} invitation`,
                    type: "error"
                }));
            }
        } catch (error) {
            console.error("Response Error:", error);
        }
    };

    const orgProfile = useSelector(selectOrganizationProfile);
    const orgIdentifier = orgProfile?.slug || orgProfile?.userId || orgProfile?._id;
    const orgIdType = orgProfile?.slug ? 'slug' : 'userId';

    if (isMember) {
        return (
            <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100%' }}>
                <Typography
                    sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600, fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.8rem" },
                        color: '#000',
                        mb: 3,
                    }}
                >
                    My Company
                </Typography>

                <Box sx={{ width: '100%', mx: 'auto' }}>
                    <ESPHero />
                    <ESPInfoPanel />
                    <OrgPublicAnnouncementsAndEvents identifier={orgIdentifier} idType={orgIdType} />
                    <OrgPublicServices identifier={orgIdentifier} idType={orgIdType} />
                    <OrgPublicCounsellors identifier={orgIdentifier} idType={orgIdType} />
                    <OrgPublicSharedContent identifier={orgIdentifier} idType={orgIdType} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, backgroundColor: '#f9fafb', minHeight: '100%' }}>
            <Typography
                sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: '26px',
                    color: '#000',
                    mb: 3,
                }}
            >
                My Company
            </Typography>

            {isLoading && invitations.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: '#BC2876' }} />
                </Box>
            ) : invitations.length > 0 ? (
                <>
                    <Paper
                        elevation={0}
                        sx={{
                            p: '16px 20px',
                            mb: 4,
                            borderRadius: '12px',
                            backgroundColor: '#FFFBFA',
                            border: '1px solid #F97066',
                        }}
                    >
                        <Typography
                            sx={{
                                fontFamily: fonts.sans,
                                fontSize: '15px',
                                color: '#787876',
                                lineHeight: 1.5,
                            }}
                        >
                            By accepting this invitation, your profile and content may appear on the company’s public profile, based on their visibility settings. You can leave the company at any time from this page.
                        </Typography>
                    </Paper>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        {invitations.map((invite) => (
                            <InvitationCard
                                key={invite._id}
                                invite={invite}
                                onRespond={handleRespond}
                            />
                        ))}
                    </Box>
                </>
            ) : (
                <Typography sx={{ fontFamily: fonts.sans, color: '#787876', textAlign: 'center', py: 4 }}>
                    No pending invitations.
                </Typography>
            )}
        </Box>
    );
};

export default MyCompany;
