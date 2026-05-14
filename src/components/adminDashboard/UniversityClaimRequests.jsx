import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
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
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  getUniversityClaimRequests,
  selectClaimRequests,
  selectClaimRequestsError,
  selectClaimRequestsLoading,
  selectClaimRequestsTotal,
} from "../../redux/slices/adminSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";

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

function mapOrgForReviewModal(row) {
  const p = row?.orgProfile;
  if (!p) return null;
  const c = row.claimant || {};
  const userId = p.userId ?? p.user?._id ?? p.user;
  return {
    ...p,
    organizationName: p.organizationName || row.name,
    organizationType: "HEI",
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    userId,
    status: p.status || "pending",
  };
}

const UniversityClaimRequests = ({ onReviewOrganization }) => {
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
  const [detailRow, setDetailRow] = useState(null);

  const fetchData = useCallback(() => {
    if (!token) return;
    dispatch(
      getUniversityClaimRequests({
        token,
        page: page + 1,
        limit: rowsPerPage,
        search: appliedSearch.trim(),
      }),
    );
  }, [dispatch, token, page, rowsPerPage, appliedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = () => {
    setAppliedSearch(searchInput);
    setPage(0);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
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

      {loadError ? (
        <Typography sx={{ color: "error.main", fontFamily: fonts.poppins, mb: 1 }}>
          {loadError}
        </Typography>
      ) : null}

      {loading && rows.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress sx={{ color: "#BC2876" }} />
        </Box>
      ) : null}

      {!loading && rows.length === 0 ? (
        <Typography sx={{ fontFamily: fonts.poppins, color: "#717f8c", py: 2 }}>
          No pending claims
        </Typography>
      ) : null}

      {rows.length > 0 ? (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell sx={tableHeadStyle}>University Name</TableCell>
                  <TableCell sx={tableHeadStyle}>Country</TableCell>
                  <TableCell sx={tableHeadStyle}>QS Rank</TableCell>
                  <TableCell sx={tableHeadStyle}>Claimant</TableCell>
                  <TableCell sx={tableHeadStyle}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row._id || row.slug}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => setDetailRow(row)}
                  >
                    <TableCell sx={{ ...tableBodyStyle, fontWeight: 500 }}>{row.name || "—"}</TableCell>
                    <TableCell sx={tableBodyStyle}>{row.country || "—"}</TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {row.qsRank != null && row.qsRank !== "" ? `#${row.qsRank}` : "—"}
                    </TableCell>
                    <TableCell sx={tableBodyStyle}>
                      {row.claimant
                        ? `${[row.claimant.firstName, row.claimant.lastName].filter(Boolean).join(" ") || "—"} (${row.claimant.email || "—"})`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label="Pending"
                        size="small"
                        sx={{
                          backgroundColor: "#FFF3E0",
                          color: "#E65100",
                          fontFamily: fonts.poppins,
                          fontWeight: 600,
                          border: "1px solid #E65100",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
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

      <Dialog open={Boolean(detailRow)} onClose={() => setDetailRow(null)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: fonts.poppins,
            fontWeight: 700,
          }}
        >
          Claim request
          <IconButton size="small" onClick={() => setDetailRow(null)} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailRow ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                {detailRow.logo ? (
                  <Box
                    component="img"
                    src={detailRow.logo}
                    alt=""
                    sx={{ width: 72, height: 72, objectFit: "contain", borderRadius: 1 }}
                  />
                ) : null}
                <Box>
                  <Typography sx={{ fontFamily: fonts.poppins, fontWeight: 700 }}>
                    {detailRow.name}
                  </Typography>
                  <Typography sx={{ fontFamily: fonts.poppins, fontSize: "0.875rem", color: "#555" }}>
                    {detailRow.country || "—"}
                    {detailRow.qsRank != null && detailRow.qsRank !== ""
                      ? ` · QS #${detailRow.qsRank}`
                      : ""}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography
                  sx={{ fontFamily: fonts.poppins, fontSize: "0.82rem", color: "#555", mb: 0.5 }}
                >
                  Claimant
                </Typography>
                <Typography sx={{ fontFamily: fonts.poppins }}>
                  {[detailRow.claimant?.firstName, detailRow.claimant?.lastName].filter(Boolean).join(" ") || "—"}
                </Typography>
                <Typography sx={{ fontFamily: fonts.poppins, fontSize: "0.875rem" }}>
                  {detailRow.claimant?.email || "—"}
                </Typography>
              </Box>
              {detailRow.slug ? (
                <Box>
                  <Typography
                    sx={{ fontFamily: fonts.poppins, fontSize: "0.82rem", color: "#555", mb: 0.5 }}
                  >
                    University directory page
                  </Typography>
                  <Link
                    href={`${origin}/university/${detailRow.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      fontFamily: fonts.poppins,
                      fontSize: "0.85rem",
                      color: "#BC2876",
                      wordBreak: "break-all",
                    }}
                  >
                    {`${origin}/university/${detailRow.slug}`}
                  </Link>
                </Box>
              ) : null}
              {detailRow.orgProfile && mapOrgForReviewModal(detailRow)?.userId ? (
                <Button
                  variant="outlined"
                  sx={{
                    alignSelf: "flex-start",
                    fontFamily: fonts.poppins,
                    fontWeight: 600,
                    textTransform: "none",
                    borderColor: "#BC2876",
                    color: "#BC2876",
                  }}
                  onClick={() => {
                    const mapped = mapOrgForReviewModal(detailRow);
                    if (mapped?.userId) {
                      onReviewOrganization?.(mapped);
                      setDetailRow(null);
                    }
                  }}
                >
                  Review Organization Registration →
                </Button>
              ) : detailRow.orgProfile ? (
                <Typography sx={{ fontFamily: fonts.poppins, fontSize: "0.82rem", color: "#888" }}>
                  Linked organization profile has no user id yet — use the EI table to review when available.
                </Typography>
              ) : null}
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UniversityClaimRequests;
