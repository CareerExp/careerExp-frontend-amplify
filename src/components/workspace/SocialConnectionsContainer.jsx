import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    CircularProgress,
    IconButton,
    Dialog,
    DialogContent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { fonts } from '../../utility/fonts';
import ConnectionCard from './ConnectionCard';
import NewMessagePanel from '../messages/NewMessagePanel';
import {
    fetchFollowers,
    fetchFollowing,
    selectFollowers,
    selectFollowing,
    selectFollowerLoading,
    selectFollowerActionLoading,
    removeFollower,
    toggleFollow
} from '../../redux/slices/followerSlice';
import { selectToken } from '../../redux/slices/authSlice';
import { notify } from '../../redux/slices/alertSlice';
import { uploadDocument } from '../../assets/assest';

const SocialConnectionsContainer = () => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    
    const [activeTab, setActiveTab] = useState(0); // 0 for Followers, 1 for Following
    const [searchQuery, setSearchQuery] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [selectedUserForMessage, setSelectedUserForMessage] = useState(null);
    
    const followers = useSelector(selectFollowers);
    const following = useSelector(selectFollowing);
    const isLoading = useSelector(selectFollowerLoading);
    const isActionLoading = useSelector(selectFollowerActionLoading);

    const loadData = useCallback(() => {
        if (!token) return;
        if (activeTab === 0) {
            dispatch(fetchFollowers({ token, search: searchQuery }));
        } else {
            dispatch(fetchFollowing({ token, search: searchQuery }));
        }
    }, [dispatch, token, activeTab, searchQuery]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [loadData]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setSearchQuery(''); // Reset search when switching tabs
    };

    const handleAction = async (user) => {
        if (activeTab === 0) {
            // Remove Follower
            const resultAction = await dispatch(removeFollower({ followerId: user._id, token }));
            if (removeFollower.fulfilled.match(resultAction)) {
                dispatch(notify({ message: "Follower removed", type: "success" }));
            } else {
                dispatch(notify({ message: resultAction.payload?.error || "Failed to remove follower", type: "error" }));
            }
        } else {
            // Toggle Follow (Unfollow in this context)
            const resultAction = await dispatch(toggleFollow({ targetUserId: user._id, token }));
            if (toggleFollow.fulfilled.match(resultAction)) {
                dispatch(notify({ message: "Unfollowed successfully", type: "success" }));
                loadData(); // Refresh the list
            } else {
                dispatch(notify({ message: resultAction.payload?.error || "Action failed", type: "error" }));
            }
        }
    };

    const handleMessageOpen = (user) => {
        setSelectedUserForMessage(user);
        setIsMessageModalOpen(true);
    };

    const handleMessageModalClose = () => {
        setIsMessageModalOpen(false);
        setSelectedUserForMessage(null);
    };

    const displayNameForUser = (u) => {
        if (!u) return '';
        const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
        return name || u.email || '';
    };

    const dataList = activeTab === 0 ? followers : following;

    const EmptyState = () => (
        <Box sx={{
            textAlign: 'center',
            py: 12,
            backgroundColor: '#fff',
            borderRadius: '20px',
            border: '1px dashed #EAECF0',
            mt: 4
        }}>
            <Box
                component="img"
                src={uploadDocument}
                sx={{ width: '120px', height: '120px', mb: 3, opacity: 0.2, filter: 'grayscale(100%)' }}
            />
            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '20px', color: '#101828', mb: 1 }}>
                {activeTab === 0 ? 'No followers found' : 'You are not following anyone yet'}
            </Typography>
            <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#667085', maxWidth: '400px', mx: 'auto' }}>
                {searchQuery 
                    ? "We couldn't find anyone matching your search criteria." 
                    : activeTab === 0 
                        ? "Engage with your community to grow your followers list." 
                        : "Discover counsellors and organizations to follow them."}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ p: 0 }}>
            {/* Tabs & Search Row */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', md: 'center' },
                gap: 2,
                mb: 4 
            }}>
                <Tabs 
                    value={activeTab} 
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#BC2876',
                            height: '3px',
                            borderRadius: '3px'
                        },
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#667085',
                            minWidth: 'auto',
                            px: 3,
                            '&.Mui-selected': {
                                color: '#BC2876',
                            }
                        }
                    }}
                >
                    <Tab label="Followers" />
                    <Tab label="Following" />
                </Tabs>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField
                        placeholder={`Search ${activeTab === 0 ? 'followers' : 'following'}...`}
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{
                            width: { xs: '100%', md: '320px' },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '90px',
                                backgroundColor: '#fff',
                                px: 2,
                                border: '1px solid #EAECF0',
                                '& fieldset': { border: 'none' },
                            },
                            '& .MuiInputBase-input': {
                                fontFamily: fonts.sans,
                                fontSize: '14px',
                                color: '#101828',
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#667085', fontSize: '20px' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <IconButton 
                        sx={{ 
                            border: '1px solid #EAECF0', 
                            borderRadius: '12px',
                            backgroundColor: '#fff',
                            width: '40px',
                            height: '40px'
                        }}
                    >
                        <FilterListIcon sx={{ color: '#667085', fontSize: '20px' }} />
                    </IconButton>
                </Box>
            </Box>

            {/* Content Grid */}
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                    <CircularProgress sx={{ color: '#BC2876' }} />
                </Box>
            ) : (
                <>
                    {dataList && dataList.length > 0 ? (
                        <Grid container spacing={3}>
                            {dataList.map((item) => {
                                const userData = activeTab === 0 ? item.followerId : item.followingId;
                                return (
                                    <Grid item key={item._id} xs={12} sm={6} lg={4}>
                                        <ConnectionCard
                                            user={userData}
                                            type={activeTab === 0 ? 'follower' : 'following'}
                                            relationshipDate={item.createdAt}
                                            onAction={handleAction}
                                            onMessage={handleMessageOpen}
                                            actionLoading={isActionLoading}
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ) : (
                        <EmptyState />
                    )}
                </>
            )}

            <Dialog
                open={isMessageModalOpen}
                onClose={handleMessageModalClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '16px', p: 0 } }}
            >
                <DialogContent sx={{ p: 0 }}>
                    <NewMessagePanel
                        defaultToEmail={selectedUserForMessage?.email}
                        defaultDisplayName={displayNameForUser(selectedUserForMessage)}
                        disableToField
                        onSuccess={() => {
                            dispatch(notify({ message: 'Message sent', type: 'success' }));
                            handleMessageModalClose();
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SocialConnectionsContainer;
