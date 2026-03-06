import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
  IconButton,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../../models/DeleteModal.jsx";
import EditVideoModal from "../../models/EditVideoModal.jsx";
import SharingVideoModal from "../../models/SharingVideoModal.jsx";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../../redux/slices/authSlice.js";
import { deleteVideo, updateVideo, videoDetailById } from "../../redux/slices/creatorSlice.js";
import { getLikeStatus, toggleLike } from "../../redux/slices/likeSlice.js";
import { getRatingStatus, rateVideo } from "../../redux/slices/ratingSlice.js";
import { colors } from "../../utility/color.js";
import { formatArticleDetailDate } from "../../utility/convertTimeToUTC.js";
import { fonts } from "../../utility/fonts.js";

function formatViews(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k views`;
  return `${num} view${num !== 1 ? "s" : ""}`;
}

/**
 * Video detail for dashboard My Content (embedded). Same structure/layout as ArticleDetailContent.
 */
const VideoDetailContent = ({ videoId, onBack, onDeleteSuccess, embedded = true }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);

  const [video, setVideo] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const resolvedCreatorId =
    video?.creatorId && typeof video.creatorId === "object"
      ? video.creatorId._id
      : video?.creatorId;
  const isCreator = Boolean(
    resolvedCreatorId && userId && String(resolvedCreatorId) === String(userId),
  );

  useEffect(() => {
    const fetchDetail = async () => {
      if (!videoId) return;
      try {
        setLoading(true);
        const res = await dispatch(videoDetailById({ videoId })).unwrap();
        const details = res?.videoDetails || res?.video;
        if (details) {
          setVideo(details);
          setTotalViews(details.totalViews ?? 0);
          setTotalLikes(details.totalLikes ?? 0);
          setAverageRating(Number(details.averageRating) || 0);
        }
      } catch (e) {
        dispatch(notify({ type: "error", message: "Video not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [videoId, dispatch, onBack]);

  useEffect(() => {
    if (authenticated && videoId && token && userId) {
      dispatch(getLikeStatus({ videoId, userId, token }))
        .unwrap()
        .then((p) => setUserLiked(!!p?.userLiked))
        .catch(() => {});
      dispatch(getRatingStatus({ videoId, userId, token }))
        .unwrap()
        .then((p) => setUserRating(Number(p?.rating) || 0))
        .catch(() => {});
    }
  }, [authenticated, videoId, userId, token, dispatch]);

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleLike = async () => {
    if (!authenticated) {
      dispatch(notify({ type: "warning", message: "Please login to like" }));
      return;
    }
    if (!video?._id) return;
    try {
      const p = await dispatch(
        toggleLike({ videoId: video._id, userId, token }),
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
    if (!video?._id || value == null) return;
    try {
      const p = await dispatch(
        rateVideo({ videoId: video._id, userId, token, rating: value }),
      ).unwrap();
      setUserRating(value);
      if (p?.averageRating != null) setAverageRating(p.averageRating);
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not submit rating" }));
    }
  };

  const handleDeleteClick = () => setDeleteModalOpen(true);
  const handleConfirmDelete = async () => {
    if (!video?._id || !userId || !token) return;
    try {
      setIsDeleting(true);
      await dispatch(deleteVideo({ userId, videoId: video._id, token })).unwrap();
      dispatch(notify({ type: "success", message: "Video deleted" }));
      setDeleteModalOpen(false);
      onBack?.();
      onDeleteSuccess?.();
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not delete video" }));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = async () => {
    if (!videoId) return;
    try {
      const res = await dispatch(videoDetailById({ videoId })).unwrap();
      const details = res?.videoDetails || res?.video;
      if (details) {
        setVideo(details);
        setTotalViews(details.totalViews ?? 0);
        setTotalLikes(details.totalLikes ?? 0);
        setAverageRating(Number(details.averageRating) || 0);
      }
    } catch (_) {}
  };

  const handleUpdateVideo = async (updatedVideo) => {
    if (!userId || !token || !updatedVideo?._id) return;
    try {
      setIsUpdating(true);
      await dispatch(
        updateVideo({
          userId,
          videoId: updatedVideo._id,
          formData: updatedVideo,
          token,
        }),
      ).unwrap();
      dispatch(notify({ type: "success", message: "Video updated successfully" }));
      setEditModalOpen(false);
      await handleEditSuccess();
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not update video" }));
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (!video) return null;

  const thumbnailUrl = video?.youtubeLink && video?.youtubeVideoId
    ? `https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`
    : video?.thumbnail;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header: Back + Title + Edit/Delete */}
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
            Video Detail
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
              Edit Video
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 3, pt: 1 }}>
        {/* Category pill */}
        {video.category && (
          <Box sx={{ mb: 2 }}>
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
              {video.category}
            </Box>
          </Box>
        )}

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
          {video.title}
        </Typography>

        {/* Meta: date, views, share */}
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: 18, color: colors.lightGray }} />
            <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
              {formatArticleDetailDate(video.createdAt)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <VisibilityIcon sx={{ fontSize: 18, color: colors.lightGray }} />
            <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
              {formatViews(totalViews)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0, ml: "auto" }}>
            <IconButton onClick={handleShare} size="small" sx={{ color: "#720361" }}>
              <ShareIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Video player / thumbnail area */}
        <Box
          sx={{
            width: "100%",
            borderRadius: "12px",
            overflow: "hidden",
            mb: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            position: "relative",
            backgroundColor: "#f0f0f0",
            aspectRatio: "16 / 9",
          }}
        >
          {video.youtubeLink && video.youtubeVideoId ? (
            <iframe
              title="YouTube Video"
              src={`https://www.youtube.com/embed/${video.youtubeVideoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          ) : video.videoLink ? (
            <video
              controls
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              <source src={video.videoLink} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : thumbnailUrl ? (
            <>
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${thumbnailUrl})`,
                  backgroundSize: "cover",
                  filter: "blur(20px)",
                  transform: "scale(1.08)",
                }}
              />
              <Box
                component="img"
                src={thumbnailUrl}
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
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
              }}
            >
              <Typography>No video available</Typography>
            </Box>
          )}
        </Box>

        {/* Description if any */}
        {video.description && (
          <Typography
            variant="body1"
            sx={{
              fontFamily: fonts.sans,
              fontSize: "1rem",
              lineHeight: 1.7,
              color: colors.darkGray,
              mb: 3,
              whiteSpace: "pre-wrap",
            }}
          >
            {video.description}
          </Typography>
        )}

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
              {Number(averageRating).toFixed(1)} rating
            </Typography>
          </Box>
        </Box>
      </Box>

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Confirm Delete?"
        text="Are you sure you want to delete this video?"
        fonts={fonts}
        colors={colors}
        isButtonLoading={isDeleting}
      />
      {isCreator && (
        <EditVideoModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          video={video}
          onUpdate={handleUpdateVideo}
          isButtonLoading={isUpdating}
        />
      )}
      <SharingVideoModal
        open={shareModalOpen}
        handleClose={() => setShareModalOpen(false)}
        videoUrl={window.location.origin + `/video/${videoId}`}
        videoId={videoId}
        shareTitle={video?.title}
        modalTitle="Share Video"
      />
    </Box>
  );
};

export default VideoDetailContent;
