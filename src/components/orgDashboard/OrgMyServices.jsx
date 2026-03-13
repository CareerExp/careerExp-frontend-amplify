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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ArchiveIcon from "@mui/icons-material/Archive";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { fonts } from "../../utility/fonts";
import { uploadDocument, servicePL } from "../../assets/assest";
import AddService from "./AddService";
import ServiceDetail from "./ServiceDetail";
import {
  fetchMyServices,
  getServiceById,
  selectMyServices,
  selectServiceLoading,
  deleteService,
  updateServiceStatus,
} from "../../redux/slices/serviceSlice";
import { selectToken } from "../../redux/slices/authSlice";
import { selectOrganizationProfile } from "../../redux/slices/organizationSlice";
import { notify } from "../../redux/slices/alertSlice";

// Service mode badge styles (Offline → "In person"). Same as Explore ServiceCard.
const SERVICE_MODE_STYLES = {
  hybrid: { bg: "#FFF3E0", textColor: "#E65100", label: "Hybrid" },
  HYBRID: { bg: "#FFF3E0", textColor: "#E65100", label: "Hybrid" },
  offline: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  OFFLINE: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  "in person": { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  in_person: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  IN_PERSON: { bg: "#FFE8F3", textColor: "#DD4595", label: "In person" },
  online: { bg: "#E8F5E9", textColor: "#2E7D32", label: "Online" },
  ONLINE: { bg: "#E8F5E9", textColor: "#2E7D32", label: "Online" },
};

const ServiceCard = ({ service, onEdit, onDelete, onToggleActive, onView }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const rawMode = (service?.serviceMode || "Online")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "_");
  const modeStyle = SERVICE_MODE_STYLES[rawMode] ??
    SERVICE_MODE_STYLES[service?.serviceMode] ?? {
      bg: "#f5f5f5",
      textColor: "#717171",
      label: "Online",
    };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleClose();
    onEdit(service);
  };

  const handleDeleteClick = () => {
    handleClose();
    onDelete(service);
  };

  const handleToggleActiveClick = () => {
    handleClose();
    onToggleActive?.(service);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "PUBLISHED":
        return {
          bg: "rgba(43, 192, 13, 0.3)",
          color: "#2BC00D",
        };
      case "DRAFT":
        return {
          bg: "#F2F4F7",
          color: "#667085",
        };
      case "ARCHIVED":
        return {
          bg: "rgba(255, 85, 93, 0.3)",
          color: "#FF555E",
        };
      case "DISABLED":
        return {
          bg: "#F2F4F7",
          color: "#667085",
        };
      default:
        return {
          bg: "#F2F4F7",
          color: "#667085",
        };
    }
  };

  // When inactive, show "Disabled" badge; otherwise show status (Published, Draft, etc.)
  const displayStatus =
    service.isActive === false ? "DISABLED" : service.status || "DRAFT";
  const statusStyles = getStatusStyles(displayStatus);

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
      {/* Image Section */}
      <Box
        sx={{
          width: "100%",
          height: "195px",
          borderRadius: "12px",
          overflow: "hidden",
          mb: 2,
          backgroundColor: "#f2f2f2",
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={service.coverImage || service.image || servicePL}
          alt=""
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      {/* Content Section */}
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
            <Box
              sx={{
                backgroundColor: modeStyle.bg,
                color: modeStyle.textColor,
                borderRadius: "10px",
                px: "11px",
                py: "5px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1,
              }}
            >
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "12px",
                  color: modeStyle.textColor,
                }}
              >
                {modeStyle.label}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "18px",
                color: "#101828",
                mb: 0.5,
              }}
            >
              {service.category || "Service"}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: "12px",
                color: "#9E9E9E",
              }}
            >
              Ref no – {service.referenceNumber?.trim() || "—"}
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClick}>
            <MoreVertIcon sx={{ color: "#667085" }} />
          </IconButton>
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
          {service.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Box
              sx={{
                backgroundColor: statusStyles.bg,
                borderRadius: "10px",
                px: "11px",
                py: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
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
                {displayStatus?.toLowerCase()}
              </Typography>
            </Box>
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
              {String(service.totalCtaResponses || 0).padStart(2, "0")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        onClick={() => onView(service)}
        sx={{
          borderRadius: "8px",
          borderColor: "#D0D5DD",
          color: "#344054",
          textTransform: "none",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: "14px",
          py: 1,
          "&:hover": { backgroundColor: "#F9FAFB", borderColor: "#D0D5DD" },
        }}
      >
        View
      </Button>

      {/* Context Menu */}
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
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              color: "#344054",
            }}
          >
            Edit
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleToggleActiveClick} sx={{ gap: 1.5, py: 1.2 }}>
          {service.isActive !== false ? (
            <>
              <BlockIcon sx={{ fontSize: "18px", color: "#667085" }} />
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "14px",
                  color: "#344054",
                }}
              >
                Disable
              </Typography>
            </>
          ) : (
            <>
              <CheckCircleOutlineIcon
                sx={{ fontSize: "18px", color: "#667085" }}
              />
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "14px",
                  color: "#344054",
                }}
              >
                Enable
              </Typography>
            </>
          )}
        </MenuItem>
        <Divider sx={{ my: "0 !important" }} />
        <MenuItem onClick={handleDeleteClick} sx={{ gap: 1.5, py: 1.2 }}>
          <DeleteIcon sx={{ fontSize: "18px", color: "#D92D20" }} />
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: "14px",
              color: "#D92D20",
            }}
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
      {isSearch ? "No results found" : "No services yet"}
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
        ? "We couldn't find any services matching your search. Try a different keyword."
        : "Get started by creating your first service to offer specialized guidance to students."}
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
          lineHeight: "normal",
          letterSpacing: "-0.52px",
        }}
      >
        Delete Service
      </Typography>

      <Typography
        sx={{
          fontFamily: fonts.sans,
          fontWeight: 500,
          fontSize: "22px",
          color: "#787876",
          textAlign: "center",
          lineHeight: "normal",
        }}
      >
        Are you sure you want to delete this service ?
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

const OrgMyServices = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const orgProfile = useSelector(selectOrganizationProfile);
  const services = useSelector(selectMyServices);
  const isLoading = useSelector(selectServiceLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddService, setShowAddService] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDisabling, setIsDisabling] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        dispatch(fetchMyServices({ token, search: searchQuery }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [dispatch, token, searchQuery]);

  const handleEditService = (service) => {
    setServiceToEdit(service);
    setShowAddService(true);
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  };

  const handleToggleActive = async (service) => {
    if (!service?._id || !token) return;
    const nextActive = service.isActive !== false ? false : true;
    setIsDisabling(true);
    try {
      const resultAction = await dispatch(
        updateServiceStatus({
          id: service._id,
          isActive: nextActive,
          token,
        }),
      );
      if (updateServiceStatus.fulfilled.match(resultAction)) {
        const message = nextActive ? "Service enabled." : "Service disabled.";
        dispatch(notify({ message, type: "success" }));
        dispatch(fetchMyServices({ token }));
      } else {
        dispatch(
          notify({
            message:
              resultAction.payload?.error ||
              (nextActive
                ? "Failed to enable service"
                : "Failed to disable service"),
            type: "error",
          }),
        );
      }
    } catch (error) {
      console.error("Toggle active error:", error);
      dispatch(
        notify({ message: "An unexpected error occurred", type: "error" }),
      );
    } finally {
      setIsDisabling(false);
    }
  };

  const confirmDelete = async () => {
    if (!serviceToDelete || !token) return;

    setIsDeleting(true);
    try {
      const resultAction = await dispatch(
        deleteService({ id: serviceToDelete._id, token }),
      );
      if (deleteService.fulfilled.match(resultAction)) {
        dispatch(
          notify({ message: "Service deleted successfully!", type: "success" }),
        );
        setIsDeleteModalOpen(false);
        setServiceToDelete(null);
        setSelectedService(null);
        dispatch(fetchMyServices({ token }));
      } else {
        dispatch(
          notify({
            message: resultAction.payload?.error || "Failed to delete service",
            type: "error",
          }),
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      dispatch(
        notify({ message: "An unexpected error occurred", type: "error" }),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (showAddService) {
    return (
      <AddService
        onBack={() => {
          setShowAddService(false);
          setServiceToEdit(null);
          dispatch(fetchMyServices({ token }));
        }}
        serviceToEdit={serviceToEdit}
        organizationType={orgProfile?.organizationType}
      />
    );
  }

  if (selectedService) {
    return (
      <>
        <ServiceDetail
          service={selectedService}
          onBack={() => setSelectedService(null)}
          onEdit={(srv) => {
            setSelectedService(null);
            handleEditService(srv);
          }}
          onDelete={(srv) => {
            handleDeleteService(srv);
          }}
        />
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
          }}
          onConfirm={confirmDelete}
          isLoading={isDeleting}
        />
      </>
    );
  }

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      {/* Header Section */}
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
          Connect 1-2-1
        </Typography>

        <TextField
          placeholder="Search"
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
            },
            "&.Mui-focused": {
              border: "1px solid #BC2876",
              outline: "none",
            },
            "& .MuiInputBase-input": {
              fontFamily: fonts.sans,
              fontSize: "16px",
              color: "#787876",
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
          onClick={() => setShowAddService(true)}
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
          Add Call
        </Button>
      </Box>

      {/* Services Grid */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#BC2876" }} />
        </Box>
      ) : (
        <>
          {services && services.length > 0 ? (
            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item key={service._id} xs={12} sm={6} lg={4}>
                  <ServiceCard
                    service={service}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    onToggleActive={handleToggleActive}
                    onView={async (srv) => {
                      setSelectedService(srv);
                      if (token) {
                        try {
                          const res = await dispatch(
                            getServiceById({ id: srv._id, token }),
                          ).unwrap();
                          if (res?.data) setSelectedService(res.data);
                        } catch {
                          // keep showing list item if fetch fails
                        }
                      }
                    }}
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
          setServiceToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </Box>
  );
};

export default OrgMyServices;
