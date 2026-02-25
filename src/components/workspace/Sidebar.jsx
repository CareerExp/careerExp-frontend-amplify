import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CampaignIcon from "@mui/icons-material/Campaign";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import MessageIcon from "@mui/icons-material/Message";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PaymentsIcon from "@mui/icons-material/Payments";
import PsychologyIcon from "@mui/icons-material/Psychology";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import ShareIcon from "@mui/icons-material/Share";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";
import QRCodeDialog from "./QRCodeDialog.jsx";

const GREEN_BUTTON_GRADIENT = "linear-gradient(to bottom, #4caf50, #2e7d32)";

const Sidebar = ({
  userRole,
  handleMenuItemClick,
  currentPage,
  organizationType,
  isActingAsAME,
  showQrButton,
  qrProfileUrl,
  qrDisplayName,
  qrProfileTypeLabel,
}) => {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  let sideBarMenues = [];
  switch (userRole) {
    case "user":
      sideBarMenues = [
        { name: "Dashboard", icon: <DashboardIcon />, route: "/dashboard" },
        { name: "My Likes", icon: <FavoriteIcon />, route: "/mylikes" },
        { name: "My Playlist", icon: <QueueMusicIcon />, route: "/myplaylist" },
        {
          name: "My Assessments",
          icon: <AssessmentIcon />,
          route: "/myassessments",
        },
        {
          name: "My Resume",
          icon: <ContactPageIcon />,
          route: "/myresume",
        },
        // { name: "History", icon: <HistoryIcon />, route: "/history" },
        {
          name: "Career Planning",
          icon: <OutlinedFlagIcon />,
          route: "/careerplanning",
        },
        { name: "My Messages", icon: <MessageIcon />, route: "/messages" },
        { name: "Profile", icon: <SettingsIcon />, route: "/profile" },
      ];
      break;
    case "admin":
      sideBarMenues = [
        {
          name: "Dashboard",
          icon: <DashboardIcon />,
          route: "/admindashboard",
        },
        { name: "Users", icon: <PeopleAltIcon />, route: "/users" },
        { name: "Counsellors", icon: <PsychologyIcon />, route: "/creator" },
        {
          name: "ESP & EI User",
          icon: <BusinessCenterIcon />,
          route: "/esp-ei-users",
        },
        {
          name: "Government Organizations",
          icon: <AccountBalanceIcon />,
          route: "/government-organizations",
        },
        {
          name: "Admin managed ESPs",
          icon: <AdminPanelSettingsIcon />,
          route: "/admin-managed-esps",
        },
        { name: "Records", icon: <AssessmentIcon />, route: "/records" },
        {
          name: "School Directory",
          icon: <SchoolIcon />,
          route: "/schoolcontactinfo",
        },
        { name: "Payments", icon: <PaymentsIcon />, route: "/payments" },
        { name: "Profile", icon: <SettingsIcon />, route: "/profile" },
      ];
      break;
    case "creator":
      sideBarMenues = [
        {
          name: "Dashboard",
          icon: <DashboardIcon />,
          route: "/creatordashboard",
        },
        { name: "My Content", icon: <VideoLibraryIcon />, route: "/mycontent" },
        { name: "Analytics", icon: <AssessmentIcon />, route: "/analytics" },
        { name: "Social Media", icon: <ShareIcon />, route: "/socialmedia" },
        {
          name: "My Followers",
          icon: <PersonAddIcon />,
          route: "/myfollowers",
        },
        {
          name: "My Company",
          icon: <BusinessCenterIcon />,
          route: "/mycompany",
        },
        { name: "My Messages", icon: <MessageIcon />, route: "/messages" },
        { name: "Profile", icon: <SettingsIcon />, route: "/profile" },
      ];
      break;
    case "organization":
      if (organizationType === "ESP") {
        sideBarMenues = [
          {
            name: "Dashboard",
            icon: <DashboardIcon />,
            route: "/organizationdashboard",
          },
          { name: "About Us", icon: <InfoIcon />, route: "/aboutus" },
          {
            name: "My Counsellors",
            icon: <PsychologyIcon />,
            route: "/mycounsellors",
          },
          {
            name: "My Announcements",
            icon: <CampaignIcon />,
            route: "/myannouncements",
          },
          { name: "My Events", icon: <EventIcon />, route: "/myevents" },
          {
            name: "My Services",
            icon: <BusinessCenterIcon />,
            route: "/myservices",
          },
          ...(isActingAsAME
            ? [
                {
                  name: "My Courses",
                  icon: <MenuBookIcon />,
                  route: "/mycourses",
                },
              ]
            : []),
          { name: "My Messages", icon: <MessageIcon />, route: "/messages" },
          {
            name: "My Followers",
            icon: <PersonAddIcon />,
            route: "/myfollowers",
          },
          { name: "Profile", icon: <SettingsIcon />, route: "/profile" },
        ];
      }
      if (organizationType === "HEI") {
        sideBarMenues = [
          {
            name: "Dashboard",
            icon: <DashboardIcon />,
            route: "/organizationdashboard",
          },
          { name: "About Us", icon: <InfoIcon />, route: "/aboutus" },
          {
            name: "My Counsellors",
            icon: <PsychologyIcon />,
            route: "/mycounsellors",
          },
          {
            name: "My Announcements",
            icon: <CampaignIcon />,
            route: "/myannouncements",
          },
          { name: "My Events", icon: <EventIcon />, route: "/myevents" },
          {
            name: "My Services",
            icon: <BusinessCenterIcon />,
            route: "/myservices",
          },
          { name: "My Messages", icon: <MessageIcon />, route: "/messages" },
          {
            name: "My Followers",
            icon: <PersonAddIcon />,
            route: "/myfollowers",
          },
          { name: "Profile", icon: <SettingsIcon />, route: "/profile" },
        ];
      }
      break;
    default:
      sideBarMenues = [];
  }

  const handleLogout = () => {
    try {
      dispatchToRedux(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "85vh",
        justifyContent: "space-between",
        border: "none",
      }}
    >
      <List>
        {sideBarMenues.map((menuItem, index) => (
          <ListItem
            key={index}
            sx={{
              cursor: "pointer",
              mt: "-0.5rem",
              padding: "0.5rem 0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            <ListItemButton
              onClick={() => handleMenuItemClick(menuItem.name)}
              sx={{
                background:
                  currentPage === menuItem.name
                    ? "linear-gradient(to top left, #720361, #BF2F75);"
                    : "",
                borderRadius: 1,
              }}
            >
              <ListItemIcon
                sx={{
                  // color: "#899499",
                  color: currentPage === menuItem.name ? "white" : "",
                }}
              >
                {menuItem.icon}
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontFamily: fonts.sans,
                  fontWeight: "600",
                  // color: "#717f8c",
                  fontSize: "0.9rem",
                  color: currentPage === menuItem.name ? "white" : "",
                }}
                primary={menuItem.name}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box>
        {showQrButton && qrProfileUrl && (
          <button
            type="button"
            onClick={() => setQrDialogOpen(true)}
            style={{
              width: "263px",
              minHeight: "45px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#FFFFFF",
              margin: "0.5rem",
              border: "none",
              background: GREEN_BUTTON_GRADIENT,
              boxShadow: "0 2px 8px rgba(46, 125, 50, 0.3)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              padding: "12px 16px",
              fontFamily: fonts.sans,
            }}
          >
            <QrCode2Icon sx={{ fontSize: 20, color: "white" }} />
            Download QR Code
          </button>
        )}
        <button
          onClick={() => {
            navigate("/explore");
          }}
          style={{
            width: "263px",
            height: "45px",
            borderRadius: "11px",
            fontSize: "14px",
            color: "#777777",
            margin: ".5rem",
            border: "1px solid #00000033",
            backgroundColor: "#FFFFFF",
            boxShadow: "2px 2px 10px #a9a9a977",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          To Continue Exploring Click Here
        </button>
        <button
          onClick={handleLogout}
          style={{
            width: "263px",
            height: "45px",
            borderRadius: "11px",
            fontSize: "1rem",
            color: "#777777",
            margin: ".5rem",
            border: "1px solid #00000033",
            backgroundColor: "#FFFFFF",
            boxShadow: "2px 2px 10px #a9a9a977",
            cursor: "pointer",
            display: "flex", // Use flexbox
            justifyContent: "center", // Center items horizontally
            alignItems: "center", // Center items vertically
            gap: "8px", // Space between the icon and text
          }}
        >
          <LogoutIcon style={{ color: "red" }} />
          Logout
        </button>
      </Box>
      <QRCodeDialog
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
        profileUrl={qrProfileUrl}
        displayName={qrDisplayName}
        profileTypeLabel={qrProfileTypeLabel}
      />
    </Box>
  );
};

export default Sidebar;
