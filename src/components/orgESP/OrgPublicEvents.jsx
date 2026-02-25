import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import {
  getPublicEvents,
  selectOrgPublicEvents,
  selectOrgPublicEventsLoading,
} from "../../redux/slices/orgPublicSlice";
import { eventsPlaceholder } from "../../assets/assest";

export const OrgPublicEventCard = ({ event }) => {
  const navigate = useNavigate();
  const id = event?._id;
  const title = event?.title || "";
  const imageUrl = event?.coverImage || event?.image || eventsPlaceholder;
  const dateStr = event?.liveStartDate || event?.eventDate || event?.createdAt || "";
  const formattedDate = dateStr
    ? new Date(dateStr).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";
  const mode = event?.mode || event?.eventType || "";

  return (
    <Paper
      elevation={0}
      onClick={() => id && navigate(`/explore/event/${id}`)}
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
      <Box sx={{ height: "181px", width: "100%", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
        <Box component="img" src={imageUrl} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 0.5 }}>
        <Typography sx={{ fontSize: "14px", fontFamily: fonts.sans, color: "#666" }}>{formattedDate}</Typography>
        {mode && (
          <Typography
            sx={{
              fontSize: "12px",
              fontFamily: fonts.sans,
              color: "#158CFF",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {String(mode).toLowerCase()}
          </Typography>
        )}
      </Box>
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
      <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: "14px", color: "#BC2876" }}>
        View details
      </Typography>
    </Paper>
  );
};

const OrgPublicEvents = ({ identifier, idType }) => {
  const dispatch = useDispatch();
  const events = useSelector(selectOrgPublicEvents);
  const loading = useSelector(selectOrgPublicEventsLoading);

  useEffect(() => {
    if (!identifier || !idType) return;
    dispatch(getPublicEvents({ identifier, idType, limit: 12, sortBy: "recent" }));
  }, [dispatch, identifier, idType]);

  if (!identifier) return null;

  if (loading && events.length === 0) {
    return (
      <Box sx={{ my: 6, display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress sx={{ color: "#BC2876" }} />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Box sx={{ my: 6 }}>
        <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "32px", color: "#000", mb: 3 }}>
          Events
        </Typography>
        <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "#666" }}>No events yet.</Typography>
      </Box>
    );
  }

  return (
    <ESPSlider title="Events">
      {events.map((evt) => (
        <OrgPublicEventCard key={evt._id} event={evt} />
      ))}
    </ESPSlider>
  );
};

export default OrgPublicEvents;
