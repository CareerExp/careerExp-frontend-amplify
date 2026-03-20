import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
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
import { useDispatch, useSelector } from "react-redux";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  addAdmin,
  getAdmins,
  getActivityLog,
  updateAdminStatus,
  selectAdminsData,
  selectActivityLogData,
} from "../../redux/slices/adminSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";
import { isValidEmail } from "../../utility/validate.js";

// Figma design tokens (node 1283:108843)
const accentColor = "#BC2876";
const accentColorInactive = "#999999";
const searchButtonGradient =
  "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
const inviteButtonGradient =
  "linear-gradient(160.59deg, #BF2F75 3.87%, #720361 63.8%)";
const separatorColor = "#DDDDDD";
const inputBorderColor = "#E5E7EB";
const tableHeaderBg = "#FAFAFA";
const tableHeaderText = "#666666";
const tableRowBorder = "#F3F4F6";
const nameColor = "#333333";
const bodyTextColor = "#666666";
const statusActiveBg = "#E8F5E9";
const statusActiveText = "#4CAF50";
const statusDisabledBg = "#FFEBEE";
const statusDisabledText = "#F44336";
const statusPendingBg = "#FFF3E0";
const statusPendingText = "#FF9800";
const awaitingTextColor = "#999999";
// Invite modal (Figma 1283:109526 / 1283:110133)
const modalLabelColor = "#545454";
const modalSubtitleColor = "#787876";
const modalInputBg = "#F2F2F2";
const modalCloseButtonBg = "#787876";

function formatDate(value) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "—";
  }
}

function formatDateTime(value) {
  if (!value) return "N/A";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d
      .toLocaleString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", " ");
  } catch {
    return "N/A";
  }
}

/** Derive display status from backend admin: status field or enabled boolean.
 * Backend may send "inactive" — we never show it; treat as "disabled" so Enable sets status to active. */
function getAdminDisplayStatus(admin) {
  const raw = admin.status;
  if (raw === "inactive") return "disabled";
  if (raw != null) return raw; // 'active' | 'disabled' | 'pending'
  if (admin.enabled === false) return "disabled";
  if (admin.enabled === true) return "active";
  return "active";
}

// Activity Log UI — Figma 1282:108174 (role badges, module tag colors)
const roleAdminBg = "#E3F2FD";
const roleAdminText = "#2196F3";
const roleSubAdminBg = "#F3E5F5";
const roleSubAdminText = "#9C27B0";
const moduleTagBg = "#F3F4F6";

function formatActivityDetails(details) {
  if (details == null) return "—";
  if (typeof details === "string") return details;
  try {
    return typeof details === "object"
      ? JSON.stringify(details)
      : String(details);
  } catch {
    return "—";
  }
}

function formatActivityTimestamp(isoString) {
  if (!isoString) return "—";
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "—";
    const day = String(d.getDate()).padStart(2, "0");
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const y = d.getFullYear();
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${day}/${m}/${y} ${h}:${min}:${s}`;
  } catch {
    return "—";
  }
}

const TAB_SUB_ADMIN = 0;
const TAB_ACTIVITY_LOG = 1;

const AdminManageAdmins = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const adminsData = useSelector(selectAdminsData);
  const [tabValue, setTabValue] = useState(TAB_SUB_ADMIN);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteSubmitting, setInviteSubmitting] = useState(false);

  const admins = adminsData?.admins ?? [];
  const pagination = adminsData?.pagination ?? {};
  const total = pagination.total ?? admins.length;

  const activityLogData = useSelector(selectActivityLogData);
  const activityLogs = activityLogData?.logs ?? [];
  const activityLogPagination = activityLogData?.pagination ?? {};
  const activityLogTotal = activityLogPagination.total ?? 0;
  const [activityLogPage, setActivityLogPage] = useState(0);
  const [activityLogRowsPerPage, setActivityLogRowsPerPage] = useState(10);
  const [activityLogLoading, setActivityLogLoading] = useState(false);
  const [activityLogError, setActivityLogError] = useState(null);

  useEffect(() => {
    if (tabValue !== TAB_SUB_ADMIN || !token) return;
    setAdminsLoading(true);
    dispatch(
      getAdmins({
        token,
        search: appliedSearch,
        page: page + 1,
        limit: rowsPerPage,
      }),
    ).finally(() => setAdminsLoading(false));
  }, [tabValue, token, appliedSearch, page, rowsPerPage, dispatch]);

  useEffect(() => {
    if (tabValue !== TAB_ACTIVITY_LOG || !token) return;
    setActivityLogError(null);
    setActivityLogLoading(true);
    dispatch(
      getActivityLog({
        token,
        search: appliedSearch,
        page: activityLogPage + 1,
        limit: activityLogRowsPerPage,
      }),
    )
      .then((result) => {
        if (getActivityLog.rejected.match(result)) {
          const err = result.payload || result.error;
          setActivityLogError(
            err?.code === "403" ||
              err?.message?.toLowerCase().includes("permission")
              ? "You don't have permission to view the activity log."
              : err?.message || "Failed to load activity log.",
          );
        }
      })
      .finally(() => setActivityLogLoading(false));
  }, [
    tabValue,
    token,
    appliedSearch,
    activityLogPage,
    activityLogRowsPerPage,
    dispatch,
  ]);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    if (newValue === TAB_SUB_ADMIN) setPage(0);
    if (newValue === TAB_ACTIVITY_LOG) setActivityLogPage(0);
  };
  const handleSearchClick = () => {
    setAppliedSearch(searchQuery);
    setPage(0);
    setActivityLogPage(0);
  };
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleActivityLogPageChange = (_, newPage) =>
    setActivityLogPage(newPage);
  const handleActivityLogRowsPerPageChange = (e) => {
    setActivityLogRowsPerPage(parseInt(e.target.value, 10));
    setActivityLogPage(0);
  };
  const handleInviteSubAdmin = () => setInviteModalOpen(true);
  const handleInviteModalClose = () => {
    if (!inviteSubmitting) {
      setInviteModalOpen(false);
      setInviteEmail("");
      setInviteMessage("");
    }
  };
  const handleSendInvite = async () => {
    const emailTrimmed = inviteEmail.trim();
    if (!emailTrimmed) {
      dispatch(
        notify({
          type: "warning",
          message: "Please enter an email address",
          field: "email",
        }),
      );
      return;
    }
    if (!isValidEmail(emailTrimmed)) {
      dispatch(
        notify({
          type: "warning",
          message: "Please enter a valid email address",
          field: "email",
        }),
      );
      return;
    }
    setInviteSubmitting(true);
    const result = await dispatch(
      addAdmin({
        token,
        email: emailTrimmed,
        message: inviteMessage.trim() || undefined,
      }),
    );
    setInviteSubmitting(false);
    if (addAdmin.fulfilled.match(result)) {
      dispatch(
        notify({
          type: "success",
          message: result.payload?.message || "Invitation sent successfully",
        }),
      );
      setInviteModalOpen(false);
      setInviteEmail("");
      setInviteMessage("");
      dispatch(
        getAdmins({
          token,
          search: appliedSearch,
          page: page + 1,
          limit: rowsPerPage,
        }),
      );
    } else {
      const err = result.payload || result.error;
      const message =
        err?.code === "EMAIL_ALREADY_REGISTERED"
          ? "A user with this email is already registered. Please use a different email or ask them to log in if they already have an account."
          : err?.message || "Failed to send invitation";
      dispatch(notify({ type: "error", message }));
    }
  };
  const handleEnableDisable = async (admin) => {
    if (admin?.isMainAdmin) return;
    const currentEnabled =
      admin.enabled !== false && getAdminDisplayStatus(admin) !== "disabled";
    const nextEnabled = !currentEnabled;
    setUpdatingUserId(admin._id);
    const result = await dispatch(
      updateAdminStatus({ token, userId: admin._id, enabled: nextEnabled }),
    );
    setUpdatingUserId(null);
    if (updateAdminStatus.fulfilled.match(result)) {
      dispatch(
        notify({
          type: "success",
          message: nextEnabled ? "Admin enabled." : "Admin disabled.",
        }),
      );
    } else {
      const err = result.payload || result.error;
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Failed to update status",
        }),
      );
    }
  };

  const getStatusStyles = (status) => {
    if (status === "active")
      return { bg: statusActiveBg, color: statusActiveText };
    if (status === "disabled")
      return { bg: statusDisabledBg, color: statusDisabledText };
    return { bg: statusPendingBg, color: statusPendingText };
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Title row: "Manage Admins" + "Invite Sub-Admin" button — Figma 1283:108958 */}
      <Box
        sx={{
          ml: 2,
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          pr: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000000",
            lineHeight: "normal",
          }}
        >
          Manage Admins
        </Typography>
        <Button
          variant="contained"
          onClick={handleInviteSubAdmin}
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 600,
            fontSize: "15px",
            textTransform: "none",
            background: inviteButtonGradient,
            borderRadius: "90px",
            px: "20px",
            py: "10px",
            "&:hover": {
              background: inviteButtonGradient,
              opacity: 0.95,
            },
          }}
        >
          Invite Sub-Admin
        </Button>
      </Box>

      {/* Tabs + Search card — same structure as ESP & EI Users */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mb: 3,
          mt: 2,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          centered
          sx={{
            px: 2,
            pt: 1,
            minHeight: 48,
            borderBottom: `1px solid ${separatorColor}`,
            "& .MuiTab-root": {
              fontFamily: fonts.poppins,
              fontWeight: 500,
              fontSize: "16px",
              textTransform: "none",
              color: accentColorInactive,
              minHeight: 48,
              px: "42px",
              py: "10px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: accentColor,
              fontWeight: 700,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: accentColor,
              height: 2,
            },
          }}
        >
          <Tab label="Sub-Admin Accounts" id="sub-admin-tab" />
          <Tab label="Activity Logs" id="activity-log-tab" />
        </Tabs>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            p: 2,
            pt: 2.5,
            pb: 2.5,
          }}
        >
          <TextField
            placeholder={
              tabValue === TAB_ACTIVITY_LOG
                ? "Search by admin name"
                : "Search by name or email..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
            size="small"
            fullWidth
            sx={{
              flex: 1,
              fontFamily: fonts.poppins,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#fff",
                borderRadius: "10px",
                fontSize: "14px",
                "& fieldset": {
                  border: `1px solid ${inputBorderColor}`,
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: accentColor,
                  borderWidth: "1px",
                },
              },
              "& .MuiInputBase-input::placeholder": {
                color: accentColorInactive,
                opacity: 1,
                fontSize: "14px",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearchClick}
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              background: searchButtonGradient,
              borderRadius: "10px",
              px: "32px",
              py: "12px",
              minWidth: "120px",
              boxShadow:
                "0px 4px 6px rgba(0,0,0,0.1), 0px 2px 4px rgba(0,0,0,0.1)",
              "&:hover": {
                background: searchButtonGradient,
                opacity: 0.95,
              },
            }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Sub-Admin Accounts tab content */}
      {tabValue === TAB_SUB_ADMIN && (
        <>
          <TableContainer
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
              position: "relative",
            }}
          >
            {adminsLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderRadius: "10px",
                  zIndex: 1,
                }}
              >
                <CircularProgress sx={{ color: accentColor }} />
              </Box>
            )}
            <Table size="medium" aria-label="sub-admin accounts table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: tableHeaderBg,
                    borderBottom: `1px solid ${inputBorderColor}`,
                  }}
                >
                  <TableCell
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: tableHeaderText,
                      py: "16px",
                      px: "24px",
                      width: "150px",
                      border: "none",
                    }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: tableHeaderText,
                      py: "16px",
                      px: "24px",
                      border: "none",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: tableHeaderText,
                      py: "16px",
                      px: "24px",
                      width: "150px",
                      border: "none",
                    }}
                  >
                    Invited Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: tableHeaderText,
                      py: "16px",
                      px: "24px",
                      width: "80px",
                      border: "none",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      fontSize: "13px",
                      color: tableHeaderText,
                      py: "16px",
                      px: "24px",
                      width: "150px",
                      border: "none",
                    }}
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.length === 0 && !adminsLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography
                        sx={{
                          fontFamily: fonts.poppins,
                          fontWeight: 500,
                          color: tableHeaderText,
                        }}
                      >
                        No admins found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((row) => {
                    const status = getAdminDisplayStatus(row);
                    const statusStyles = getStatusStyles(status);
                    const isPending = status === "pending";
                    const isDisabled = status === "disabled";
                    const name =
                      [row.firstName, row.lastName].filter(Boolean).join(" ") ||
                      "—";
                    const invitedDate = formatDate(
                      row.invitedAt ?? row.createdAt,
                    );
                    const isUpdating = updatingUserId === row._id;
                    const canToggle = !row.isMainAdmin && !isPending;
                    return (
                      <TableRow
                        key={row._id}
                        sx={{
                          borderBottom: `1px solid ${tableRowBorder}`,
                          minHeight: 70,
                          "&:last-child": { borderBottom: "none" },
                          "& .MuiTableCell-root": { verticalAlign: "middle" },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 500,
                            fontSize: "14px",
                            color: nameColor,
                            py: "17px",
                            px: "24px",
                            width: "150px",
                            border: "none",
                          }}
                        >
                          {name}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 400,
                            fontSize: "14px",
                            color: bodyTextColor,
                            py: "17px",
                            px: "24px",
                            border: "none",
                          }}
                        >
                          {row.email ?? "—"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 400,
                            fontSize: "14px",
                            color: bodyTextColor,
                            py: "17px",
                            px: "24px",
                            width: "150px",
                            border: "none",
                          }}
                        >
                          {invitedDate}
                        </TableCell>
                        <TableCell
                          sx={{
                            py: "17px",
                            px: "24px",
                            width: "80px",
                            border: "none",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: "12px",
                              py: "6px",
                              borderRadius: "6px",
                              backgroundColor: statusStyles.bg,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: fonts.poppins,
                                fontWeight: 600,
                                fontSize: "12px",
                                color: statusStyles.color,
                              }}
                            >
                              {status === "active"
                                ? "Active"
                                : status === "disabled"
                                  ? "Disabled"
                                  : status === "pending"
                                    ? "Pending"
                                    : "Disabled"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            py: "17px",
                            px: "24px",
                            width: "150px",
                            border: "none",
                          }}
                        >
                          {isPending ? (
                            <Typography
                              sx={{
                                fontFamily: fonts.poppins,
                                fontStyle: "italic",
                                fontWeight: 400,
                                fontSize: "12px",
                                color: awaitingTextColor,
                              }}
                            >
                              Awaiting acceptance
                            </Typography>
                          ) : row.isMainAdmin ? (
                            <Typography
                              sx={{
                                fontFamily: fonts.poppins,
                                fontSize: "12px",
                                color: bodyTextColor,
                              }}
                            >
                              —
                            </Typography>
                          ) : (
                            <Button
                              disableRipple
                              disabled={isUpdating}
                              onClick={() => handleEnableDisable(row)}
                              startIcon={
                                isDisabled ? (
                                  <CheckCircleOutlineIcon
                                    sx={{ fontSize: 16 }}
                                  />
                                ) : (
                                  <BlockIcon sx={{ fontSize: 16 }} />
                                )
                              }
                              sx={{
                                fontFamily: fonts.poppins,
                                fontWeight: 600,
                                fontSize: "12px",
                                textTransform: "none",
                                borderRadius: "8px",
                                px: "12px",
                                py: "6px",
                                minWidth: 0,
                                backgroundColor: isDisabled
                                  ? statusActiveBg
                                  : statusDisabledBg,
                                color: isDisabled
                                  ? statusActiveText
                                  : statusDisabledText,
                                "& .MuiButton-startIcon": {
                                  marginRight: "8px",
                                  "& svg": {
                                    color: "inherit",
                                  },
                                },
                                "&:hover": {
                                  backgroundColor: isDisabled
                                    ? statusActiveBg
                                    : statusDisabledBg,
                                  opacity: 0.9,
                                },
                              }}
                            >
                              {isDisabled ? "Enable" : "Disable"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {total > 0 && (
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{ fontFamily: fonts.poppins, mt: 2 }}
            />
          )}
        </>
      )}

      {/* Activity Logs tab — Figma 1282:108174, integrated with GET /api/admin/activity-log */}
      {tabValue === TAB_ACTIVITY_LOG && (
        <>
          <TableContainer
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
              position: "relative",
            }}
          >
            {activityLogLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.7)",
                  borderRadius: "10px",
                  zIndex: 1,
                }}
              >
                <CircularProgress sx={{ color: accentColor }} />
              </Box>
            )}
            {activityLogError && (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 500,
                    color: tableHeaderText,
                  }}
                >
                  {activityLogError}
                </Typography>
              </Box>
            )}
            {!activityLogError && (
              <Table size="medium" aria-label="activity logs table">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: tableHeaderBg,
                      borderBottom: `1px solid ${inputBorderColor}`,
                    }}
                  >
                    <TableCell
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tableHeaderText,
                        py: "16px",
                        px: "24px",
                        width: "210px",
                        border: "none",
                      }}
                    >
                      Admin / Sub-Admin
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tableHeaderText,
                        py: "16px",
                        px: "24px",
                        width: "130px",
                        border: "none",
                      }}
                    >
                      Role
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tableHeaderText,
                        py: "16px",
                        px: "24px",
                        width: "150px",
                        border: "none",
                      }}
                    >
                      Timestamp
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tableHeaderText,
                        py: "16px",
                        px: "24px",
                        width: "100px",
                        border: "none",
                      }}
                    >
                      Module
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tableHeaderText,
                        py: "16px",
                        px: "24px",
                        width: "164px",
                        border: "none",
                      }}
                    >
                      Action
                    </TableCell>
                    <TableCell
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "13px",
                        color: tableHeaderText,
                        py: "16px",
                        px: "24px",
                        border: "none",
                      }}
                    >
                      Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activityLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 500,
                            color: tableHeaderText,
                          }}
                        >
                          No activity logs found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    activityLogs.map((log, index) => (
                      <TableRow
                        key={
                          log._id ??
                          `activity-${log.actorId}-${log.timestamp}-${index}`
                        }
                        sx={{
                          borderBottom: `1px solid ${tableRowBorder}`,
                          minHeight: 70,
                          "&:last-child": { borderBottom: "none" },
                          "& .MuiTableCell-root": { verticalAlign: "middle" },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 500,
                            fontSize: "14px",
                            color: nameColor,
                            py: "17px",
                            px: "24px",
                            width: "210px",
                            border: "none",
                          }}
                        >
                          {log.actorName ?? log.actorEmail ?? "—"}
                        </TableCell>
                        <TableCell
                          sx={{
                            py: "17px",
                            px: "24px",
                            width: "130px",
                            border: "none",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: "8px",
                              py: "4px",
                              borderRadius: "6px",
                              backgroundColor: log.actorIsMainAdmin
                                ? roleAdminBg
                                : roleSubAdminBg,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: fonts.poppins,
                                fontWeight: 600,
                                fontSize: "11px",
                                color: log.actorIsMainAdmin
                                  ? roleAdminText
                                  : roleSubAdminText,
                              }}
                            >
                              {log.actorIsMainAdmin === true
                                ? "Admin"
                                : "Sub-Admin"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 400,
                            fontSize: "14px",
                            color: bodyTextColor,
                            py: "17px",
                            px: "24px",
                            width: "150px",
                            border: "none",
                          }}
                        >
                          {formatActivityTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell
                          sx={{
                            py: "17px",
                            px: "24px",
                            width: "100px",
                            border: "none",
                          }}
                        >
                          <Box
                            sx={{
                              display: "inline-flex",
                              px: "12px",
                              py: "4px",
                              borderRadius: "6px",
                              backgroundColor: moduleTagBg,
                            }}
                          >
                            <Typography
                              sx={{
                                fontFamily: fonts.poppins,
                                fontWeight: 600,
                                fontSize: "12px",
                                color: bodyTextColor,
                              }}
                            >
                              {log.resource ?? log.module ?? "—"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 500,
                            fontSize: "12px",
                            color: nameColor,
                            py: "17px",
                            px: "24px",
                            width: "164px",
                            border: "none",
                          }}
                        >
                          {log.actionLabel ?? "—"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 400,
                            fontSize: "12px",
                            color: bodyTextColor,
                            py: "17px",
                            px: "24px",
                            border: "none",
                          }}
                        >
                          {formatActivityDetails(log.detailsMessage)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          {!activityLogError && activityLogTotal > 0 && (
            <TablePagination
              component="div"
              count={activityLogTotal}
              page={activityLogPage}
              onPageChange={handleActivityLogPageChange}
              rowsPerPage={activityLogRowsPerPage}
              onRowsPerPageChange={handleActivityLogRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{ fontFamily: fonts.poppins, mt: 2 }}
            />
          )}
        </>
      )}

      {/* Invite Sub-Admin modal — Figma 1283:110133 */}
      <Dialog
        open={inviteModalOpen}
        onClose={inviteSubmitting ? undefined : handleInviteModalClose}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            px: "24px",
            py: "32px",
            width: "560px",
            maxWidth: "95vw",
            position: "relative",
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backdropFilter: "blur(11px)",
              backgroundColor: "rgba(0,0,0,0.5)",
            },
          },
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleInviteModalClose}
          disabled={inviteSubmitting}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "#545454",
          }}
        >
          <CloseIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <DialogContent sx={{ p: 0, "&.MuiDialogContent-root": { pt: 0 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
              width: "100%",
            }}
          >
            <Box sx={{ width: "100%", textAlign: "center" }}>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 700,
                  fontSize: "26px",
                  color: "#000",
                  letterSpacing: "-0.52px",
                  display: "block",
                }}
              >
                Invite Sub-Admin
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 400,
                  fontSize: "16px",
                  color: modalSubtitleColor,
                  mt: 0.5,
                  display: "block",
                }}
              >
                Send an email invitation to a new sub-admin
              </Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "13px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <Typography
                  component="label"
                  sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: modalLabelColor,
                  }}
                >
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Email Address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: null,
                    endAdornment: (
                      <EmailIcon
                        sx={{ color: "rgba(0,0,0,0.5)", fontSize: 24, ml: 1 }}
                      />
                    ),
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: "16px",
                      backgroundColor: modalInputBg,
                      borderRadius: "90px",
                      height: "54px",
                      "& fieldset": { border: "none" },
                      "& .MuiInputBase-input::placeholder": {
                        opacity: 0.5,
                        color: "#000",
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      paddingLeft: "23px",
                      paddingRight: "12px",
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  width: "100%",
                }}
              >
                <Typography
                  component="label"
                  sx={{
                    fontFamily: fonts.poppins,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: modalLabelColor,
                  }}
                >
                  Message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={4}
                  placeholder="Add a personal message to the invitation..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      fontFamily: fonts.poppins,
                      fontSize: "16px",
                      backgroundColor: modalInputBg,
                      borderRadius: "18px",
                      minHeight: "132px",
                      alignItems: "flex-start",
                      py: "15px",
                      "& fieldset": { border: "none" },
                      "& .MuiInputBase-input::placeholder": {
                        opacity: 0.5,
                        color: "#000",
                      },
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      paddingLeft: "23px",
                      paddingRight: "23px",
                    },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{ display: "flex", gap: "10px", alignSelf: "flex-center" }}
            >
              <Button
                variant="contained"
                onClick={handleInviteModalClose}
                disabled={inviteSubmitting}
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "16px",
                  textTransform: "none",
                  backgroundColor: modalCloseButtonBg,
                  borderRadius: "90px",
                  width: "154px",
                  height: "48px",
                  px: "20px",
                  py: "6px",
                  "&:hover": { backgroundColor: "#5a5a5a" },
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleSendInvite}
                disabled={inviteSubmitting}
                startIcon={
                  inviteSubmitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: 600,
                  fontSize: "16px",
                  textTransform: "none",
                  background: inviteButtonGradient,
                  borderRadius: "90px",
                  width: "154px",
                  height: "48px",
                  px: "20px",
                  py: "6px",
                  "&:hover": {
                    background: inviteButtonGradient,
                    opacity: 0.95,
                  },
                }}
              >
                {inviteSubmitting ? "Sending…" : "Send Invite"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminManageAdmins;
