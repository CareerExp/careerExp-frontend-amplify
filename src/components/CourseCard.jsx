import React, { useState } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { fonts } from "../utility/fonts.js";
import { servicesPlaceholder } from "../assets/assest.js";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SharingVideoModal from "../models/SharingVideoModal.jsx";
import EnquiryLoginModal from "../models/EnquiryLoginModal.jsx";
import { notify } from "../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken } from "../redux/slices/authSlice.js";
import {
  addCourseBookmark,
  removeCourseBookmark,
  selectBookmarkedCourses,
} from "../redux/slices/bookmarkSlice.js";

const ACCENT = "#BC2876";

const DELIVERY_MODE_STYLES = {
  hybrid: { bg: "#FEF0C7", textColor: "#FF8A00", label: "Hybrid" },
  HYBRID: { bg: "#FEF0C7", textColor: "#FF8A00", label: "Hybrid" },
  "in person": { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  in_person: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  IN_PERSON: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  offline: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  OFFLINE: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  online: { bg: "#DCFAE6", textColor: "#079455", label: "Online" },
  ONLINE: { bg: "#DCFAE6", textColor: "#079455", label: "Online" },
};

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);
  const bookmarkedCourses = useSelector(selectBookmarkedCourses);
  const courseBookmarkStatus =
    useSelector((state) => state.bookmark?.courseBookmarkStatus) ?? {};
  const [bookmarking, setBookmarking] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const courseId = course?._id;
  const isBookmarked =
    courseId &&
    (courseBookmarkStatus[courseId] ??
      bookmarkedCourses.some((c) => (c._id || c.id) === courseId));

  const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const title = course?.title || "";
  const description = course?.description ? stripHtml(course.description) : "";
  const hasCoverImage = course?.coverImage;
  const imageUrl = hasCoverImage ? course.coverImage : servicesPlaceholder;
  const id = course?._id;

  const durationStr = course?.duration
    ? `${course.duration.value ?? ""} ${(course.duration.unit || "min").toLowerCase()}`.trim()
    : "";

  const priceLabel =
    course?.priceType === "FREE"
      ? "Free"
      : course?.priceType === "CUSTOM"
        ? "Custom"
        : course?.price != null
          ? "Paid"
          : "Free";

  const rawMode = (course?.deliveryMode || "Online")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const modeStyle = DELIVERY_MODE_STYLES[rawMode] ??
    DELIVERY_MODE_STYLES[course?.deliveryMode] ?? {
      bg: "#E8F5E9",
      textColor: "#2E7D32",
      label: "Online",
    };

  const providerName =
    course?.organizationDetails?.organizationName ||
    course?.organizationId?.organizationName ||
    (course?.createdBy
      ? [course.createdBy.firstName, course.createdBy.lastName]
          .filter(Boolean)
          .join(" ")
      : "") ||
    course?.instructorName ||
    "—";

  const handleCardClick = () => {
    if (id) navigate(`/explore/course/${id}`);
  };

  const handleCtaClick = (e) => {
    e.stopPropagation();
    if (id) navigate(`/explore/course/${id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const shareUrl =
    window.location.origin +
    (id ? `/explore/course/${id}` : window.location.pathname);

  return (
    <>
      <Box
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          height: "100%",
          minHeight: { xs: "auto", sm: "220px" },
          border: "1px solid #eeeeee",
        }}
      >
        {/* Image on the left (or top on mobile): whole image with blurred fill like podcast */}
        <Box
          sx={{
            position: "relative",
            width: { xs: "100%", sm: "280px" },
            minHeight: { xs: "180px", sm: "100%" },
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "#e8e8e8",
          }}
        >
          {hasCoverImage ? (
            <>
              <Box
                sx={{
                  position: "absolute",
                  inset: "-40px",
                  backgroundImage: `url(${imageUrl})`,
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
                src={imageUrl}
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
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MenuBookIcon sx={{ fontSize: 56, color: "#ccc" }} />
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              backgroundColor: "#BC2876",
              color: "#ffffff",
              fontFamily: fonts.sans,
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            {course?.category || "Other"}
          </Box>
          {/* Paid / Free badge top-right */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              px: 1.5,
              py: 0.5,
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              color:
                course?.priceType === "FREE"
                  ? "rgba(43, 192, 13, 0.9)"
                  : "rgba(114, 3, 97, 0.85)",
              fontFamily: fonts.sans,
              fontSize: "0.8125rem",
              fontWeight: 600,
            }}
          >
            {priceLabel}
          </Box>
        </Box>

        {/* Content right */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            p: 2,
          }}
        >
          {/* Duration (clock) + share + bookmark */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon sx={{ color: "#FF8A00", fontSize: "1.1rem" }} />
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "0.875rem",
                  color: "#999999",
                }}
              >
                {durationStr || "—"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                component="button"
                type="button"
                onClick={handleShare}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "1px solid #DDDDDD",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Share"
              >
                <ShareOutlinedIcon
                  sx={{ color: "#9E9E9E", fontSize: "1.1rem" }}
                />
              </Box>
              <Box
                component="button"
                type="button"
                disabled={bookmarking}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!courseId) return;
                  if (!authenticated) {
                    setLoginModalOpen(true);
                    return;
                  }
                  if (bookmarking || !token) return;
                  setBookmarking(true);
                  const thunk = isBookmarked
                    ? removeCourseBookmark({ courseId, token })
                    : addCourseBookmark({ courseId, token });
                  dispatch(thunk)
                    .unwrap()
                    .then(() => {
                      dispatch(
                        notify({
                          type: "success",
                          message: isBookmarked
                            ? "Removed from bookmarks"
                            : "Added to bookmarks",
                        }),
                      );
                    })
                    .catch((err) => {
                      dispatch(
                        notify({
                          type: "error",
                          message: err?.message || "Could not update bookmark",
                        }),
                      );
                    })
                    .finally(() => setBookmarking(false));
                }}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  border: "1px solid #DDDDDD",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
              >
                {isBookmarked ? (
                  <BookmarkIcon sx={{ color: ACCENT, fontSize: "1.1rem" }} />
                ) : (
                  <BookmarkBorderIcon
                    sx={{ color: "#9E9E9E", fontSize: "1.1rem" }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "1rem",
              lineHeight: 1.35,
              color: "#000000",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              my: 1,
            }}
          >
            {title}
          </Typography>

          {/* Description */}
          {description && (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "14px",
                color: "#545454",
                lineHeight: 1.45,
                pt: 0.75,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                flex: 1,
              }}
            >
              {description}
            </Typography>
          )}

          {/* Provider: By X */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              pt: 1,
              minWidth: 0,
              my: 1,
            }}
          >
            {course?.createdBy?.profilePicture ? (
              <Box
                component="img"
                src={course?.createdBy?.profilePicture}
                alt=""
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "#FFDAED",
                  color: "#BC2876",
                  fontFamily: fonts.sans,
                  fontSize: "14px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {course?.createdBy?.firstName?.charAt(0)}
              </Box>
            )}
            {/* <BusinessIcon sx={{ color: ACCENT, fontSize: "1.1rem", flexShrink: 0 }} /> */}
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "0.8125rem",
                color: "#737373",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              By{" "}
              <Box component="span" sx={{ color: ACCENT, fontWeight: 700 }}>
                {providerName}
              </Box>
            </Typography>
          </Box>

          {/* Mode pill + Enquire Now */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: "auto",
              pt: 1.5,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.5,
                py: 0.75,
                borderRadius: "999px",
                backgroundColor: modeStyle.bg,
                color: modeStyle.textColor,
                fontFamily: fonts.sans,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {modeStyle.label}
            </Box>
            <Box
              component="button"
              type="button"
              onClick={handleCtaClick}
              sx={{
                flex: 1,
                minWidth: 0,
                py: 1,
                px: 1.5,
                borderRadius: "999px",
                border: "none",
                background: ACCENT,
                color: "#ffffff",
                fontFamily: fonts.sans,
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "none",
                "&:hover": { opacity: 0.92 },
              }}
            >
              View Details
            </Box>
          </Box>
        </Box>
      </Box>
      <SharingVideoModal
        open={shareModalOpen}
        handleClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
        videoId={id}
        shareTitle={title}
        modalTitle="Share Course"
      />
      <EnquiryLoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
};

export default CourseCard;
