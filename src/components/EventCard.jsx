import React, { useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../utility/fonts.js";
import { eventsPlaceholder } from "../assets/assest.js";
import { registerEventCta } from "../redux/slices/eventSlice.js";
import { selectAuthenticated, selectToken } from "../redux/slices/authSlice.js";
import { notify } from "../redux/slices/alertSlice.js";
import { formatDateMMDDYYYY } from "../utility/convertTimeToUTC.js";
import SharingVideoModal from "../models/SharingVideoModal.jsx";

// Figma: In person = light pink bg #FFE8F3, text #DD4595; Hybrid/Online = light bg + accent text
const EVENT_TYPE_STYLES = {
  "in person": { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  in_person: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  IN_PERSON: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  hybrid: { bg: "#FFF3E0", textColor: "#E65100", label: "Hybrid" },
  HYBRID: { bg: "#FFF3E0", textColor: "#E65100", label: "Hybrid" },
  online: { bg: "#E8F5E9", textColor: "#2E7D32", label: "Online" },
  ONLINE: { bg: "#E8F5E9", textColor: "#2E7D32", label: "Online" },
};
const FIGMA_ACCENT = "#BC2876"; // primary pink/magenta from Figma

const EventCard = ({ event: ev }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectAuthenticated);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const formatDate = (dateStr) => formatDateMMDDYYYY(dateStr);

  const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const title = ev?.title || "";
  const description = ev?.description
    ? stripHtml(ev.description).slice(0, 80) +
      (stripHtml(ev.description).length > 80 ? "..." : "")
    : "";
  const hasCoverImage = ev?.banner || ev?.coverImage || ev?.image;
  const imageUrl = hasCoverImage
    ? ev.banner || ev.coverImage || ev.image
    : eventsPlaceholder;
  const isPlaceholder = !hasCoverImage;
  const dateStr =
    ev?.eventDate || ev?.startDate || ev?.createdAt || ev?.publishedAt || "";
  const id = ev?._id;

  const rawType = (ev?.eventType || ev?.type || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const typeStyle = EVENT_TYPE_STYLES[rawType] ||
    EVENT_TYPE_STYLES[ev?.mode] || {
      bg: "#f5f5f5",
      textColor: "#717171",
      label: ev?.eventType || ev?.type || "Event",
    };

  const handleCardClick = () => {
    if (id) {
      navigate(`/explore/event/${id}`);
    }
  };

  const handleCtaClick = async (e) => {
    e.stopPropagation();
    if (!id) return;
    if (!isAuthenticated || !token) {
      dispatch(
        notify({ type: "warning", message: "Please log in to register" }),
      );
      return;
    }
    try {
      await dispatch(
        registerEventCta({
          id,
          actionType: "CLICK",
          token,
        }),
      ).unwrap();
      dispatch(
        notify({ type: "success", message: "Response recorded successfully." }),
      );
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Could not record response.",
        }),
      );
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const shareUrl =
    window.location.origin +
    (id ? `/explore/event/${id}` : window.location.pathname);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #eeeeee",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Image: ~40–45% of card height, rounded top corners */}
        <div
          style={{
            position: "relative",
            height: "200px",
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "#e8e8e8",
            borderRadius: "16px 16px 0 0",
            isolation: "isolate",
          }}
        >
          <div
            style={{
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
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.08)",
              pointerEvents: "none",
            }}
            aria-hidden
          />
          <img
            src={imageUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: isPlaceholder ? "cover" : "contain",
              objectPosition: "center",
              borderRadius: "16px 16px 0 0",
            }}
          />
        </div>

        {/* Date row: calendar (Figma pink #DD4595) + share & save (grey, light border) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 0",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.875rem",
              color: "#000000",
              fontFamily: fonts.sans,
            }}
          >
            <CalendarTodayIcon
              sx={{ color: FIGMA_ACCENT, fontSize: "1.1rem" }}
            />
            {formatDate(dateStr)}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={handleShare}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                border: "1px solid #e0e0e0",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              aria-label="Share"
            >
              <ShareOutlinedIcon
                sx={{ color: "#717171", fontSize: "1.1rem" }}
              />
            </button>
            {/* <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked((b) => !b);
            }}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #e0e0e0",
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Save"
          >
            <BookmarkBorderIcon
              sx={{ color: bookmarked ? FIGMA_ACCENT : "#717171", fontSize: "1.1rem" }}
            />
          </button> */}
          </div>
        </div>

        {/* Title + description */}
        <div style={{ padding: "12px 16px 16px", flex: 1, minHeight: 0 }}>
          <h3
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "1.0625rem",
              lineHeight: 1.35,
              color: "#000000",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>
          {description && (
            <p
              style={{
                margin: "6px 0 14px",
                fontFamily: fonts.sans,
                fontSize: "0.875rem",
                color: "#737373",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </p>
          )}

          {/* Bottom row: event type pill (left) + Click to Register (right) – Figma layout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 14px",
                borderRadius: "999px",
                backgroundColor: typeStyle.bg,
                color: typeStyle.textColor || typeStyle.bg,
                fontFamily: fonts.sans,
                fontSize: "0.8125rem",
                fontWeight: 600,
              }}
            >
              {typeStyle.label}
            </span>
            <button
              type="button"
              onClick={handleCtaClick}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "10px 18px",
                borderRadius: "999px",
                border: "none",
                background: FIGMA_ACCENT,
                color: "#ffffff",
                fontFamily: fonts.sans,
                fontSize: "0.9375rem",
                fontWeight: 600,
                cursor: "pointer",
                textTransform: "capitalize",
              }}
            >
              Click to Register
            </button>
          </div>
        </div>
      </div>
      <SharingVideoModal
        open={shareModalOpen}
        handleClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
        videoId={id}
        shareTitle={title}
        modalTitle="Share Event"
      />
    </>
  );
};

export default EventCard;
