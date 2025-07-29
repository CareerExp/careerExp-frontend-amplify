import { Avatar, Divider, IconButton, Rating } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Box, Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  videoLikeIcon,
  videoLikeIconFilled,
  videoPlaylistIcon,
  videoShareIcon,
  videoViewsIcon,
} from "../assets/assest.js";
import Headers from "../components/Headers";
import { config } from "../config/config.js";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import AddVideoToPlaylistModal from "../models/AddVideoToPlaylistModal.jsx";
import SharingVideoModal from "../models/SharingVideoModal.jsx";
import { notify } from "../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../redux/slices/authSlice";
import { videoDetailById } from "../redux/slices/creatorSlice.js";
import {
  getLikeStatus,
  increaseViewsCount,
  selectUserLiked,
  toggleLike,
} from "../redux/slices/likeSlice";
import { getRatingStatus, rateVideo } from "../redux/slices/ratingSlice";
import { fonts } from "../utility/fonts.js";
import { updateUserProfile } from "../redux/slices/profileSlice.js";

const ExploreVideoPlay = () => {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const dispatchToRedux = useDispatch();

  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const userLiked = useSelector(selectUserLiked);

  const [videoData, setVideoData] = useState(null);
  const [averageRatingValue, setAverageRatingValue] = useState(0);
  const [userRatingValue, setUserRatingValue] = useState(0);
  const [creatorData, setCreatorData] = useState(null);
  const [viewsIncremented, setViewsIncremented] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  //playlist
  const [openAddVideoToPlaylistModal, setOpenAddVideoToPlaylistModal] =
    useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState("");

  //sharing
  const [openSharingModal, setOpenSharingModal] = useState(false);
  //loading
  const [pageLoading, setPageLoading] = useState(false);

  const handleCloseAddVideoToPlaylistModal = () => {
    setOpenAddVideoToPlaylistModal(false);
  };

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setPageLoading(true);
        const response = await dispatchToRedux(videoDetailById({ videoId }));
        if (response.payload) {
          setVideoData(response.payload.videoDetails);
          setCreatorData(response.payload.creatorDetails);
          setAverageRatingValue(response.payload.videoDetails.averageRating);
          setTotalLikes(response.payload.videoDetails.totalLikes);
          setPageLoading(false);
        }
      } catch (error) {
        setPageLoading(false);
        console.error("Error fetching video details:", error);
      }
    };

    fetchVideoDetails();
  }, [dispatchToRedux, videoId, authenticated]);

  useEffect(() => {
    if (authenticated && videoData) {
      dispatchToRedux(getLikeStatus({ userId, videoId: videoData._id, token }));
    }
  }, [dispatchToRedux, userId, videoData, token, authenticated]);

  useEffect(() => {
    if (!userId) {
      // Check if the watchedVideos data has expired
      const storedData = JSON.parse(
        localStorage.getItem("viewedVideosWithTimestamp")
      );

      if (storedData) {
        const { viewedVideos, timestamp } = storedData;
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        const currentTime = Date.now();

        if (currentTime - timestamp > oneHour) {
          // Delete the data if it has expired
          localStorage.removeItem("viewedVideosWithTimestamp");
        }
      }
    }
  }, [userId]);

  const handleInteractionUpdate = async () => {
    if (!authenticated || !videoData?.tags?.length) return;

    console.log("Video's tags", videoData.tags);

    await dispatchToRedux(
      updateUserProfile({
        userId,
        token,
        updatedData: { interests: videoData.tags }, // Send just the tags
      })
    );
  };

  useEffect(() => {
    if (videoData) {
      const storedData = JSON.parse(
        localStorage.getItem("viewedVideosWithTimestamp")
      ) || {
        viewedVideos: {},
        timestamp: Date.now(),
      };

      const { viewedVideos } = storedData;

      // Check if the video has already been viewed
      if (!viewedVideos[videoData._id]) {
        dispatchToRedux(increaseViewsCount({ videoId: videoData._id, userId }));
        setViewsIncremented(true);

        // Mark the video as viewed and update the timestamp
        viewedVideos[videoData._id] = true;
        localStorage.setItem(
          "viewedVideosWithTimestamp",
          JSON.stringify({ viewedVideos, timestamp: Date.now() })
        );

        // Update interests on view
        if (authenticated) handleInteractionUpdate();
      }
    }
  }, [viewsIncremented, videoData, dispatchToRedux]);

  useEffect(() => {
    const fetchRatingStatus = async () => {
      try {
        if (authenticated && videoData) {
          const response = await dispatchToRedux(
            getRatingStatus({ userId, videoId: videoData._id, token })
          );
          if (response.payload) {
            setUserRatingValue(response.payload.rating);
          }
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchRatingStatus();
  }, [dispatchToRedux, userId, videoData, token, authenticated]);

  const handleLikeToggle = async () => {
    if (!authenticated) {
      dispatchToRedux(
        notify({ message: "Please login to like the video", type: "warning" })
      );
      return;
    }
    if (authenticated && videoData) {
      const response = await dispatchToRedux(
        toggleLike({ userId, videoId: videoData._id, token })
      );
      if (response.payload) {
        setTotalLikes(response.payload.totalLikes);
        await handleInteractionUpdate();
      }
    }
  };

  const handleUserRatingChange = async (event, newValue) => {
    if (!authenticated) {
      navigate("/login");
      return;
    }

    try {
      // Optimistically update the UI
      setUserRatingValue(newValue);

      // Dispatch the rating action
      const response = await dispatchToRedux(
        rateVideo({
          videoId: videoData._id,
          userId,
          rating: newValue,
          token,
        })
      );

      if (response.payload) {
        dispatchToRedux(
          notify({ message: "Rating updated successfully", success: true })
        );
      } else {
        throw new Error("Failed to update rating");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
      dispatchToRedux(
        notify({
          message: "Failed to update rating. Please try again.",
          success: false,
        })
      );
    }
  };

  const handleAddToPlaylist = () => {
    setSelectedVideoId(videoData._id);
    setOpenAddVideoToPlaylistModal(true);
  };

  // function renderVideo() {
  //   if (!videoData) return null;

  //   if (videoData.youtubeLink) {
  //     return (
  //       <iframe
  //         title="YouTube Video"
  //         width="1120"
  //         height="630"
  //         src={`https://www.youtube.com/embed/${videoData.youtubeVideoId}`}
  //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  //         allowFullScreen
  //       ></iframe>
  //     );
  //   } else {
  //     return (
  //       <video
  //         width="1120"
  //         height="630"
  //         // controls={videoPlaying}
  //         // autoPlay={videoPlaying}
  //         controls
  //         // onPause={() => setVideoPlaying(false)}
  //       >
  //         <source src={videoData.videoLink} type="video/mp4" />
  //         Your browser does not support the video tag.
  //       </video>
  //     );
  //   }
  // }
  // import { Box } from '@mui/material';

  function renderVideo() {
    if (!videoData) return null;

    return (
      <Box
        sx={{
          position: "relative",
          width: {
            xs: "100%",
            sm: "100%",
            md: "100%",
            lg: "100%",
          },
          aspectRatio: "16 / 9",
          mx: "auto",
        }}
      >
        {videoData.youtubeLink ? (
          <iframe
            title="YouTube Video"
            src={`https://www.youtube.com/embed/${videoData.youtubeVideoId}`}
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
          ></iframe>
        ) : (
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
            <source src={videoData.videoLink} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Box>
    );
  }

  const handleSharingModal = async () => {
    setOpenSharingModal(true);
    await handleInteractionUpdate();
  };

  const handleSharingCloseModal = () => {
    setOpenSharingModal(false);
  };

  return (
    <Box sx={{ height: "170vh", margin: 1 }}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          height: "5rem",
        }}
      >
        <Headers />
      </Box>
      {pageLoading ? (
        <Box>
          <InitialLoaders />
        </Box>
      ) : (
        <Container
          sx={{
            paddingTop: "25rem",
            height: "100vh",
            padding: { xs: "0 0.5rem", sm: "0 1rem", md: "0 2rem" },
            marginTop: { xs: "1rem", sm: "3rem", md: "4rem" },
          }}
        >
          <Box sx={{ px: { sm: "0.5rem", md: "1rem" } }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                lineHeight: { xs: 1.4, md: 1.3 },
                width: "100%",
              }}
            >
              {videoData?.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                mt: { xs: 0.5, md: 1 },
                alignItems: "center",
              }}
            >
              {/* Category */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "gray",
                  fontSize: "0.875rem",
                }}
              >
                Category:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "black",
                  fontSize: "0.875rem",
                  ml: 0.5,
                }}
              >
                {videoData?.category}
              </Typography>

              {/* Divider */}
              <Typography
                component="span"
                sx={{
                  color: "gray",
                  mx: 1.25,
                  fontSize: "1rem",
                }}
              >
                |
              </Typography>

              {/* Updated On */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "gray",
                  fontSize: "0.875rem",
                }}
              >
                Updated on:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "black",
                  fontSize: "0.875rem",
                  ml: 0.5,
                }}
              >
                {new Date(videoData?.updatedAt).toLocaleDateString()}
              </Typography>

              {/* Divider */}
              <Typography
                component="span"
                sx={{
                  color: "gray",
                  mx: 1.25,
                  fontSize: "1rem",
                }}
              >
                |
              </Typography>

              {/* Language */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "gray",
                  fontSize: "0.875rem",
                }}
              >
                Language:
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "black",
                  fontSize: "0.875rem",
                  ml: 0.5,
                }}
              >
                {videoData?.language}
              </Typography>

              {/* Divider */}
              <Typography
                component="span"
                sx={{
                  color: "gray",
                  mx: 1.25,
                  fontSize: "1rem",
                }}
              >
                |
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "gray",
                  fontSize: "0.875rem",
                }}
              >
                Rating:
              </Typography>

              <IconButton>
                <Rating
                  sx={{ fontSize: "1rem" }}
                  name="read-only"
                  readOnly
                  value={averageRatingValue}
                />
                <Typography
                  sx={{
                    color: "gray",
                    mx: 0.25,
                    fontSize: "1rem",
                  }}
                >
                  ({videoData?.totalRatings})
                </Typography>
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "2rem",
              marginTop: "1rem",
            }}
          >
            {renderVideo()}
          </Box>
          {/* /* Like, Rating, and Playlist Section */}
          {/* <Box
            sx={{
              display: "flex",
              // justifyContent: "space-between",
              // marginTop: "1rem",
              // px: "2rem",
              // marginBottom: "2rem",
              flexDirection: {
                xs: "column",
                sm: "column",
                md: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "flex-start",
                md: "center",
              },
              marginTop: "1rem",
              marginBottom: "2rem",
              px: {
                xs: "1rem",
                sm: "1.5rem",
                md: "2rem",
              },
              gap: {
                xs: "1rem",
                sm: "1rem",
                md: 0,
              },
              border: "1px solid black",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
                onClick={handleLikeToggle}
              >
                <img
                  src={userLiked ? videoLikeIconFilled : videoLikeIcon}
                  alt="Video Like"
                  style={{ width: "40px" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "1rem",
                  }}
                >
                  {videoData?.totalLikes} Likes
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img src={videoViewsIcon} alt="Video Views" style={{ width: "40px" }} />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "1rem",
                  }}
                >
                  {videoData?.totalViews} Views
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Rating
                  sx={{ fontSize: "1.5rem", color: "#FF8A00" }}
                  name="simple-controlled"
                  value={userRatingValue}
                  onChange={handleUserRatingChange}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "0.875rem",
                  }}
                >
                  Your Rating
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Box sx={{ cursor: "pointer" }} onClick={handleSharingModal}>
                <img src={videoShareIcon} alt="Video Share" style={{ width: "40px" }} />
              </Box>

              <Box sx={{ cursor: "pointer" }} onClick={handleAddToPlaylist}>
                <img src={videoPlaylistIcon} alt="video Playlist" style={{ width: "40px" }} />
              </Box>
            </Box>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "column",
                md: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "flex-start",
                md: "center",
              },
              marginTop: "1rem",
              marginBottom: "2rem",
              px: {
                xs: "1rem",
                sm: "1.5rem",
                md: "2rem",
              },
              gap: {
                xs: "1rem",
                sm: "1rem",
                md: 0,
              },
              // border: "1px solid black",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={handleLikeToggle}
              >
                <img
                  src={userLiked ? videoLikeIconFilled : videoLikeIcon}
                  alt="Video Like"
                  style={{ width: "40px" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "1rem",
                  }}
                >
                  {totalLikes} Likes
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <img
                  src={videoViewsIcon}
                  alt="Video Views"
                  style={{ width: "40px" }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "1rem",
                  }}
                >
                  {videoData?.totalViews} Views
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Rating
                  sx={{ fontSize: "1.5rem", color: "#FF8A00" }}
                  name="simple-controlled"
                  value={userRatingValue}
                  onChange={handleUserRatingChange}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "0.875rem",
                  }}
                >
                  Your Rating
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                mt: { xs: "1rem", md: 0 },
              }}
            >
              <Box sx={{ cursor: "pointer" }} onClick={handleSharingModal}>
                <img
                  src={videoShareIcon}
                  alt="Video Share"
                  style={{ width: "40px" }}
                />
              </Box>

              <Box sx={{ cursor: "pointer" }} onClick={handleAddToPlaylist}>
                <img
                  src={videoPlaylistIcon}
                  alt="video Playlist"
                  style={{ width: "40px" }}
                />
              </Box>
            </Box>
          </Box>

          {/* Video Description */}
          <Box
            sx={{
              border: "1px solid #cecece",
              backgroundColor: "#f2f2f2",
              borderRadius: "10px",

              px: "1rem",
              width: "95%",
              margin: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                py: "1rem",
              }}
            >
              <Avatar
                alt="Remy Sharp"
                src={creatorData?.profilePicture}
                sx={{ width: 80, height: 80 }}
              />
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "black",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/profile/${creatorData?._id}`)}
                >
                  {creatorData?.firstName + " " + creatorData?.lastName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: fonts.poppins,
                    color: "gray",
                    fontSize: "0.875rem",
                  }}
                >
                  COUNSELLOR
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box sx={{ p: 2, marginBottom: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  marginTop: "1rem",
                  lineHeight: 1.6,
                  fontSize: "1rem",
                  color: "text.secondary",
                  width: "100%",
                  margin: "auto",
                }}
              >
                {videoData?.description}
              </Typography>
            </Box>
          </Box>
        </Container>
      )}
      <AddVideoToPlaylistModal
        open={openAddVideoToPlaylistModal}
        userId={userId}
        authenticated={authenticated}
        token={token}
        onClose={handleCloseAddVideoToPlaylistModal}
        videoId={selectedVideoId}
      />
      <SharingVideoModal
        open={openSharingModal}
        handleClose={handleSharingCloseModal}
        videoUrl={`${config?.frontendDomain}/video/${videoId}`} // Replace with your actual video URL
        videoId={videoId}
      />
    </Box>
  );
};

export default ExploreVideoPlay;
