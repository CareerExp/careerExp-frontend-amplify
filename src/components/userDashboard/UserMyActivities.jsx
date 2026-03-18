import ArticleIcon from "@mui/icons-material/Article";
import CampaignIcon from "@mui/icons-material/Campaign";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import MovieIcon from "@mui/icons-material/Movie";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import {
  getDashboardActivity,
  selectDashboardActivityByType,
  selectDashboardActivityLoading,
  updateActivityNotes,
} from "../../redux/slices/dashboardActivitySlice.js";
import { fonts } from "../../utility/fonts.js";

const ACTIVITY_TABS = [
  {
    id: "videos",
    label: "Videos",
    icon: <MovieIcon sx={{ fontSize: 18, mr: 0.5 }} />,
  },
  {
    id: "articles",
    label: "Articles",
    icon: <ArticleIcon sx={{ fontSize: 18, mr: 0.5 }} />,
  },
  {
    id: "podcasts",
    label: "Podcasts",
    icon: <HeadphonesIcon sx={{ fontSize: 18, mr: 0.5 }} />,
  },
  {
    id: "announcements",
    label: "Announcements",
    icon: <CampaignIcon sx={{ fontSize: 18, mr: 0.5 }} />,
  },
  {
    id: "services",
    label: "Connect 1-2-1",
    icon: <SmartToyIcon sx={{ fontSize: 18, mr: 0.5 }} />,
  },
  {
    id: "events",
    label: "Events",
    icon: <EventIcon sx={{ fontSize: 18, mr: 0.5 }} />,
  },
];

/** Map tab id to API contentType */
const TAB_TO_CONTENT_TYPE = {
  videos: "video",
  articles: "article",
  podcasts: "podcast",
  announcements: "announcement",
  events: "event",
  services: "service",
};

const TABLE_HEAD_STYLE = {
  fontFamily: fonts.poppins,
  fontWeight: 600,
  fontSize: "0.875rem",
  color: "#FFFFFF",
};

/** Route for each content type to open detail page (under /explore) */
function getDetailRoute(type, id) {
  if (!id) return null;
  switch (type) {
    case "videos":
      return `/explore/video/${id}`;
    case "articles":
      return `/explore/article/${id}`;
    case "podcasts":
      return `/explore/podcast/${id}`;
    case "announcements":
      return `/explore/announcement/${id}`;
    case "events":
      return `/explore/event/${id}`;
    case "services":
      return `/explore/service/${id}`;
    default:
      return null;
  }
}

const UserMyActivities = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const [activeTab, setActiveTab] = useState("videos");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notesModalRow, setNotesModalRow] = useState(null);
  const [notesModalValue, setNotesModalValue] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [viewNoteModalOpen, setViewNoteModalOpen] = useState(false);
  const [viewNoteModalRow, setViewNoteModalRow] = useState(null);

  const activityData = useSelector((state) =>
    selectDashboardActivityByType(state, activeTab),
  );
  const loading = useSelector((state) =>
    selectDashboardActivityLoading(state, activeTab),
  );
  const items = activityData?.items ?? [];
  const total = activityData?.total ?? 0;
  const contentType = TAB_TO_CONTENT_TYPE[activeTab] || "video";
  const hideRatingColumn =
    activeTab === "announcements" || activeTab === "events";
  const tableColCount = hideRatingColumn ? 5 : 6;

  useEffect(() => {
    if (!token || !activeTab) return;
    dispatch(
      getDashboardActivity({
        type: activeTab,
        page: page + 1,
        limit: rowsPerPage,
        token,
      }),
    );
  }, [activeTab, page, rowsPerPage, token, dispatch]);

  const handleTabChange = (_, value) => {
    setActiveTab(value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (type, id) => {
    const route = getDetailRoute(type, id);
    if (route) navigate(route);
  };

  const handleEditNotes = (e, row) => {
    e.stopPropagation();
    setViewNoteModalOpen(false);
    setViewNoteModalRow(null);
    setNotesModalRow(row);
    setNotesModalValue(row.notes ?? "");
    setNotesModalOpen(true);
  };

  const handleViewNoteOpen = (e, row) => {
    e.stopPropagation();
    setViewNoteModalRow(row);
    setViewNoteModalOpen(true);
  };

  const handleViewNoteClose = () => {
    setViewNoteModalOpen(false);
    setViewNoteModalRow(null);
  };

  const handleEditNoteFromView = () => {
    if (!viewNoteModalRow) return;
    const row = viewNoteModalRow;
    handleViewNoteClose();
    setNotesModalRow(row);
    setNotesModalValue(row.notes ?? "");
    setNotesModalOpen(true);
  };

  const handleNotesModalClose = () => {
    if (!notesSaving) {
      setNotesModalOpen(false);
      setNotesModalRow(null);
      setNotesModalValue("");
    }
  };

  const handleNotesSave = async () => {
    if (!notesModalRow?.id || !token) return;
    setNotesSaving(true);
    const result = await dispatch(
      updateActivityNotes({
        contentType,
        contentId: notesModalRow.id,
        notes: notesModalValue,
        token,
      }),
    );
    setNotesSaving(false);
    if (updateActivityNotes.fulfilled.match(result)) {
      dispatch(notify({ type: "success", message: "Notes saved" }));
      handleNotesModalClose();
    } else {
      dispatch(
        notify({
          type: "error",
          message: result.payload?.message || "Failed to save notes",
        }),
      );
    }
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: fonts.poppins,
          fontWeight: 700,
          mb: 2,
          fontSize: { xs: "1.25rem", md: "1.5rem" },
        }}
      >
        My Activities
      </Typography>

      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: "1px solid #eee",
            minHeight: 48,
            "& .MuiTab-root": {
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "0.875rem",
              textTransform: "none",
              minHeight: 48,
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#BC2876",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#BC2876",
            },
          }}
        >
          {ACTIVITY_TABS.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 280,
                py: 4,
              }}
            >
              <CircularProgress size={32} sx={{ color: "#720361" }} />
            </Box>
          ) : (
            <TableContainer sx={{ marginTop: 3 }}>
              <Table
                size="medium"
                aria-label="My activities table"
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "1px solid #F3F3F3",
                    borderRight: "1px solid #F3F3F3",
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    borderRight: "none",
                  },
                  "& .MuiTableHead .MuiTableCell-root": {
                    borderRight: "1px solid #FFFFFF4D",
                  },
                  "& .MuiTableHead .MuiTableCell-root:last-of-type": {
                    borderRight: "none",
                  },
                }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#720361" }}>
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, width: 72 }}>
                      Thumbnail
                    </TableCell>
                    <TableCell sx={TABLE_HEAD_STYLE}>Title</TableCell>
                    {!hideRatingColumn && (
                      <TableCell sx={{ ...TABLE_HEAD_STYLE, width: 120 }}>
                        Rating
                      </TableCell>
                    )}
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, width: 90 }}>
                      Shared
                    </TableCell>
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, minWidth: 160 }}>
                      My notes
                    </TableCell>
                    <TableCell sx={{ ...TABLE_HEAD_STYLE, width: 80 }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={tableColCount} align="center" sx={{ py: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            color: "#666",
                            fontWeight: 500,
                          }}
                        >
                          No activities yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((row) => {
                      const route = getDetailRoute(activeTab, row.id);
                      const isClickable = Boolean(route);
                      return (
                        <TableRow
                          key={row.id}
                          hover={isClickable}
                          onClick={() =>
                            isClickable && handleRowClick(activeTab, row.id)
                          }
                          sx={{
                            cursor: isClickable ? "pointer" : "default",
                            "&:hover": isClickable
                              ? { backgroundColor: "rgba(114, 3, 97, 0.04)" }
                              : {},
                          }}
                        >
                          <TableCell sx={{ py: 1.5, verticalAlign: "middle" }}>
                            {row.thumbnail ? (
                              <Box
                                component="img"
                                src={row.thumbnail}
                                alt=""
                                sx={{
                                  width: 70,
                                  height: 56,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 56,
                                  height: 56,
                                  borderRadius: 1,
                                  backgroundColor: "#eee",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#C7C7C7",
                                    fontFamily: fonts.poppins,
                                  }}
                                >
                                  NA
                                </Typography>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontFamily: fonts.poppins,
                              fontWeight: 500,
                              fontSize: "0.875rem",
                              color: "#333",
                              verticalAlign: "middle",
                            }}
                          >
                            {row.title || "—"}
                          </TableCell>
                          {!hideRatingColumn && (
                            <TableCell sx={{ py: 1.5, verticalAlign: "middle" }}>
                              <Rating
                                value={Number(row.rating) || 0}
                                readOnly
                                size="small"
                                max={5}
                                sx={{
                                  "& .MuiRating-iconFilled": {
                                    color: "#ffb400",
                                  },
                                }}
                              />
                            </TableCell>
                          )}
                          <TableCell
                            sx={{
                              fontFamily: fonts.poppins,
                              fontSize: "0.875rem",
                              color: "#666",
                              verticalAlign: "middle",
                            }}
                          >
                            {row.shared != null ? Number(row.shared) : "0"}
                          </TableCell>
                          <TableCell
                            onClick={(e) => handleViewNoteOpen(e, row)}
                            sx={{
                              fontFamily: fonts.poppins,
                              fontSize: "0.8125rem",
                              color: "#666",
                              verticalAlign: "middle",
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "rgba(188, 39, 118, 0.06)",
                              },
                            }}
                            title="Click to view full note"
                          >
                            {row.notes ? (
                              String(row.notes)
                            ) : (
                              <span style={{ color: "#C7C7C7" }}>NA</span>
                            )}
                          </TableCell>
                          <TableCell sx={{ py: 1.5, verticalAlign: "middle" }}>
                            <IconButton
                              size="small"
                              aria-label="Edit notes"
                              onClick={(e) => handleEditNotes(e, row)}
                              sx={{ color: "#720361" }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {!loading && total > 0 && (
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 20, 50]}
              sx={{
                fontFamily: fonts.poppins,
                borderTop: "1px solid #eee",
              }}
            />
          )}
        </CardContent>
      </Card>

      <Dialog
        open={notesModalOpen}
        onClose={handleNotesModalClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontFamily: fonts.poppins, fontWeight: 600 }}>
          {notesModalRow
            ? `Notes: ${notesModalRow.title || "Item"}`
            : "Edit notes"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="My notes"
            fullWidth
            multiline
            minRows={3}
            value={notesModalValue}
            onChange={(e) => setNotesModalValue(e.target.value)}
            sx={{
              "& .MuiInputLabel-root": { fontFamily: fonts.poppins },
              "& .MuiInputLabel-root.Mui-focused": { color: "#BC2876" },
              "& .MuiInputBase-input": { fontFamily: fonts.poppins },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#BC2876",
                },
              "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#BC2876",
                },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleNotesModalClose}
            disabled={notesSaving}
            sx={{
              fontFamily: fonts.poppins,
              color: "#BC2876",
              "&:hover": { backgroundColor: "rgba(188, 39, 118, 0.08)" },
              "&.Mui-focusVisible": {
                backgroundColor: "rgba(188, 39, 118, 0.12)",
                outline: "2px solid #BC2876",
                outlineOffset: "2px",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleNotesSave}
            disabled={notesSaving}
            sx={{
              fontFamily: fonts.poppins,
              background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
              "&:hover": { opacity: 0.95 },
            }}
          >
            {notesSaving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewNoteModalOpen}
        onClose={handleViewNoteClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontFamily: fonts.poppins, fontWeight: 600 }}>
          {viewNoteModalRow
            ? `Notes: ${viewNoteModalRow.title || "Item"}`
            : "My notes"}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontSize: "0.9375rem",
              color: "#333",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              minHeight: 80,
              pt: 0.5,
            }}
          >
            {viewNoteModalRow?.notes != null &&
            String(viewNoteModalRow.notes).trim() !== ""
              ? String(viewNoteModalRow.notes)
              : "No notes added yet. Use the edit icon to add a note."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, flexWrap: "wrap", gap: 1 }}>
          <Button
            onClick={handleViewNoteClose}
            sx={{
              fontFamily: fonts.poppins,
              color: "#BC2876",
              "&:hover": { backgroundColor: "rgba(188, 39, 118, 0.08)" },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleEditNoteFromView}
            sx={{
              fontFamily: fonts.poppins,
              background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
              "&:hover": { opacity: 0.95 },
            }}
          >
            Edit note
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserMyActivities;
