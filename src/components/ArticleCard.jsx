import ScheduleIcon from "@mui/icons-material/Schedule";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Rating from "@mui/material/Rating";
import { IconButton } from "@mui/material";
import { notify } from "../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken } from "../redux/slices/authSlice.js";
import {
  addArticleBookmark,
  removeArticleBookmark,
  selectBookmarkedArticles,
} from "../redux/slices/bookmarkSlice.js";
import { fonts } from "../utility/fonts.js";
import { formatDateDDMMYYYY } from "../utility/convertTimeToUTC.js";

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);
  const bookmarkedArticles = useSelector(selectBookmarkedArticles);
  const articleBookmarkStatus = useSelector((state) => state.bookmark?.articleBookmarkStatus) ?? {};
  const [bookmarking, setBookmarking] = useState(false);

  const articleId = article?._id;
  const isBookmarked =
    articleId &&
    (articleBookmarkStatus[articleId] ??
      bookmarkedArticles.some((a) => (a._id || a.id) === articleId));

  const formatDate = (dateStr) =>
    dateStr ? formatDateDDMMYYYY(dateStr) : "";

  // Strip HTML tags and decode entities (e.g. &nbsp;) to plain text
  const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    let plain = html.replace(/<[^>]*>/g, " ");
    // Decode common HTML entities
    plain = plain
      .replace(/&nbsp;/g, " ")
      .replace(/&#160;/g, " ")
      .replace(/&#xA0;/gi, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'");
    // Numeric entities (decimal and hex)
    plain = plain.replace(/&#(\d+);/g, (_, n) =>
      String.fromCharCode(Number(n))
    );
    plain = plain.replace(/&#x([0-9a-fA-F]+);/g, (_, n) =>
      String.fromCharCode(parseInt(n, 16))
    );
    return plain.replace(/\s+/g, " ").trim();
  };

  // Calculate reading time from content (avg ~200 words per minute)
  const getReadingTimeMinutes = (content) => {
    if (!content || typeof content !== "string") return 0;
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    if (words === 0) return 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  const title = article?.title || "";
  const rawContent = [
    article?.title,
    article?.description,
    article?.excerpt,
    article?.content,
    article?.body,
  ]
    .filter(Boolean)
    .join(" ");
  const contentForReading = stripHtml(rawContent);
  const readingTime = getReadingTimeMinutes(contentForReading);

  // First 25 words of content for preview, followed by "..."
  const words = contentForReading.trim().split(/\s+/).filter(Boolean);
  const previewText =
    words.length > 0
      ? words.slice(0, 25).join(" ") + (words.length > 25 ? "..." : "")
      : "";
  const views = article?.totalViews ?? 0;
  const likes = article?.totalLikes ?? 0;
  const averageRating = article?.averageRating ?? 0;
  const totalRatings = article?.totalRatings ?? 0;
  const category = article?.category || "";
  const authorName = article?.creatorId
    ? `${article.creatorId.firstName || ""} ${article.creatorId.lastName || ""}`.trim()
    : "Unknown";
  const authorId = article?.creatorId?._id;
  const publishedDate = article?.createdAt || article?.publishedAt || "";
  const coverImage = article?.coverImage || "";
  const imageSrc =
    coverImage || "https://via.placeholder.com/400x250?text=Article";

  return (
    <div
      style={{
        borderRadius: "15px",
        overflow: "hidden",
        border: "1px solid #cecece",
        backgroundColor: "white",
        cursor: "pointer",
        boxShadow: "2px 2px 10px #a7a7a764",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      onClick={() => article?._id && navigate(`/article/${article._id}`)}
    >
      {/* Image: full image on top (contain), blurred fill behind — no crop on foreground */}
      <div
        style={{
          position: "relative",
          height: "200px",
          flexShrink: 0,
          overflow: "hidden",
          backgroundColor: "#e8e8e8",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-12px",
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(22px)",
            transform: "scale(1.08)",
            pointerEvents: "none",
          }}
        />
        {/* Fill the frame so object-fit:contain touches at least one edge (width OR height full); avoids tiny img box + blur on all 4 sides */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <img
            src={imageSrc}
            alt={title ? `${title} cover` : "Article cover"}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>
        {category && (
          <span
            style={{
              position: "absolute",
              left: "12px",
              top: "12px",
              zIndex: 2,
              backgroundColor: "#BC2876",
              color: "white",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontFamily: fonts.sans,
              fontWeight: 600,
            }}
          >
            {category}
          </span>
        )}
        <IconButton
          size="small"
          disabled={bookmarking}
          onClick={(e) => {
            e.stopPropagation();
            if (!articleId) return;
            if (!authenticated) {
              dispatch(notify({ type: "warning", message: "Please login to bookmark" }));
              return;
            }
            if (bookmarking || !token) return;
            setBookmarking(true);
            const thunk = isBookmarked
              ? removeArticleBookmark({ articleId, token })
              : addArticleBookmark({ articleId, token });
            dispatch(thunk)
              .unwrap()
              .then(() => {
                dispatch(
                  notify({
                    type: "success",
                    message: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
                  })
                );
              })
              .catch((err) => {
                dispatch(
                  notify({
                    type: "error",
                    message: err?.message || "Could not update bookmark",
                  })
                );
              })
              .finally(() => setBookmarking(false));
          }}
          sx={{
            position: "absolute",
            right: "8px",
            top: "8px",
            zIndex: 2,
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
          }}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
        >
          {isBookmarked ? (
            <BookmarkIcon sx={{ color: "#720361", fontSize: "1.2rem" }} />
          ) : (
            <BookmarkBorderIcon sx={{ color: "#720361", fontSize: "1.2rem" }} />
          )}
        </IconButton>
      </div>

      {/* Content: flex so footer stays at bottom and aligns across cards */}
      <div
        style={{
          padding: "1rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Title + description: takes variable space so footer aligns */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "1rem",
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
          {previewText && (
            <p
              style={{
                margin: "0.5rem 0 0",
                fontFamily: fonts.sans,
                fontSize: "0.875rem",
                color: "#737373",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {previewText}
            </p>
          )}
          
        </div>
<hr style={{ margin: "12px 0 0", border: "1px solid rgb(243, 240, 240)", flexShrink: 0 }} />
        {/* Metadata: reading time, views, likes, rating (same as video cards) - always at bottom */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "12px",
            marginTop: "12px",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.8125rem",
              color: "#737373",
              fontFamily: fonts.sans,
            }}
          >
            <ScheduleIcon sx={{ fontSize: "1rem" }} />
            {readingTime ? `${readingTime} min read` : "—"}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.8125rem",
              color: "#737373",
              fontFamily: fonts.sans,
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: "1rem", color: "#FF8A00" }} />
            {views} views
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.8125rem",
              color: "#737373",
              fontFamily: fonts.sans,
            }}
          >
            <ThumbUpOutlinedIcon sx={{ fontSize: "1rem" }} />
            {likes} like{likes !== 1 ? "s" : ""}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "0.8125rem",
              color: "#737373",
              fontFamily: fonts.sans,
            }}
          >
            <Rating value={averageRating} readOnly size="small" sx={{ "& .MuiRating-iconFilled": { color: "#ffb400" } }} />
            <span style={{ marginLeft: "2px" }}>({totalRatings})</span>
          </span>
        </div>

        {/* Author & date - always at bottom */}
        <div
          style={{
            marginTop: "0.5rem",
            fontSize: "0.8125rem",
            color: "#737373",
            fontFamily: fonts.sans,
            flexShrink: 0,
          }}
        >
          By{" "}
          {authorId ? (
            <span
              style={{ color: "#BC2876", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${authorId}`);
              }}
            >
              {authorName}
            </span>
          ) : (
            <span style={{ color: "#BC2876" }}>{authorName}</span>
          )}
          {publishedDate && (
            <>
              <span style={{ margin: "0 4px", color: "#999" }}>·</span>
              {formatDate(publishedDate)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
