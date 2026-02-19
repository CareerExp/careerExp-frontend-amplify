import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Tabs,
  Tab,
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

const TabPanel = ({ value, index, children }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

const HEIDescriptionTabs = () => {
  const [tabValue, setTabValue] = useState(0);
  const orgProfile = useSelector(selectOrganizationProfile);

  const socialLinks = orgProfile?.socialLinks || {};
  const socialIconsMap = [
    { key: 'facebook', icon: FacebookIcon, link: socialLinks.facebook },
    { key: 'instagram', icon: InstagramIcon, link: socialLinks.instagram },
    { key: 'tiktok', icon: TikTokIcon, link: socialLinks.tiktok },
    { key: 'linkedin', icon: LinkedinIcon, link: socialLinks.linkedIn },
    { key: 'youtube', icon: YoutubeIcon, link: socialLinks.youtube },
    { key: 'telegram', icon: TelegramIcon, link: socialLinks.telegram },
    { key: 'twitter', icon: TwitterIcon, link: socialLinks.twitter },
  ].filter((item) => item.link);

  const languages = orgProfile?.languages || ['English', 'Spanish', 'Hindi'];
  const description = orgProfile?.description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";
  const scholarships = orgProfile?.scholarships != null ? (orgProfile.scholarships ? 'Available' : 'Not available') : 'Available';
  const ranking = orgProfile?.ranking || "Lorem Ipsum ranking information will be placed here.";
  const website = orgProfile?.website || 'https://www.google.com/';
  const contactEmail = orgProfile?.contactEmail || 'info.institutename@gmail.com';

  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '0 0 20px 20px',
        width: '100%',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        sx={{
          px: 3,
          pt: 1,
          borderBottom: '1px solid #f0f0f0',
          '& .MuiTab-root': { fontFamily: fonts.sans, fontWeight: 600, fontSize: '16px', textTransform: 'none' },
          '& .Mui-selected': { color: '#BC2876' },
          '& .MuiTabs-indicator': { backgroundColor: '#BC2876', height: 3 },
        }}
      >
        <Tab label="Description" />
        <Tab label="Campus Details" />
        <Tab label="Photo Gallery" />
      </Tabs>

      <Box sx={{ px: 3, pb: 4 }}>
        <TabPanel value={tabValue} index={0}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: '16px',
              color: '#000',
              mb: 1,
            }}
          >
            About Institute
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: '16px',
              color: '#545454',
              lineHeight: '25px',
              mb: 3,
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Divider sx={{ borderColor: '#f0f0f0' }} />
            <InfoRow label="Languages">
              {languages.map((lang) => (
                <Typography key={lang} sx={{ fontFamily: fonts.sans, color: '#545454', fontSize: '16px' }}>
                  {lang}
                </Typography>
              ))}
            </InfoRow>
            <InfoRow label="Scholarships">
              <Typography sx={{ fontFamily: fonts.sans, color: '#545454', fontSize: '16px' }}>
                {scholarships}
              </Typography>
            </InfoRow>
            <InfoRow label="Ranking">
              <Typography sx={{ fontFamily: fonts.sans, color: '#545454', fontSize: '16px' }}>
                {ranking}
              </Typography>
            </InfoRow>
            <InfoRow label="Follow on">
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                {socialIconsMap.length > 0 ? (
                  socialIconsMap.map((item) => (
                    <Box
                      key={item.key}
                      component="img"
                      src={item.icon}
                      onClick={() => window.open(item.link, '_blank')}
                      sx={{ width: 25, height: 25, cursor: 'pointer' }}
                      alt=""
                    />
                  ))
                ) : (
                  <Typography sx={{ fontFamily: fonts.sans, color: 'rgba(0,0,0,0.5)', fontSize: '14px' }}>
                    No social links available
                  </Typography>
                )}
              </Box>
            </InfoRow>
            <InfoRow label="Website">
              <Typography
                component="a"
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#BC2876',
                  textDecoration: 'none',
                }}
              >
                {website}
              </Typography>
            </InfoRow>
            <InfoRow label="Email ID" isLast>
              <Typography
                component="a"
                href={`mailto:${contactEmail}`}
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#BC2876',
                  textDecoration: 'none',
                }}
              >
                {contactEmail}
              </Typography>
            </InfoRow>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: '16px',
              color: '#545454',
              lineHeight: '25px',
            }}
          >
            Campus details content will be displayed here. You can add address, facilities, campus map, or other relevant information.
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 2,
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  aspectRatio: '4/3',
                  borderRadius: '12px',
                  backgroundColor: '#f0f0f0',
                  overflow: 'hidden',
                }}
              />
            ))}
          </Box>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: '14px',
              color: 'rgba(0,0,0,0.5)',
              mt: 2,
            }}
          >
            Photo gallery placeholder. Integrate with media when available.
          </Typography>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default HEIDescriptionTabs;
