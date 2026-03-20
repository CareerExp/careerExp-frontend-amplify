import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import {
  getPublicAnnouncements,
  selectOrgPublicAnnouncements,
  selectOrgPublicAnnouncementsLoading,
} from "../../redux/slices/orgPublicSlice";
import { announcementsPlaceholder } from "../../assets/assest";

export const OrgPublicAnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate();
  const title = announcement?.title || "";
  const imageUrl =
    announcement?.coverImage || announcement?.banner || announcement?.image || announcementsPlaceholder;
  const dateStr = announcement?.createdAt || announcement?.liveStartDate || "";
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";
  const id = announcement?._id;

  return (
    <Paper
      elevation={0}
      onClick={() => id && navigate(`/explore/announcement/${id}`)}
      sx={{
        p: "10px",
        borderRadius: "15px",
        width: "297.5px",
        minWidth: "297.5px",
        backgroundColor: "#fff",
        boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        cursor: "pointer",
        "&:hover": { boxShadow: "0px 8px 16px rgba(0,0,0,0.12)" },
      }}
    >
      <Box
        sx={{
          height: "181px",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>
      <Typography sx={{ fontSize: "14px", fontFamily: fonts.sans, color: "#666" }}>{formattedDate}</Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "16px",
          color: "#000",
          lineHeight: "20px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "14px",
          color: "#BC2876",
        }}
      >
        View details
      </Typography>
    </Paper>
  );
};

const OrgPublicAnnouncements = ({ identifier, idType }) => {
  const dispatch = useDispatch();
  const announcements = useSelector(selectOrgPublicAnnouncements);
  const loading = useSelector(selectOrgPublicAnnouncementsLoading);

  useEffect(() => {
    if (!identifier || !idType) return;
    dispatch(getPublicAnnouncements({ identifier, idType, limit: 12, sortBy: "recent" }));
  }, [dispatch, identifier, idType]);

  if (!identifier) return null;

  if (loading && announcements.length === 0) {
    return (
      <Box sx={{ my: 6, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (announcements.length === 0) {
    return (
      <Box sx={{ my: 6 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "32px", color: "#000", mb: 3 }}>
          Announcements
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#666" }}>
          No announcements yet.
        </Typography>
      </Box>
    );
  }

  return (
    <ESPSlider title="Announcements">
      {announcements.map((ann) => (
        <OrgPublicAnnouncementCard key={ann._id} announcement={ann} />
      ))}
    </ESPSlider>
  );
};

export default OrgPublicAnnouncements;
