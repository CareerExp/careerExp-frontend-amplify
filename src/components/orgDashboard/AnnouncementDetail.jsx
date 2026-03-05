import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Grid,
  Avatar,
  Divider,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";
import { fonts } from "../../utility/fonts";
import { notify } from "../../redux/slices/alertSlice";

const AnnouncementDetail = ({ announcement, onBack, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  if (!announcement) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const ctaResponses = announcement.ctaResponses || [];

  const shareUrl =
    typeof window !== "undefined" && announcement._id
      ? `${window.location.origin}/explore/announcement/${announcement._id}`
      : "";

  useEffect(() => {
    if (!announcement) return;
    const prevTitle = document.title;
    document.title = `${announcement.title || "Announcement"} | Career Explorer`;
    const url =
      shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    const description = (announcement.description || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    let image = announcement.coverImage || announcement.image || "";
    if (image && typeof window !== "undefined" && !image.startsWith("http")) {
      image = image.startsWith("/")
        ? window.location.origin + image
        : `${window.location.origin}/${image}`;
    }

    const setMeta = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content || "");
    };
    const setMetaName = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content || "");
    };

    setMeta("og:title", announcement.title || "Announcement");
    setMeta("og:description", description);
    setMeta("og:image", image);
    setMeta("og:url", url);
    setMeta("og:type", "website");
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", announcement.title || "Announcement");
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", image);

    return () => {
      document.title = prevTitle;
    };
  }, [announcement, shareUrl]);

  const handleShare = async () => {
    const title = announcement.title || "Announcement";
    const text = (announcement.description || "")
      .replace(/<[^>]*>/g, " ")
      .trim()
      .slice(0, 100);
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: text ? `${text}...` : title,
          url: shareUrl,
        });
        dispatch(notify({ message: "Link shared!", type: "success" }));
      } else {
        await navigator.clipboard.writeText(shareUrl);
        dispatch(
          notify({ message: "Link copied to clipboard", type: "success" }),
        );
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(shareUrl);
          dispatch(
            notify({ message: "Link copied to clipboard", type: "success" }),
          );
        } catch {
          dispatch(
            notify({ message: "Could not share or copy link", type: "error" }),
          );
        }
      }
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} sx={{ p: 0 }}>
            <Box
              sx={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                border: "1px solid #EAECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
              }}
            >
              <ArrowBackIcon sx={{ color: "#000" }} />
            </Box>
          </IconButton>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "26px",
              color: "#000",
            }}
          >
            Announcement Detail
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={() => onDelete(announcement)}
            sx={{
              height: "48px",
              px: 3,
              borderRadius: "90px",
              border: "1px solid #D0D5DD",
              color: "#344054",
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              backgroundColor: "#fff",
              "&:hover": { backgroundColor: "#F9FAFB" },
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => onEdit(announcement)}
            variant="contained"
            sx={{
              height: "48px",
              px: 3,
              borderRadius: "90px",
              background:
                "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
              color: "#fff",
              textTransform: "none",
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "16px",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Edit Announcement
          </Button>
        </Box>
      </Box>

      {/* Main Content Card */}
      <Paper
        elevation={0}
        sx={{
          p: "30px",
          borderRadius: "15px",
          backgroundColor: "#fff",
          boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
          mb: 4,
        }}
      >
        {/* Date Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <CalendarTodayIcon sx={{ color: "#545454", fontSize: "20px" }} />
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: "14px",
                color: "#545454",
              }}
            >
              {formatDate(announcement.createdAt)}
            </Typography>
          </Box>
          <Tooltip title="Share">
            <IconButton
              onClick={handleShare}
              aria-label="Share announcement"
              sx={{
                color: "#545454",
                "&:hover": {
                  color: "#BC2876",
                  backgroundColor: "rgba(188, 40, 118, 0.08)",
                },
              }}
            >
              <ShareIcon sx={{ fontSize: "22px" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "32px",
            color: "#000",
            mb: 4,
            lineHeight: 1.2,
          }}
        >
          {announcement.title}
        </Typography>

        {/* Banner with Overlay */}
        <Box
          sx={{
            width: "100%",
            height: "400px",
            borderRadius: "8px",
            overflow: "hidden",
            position: "relative",
            mb: 4,
            backgroundColor: "#f2f2f2",
          }}
        >
          <Box
            component="img"
            src={announcement.coverImage || announcement.image}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Overlay Text */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              backdropFilter: "blur(3.5px)",
              backgroundColor: "rgba(0, 0, 0, 0.58)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              p: "20px",
              borderBottomLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: "24px",
                color: "#fff",
                letterSpacing: "-0.48px",
                lineHeight: "30px",
              }}
            >
              {announcement.title}
            </Typography>
          </Box>
        </Box>

        {/* Description and Info Section */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: "16px",
              color: "#545454",
              lineHeight: "28px",
              whiteSpace: "pre-wrap",
            }}
          >
            {announcement.description}
          </Typography>

          {/* Deadline Highlight Box */}
          <Box
            sx={{
              backgroundColor: "rgba(191, 47, 117, 0.1)",
              borderLeft: "4px solid #bc2876",
              borderRadius: "10px",
              px: 3,
              py: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "16px",
                color: "#bc2876",
              }}
            >
              Application Deadline: {formatDate(announcement.liveStartDate)}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 400,
                fontSize: "14px",
                color: "#101010",
              }}
            >
              Don't miss this incredible opportunity to pursue your education
              with substantial financial support!
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* CTAs Received Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "20px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 20px 0px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "24px",
            color: "#000",
            mb: 3,
          }}
        >
          CTAs received
        </Typography>

        {ctaResponses.length > 0 ? (
          <Grid container spacing={2.5}>
            {ctaResponses.map((resp) => {
              const user = resp.userId || {};
              const displayName =
                [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                "Unknown";
              return (
                <Grid item key={resp._id} xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      backgroundColor: "#f4f7fe",
                      borderRadius: "12px",
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={user.profilePicture}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#e5e7eb",
                      }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#000",
                        }}
                      >
                        {displayName}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontWeight: 400,
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {formatDate(resp.respondedAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "16px",
              color: "#667085",
              py: 2,
            }}
          >
            No responses received yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AnnouncementDetail;
