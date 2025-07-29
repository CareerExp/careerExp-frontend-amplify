import {
  Box,
  IconButton,
  Pagination,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { edit, trash, videoShareIcon } from "../../assets/assest.js";
import SaveNotesModal from "../../models/SaveNotesModal.jsx";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import {
  getUserLikedHistory,
  saveAndUpdateNotes,
  deleteNotesFromLikedVideos,
  selectLikedHistory,
} from "../../redux/slices/userHistory.js";
import { fonts } from "../../utility/fonts.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { useNavigate } from "react-router-dom";

function UserMyLikes() {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const likedHistory = useSelector(selectLikedHistory);
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false); // Modal open state
  const [selectedVideoId, setSelectedVideoId] = useState(null); // Selected video ID
  const [currentNotes, setCurrentNotes] = useState(""); // Current notes for editing
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        await dispatchToRedux(getUserLikedHistory({ userId, token }));
        dispatchToRedux(notify({ type: "success", message: "History fetched successfully" }));
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    };

    fetchUserHistory();
  }, [userId, token, dispatchToRedux]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleEditClick = (videoId, notes) => {
    setSelectedVideoId(videoId);
    setCurrentNotes(notes);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleSaveNotes = async (videoId, notes) => {
    try {
      await dispatchToRedux(saveAndUpdateNotes({ userId, videoId, notes }));
      setOpenModal(false);
      dispatchToRedux(notify({ type: "success", message: "Notes saved successfully" }));
    } catch (error) {
      setOpenModal(false);
      dispatchToRedux(notify({ type: "error", message: "Something went wrong, Please try again" }));
    }
  };

  const handleDeleteNotes = async (videoId) => {
    try {
      await dispatchToRedux(deleteNotesFromLikedVideos({ userId, videoId }));
      dispatchToRedux(notify({ type: "success", message: "Notes deleted successfully" }));
    } catch (error) {
      dispatchToRedux(notify({ type: "error", message: "Something went wrong" }));
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const MobileView = () => (
    <Stack spacing={2} sx={{ width: "100%", mt: 2, borderRadius: "8px" }}>
      {likedHistory?.likedVideos?.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h6" fontSize="1rem">
            No Videos Found
          </Typography>
        </Box>
      ) : (
        likedHistory?.likedVideos?.map((video) => (
          <Card
            key={video?.videoId?._id}
            sx={{
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "none",
              border: "1px solid #dbd6db",
            }}
          >
            <Box sx={{ position: "relative" }} onClick={() => handleVideoClick(video?.videoId?._id)}>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
                image={
                  video?.videoId?.youtubeLink
                    ? `https://img.youtube.com/vi/${video.videoId.youtubeVideoId}/0.jpg`
                    : video?.videoId?.thumbnail
                }
                alt={video?.title || "Video thumbnail"}
              />
            </Box>

            <CardContent>
              <Typography variant="subtitle1" fontWeight="500">
                {video?.videoId?.title}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating value={video?.videoId?.averageRating} readOnly size="small" />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({video?.videoId?.totalRatings})
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                <strong>My Notes:</strong> {video?.myNotes || "No notes added"}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  <IconButton size="small" color="primary">
                    <img src={videoShareIcon} alt="edit" width="25px" />
                  </IconButton>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Shared with: {video?.videoId?.totalShares} users
                  </Typography>
                </Box>

                <Box>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEditClick(video?.videoId?._id, video.myNotes)}
                  >
                    <img src={edit} alt="edit" width="25px" />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="secondary"
                    onClick={() => handleDeleteNotes(video?.videoId?._id)}
                  >
                    <img src={trash} alt="trash" width="25px" />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
        <Pagination count={likedHistory?.totalPages} page={page} onChange={handlePageChange} size="small" />
      </Box>
    </Stack>
  );

  const DesktopView = () => (
    <TableContainer>
      <Table border="1" borderColor="#dbd6db">
        <TableHead>
          <TableRow sx={{ background: "#720361" }}>
            <TableCell sx={{ color: "white", fontWeight: "600", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              Thumbnail
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "600", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              My Rating
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "600", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              My Notes
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "600", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              Shared with
            </TableCell>
            <TableCell sx={{ color: "white", fontWeight: "600", fontSize: { xs: "0.8rem", sm: "1rem" } }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {likedHistory?.likedVideos?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="h6" fontSize={{ xs: "0.9rem", sm: "1.2rem" }}>
                  No Video Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            likedHistory?.likedVideos?.map((video) => (
              <TableRow key={video?.videoId?._id}>
                <TableCell>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%", // 16:9 ratio (9/16 * 100 = 56.25%)
                      borderRadius: "8px",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    onClick={() => handleVideoClick(video?.videoId?._id)}
                  >
                    {video?.videoId?.youtubeLink ? (
                      <img
                        src={`https://img.youtube.com/vi/${video.videoId.youtubeVideoId}/0.jpg`}
                        alt={video?.title || "Video thumbnail"}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src={video?.videoId?.thumbnail}
                        alt={video?.title || "Video thumbnail"}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Rating value={video?.videoId?.averageRating} readOnly size="small" />
                    <Typography
                      variant="body2"
                      sx={{ marginLeft: "0.5rem", fontSize: { xs: "0.7rem", sm: "0.9rem" } }}
                    >
                      ({video?.videoId?.totalRatings})
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    fontSize={{ xs: "0.7rem", sm: "0.9rem" }}
                    sx={{
                      maxWidth: "200px",
                      overflow: "hidden",
                      // textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                    }}
                  >
                    {video?.myNotes}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography fontSize={{ xs: "0.7rem", sm: "0.9rem" }}>
                    {video?.videoId?.totalShares} users
                  </Typography>
                </TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(video?.videoId?._id, video.myNotes)}
                  >
                    <img src={edit} alt="edit" width={"30px"} />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteNotes(video.videoId._id)}>
                    <img src={trash} alt="trash" width={"30px"} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // console.log("likedHistory", likedHistory);
  return (
    <Box>
      <Box sx={{ ml: 1, mt: 1, textAlign: "left" }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontFamily: fonts.poppins }}>
          My Likes
        </Typography>
      </Box>
      <Box
        sx={{
          margin: "auto",
          marginTop: "1rem",
          backgroundColor: "white",
          width: { xs: "100%", sm: "90%", md: "100%" },
          p: { xs: 1, md: 0 },
        }}
      >
        {isMobile ? <MobileView /> : <DesktopView />}

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          {!isMobile && (
            <Pagination
              count={likedHistory?.totalPages}
              page={page}
              onChange={handlePageChange}
              size="small"
            />
          )}
        </Box>

        <SaveNotesModal
          open={openModal}
          onClose={handleModalClose}
          videoId={selectedVideoId}
          initialNotes={currentNotes}
          onSave={handleSaveNotes}
        />
      </Box>
    </Box>
  );
}

export default UserMyLikes;
