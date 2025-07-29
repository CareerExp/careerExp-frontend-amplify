import {
  Box,
  IconButton,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  edit,
  search,
  trash,
  videoShareIcon,
  videoViewsIcon,
  videoLikeIcon,
  shareIconInOrange,
} from "../../assets/assest.js";
import DeleteModal from "../../models/DeleteModal.jsx";
import EditVideoModal from "../../models/EditVideoModal.jsx";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import {
  deleteVideo,
  getAuthorVideos,
  selectAuthorVideos,
  updateVideo,
} from "../../redux/slices/creatorSlice.js";
import creatorStyles from "../../styles/CreatorVideo.module.css";
import { colors } from "../../utility/color.js";
import { convertUTCDateToLocalDate } from "../../utility/convertTimeToUTC.js";
import { fonts } from "../../utility/fonts.js";

const CreatorVideos = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authorVideos = useSelector(selectAuthorVideos);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
  const [searchValue, setSearchValue] = useState("");

  const tableHead = {
    fontFamily: fonts.sans,
    fontWeight: "bold",
    fontSize: "16px",
    color: colors.white,
    textAlign: "center",
  };

  const tableData = {
    fontFamily: fonts.sans,
    fontSize: "14px",
    color: colors.darkGray,
  };

  useEffect(() => {
    const fetchAuthorVideos = async () => {
      try {
        const response = await dispatchToRedux(
          getAuthorVideos({ userId, page: page + 1, limit: rowsPerPage }),
        ).unwrap();
        dispatchToRedux(
          notify({
            type: response.success ? "success" : "error",
            message: response.message || "Videos fetched successfully",
          }),
        );
      } catch (error) {
        console.error("Failed to fetch author videos:", error.message);
      }
    };

    fetchAuthorVideos();
  }, [page, rowsPerPage, userId]);

  const handleSearchClick = () => {
    setPage(0);
    dispatchToRedux(
      getAuthorVideos({
        userId,
        page: 1,
        limit: rowsPerPage,
        search: searchValue,
      }),
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  //EDIT

  const handleVideoEdit = (video) => {
    setEditModalOpen(true);
    setVideoToEdit(video);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setVideoToEdit(null);
  };

  const handleUpdateVideo = async (updatedVideo) => {
    try {
      setIsButtonLoading(true);
      await dispatchToRedux(
        updateVideo({
          userId,
          videoId: updatedVideo._id,
          formData: updatedVideo,
          token,
        }),
      );
      setIsButtonLoading(false);
      setVideoToEdit(null);
      setEditModalOpen(false);
      dispatchToRedux(notify({ type: "success", message: "Video updated successfully" }));
    } catch (error) {
      setIsButtonLoading(false);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, please try again",
        }),
      );
    }
  };

  // DELETE VIDEO

  const handleVideoDelete = (videoId) => {
    setVideoIdToDelete(videoId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsButtonLoading(true);
      await dispatchToRedux(deleteVideo({ userId, videoId: videoIdToDelete, token }));
      dispatchToRedux(notify({ type: "success", message: "Video deleted successfully" }));
      setIsButtonLoading(false);
      setDeleteModalOpen(false);
      setVideoIdToDelete(null);
    } catch (error) {
      setIsButtonLoading(false);
      setVideoIdToDelete(null);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, please try again",
        }),
      );
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [activeTab, setActiveTab] = useState(1);

  const DesktopView = () => (
    <Box
      sx={{
        backgroundColor: colors.white,
        padding: "1.5rem",
        borderRadius: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "4rem",
          fontSize: "1.1rem",
          fontWeight: "500",
          borderBottom: "1px solid #dedede",
          marginBottom: "1.3rem",
        }}
      >
        <p
          onClick={() => {
            setActiveTab(1);
          }}
          style={{
            color: activeTab === 1 ? "#BC2876" : colors.lightGray,
            padding: ".5rem 2rem",
            fontWeight: activeTab === 1 ? "600" : "",
            borderBottom: activeTab === 1 ? "2px solid #BC2876" : "",
            cursor: "pointer",
          }}
        >
          Videos
        </p>
        <p
          onClick={() => {
            setActiveTab(2);
          }}
          style={{
            color: activeTab === 2 ? "#BC2876" : colors.lightGray,
            padding: ".5rem 2rem",
            fontWeight: activeTab === 2 ? "600" : "",
            borderBottom: activeTab === 2 ? "2px solid #BC2876" : "",
            cursor: "pointer",
          }}
        >
          Articles
        </p>
        <p
          onClick={() => {
            setActiveTab(3);
          }}
          style={{
            color: activeTab === 3 ? "#BC2876" : colors.lightGray,
            padding: ".5rem 2rem",
            fontWeight: activeTab === 3 ? "600" : "",
            borderBottom: activeTab === 3 ? "2px solid #BC2876" : "",
            cursor: "pointer",
          }}
        >
          Podcasts
        </p>
      </div>
      <TableContainer sx={{ width: "100%" }}>
        {activeTab === 1 && (
          <Table
            size="large"
            arial-label="a dense table"
            sx={{
              boxShadow: "none",
              "& .MuiTableCell-root": {
                padding: "15px 0px",
                border: "1px solid #dddddd65",
              },
            }}
            // stickyHeader
          >
            <TableHead
              sx={{
                height: "50px",
              }}
            >
              <TableRow sx={{ backgroundColor: "#720361" }}>
                <TableCell sx={{ ...tableHead, width: "15%" }}>Date published</TableCell>
                <TableCell sx={{ ...tableHead, width: "20%" }}>Thumbnail</TableCell>
                <TableCell sx={{ ...tableHead, width: "25%" }}>Title</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Views</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Likes</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Shares</TableCell>
                <TableCell sx={{ ...tableHead, width: "10%" }}>Rating</TableCell>
                <TableCell sx={{ ...tableHead, width: "10%" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorVideos?.videos?.map((video) => (
                <TableRow
                  key={video._id}
                  sx={{
                    "&:hover": { backgroundColor: "lightgray" },
                    cursor: "pointer",
                    "& .MuiTableCell-root": { padding: "10px 0px" },
                  }}
                >
                  <TableCell sx={{ ...tableData, textAlign: "center" }}>
                    {convertUTCDateToLocalDate(video?.createdAt)}
                  </TableCell>
                  <TableCell sx={{ ...tableData, textAlign: "center" }}>
                    {video?.youtubeLink ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`}
                          alt="thumbnail"
                          style={{ width: "160px", height: "90px" }}
                        />
                      </>
                    ) : (
                      <img src={video.thumbnail} alt="thumbnail" style={{ width: "160px", height: "90px" }} />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableData,
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                    }}
                  >
                    {video?.title}
                  </TableCell>
                  <TableCell sx={{ ...tableData, textAlign: "center" }}>{video?.totalViews || 0}</TableCell>
                  <TableCell sx={{ ...tableData, textAlign: "center" }}>{video?.totalLikes}</TableCell>
                  <TableCell sx={{ ...tableData, textAlign: "center" }}>{video?.totalShares || 0}</TableCell>
                  {/* <TableCell sx={tableData}>{video?.likes.length}</TableCell> */}
                  {/* <TableCell sx={tableData}>{video?.comments.length}</TableCell> */}
                  <TableCell sx={{ ...tableData, border: "1px solid #ddd" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Rating value={Math.round(video.averageRating)} readOnly />
                      <p style={{ color: "#a1a1a1", fontSize: "1rem" }}>
                        &nbsp;({Math.round(video.averageRating)})
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        // This ensures higher specificity using '&&'
                        "&&": {
                          border: "none", // Removes the border
                          borderBottom: "none", // Removes any bottom border
                        },
                      }}
                    >
                      {" "}
                      <IconButton aria-label="edit" onClick={() => handleVideoEdit(video)}>
                        <img src={edit} alt="edit" width={"30rem"} height={"30rem"} />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleVideoDelete(video._id)}>
                        <img src={trash} alt="delete" width={"30rem"} height={"30rem"} />
                      </IconButton>
                    </TableCell>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {activeTab === 2 && <div style={{ textAlign: "center", fontWeight: "bold" }}>Coming Soon</div>}
        {activeTab === 3 && <div style={{ textAlign: "center", fontWeight: "bold" }}>Coming Soon</div>}
      </TableContainer>
    </Box>
  );

  const MobileView = () => (
    <Box
      sx={{
        backgroundColor: colors.white,
        padding: "1rem",
        borderRadius: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          fontSize: "1rem",
          fontWeight: "500",
          borderBottom: "1px solid #dedede",
          marginBottom: "1rem",
        }}
      >
        <p
          onClick={() => {
            setActiveTab(1);
          }}
          style={{
            color: activeTab === 1 ? "#BC2876" : colors.lightGray,
            // padding: ".5rem 1rem",
            fontWeight: activeTab === 1 ? "600" : "",
            borderBottom: activeTab === 1 ? "2px solid #BC2876" : "",
            cursor: "pointer",
          }}
        >
          Videos
        </p>
        <p
          onClick={() => {
            setActiveTab(2);
          }}
          style={{
            color: activeTab === 2 ? "#BC2876" : colors.lightGray,
            padding: ".5rem 1rem",
            fontWeight: activeTab === 2 ? "600" : "",
            borderBottom: activeTab === 2 ? "2px solid #BC2876" : "",
            cursor: "pointer",
          }}
        >
          Articles
        </p>
        <p
          onClick={() => {
            setActiveTab(3);
          }}
          style={{
            color: activeTab === 3 ? "#BC2876" : colors.lightGray,
            padding: ".5rem 1rem",
            fontWeight: activeTab === 3 ? "600" : "",
            borderBottom: activeTab === 3 ? "2px solid #BC2876" : "",
            cursor: "pointer",
          }}
        >
          Podcasts
        </p>
      </div>

      {activeTab === 1 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {authorVideos?.videos?.map((video) => (
            <Box
              key={video._id}
              sx={{
                backgroundColor: "#f9f9f9",
                borderRadius: "0.5rem",
                overflow: "hidden",
                marginBottom: "1rem",
                border: "1px solid #dedede",
              }}
            >
              <Box sx={{ position: "relative" }}>
                {video?.youtubeLink ? (
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeVideoId}/0.jpg`}
                    alt="thumbnail"
                    style={{ width: "100%", height: "auto" }}
                  />
                ) : (
                  <img src={video.thumbnail} alt="thumbnail" style={{ width: "100%", height: "auto" }} />
                )}
              </Box>
              <Box sx={{ padding: "0.75rem" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: "500",
                    fontSize: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {video?.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                  <Rating value={Math.round(video.averageRating)} readOnly size="small" />
                  <Typography variant="body2" sx={{ color: "#a1a1a1", marginLeft: "0.25rem" }}>
                    ({Math.round(video.averageRating)})
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.5rem" }}
                >
                  Published on: {convertUTCDateToLocalDate(video?.createdAt)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "1.5rem",
                          height: "1.5rem",
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <img src={videoViewsIcon} alt="Video Views" style={{ width: "20px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.55rem" }}>
                          {video?.totalViews || 0}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "1.5rem",
                          height: "1.5rem",
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "0.5rem",
                        }}
                      >
                        <img src={videoLikeIcon} alt="Video Like" style={{ width: "20px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.55rem" }}>
                          {video?.totalLikes || 0}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: "1.5rem",
                          height: "1.5rem",
                          borderRadius: "50%",
                          backgroundColor: "#f0f0f0",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginLeft: "0.5rem",
                        }}
                      >
                        <img src={shareIconInOrange} alt="Video Share" style={{ width: "18px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.55rem" }}>
                          {video?.totalShares || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", gap: "0.5rem" }}>
                    <IconButton
                      aria-label="edit"
                      onClick={() => handleVideoEdit(video)}
                      sx={{ padding: "0.25rem" }}
                    >
                      <img src={edit} alt="edit" width={"24rem"} height={"24rem"} />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleVideoDelete(video._id)}
                      sx={{ padding: "0.25rem" }}
                    >
                      <img src={trash} alt="delete" width={"24rem"} height={"24rem"} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      {activeTab === 2 && (
        <div style={{ textAlign: "center", fontWeight: "bold", padding: "2rem 0" }}>Coming Soon</div>
      )}
      {activeTab === 3 && (
        <div style={{ textAlign: "center", fontWeight: "bold", padding: "2rem 0" }}>Coming Soon</div>
      )}
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          marginBottom: "1rem",
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: "600",
            padding: { xs: "0.5rem", sm: "0.5rem", md: "1rem" },
            fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.8rem" },
          }}
        >
          Manage My Content
        </Typography>
        <Box
          sx={{
            width: { xs: "100%", sm: "100%", md: "50%" },
            display: "flex",
            justifyContent: { xs: "center", sm: "center", md: "flex-end" },
            gap: "1rem",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "2.5rem",
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                width: "70%",
                height: "100%",
                paddingLeft: "1rem",
                paddingRight: "2.5rem", // space for the icon
                outline: "none",
                border: "1.5px solid #a9a9a9",
                borderRadius: "1.2rem",
                backgroundColor: "white",
              }}
            />

            <img
              src={search}
              alt="search"
              style={{
                width: "1.5rem",
                height: "1.5rem",
                position: "absolute",
                right: "31%",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />

            <Button
              onClick={handleSearchClick}
              sx={{
                backgroundImage: "linear-gradient(to top left, #720361, #bf2f75)",
                border: "none",
                padding: { xs: "0.3rem 0.8rem", sm: "0.5rem 1rem", md: "0.3rem 1rem" },
                borderRadius: "90px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "fit-content",
                fontSize: "1.125rem",
                gap: "0.875rem",
                color: "white",
                cursor: "pointer",
                textTransform: "none",
                "&:hover": {
                  backgroundImage: "linear-gradient(to top left, #720361, #bf2f75)", // same gradient on hover
                },
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
      </Box>

      {isMobile ? <MobileView /> : <DesktopView />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "1rem",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={authorVideos?.totalVideos || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        ></TablePagination>
      </Box>
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        title="Confirm Delete?"
        text="Are you sure you want to delete this video?"
        fonts={fonts}
        colors={colors}
        isButtonLoading={isButtonLoading}
      />
      <EditVideoModal
        open={editModalOpen}
        onClose={handleEditClose}
        video={videoToEdit}
        onUpdate={handleUpdateVideo}
        isButtonLoading={isButtonLoading}
      />
    </>
  );
};

export default CreatorVideos;
