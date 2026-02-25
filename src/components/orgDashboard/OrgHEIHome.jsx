import React, { useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import PsychologyIcon from "@mui/icons-material/Psychology";
import CampaignIcon from "@mui/icons-material/Campaign";
import EventIcon from "@mui/icons-material/Event";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import MouseIcon from "@mui/icons-material/Mouse";
import SchoolIcon from "@mui/icons-material/School";
import { useDispatch, useSelector } from 'react-redux';
import {
  getOrganizationDashboard,
  selectOrganizationDashboard,
  selectOrganizationDashboardLoading,
  selectOrganizationProfile,
} from '../../redux/slices/organizationSlice';
import { selectToken } from '../../redux/slices/authSlice';
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
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const dashboard = useSelector(selectOrganizationDashboard);
  const dashboardLoading = useSelector(selectOrganizationDashboardLoading);
  const orgProfile = useSelector(selectOrganizationProfile);

  useEffect(() => {
    if (token) {
      dispatch(getOrganizationDashboard({ token }));
    }
  }, [dispatch, token]);

  const d = dashboard || {};
  const byStatus = (obj, key) => (obj && typeof obj[key] === 'number' ? obj[key] : 0);
  const announcementsByStatus = d.announcementsByStatus || {};
  const servicesByStatus = d.servicesByStatus || {};

  const stats = [
    { label: "No of Counsellors", value: d.totalCounsellors ?? orgProfile?.counsellorsCount ?? 0, icon: <PsychologyIcon /> },
    { label: "Announcements", value: d.totalAnnouncements ?? orgProfile?.announcementsCount ?? 0, icon: <CampaignIcon /> },
    { label: "Events", value: d.totalEvents ?? orgProfile?.eventsCount ?? 0, icon: <EventIcon /> },
    { label: "Services", value: d.totalServices ?? orgProfile?.servicesCount ?? 0, icon: <BusinessCenterIcon /> },
    { label: "Courses", value: d.totalCourses ?? 0, icon: <SchoolIcon /> },
    { label: "Total CTAs received", value: d.totalCtaResponses ?? 0, icon: <AdsClickIcon /> },
    { label: "Announcements (Live)", value: byStatus(announcementsByStatus, 'LIVE'), icon: <TouchAppIcon /> },
    { label: "Announcements (Upcoming)", value: byStatus(announcementsByStatus, 'UPCOMING'), icon: <TouchAppIcon /> },
    { label: "Announcements (Draft)", value: byStatus(announcementsByStatus, 'DRAFT'), icon: <TouchAppIcon /> },
    { label: "Services (Published)", value: byStatus(servicesByStatus, 'PUBLISHED'), icon: <MouseIcon /> },
    { label: "Upcoming events", value: d.upcomingEventsCount ?? 0, icon: <EventIcon /> },
    { label: "Total Counsellors", value: d.totalCounsellors ?? orgProfile?.totalCounsellors ?? 0, icon: <PeopleAltIcon /> },
  ];

  if (dashboardLoading && !dashboard) {
    return (
      <Box sx={{ p: "32px", backgroundColor: "#f9fafb", minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress sx={{ color: "#FF8A00" }} />
      </Box>
    );
  }

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
