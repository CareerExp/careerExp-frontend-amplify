import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import CreatePlaylistModal from "../../models/CreatePlaylistModal.jsx";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { purpleMove } from "../../assets/assest.js";
import { fonts } from "../../utility/fonts.js";
import {
  getUserPlaylist,
  selectAllPlaylistName,
  selectPlayListData,
  removeVideoFromPlaylist,
  moveVideoToDifferentPlaylist,
  deletePlaylist,
} from "../../redux/slices/playlistSlice.js";
const UserPlaylist = () => {
  const navigate = useNavigate();
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const playlistData = useSelector(selectPlayListData);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [selectedPlaylistVideos, setSelectedPlaylistVideos] = useState([]);
  //for moving video to another playlist
  const [openMoveModal, setOpenMoveModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [targetPlaylistId, setTargetPlaylistId] = useState("");

  const handleChange = (event) => {
    setSelectedPlaylist(event.target.value);

    // Find the selected playlist and update selectedPlaylistVideos
    const playlist = playlistData.find((playlist) => playlist._id === event.target.value);
    if (playlist) {
      setSelectedPlaylistVideos(playlist.videoId);
    } else {
      setSelectedPlaylistVideos([]);
    }
  };

  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState(false);

  useEffect(() => {
    dispatchToRedux(getUserPlaylist({ userId, token }));
  }, [userId, dispatchToRedux]);

  // Update selectedPlaylistVideos when playlistData changes
  useEffect(() => {
    if (selectedPlaylist) {
      const playlist = playlistData.find((playlist) => playlist._id === selectedPlaylist);
      if (playlist) {
        setSelectedPlaylistVideos(playlist.videoId);
      } else {
        // If the selected playlist was deleted
        setSelectedPlaylist("");
        setSelectedPlaylistVideos([]);
      }
    }
  }, [playlistData, selectedPlaylist]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} style={{ color: i < rating ? "#FFD700" : "#E1E1E1" }}>
          ★
        </span>,
      );
    }
    return <>{stars}</>;
  };

  const handleCreatePlaylist = () => {
    setOpenCreatePlaylistModal(true);
  };
  const handleCloseModal = () => {
    setOpenCreatePlaylistModal(false);
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      // If we're deleting the currently selected playlist
      if (selectedPlaylist === playlistId) {
        setSelectedPlaylist("");
        setSelectedPlaylistVideos([]);
      }

      await dispatchToRedux(deletePlaylist({ playlistId, token }));
      dispatchToRedux(notify({ type: "success", message: "Playlist deleted successfully" }));
    } catch (error) {
      console.error("Error deleting playlist:", error);
      dispatchToRedux(notify({ type: "error", message: "Failed to delete playlist" }));
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await dispatchToRedux(removeVideoFromPlaylist({ playlistId: selectedPlaylist, videoId, token }));

      // Update the selectedPlaylistVideos directly for immediate UI update
      setSelectedPlaylistVideos((prev) => prev.filter((video) => video._id !== videoId));

      dispatchToRedux(notify({ type: "success", message: "Video removed from playlist" }));
    } catch (error) {
      console.error("Error removing video from playlist:", error);
      dispatchToRedux(notify({ type: "error", message: "Failed to remove video" }));
    }
  };

  // Open the modal and set the video ID
  const handleOpenMoveModal = (videoId) => {
    setCurrentVideoId(videoId);
    setOpenMoveModal(true);
  };

  // Close the modal
  const handleCloseMoveModal = () => {
    setOpenMoveModal(false);
    setCurrentVideoId("");
    setTargetPlaylistId("");
  };

  const handleMoveVideo = async () => {
    if (!targetPlaylistId || targetPlaylistId === selectedPlaylist) {
      dispatchToRedux(
        notify({
          type: "error",
          message:
            targetPlaylistId === selectedPlaylist
              ? "Cannot move to the same playlist"
              : "Please select a target playlist",
        }),
      );
      return;
    }

    setOpenMoveModal(false);

    try {
      await dispatchToRedux(
        moveVideoToDifferentPlaylist({
          sourcePlaylistId: selectedPlaylist,
          targetPlaylistId,
          videoId: currentVideoId,
          token,
        }),
      );

      // Update the selectedPlaylistVideos directly for immediate UI update
      setSelectedPlaylistVideos((prev) => prev.filter((video) => video._id !== currentVideoId));

      dispatchToRedux(notify({ type: "success", message: "Video moved to another playlist" }));

      // Clear the state
      setCurrentVideoId("");
      setTargetPlaylistId("");
    } catch (error) {
      console.error("Error moving video to another playlist:", error);
      dispatchToRedux(notify({ type: "error", message: "Failed to move video" }));
    }
  };

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          backgroundColor: "white",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem 0",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "600",
              fontFamily: fonts.sans,
              fontSize: { xs: "1rem", sm: "1.5rem", md: "2rem" }, // Responsive font size
            }}
          >
            All Playlists
          </Typography>
          <Button
            onClick={handleCreatePlaylist}
            sx={{
              backgroundImage: "linear-gradient(to top left, #720361, #bf2f75)",
              border: "none",
              padding: { xs: "0.3rem 1rem", sm: "0.3rem 1rem", md: "0.6rem 1rem" },
              borderRadius: "90px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "fit-content",
              fontSize: { xs: "1rem", sm: "1rem", md: "1.125rem" },
              gap: "0.875rem",
              color: "white",
              cursor: "pointer",
              textTransform: "none",
              "&:hover": {
                backgroundImage: "linear-gradient(to top left, #720361, #bf2f75)",
              },
            }}
          >
            Create Playlist
          </Button>
        </Box>

        <Box sx={{ width: "100%", padding: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="playlist-select-label">Select Playlist</InputLabel>
            <Select
              labelId="playlist-select-label"
              id="playlist-select"
              value={selectedPlaylist}
              onChange={handleChange}
              label="Select Playlist"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "gray", // Default border color
                  },
                  "&:hover fieldset": {
                    borderColor: "pink", // Border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "pink", // Border color when focused
                  },
                },
                "& .MuiSelect-icon": {
                  color: "pink", // Pink icon color
                },
                "&:hover .MuiSelect-icon": {
                  color: "darkpink", // Darker pink icon color on hover
                },
                "& .MuiFormHelperText-root": {
                  color: "pink", // Helper text color
                },
              }}
            >
              {playlistData?.map((playlist) => (
                <MenuItem
                  key={playlist._id}
                  // value={playlist.videoId}
                  value={playlist._id}
                  // value={playlist.videoId.length > 0 ? playlist.videoId : null}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 182, 193, 0.5)", // Light pink hover effect
                    },
                  }}
                >
                  {playlist.playlistName}
                </MenuItem>
              ))}
            </Select>
            {/* Optional: You can display a helper text or error message */}
            <FormHelperText>Select a playlist from the list</FormHelperText>
          </FormControl>
        </Box>

        <Box
          sx={{
            height: "30vh",
            width: "100%",
            marginTop: "1rem",
          }}
        >
          {selectedPlaylistVideos?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
                borderRadius: "20px",
                // border: "1px dashed #ddd",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: "600",
                  fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.5rem" },
                }}
              >
                No Video Found in selected playlist
              </Typography>
            </Box>
          ) : (
            <Box sx={{ padding: { xs: "0rem", sm: "0rem", md: "2rem" } }}>
              <Grid container spacing={3}>
                {selectedPlaylistVideos?.map((video) => (
                  <Grid item xs={12} sm={6} md={4} key={video._id}>
                    <Box
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: "15px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        padding: { xs: "0.5rem", sm: "0rem", md: "1rem" },
                        position: "relative",
                        height: "22rem",
                      }}
                    >
                      <img
                        // src={video.thumbnailUrl}
                        src={
                          video.youtubeLink
                            ? `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`
                            : video.thumbnail
                        }
                        alt={video.title}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />

                      <Typography variant="h6" sx={{ marginTop: "1rem" }}>
                        {/* {video.title}
                         */}
                        {video.title.length > 17 ? video.title.slice(0, 17) + "..." : video.title}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {renderStars(video.averageRating)}
                        <Typography variant="body2" sx={{ marginLeft: "0.5rem" }}>
                          ({video.totalRatings})
                        </Typography>
                      </Box>

                      <Typography variant="body2" sx={{ color: "#777", marginTop: "0.5rem" }}>
                        Shared with: <span style={{ fontWeight: "bold" }}>{video?.userShared} users</span>
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          gap: "0.5rem",
                          marginTop: "1rem",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: video.watched ? "#720361" : "#f8f8f8",
                            color: video.watched ? "white" : "black",
                            textTransform: "none",
                            borderRadius: "42px",
                            width: "95px",
                            "&:hover": {
                              backgroundColor: video.watched ? "#720361" : "#f8f8f8", // Keep the same background color on hover
                              color: video.watched ? "white" : "black", // Keep the same color on hover
                            },
                          }}
                        >
                          {video.watched ? "Viewed" : "Not Viewed"}
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: video.rated ? "#720361" : "#f8f8f8",
                            color: video.rated ? "white" : "black",
                            textTransform: "none",
                            borderRadius: "42px",
                            width: "95px",
                            "&:hover": {
                              backgroundColor: video.watched ? "#720361" : "#f8f8f8", // Keep the same background color on hover
                              color: video.watched ? "white" : "black", // Keep the same color on hover
                            },
                          }}
                        >
                          Rated
                        </Button>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: video.liked ? "#720361" : "#f8f8f8",
                            color: video.liked ? "white" : "black",
                            textTransform: "none",
                            borderRadius: "42px",
                            width: "95px",
                            "&:hover": {
                              backgroundColor: video.watched ? "#720361" : "#f8f8f8", // Keep the same background color on hover
                              color: video.watched ? "white" : "black", // Keep the same color on hover
                            },
                          }}
                        >
                          Liked
                        </Button>
                      </Box>

                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: "8rem",
                          right: "1rem",
                          color: "#FF4D4D",
                        }}
                        onClick={() => handleRemoveVideo(video._id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: "8rem",
                          right: "3.5rem",
                          color: "#FF4D4D",
                        }}
                        onClick={() => handleOpenMoveModal(video._id)}
                      >
                        <img src={purpleMove} alt="Move" width={"25px"} />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
      {openMoveModal && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "80%", md: 500 },
            bgcolor: "#F9FAFB", // Light gray background for better contrast
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow
            borderRadius: "20px",
            border: "1px solid #ddd",
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              padding: "2rem",
              backgroundColor: "white",
              borderRadius: "20px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: "1.5rem",
                fontFamily: fonts.sans,
                fontWeight: "bold",
                textAlign: "center",
                color: "#333", // Darker text for readability
                fontSize: { xs: "1rem", sm: "1.25rem", md: "1.25rem" }, // Responsive font size
              }}
            >
              Move Video to Another Playlist
            </Typography>
            <FormControl fullWidth sx={{ marginTop: "1rem" }}>
              <InputLabel id="target-playlist-select-label">Select Playlist</InputLabel>
              <Select
                labelId="target-playlist-select-label"
                value={targetPlaylistId}
                onChange={(e) => setTargetPlaylistId(e.target.value)}
              >
                {playlistData.map((playlist) => (
                  <MenuItem key={playlist._id} value={playlist._id}>
                    {playlist.playlistName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.5rem",
              }}
            >
              <Button
                sx={{
                  background: "linear-gradient(to right, #720361, #bf2f75)",
                  color: "white",
                  padding: "0.7rem 2rem",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(to right, #bf2f75, #720361)",
                  },
                }}
                onClick={handleCloseMoveModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!targetPlaylistId}
                onClick={handleMoveVideo}
                sx={{
                  background: "linear-gradient(to right, #720361, #bf2f75)",
                  color: "white",
                  padding: "0.7rem 2rem",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "1rem",
                  "&:hover": {
                    background: "linear-gradient(to right, #bf2f75, #720361)",
                  },
                }}
              >
                Move
              </Button>
            </Box>
          </Container>
        </Box>
      )}
      <CreatePlaylistModal
        open={openCreatePlaylistModal}
        onClose={handleCloseModal}
        userId={userId}
        token={token}
      />
    </>
  );
};

export default UserPlaylist;
