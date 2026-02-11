import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../models/DeleteModal.jsx";
import AddArticleModal from "../../models/AddArticleModal.jsx";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../../redux/slices/authSlice.js";
import {
  getArticleDetail,
  getArticleLikeStatus,
  getArticleRatingStatus,
  increaseArticleViewsCount,
  increaseArticleSharesCount,
  rateArticle,
  toggleArticleLike,
  deleteArticle,
} from "../../redux/slices/creatorSlice.js";
import { colors } from "../../utility/color.js";
import { formatArticleDetailDate } from "../../utility/convertTimeToUTC.js";
import { formatReadTime } from "../../utility/readTime.js";
import { fonts } from "../../utility/fonts.js";

function formatViews(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k views`;
  return `${num} view${num !== 1 ? "s" : ""}`;
}

/**
 * Renders article detail UI. Use inside dashboard (embedded) or on standalone page.
 * @param {string} articleId - Article ID
 * @param {function} onBack - Called when user clicks Back (and after delete in embedded mode)
 * @param {function} [onDeleteSuccess] - Optional. Called after article is deleted (e.g. to refetch list in dashboard)
 * @param {boolean} [embedded] - If true, uses compact wrapper (no full-page background); if false, uses Container and page-style wrapper
 */
const ArticleDetailContent = ({ articleId, onBack, onDeleteSuccess, embedded = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);

  const [article, setArticle] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const viewCountRef = useRef(false);

  const resolvedCreatorId =
    article?.creatorId && typeof article.creatorId === "object"
      ? article.creatorId._id
      : article?.creatorId;
  const isCreator = Boolean(
    resolvedCreatorId && userId && String(resolvedCreatorId) === String(userId),
  );

  useEffect(() => {
    const fetchDetail = async () => {
      if (!articleId) return;
      try {
        setLoading(true);
        const res = await dispatch(getArticleDetail({ articleId })).unwrap();
        const details = res?.articleDetails || res?.article;
        const creatorDetails = res?.creatorDetails || res?.creator;
        if (details) {
          setArticle(details);
          setCreator(creatorDetails || null);
          setTotalViews(details.totalViews ?? 0);
          setTotalLikes(details.totalLikes ?? 0);
          setAverageRating(Number(details.averageRating) || 0);
        }
      } catch (e) {
        dispatch(notify({ type: "error", message: "Article not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [articleId, dispatch, onBack]);

  useEffect(() => {
    if (!article?._id || viewCountRef.current) return;
    viewCountRef.current = true;
    dispatch(
      increaseArticleViewsCount({
        articleId: article._id,
        userId: authenticated ? userId : undefined,
      }),
    )
      .unwrap()
      .then((payload) => {
        if (payload?.updatedValue != null) setTotalViews(payload.updatedValue);
      })
      .catch(() => {});
  }, [article?._id, authenticated, userId, dispatch]);

  useEffect(() => {
    if (authenticated && articleId && token && userId) {
      dispatch(getArticleLikeStatus({ articleId, userId, token }))
        .unwrap()
        .then((p) => setUserLiked(!!p?.userLiked))
        .catch(() => {});
      dispatch(getArticleRatingStatus({ articleId, userId, token }))
        .unwrap()
        .then((p) => setUserRating(Number(p?.rating) || 0))
        .catch(() => {});
    }
  }, [authenticated, articleId, userId, token, dispatch]);

  const handleShare = () => {
    const url = window.location.origin + `/article/${articleId}`;
    if (navigator.share) {
      navigator.share({ title: article?.title, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      dispatch(notify({ type: "success", message: "Link copied" }));
    }
    if (article?._id) {
      dispatch(
        increaseArticleSharesCount({
          articleId: article._id,
          userId: authenticated ? userId : undefined,
        }),
      )
        .unwrap()
        .then(() => {})
        .catch(() => {});
    }
  };

  const handleLike = async () => {
    if (!authenticated) {
      dispatch(notify({ type: "warning", message: "Please login to like" }));
      return;
    }
    if (!article?._id) return;
    try {
      const p = await dispatch(
        toggleArticleLike({ articleId: article._id, userId, token }),
      ).unwrap();
      setUserLiked(!!p?.userLiked);
      if (p?.totalLikes != null) setTotalLikes(p.totalLikes);
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not update like" }));
    }
  };

  const handleRate = async (_, value) => {
    if (!authenticated) {
      dispatch(notify({ type: "warning", message: "Please login to rate" }));
      return;
    }
    if (!article?._id || value == null) return;
    try {
      const p = await dispatch(
        rateArticle({ articleId: article._id, userId, token, rating: value }),
      ).unwrap();
      setUserRating(value);
      if (p?.averageRating != null) setAverageRating(p.averageRating);
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not submit rating" }));
    }
  };

  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleConfirmDelete = async () => {
    if (!article?._id || !userId || !token) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteArticle({ userId, articleId: article._id, token })).unwrap();
      dispatch(notify({ type: "success", message: "Article deleted" }));
      setDeleteModalOpen(false);
      onBack?.();
      onDeleteSuccess?.();
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not delete article" }));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = async () => {
    const res = await dispatch(getArticleDetail({ articleId })).unwrap();
    const details = res?.articleDetails || res?.article;
    const creatorDetails = res?.creatorDetails || res?.creator;
    if (details) {
      setArticle(details);
      setCreator(creatorDetails || null);
      setTotalViews(details.totalViews ?? 0);
      setTotalLikes(details.totalLikes ?? 0);
      setAverageRating(Number(details.averageRating) || 0);
    }
  };

  const authorName = creator
    ? [creator.firstName, creator.lastName].filter(Boolean).join(" ") || "Author"
    : "Author";
  const readTimeLabel = formatReadTime(article?.content || "");

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (!article) return null;

  const content = (
    <>
      {/* Header: Dashboard = Back + Title + Edit/Delete; Public = "Back to Articles" link only */}
      {embedded ? (
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={onBack} sx={{ color: "#FFFFFF", backgroundColor: "#BC2876" }} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                color: colors.darkGray,
              }}
            >
              Article Detail
            </Typography>
          </Box>
          {isCreator && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                onClick={handleDeleteClick}
                sx={{
                  backgroundColor: colors.white,
                  border: "1px solid #F04438",
                  borderRadius: "25px",
                  color: "#F04438",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#BC2876", color: "#FFFFFF", border: "none" },
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => setEditModalOpen(true)}
                sx={{
                  background: "linear-gradient(to top left, #720361, #bf2f75)",
                  borderRadius: "25px",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(to top left, #720361, #bf2f75)",
                    opacity: 0.92,
                  },
                }}
              >
                Edit Article
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography
            component="button"
            onClick={onBack}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              fontFamily: fonts.sans,
              fontSize: "0.9375rem",
              color: "#720361",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
            Back to Articles
          </Typography>
        </Box>
      )}

<Box
        sx={{
          display: embedded ? "block" : "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          minHeight: "100vh",
          marginTop: "1rem",
          pb: 4,
          pt: 2,
        }}
      >
        <Box
          sx={{
            flex: embedded ? "none" : 1,
            minWidth: 0,
            ...(!embedded && {
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "2px 2px 10px #a7a7a764",
              border: "1px solid #eeeeee",
              p: 3,
            }),
          }}
        >
      {/* Category pill */}
      <Box sx={{ mb: 3 }}>
        <Box
          component="span"
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            borderRadius: "20px",
            backgroundColor: "#BC2876",
            color: "#fff",
            fontFamily: fonts.sans,
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          {article.category || "Article"}
        </Box>
      </Box>

      {/* Title */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: fonts.poppins,
          fontWeight: 700,
          fontSize: { xs: "1.5rem", sm: "1.75rem" },
          color: colors.darkGray,
          mb: 2,
          lineHeight: 1.3,
        }}
      >
        {article.title}
      </Typography>

      {/* Meta: author, date, read time, views + share */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <PersonIcon sx={{ fontSize: 18, color: colors.lightGray }} />
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {authorName}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <CalendarTodayIcon sx={{ fontSize: 18, color: colors.lightGray }} />
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {formatArticleDetailDate(article.createdAt)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 18, color: colors.lightGray }} />
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {readTimeLabel}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <VisibilityIcon sx={{ fontSize: 18, color: colors.lightGray }} />
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {formatViews(totalViews)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0, ml: "auto" }}>
          <IconButton onClick={handleShare} size="small" sx={{ color: "#720361" }}>
            <ShareIcon />
          </IconButton>
          {!embedded && (
            <IconButton size="small" sx={{ color: "#720361" }} aria-label="Bookmark">
              <BookmarkBorderIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Cover image */}
      {article.coverImage && (
        <Box
          sx={{
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={article.coverImage}
            alt=""
            style={{
              width: "100%",
              height: "auto",
              maxHeight: 420,
              objectFit: "cover",
              display: "block",
            }}
          />
        </Box>
      )}

      {/* Article content (HTML) */}
      <Box
        className="article-content"
        sx={{
          fontFamily: fonts.sans,
          fontSize: "1rem",
          lineHeight: 1.7,
          color: colors.darkGray,
          "& h1, & h2, & h3": { fontFamily: fonts.poppins, fontWeight: 600, mt: 2, mb: 1 },
          "& p": { mb: 1.5 },
          "& ul, & ol": { pl: 2.5, mb: 1.5 },
          "& a": { color: "#720361", textDecoration: "underline" },
        }}
        dangerouslySetInnerHTML={{ __html: article.content || "" }}
      />

      {/* Engagement footer */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 3,
          mt: 4,
          pt: 3,
          borderTop: "1px solid #eee",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            onClick={handleLike}
            size="small"
            sx={{ color: userLiked ? "#720361" : colors.lightGray }}
          >
            {userLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
          </IconButton>
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {totalLikes} like{totalLikes !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <VisibilityIcon sx={{ fontSize: 20, color: colors.lightGray }} />
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {formatViews(totalViews)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Rating
            value={userRating || averageRating}
            onChange={handleRate}
            readOnly={!authenticated}
            size="small"
            sx={{ "& .MuiRating-iconFilled": { color: "#ffb400" } }}
          />
          <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
            {averageRating.toFixed(1)} rating
          </Typography>
        </Box>
      </Box>
        </Box>

        {/* About the Author card - public page only */}
        {!embedded && creator && (
          <Box
            sx={{
              width: { xs: "100%", md: 340 },
              flexShrink: 0,
              border: "1px solid #eeeeee",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "2px 2px 10px #a7a7a764",
              p: 2.5,
              height: "fit-content",
              alignSelf: { md: "flex-start" },
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: "1.125rem",
                color: colors.darkGray,
                mb: 2,
              }}
            >
              About the Author
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar
                src={creator.profilePicture}
                sx={{ width: 72, height: 72 }}
              />
              <Box>
                <Typography
                  sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    fontSize: "1.0625rem",
                    color: "#720361",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => navigate(`/profile/${creator._id}`)}
                >
                  {[creator.firstName, creator.lastName].filter(Boolean).join(" ") || "Author"}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "0.8125rem",
                    color: colors.lightGray,
                    textTransform: "uppercase",
                  }}
                >
                  Counsellor
                </Typography>
              </Box>
            </Box>
            {(creator.introBio || creator.bio) && (
              <Typography
                variant="body2"
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "0.9375rem",
                  color: "text.secondary",
                  lineHeight: 1.55,
                }}
              >
                {creator.introBio || creator.bio}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </>
  );

  if (embedded) {
    return (
      <Box sx={{ width: "100%" }}>
        {content}
        <DeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onDelete={handleConfirmDelete}
          title="Confirm Delete?"
          text="Are you sure you want to delete this article?"
          fonts={fonts}
          colors={colors}
          isButtonLoading={isDeleting}
        />
        <AddArticleModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          articleId={articleId}
        />
      </Box>
    );
  }

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
      {content}
    </Box>
  );
};

export default ArticleDetailContent;
