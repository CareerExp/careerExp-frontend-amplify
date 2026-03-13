import {
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { enterAMEContext, getAMEOrganizations, selectAMEOrganizationsData } from "../../redux/slices/adminSlice.js";
import { setActingAsAME } from "../../redux/slices/ameContextSlice.js";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { getMyOrganizationProfile } from "../../redux/slices/organizationSlice.js";
import { buttonStyle, tableBodyStyle, tableHeadStyle } from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";
import AddEducationServiceProviderModal from "../../models/AddEducationServiceProviderModal.jsx";

// Search bar styling – match EspEiUsersData.jsx
const accentColor = "#BC2876";
const inputBorderColor = "#E0E0E0";
const placeholderColor = "#BDBDBD";
const searchButtonGradient = "linear-gradient(180deg, #BF2F75 0%, #720361 100%)";

const getStatusColor = (status) => {
  if (status === "active") return "#22c55e";
  if (status === "blocked") return "#ef4444";
  if (status === "pending") return "#f59e0b";
  return "#545454";
};

const AdminManagedESPsData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const ameData = useSelector(selectAMEOrganizationsData);

  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [openDashboardError, setOpenDashboardError] = useState(null);

  const ameList = ameData?.organizations ?? [];
  const totalCount = ameData?.totalOrganizations ?? 0;

  useEffect(() => {
    dispatch(
      getAMEOrganizations({
        token,
        page: page + 1,
        limit: rowsPerPage,
        ...(appliedSearch.trim() && { search: appliedSearch.trim() }),
      })
    );
  }, [dispatch, token, page, rowsPerPage, appliedSearch]);

  const handleSearchInputChange = (event) => setSearchQuery(event.target.value);

  const handleSearchClick = () => {
    setAppliedSearch(searchQuery);
    setPage(0);
  };

  const handleAddAMEClick = () => setIsAddModalOpen(true);

  const handleAddAMESuccess = () => {
    dispatch(
      getAMEOrganizations({
        token,
        page: page + 1,
        limit: rowsPerPage,
        ...(appliedSearch.trim() && { search: appliedSearch.trim() }),
      })
    );
  };

  /** Option 1: enter-context API; set acting-as so PUT /api/organization/profile/me sends X-Acting-As-Organization-Id; then fetch org and go to workspace. */
  const handleOpenDashboardClick = async (org) => {
    setOpenDashboardError(null);
    try {
      await dispatch(enterAMEContext({ actingAsOrganizationId: org._id, token })).unwrap();
      dispatch(setActingAsAME({ organizationProfileId: org._id, organizationName: org.organizationName ?? org.name }));
      await dispatch(getMyOrganizationProfile({ token })).unwrap();
      navigate(`/workspace/${userId}`);
    } catch (err) {
      setOpenDashboardError(err?.message || "Failed to open ESP dashboard");
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      {/* Page title and Add AME button on same row (Figma: header row) */}
      <Box
        sx={{
          ml: 2,
          mt: 2,
          mr: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="600" sx={{ fontFamily: fonts.poppins }}>
          Admin managed ESP Users
        </Typography>
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            minWidth: "260px",
            textWrap: "nowrap",
            textTransform: "none",
            fontSize: "15px",
            fontWeight: "600",
          }}
          onClick={handleAddAMEClick}
        >
          Add Education Service Provider 
        </Button>
      </Box>

      {openDashboardError && (
        <Box sx={{ ml: 2, mr: 2, mt: 1 }}>
          <Alert severity="error" onClose={() => setOpenDashboardError(null)}>
            {openDashboardError}
          </Alert>
        </Box>
      )}

      {/* Search section – same UI as EspEiUsersData.jsx */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "10px 10px 0px 0px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
          mt: 2,
        }}
      >
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
            onChange={handleSearchInputChange}
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
      </Box>

      {/* Table section */}
      <TableContainer
        sx={{
          backgroundColor: "white",
          borderRadius: "0px 0px 10px 10px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.08)",
        }}
      >
        <Table size="medium" aria-label="admin managed ESPs table" sx={{ tableLayout: "fixed" }}>
          <TableHead sx={{ backgroundColor: "transparent" }}>
            <TableRow>
              <TableCell sx={{ ...tableHeadStyle, width: "55%" }}>Name</TableCell>
              <TableCell sx={{ ...tableHeadStyle, width: "25%" }}>Status</TableCell>
              <TableCell sx={{ ...tableHeadStyle, width: "20%", textAlign: "left" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(ameList) && ameList.length > 0 ? (
              ameList.map((ame) => (
                <TableRow
                  key={ame._id}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <TableCell sx={{ ...tableBodyStyle, fontWeight: 500 }}>
                    {ame.organizationName ?? ([ame.firstName, ame.lastName].filter(Boolean).join(" ") || "—")}
                  </TableCell>
                  <TableCell
                    sx={{
                      ...tableBodyStyle,
                      fontWeight: 600,
                      color: getStatusColor(ame.status),
                    }}
                  >
                    {ame.status ?? "—"}
                  </TableCell>
                  <TableCell align="left">
                    <Typography
                      component="button"
                      type="button"
                      onClick={() => handleOpenDashboardClick(ame)}
                      sx={{
                        fontFamily: fonts.poppins,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        color: "#BC2876",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        "&:hover": { textDecoration: "underline" },
                      }}
                    >
                      Open Dashboard
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" sx={{ fontFamily: fonts.poppins, fontWeight: "600", color: "#717f8c" }}>
                    No AMEs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - integration-ready: uses totalCount when API connected */}
      {totalCount > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ fontFamily: fonts.poppins, mt: 2 }}
        />
      )}

      <AddEducationServiceProviderModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddAMESuccess}
      />
    </div>
  );
};

export default AdminManagedESPsData;
