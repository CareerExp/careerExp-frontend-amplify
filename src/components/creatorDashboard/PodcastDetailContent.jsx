import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ForwardIcon from "@mui/icons-material/Forward";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Rating,
  Slider,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../../redux/slices/authSlice.js";
import {
  getPodcastDetail,
  getPodcastLikeStatus,
  getPodcastRatingStatus,
  increasePodcastSharesCount,
  increasePodcastViewsCount,
  ratePodcast,
  togglePodcastLike,
} from "../../redux/slices/creatorSlice.js";
import {
  getPodcastBookmarkStatus,
  addPodcastBookmark,
  removePodcastBookmark,
} from "../../redux/slices/bookmarkSlice.js";
import SharingVideoModal from "../../models/SharingVideoModal.jsx";
import { colors } from "../../utility/color.js";
import { formatArticleDetailDate } from "../../utility/convertTimeToUTC.js";
import { fonts } from "../../utility/fonts.js";

function formatListeners(num) {
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k listeners`;
  return `${num} listener${num !== 1 ? "s" : ""}`;
}

/** Format duration in seconds to "X min Y sec" */
function formatDuration(seconds) {
  if (seconds == null || isNaN(Number(seconds))) return "";
  const s = Math.floor(Number(seconds));
  const min = Math.floor(s / 60);
  const sec = s % 60;
  if (min === 0) return `${sec} sec`;
  if (sec === 0) return `${min} min`;
  return `${min} min ${sec} sec`;
}

/** Format seconds as "M:SS", "MM:SS", or "H:MM:SS" for player display (Spotify-style) */
function formatTimeMMSS(seconds) {
  if (seconds == null || isNaN(Number(seconds))) return "0:00";
  const s = Math.floor(Number(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => (n < 10 ? "0" : "") + n;
  if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`;
  return `${m}:${pad(sec)}`;
}

const PodcastDetailContent = ({ podcastId, onBack, embedded = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);

  const [podcast, setPodcast] = useState(null);
  const [creator, setCreator] = useState(null);
  const [spotifyEmbedUrl, setSpotifyEmbedUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [bookmarking, setBookmarking] = useState(false);
  const audioRef = useRef(null);
  const viewCountRef = useRef(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!podcastId) return;
      try {
        setLoading(true);
        const res = await dispatch(getPodcastDetail({ podcastId })).unwrap();
        const details = res?.podcastDetails || res?.podcast;
        const creatorDetails = res?.creatorDetails || res?.creator;
        if (details) {
          setPodcast(details);
          setCreator(creatorDetails || null);
          setSpotifyEmbedUrl(res?.spotifyEmbedUrl ?? details?.spotifyEmbedUrl ?? null);
          setTotalViews(details.totalViews ?? 0);
          setTotalLikes(details.totalLikes ?? 0);
          setAverageRating(Number(details.averageRating) || 0);
        }
      } catch (e) {
        dispatch(notify({ type: "error", message: "Podcast not found" }));
        onBack?.();
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [podcastId, dispatch, onBack]);

  useEffect(() => {
    if (!podcast?._id || viewCountRef.current) return;
    viewCountRef.current = true;
    dispatch(
      increasePodcastViewsCount({
        podcastId: podcast._id,
        userId: authenticated ? userId : undefined,
      }),
    )
      .unwrap()
      .then((payload) => {
        if (payload?.updatedValue != null) setTotalViews(payload.updatedValue);
      })
      .catch(() => {});
  }, [podcast?._id, authenticated, userId, dispatch]);

  useEffect(() => {
    if (authenticated && podcastId && podcast?._id && token && userId) {
      dispatch(getPodcastLikeStatus({ podcastId: podcast._id, userId, token }))
        .unwrap()
        .then((p) => setUserLiked(!!p?.userLiked))
        .catch(() => {});
      dispatch(getPodcastRatingStatus({ podcastId: podcast._id, userId, token }))
        .unwrap()
        .then((p) => setUserRating(Number(p?.rating) || 0))
        .catch(() => {});
      dispatch(getPodcastBookmarkStatus({ podcastId: podcast._id, token }))
        .unwrap()
        .catch(() => {});
    }
  }, [authenticated, podcastId, podcast?._id, userId, token, dispatch]);

  const handleShare = () => {
    setShareModalOpen(true);
  };

  const handleShareAction = () => {
    if (podcast?._id) {
      dispatch(
        increasePodcastSharesCount({
          podcastId: podcast._id,
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
    if (!podcast?._id) return;
    try {
      const p = await dispatch(
        togglePodcastLike({ podcastId: podcast._id, userId, token }),
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
    if (!podcast?._id || value == null) return;
    try {
      const p = await dispatch(
        ratePodcast({ podcastId: podcast._id, userId, token, rating: value }),
      ).unwrap();
      setUserRating(value);
      if (p?.averageRating != null) setAverageRating(p.averageRating);
    } catch (e) {
      dispatch(notify({ type: "error", message: "Could not submit rating" }));
    }
  };

  const handleManualPlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (_e, value) => {
    const seconds = Number(value);
    if (audioRef.current && !isNaN(seconds)) {
      audioRef.current.currentTime = seconds;
      setAudioCurrentTime(seconds);
    }
  };

  const handleRewind15 = () => {
    if (!audioRef.current) return;
    const next = Math.max(0, audioRef.current.currentTime - 15);
    audioRef.current.currentTime = next;
    setAudioCurrentTime(next);
  };

  const podcastBookmarked = useSelector(
    (state) => state.bookmark?.podcastBookmarkStatus?.[podcast?._id || podcastId] ?? false,
  );

  const handleBookmarkClick = async () => {
    if (!authenticated) {
      dispatch(notify({ type: "warning", message: "Please login to bookmark" }));
      return;
    }
    const id = podcast?._id || podcastId;
    if (!id || bookmarking) return;
    setBookmarking(true);
    try {
      if (podcastBookmarked) {
        await dispatch(removePodcastBookmark({ podcastId: id, token })).unwrap();
        dispatch(notify({ type: "success", message: "Removed from bookmarks" }));
      } else {
        await dispatch(addPodcastBookmark({ podcastId: id, token })).unwrap();
        dispatch(notify({ type: "success", message: "Added to bookmarks" }));
      }
    } catch (e) {
      dispatch(notify({ type: "error", message: e?.message || "Could not update bookmark" }));
    } finally {
      setBookmarking(false);
    }
  };

  const handleForward15 = () => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration;
    const next = duration ? Math.min(duration, audioRef.current.currentTime + 15) : audioRef.current.currentTime + 15;
    audioRef.current.currentTime = next;
    setAudioCurrentTime(next);
  };

  const authorName = creator
    ? [creator.firstName, creator.lastName].filter(Boolean).join(" ") || "Author"
    : "Author";
  const durationSeconds = podcast?.duration ?? 0;
  const durationLabel = formatDuration(durationSeconds);
  const audioLink = podcast?.audioLink || podcast?.audioUrl;
  const timelineDuration = audioDuration || durationSeconds || 0;
  const timelineValue = Math.min(audioCurrentTime, timelineDuration || 1);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <Typography color="text.secondary">Loading...</Typography>
      </Box>
    );
  }

  if (!podcast) return null;

  const content = (
    <>
      {embedded ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <IconButton onClick={onBack} sx={{ color: "#FFFFFF", backgroundColor: "#BC2876" }} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography sx={{ fontFamily: fonts.poppins, fontWeight: 700, fontSize: "1.25rem", color: colors.darkGray }}>
            Podcast Detail
          </Typography>
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
            Back to Podcasts
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: embedded ? "block" : "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          // minHeight: "100vh",
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
          {/* Title at top */}
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
            {podcast.title}
          </Typography>

         

          {/* Category, date, duration (no thumbnail - Spotify embed has its own artwork) */}
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2, mb: 3 }}>
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
              {podcast.category || "Podcast"}
            </Box>
            {/* <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 18, color: colors.lightGray }} />
              <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
                {formatArticleDetailDate(podcast.createdAt)}
              </Typography>
            </Box>
            {durationLabel && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: colors.lightGray }} />
                <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
                  {durationLabel}
                </Typography>
              </Box>
            )} */}
          </Box>

          {/* Player: Spotify embed (plays on site) or manual audio - same pattern as video */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "100%",
              minHeight: spotifyEmbedUrl ? { xs: 152, sm: 200 } : undefined,
              height: spotifyEmbedUrl ? { xs: 152, sm: 200 } : undefined,
              aspectRatio: spotifyEmbedUrl ? undefined : "3 / 1",
              mx: "auto",
              mb: 3,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {spotifyEmbedUrl ? (
              <iframe
                title="Spotify Podcast"
                src={spotifyEmbedUrl}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  minHeight: 152,
                  border: 0,
                  borderRadius: 12,
                }}
              />
            ) : audioLink ? (
              /* Manual upload: custom audio card (thumbnail left, details + controls right) */
              <>
                <audio
                  ref={audioRef}
                  src={audioLink}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={() => audioRef.current && setAudioCurrentTime(audioRef.current.currentTime)}
                  onLoadedMetadata={() => audioRef.current && setAudioDuration(audioRef.current.duration)}
                  style={{ display: "none" }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#006767",
                    borderRadius: "12px",
                    overflow: "hidden",
                    height: "16rem",
                  }}
                >
                  {/* Left: counsellor-uploaded thumbnail */}
                  <Box
                    sx={{
                      width: { xs: "120px", sm: "300px" },
                      minWidth: { xs: 120, sm: 160 },
                      flexShrink: 0,
                      backgroundColor: "#004d4d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      padding: "12px",
                    }}
                  >
                    <img
                      src={podcast.thumbnail || podcast.bannerImage || "https://via.placeholder.com/160?text=Podcast"}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  {/* Right: title, subtitle, Save, duration, play */}
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      p: 2,
                      pl: { xs: 1.5, sm: 2 },
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          fontWeight: 700,
                          fontSize: { xs: "0.9375rem", sm: "1.5rem" },
                          color: "#fff",
                          lineHeight: 1.3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {podcast.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: "0.8125rem",
                          color: "rgba(255,255,255,0.85)",
                          mt: 0.5,
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {formatArticleDetailDate(podcast.createdAt)}
                        {podcast.category ? ` · ${podcast.category}` : ""}
                      </Typography>
                    </Box>
                    {/* Timeline: Spotify-style — rewind 15, progress bar, duration, play */}
                    <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={handleRewind15}
                        sx={{ color: "rgba(255,255,255,0.9)", p: 0.5 }}
                        aria-label="Rewind 15 seconds"
                      >
                        <ReplayIcon sx={{ fontSize: 28 }} />
                      </IconButton>
                      <Box sx={{ flex: 1, display: "flex", alignItems: "center", minWidth: 0 }}>
                        <Slider
                          size="small"
                          value={timelineDuration > 0 ? timelineValue : 0}
                          min={0}
                          max={timelineDuration || 1}
                          step={0.1}
                          onChange={handleSeek}
                          sx={{
                            color: "rgba(255,255,255,0.85)",
                            py: 0.5,
                            "& .MuiSlider-thumb": { width: 10, height: 10 },
                            "& .MuiSlider-rail": { opacity: 0.4 },
                            "& .MuiSlider-track": { opacity: 0.9 },
                          }}
                          aria-label="Seek"
                        />
                      </Box>
                      <Typography sx={{ fontFamily: fonts.sans, fontSize: "0.8125rem", color: "rgba(255,255,255,0.9)", minWidth: 48 }}>
                        {formatTimeMMSS(timelineDuration)}
                      </Typography>
                      <IconButton
                        onClick={handleManualPlayPause}
                        sx={{
                          color: "#006767",
                          backgroundColor: "#fff",
                          width: 48,
                          height: 48,
                          "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                        }}
                        aria-label={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontFamily: fonts.sans, color: "text.secondary" }}>
                  Audio not available for playback.
                </Typography>
              </Box>
            )}
          </Box>

           {/* Description */}
          {podcast.description && (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "1rem",
                lineHeight: 1.6,
                color: colors.darkGray,
                mb: 2,
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {podcast.description}
            </Typography>
          )}

          {/* Engagement: likes, listeners, rating, share, bookmark */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 3,
              pt: 3,
              borderTop: "1px solid #eee",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: authenticated ? "pointer" : "default",
              }}
              onClick={authenticated ? handleLike : undefined}
            >
              <IconButton size="small" sx={{ color: userLiked ? "#720361" : colors.lightGray }}>
                {userLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
                {totalLikes} like{totalLikes !== 1 ? "s" : ""}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <HeadphonesIcon sx={{ fontSize: 20, color: colors.lightGray }} />
              <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
                {formatListeners(totalViews)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Rating
                value={userRating || averageRating}
                readOnly={!authenticated}
                size="small"
                onChange={handleRate}
                sx={{ "& .MuiRating-iconFilled": { color: "#ffb400" } }}
              />
              <Typography variant="body2" sx={{ color: colors.darkGray, fontFamily: fonts.sans }}>
                {averageRating.toFixed(1)} rating
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0, ml: "auto" }}>
              <IconButton onClick={handleShare} size="small" sx={{ color: "#720361" }}>
                <ShareIcon />
              </IconButton>
              {!embedded && (
                <IconButton
                  size="small"
                  sx={{ color: "#720361" }}
                  aria-label={podcastBookmarked ? "Remove bookmark" : "Bookmark"}
                  onClick={handleBookmarkClick}
                  disabled={bookmarking}
                >
                  {podcastBookmarked ? (
                    <BookmarkIcon sx={{ color: "#720361" }} />
                  ) : (
                    <BookmarkBorderIcon />
                  )}
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        {/* About the Author - public page only */}
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
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <Avatar src={creator.profilePicture} sx={{ width: 72, height: 72 }} />
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

  const shareUrl = window.location.origin + `/podcast/${podcastId}`;

  if (embedded) {
    return (
      <Box sx={{ width: "100%" }}>
        {content}
        <SharingVideoModal
          open={shareModalOpen}
          handleClose={() => setShareModalOpen(false)}
          videoUrl={shareUrl}
          videoId={podcastId}
          shareTitle={podcast?.title}
          modalTitle="Share Podcast"
          onShare={handleShareAction}
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
      <SharingVideoModal
        open={shareModalOpen}
        handleClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
        videoId={podcastId}
        shareTitle={podcast?.title}
        modalTitle="Share Podcast"
        onShare={handleShareAction}
      />
    </Box>
  );
};

export default PodcastDetailContent;
