import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
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
import StatusUpdateModal from "../../models/StatusUpdateModal.jsx";
import { getAllCreators, selectCreatorsData, updateActiveStatus } from "../../redux/slices/adminSlice.js";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken } from "../../redux/slices/authSlice.js";
import { buttonStyle, inputFieldStyle, tableBodyStyle, tableHeadStyle } from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";

const CollaboratorsData = () => {
  const dispatchToRedux = useDispatch();
  const creatorsInfo = useSelector(selectCreatorsData);
  const token = useSelector(selectToken);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // GET REQUEST
  useEffect(() => {
    dispatchToRedux(getAllCreators({ token, page: page + 1, limit: rowsPerPage }));
  }, [dispatchToRedux, token, page, rowsPerPage]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchQuery === "") {
      dispatchToRedux(notify({ type: "warning", message: "Please enter a search query" }));
      return;
    }

    setPage(0);
    dispatchToRedux(
      getAllCreators({
        token,
        page: 1,
        limit: rowsPerPage,
        search: searchQuery,
      }),
    );
  };

  // Event handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusClick = (userId) => {
    setSelectedUserId(userId);
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async (status) => {
    if (!selectedUserId || !status) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Please select a valid status.",
        }),
      );
      return;
    }

    try {
      setIsButtonLoading(true);
      await dispatchToRedux(updateActiveStatus({ userId: selectedUserId, status, token }));
      dispatchToRedux(notify({ type: "success", message: "Status updated successfully" }));
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, Please try again",
        }),
      );
    } finally {
      setIsButtonLoading(false);
      setIsStatusModalOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <div>
      {/* Search Box */}
      <Box sx={{ ml: 2, mt: 2 }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontFamily: fonts.poppins }}>
          Counsellors
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          mt: 2,
          backgroundColor: "white",
          borderRadius: "10px 10px 0px 0px",
          display: "flex",
          alignItems: "center",
          gap: 2, // Add gap between TextField and Button
        }}
      >
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          sx={{ ...inputFieldStyle, flex: 1 }}
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <Button
          sx={{ ...buttonStyle, width: { xs: "20%", sm: "30%", md: "20%" } }}
          onClick={handleSearchClick}
        >
          Search
        </Button>
      </Box>

      {/* Table of Collaborators */}
      <TableContainer
        sx={{
          mt: 2,
          borderRadius: "0px 0px 10px 10px",
        }}
      >
        <Table size="medium" aria-label="collaborators table">
          <TableHead sx={{ backgroundColor: "transparent" }}>
            <TableRow>
              <TableCell sx={tableHeadStyle}>Name</TableCell>
              <TableCell sx={tableHeadStyle}>Email</TableCell>
              <TableCell sx={tableHeadStyle}>Mobile No.</TableCell>
              <TableCell sx={tableHeadStyle}>Gender</TableCell>
              <TableCell sx={tableHeadStyle}>Status</TableCell>
              {/* <TableCell></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(creatorsInfo?.creators) && creatorsInfo.creators.length > 0 ? (
              creatorsInfo.creators.map((collaborator) => (
                <TableRow
                  key={collaborator._id}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    cursor: "pointer",
                  }}
                >
                  <TableCell
                    sx={{
                      ...tableBodyStyle,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    <Avatar src={collaborator.profilePicture} alt="Profile" />
                    {collaborator.firstName + " " + collaborator.lastName}
                  </TableCell>

                  <TableCell sx={tableBodyStyle}>
                    {collaborator.email}
                    {collaborator.isEmailVerified && (
                      <span
                        style={{
                          color: "blue",
                          marginLeft: "5px",
                          fontSize: "25px",
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </TableCell>

                  <TableCell sx={tableBodyStyle}>{collaborator.mobile}</TableCell>
                  <TableCell sx={tableBodyStyle}>{collaborator.gender}</TableCell>

                  <TableCell
                    onClick={() => handleStatusClick(collaborator._id)}
                    sx={{
                      color:
                        collaborator.status === "active"
                          ? "green"
                          : collaborator.status === "banned"
                            ? "red"
                            : collaborator.status === "pending"
                              ? "orange"
                              : "black",
                      fontFamily: fonts.poppins,
                      fontWeight: "600",
                    }}
                  >
                    {collaborator.status}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" sx={{ fontFamily: fonts.poppins, fontWeight: "600" }}>
                    No Counsellors found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {creatorsInfo?.creators?.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={creatorsInfo?.totalCreators || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      {/* Status Update Modal */}
      <StatusUpdateModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleStatusSubmit}
        isButtonLoading={isButtonLoading}
      />
    </div>
  );
};

export default CollaboratorsData;
