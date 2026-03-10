import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Rating,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import { fonts } from "../utility/fonts.js";
import { getExploreCourseById, increaseCourseViewsCount } from "../redux/slices/exploreSlice.js";
import { notify } from "../redux/slices/alertSlice.js";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import { selectAuthenticated, selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { getCourseLikeStatus, toggleCourseLike } from "../redux/slices/likeSlice.js";
import { getCourseRatingStatus, rateCourse } from "../redux/slices/ratingSlice.js";
import {
  getBookmarkedCourses,
  addCourseBookmark,
  removeCourseBookmark,
  selectBookmarkedCourses,
} from "../redux/slices/bookmarkSlice.js";
import NewMessagePanel from "./messages/NewMessagePanel.jsx";
import SharingVideoModal from "../models/SharingVideoModal.jsx";

const ACCENT = "#BC2876";
const ACCENT_PURPLE = "#720361";

const deliveryModeLabel = (mode) => {
  if (!mode) return "Online";
  const m = String(mode).toUpperCase();
  if (m === "ONLINE") return "Online";
  if (m === "OFFLINE") return "In person";
  if (m === "HYBRID") return "Hybrid";
  return mode;
};

const deliveryModeTagStyle = (mode) => {
  const m = String(mode || "").toUpperCase();
  if (m === "ONLINE") return { bg: "#E8F5E9", textColor: "#2E7D32" };
  if (m === "OFFLINE" || m === "IN_PERSON") return { bg: "#fff", textColor: ACCENT, border: `1px solid ${ACCENT}` };
  if (m === "HYBRID") return { bg: "#FFF3E0", textColor: "#E65100" };
  return { bg: "#f5f5f5", textColor: "#717171" };
};

const CourseDetailContent = ({ courseId, onBack }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const isAuthenticated = useSelector(selectAuthenticated);

  const [course, setCourse] = useState(null);
  const [organizationDetails, setOrganizationDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarking, setBookmarking] = useState(false);
  const [userLiked, setUserLiked] = useState(false);

  const bookmarkedCourses = useSelector(selectBookmarkedCourses);
  const courseBookmarkStatus = useSelector((state) => state.bookmark?.courseBookmarkStatus) ?? {};
  const isBookmarked =
    courseId &&
    (courseBookmarkStatus[courseId] ??
      bookmarkedCourses.some((c) => (c._id || c.id) === courseId));
  const [userRating, setUserRating] = useState(0);
  const [totalViews, setTotalViews] = useState(null);
  const [messageProviderModalOpen, setMessageProviderModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getExploreCourseById(courseId)).unwrap();
        setCourse(result?.data ?? null);
        setOrganizationDetails(result?.organizationDetails ?? null);
        if (result?.data) {
          setTotalViews(result.data.totalViews ?? 0);
          try {
            const viewRes = await dispatch(increaseCourseViewsCount(courseId)).unwrap();
            if (viewRes?.updatedValue != null) setTotalViews(viewRes.updatedValue);
          } catch (e) {
            // view count best-effort
          }
        }
      } catch (e) {
        dispatch(notify({ type: "error", message: e?.message || "Course not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, dispatch, onBack]);

  useEffect(() => {
    if (!courseId || !userId || !token || !isAuthenticated) return;
    const fetchLikeStatus = async () => {
      try {
        const res = await dispatch(getCourseLikeStatus({ courseId, userId, token })).unwrap();
        setUserLiked(!!res?.userLiked);
      } catch (e) {
        setUserLiked(false);
      }
    };
    fetchLikeStatus();
  }, [courseId, userId, token, isAuthenticated, dispatch]);

  useEffect(() => {
    if (!courseId || !userId || !token || !isAuthenticated) return;
    const fetchRatingStatus = async () => {
      try {
        const res = await dispatch(getCourseRatingStatus({ courseId, userId, token })).unwrap();
        setUserRating(Number(res?.rating) || 0);
      } catch (e) {
        setUserRating(0);
      }
    };
    fetchRatingStatus();
  }, [courseId, userId, token, isAuthenticated, dispatch]);

  useEffect(() => {
    if (isAuthenticated && token && courseId) {
      dispatch(getBookmarkedCourses({ token })).unwrap().catch(() => {});
    }
  }, [courseId, isAuthenticated, token, dispatch]);

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      dispatch(notify({ type: "warning", message: "Please login to bookmark" }));
      return;
    }
    if (!courseId || bookmarking || !token) return;
    setBookmarking(true);
    try {
      if (isBookmarked) {
        await dispatch(removeCourseBookmark({ courseId, token })).unwrap();
        dispatch(notify({ type: "success", message: "Removed from bookmarks" }));
      } else {
        await dispatch(addCourseBookmark({ courseId, token })).unwrap();
        dispatch(notify({ type: "success", message: "Added to bookmarks" }));
      }
    } catch (e) {
      dispatch(notify({ type: "error", message: e?.message || "Could not update bookmark" }));
    } finally {
      setBookmarking(false);
    }
  };

  // Set document title and Open Graph meta tags for link preview when sharing
  useEffect(() => {
    if (!course) return;
    const prevTitle = document.title;
    document.title = `${course.title} | Career Explorer`;
    const url = window.location.origin + (courseId ? `/explore/course/${courseId}` : "");
    const description = (course.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200);
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
    setMeta("og:title", course.title);
    setMeta("og:description", description);
    setMeta("og:image", course.coverImage || "");
    setMeta("og:url", url);
    setMeta("og:type", "website");
    setMetaName("twitter:card", "summary_large_image");
    setMetaName("twitter:title", course.title);
    setMetaName("twitter:description", description);
    setMetaName("twitter:image", course.coverImage || "");
    return () => {
      document.title = prevTitle;
    };
  }, [course, courseId]);

  const handleLikeClick = async () => {
    if (!isAuthenticated || !token || !userId) {
      dispatch(notify({ type: "warning", message: "Please log in to like this course" }));
      return;
    }
    if (!courseId) return;
    try {
      const res = await dispatch(toggleCourseLike({ courseId, userId, token })).unwrap();
      setUserLiked(!!res?.userLiked);
      if (res?.totalLikes != null && course) setCourse((prev) => (prev ? { ...prev, totalLikes: res.totalLikes } : null));
      dispatch(notify({ type: "success", message: res?.message || (res?.userLiked ? "Liked" : "Unliked") }));
    } catch (e) {
      dispatch(notify({ type: "error", message: e?.message || "Could not update like" }));
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!isAuthenticated || !token || !userId) {
      dispatch(notify({ type: "warning", message: "Please log in to rate this course" }));
      return;
    }
    if (!courseId || newValue == null) return;
    try {
      setUserRating(newValue);
      const res = await dispatch(rateCourse({ courseId, userId, rating: newValue, token })).unwrap();
      if (course && res != null) {
        setCourse((prev) =>
          prev
            ? {
                ...prev,
                averageRating: res.averageRating != null ? Number(res.averageRating) : prev.averageRating,
                totalRatings: res.totalRatings != null ? Number(res.totalRatings) : prev.totalRatings,
              }
            : null
        );
      }
      dispatch(notify({ type: "success", message: res?.message || "Rating saved" }));
    } catch (e) {
      setUserRating(Number(course?.averageRating) || 0);
      dispatch(notify({ type: "error", message: e?.message || "Could not save rating" }));
    }
  };

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

  if (!course) return null;

  const providerName =
    organizationDetails?.organizationName ||
    course?.organizationDetails?.organizationName ||
    (course?.createdBy ? [course.createdBy.firstName, course.createdBy.lastName].filter(Boolean).join(" ") : "") ||
    "—";
  const cta = course?.cta || {};
  const ctaUrl = cta?.type === "LINK" ? cta?.value : null;
  const ctaLabel = cta?.label || "Enquire Now";
  const priceLabel =
    course.priceType === "FREE"
      ? "Free"
      : course.priceType === "CUSTOM"
        ? "Custom"
        : course.price != null
          ? `${course.currency || "INR"} ${course.price}`
          : "—";
  const durationStr = course?.duration
    ? `${course.duration.value ?? ""} ${(course.duration.unit || "min").toLowerCase()}`.trim()
    : "N/A";
  const modeStyle = deliveryModeTagStyle(course.deliveryMode);
  const averageRating = course?.averageRating != null ? Number(course.averageRating) : 0;
  const totalLikes = course?.totalLikes ?? 0;
  const viewsCount = totalViews != null ? totalViews : (course?.totalViews ?? 0);
  const contactEmail = organizationDetails?.contactEmail || course?.createdBy?.email;
  const messageProviderUrl = contactEmail ? `mailto:${contactEmail}` : null;

  const handleShare = () => {
    setShareModalOpen(true);
  };

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
      {/* Back to Courses */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <IconButton onClick={onBack} sx={{ p: 0 }} aria-label="Back to courses">
          <ArrowBackIcon sx={{ color: ACCENT, fontSize: "1.5rem" }} />
        </IconButton>
        <Typography
          component="button"
          onClick={onBack}
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            color: ACCENT,
            background: "none",
            border: "none",
            cursor: "pointer",
            p: 0,
          }}
        >
          Back to Courses
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main content */}
        <Grid item xs={12} md={8}>
          {/* Tags + Share / Bookmark */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            {course.category && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "999px",
                  backgroundColor: ACCENT_PURPLE,
                  color: "#fff",
                  fontFamily: fonts.sans,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                {course.category}
              </Box>
            )}
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "999px",
                backgroundColor: modeStyle.bg,
                color: modeStyle.textColor,
                fontFamily: fonts.sans,
                fontSize: "0.875rem",
                fontWeight: 600,
                border: modeStyle.border || "none",
              }}
            >
              {deliveryModeLabel(course.deliveryMode)}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: "auto" }}>
              <IconButton onClick={handleShare} size="small" sx={{ color: ACCENT }}>
                <ShareOutlinedIcon />
              </IconButton>
              <IconButton
                onClick={handleBookmarkClick}
                disabled={bookmarking}
                size="small"
                sx={{ color: isBookmarked ? ACCENT : "#717171" }}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkIcon sx={{ color: ACCENT }} />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* Title */}
          <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: { xs: "1.5rem", sm: "2rem" }, color: "#000", mb: 1.5 }}>
            {course.title}
          </Typography>

          {/* Provider + Duration */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <BusinessIcon sx={{ color: ACCENT, fontSize: "1.25rem" }} />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.9375rem", color: "#545454" }}>
                {providerName}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ color: "#9CA3AF", fontSize: "1.1rem" }} />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.9375rem", color: "#545454" }}>
                {durationStr}
              </Typography>
            </Box>
          </Box>

          {/* Cover image: whole image with blurred fill (same as podcast/course card) */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              borderRadius: "12px",
              overflow: "hidden",
              backgroundColor: "#f2f2f2",
              mb: 3,
              minHeight: 280,
            }}
          >
            {course.coverImage ? (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    inset: "-40px",
                    backgroundImage: `url(${course.coverImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(14px)",
                    transform: "scale(1.15)",
                  }}
                  aria-hidden
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,0.06)",
                    pointerEvents: "none",
                  }}
                  aria-hidden
                />
                <Box
                  component="img"
                  src={course.coverImage}
                  alt=""
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                  }}
                />
              </>
            ) : (
              <Box sx={{ width: "100%", height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MenuBookIcon sx={{ fontSize: 64, color: "#ccc" }} />
              </Box>
            )}
          </Box>

          {/* About This Course */}
          <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "1.25rem", color: "#000", mb: 1 }}>
            About This Course
          </Typography>
          <Typography sx={{ fontFamily: fonts.sans, fontSize: "1rem", color: "#545454", lineHeight: 1.75, whiteSpace: "pre-wrap", mb: 3 }}>
            {course.description || "No description."}
          </Typography>

          {/* What's Included */}
          {course.whatsIncluded?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "1.25rem", color: "#000", mb: 1.5 }}>
                What's Included
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: "none" }}>
                {course.whatsIncluded.map((item, i) => (
                  <Box key={i} component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                    <CheckCircleOutlineIcon sx={{ color: ACCENT, fontSize: "1.25rem", mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: "1rem", color: "#545454" }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* What You Will Learn */}
          {course.whatYouWillLearn?.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "1.25rem", color: "#000", mb: 1.5 }}>
                What You Will Learn
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: "none" }}>
                {course.whatYouWillLearn.map((item, i) => (
                  <Box key={i} component="li" sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                    <LightbulbOutlinedIcon sx={{ color: ACCENT, fontSize: "1.25rem", mt: 0.2, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: "1rem", color: "#545454" }}>{item}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Likes, Views, Your Rating */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              pt: 2,
              borderTop: "1px solid #eee",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton onClick={handleLikeClick} size="small" sx={{ p: 0.25 }} aria-label={userLiked ? "Unlike" : "Like"}>
                  {userLiked ? (
                    <ThumbUpIcon sx={{ color: ACCENT, fontSize: "1.25rem" }} />
                  ) : (
                    <ThumbUpOutlinedIcon sx={{ color: "#9CA3AF", fontSize: "1.25rem" }} />
                  )}
                </IconButton>
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.9375rem", color: "#545454" }}>
                  {totalLikes} likes
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <VisibilityOutlinedIcon sx={{ color: "#9CA3AF", fontSize: "1.25rem" }} />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.9375rem", color: "#545454" }}>
                  {viewsCount} views
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating
                value={isAuthenticated ? (userRating || averageRating) : averageRating}
                readOnly={!isAuthenticated}
                precision={0.5}
                size="small"
                onChange={handleRatingChange}
                sx={{
                  "& .MuiRating-iconFilled": { color: "#E87900" },
                  "& .MuiRating-iconEmpty": { color: "#D0D5DD" },
                }}
              />
              <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#9CA3AF" }}>Your Rating</Typography>
            </Box>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ position: { md: "sticky" }, top: 100 }}>
            {/* Summary + CTA card */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #EAECF0", mb: 2 }}>
              <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: "0.9375rem", color: "#101828", mb: 1 }}>
                Duration: {durationStr}
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: "0.9375rem", color: "#101828", mb: 1 }}>
                Service Mode: {deliveryModeLabel(course.deliveryMode)}
              </Typography>
              <Typography sx={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: "0.9375rem", color: "#101828", mb: 2 }}>
                Price: {priceLabel.toLowerCase()}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Rating
                  value={isAuthenticated ? (userRating || averageRating) : averageRating}
                  readOnly={!isAuthenticated}
                  precision={0.5}
                  size="small"
                  onChange={handleRatingChange}
                  sx={{
                    "& .MuiRating-iconFilled": { color: "#E87900" },
                    "& .MuiRating-iconEmpty": { color: "#D0D5DD" },
                  }}
                />
                <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#667085" }}>Your Rating</Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {ctaUrl && (
                  <Button
                    variant="contained"
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{
                      borderRadius: "90px",
                      py: 1.25,
                      background: `linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)`,
                      color: "#fff",
                      textTransform: "none",
                      fontFamily: fonts.sans,
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    {ctaLabel}
                  </Button>
                )}
                {isAuthenticated && contactEmail && (
                  <Button
                    variant="outlined"
                    onClick={() => setMessageProviderModalOpen(true)}
                    fullWidth
                    sx={{
                      borderRadius: "90px",
                      py: 1.25,
                      borderColor: ACCENT,
                      color: ACCENT,
                      textTransform: "none",
                      fontFamily: fonts.sans,
                      fontWeight: 600,
                      fontSize: "1rem",
                      "&:hover": { borderColor: ACCENT_PURPLE, backgroundColor: "rgba(114, 3, 97, 0.04)" },
                    }}
                  >
                    Message Provider
                  </Button>
                )}
              </Box>
            </Paper>

            {/* Institution Details */}
            {(organizationDetails?.organizationName || organizationDetails?.logo) && (
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #EAECF0" }}>
                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "1.125rem", color: "#000", mb: 2 }}>
                  Institution Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", mb: 2 }}>
                  {organizationDetails.logo ? (
                    <Box component="img" src={organizationDetails.logo} alt="" sx={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", mb: 1 }} />
                  ) : (
                    <Box sx={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "rgba(114, 3, 97, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                      <BusinessIcon sx={{ color: ACCENT_PURPLE, fontSize: 40 }} />
                    </Box>
                  )}
                  <Typography sx={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: "1rem", color: "#000" }}>
                    {organizationDetails.organizationName || "—"}
                  </Typography>
                </Box>
                {organizationDetails.address && (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                    <LocationOnOutlinedIcon sx={{ color: "#9CA3AF", fontSize: "1.1rem", mt: 0.3, flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#545454" }}>{organizationDetails.address}</Typography>
                  </Box>
                )}
                {organizationDetails.contactEmail && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <EmailOutlinedIcon sx={{ color: "#9CA3AF", fontSize: "1.1rem", flexShrink: 0 }} />
                    <Typography component="a" href={`mailto:${organizationDetails.contactEmail}`} sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#545454", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                      {organizationDetails.contactEmail}
                    </Typography>
                  </Box>
                )}
                {organizationDetails.website && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LanguageIcon sx={{ color: "#9CA3AF", fontSize: "1.1rem", flexShrink: 0 }} />
                    <Typography
                      component="a"
                      href={organizationDetails.website.startsWith("http") ? organizationDetails.website : `https://${organizationDetails.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ fontFamily: fonts.sans, fontSize: "0.875rem", color: "#545454", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
                    >
                      {organizationDetails.website}
                    </Typography>
                  </Box>
            )}
          </Paper>
            )}

      {/* Message Provider modal */}
      <Dialog
        open={messageProviderModalOpen}
        onClose={() => setMessageProviderModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: "16px", overflow: "hidden" },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#101828",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #EAECF0",
            py: 2,
          }}
        >
          Message Provider
          <IconButton
            onClick={() => setMessageProviderModalOpen(false)}
            size="small"
            aria-label="Close"
            sx={{ ml: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <NewMessagePanel
            defaultToEmail={contactEmail}
            defaultDisplayName={providerName}
            onSuccess={() => setMessageProviderModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <SharingVideoModal
        open={shareModalOpen}
        handleClose={() => setShareModalOpen(false)}
        videoUrl={window.location.origin + (courseId ? `/explore/course/${courseId}` : "")}
        videoId={courseId}
        shareTitle={course?.title}
        modalTitle="Share Course"
      />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseDetailContent;
