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
import { Link } from "react-router-dom";
import { notify } from "../redux/slices/alertSlice.js";
import {
  getEventById,
  increaseEventSharesCount,
  registerEventCta,
} from "../redux/slices/eventSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { formatArticleDetailDate } from "../utility/convertTimeToUTC.js";
import { fonts } from "../utility/fonts.js";
import { colors } from "../utility/color.js";
import { eventsPlaceholder } from "../assets/assest.js";
import InitialLoaders from "../loaders/InitialLoaders.jsx";

const EVENT_TYPE_LABELS = {
  "in person": "In Person",
  "in_person": "In Person",
  IN_PERSON: "In Person",
  hybrid: "Hybrid",
  HYBRID: "Hybrid",
  online: "Online",
  ONLINE: "Online",
};

/** Organization home URL from details (slug + organizationType). */
function getOrgHomeUrl(org) {
  if (!org?.slug || !org?.organizationType) return null;
  return org.organizationType === "HEI" ? `/org-hei/${org.slug}` : `/org-esp/${org.slug}`;
}

const EventDetailContent = ({ eventId, onBack }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectAuthenticated);
  const [event, setEvent] = useState(null);
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const imageUrl =
    event?.coverImage ||
    event?.banner ||
    event?.image ||
    eventsPlaceholder;
  const registrationDeadline = event?.registrationDeadline;
  const rawType = (event?.eventType || event?.type || "").toString().toLowerCase().replace(/\s+/g, "_");
  const eventTypeLabel = EVENT_TYPE_LABELS[rawType] || EVENT_TYPE_LABELS[event?.eventType] || event?.eventType || event?.type || "Event";

  useEffect(() => {
    const fetchDetail = async () => {
      if (!eventId) return;
      try {
        setLoading(true);
        const payload = isAuthenticated && token ? { id: eventId, token } : eventId;
        const res = await dispatch(getEventById(payload)).unwrap();
        if (res?.data) setEvent(res.data);
        else setEvent(null);
        if (res?.organizationDetails != null) setOrganizationDetails(res.organizationDetails);
        else setOrganizationDetails(null);
      } catch (e) {
        dispatch(notify({ type: "error", message: "Event not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [eventId, dispatch, onBack, isAuthenticated, token]);

  const handleShare = () => {
    const url = window.location.origin + `/explore/event/${eventId}`;
    if (navigator.share) {
      navigator.share({ title: event?.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      dispatch(notify({ type: "success", message: "Link copied" }));
    }
    if (eventId) {
      dispatch(
        increaseEventSharesCount({
          eventId,
          userId: isAuthenticated ? userId : undefined,
        }),
      ).catch(() => {});
    }
  };

  const handleRegister = async () => {
    if (!isAuthenticated || !token) {
      dispatch(notify({ type: "warning", message: "Please log in to register" }));
      return;
    }
    if (!eventId || event?.userHasRespondedToCta) return;
    try {
      await dispatch(
        registerEventCta({
          id: eventId,
          actionType: "CLICK",
          token,
        })
      ).unwrap();
      dispatch(notify({ type: "success", message: "Response recorded successfully." }));
      const res = await dispatch(getEventById({ id: eventId, token })).unwrap();
      if (res?.data) setEvent(res.data);
    } catch (err) {
      dispatch(notify({ type: "error", message: err?.message || "Could not record response." }));
    }
  };

  const hasResponded = Boolean(event?.userHasRespondedToCta);

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

  if (!event) return null;

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
          color: "#DD4595",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          mb: 2,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
        Back to Events
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          marginTop: "1rem",
        }}
      >
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
            {/* Meta: date + share/bookmark */}
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
                <CalendarTodayIcon sx={{ fontSize: 18, color: "#DD4595" }} />
                <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
                  {formatArticleDetailDate(event.liveStartDate || event.eventDate || event.createdAt)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
                <IconButton onClick={handleShare} size="small" sx={{ color: "#DD4595" }} aria-label="Share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "#DD4595" }}
                  aria-label="Bookmark"
                  onClick={() => setBookmarked((b) => !b)}
                >
                  <BookmarkBorderIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Title + event type tag (Figma: tag to the right of title) */}
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Typography
                variant="h1"
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 700,
                  fontSize: { xs: "1.35rem", sm: "1.6rem" },
                  color: colors.darkGray,
                  lineHeight: 1.3,
                }}
              >
                {event.title}
              </Typography>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  backgroundColor: "#FFE8F3",
                  color: "#DD4595",
                  fontFamily: fonts.sans,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                {eventTypeLabel}
              </span>
            </Box>

            {/* Cover image */}
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
            </Box>

            {/* About This Event */}
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: "1.125rem",
                color: colors.darkGray,
                mb: 1.5,
              }}
            >
              About This Event
            </Typography>
            {event.description && (
              <Box
                className="event-description"
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: colors.darkGray,
                  "& p": { mb: 1.5 },
                  "& h2, & h3": { fontFamily: fonts.sans, fontWeight: 600, mt: 2, mb: 1 },
                  "& ul, & ol": { pl: 2.5, mb: 1.5 },
                  "& a": { color: "#DD4595", textDecoration: "underline" },
                }}
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}

            {/* Application / Registration deadline */}
            {registrationDeadline && (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: "12px",
                  backgroundColor: "rgba(221, 69, 149, 0.08)",
                  border: "1px solid rgba(221, 69, 149, 0.25)",
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
                  Application Deadline: {formatArticleDetailDate(registrationDeadline)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "0.9375rem",
                    color: colors.midGray,
                  }}
                >
                  Don&apos;t miss this incredible opportunity. Register before the deadline!
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
          <Box
            sx={{
              border: "1px solid #FFFFFF",
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
              Interested in this Event?
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
              Get in touch to learn more about this event and registration requirements.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              disabled={hasResponded}
              onClick={handleRegister}
              sx={{
                background: "linear-gradient(125deg, #BF2F75 -3.87%, #720361 63.8%)",
                textTransform: "capitalize",
                borderRadius: "25px",
                py: 1.25,
                fontFamily: fonts.sans,
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(125deg, #BF2F75 -3.87%, #720361 63.8%)",
                },
              }}
            >
              {hasResponded ? "Registered" : "Register Now"}
            </Button>
          </Box>


          {organizationDetails && (
            <Box
              sx={{
                // border: "1px solid #ffffff",
                backgroundColor: "#ffffff",
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
                    background: "linear-gradient(135deg, rgba(191, 47, 117, 0.06) 0%, rgba(114, 3, 97, 0.06) 100%)",
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
                  <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#FF8A00", mt: 0.25 }} />
                  <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: colors.midGray }}>
                    {organizationDetails.address}
                  </Typography>
                </Box>
              )}
              {(organizationDetails.contactEmail || event?.createdBy?.email) && (
                <Box sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}>
                  <EmailOutlinedIcon sx={{ fontSize: 20, color: "#FF8A00" }} />
                  <Typography
                    component="a"
                    href={`mailto:${organizationDetails.contactEmail || event?.createdBy?.email}`}
                    sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: colors.midGray, textDecoration: "none" }}
                  >
                    {organizationDetails.contactEmail || event?.createdBy?.email}
                  </Typography>
                </Box>
              )}
              {organizationDetails.website && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <LanguageIcon sx={{ fontSize: 20, color: "#FF8A00" }} />
                  <Typography
                    component="a"
                    href={organizationDetails.website.startsWith("http") ? organizationDetails.website : `https://${organizationDetails.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: colors.midGray, textDecoration: "none" }}
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

export default EventDetailContent;
