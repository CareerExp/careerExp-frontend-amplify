import React, { useState } from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useNavigate } from "react-router-dom";
import { fonts } from "../utility/fonts.js";
import { announcementsPlaceholder } from "../assets/assest.js";

const AnnouncementCard = ({ announcement }) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    const plain = html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return plain;
  };

  const title = announcement?.title || "";
  const description = announcement?.description
    ? stripHtml(announcement.description).slice(0, 80) + (stripHtml(announcement.description).length > 80 ? "..." : "")
    : "";
  const overlayTitle = announcement?.overlayTitle || announcement?.title || "";
  const hasCoverImage = announcement?.banner || announcement?.coverImage || announcement?.image;
  const imageUrl = hasCoverImage
    ? (announcement.banner || announcement.coverImage || announcement.image)
    : announcementsPlaceholder;
  const isPlaceholder = !hasCoverImage;
  const dateStr = announcement?.createdAt || announcement?.publishedAt || "";
  const id = announcement?._id;

  const handleCtaClick = (e) => {
    e.stopPropagation();
    if (id) {
      navigate(`/explore/announcement/${id}`);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({
          title,
          text: description,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        border: "1px solid #e5e5e5",
        backgroundColor: "#ffffff",
        cursor: "pointer",
        boxShadow: "2px 2px 10px #a7a7a764",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image: blurred same image as background, sharp image contained on top */}
      <div
        style={{
          position: "relative",
          height: "220px",
          flexShrink: 0,
          overflow: "hidden",
          backgroundColor: "#e8e8e8",
          borderRadius: "15px 15px 0 0",
          isolation: "isolate",
        }}
      >
        {/* Blurred background – same image scaled up and blurred so letterbox areas match the image */}
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
        {/* Optional dim so the sharp image stands out */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.12)",
            pointerEvents: "none",
          }}
          aria-hidden
        />
        {/* Sharp image – placeholder uses cover to fill; real images use contain to avoid distortion */}
        <img
          src={imageUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: isPlaceholder ? "fill" : "contain",
            objectPosition: "center",
            borderRadius: "15px 15px 0 0",
          }}
        />
        {/* Overlay for title text at bottom */}
        {/* <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
            padding: "32px 16px 16px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: "0.9375rem",
              lineHeight: 1.35,
              color: "#fff",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {overlayTitle}
          </p>
        </div> */}
      </div>

      {/* Date row + share/bookmark */}
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
            color: "#333",
            fontFamily: fonts.sans,
          }}
        >
          <CalendarTodayIcon sx={{ color: "#BC2876", fontSize: "1.1rem" }} />
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
              border: "1px solid #dddddd",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Share"
          >
            <ShareOutlinedIcon sx={{ color: "#717171", fontSize: "1.1rem" }} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked((b) => !b);
            }}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid #dddddd",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="Save"
          >
            <BookmarkBorderIcon
              sx={{
                color: bookmarked ? "#BC2876" : "#717171",
                fontSize: "1.1rem",
              }}
            />
          </button>
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
            lineHeight: 1.3,
            color: "#333",
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
              margin: "6px 0 0",
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
      </div>

      {/* CTA button */}
      <div style={{ padding: "0 16px 16px" }}>
        <button
          type="button"
          onClick={handleCtaClick}
          style={{
            width: "100%",
            padding: "12px 20px",
            borderRadius: "25px",
            border: "none",
            backgroundColor: "#BC2876",
            color: "#fff",
            fontFamily: fonts.sans,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            textTransform: "capitalize",
          }}
        >
          Tell me more
        </button>
      </div>
    </div>
  );
};

export default AnnouncementCard;
