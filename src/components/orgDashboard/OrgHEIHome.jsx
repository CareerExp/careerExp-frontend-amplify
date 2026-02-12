import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import PsychologyIcon from "@mui/icons-material/Psychology";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import MicIcon from "@mui/icons-material/Mic";
import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import EventIcon from "@mui/icons-material/Event";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import ShareIcon from "@mui/icons-material/Share";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MouseIcon from "@mui/icons-material/Mouse";
import GroupsIcon from "@mui/icons-material/Groups";
import SendIcon from "@mui/icons-material/Send";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import { useSelector } from 'react-redux';
import { selectOrganizationProfile } from '../../redux/slices/organizationSlice';
import { fonts } from '../../utility/fonts';

const StatCard = ({ icon, value, label }) => (
  <Paper
    elevation={0}
    sx={{
      p: "13px 18px",
      borderRadius: "15px",
      display: "flex",
      alignItems: "center",
      gap: "18px",
      width: "340px",
      height: "97px",
      boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      border: "1px solid #f0f0f0",
    }}
  >
    <Box
      sx={{
        width: "71px",
        height: "71px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF8A0033",
        color: "#FF8A00",
        flexShrink: 0,
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: "32px" } })}
    </Box>
    <Box sx={{ overflow: "hidden" }}>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: "700",
          fontSize: "26px",
          color: "#000",
          lineHeight: "1.2",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: "400",
          fontSize: "16px",
          color: "#000",
          opacity: 0.6,
          lineHeight: "1.2",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </Typography>
    </Box>
  </Paper>
);

const OrgHEIHome = () => {
  const orgProfile = useSelector(selectOrganizationProfile);

  const stats = [
    { label: "No of Counsellors", value: orgProfile?.counsellorsCount || 32, icon: <PsychologyIcon /> },
    { label: "Videos uploaded", value: orgProfile?.videosCount || 32, icon: <VideoLibraryIcon /> },
    { label: "Podcasts uploaded", value: orgProfile?.podcastsCount || 32, icon: <MicIcon /> },
    { label: "Articles uploaded", value: orgProfile?.articlesCount || 32, icon: <ArticleIcon /> },
    { label: "Announcements", value: orgProfile?.announcementsCount || 32, icon: <CampaignIcon /> },
    { label: "Events advertised", value: orgProfile?.eventsCount || 32, icon: <EventIcon /> },
    { label: "Services", value: orgProfile?.servicesCount || 12, icon: <BusinessCenterIcon /> },
    { label: "Total Counsellors", value: orgProfile?.totalCounsellors || 32, icon: <PeopleAltIcon /> },
    { label: "Event CTAs received", value: orgProfile?.eventCTAs || 32, icon: <AdsClickIcon /> },
    { label: "Announcement CTAs received", value: orgProfile?.announcementCTAs || 32, icon: <TouchAppIcon /> },
    { label: "Services CTAs received", value: orgProfile?.servicesCTAs || 32, icon: <MouseIcon /> },
    { label: "Total Individual Followers", value: orgProfile?.followersCount || 32, icon: <GroupsIcon /> },
    { label: "Company page Shares", value: orgProfile?.pageShares || 32, icon: <ShareIcon /> },
    { label: "Announcement's shared", value: orgProfile?.announcementsShared || 32, icon: <ForwardToInboxIcon /> },
    { label: "Events Shared", value: orgProfile?.eventsShared || 32, icon: <SendIcon /> },
    { label: "Service's shared", value: orgProfile?.servicesShared || 12, icon: <ScreenShareIcon /> },
  ];

  return (
    <Box sx={{ p: "32px", backgroundColor: "#f9fafb", minHeight: "100%" }}>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: "700",
          fontSize: "26px",
          mb: "32px",
          color: "#000",
        }}
      >
        Dashboard
      </Typography>
      <Grid container spacing={"18px"}>
        {stats.map((stat, index) => (
          <Grid item key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OrgHEIHome;
