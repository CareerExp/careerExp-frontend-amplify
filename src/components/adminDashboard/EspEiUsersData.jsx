import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
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
  selectOrganizationsData,
} from "../../redux/slices/adminSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { fonts } from "../../utility/fonts.js";

const TAB_ESP = 0;
const TAB_EI = 1;
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

  const [tabValue, setTabValue] = useState(TAB_ESP);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const organizationType = tabValue === TAB_ESP ? ORGANIZATION_TYPE_ESP : ORGANIZATION_TYPE_HEI;
  const organizations = organizationsData?.organizations ?? [];
  const totalOrganizations = organizationsData?.totalOrganizations ?? 0;

  useEffect(() => {
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
    setSelectedOrganization(org);
    setIsReviewModalOpen(true);
  };

  const handleReviewModalClose = () => {
    setIsReviewModalOpen(false);
    setSelectedOrganization(null);
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
        </Tabs>

        <Box
          sx={{
            borderBottom: `1px solid ${separatorColor}`,
            width: "100%",
          }}
        />

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
      </Box>

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
                    {org.organizationName || "—"}
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

      <OrgReviewModal
        open={isReviewModalOpen}
        onClose={handleReviewModalClose}
        organization={selectedOrganization}
      />
    </Box>
  );
};

export default EspEiUsersData;
