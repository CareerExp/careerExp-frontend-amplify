import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pdfIcon } from "../../assets/assest.js";
import { selectAuthenticated, selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { getUserProfile, selectUserProfile } from "../../redux/slices/profileSlice.js";
import { getUnifiedRecordData, selectUnifiedRecord } from "../../redux/slices/unifiedRecordSlice.js";
import { fonts } from "../../utility/fonts.js";

const UserMyAssessment = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const userData = useSelector(selectUserProfile);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const navigate = useNavigate();
  const unifiedRecord = useSelector(selectUnifiedRecord);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (authenticated && !userData) {
        await dispatchToRedux(getUserProfile({ userId, token }));
      }
    };
    fetchUserProfile();
  }, [authenticated, userData, userId, token, dispatchToRedux]); // Add dependencies if necessary

  useEffect(() => {
    const fetchUnifiedRecordData = async () => {
      await dispatchToRedux(getUnifiedRecordData({ userId, token }));
    };
    fetchUnifiedRecordData();
  }, [userId, token, dispatchToRedux]); // Add dependencies if necessary

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleNavigationClicked = (attemptNumber) => {
    if (unifiedRecord?.combinedPayment?.isPaid) {
      navigate(`/assessment-result1?attemptNumber=${attemptNumber}`);
    } else {
      navigate(`/assessment-result`);
    }
  };

  // const allNotTaken =
  //   unifiedRecord?.interestProfile && unifiedRecord.interestProfile.every((item) => !item.isTaken);

  const allNotTaken =
    unifiedRecord &&
    [unifiedRecord.interestProfile, unifiedRecord.discProfile, unifiedRecord.survey].every(
      (section) => !section || section.length === 0 || section.every((item) => !item.isTaken),
    );

  const DesktopView = () => (
    <Box sx={{ padding: 2, width: { xs: "100%", sm: "90%", md: "100%" } }}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table" border="1" sx={{ borderColor: "#dbd6db" }}>
          <TableHead>
            <TableRow sx={{ background: "#720361" }}>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                }}
              >
                Date
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                }}
              >
                Assessment
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                }}
              >
                Report
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: { xs: "0.8rem", sm: "1rem", md: "1rem" },
                }}
              >
                View Result
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {unifiedRecord?.interestProfile?.length > 0 &&
            unifiedRecord.discProfile?.length > 0 &&
            unifiedRecord.survey?.length > 0 ? (
              allNotTaken ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="h6" fontSize={{ xs: "0.9rem", sm: "1.2rem" }}>
                      No Assessment taken
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                unifiedRecord.interestProfile.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(row.timestamp)}</TableCell>
                    <TableCell>Career Direction Report</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <CheckCircleIcon color="success" />
                        {row.isTaken ? "Completed" : "Pending"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        aria-label="download report"
                        onClick={() => row?.cdrLink && window.open(row.cdrLink, "_blank")}
                        disabled={!row?.cdrLink}
                      >
                        {row?.cdrLink ? <img src={pdfIcon} alt="pdf" width="30px" /> : "-"}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="secondary"
                        aria-label="view result"
                        onClick={() => handleNavigationClicked(index + 1)}
                        sx={{ ml: 1, fontSize: "14px", fontWeight: "600" }}
                      >
                        Attempt {index + 1}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const MobileView = () => (
    <Box sx={{ padding: 2, width: "100%" }}>
      {unifiedRecord?.interestProfile?.length > 0 &&
      unifiedRecord.discProfile?.length > 0 &&
      unifiedRecord.survey?.length > 0 ? (
        allNotTaken ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
            <Typography variant="h6" fontSize="0.9rem">
              No Assessment taken
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {unifiedRecord.interestProfile.map((row, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "#fff",
                }}
              >
                <CardContent sx={{ padding: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: "600",
                        fontFamily: fonts.poppins,
                        color: "#333",
                      }}
                    >
                      Career Direction Report
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                      {formatDate(row.timestamp)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",

                      gap: 1,
                      mb: 0.5,
                      mt: 1.5,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        color: "#4CAF50",
                        fontSize: "20px",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: "500",
                        color: "#4CAF50",
                      }}
                    >
                      Completed
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                        gap: 2,
                        width: "100%",
                      }}
                    >
                      <IconButton
                        aria-label="view result"
                        onClick={() => handleNavigationClicked(index + 1)}
                        sx={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#720361",
                        }}
                      >
                        Attempt {index + 1}
                      </IconButton>
                      <IconButton
                        aria-label="download report"
                        onClick={() => row?.cdrLink && window.open(row.cdrLink, "_blank")}
                        disabled={!row?.cdrLink}
                        sx={{
                          padding: 0.5,
                        }}
                      >
                        {row?.cdrLink ? <img src={pdfIcon} alt="pdf" width="24px" height="24px" /> : "-"}
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
          <Typography variant="body1">No data available</Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ ml: 1, mt: 1, textAlign: "left" }}>
        <Typography variant="h5" fontWeight="600" sx={{ fontFamily: fonts.poppins }}>
          My Assessments
        </Typography>
      </Box>
      {isMobile ? <MobileView /> : <DesktopView />}
    </Box>
  );
};

export default UserMyAssessment;
