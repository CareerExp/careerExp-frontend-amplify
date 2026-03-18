import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  Dialog,
  DialogContent,
  Stack,
  Avatar,
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import BusinessIcon from "@mui/icons-material/Business";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaymentsIcon from "@mui/icons-material/Payments";
import LanguageIcon from "@mui/icons-material/Language";
import TagIcon from "@mui/icons-material/Tag";
import { fonts } from "../../utility/fonts";
import { uploadDocument } from "../../assets/assest";
import AddCourse from "./AddCourse";
import {
  fetchMyCourses,
  deleteCourse,
  getCourseById,
  selectMyCourses,
  selectCourseLoading,
} from "../../redux/slices/courseSlice";
import { selectToken } from "../../redux/slices/authSlice";
import { notify } from "../../redux/slices/alertSlice";
import Rating from "@mui/material/Rating";

const deliveryModeLabel = (mode) => {
  if (!mode) return "Online";
  const m = String(mode).toUpperCase();
  if (m === "ONLINE") return "Online";
  if (m === "OFFLINE") return "In-person";
  if (m === "HYBRID") return "Hybrid";
  return mode;
};

const deliveryModeTagBg = (mode) => {
  const m = String(mode || "").toUpperCase();
  if (m === "ONLINE") return "rgba(43, 192, 13, 0.2)";
  if (m === "OFFLINE") return "rgba(188, 40, 118, 0.15)";
  if (m === "HYBRID") return "rgba(255, 138, 0, 0.2)";
  return "#f2f2f2";
};

const CourseCard = ({ course, onEdit, onDelete, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleEditClick = () => {
    handleClose();
    onEdit(course);
  };
  const handleDeleteClick = () => {
    handleClose();
    onDelete(course);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PUBLISHED":
        return { bg: "rgba(43, 192, 13, 0.3)", color: "#2BC00D" };
      case "DRAFT":
        return { bg: "#F2F4F7", color: "#667085" };
      case "ARCHIVED":
        return { bg: "rgba(255, 85, 93, 0.3)", color: "#FF555E" };
      default:
        return { bg: "#F2F4F7", color: "#667085" };
    }
  };
  const statusStyles = getStatusStyles(course.status);

  return (
    <Paper
      elevation={0}
      sx={{
        p: "16px",
        borderRadius: "20px",
        backgroundColor: "#fff",
        boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.05)",
        border: "1px solid #EAECF0",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "195px",
          borderRadius: "12px",
          overflow: "hidden",
          mb: 2,
          backgroundColor: "#e8e8e8",
          position: "relative",
        }}
      >
        {!course.coverImage && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <MenuBookIcon sx={{ fontSize: 80, color: "#9ca3af" }} />
          </Box>
        )}
        {course.coverImage && (
          <>
            <Box
              component="img"
              src={course.coverImage}
              alt=""
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(18px)",
                transform: "scale(1.12)",
                zIndex: 0,
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
              }}
            >
              <Box
                component="img"
                src={course.coverImage}
                alt=""
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </Box>
          </>
        )}
        <Box
          sx={{
            position: "absolute",
            top: "12px",
            left: "12px",
            backgroundColor: deliveryModeTagBg(course.deliveryMode),
            borderRadius: "6px",
            px: 1.5,
            py: 0.5,
            zIndex: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "12px",
              fontWeight: 600,
              color: "#101828",
            }}
          >
            {deliveryModeLabel(course.deliveryMode)}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "18px",
                color: "#101828",
                mb: 0.5,
              }}
            >
              {course.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "12px",
                color: "#9E9E9E",
              }}
            >
              Ref no – {course.referenceNumber || "N/A"}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon sx={{ color: "#667085" }} />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", gap: 2.5, mb: 2 }}>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "13px",
              color: "#BC2876",
              fontWeight: 500,
            }}
          >
            Price :{" "}
            <span style={{ color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
              {course.priceType === "FREE"
                ? "Free"
                : course.priceType === "CUSTOM"
                  ? "Custom"
                  : `${course.currency || "INR"} ${course.price}`}
            </span>
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "13px",
              color: "#BC2876",
              fontWeight: 500,
            }}
          >
            Duration :{" "}
            <span style={{ color: "rgba(0,0,0,0.5)", fontWeight: 400 }}>
              {course.duration
                ? `${course.duration.value} ${course.duration.unit}`
                : "N/A"}
            </span>
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontSize: "14px",
            color: "#475467",
            lineHeight: 1.5,
            mb: 2,
            height: "42px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {course.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: statusStyles.bg,
              borderRadius: "10px",
              px: "11px",
              py: "5px",
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 500,
                fontSize: "15px",
                color: statusStyles.color,
                textTransform: "capitalize",
              }}
            >
              {course.status?.toLowerCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              px: "12px",
              py: "6px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "11px",
                fontWeight: 500,
                color: "#9E9E9E",
              }}
            >
              CTAs received
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "18px",
                fontWeight: 600,
                color: "#BC2876",
              }}
            >
              {String(course.totalCtaClicks || 0).padStart(2, "0")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="contained"
        fullWidth
        onClick={() => onView(course)}
        sx={{
          borderRadius: "8px",
          background:
            "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
          color: "#fff",
          textTransform: "none",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "14px",
          py: 1,
          "&:hover": { opacity: 0.9 },
        }}
      >
        View
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            minWidth: "160px",
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            border: "1px solid #EAECF0",
            mt: 1,
          },
        }}
      >
        <MenuItem onClick={handleEditClick} sx={{ gap: 1.5, py: 1.2 }}>
          <EditIcon sx={{ fontSize: "18px", color: "#667085" }} />
          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#344054" }}
          >
            Edit
          </Typography>
        </MenuItem>
        <Divider sx={{ my: "0 !important" }} />
        {/* <MenuItem onClick={handleClose} sx={{ gap: 1.5, py: 1.2 }}>
                    <ContentCopyIcon sx={{ fontSize: '18px', color: '#667085' }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: '#344054' }}>Duplicate</Typography>
                </MenuItem>
                <Divider sx={{ my: '0 !important' }} />
                <MenuItem onClick={handleClose} sx={{ gap: 1.5, py: 1.2 }}> */}
        {/* <ArchiveIcon sx={{ fontSize: '18px', color: '#667085' }} />
                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: '#344054' }}>Archive</Typography>
                </MenuItem>
                <Divider sx={{ my: '0 !important' }} /> */}
        <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, py: 1.2 }}>
          <DeleteIcon sx={{ fontSize: "18px", color: "#D92D20" }} />
          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: "14px", color: "#D92D20" }}
          >
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

const EmptyState = ({ isSearch }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 12,
      backgroundColor: "#fff",
      borderRadius: "20px",
      boxShadow: "0px 6px 24px 0px rgba(0,0,0,0.05)",
      border: "1px solid #EAECF0",
      mt: 2,
    }}
  >
    <Box
      component="img"
      src={uploadDocument}
      sx={{
        width: "120px",
        height: "120px",
        mb: 3,
        opacity: 0.2,
        filter: "grayscale(100%)",
      }}
    />
    <Typography
      sx={{
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: "20px",
        color: "#101828",
        mb: 1,
      }}
    >
      {isSearch ? "No results found" : "No courses yet"}
    </Typography>
    <Typography
      sx={{
        fontFamily: fonts.sans,
        fontSize: "16px",
        color: "#667085",
        maxWidth: "400px",
        mx: "auto",
      }}
    >
      {isSearch
        ? "We couldn't find any courses matching your search. Try a different keyword."
        : "Get started by creating your first course to offer to students."}
    </Typography>
  </Box>
);

const DeleteConfirmationModal = ({ open, onClose, onConfirm, isLoading }) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: "15px",
        width: "403px",
        height: "auto",
        p: 0,
        position: "relative",
        overflow: "hidden",
      },
    }}
  >
    <IconButton
      onClick={onClose}
      sx={{
        position: "absolute",
        right: "13px",
        top: "13px",
        color: "#000",
        p: 0,
      }}
    >
      <CloseIcon sx={{ fontSize: "24px" }} />
    </IconButton>
    <DialogContent
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: "35px 30px",
        gap: "20px",
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: "26px",
          color: "#000",
          textAlign: "center",
        }}
      >
        Delete Course
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: "22px",
          color: "#787876",
          textAlign: "center",
        }}
      >
        Are you sure you want to delete this course?
      </Typography>
      <Box sx={{ display: "flex", gap: "10px", mt: "10px" }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            width: "120px",
            height: "48px",
            borderRadius: "90px",
            backgroundColor: "#787876",
            color: "#fff",
            textTransform: "none",
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            "&:hover": { backgroundColor: "#60605e" },
          }}
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          sx={{
            width: "120px",
            height: "48px",
            borderRadius: "90px",
            background:
              "linear-gradient(150.17deg, #BF2F75 3.87%, #720361 63.8%)",
            color: "#fff",
            textTransform: "none",
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            "&:hover": { opacity: 0.9 },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "#fff" }} />
          ) : (
            "Yes"
          )}
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

const OrgMyCourses = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const courses = useSelector(selectMyCourses);
  const isLoading = useSelector(selectCourseLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token)
        dispatch(fetchMyCourses({ token, search: searchQuery, limit: 12 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, token, searchQuery]);

  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setShowAddCourse(true);
  };

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDelete || !token) return;
    setIsDeleting(true);
    try {
      const resultAction = await dispatch(
        deleteCourse({ id: courseToDelete._id, token }),
      );
      if (deleteCourse.fulfilled.match(resultAction)) {
        dispatch(
          notify({ message: "Course deleted successfully!", type: "success" }),
        );
        setIsDeleteModalOpen(false);
        const deletedId = courseToDelete._id;
        setCourseToDelete(null);
        if (selectedCourse?._id === deletedId) {
          setSelectedCourse(null);
          if (token) dispatch(fetchMyCourses({ token }));
        }
      } else {
        dispatch(
          notify({
            message: resultAction.payload?.error || "Failed to delete course",
            type: "error",
          }),
        );
      }
    } catch (error) {
      dispatch(
        notify({ message: "An unexpected error occurred", type: "error" }),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (showAddCourse) {
    return (
      <AddCourse
        onBack={() => {
          setShowAddCourse(false);
          setCourseToEdit(null);
          if (token)
            dispatch(
              fetchMyCourses({ token, search: searchQuery, limit: 12 }),
            );
        }}
        onCourseSaved={async (courseId) => {
          if (!courseId || !token || selectedCourse?._id !== courseId) return;
          try {
            const fresh = await dispatch(
              getCourseById({ id: courseId, token }),
            ).unwrap();
            if (fresh) {
              setSelectedCourse((prev) =>
                prev && prev._id === courseId
                  ? { ...prev, ...fresh }
                  : fresh,
              );
            }
          } catch {
            /* detail stays stale only if fetch fails */
          }
        }}
        courseToEdit={courseToEdit}
      />
    );
  }

  if (selectedCourse) {
    const course = selectedCourse;
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-GB");
    };
    const responses = course.ctaResponses || [];

    return (
      <>
      <Box sx={{ p: 4, minHeight: "100%" }}>
        {/* Header: back + title on left, Delete + Edit on right (like ServiceDetail) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => setSelectedCourse(null)} sx={{ p: 0 }}>
              <Box
                sx={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#BC2876",
                  color: "#fff",
                }}
              >
                <ArrowBackIcon sx={{ color: "#fff" }} />
              </Box>
            </IconButton>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 700,
                fontSize: "26px",
                color: "#000",
              }}
            >
              Course Detail
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              onClick={() => handleDeleteCourse(course)}
              sx={{
                height: "48px",
                px: 3,
                borderRadius: "90px",
                border: "1px solid #F04438",
                color: "#F04438",
                textTransform: "none",
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "16px",
                backgroundColor: "#fff",
                "&:hover": { backgroundColor: "#F9FAFB" },
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => handleEditCourse(course)}
              variant="contained"
              sx={{
                height: "48px",
                px: 3,
                borderRadius: "90px",
                background:
                  "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                color: "#fff",
                textTransform: "none",
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "16px",
                "&:hover": { opacity: 0.9 },
              }}
            >
              Edit Course
            </Button>
          </Box>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: "30px",
            borderRadius: "15px",
            backgroundColor: "#fff",
            boxShadow: "0px 6px 9px 0px rgba(0,0,0,0.1)",
            mb: 4,
          }}
        >
          {/* Created date + status */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                backgroundColor: "#BC2876",
                borderRadius: "10px",
                px: 1.5,
                py: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white",
                  textTransform: "capitalize",
                }}
              >
                {course.category || "Other"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <CalendarTodayIcon sx={{ color: "#545454", fontSize: "20px" }} />
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#545454",
                }}
              >
                Created on: {formatDate(course.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "32px",
              color: "#000",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            {course.title}
          </Typography>

          {/* Stats row above image (Figma 1125-140255): provider, stars, duration, likes, views */}
          {(() => {
            const rating = Math.min(5, Math.max(0, Number(course.rating) || 0));
            const filledStars = Math.floor(rating);
            const starColorFilled = "#E87900";
            const starColorEmpty = "#9CA3AF";
            const iconAmber = "#E87900";
            const textSecondary = "#9CA3AF";
            return (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 2.5,
                  mb: 3,
                }}
              >
                {/* Provider (building icon + name) – purple/magenta */}
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                    <BusinessIcon sx={{ color: '#BC2876', fontSize: '20px' }} />
                                    <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '14px', color: '#BC2876' }}>
                                        {course.instructorName || course.createdByName || '—'}
                                    </Typography>
                                </Box> */}
                {/* Stars: filled (orange) + outline (gray), then (count) */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.25,
                    color: "#777777",
                  }}
                >
                  {/* {[1, 2, 3, 4, 5].map((i) =>
                                        i <= filledStars ? (
                                            <StarIcon key={i} sx={{ color: starColorFilled, fontSize: '20px' }} />
                                        ) : (
                                            <StarBorderIcon key={i} sx={{ color: starColorEmpty, fontSize: '20px' }} />
                                        )
                                    )}
                                    <Typography sx={{ fontFamily: fonts.sans, fontSize: '14px', color: textSecondary, ml: 0.25 }}>
                                        ({course.totalReviews ?? 0})
                                    </Typography> */}
                  <Rating
                    value={course.rating || 0}
                    readOnly
                    precision={0.5}
                    size="small"
                    sx={{ color: "#E87900" }}
                  />
                  ({course.totalReviews ?? 0})
                </Box>
                {/* Duration – orange/amber outline icon, gray text */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <AccessTimeIcon sx={{ color: iconAmber, fontSize: "18px" }} />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      color: textSecondary,
                    }}
                  >
                    {course.duration
                      ? `${course.duration.value} ${course.duration.unit}`
                      : "N/A"}
                  </Typography>
                </Box>
                {/* Likes – orange/amber outline icon */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <ThumbUpOutlinedIcon
                    sx={{ color: iconAmber, fontSize: "18px" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      color: textSecondary,
                    }}
                  >
                    {course.totalLikes ?? 0} likes
                  </Typography>
                </Box>
                {/* Views – orange/amber outline icon */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <VisibilityOutlinedIcon
                    sx={{ color: iconAmber, fontSize: "18px" }}
                  />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      color: textSecondary,
                    }}
                  >
                    {course.totalViews ?? 0} views
                  </Typography>
                </Box>
              </Box>
            );
          })()}

          {/* Banner: full image centered, no crop; remaining space filled with blurred image */}
          <Box
            sx={{
              width: "100%",
              height: "400px",
              borderRadius: "8px",
              overflow: "hidden",
              position: "relative",
              mb: 4,
              backgroundColor: "#e8e8e8",
            }}
          >
            {/* Blurred background layer when image exists */}
            {course.coverImage && (
              <Box
                component="img"
                src={course.coverImage}
                alt=""
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "blur(22px)",
                  transform: "scale(1.12)",
                  zIndex: 0,
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            {!course.coverImage && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 0,
                }}
              >
                <MenuBookIcon sx={{ fontSize: 120, color: "#9ca3af" }} />
              </Box>
            )}
            {course.coverImage && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                <Box
                  component="img"
                  src={course.coverImage}
                  alt=""
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Box>
            )}
            {/* Overlay at bottom of image */}
            {/* {(course.category || course.cta?.label) && (
                            <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', backdropFilter: 'blur(3.5px)', backgroundColor: 'rgba(0, 0, 0, 0.58)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', p: '20px', borderBottomLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                                <Typography sx={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: '24px', color: '#fff', letterSpacing: '-0.48px', lineHeight: '30px' }}>
                                    {course.category || course.cta?.label || ''}
                                </Typography>
                            </Box>
                        )} */}
          </Box>

          {/* Metadata grid: Price, Duration, Mode, Ref No */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PaymentsIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#BC2876",
                    }}
                  >
                    Price
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "15px",
                    color: "#101828",
                    pl: "26px",
                  }}
                >
                  {course.priceType === "FREE"
                    ? "Free"
                    : course.priceType === "CUSTOM"
                      ? "Custom"
                      : `${course.currency || "INR"} ${course.price}`}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTimeIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#BC2876",
                    }}
                  >
                    Duration
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "15px",
                    color: "#101828",
                    pl: "26px",
                  }}
                >
                  {course.duration
                    ? `${course.duration.value} ${course.duration.unit}`
                    : "N/A"}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <LanguageIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#BC2876",
                    }}
                  >
                    Mode
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "15px",
                    color: "#101828",
                    pl: "26px",
                    textTransform: "capitalize",
                  }}
                >
                  {deliveryModeLabel(course.deliveryMode)}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Stack spacing={1}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TagIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#BC2876",
                    }}
                  >
                    Ref No
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "15px",
                    color: "#101828",
                    pl: "26px",
                  }}
                >
                  {course.referenceNumber ||
                    (course._id ? course._id.slice(-8).toUpperCase() : "N/A")}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {/* CTA link/email – just above About This Course */}
          {(() => {
            const rawCta = course.cta;
            const cta =
              typeof rawCta === "string"
                ? (() => {
                    try {
                      return rawCta ? JSON.parse(rawCta) : null;
                    } catch {
                      return null;
                    }
                  })()
                : rawCta;
            const ctaValue = cta?.value?.trim();
            if (!ctaValue) return null;
            const ctaType = (cta?.type || "LINK").toUpperCase();
            const href = ctaType === "EMAIL" ? `mailto:${ctaValue}` : ctaValue;
            const label =
              cta?.label || (ctaType === "EMAIL" ? "Email" : "Link");
            return (
              <Box sx={{ mb: 4 }}>
                <LinkIcon sx={{ fontSize: "18px", color: "#BC2876" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#BC2876",
                    mb: 1,
                  }}
                >
                  CTA Link
                </Typography>
                <Typography
                  component="a"
                  href={href}
                  target={ctaType === "LINK" ? "_blank" : undefined}
                  rel={ctaType === "LINK" ? "noopener noreferrer" : undefined}
                  sx={{
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "black",
                    textDecoration: "underline",
                    "&:hover": { color: "#720361" },
                  }}
                >
                  {ctaValue}
                </Typography>
              </Box>
            );
          })()}

          {/* About */}
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 600,
              fontSize: "20px",
              color: "#000",
              mb: 1.5,
            }}
          >
            About This Course
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: "16px",
              color: "#545454",
              lineHeight: "28px",
              whiteSpace: "pre-wrap",
              mb: 4,
            }}
          >
            {course.description || "No description."}
          </Typography>

          {/* What's Included & What You Will Learn */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CheckCircleOutlineIcon sx={{ color: "#BC2876" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#000",
                  }}
                >
                  What's Included
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                {course.whatsIncluded && course.whatsIncluded.length > 0 ? (
                  course.whatsIncluded.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#BC2876",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: "15px",
                          color: "#545454",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "15px",
                      color: "#667085",
                    }}
                  >
                    No items listed.
                  </Typography>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <LightbulbOutlinedIcon sx={{ color: "#BC2876" }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#000",
                  }}
                >
                  What You Will Learn
                </Typography>
              </Box>
              <Stack spacing={1.5}>
                {course.whatYouWillLearn &&
                course.whatYouWillLearn.length > 0 ? (
                  course.whatYouWillLearn.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "#BC2876",
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: "15px",
                          color: "#545454",
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "15px",
                      color: "#667085",
                    }}
                  >
                    No items listed.
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* CTAs received */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "20px",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 20px 0px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: "24px",
              color: "#000",
              mb: 3,
            }}
          >
            CTAs received
          </Typography>
          {responses.length > 0 ? (
            <Grid container spacing={2.5}>
              {responses.map((resp, idx) => (
                <Grid item key={idx} xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      backgroundColor: "#f4f7fe",
                      borderRadius: "12px",
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={resp.profilePicture}
                      sx={{ width: 48, height: 48, backgroundColor: "#e5e7eb" }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontWeight: 600,
                          fontSize: "16px",
                          color: "#000",
                        }}
                      >
                        {resp.firstName} {resp.lastName}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontWeight: 400,
                          fontSize: "14px",
                          color: "#666",
                        }}
                      >
                        {formatDate(resp.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "16px",
                color: "#667085",
                py: 2,
              }}
            >
              {course.totalCtaClicks
                ? `${course.totalCtaClicks} CTA click(s) recorded. No individual responses yet.`
                : "No responses received yet."}
            </Typography>
          )}
        </Paper>
      </Box>

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000",
            flexGrow: 1,
          }}
        >
          My Courses
        </Typography>
        <TextField
          placeholder="Search course by name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: "379px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "90px",
              backgroundColor: "#fff",
              px: 2,
              boxShadow: "0px 7px 6px 0px rgba(0,0,0,0.03)",
              "& fieldset": { borderColor: "rgba(0,0,0,0.16)" },
              "& .MuiInputBase-input": {
                fontFamily: fonts.sans,
                fontSize: "16px",
                color: "#787876",
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{
                      mr: 0.5,
                      color: "rgba(0,0,0,0.4)",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                    }}
                    aria-label="Clear search"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <SearchIcon sx={{ color: "rgba(0,0,0,0.4)" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddCourse(true)}
          sx={{
            height: "48px",
            borderRadius: "90px",
            px: 3,
            background:
              "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: "16px",
            textTransform: "none",
            "&:hover": { opacity: 0.9 },
          }}
        >
          Add Course
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#BC2876" }} />
        </Box>
      ) : (
        <>
          {courses && courses.length > 0 ? (
            <Grid container spacing={3}>
              {courses.map((course) => (
                <Grid item key={course._id} xs={12} sm={6} lg={4}>
                  <CourseCard
                    course={course}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                    onView={setSelectedCourse}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState isSearch={!!searchQuery} />
          )}
        </>
      )}

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default OrgMyCourses;
