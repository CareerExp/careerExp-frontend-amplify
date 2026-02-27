import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, Button, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { notify } from "../redux/slices/alertSlice.js";
import {
  getAnnouncementById,
  increaseAnnouncementSharesCount,
  registerAnnouncementCta,
} from "../redux/slices/announcementSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { formatArticleDetailDate } from "../utility/convertTimeToUTC.js";
import { fonts } from "../utility/fonts.js";
import { colors } from "../utility/color.js";
import { announcementsPlaceholder } from "../assets/assest.js";
import InitialLoaders from "../loaders/InitialLoaders.jsx";

const AnnouncementDetailContent = ({ announcementId, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectAuthenticated);
  const [announcement, setAnnouncement] = useState(null);
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  /** Organization home URL from details (slug + organizationType). Backend may expose slug/organizationType on organizationDetails. */
function getOrgHomeUrl(org) {
  if (!org?.slug || !org?.organizationType) return null;
  return org.organizationType === "HEI" ? `/org-hei/${org.slug}` : `/org-esp/${org.slug}`;
}

const imageUrl =
    announcement?.coverImage ||
    announcement?.banner ||
    announcement?.image ||
    announcementsPlaceholder;
  const overlayTitle = announcement?.overlayTitle || announcement?.title || "";
  const liveEndDate = announcement?.liveEndDate;

  useEffect(() => {
    const fetchDetail = async () => {
      if (!announcementId) return;
      try {
        setLoading(true);
        const payload = isAuthenticated && token ? { id: announcementId, token } : announcementId;
        const res = await dispatch(getAnnouncementById(payload)).unwrap();
        if (res?.data) setAnnouncement(res.data);
        else setAnnouncement(null);
        if (res?.organizationDetails != null) setOrganizationDetails(res.organizationDetails);
        else setOrganizationDetails(null);
      } catch (e) {
        dispatch(notify({ type: "error", message: "Announcement not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [announcementId, dispatch, onBack, isAuthenticated, token]);

  const handleShare = () => {
    const url = window.location.origin + `/explore/announcement/${announcementId}`;
    if (navigator.share) {
      navigator
        .share({ title: announcement?.title, url })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      dispatch(notify({ type: "success", message: "Link copied" }));
    }
    if (announcementId) {
      dispatch(
        increaseAnnouncementSharesCount({
          announcementId,
          userId: isAuthenticated ? userId : undefined,
        }),
      ).catch(() => {});
    }
  };

  const handleEnquire = async () => {
    if (!isAuthenticated || !token) {
      dispatch(notify({ type: "warning", message: "Please log in to enquire" }));
      return;
    }
    if (!announcementId || announcement?.userHasRespondedToCta) return;
    try {
      await dispatch(
        registerAnnouncementCta({
          id: announcementId,
          actionType: "CLICK",
          token,
        })
      ).unwrap();
      dispatch(notify({ type: "success", message: "Enquiry recorded successfully." }));
      const res = await dispatch(getAnnouncementById({ id: announcementId, token })).unwrap();
      if (res?.data) setAnnouncement(res.data);
    } catch (err) {
      dispatch(notify({ type: "error", message: err?.message || "Could not record response." }));
    }
  };

  const hasResponded = Boolean(announcement?.userHasRespondedToCta);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "9rem",
        }}
      >
        <InitialLoaders />
      </Box>
    );
  }

  if (!announcement) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        marginTop: "8.5rem",
        pb: 4,
        pt: 2,
        boxSizing: "border-box",
        marginLeft: "5rem",
        marginRight: "5rem",
        "@media (max-width: 480px)": {
          marginLeft: "1rem",
          marginRight: "1rem",
        },
      }}
    >
      {/* Back link */}
      <Typography
        component="button"
        onClick={onBack}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          fontFamily: fonts.sans,
          fontSize: "16px",
          fontWeight: 600,
          color: "#BC2876",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          mb: 2,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
        Back to Announcements
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          marginTop: "1rem",
        }}
      >
        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "2px 2px 10px #a7a7a764",
              border: "1px solid #eeeeee",
              p: 3,
            }}
          >
            {/* Meta row: date + share/bookmark */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 18, color: "#BC2876" }} />
                <Typography
                  variant="body2"
                  sx={{ color: colors.darkGray, fontFamily: fonts.sans }}
                >
                  {formatArticleDetailDate(announcement.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                <IconButton onClick={handleShare} size="small" sx={{ color: "#720361" }} aria-label="Share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "#720361" }}
                  aria-label="Bookmark"
                  onClick={() => setBookmarked((b) => !b)}
                >
                  <BookmarkBorderIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Title */}
            <Typography
              variant="h1"
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: { xs: "1.35rem", sm: "1.6rem" },
                color: colors.darkGray,
                mb: 2,
                lineHeight: 1.3,
              }}
            >
              {announcement.title}
            </Typography>

            {/* Cover image with overlay */}
            <Box
              sx={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                mb: 3,
                position: "relative",
                backgroundColor: "#e8e8e8",
                minHeight: 320,
              }}
            >
              <img
                src={imageUrl}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 320,
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
              {/* <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                  padding: 3,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    color: "#fff",
                    fontWeight: 500,
                  }}
                >
                  {overlayTitle}
                </Typography>
              </Box> */}
            </Box>

            {/* Description (HTML or plain) */}
            {announcement.description && (
              <Box
                className="announcement-description"
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "1rem",
                  marginTop: "2rem",
                  lineHeight: 1.7,
                  color: colors.darkGray,
                  "& p": { mb: 1.5 },
                  "& h2, & h3": { fontFamily: fonts.sans, fontWeight: 600, mt: 2, mb: 1 },
                  "& ul, & ol": { pl: 2.5, mb: 1.5 },
                  "& a": { color: "#720361", textDecoration: "underline" },
                }}
                dangerouslySetInnerHTML={{ __html: announcement.description }}
              />
            )}

            {/* Application deadline callout (liveEndDate) */}
            {liveEndDate && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: "rgba(188, 40, 118, 0.08)",
                  border: "1px solid rgba(188, 40, 118, 0.2)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: colors.darkGray,
                    mb: 0.5,
                  }}
                >
                  Application Deadline: {formatArticleDetailDate(liveEndDate)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "0.9375rem",
                    color: colors.midGray,
                  }}
                >
                  Don&apos;t miss this incredible opportunity to pursue your goals with substantial support!
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: "100%", md: 340 },
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignSelf: { md: "flex-start" },
          }}
        >
          {/* Interested in this program? */}
          <Box
            sx={{
              border: "1px solid #eeeeee",
              backgroundColor: "#f9f9f9",
              borderRadius: "12px",
              boxShadow: "2px 2px 10px #a7a7a764",
              p: 2.5,
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "1.125rem",
                color: colors.darkGray,
                mb: 1.5,
              }}
            >
              Interested in this program?
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "0.9375rem",
                color: colors.midGray,
                lineHeight: 1.55,
                mb: 2,
              }}
            >
              Get in touch with our admissions team to learn more about the opportunities and application requirements.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              disabled={hasResponded}
              onClick={handleEnquire}
              sx={{
                background: "linear-gradient(to top left, #720361, #bf2f75)",
                textTransform: "capitalize",
                borderRadius: "10px",
                py: 1.25,
                fontFamily: fonts.sans,
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(to top left, #720361, #bf2f75)",
                  opacity: 0.92,
                },
              }}
            >
              {hasResponded ? "Registered" : "Enquire Now"}
            </Button>
          </Box>

          {/* Institution Details (from organizationDetails) */}
          {organizationDetails && (
            <Box
              sx={{
                border: "1px solid #eeeeee",
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                boxShadow: "2px 2px 10px #a7a7a764",
                p: 2.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "1.125rem",
                  color: colors.darkGray,
                  mb: 2,
                }}
              >
                Institution Details
              </Typography>
              {organizationDetails.logo ? (
                <Box
                  component="img"
                  src={organizationDetails.logo}
                  alt=""
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "10px",
                    objectFit: "cover",
                    mb: 1.5,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "120px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(188, 40, 118, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: 700,
                      fontSize: "2rem",
                      color: "#720361",
                    }}
                  >
                    {(organizationDetails.organizationName || "UMS")
                      .split(/\s+/)
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 3)
                      .toUpperCase()}
                  </Typography>
                </Box>
              )}
              {getOrgHomeUrl(organizationDetails) ? (
                <Typography
                  component={Link}
                  to={getOrgHomeUrl(organizationDetails)}
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#BC2876",
                    mb: 2,
                    textDecoration: "none",
                    display: "inline-block",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {organizationDetails.organizationName}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "#BC2876",
                    mb: 2,
                  }}
                >
                  {organizationDetails.organizationName}
                </Typography>
              )}
              {organizationDetails.address && (
                <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "flex-start" }}>
                  <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#720361", mt: 0.25 }} />
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: colors.midGray }}>
                    {organizationDetails.address}
                  </Typography>
                </Box>
              )}
              {(organizationDetails.contactEmail || announcement?.organizationUserId?.email) && (
                <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                  <EmailOutlinedIcon sx={{ fontSize: 20, color: "#720361" }} />
                  <Typography
                    component="a"
                    href={`mailto:${organizationDetails.contactEmail || announcement?.organizationUserId?.email}`}
                    sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#720361", textDecoration: "none" }}
                  >
                    {organizationDetails.contactEmail || announcement?.organizationUserId?.email}
                  </Typography>
                </Box>
              )}
              {organizationDetails.website && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <LanguageIcon sx={{ fontSize: 20, color: "#720361" }} />
                  <Typography
                    component="a"
                    href={organizationDetails.website.startsWith("http") ? organizationDetails.website : `https://${organizationDetails.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#720361", textDecoration: "none" }}
                  >
                    {organizationDetails.website.replace(/^https?:\/\//i, "")}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AnnouncementDetailContent;
