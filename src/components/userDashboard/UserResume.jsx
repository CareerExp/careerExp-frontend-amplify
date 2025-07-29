import {
  Box,
  Container,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useTheme,
  useMediaQuery,
  Typography,
  Card,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { pdfIcon, trash } from "../../assets/assest.js";
import { notify } from "../../redux/slices/alertSlice.js";
import {
  selectAuthenticated,
  selectToken,
  selectUserId,
} from "../../redux/slices/authSlice.js";
import {
  deleteResume,
  getResume,
  selectResume,
  updateComment,
  updatePurpose,
} from "../../redux/slices/resumeSlice.js";
import { inputFieldStyle } from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";

const UserResume = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const resumeData = useSelector(selectResume);
  const [purpose, setPurpose] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    dispatchToRedux(getResume({ userId, token }));
  }, [authenticated]);

  useEffect(() => {
    // Initialize purpose state with existing purposes from resumeData
    if (resumeData?.resumeLinks) {
      const initialPurpose = {};
      resumeData.resumeLinks.forEach((link) => {
        initialPurpose[link._id] = link.purposeOfResume || ""; // Use existing purpose or default to an empty string
      });
      setPurpose(initialPurpose);
    }
  }, [resumeData]);

  const handleDownload = (resumeLink) => {
    window.open(resumeLink, "_blank");
  };

  const handleCommentUpdate = async (resumeId, newComment) => {
    try {
      await dispatchToRedux(
        updateComment({
          commentId: resumeId,
          comment: newComment,
          token,
          userId,
        })
      );
      dispatchToRedux(
        notify({ type: "success", message: "Comment updated successfully" })
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, Please try again",
        })
      );
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await dispatchToRedux(deleteResume({ resumeId, userId, token }));
      dispatchToRedux(
        notify({ type: "success", message: "Resume deleted successfully" })
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, Please try again",
        })
      );
    }
  };

  const handlePurposeChange = async (resumeId, newPurpose) => {
    setPurpose((prev) => ({
      ...prev,
      [resumeId]: newPurpose,
    }));

    try {
      await dispatchToRedux(
        updatePurpose({ resumeId, purpose: newPurpose, token, userId })
      );
      dispatchToRedux(
        notify({ type: "success", message: "Purpose updated successfully" })
      );
    } catch (error) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Something went wrong, Please try again",
        })
      );
    }

    // Implement API call or Redux dispatch to save the purpose if needed.
  };

  const DesktopView = () => (
    <>
      {!resumeData?.resumeLinks?.length ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#666" }}>
            No resume found
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table
            aria-label="simple table"
            border="1"
            sx={{ borderColor: "#dbd6db" }}
          >
            <TableHead>
              <TableRow sx={{ background: "#720361" }}>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  No
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  Purpose of Resume
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  Resume
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  Comments
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "600" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resumeData?.resumeLinks?.map((row, index) => (
                <TableRow key={row._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{formatDate(row.timestamp)}</TableCell>
                  {/* <TableCell>Career Direction Report</TableCell> */}
                  <TableCell>
                    <Select
                      value={purpose[row._id] || ""}
                      onChange={(e) =>
                        handlePurposeChange(row._id, e.target.value)
                      }
                      displayEmpty
                      fullWidth
                      sx={{ ...inputFieldStyle, width: "100%" }}
                    >
                      <MenuItem value="" disabled>
                        Select Purpose
                      </MenuItem>
                      <MenuItem value="Job Application">
                        Job Application
                      </MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                      <MenuItem value="Apprenticeship">Apprenticeship</MenuItem>
                      <MenuItem value="College Application">
                        College Application
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="secondary"
                      aria-label="download report"
                      onClick={() => {
                        handleDownload(row.link);
                      }}
                    >
                      <img src={pdfIcon} alt="pdf" width={"30px"} />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      sx={{ ...inputFieldStyle, width: "100%" }}
                      defaultValue={row.userComment}
                      onBlur={(e) =>
                        handleCommentUpdate(row._id, e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="secondary"
                      aria-label="download report"
                      onClick={() => {
                        handleDelete(row._id);
                      }}
                    >
                      <img src={trash} alt="pdf" width={"30px"} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );

  const MobileView = () => (
    <>
      {!resumeData?.resumeLinks?.length ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#666" }}>
            No resume found
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3} sx={{ mb: 10 }}>
          {resumeData?.resumeLinks?.map((row, index) => (
            <Card
              key={row._id}
              sx={{
                mb: 5,
                p: 2,
                boxShadow: "none",
                border: "1px solid #dbd6db",
                borderRadius: "10px",
                width: "100%",
              }}
            >
              {/* Header with number and title */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 600, width: "10%" }}
                  >{`${index + 1}.`}</Typography>
                  {/* Purpose dropdown */}
                  <Box sx={{ width: "80%" }}>
                    <Select
                      value={purpose[row._id] || ""}
                      onChange={(e) =>
                        handlePurposeChange(row._id, e.target.value)
                      }
                      displayEmpty
                      fullWidth
                      size="small"
                      sx={{ ...inputFieldStyle, width: "100%" }}
                    >
                      <MenuItem value="" disabled>
                        Select Purpose
                      </MenuItem>
                      <MenuItem value="Job Application">
                        Job Application
                      </MenuItem>
                      <MenuItem value="Internship">Internship</MenuItem>
                      <MenuItem value="Apprenticeship">Apprenticeship</MenuItem>
                      <MenuItem value="College Application">
                        College Application
                      </MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ width: "10%" }}>
                    <IconButton
                      onClick={() => handleDelete(row._id)}
                      size="small"
                    >
                      <img src={trash} alt="delete" width={"25px"} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Comments */}
              <TextField
                fullWidth
                size="medium"
                sx={{
                  ...inputFieldStyle,
                  width: "100%",
                  mb: 1,
                  mt: 2,
                  borderRadius: "10px",
                }}
                defaultValue={row.userComment}
                onBlur={(e) => handleCommentUpdate(row._id, e.target.value)}
                placeholder="Add comments..."
                multiline
                rows={2}
              />

              {/* Delete button */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Date */}
                <Box>
                  <Typography variant="body2" sx={{ color: "#777", mb: 1.5 }}>
                    {formatDate(row.timestamp)}
                  </Typography>
                </Box>

                <Box>
                  <IconButton
                    onClick={() => handleDownload(row.link)}
                    size="small"
                  >
                    <img src={pdfIcon} alt="pdf" width={"24px"} />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </Stack>
      )}
    </>
  );
  return (
    <Container sx={{ height: "100vh" }}>
      <Box sx={{ ml: 2, mt: 2 }}>
        <Typography
          variant="h5"
          fontWeight="600"
          sx={{ fontFamily: fonts.poppins }}
        >
          My Resume
        </Typography>
      </Box>
      <Box
        sx={{
          padding: 2,
          backgroundColor: "white",
          borderRadius: "10px",
          mt: 2,
          mb: 2,
        }}
      >
        {isMobile ? <MobileView /> : <DesktopView />}
      </Box>
    </Container>
  );
};

export default UserResume;
