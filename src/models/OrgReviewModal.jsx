import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";
import { fonts } from "../utility/fonts.js";
import { updateActiveStatus } from "../redux/slices/adminSlice.js";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken } from "../redux/slices/authSlice.js";

// Figma theme
const HEADER_BG = "#5F005F";
const SECTION_TITLE_COLOR = "#BC2876";
const LABEL_COLOR = "#6B7280";
const VALUE_COLOR = "#1F2937";
const BORDER_COLOR = "#E0E0E0";
const LINK_COLOR = "#BC2876";
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  // { value: "inactive", label: "Inactive" },
  { value: "blocked", label: "Blocked" },
  // { value: "suspended", label: "Suspended" },
  // { value: "deleted", label: "Deleted" },
];

const getStatusBadgeStyle = (status) => {
  if (status === "pending") {
    return { bgcolor: "#FFE08A", color: "#92400E" };
  }
  if (status === "active") return { bgcolor: "#22c55e", color: "#fff" };
  if (["blocked", "suspended", "deleted"].includes(status))
    return { bgcolor: "#ef4444", color: "#fff" };
  return { bgcolor: "#E5E7EB", color: VALUE_COLOR };
};

const InfoRow = ({ label, value, isLink, fullWidth }) => (
  <Box sx={{ mb: 2, ...(fullWidth && { gridColumn: "1 / -1" }) }}>
    <Typography
      sx={{
        fontFamily: fonts.poppins,
        fontSize: "0.8125rem",
        fontWeight: 400,
        color: LABEL_COLOR,
        mb: 0.5,
      }}
    >
      {label}
    </Typography>
    {isLink && value ? (
      <Typography
        component="a"
        href={value.startsWith("http") ? value : `https://${value}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          fontFamily: fonts.poppins,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: LINK_COLOR,
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          "&:hover": { textDecoration: "underline" },
        }}
      >
        {value}
        <OpenInNewIcon sx={{ fontSize: 16 }} />
      </Typography>
    ) : (
      <Typography
        sx={{
          fontFamily: fonts.poppins,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: VALUE_COLOR,
        }}
      >
        {value || "—"}
      </Typography>
    )}
  </Box>
);

/**
 * Admin-only modal for reviewing an organization (ESP or EI) and updating its status.
 * Matches Figma node 1013-165357. Uses API fields: firstName, lastName, email, mobile,
 * organizationName, address, state, country, registrationNo, telephone, website, documents.
 */
const OrgReviewModal = ({ open, onClose, organization }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const org = organization || {};
  const organizationType = org.organizationType || "ESP";
  const currentStatus = org.status || "pending";
  const documents = Array.isArray(org.documents) ? org.documents : [];

  const title =
    organizationType === "ESP"
      ? "Education Service Provider Review"
      : "Education Institution Review";

  const fullAddress =
    [org.address, org.state, org.country].filter(Boolean).join(", ") || null;

  useEffect(() => {
    if (open && org.status) setSelectedStatus(org.status);
    else if (open) setSelectedStatus("");
  }, [open, org.status]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    if (!newStatus || newStatus === currentStatus) return;
    if (!org.userId) {
      dispatch(notify({ type: "error", message: "User not found." }));
      return;
    }
    try {
      setIsSubmitting(true);
      await dispatch(
        updateActiveStatus({ userId: org.userId, status: newStatus, token }),
      );
      dispatch(
        notify({ type: "success", message: "Status updated successfully." }),
      );
      onClose?.();
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Something went wrong. Please try again.",
        }),
      );
      setSelectedStatus(currentStatus);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const statusBadgeStyle = getStatusBadgeStyle(currentStatus);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0px 8px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Header – Figma: dark purple, white text, rounded top */}
      <Box
        sx={{
          background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
          color: "#fff",
          px: 2.5,
          py: 2,
          position: "relative",
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
          }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "1.125rem",
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontSize: "0.8125rem",
            fontWeight: 400,
            opacity: 0.95,
            mt: 0.5,
          }}
        >
          Review registration details and take action.
        </Typography>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          "&.MuiDialogContent-root": { paddingTop: 2.5, paddingBottom: 2.5 },
        }}
      >
        <Box sx={{ px: 2.5 }}>
          {/* Update Status – label dark gray; dropdown + pill badge */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 400,
                fontSize: "0.875rem",
                color: LABEL_COLOR,
                mb: 1,
              }}
            >
              Update Status
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <FormControl
                size="small"
                fullWidth
                sx={{
                  flex: "1 1 200px",
                  maxWidth: 280,
                  "& .MuiOutlinedInput-root": {
                    fontFamily: fonts.poppins,
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                    "& fieldset": { borderColor: BORDER_COLOR },
                    "&:hover fieldset": { borderColor: "#9CA3AF" },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: fonts.poppins,
                    color: LABEL_COLOR,
                  },
                }}
              >
                <Select
                  labelId="org-status-label"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  disabled={isSubmitting}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem
                      key={opt.value}
                      value={opt.value}
                      sx={{ fontFamily: fonts.poppins }}
                    >
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "20px",
                  fontFamily: fonts.poppins,
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  ...statusBadgeStyle,
                }}
              >
                {currentStatus}
              </Box>
            </Box>
          </Box>

          {/* Contact Person Information */}
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: SECTION_TITLE_COLOR,
              mb: 1.5,
            }}
          >
            Contact Person Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              // mb: 1,
            }}
          >
            <InfoRow label="First Name" value={org.firstName} />
            <InfoRow label="Last Name" value={org.lastName} />
            <InfoRow
              label="Email Address"
              value={org.email || org.contactEmail}
            />
            <InfoRow label="Mobile Number" value={org.mobile} />
          </Box>
          <hr style={{ border: `1px solid ${BORDER_COLOR}` }} />
          {/* Business Entity Information – Registered Address full width */}
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: SECTION_TITLE_COLOR,
              mb: 1.5,
              mt: 2,
            }}
          >
            Business Entity Information
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
              // mb: 3,
            }}
          >
            <InfoRow label="Corporate Name" value={org.organizationName} />
            <InfoRow
              label="Registered Address"
              value={fullAddress || org.address}
              fullWidth
            />
            <InfoRow
              label="Company Registration No"
              value={org.registrationNo}
            />
            <InfoRow label="Telephone Number" value={org.telephone} />
            <InfoRow label="Website" value={org.website} isLink />
          </Box>
          <hr style={{ border: `1px solid ${BORDER_COLOR}` }} />
          {/* Submitted Documents – always show section; use documents[] with name, url */}
          <Typography
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: SECTION_TITLE_COLOR,
              mb: 1.5,
              mt: 2,
            }}
          >
            Submitted Documents
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 3 }}
          >
            {documents.length === 0 ? (
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontSize: "0.875rem",
                  color: LABEL_COLOR,
                  fontStyle: "italic",
                  py: 1,
                }}
              >
                No documents submitted
              </Typography>
            ) : (
              documents.map((doc) => {
                const displayName = doc.name || "Document";
                const subtitle = (doc.url || "").split("/").pop() || "Document";
                const linkHref = doc.url
                  ? doc.url.startsWith("http")
                    ? doc.url
                    : `https://${doc.url}`
                  : null;
                return (
                  <Box
                    key={doc._id || doc.url}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1.75,
                      border: `1px solid ${BORDER_COLOR}`,
                      borderRadius: "10px",
                      backgroundColor: "#F9FAFB",
                      boxShadow: "0px 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          backgroundColor: "#E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <InsertDriveFileIcon
                          sx={{ color: "#6B7280", fontSize: 22 }}
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            fontSize: "0.875rem",
                            fontWeight: 700,
                            color: VALUE_COLOR,
                            lineHeight: 1.3,
                          }}
                        >
                          {displayName}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            fontSize: "0.8125rem",
                            fontWeight: 400,
                            color: LABEL_COLOR,
                            mt: 0.5,
                            lineHeight: 1.3,
                          }}
                        >
                          {subtitle}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexShrink: 0,
                      }}
                    >
                      {linkHref && (
                        <>
                          {/* <Typography
                            component="a"
                            href={linkHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              fontFamily: fonts.poppins,
                              fontSize: "0.875rem",
                              fontWeight: 400,
                              color: LINK_COLOR,
                              textDecoration: "none",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            View
                          </Typography> */}
                          <Typography
                            component="a"
                            href={linkHref}
                            download
                            sx={{
                              fontFamily: fonts.poppins,
                              fontSize: "0.875rem",
                              fontWeight: 400,
                              color: LINK_COLOR,
                              textDecoration: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.5,
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            <DownloadIcon sx={{ fontSize: 16 }} />
                            Download
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrgReviewModal;
