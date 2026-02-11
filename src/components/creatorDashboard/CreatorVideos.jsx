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
  PViews,
  PLikes,
  PShared,
  PRating,
} from "../../assets/assest.js";
import AddArticleModal from "../../models/AddArticleModal.jsx";
import AddPodcastModal from "../../models/AddPodcastModal.jsx";
import DeleteModal from "../../models/DeleteModal.jsx";
import EditVideoModal from "../../models/EditVideoModal.jsx";
import UploadVideoModal from "../../models/UploadVideoModal.jsx";
import ArticleDetailContent from "./ArticleDetailContent.jsx";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import {
  deleteVideo,
  deleteArticle,
  deletePodcast,
  getAuthorVideos,
  getAuthorArticles,
  getAuthorPodcasts,
  selectAuthorVideos,
  selectAuthorArticles,
  selectAuthorPodcasts,
  updateVideo,
} from "../../redux/slices/creatorSlice.js";
import creatorStyles from "../../styles/CreatorVideo.module.css";
import { colors } from "../../utility/color.js";
import { convertUTCDateToLocalDate, formatDateDDMMYYYY } from "../../utility/convertTimeToUTC.js";
import { fonts } from "../../utility/fonts.js";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CreatorVideos = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authorVideos = useSelector(selectAuthorVideos);
  const authorArticles = useSelector(selectAuthorArticles);
  const authorPodcasts = useSelector(selectAuthorPodcasts);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoIdToDelete, setVideoIdToDelete] = useState(null);
  const [articleIdToDelete, setArticleIdToDelete] = useState(null);
  const [podcastIdToDelete, setPodcastIdToDelete] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState(null);
  const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);
  const [articleToEditId, setArticleToEditId] = useState(null);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [addPodcastModalOpen, setAddPodcastModalOpen] = useState(false);
  const [podcastToEditId, setPodcastToEditId] = useState(null);
  const [uploadVideoModalOpen, setUploadVideoModalOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // pagination (videos)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // pagination (articles)
  const [articlesPage, setArticlesPage] = useState(0);
  const [articlesRowsPerPage, setArticlesRowsPerPage] = useState(10);
  const [articlesSearchApplied, setArticlesSearchApplied] = useState("");

  // pagination (podcasts)
  const [podcastsPage, setPodcastsPage] = useState(0);
  const [podcastsRowsPerPage, setPodcastsRowsPerPage] = useState(10);
  const [podcastsSearchApplied, setPodcastsSearchApplied] = useState("");

  const [activeTab, setActiveTab] = useState(1);

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

  useEffect(() => {
    if (userId && activeTab === 2) {
      const fetchAuthorArticles = async () => {
        try {
          await dispatchToRedux(
            getAuthorArticles({
              userId,
              page: articlesPage + 1,
              limit: articlesRowsPerPage,
              search: articlesSearchApplied,
            }),
          ).unwrap();
        } catch (error) {
          console.error("Failed to fetch author articles:", error.message);
          dispatchToRedux(notify({ type: "error", message: error.message || "Failed to load articles" }));
        }
      };
      fetchAuthorArticles();
    }
  }, [activeTab, articlesPage, articlesRowsPerPage, userId, articlesSearchApplied]);

  useEffect(() => {
    if (userId && activeTab === 3) {
      const fetchAuthorPodcasts = async () => {
        try {
          await dispatchToRedux(
            getAuthorPodcasts({
              userId,
              page: podcastsPage + 1,
              limit: podcastsRowsPerPage,
              search: podcastsSearchApplied,
            }),
          ).unwrap();
        } catch (error) {
          dispatchToRedux(
            notify({
              type: "error",
              message: error.message || "Failed to load podcasts",
            }),
          );
        }
      };
      fetchAuthorPodcasts();
    }
  }, [activeTab, podcastsPage, podcastsRowsPerPage, userId, podcastsSearchApplied]);

  const handleSearchClick = () => {
    if (activeTab === 1) {
      setPage(0);
      dispatchToRedux(
        getAuthorVideos({
          userId,
          page: 1,
          limit: rowsPerPage,
          search: searchValue,
        }),
      );
    } else if (activeTab === 2) {
      setArticlesSearchApplied(searchValue);
      setArticlesPage(0);
    } else if (activeTab === 3) {
      setPodcastsSearchApplied(searchValue);
      setPodcastsPage(0);
    }
  };

  const handlePodcastsPageChange = (event, newPage) => {
    setPodcastsPage(newPage);
  };

  const handlePodcastsRowsPerPageChange = (event) => {
    setPodcastsRowsPerPage(parseInt(event.target.value, 10));
    setPodcastsPage(0);
  };

  const handleArticlesPageChange = (event, newPage) => {
    setArticlesPage(newPage);
  };

  const handleArticlesRowsPerPageChange = (event) => {
    setArticlesRowsPerPage(parseInt(event.target.value, 10));
    setArticlesPage(0);
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
      if (podcastIdToDelete) {
        await dispatchToRedux(deletePodcast({ userId, podcastId: podcastIdToDelete, token }));
        dispatchToRedux(notify({ type: "success", message: "Podcast deleted successfully" }));
        setPodcastIdToDelete(null);
      } else if (articleIdToDelete) {
        await dispatchToRedux(deleteArticle({ userId, articleId: articleIdToDelete, token }));
        dispatchToRedux(notify({ type: "success", message: "Article deleted successfully" }));
        setArticleIdToDelete(null);
      } else {
        await dispatchToRedux(deleteVideo({ userId, videoId: videoIdToDelete, token }));
        dispatchToRedux(notify({ type: "success", message: "Video deleted successfully" }));
        setVideoIdToDelete(null);
      }
      setIsButtonLoading(false);
      setDeleteModalOpen(false);
    } catch (error) {
      setIsButtonLoading(false);
      if (podcastIdToDelete) setPodcastIdToDelete(null);
      else if (articleIdToDelete) setArticleIdToDelete(null);
      else setVideoIdToDelete(null);
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, please try again",
        }),
      );
    }
  };

  const handleAddArticleModalClose = () => {
    setAddArticleModalOpen(false);
    setArticleToEditId(null);
  };

  const handleArticleSuccess = () => {
    dispatchToRedux(
      getAuthorArticles({
        userId,
        page: articlesPage + 1,
        limit: articlesRowsPerPage,
        search: articlesSearchApplied,
      }),
    );
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleArticleView = (id) => {
    setSelectedArticleId(id);
  };

  const handleArticleDetailBack = () => {
    setSelectedArticleId(null);
  };

  const handleArticleDeleteSuccess = () => {
    setSelectedArticleId(null);
    dispatchToRedux(
      getAuthorArticles({
        userId,
        page: articlesPage + 1,
        limit: articlesRowsPerPage,
        search: articlesSearchApplied,
      }),
    );
  };

  const DesktopView = () => (
    <Box
      sx={{
        backgroundColor: colors.white,
        padding: "1.5rem",
        borderRadius: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #dedede",
          marginBottom: "1.3rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4rem",
            fontSize: "1.1rem",
            fontWeight: "500",
          }}
        >
          <p
            onClick={() => setActiveTab(1)}
            style={{
              color: activeTab === 1 ? "#BC2876" : colors.lightGray,
              padding: ".5rem 2rem",
              fontWeight: activeTab === 1 ? "600" : "",
              borderBottom: activeTab === 1 ? "2px solid #BC2876" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            Videos
          </p>
          <p
            onClick={() => setActiveTab(2)}
            style={{
              color: activeTab === 2 ? "#BC2876" : colors.lightGray,
              padding: ".5rem 2rem",
              fontWeight: activeTab === 2 ? "600" : "",
              borderBottom: activeTab === 2 ? "2px solid #BC2876" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            Articles
          </p>
          <p
            onClick={() => setActiveTab(3)}
            style={{
              color: activeTab === 3 ? "#BC2876" : colors.lightGray,
              padding: ".5rem 2rem",
              fontWeight: activeTab === 3 ? "600" : "",
              borderBottom: activeTab === 3 ? "2px solid #BC2876" : "2px solid transparent",
              cursor: "pointer",
            }}
          >
            Podcasts
          </p>
        </div>
        {activeTab === 1 && (
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={() => setUploadVideoModalOpen(true)}
            sx={{
              background: "linear-gradient(to top left, #720361, #bf2f75)",
              color: colors.white,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "25px",
              "&:hover": {
                background: "linear-gradient(to top left, #720361, #bf2f75)",
                opacity: 0.92,
              },
            }}
          >
            Upload Videos
          </Button>
        )}
        {activeTab === 2 && (
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={() => {
              setArticleToEditId(null);
              setAddArticleModalOpen(true);
            }}
            sx={{
              background: "linear-gradient(to top left, #720361, #bf2f75)",
              color: colors.white,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "25px",
              "&:hover": {
                background: "linear-gradient(to top left, #720361, #bf2f75)",
                opacity: 0.92,
              },
            }}
          >
            Upload Articles
          </Button>
        )}
        {activeTab === 3 && (
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={() => {
              setPodcastToEditId(null);
              setAddPodcastModalOpen(true);
            }}
            sx={{
              background: "linear-gradient(to top left, #720361, #bf2f75)",
              color: colors.white,
              textTransform: "none",
              fontWeight: 500,
              fontSize: "1rem",
              padding: "0.5rem 1.25rem",
              borderRadius: "25px",
              "&:hover": {
                background: "linear-gradient(to top left, #720361, #bf2f75)",
                opacity: 0.92,
              },
            }}
          >
            Upload Podcasts
          </Button>
        )}
      </Box>
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
        {activeTab === 2 && (
          <Table
            size="large"
            aria-label="articles table"
            sx={{
              boxShadow: "none",
              "& .MuiTableCell-root": {
                padding: "15px 0px",
                border: "1px solid #dddddd65",
              },
            }}
          >
            <TableHead sx={{ height: "50px" }}>
              <TableRow sx={{ backgroundColor: "#720361" }}>
                <TableCell sx={{ ...tableHead, width: "12%" }}>Date published</TableCell>
                <TableCell sx={{ ...tableHead, width: "18%" }}>Thumbnail</TableCell>
                <TableCell sx={{ ...tableHead, width: "22%" }}>Title</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Views</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Likes</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Shares</TableCell>
                <TableCell sx={{ ...tableHead, width: "10%" }}>Rating</TableCell>
                <TableCell sx={{ ...tableHead, width: "14%" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorArticles?.articles?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ ...tableData, textAlign: "center", py: 4 }}>
                    No articles yet. Add your first article.
                  </TableCell>
                </TableRow>
              ) : (
                authorArticles?.articles?.map((article) => (
                  <TableRow
                    key={article._id}
                    sx={{
                      "&:hover": { backgroundColor: "#fafafa" },
                      "& .MuiTableCell-root": { padding: "10px 0px" },
                    }}
                  >
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {formatDateDDMMYYYY(article?.createdAt)}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {article?.coverImage ? (
                        <img
                          src={article.coverImage}
                          alt=""
                          style={{
                            width: "160px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 160,
                            height: 90,
                            bgcolor: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ ...tableData, paddingLeft: "1rem", paddingRight: "1rem" }}>
                      {article?.title}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {article?.totalViews ?? 0}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {article?.totalLikes ?? 0}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {article?.totalShares ?? 0}
                    </TableCell>
                    <TableCell sx={{ ...tableData }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Rating value={Math.round(article?.averageRating ?? 0)} readOnly size="small" />
                        <Typography component="span" sx={{ color: "#a1a1a1", fontSize: "0.875rem", ml: 0.5 }}>
                          ({Math.round(article?.averageRating ?? 0)})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          "& .MuiIconButton-root": { padding: "6px" },
                        }}
                      >
                        <IconButton
                          aria-label="view article"
                          onClick={() => handleArticleView(article._id)}
                          sx={{ color: "#720361" }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="edit article"
                          sx={{ color: "#BC2876" }}
                          onClick={() => {
                            setArticleToEditId(article._id);
                            setAddArticleModalOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete article"
                          sx={{ color: colors.red }}
                          onClick={() => {
                            setArticleIdToDelete(article._id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        {activeTab === 3 && (
          <Table
            size="large"
            aria-label="podcasts table"
            sx={{
              boxShadow: "none",
              "& .MuiTableCell-root": {
                padding: "15px 0px",
                border: "1px solid #dddddd65",
              },
            }}
          >
            <TableHead sx={{ height: "50px" }}>
              <TableRow sx={{ backgroundColor: "#720361" }}>
                <TableCell sx={{ ...tableHead, width: "12%" }}>Date published</TableCell>
                <TableCell sx={{ ...tableHead, width: "18%" }}>Thumbnail</TableCell>
                <TableCell sx={{ ...tableHead, width: "22%" }}>Title</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Views</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Likes</TableCell>
                <TableCell sx={{ ...tableHead, width: "8%" }}>Shares</TableCell>
                <TableCell sx={{ ...tableHead, width: "10%" }}>Rating</TableCell>
                <TableCell sx={{ ...tableHead, width: "14%" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {authorPodcasts?.podcasts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ ...tableData, textAlign: "center", py: 4 }}>
                    No podcasts yet. Add your first podcast.
                  </TableCell>
                </TableRow>
              ) : (
                authorPodcasts?.podcasts?.map((podcast) => (
                  <TableRow
                    key={podcast._id}
                    sx={{
                      "&:hover": { backgroundColor: "#fafafa" },
                      "& .MuiTableCell-root": { padding: "10px 0px" },
                    }}
                  >
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {formatDateDDMMYYYY(podcast?.createdAt)}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {(podcast?.spotifyThumbnailUrl || podcast?.thumbnail) ? (
                        <img
                          src={podcast?.spotifyThumbnailUrl || podcast?.thumbnail}
                          alt=""
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "contain",
                            borderRadius: "4px",
                            backgroundColor: "#f5f5f5",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 90,
                            height: 90,
                            bgcolor: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell sx={{ ...tableData, paddingLeft: "1rem", paddingRight: "1rem" }}>
                      {podcast?.title}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {podcast?.totalViews ?? 0}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {podcast?.totalLikes ?? 0}
                    </TableCell>
                    <TableCell sx={{ ...tableData, textAlign: "center" }}>
                      {podcast?.totalShares ?? 0}
                    </TableCell>
                    <TableCell sx={{ ...tableData }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Rating value={Math.round(podcast?.averageRating ?? 0)} readOnly size="small" />
                        <Typography component="span" sx={{ color: "#a1a1a1", fontSize: "0.875rem", ml: 0.5 }}>
                          ({Math.round(podcast?.averageRating ?? 0)})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 0.5,
                          "& .MuiIconButton-root": { padding: "6px" },
                        }}
                      >
                        <IconButton aria-label="view podcast" sx={{ color: "#720361" }} size="small" disabled>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="edit podcast"
                          sx={{ color: "#BC2876" }}
                          onClick={() => {
                            setPodcastToEditId(podcast._id);
                            setAddPodcastModalOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete podcast"
                          sx={{ color: colors.red }}
                          onClick={() => {
                            setPodcastIdToDelete(podcast._id);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {authorArticles?.articles?.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 4, color: colors.darkGray }}>
              No articles yet. Add your first article.
            </Typography>
          ) : (
            authorArticles?.articles?.map((article) => (
              <Box
                key={article._id}
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  marginBottom: "1rem",
                  border: "1px solid #dedede",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  {article?.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt=""
                      style={{ width: "100%", height: "auto", maxHeight: 180, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 120,
                        bgcolor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No image
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ padding: "0.75rem" }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: "500",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: colors.darkGray,
                    }}
                  >
                    {article?.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.5rem" }}
                  >
                    Published on: {formatDateDDMMYYYY(article?.createdAt)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <Rating value={Math.round(article?.averageRating ?? 0)} readOnly size="small" />
                    <Typography variant="body2" sx={{ color: "#a1a1a1", marginLeft: "0.25rem" }}>
                      ({Math.round(article?.averageRating ?? 0)})
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={PViews} alt="Views" style={{ width: "20px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          {article?.totalViews ?? 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={PLikes} alt="Likes" style={{ width: "20px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          {article?.totalLikes ?? 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={PShared} alt="Shares" style={{ width: "18px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          {article?.totalShares ?? 0}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                      <IconButton
                        aria-label="view"
                        onClick={() => handleArticleView(article._id)}
                        sx={{ color: "#720361", padding: "0.25rem" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="edit"
                        sx={{ color: "#BC2876", padding: "0.25rem" }}
                        onClick={() => {
                          setArticleToEditId(article._id);
                          setAddArticleModalOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        sx={{ color: colors.red, padding: "0.25rem" }}
                        onClick={() => {
                          setArticleIdToDelete(article._id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
      {activeTab === 3 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {authorPodcasts?.podcasts?.length === 0 ? (
            <Typography sx={{ textAlign: "center", py: 4, color: colors.darkGray }}>
              No podcasts yet. Add your first podcast.
            </Typography>
          ) : (
            authorPodcasts?.podcasts?.map((podcast) => (
              <Box
                key={podcast._id}
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  marginBottom: "1rem",
                  border: "1px solid #dedede",
                }}
              >
                <Box sx={{ position: "relative" }}>
                  {(podcast?.spotifyThumbnailUrl || podcast?.thumbnail) ? (
                    <img
                      src={podcast?.spotifyThumbnailUrl || podcast?.thumbnail}
                      alt=""
                      style={{ width: "100%", aspectRatio: "1 / 1", objectFit: "contain", backgroundColor: "#f5f5f5" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 120,
                        bgcolor: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No image
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Box sx={{ padding: "0.75rem" }}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontWeight: "500",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                      color: colors.darkGray,
                    }}
                  >
                    {podcast?.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#666", fontSize: "0.8rem", marginBottom: "0.5rem" }}
                  >
                    Published on: {formatDateDDMMYYYY(podcast?.createdAt)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <Rating value={Math.round(podcast?.averageRating ?? 0)} readOnly size="small" />
                    <Typography variant="body2" sx={{ color: "#a1a1a1", marginLeft: "0.25rem" }}>
                      ({Math.round(podcast?.averageRating ?? 0)})
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={PViews} alt="Views" style={{ width: "20px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          {podcast?.totalViews ?? 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={PLikes} alt="Likes" style={{ width: "20px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          {podcast?.totalLikes ?? 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img src={PShared} alt="Shares" style={{ width: "18px" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.75rem", marginLeft: "0.35rem" }}>
                          {podcast?.totalShares ?? 0}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: "0.25rem" }}>
                      <IconButton
                        aria-label="edit podcast"
                        sx={{ color: "#BC2876", padding: "0.25rem" }}
                        onClick={() => {
                          setPodcastToEditId(podcast._id);
                          setAddPodcastModalOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        sx={{ color: colors.red, padding: "0.25rem" }}
                        onClick={() => {
                          setPodcastIdToDelete(podcast._id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}
    </Box>
  );

  const showListOrTabs = !(activeTab === 2 && selectedArticleId);

  return (
    <>
      {showListOrTabs && (
        <Box
          sx={{
            marginBottom: "1rem",
            marginTop: "1rem",
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
      )}

      {activeTab === 2 && selectedArticleId ? (
        <Box
          sx={{
            backgroundColor: colors.white,
            padding: "1.5rem",
            borderRadius: "1rem",
          }}
        >
          <ArticleDetailContent
            articleId={selectedArticleId}
            onBack={handleArticleDetailBack}
            onDeleteSuccess={handleArticleDeleteSuccess}
            embedded={true}
          />
        </Box>
      ) : (
        <>
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
              count={
                activeTab === 1
                  ? authorVideos?.totalVideos || 0
                  : activeTab === 2
                    ? authorArticles?.totalArticles || 0
                    : authorPodcasts?.totalPodcasts || 0
              }
              rowsPerPage={
                activeTab === 1 ? rowsPerPage : activeTab === 2 ? articlesRowsPerPage : podcastsRowsPerPage
              }
              page={activeTab === 1 ? page : activeTab === 2 ? articlesPage : podcastsPage}
              onPageChange={
                activeTab === 1 ? handleChangePage : activeTab === 2 ? handleArticlesPageChange : handlePodcastsPageChange
              }
              onRowsPerPageChange={
                activeTab === 1
                  ? handleChangeRowsPerPage
                  : activeTab === 2
                    ? handleArticlesRowsPerPageChange
                    : handlePodcastsRowsPerPageChange
              }
            />
          </Box>
        </>
      )}
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVideoIdToDelete(null);
          setArticleIdToDelete(null);
          setPodcastIdToDelete(null);
        }}
        onDelete={handleConfirmDelete}
        title="Confirm Delete?"
        text={
          podcastIdToDelete
            ? "Are you sure you want to delete this podcast?"
            : articleIdToDelete
              ? "Are you sure you want to delete this article?"
              : "Are you sure you want to delete this video?"
        }
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
      <AddArticleModal
        open={addArticleModalOpen}
        onClose={handleAddArticleModalClose}
        onSuccess={handleArticleSuccess}
        articleId={articleToEditId}
      />
      <AddPodcastModal
        open={addPodcastModalOpen}
        onClose={() => {
          setAddPodcastModalOpen(false);
          setPodcastToEditId(null);
        }}
        onSuccess={() => {
          dispatchToRedux(
            getAuthorPodcasts({
              userId,
              page: podcastsPage + 1,
              limit: podcastsRowsPerPage,
              search: podcastsSearchApplied,
            }),
          );
        }}
        podcastId={podcastToEditId}
      />
      <UploadVideoModal
        open={uploadVideoModalOpen}
        handleClose={() => setUploadVideoModalOpen(false)}
        onSuccess={() => {
          dispatchToRedux(
            getAuthorVideos({
              userId,
              page: page + 1,
              limit: rowsPerPage,
              search: searchValue,
            }),
          );
        }}
      />
    </>
  );
};

export default CreatorVideos;
