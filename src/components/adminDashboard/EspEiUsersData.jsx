import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
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
import OrgReviewModal from "../../models/OrgReviewModal.jsx";
import {
  getAllOrganizations,
  getUniversityClaimRequests,
  approveUniversityClaim,
  rejectUniversityClaim,
  selectClaimRequestsPendingCount,
  selectOrganizationsData,
} from "../../redux/slices/adminSlice.js";
import UniversityClaimRequests from "./UniversityClaimRequests.jsx";
import ClaimActionConfirmDialog from "./ClaimActionConfirmDialog.jsx";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";

const TAB_ESP = 0;
const TAB_EI = 1;
const TAB_CLAIMS = 2;
const ORGANIZATION_TYPE_ESP = "ESP";
const ORGANIZATION_TYPE_HEI = "HEI";

const accentColor = "#BC2876";
const accentColorInactive = "#999999";
const searchButtonGradient = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";
const separatorColor = "#DDDDDD";
const placeholderColor = "#BDBDBD";
const inputBorderColor = "#E0E0E0";

const tableHeadStyle = {
  fontWeight: 600,
  fontFamily: fonts.poppins,
  color: "#717f8c",
  fontSize: "0.875rem",
};

const tableBodyStyle = {
  fontFamily: fonts.poppins,
  color: "#545454",
  fontSize: "0.875rem",
};

const getStatusColor = (status) => {
  if (status === "active") return "#22c55e";
  if (status === "blocked") return "#ef4444";
  if (status === "pending") return "#f59e0b";
  return "#545454";
};

const EspEiUsersData = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const organizationsData = useSelector(selectOrganizationsData);
  const claimRequestsPendingCount = useSelector(selectClaimRequestsPendingCount);

  const [tabValue, setTabValue] = useState(TAB_ESP);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [universityClaimReview, setUniversityClaimReview] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: null });
  const [claimActionLoading, setClaimActionLoading] = useState(null);
  const [claimsRefreshKey, setClaimsRefreshKey] = useState(0);

  const organizationType =
    tabValue === TAB_ESP
      ? ORGANIZATION_TYPE_ESP
      : tabValue === TAB_EI
        ? ORGANIZATION_TYPE_HEI
        : null;
  const organizationsRaw = organizationsData?.organizations ?? [];
  /** Hide unapproved claim-flow HEIs from EI tab (they belong on University claim requests). */
  const organizations =
    tabValue === TAB_EI
      ? organizationsRaw.filter((org) => !org.isClaimFlow || org.status === "active")
      : organizationsRaw;
  const totalOrganizations = organizationsData?.totalOrganizations ?? 0;

  useEffect(() => {
    if (!token || !organizationType) return;
    dispatch(
      getAllOrganizations({
        token,
        organizationType,
        page: page + 1,
        limit: rowsPerPage,
        ...(appliedSearch.trim() && { search: appliedSearch.trim() }),
      }),
    );
  }, [dispatch, token, organizationType, page, rowsPerPage, appliedSearch]);

  useEffect(() => {
    if (!token) return;
    dispatch(getUniversityClaimRequests({ token, page: 1, limit: 1 }));
  }, [dispatch, token]);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setPage(0);
    setAppliedSearch("");
    setSearchQuery("");
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchClick = () => {
    setAppliedSearch(searchQuery);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleViewClick = (org) => {
    setUniversityClaimReview(null);
    setSelectedOrganization(org);
    setIsReviewModalOpen(true);
  };

  const handleClaimReview = (org, claimReview) => {
    setSelectedOrganization(org);
    setUniversityClaimReview(claimReview);
    setIsReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setSelectedOrganization(null);
    setUniversityClaimReview(null);
    setConfirmDialog({ open: false, type: null });
    setClaimActionLoading(null);
  };

  const refreshOrganizationsAfterClaim = () => {
    if (!token) return;
    dispatch(
      getAllOrganizations({
        token,
        organizationType: ORGANIZATION_TYPE_HEI,
        page: 1,
        limit: rowsPerPage,
        ...(appliedSearch.trim() && { search: appliedSearch.trim() }),
      }),
    );
    dispatch(getUniversityClaimRequests({ token, page: 1, limit: 1 }));
  };

  const runClaimApprove = async () => {
    const directoryId = universityClaimReview?.directoryId;
    if (!token || !directoryId) return;
    try {
      setClaimActionLoading("approve");
      await dispatch(approveUniversityClaim({ token, directoryId })).unwrap();
      dispatch(
        notify({
          type: "success",
          message: "Claim approved. Institution is now active in Education Institutions.",
        }),
      );
      handleReviewModalClose();
      refreshOrganizationsAfterClaim();
      setClaimsRefreshKey((k) => k + 1);
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Could not approve claim.",
        }),
      );
    } finally {
      setClaimActionLoading(null);
      setConfirmDialog({ open: false, type: null });
    }
  };

  const runClaimReject = async () => {
    const directoryId = universityClaimReview?.directoryId;
    if (!token || !directoryId) return;
    try {
      setClaimActionLoading("reject");
      await dispatch(rejectUniversityClaim({ token, directoryId })).unwrap();
      dispatch(notify({ type: "success", message: "Claim rejected." }));
      setConfirmDialog({ open: false, type: null });
      setClaimActionLoading(null);
      setClaimsRefreshKey((k) => k + 1);
      handleReviewModalClose();
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Could not reject claim.",
        }),
      );
      setClaimActionLoading(null);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ ml: 2, mt: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontFamily: fonts.poppins }}>
        ESP & EI User
      </Typography>
      </Box>

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
          centered
          textColor="inherit"
          sx={{
            px: 2,
            pt: 1,
            minHeight: 48,
            "& .MuiTab-root": {
              fontFamily: fonts.poppins,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              color: accentColorInactive,
              minHeight: 48,
              px: 3,
            },
            "& .MuiTab-root.Mui-selected": {
              color: accentColor,
              fontWeight: 700,
            },
            "& .MuiTabs-indicator": {
              backgroundColor: accentColor,
              height: 3,
            },
            "& .MuiTabs-flexContainer": {
              gap: "24px",
              justifyContent: "center",
            },
          }}
        >
          <Tab label="Education Service Provider" id="esp-tab" />
          <Tab label="Education Institutions" id="ei-tab" />
          <Tab
            id="uni-claims-tab"
            label={
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "nowrap" }}>
                <Typography component="span" sx={{ fontFamily: fonts.poppins, fontWeight: "inherit", fontSize: "inherit" }}>
                  University claim requests
                </Typography>
                {claimRequestsPendingCount > 0 ? (
                  <Chip
                    label={claimRequestsPendingCount}
                    size="small"
                    sx={{
                      backgroundColor: "#E65100",
                      color: "#fff",
                      fontFamily: fonts.poppins,
                      fontWeight: 600,
                      height: 22,
                      minWidth: 22,
                      "& .MuiChip-label": { px: 0.75 },
                    }}
                  />
                ) : null}
              </Box>
            }
          />
        </Tabs>

        <Box
          sx={{
            borderBottom: `1px solid ${separatorColor}`,
            width: "100%",
          }}
        />

        {tabValue === TAB_CLAIMS ? (
          <Box sx={{ p: 2, pt: 2.5, pb: 2.5 }}>
            <UniversityClaimRequests
              refreshKey={claimsRefreshKey}
              onReviewOrganization={handleClaimReview}
            />
          </Box>
        ) : (
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
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
              size="small"
              fullWidth
              sx={{
                flex: 1,
                fontFamily: fonts.poppins,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fff",
                  borderRadius: "8px",
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
                  color: placeholderColor,
                  opacity: 1,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearchClick}
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 700,
                fontSize: "0.8125rem",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                background: searchButtonGradient,
                borderRadius: "8px",
                px: 2.5,
                py: 1.5,
                minWidth: "120px",
                "&:hover": {
                  background: searchButtonGradient,
                  opacity: 0.95,
                },
              }}
            >
              Search
            </Button>
          </Box>
        )}
      </Box>

      {tabValue !== TAB_CLAIMS && (
        <>
          <TableContainer
            sx={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <Table size="medium" aria-label="organizations table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell sx={tableHeadStyle}>Name</TableCell>
                  <TableCell sx={tableHeadStyle}>Email</TableCell>
                  <TableCell sx={tableHeadStyle}>Mobile No.</TableCell>
                  <TableCell sx={tableHeadStyle}>Status</TableCell>
                  <TableCell sx={tableHeadStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organizations.length > 0 ? (
                  organizations.map((org) => (
                    <TableRow
                      key={org._id}
                      sx={{
                        "&:hover": { backgroundColor: "#fafafa" },
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <TableCell sx={{ ...tableBodyStyle, fontWeight: 500 }}>
                        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5 }}>
                          {org.organizationName || "—"}
                          {org.isClaimFlow ? (
                            <Chip
                              label="Claim Flow"
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: "#FFF3E0",
                                color: "#E65100",
                                fontFamily: fonts.poppins,
                                fontWeight: 600,
                                fontSize: "0.7rem",
                                height: "20px",
                                border: "1px solid #E65100",
                              }}
                            />
                          ) : null}
                        </Box>
                      </TableCell>
                      <TableCell sx={tableBodyStyle}>
                        {org.email || org.contactEmail || "—"}
                      </TableCell>
                      <TableCell sx={tableBodyStyle}>{org.mobile || "—"}</TableCell>
                      <TableCell
                        sx={{
                          ...tableBodyStyle,
                          fontWeight: 600,
                          color: getStatusColor(org.status),
                        }}
                      >
                        {org.status || "—"}
                      </TableCell>
                      <TableCell>
                        <Typography
                          component="button"
                          onClick={() => handleViewClick(org)}
                          sx={{
                            fontFamily: fonts.poppins,
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            color: accentColor,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          View
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography sx={{ fontFamily: fonts.poppins, fontWeight: 500, color: "#717f8c" }}>
                        No organizations found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalOrganizations > 0 && (
            <TablePagination
              component="div"
              count={totalOrganizations}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{
                fontFamily: fonts.poppins,
                mt: 2,
              }}
            />
          )}
        </>
      )}

      <OrgReviewModal
        open={isReviewModalOpen}
        onClose={handleReviewModalClose}
        organization={selectedOrganization}
        universityClaimReview={universityClaimReview}
        claimActionLoading={claimActionLoading}
        onApproveClaim={() => setConfirmDialog({ open: true, type: "approve" })}
        onRejectClaim={() => setConfirmDialog({ open: true, type: "reject" })}
      />

      <ClaimActionConfirmDialog
        open={confirmDialog.open}
        type={confirmDialog.type}
        universityName={universityClaimReview?.universityName}
        loading={claimActionLoading}
        onConfirm={() => {
          if (confirmDialog.type === "approve") runClaimApprove();
          else if (confirmDialog.type === "reject") runClaimReject();
        }}
        onCancel={() => {
          if (!claimActionLoading) setConfirmDialog({ open: false, type: null });
        }}
      />
    </Box>
  );
};

export default EspEiUsersData;
