import CloseIcon from "@mui/icons-material/Close";
import { Avatar, Box, DialogTitle, Divider, Rating } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { videoLikeIcon, videoPlaylistIcon, videoShareIcon, videoViewsIcon } from "../assets/assest.js";
import { videoDetailById } from "../redux/slices/creatorSlice.js";
import { fonts } from "../utility/fonts.js";

const ExploreVideoPlayPopup = ({ open, onClose, videoId }) => {
  const dispatchToRedux = useDispatch();

  const [averageRatingValue, setAverageRatingValue] = useState(0);
  const [creatorData, setCreatorData] = useState(null);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (open && videoId) {
      const fetchVideoDetails = async () => {
        try {
          const response = await dispatchToRedux(videoDetailById({ videoId }));
          if (response.payload) {
            setVideoData(response.payload.videoDetails);
            setCreatorData(response.payload.creatorDetails);
            setAverageRatingValue(response.payload.videoDetails.averageRating);
          }
        } catch (error) {
          console.error("Error fetching video details:", error);
        }
      };

      fetchVideoDetails();
    }
  }, [dispatchToRedux, videoId, open]);

  function renderVideo() {
    if (!videoData) return null;

    if (videoData.youtubeLink) {
      return (
        <iframe
          title="YouTube Video"
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoData.youtubeVideoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    } else {
      return (
        <video
          width="560"
          height="315"
          // controls={videoPlaying}
          // autoPlay={videoPlaying}
          controls
          // onPause={() => setVideoPlaying(false)}
        >
          <source src={videoData.videoLink} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      sx={{ "& .MuiDialog-paper": { width: "600px", maxWidth: "none", borderRadius: "20px" } }}
    >
      <Box>
        <Box sx={{ px: "1rem" }}>
          <DialogTitle sx={{ position: "relative" }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 600,
                fontSize: "1.5rem",
                lineHeight: 1.3,
                width: "100%",
                py: "0.5rem",
              }}
            >
              {videoData?.title}
            </Typography>

            {/* Close Icon */}
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              mt: "-2rem",
              // border: "1px solid black",
            }}
          >
            {/* Category */}

            {/* Divider */}
            <Typography
              component="span"
              sx={{
                color: "gray",
                mx: 1.25,
                fontSize: "1rem",
              }}
            ></Typography>

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
              <Rating sx={{ fontSize: "1rem" }} name="read-only" readOnly value={averageRatingValue} />
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

        {/* render video  */}
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "-1.5rem",
            px: "2rem",
            marginBottom: "0.5rem",
            //   border: "1px solid black",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <img src={videoLikeIcon} alt="Video Like" style={{ width: "20px" }} />
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "gray",
                  fontSize: "0.9rem",
                }}
              >
                {videoData?.totalLikes} Likes
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <img src={videoViewsIcon} alt="Video Views" style={{ width: "20px" }} />
              <Typography
                variant="body1"
                sx={{
                  fontFamily: fonts.poppins,
                  color: "gray",
                  fontSize: "0.9rem",
                }}
              >
                {videoData?.totalViews} Views
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Box sx={{ cursor: "pointer" }}>
              <img src={videoShareIcon} alt="Video Share" style={{ width: "25px" }} />
            </Box>

            <Box sx={{ cursor: "pointer" }}>
              <img src={videoPlaylistIcon} alt="video Playlist" style={{ width: "25px" }} />
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
            marginBottom: "1rem",
          }}
        >
          <Box sx={{ display: "flex", gap: "1rem", alignItems: "center", py: "1rem" }}>
            <Avatar alt="Remy Sharp" src={creatorData?.profilePicture} sx={{ width: 50, height: 50 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Typography
                variant="body1"
                sx={{ fontFamily: fonts.poppins, color: "black", fontSize: "0.9rem", fontWeight: "600" }}
              >
                {creatorData?.firstName + " " + creatorData?.lastName}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontFamily: fonts.poppins, color: "gray", fontSize: "0.675rem", mt: "-0.5rem" }}
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
                fontSize: "0.7rem",
                color: "text.secondary",
                width: "100%",
                margin: "auto",
              }}
            >
              {videoData?.description}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* )} */}
    </Dialog>
  );
};

export default ExploreVideoPlayPopup;
