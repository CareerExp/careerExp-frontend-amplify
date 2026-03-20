import React from "react";
import { Box, Typography, Paper, Button, IconButton } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { fonts } from "../../utility/fonts";
import ESPSlider from "./ESPSlider";
import { announcementData } from "../../utility/announcementData";

const AnnouncementCard = ({ data }) => (
  <Paper
    elevation={0}
    sx={{
      p: "10px",
      borderRadius: "15px",
      width: "297.5px",
      backgroundColor: "#fff",
      boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    {/* Image Placeholder */}
    <Box
      sx={{
        height: "181px",
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: "8px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {data.badgeText && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            color: "#fff",
            p: 1,
            px: 1.5,
            borderTopRightRadius: "8px",
            maxWidth: "85%",
          }}
        >
          <Typography
            sx={{ fontSize: "12px", fontWeight: 500, fontFamily: fonts.sans }}
          >
            {data.badgeText.includes("Scholarship") ? (
              <>
                <span style={{ color: "#fff" }}>New </span>
                <span style={{ color: "#FF8A00", fontWeight: 700 }}>
                  {data.badgeText}
                </span>
              </>
            ) : (
              data.badgeText
            )}
          </Typography>
        </Box>
      )}
    </Box>

    {/* Metadata (Date & Actions) */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <CalendarTodayIcon sx={{ fontSize: "18px", color: "#666" }} />
        <Typography
          sx={{ fontSize: "14px", fontFamily: fonts.sans, color: "#000" }}
        >
          {data.date}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <IconButton
          size="small"
          sx={{
            border: "1px solid #eee",
            backgroundColor: "rgba(255,255,255,0.3)",
            backdropFilter: "blur(14px)",
          }}
        >
          <ShareIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        {/* <IconButton 
          size="small" 
          sx={{ 
            border: '1px solid #eee', 
            backgroundColor: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(14px)'
          }}
        >
          <BookmarkBorderIcon sx={{ fontSize: '16px' }} />
        </IconButton> */}
      </Box>
    </Box>

    {/* Content */}
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "16px",
          color: "#000",
          lineHeight: "20px",
          mb: 0.5,
          height: "40px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {data.title}
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 400,
          fontSize: "14px",
          color: "#545454",
          height: "42px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {data.subtitle}
      </Typography>
    </Box>

    {/* Footer Actions */}
    <Box sx={{ display: "flex", gap: 1 }}>
      {data.mode && (
        <Box
          sx={{
            flexShrink: 0,
            width: "100px",
            height: "41px",
            borderRadius: "90px",
            backgroundColor: "#FF8A00",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          {data.mode}
        </Box>
      )}
      <Button
        fullWidth
        variant="contained"
        sx={{
          height: "41px",
          backgroundColor: "#BC2876",
          borderRadius: "90px",
          textTransform: "none",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "14px",
          "&:hover": { backgroundColor: "#a32366" },
        }}
      >
        {data.ctaText}
      </Button>
    </Box>
  </Paper>
);

const ESPAnnouncements = () => {
  return (
    <ESPSlider title="Announcements and Events">
      {announcementData.map((item) => (
        <AnnouncementCard key={item.id} data={item} />
      ))}
    </ESPSlider>
  );
};

export default ESPAnnouncements;
