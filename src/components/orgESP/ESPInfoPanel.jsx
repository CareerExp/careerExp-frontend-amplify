import React from 'react';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Grid,
    Chip,
    Divider,
    Paper,
} from '@mui/material';
import { fonts } from '../../utility/fonts';
import {
    FacebookIcon,
    InstagramIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
    TikTokIcon,
    TelegramIcon,
} from '../../assets/assest';
import BusinessIcon from '@mui/icons-material/Business';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { selectOrganizationProfile } from '../../redux/slices/organizationSlice';

const InfoRow = ({ label, children, isLast = false }) => (
    <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', gap: 2, py: 1.5, alignItems: 'flex-start' }}>
            <Typography
                sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#000',
                    width: '140px',
                    flexShrink: 0,
                }}
            >
                {label}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flexGrow: 1 }}>
                {children}
            </Box>
        </Box>
        {!isLast && <Divider sx={{ borderColor: '#f0f0f0' }} />}
    </Box>
);

const LocationCard = ({ index, location }) => (
    <Paper
        elevation={0}
        sx={{
            p: 2,
            borderRadius: '15px',
            border: '1px solid rgba(0,0,0,0.1)',
            width: '297.5px',
            backgroundColor: '#fff',
        }}
    >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography
                sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#000',
                    mb: 0.5,
                }}
            >
                Location {index}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 17, height: 17, borderRadius: '50%', backgroundColor: '#eee', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {location?.countryFlag ? (
                        <img src={location.countryFlag} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Box sx={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                    )}
                </Box>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                    {location?.country || "United States"}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                    <BusinessIcon sx={{ fontSize: '17px', color: 'rgba(0,0,0,0.5)' }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                        {location?.state || "California"}
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MailOutlineIcon sx={{ fontSize: '17px', color: 'rgba(0,0,0,0.5)' }} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                    {location?.email || "info@campusname.com"}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneInTalkIcon sx={{ fontSize: '17px', color: 'rgba(0,0,0,0.5)' }} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                    {location?.mobile || "+1 000 0000 000"}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsAppIcon sx={{ fontSize: '17px', color: 'rgba(0,0,0,0.5)' }} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
                    {location?.mobile || "+1 000 0000 000"}
                </Typography>
            </Box>
        </Box>
    </Paper>
);

const ESPInfoPanel = ({ profile: profileProp }) => {
    const profileFromRedux = useSelector(selectOrganizationProfile);
    const orgProfile = profileProp ?? profileFromRedux;

    const specializations = orgProfile?.specializations || [
        'Careers Advice',
        'Study Abroad',
        'Admissions Counselling',
        'Visa guidance',
        'Student Accommodation',
        'Test preparation',
        'Mentoring',
        'Tutoring',
    ];

    const socialLinks = orgProfile?.socialLinks || {};

    const socialIconsMap = [
        { key: 'facebook', icon: FacebookIcon, link: socialLinks.facebook },
        { key: 'instagram', icon: InstagramIcon, link: socialLinks.instagram },
        { key: 'tiktok', icon: TikTokIcon, link: socialLinks.tiktok },
        { key: 'linkedin', icon: LinkedinIcon, link: socialLinks.linkedIn },
        { key: 'youtube', icon: YoutubeIcon, link: socialLinks.youtube },
        { key: 'telegram', icon: TelegramIcon, link: socialLinks.telegram },
        { key: 'twitter', icon: TwitterIcon, link: socialLinks.twitter },
    ].filter(item => item.link);

    const languages = orgProfile?.languages || ['English', 'Spanish', 'Hindi'];
    const hashtags = orgProfile?.tags || ['#Biju’sEducation', '#Bijutag2', '#Bijutag3'];
    const locations = orgProfile?.locations || [];

    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                p: '30px',
                borderRadius: '0 0 20px 20px',
                width: '100%',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
            }}
        >
            <Grid container spacing={4}>
                {/* Description Section */}
                <Grid item xs={12}>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 600,
                            fontSize: '16px',
                            color: '#000',
                            mb: 1,
                        }}
                    >
                        Description
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: fonts.sans,
                            fontWeight: 400,
                            fontSize: '16px',
                            color: '#545454',
                            lineHeight: '25px',
                        }}
                    >
                        {orgProfile?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."}
                    </Typography>
                </Grid>

                {/* Info List Section */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Divider sx={{ borderColor: '#f0f0f0' }} />

                        <InfoRow label="Specializations">
                            {specializations.map((spec) => (
                                <Chip
                                    key={spec}
                                    label={spec}
                                    sx={{
                                        backgroundColor: 'rgba(188, 40, 118, 0.1)',
                                        color: '#BC2876',
                                        fontFamily: fonts.sans,
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        borderRadius: '90px',
                                        height: '31px',
                                        '& .MuiChip-label': { px: 1.5 },
                                    }}
                                />
                            ))}
                        </InfoRow>

                        <InfoRow label="Hashtags">
                            {hashtags.map((tag) => (
                                <Typography key={tag} sx={{ fontFamily: fonts.sans, color: '#545454', fontSize: '16px' }}>
                                    {tag.startsWith('#') ? tag : `#${tag}`}
                                </Typography>
                            ))}
                        </InfoRow>

                        <InfoRow label="Languages">
                            {languages.map((lang) => (
                                <Typography key={lang} sx={{ fontFamily: fonts.sans, color: '#545454', fontSize: '16px' }}>
                                    {lang}
                                </Typography>
                            ))}
                        </InfoRow>

                        <InfoRow label="Follow on">
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                {socialIconsMap.length > 0 ? socialIconsMap.map((item) => (
                                    <Box
                                        key={item.key}
                                        component="img"
                                        src={item.icon}
                                        onClick={() => window.open(item.link, '_blank')}
                                        sx={{ width: 25, height: 25, cursor: 'pointer' }}
                                    />
                                )) : (
                                    <Typography sx={{ fontFamily: fonts.sans, color: 'rgba(0,0,0,0.5)', fontSize: '14px' }}>
                                        No social links available
                                    </Typography>
                                )}
                            </Box>
                        </InfoRow>

                        <InfoRow label="Website">
                            <Typography
                                component="a"
                                href={orgProfile?.website || "https://www.google.com/"}
                                target="_blank"
                                sx={{
                                    fontFamily: fonts.sans,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    color: '#BC2876',
                                    textDecoration: 'none',
                                }}
                            >
                                {orgProfile?.website || "https://www.google.com/"}
                            </Typography>
                        </InfoRow>

                        <InfoRow label="Email ID" isLast>
                            <Typography
                                component="a"
                                href={`mailto:${orgProfile?.contactEmail || "info.institutename@gmail.com"}`}
                                sx={{
                                    fontFamily: fonts.sans,
                                    fontWeight: 500,
                                    fontSize: '16px',
                                    color: '#BC2876',
                                    textDecoration: 'none',
                                }}
                            >
                                {orgProfile?.contactEmail || "info.institutename@gmail.com"}
                            </Typography>
                        </InfoRow>
                    </Box>
                </Grid>

                {/* Locations Grid Section – only show when ESP has locations */}
                {locations.length > 0 && (
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mt: 2 }}>
                            {locations.map((loc, idx) => (
                                <LocationCard key={idx} index={idx + 1} location={loc} />
                            ))}
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ESPInfoPanel;
