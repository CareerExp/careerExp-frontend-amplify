import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useDispatch, useSelector } from "react-redux";
import {
  getUniversityClaimRequests,
  deleteUniversityClaimRequest,
  selectClaimRequests,
  selectClaimRequestsError,
  selectClaimRequestsLoading,
  selectClaimRequestsTotal,
} from "../../redux/slices/adminSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { fonts } from "../../utility/fonts.js";
import ClaimActionConfirmDialog from "./ClaimActionConfirmDialog.jsx";

const tableCellPadding = { py: 2 };

const tableHeadStyle = {
  fontWeight: 600,
  fontFamily: fonts.poppins,
  color: "#717f8c",
  fontSize: "0.875rem",
  ...tableCellPadding,
};

const tableBodyStyle = {
  fontFamily: fonts.poppins,
  color: "#545454",
  fontSize: "0.875rem",
  ...tableCellPadding,
};

const accentColor = "#BC2876";

/** Build modal payload from list row (reviewOrganization + claimant + orgProfile). */
export function mapOrgForReviewModal(row) {
  if (!row) return null;

  const p = row.orgProfile || {};
  const c = row.claimant || {};
  const ro = row.reviewOrganization && typeof row.reviewOrganization === "object" ? row.reviewOrganization : null;
  const userId = ro?.userId ?? p.userId ?? row.pendingClaimUserId;
  if (!userId) return null;

  const mobile = (ro?.mobile || c.mobile || p.mobile || "").trim();
  const telephone = (ro?.telephone || p.telephone || c.telephone || "").trim();

  return {
    _id: ro?._id ?? p._id,
    userId: String(userId),
    organizationName: ro?.organizationName || p.organizationName || row.name || "",
    organizationType: ro?.organizationType || p.organizationType || "HEI",
    slug: ro?.slug ?? p.slug,
    claimUniversitySlug: ro?.claimUniversitySlug || p.claimUniversitySlug || row.slug || "",
    isClaimFlow: ro?.isClaimFlow ?? p.isClaimFlow ?? true,
    firstName: ro?.firstName || c.firstName || "",
    lastName: ro?.lastName || c.lastName || "",
    email: ro?.email || c.email || p.contactEmail || "",
    mobile,
    status: ro?.status || c.status || p.status || "pending",
    registrationNo: (ro?.registrationNo || p.registrationNo || "").trim(),
    telephone,
    address: ro?.address || p.address || "",
    state: ro?.state || p.state || "",
    country: ro?.country || p.country || row.country || "",
    website: ro?.website || p.website || "",
    documents: Array.isArray(ro?.documents) ? ro.documents : Array.isArray(p.documents) ? p.documents : [],
  };
}

function getEffectiveClaimStatus(row) {
  if (row?.claimStatus === "rejected" || row?.claimant?.status === "blocked") {
    return "rejected";
  }
  return "pending";
}

function getClaimStatusChip(row) {
  if (getEffectiveClaimStatus(row) === "rejected") {
    return {
      label: "Rejected",
      bg: "#FEE2E2",
      color: "#B91C1C",
      border: "#B91C1C",
    };
  }
  return {
    label: "Pending",
    bg: "#FFF3E0",
    color: "#E65100",
    border: "#E65100",
  };
}

const UniversityClaimRequests = ({ onReviewOrganization, refreshKey = 0 }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const rows = useSelector(selectClaimRequests);
  const total = useSelector(selectClaimRequestsTotal);
  const loading = useSelector(selectClaimRequestsLoading);
  const loadError = useSelector(selectClaimRequestsError);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, row: null });

  const fetchData = useCallback(() => {
    if (!token) return;
    dispatch(
      getUniversityClaimRequests({
        token,
        page: page + 1,
        limit: rowsPerPage,
        search: appliedSearch.trim(),
        status: statusFilter,
      }),
    );
  }, [dispatch, token, page, rowsPerPage, appliedSearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const handleSearch = () => {
    setAppliedSearch(searchInput);
    setPage(0);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const handleView = (row) => {
    if (!onReviewOrganization) return;

    const mappedOrg = mapOrgForReviewModal(row);
    if (!mappedOrg) {
      dispatch(notify({ type: "error", message: "Could not load organization details for this claim." }));
      return;
    }

    onReviewOrganization(mappedOrg, {
      directoryId: row._id,
      claimStatus: getEffectiveClaimStatus(row),
      universityName: row.name,
    });
  };

  const handleDeleteClick = (e, row) => {
    e.stopPropagation();
    if (!row?._id) return;
    setDeleteConfirm({ open: true, row });
  };

  const handleDeleteCancel = () => {
    if (deleteLoadingId) return;
    setDeleteConfirm({ open: false, row: null });
  };

  const runDeleteConfirm = async () => {
    const row = deleteConfirm.row;
    const directoryId = row?._id;
    if (!token || !directoryId) return;
    try {
      setDeleteLoadingId(String(directoryId));
      await dispatch(deleteUniversityClaimRequest({ token, directoryId })).unwrap();
      dispatch(notify({ type: "success", message: "Claim request removed." }));
      setDeleteConfirm({ open: false, row: null });
      fetchData();
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Could not delete claim request.",
        }),
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, flex: "1 1 220px", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search by university name"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            sx={{ flex: "1 1 220px", fontFamily: fonts.poppins }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: 600,
              textTransform: "none",
              background: "linear-gradient(180deg, #BF2F75 0%, #720361 100%)",
            }}
          >
            Search
          </Button>
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            displayEmpty
            sx={{ fontFamily: fonts.poppins, fontSize: "0.875rem" }}
          >
            <MenuItem value="" sx={{ fontFamily: fonts.poppins }}>
              All statuses
            </MenuItem>
            <MenuItem value="pending" sx={{ fontFamily: fonts.poppins }}>
              Pending
            </MenuItem>
            <MenuItem value="rejected" sx={{ fontFamily: fonts.poppins }}>
              Rejected
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loadError ? (
        <Typography sx={{ color: "error.main", fontFamily: fonts.poppins, mb: 1 }}>
          {loadError}
        </Typography>
      ) : null}

      {!loadError && rows.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 280,
            width: "100%",
          }}
        >
          {loading ? (
            <CircularProgress sx={{ color: "#BC2876" }} />
          ) : (
            <Typography
              sx={{
                fontFamily: fonts.poppins,
                fontWeight: 500,
                color: "#717f8c",
                textAlign: "center",
              }}
            >
              No university claim requests
            </Typography>
          )}
        </Box>
      ) : null}

      {rows.length > 0 ? (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell sx={tableHeadStyle}>University Name</TableCell>
                  <TableCell sx={tableHeadStyle}>Country</TableCell>
                  <TableCell sx={tableHeadStyle}>Claimant</TableCell>
                  <TableCell sx={tableHeadStyle}>Status</TableCell>
                  <TableCell sx={tableHeadStyle}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const chip = getClaimStatusChip(row);
                  const rowId = String(row._id);
                  const isDeleting = deleteLoadingId === rowId;
                  return (
                    <TableRow
                      key={
                        row._id
                          ? String(row._id)
                          : `${row.slug || "uni"}-${row.claimant?.email || row.pendingClaimUserId || Math.random()}`
                      }
                      hover
                    >
                      <TableCell sx={{ ...tableBodyStyle, fontWeight: 500 }}>
                        {row.name || "—"}
                      </TableCell>
                      <TableCell sx={tableBodyStyle}>{row.country || "—"}</TableCell>
                      <TableCell sx={tableBodyStyle}>
                        {row.claimant
                          ? `${[row.claimant.firstName, row.claimant.lastName].filter(Boolean).join(" ") || "—"} (${row.claimant.email || "—"})`
                          : "—"}
                      </TableCell>
                      <TableCell sx={tableCellPadding}>
                        <Chip
                          label={chip.label}
                          size="small"
                          sx={{
                            backgroundColor: chip.bg,
                            color: chip.color,
                            fontFamily: fonts.poppins,
                            fontWeight: 600,
                            border: `1px solid ${chip.border}`,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={tableCellPadding}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Typography
                            component="button"
                            onClick={() => handleView(row)}
                            sx={{
                              fontFamily: fonts.poppins,
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              color: accentColor,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              mr: 1,
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            View
                          </Typography>
                          <IconButton
                            size="small"
                            aria-label="Delete claim request"
                            disabled={isDeleting}
                            onClick={(e) => handleDeleteClick(e, row)}
                            sx={{ color: "#6B7280", "&:hover": { color: "#dc2626" } }}
                          >
                            {isDeleting ? (
                              <CircularProgress size={18} />
                            ) : (
                              <DeleteOutlineIcon fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{ fontFamily: fonts.poppins }}
          />
        </>
      ) : null}

      <ClaimActionConfirmDialog
        open={deleteConfirm.open}
        type="delete"
        universityName={deleteConfirm.row?.name}
        loading={Boolean(deleteLoadingId)}
        onConfirm={runDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
};

export default UniversityClaimRequests;
