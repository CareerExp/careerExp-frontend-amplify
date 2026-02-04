import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Avatar,
    Button,
    IconButton,
    Grid,
    Tabs,
    Tab,
    Divider,
    Paper,
    Stack,
    Chip,
    Breadcrumbs,
    Link,
    Pagination,
    PaginationItem,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    FacebookIcon,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
    TikTokIcon,
    TelegramIcon,
} from '../../assets/assest';
import { fonts } from '../../utility/fonts';
import { getAuthorVideos } from '../../redux/slices/creatorSlice';
import { selectToken, selectUserId } from '../../redux/slices/authSlice';
import {
    checkFollowStatus,
    creatorFollowToggle,
    selectIsFollowing,
    selectFollowerCount
} from '../../redux/slices/creatorSlice';
import { notify } from '../../redux/slices/alertSlice';
import { config } from '../../config/config';
import SharingVideoModal from '../../models/SharingVideoModal';

const ContentCard = ({ item, name }) => {
    const thumbnailUrl = item.youtubeLink
        ? `https://img.youtube.com/vi/${item.youtubeVideoId}/0.jpg`
        : item.thumbnail;

    return (
        <Paper
            elevation={0}
            onClick={() => (window.location.href = `/video/${item._id || item.id}`)}
            sx={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #EAECF0',
                transition: 'transform 0.2s',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-4px)' }
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '160px',
                    backgroundColor: '#F2F4F7',
                    backgroundImage: `url(${thumbnailUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#101828',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            height: '44px'
                        }}
                    >
                        {item.title}
                    </Typography>
                    <IconButton
                        size="small"
                        sx={{ mt: -0.5, mr: -1 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            // Handle menu click
                        }}
                    >
                        <MoreVertIcon sx={{ fontSize: '20px', color: '#667085' }} />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <Stack direction="row" spacing={0.2}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                sx={{
                                    fontSize: '16px',
                                    color: star <= (item.averageRating || item.rating || 4) ? '#FEC84B' : '#D0D5DD'
                                }}
                            />
                        ))}
                    </Stack>
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: '#667085' }}>
                        ({item.totalRatings || item.reviewCount || 0})
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: '#475467', fontWeight: 500 }}>
                        by {item.author || name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <VisibilityIcon sx={{ fontSize: '16px', color: '#667085' }} />
                        <Typography sx={{ fontFamily: fonts.sans, fontSize: '13px', color: '#667085' }}>
                            {item.totalViews || item.views || '0'} views
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

const CounsellorDetail = ({ counsellor, onBack }) => {
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const studentUserId = useSelector(selectUserId);
    const isFollowing = useSelector(selectIsFollowing);
    const followerCount = useSelector(selectFollowerCount);

    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(1);
    const [videos, setVideos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Fix: ensure isFollowing is always boolean
    const isFollowingBool = typeof isFollowing === "boolean" ? isFollowing : !!isFollowing?.isFollowing;

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setPage(1); // Reset page when switching tabs
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const creator = counsellor?.creatorUserId || {};
    const userId = creator._id || counsellor?.id;
    const name = creator.firstName ? `${creator.firstName} ${creator.lastName}` : (counsellor?.name || creator.email || "Unknown Counselor");

    // Check follow status on mount
    useEffect(() => {
        if (studentUserId && userId) {
            dispatch(checkFollowStatus({
                userId: studentUserId,
                targetUserId: userId,
                token
            }));
        }
    }, [dispatch, studentUserId, userId, token]);

    const handleFollow = async () => {
        if (!studentUserId) {
            dispatch(notify({ message: "You need to login/signup first to follow", type: "error" }));
            return;
        }

        if (studentUserId === userId) {
            dispatch(notify({ message: "You can't follow yourself", type: "error" }));
            return;
        }

        try {
            setIsFollowLoading(true);
            await dispatch(creatorFollowToggle({
                userId: studentUserId,
                targetUserId: userId,
                token
            }));
            dispatch(notify({ message: "Successfully performed action", type: "success" }));
        } catch (error) {
            console.error("Follow Toggle Error:", error);
        } finally {
            setIsFollowLoading(false);
        }
    };

    // Fetch videos when tab is Videos (0) and page changes
    useEffect(() => {
        const fetchVideos = async () => {
            if (activeTab === 0 && userId) {
                // Only show main loader if we don't have videos already (Possibility 4)
                if (videos.length === 0) {
                    setIsLoading(true);
                }

                try {
                    const resultAction = await dispatch(getAuthorVideos({
                        userId,
                        page,
                        limit: 9
                    }));
                    if (getAuthorVideos.fulfilled.match(resultAction)) {
                        setVideos(resultAction.payload.videos || []);
                        setTotalPages(resultAction.payload.totalPages || 1);
                    }
                } catch (error) {
                    console.error("Fetch Videos Error:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchVideos();
    }, [dispatch, userId, page, activeTab]);

    // Dummy content data for other tabs
    const contentData = {
        1: [ // Articles
            { id: 1, title: 'The Future of Remote Work in Tech', rating: 4, reviewCount: 5, views: '1.5k', thumbnail: '' },
            { id: 2, title: 'Mastering the Art of Negotiation', rating: 5, reviewCount: 10, views: '900', thumbnail: '' },
            { id: 3, title: 'Mental Health at Workplace', rating: 4, reviewCount: 7, views: '1.1k', thumbnail: '' },
        ],
        2: [ // Podcasts
            { id: 1, title: 'Interview with a Senior Tech Architect', rating: 5, reviewCount: 25, views: '5.2k', thumbnail: '' },
            { id: 2, title: 'Building a Strong Professional Network', rating: 4, reviewCount: 18, views: '2.8k', thumbnail: '' },
        ]
    };

    const socialLinks = [
        { icon: FacebookIcon, link: creator.facebook },
        { icon: InstagramIcon, link: creator.instagram },
        { icon: TikTokIcon, link: creator.tiktok },
        { icon: LinkedinIcon, link: creator.linkedin },
        { icon: YoutubeIcon, link: creator.youtube },
        { icon: TelegramIcon, link: creator.telegram },
        { icon: TwitterIcon, link: creator.twitter },
    ].filter(s => s.link || true);

    return (
        <Box sx={{ p: { xs: 2, md: 0 } }}>
            {/* Breadcrumbs Section */}
            <Box sx={{ mb: 3, mt: "16px" }}>
                {/* <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    <Link
                        underline="hover"
                        color="inherit"
                        onClick={onBack}
                        sx={{ cursor: 'pointer', fontFamily: fonts.sans, fontSize: '14px', color: '#787876' }}
                    >
                        My Counsellors
                    </Link>
                    <Typography
                        sx={{ fontFamily: fonts.sans, fontSize: '14px', color: '#000', fontWeight: 500 }}
                    >
                        {name}
                    </Typography>
                </Breadcrumbs> */}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onBack} sx={{ p: 0, mr: 1 }}>
                        <ArrowBackIcon sx={{ color: '#000' }} />
                    </IconButton>
                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: '26px', color: '#000' }}>
                        Counsellor Detail
                    </Typography>
                </Box>
            </Box>

            {/* Profile Detail Card */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    boxShadow: '0px 6px 24px 0px rgba(0,0,0,0.1)',
                    mb: 4
                }}
            >
                {/* Banner Section */}
                <Box sx={{ height: '80px', backgroundColor: '#FF8A00', position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            right: 24,
                            top: 29,
                            backgroundColor: '#fff',
                            p: '13px 16px',
                            borderRadius: '16px 16px 0 0',
                            height: '51px',
                            display: 'flex',
                            alignItems: 'center',
                            boxShadow: '0px -2px 10px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Stack direction="row" spacing={2.2}>
                            {socialLinks.map((social, idx) => (
                                <Box
                                    key={idx}
                                    component="img"
                                    src={social.icon}
                                    sx={{ width: 25, height: 25, cursor: 'pointer' }}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Box>

                <Box sx={{ p: '0 32px 30px 26px', position: 'relative' }}>
                    <Grid container spacing={2}>
                        {/* Profile Section (Left) */}
                        <Grid item sx={{ mt: '-30px', textAlign: 'center', width: '120px' }}>
                            <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Avatar
                                    src={creator.profilePicture}
                                    sx={{
                                        width: 97,
                                        height: 97,
                                        border: '12px solid #fff',
                                        // boxShadow: '0px 4px 10px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </Box>
                            <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '14px', color: '#000', mt: 1, mb: 1 }}>
                                {followerCount || 0} Followers
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleFollow}
                                disabled={isFollowLoading}
                                sx={{
                                    background: 'linear-gradient(147.23deg, #BF2F75 3.87%, #720361 63.8%)',
                                    borderRadius: '13px',
                                    textTransform: 'none',
                                    fontFamily: fonts.sans,
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    width: '98px',
                                    height: '44px',
                                    p: 0,
                                    '&:hover': { opacity: 0.9 },
                                    '&.Mui-disabled': { opacity: 0.7, color: '#fff' }
                                }}
                            >
                                {isFollowLoading ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : isFollowingBool ? (
                                    "Following"
                                ) : (
                                    "Follow"
                                )}
                            </Button>
                        </Grid>

                        {/* Info Section (Right) */}
                        <Grid item xs sx={{ pt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.2, marginTop: "12px" }}>
                                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '23px', color: '#000' }}>
                                        {name}
                                    </Typography>
                                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 400, fontSize: '14px', color: '#777' }}>
                                        (Lorem Ipsum is simply dummy text)
                                    </Typography>
                                </Box>
                                <Box
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.6, cursor: 'pointer' }}
                                    onClick={() => setIsShareModalOpen(true)}
                                >
                                    <ShareIcon sx={{ color: '#BC2876', fontSize: '20px' }} />
                                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 400, fontSize: '14px', color: '#787876' }}>
                                        Share Profile
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Detailing Row: Specialization & Company Page */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                <Stack spacing={0.5}>
                                    <Stack direction="row" spacing={0.6} alignItems="center">
                                        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#000' }}>
                                            Specialization
                                        </Typography>
                                        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', color: '#000' }}>
                                            :
                                        </Typography>
                                        {['Accounting', 'Software Engineering'].map(spec => (
                                            <Chip
                                                key={spec}
                                                label={spec}
                                                sx={{
                                                    fontFamily: fonts.sans,
                                                    fontSize: '16px',
                                                    color: '#545454',
                                                    backgroundColor: '#f2f2f2',
                                                    borderRadius: '90px',
                                                    height: '34px'
                                                }}
                                            />
                                        ))}
                                    </Stack>
                                    <Stack direction="row" spacing={0.6} alignItems="center">
                                        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '16px', color: '#000' }}>
                                            Years of experience
                                        </Typography>
                                        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', color: '#000' }}>
                                            :
                                        </Typography>
                                        <Chip
                                            label="4 years"
                                            sx={{
                                                fontFamily: fonts.sans,
                                                fontSize: '16px',
                                                color: '#545454',
                                                backgroundColor: '#f2f2f2',
                                                borderRadius: '90px',
                                                height: '34px'
                                            }}
                                        />
                                    </Stack>
                                </Stack>

                                <Button
                                    variant="contained"
                                    startIcon={<BusinessIcon sx={{ color: '#fff' }} />}
                                    sx={{
                                        borderRadius: '9px',
                                        background: 'linear-gradient(162.56deg, #BF2F75 3.87%, #720361 63.8%)',
                                        color: '#fff',
                                        textTransform: 'none',
                                        fontFamily: fonts.sans,
                                        fontWeight: 600,
                                        fontSize: '15px',
                                        height: '39px',
                                        px: '20px',
                                        '&:hover': { opacity: 0.9 }
                                    }}
                                >
                                    Company Page
                                </Button>
                            </Box>

                            {/* Contact Details Bar */}
                            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <LocationOnIcon sx={{ color: '#BC2876', fontSize: '20px' }} />
                                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#000' }}>
                                        {creator.country || 'India'}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#D9D9D9' }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <PhoneInTalkIcon sx={{ color: '#BC2876', fontSize: '20px' }} />
                                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#000' }}>
                                        {creator.mobile || '+1 000 0000 000'}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#D9D9D9' }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <WhatsAppIcon sx={{ color: '#BC2876', fontSize: '20px' }} />
                                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#000' }}>
                                        {creator.whatsapp || '+1 000 0000 000'}
                                    </Typography>
                                </Box>
                                <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#D9D9D9' }} />
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <MailOutlineIcon sx={{ color: '#BC2876', fontSize: '20px' }} />
                                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#000' }}>
                                        {creator.email || 'ronaldjvaladez@dayrep.com'}
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* About Me Section */}
                            <Box sx={{ backgroundColor: '#f2f2f2', borderRadius: '10px', p: '10px 15px' }}>
                                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', color: '#777', mb: 0.5 }}>
                                    About me
                                </Typography>
                                <Divider sx={{ mb: 1, borderColor: '#EAECF0' }} />
                                <Typography sx={{ fontFamily: fonts.sans, fontSize: '16px', color: '#777', lineHeight: 1.5 }}>
                                    {creator.introBio || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* Content Tabs Section */}
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            '& .MuiTabs-indicator': { backgroundColor: '#BC2876', height: '3px', borderRadius: '3px' },
                            '& .MuiTab-root': {
                                fontFamily: fonts.sans,
                                fontWeight: 600,
                                fontSize: '18px',
                                textTransform: 'none',
                                color: '#787876',
                                px: 4,
                                '&.Mui-selected': { color: '#BC2876' }
                            }
                        }}
                    >
                        <Tab label="Videos" />
                        <Tab label="Articles" />
                        <Tab label="Podcasts" />
                    </Tabs>
                </Box>

                <Box sx={{ py: 4 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: '#BC2876' }} />
                        </Box>
                    ) : (
                        <>
                            <Grid container spacing={3}>
                                {activeTab === 0 ? (
                                    videos.map((item) => (
                                        <Grid item key={item._id} xs={12} sm={6} md={4}>
                                            <ContentCard item={item} name={name} />
                                        </Grid>
                                    ))
                                ) : (
                                    (contentData[activeTab] || []).map((item) => (
                                        <Grid item key={item.id} xs={12} sm={6} md={4}>
                                            <ContentCard item={item} name={name} />
                                        </Grid>
                                    ))
                                )}
                            </Grid>

                            {/* No Content Message */}
                            {((activeTab === 0 && videos.length === 0) || (activeTab !== 0 && contentData[activeTab]?.length === 0)) && (
                                <Box sx={{ py: 6, textAlign: 'center' }}>
                                    <Typography sx={{ color: '#787876', fontFamily: fonts.sans, fontSize: '18px' }}>
                                        No content available in this category
                                    </Typography>
                                </Box>
                            )}

                            {/* Pagination - Matching Figma Image */}
                            {activeTab === 0 && totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        renderItem={(item) => (
                                            <PaginationItem
                                                slots={{ previous: ChevronLeftIcon, next: ChevronRightIcon }}
                                                {...item}
                                                sx={{
                                                    fontFamily: fonts.sans,
                                                    fontSize: '16px',
                                                    fontWeight: 500,
                                                    color: '#000',
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#EAEAEA',
                                                        color: '#000',
                                                        '&:hover': { backgroundColor: '#D9D9D9' }
                                                    },
                                                    '&.MuiPaginationItem-previousNext': {
                                                        color: '#000',
                                                        '&.Mui-disabled': { color: '#ccc' }
                                                    },
                                                    border: 'none',
                                                    mx: 0.5
                                                }}
                                            />
                                        )}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Box>

            <SharingVideoModal
                open={isShareModalOpen}
                handleClose={() => setIsShareModalOpen(false)}
                videoUrl={`${config?.frontendDomain}/profile/${userId}`}
                isProfile={true}
            />
        </Box>
    );
};

export default CounsellorDetail;
