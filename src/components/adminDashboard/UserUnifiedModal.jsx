import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

import { fonts } from "../../utility/fonts.js";

const UserUnifiedModal = ({ open, onClose, data }) => {
  if (!open) return null;

  const fixedQuestions = [
    "Education",
    "GPA Grade",
    "Next Career Step",
    "Preferred Location",
    "Top 3 Concerns",
    "Nationality",
    "Career Cluster",
  ];

  const surveyAnswers = [
    data?.survey?.educationLevel || "N/A",
    data?.survey?.gradePoints || "N/A",
    data?.survey?.nextCareerStep || "N/A",
    data?.survey?.preferredLocation.join(", ") || "N/A",
    data?.survey?.top3thingsForFuture.join(", ") || "N/A",
    data?.survey?.nationality || "N/A",
    data?.survey?.selectedPathways.join(", ") || "N/A",
  ];

  const commonTypography = {
    fontFamily: fonts.poppins,
    mb: 1,
  };

  const sectionStyles = {
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    p: 3,
    mb: 3,
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
    },
  };

  const sectionHeaderStyles = {
    ...commonTypography,
    color: "#720361",
    fontSize: { xs: "1.2rem", md: "1.5rem" },
    fontWeight: "600",
    borderBottom: "2px solid #F0F0F0",
    pb: 1,
    mb: 2,
  };

  const tableHeaderStyles = {
    backgroundColor: "#f6f6f6",
    "& .MuiTableCell-head": {
      fontWeight: "bold",
      color: "#720361",
    },
  };

  const tableRowStyles = {
    "&:nth-of-type(odd)": {
      backgroundColor: "#f9f9f9",
    },
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        top: { xs: 0, md: "50%" },
        left: { xs: 0, md: "50%" },
        right: { xs: 0 },
        bottom: { xs: 0, md: "auto" },
        transform: { xs: "none", md: "translate(-50%, -50%)" },
        height: { xs: "100vh", md: "90vh" },
        width: { xs: "100%", md: "90%" },
        maxWidth: { xs: "100%", md: "1200px" },
        backgroundColor: "#f9fafb",
        zIndex: 1200,
        overflowY: "auto",
        p: { xs: 2, md: 4 },
        mx: "auto",
        borderRadius: { xs: 0, md: "16px" },
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 15,
          right: 15,
          color: "#720361",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 1)",
            color: "#BF2F75",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography
        variant="h4"
        sx={{
          ...commonTypography,
          fontWeight: "600",
          textAlign: "center",
          color: "#720361",
          fontSize: { xs: "1.5rem", md: "2rem" },
          mb: 3,
          background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Unified Record
      </Typography>

      <Divider sx={{ my: 2, backgroundColor: "rgba(114, 3, 97, 0.2)" }} />

      {/* User Profile Section */}
      <Box sx={sectionStyles}>
        <Grid container spacing={3}>
          {/* Profile Picture and Basic Info */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Avatar
              src={data?.user?.profilePicture}
              alt="Profile Picture"
              sx={{
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 },
                mx: "auto",
                mb: 2,
                border: "4px solid #f0f0f0",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ ...commonTypography, fontSize: { xs: "1.1rem", md: "1.3rem" } }}
            >
              {data?.user?.firstName} {data?.user?.lastName}
            </Typography>
            <Typography sx={{ color: "#717F8C", mb: 1 }}>{data?.user?.email}</Typography>
            <Typography sx={{ color: "#717F8C" }}>{data?.user?.mobile}</Typography>
          </Grid>

          {/* User Details */}
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h5" sx={sectionHeaderStyles}>
                User Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "600", color: "#717F8C", mb: 1 }}>Date of Birth</Typography>
                  <Typography sx={{ mb: 2 }}>
                    {new Date(data?.user?.dateOfBirth).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "600", color: "#717F8C", mb: 1 }}>Country</Typography>
                  <Typography sx={{ mb: 2 }}>{data?.user?.country}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "600", color: "#717F8C", mb: 1 }}>Gender</Typography>
                  <Typography sx={{ mb: 2 }}>{data?.user?.gender}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "600", color: "#717F8C", mb: 1 }}>Status</Typography>
                  <Typography
                    sx={{
                      mb: 2,
                      color:
                        data?.user?.status === "active"
                          ? "green"
                          : data?.user?.status === "banned"
                            ? "red"
                            : data?.user?.status === "pending"
                              ? "orange"
                              : "black",
                      fontWeight: "500",
                    }}
                  >
                    {data?.user?.status}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontWeight: "600", color: "#717F8C", mb: 1 }}>Role</Typography>
                  <Typography sx={{ mb: 2 }}>{data?.user?.role.join(", ")}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ fontWeight: "600", color: "#717F8C", mb: 1 }}>Bio</Typography>
                  <Typography sx={{ mb: 2, fontStyle: data?.user?.introBio ? "normal" : "italic" }}>
                    {data?.user?.introBio || "No bio provided"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3, backgroundColor: "rgba(114, 3, 97, 0.1)" }} />

      {/* Interest Profile Section */}
      {data?.unifiedRecord?.interestProfile?.length > 0 ? (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Interest Profile
          </Typography>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              p: 1,
              bgcolor: data?.unifiedRecord?.combinedPayment?.isPaid
                ? "rgba(76, 175, 80, 0.1)"
                : "rgba(244, 67, 54, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Typography
              sx={{
                fontWeight: "600",
                color: data?.unifiedRecord?.combinedPayment?.isPaid ? "green" : "red",
              }}
            >
              Payment Status: {data?.unifiedRecord?.combinedPayment?.isPaid ? "Paid" : "Not Paid"}
            </Typography>
          </Box>

          {data?.unifiedRecord?.interestProfile?.map((profile) => (
            <Box
              key={profile?.assessmentId?._id}
              sx={{
                mt: 3,
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "rgba(255, 255, 255, 0.6)",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  ...commonTypography,
                  fontWeight: "600",
                  color: "#BF2F75",
                  mb: 2,
                  borderBottom: "1px dashed #e0e0e0",
                  pb: 1,
                }}
              >
                Attempt {profile?.assessmentId?.attemptNumber}
              </Typography>

              {/* Interest Profile Results (Scores) */}
              <Box mt={2}>
                <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C" }}>
                  Interest Profile Results
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
                  <Table>
                    <TableHead sx={tableHeaderStyles}>
                      <TableRow>
                        <TableCell>Area</TableCell>
                        <TableCell align="right">Score</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profile?.assessmentId?.results?.result?.map((item) => (
                        <TableRow key={item.area} sx={tableRowStyles}>
                          <TableCell sx={{ fontWeight: "bold" }}>{item.area}</TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: "600",
                              color:
                                item.score > 75
                                  ? "#4CAF50"
                                  : item.score > 50
                                    ? "#FF8A00"
                                    : item.score > 25
                                      ? "#FF9800"
                                      : "#F44336",
                            }}
                          >
                            {item.score}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Career Options */}
              <Box mt={3}>
                <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C" }}>
                  Career Options
                </Typography>
                <Grid container spacing={2}>
                  {profile?.assessmentId?.careers?.career?.map((career, index) => (
                    <Grid item xs={12} sm={6} md={4} key={`${profile.assessmentId._id}-${career.code}`}>
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "#f9f9f9",
                          borderRadius: "8px",
                          border: "1px solid #e0e0e0",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              minWidth: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              backgroundColor: "#BF2F75",
                              color: "#FFF",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 1,
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {index + 1}
                          </Box>
                          {career.title}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Interest Profile
          </Typography>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <Typography sx={{ display: "flex", alignItems: "center", fontWeight: "600", mb: 1 }}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: data?.interestProfile?.isTaken ? "#4CAF50" : "#F44336",
                  mr: 1,
                }}
              ></Box>
              Status: {data?.interestProfile?.isTaken ? "Complete" : "Incomplete"}
            </Typography>
            <Typography>Details: {data?.interestProfile?.details || "N/A"}</Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3, backgroundColor: "rgba(114, 3, 97, 0.1)" }} />

      {/* DISC Profile Section */}
      {data?.unifiedRecord?.discProfile?.some((profile) => profile?.isTaken) ? (
        <Box sx={sectionStyles}>
          {data?.unifiedRecord?.discProfile?.map((profile) => (
            <Box key={profile._id} mb={3}>
              <Typography variant="h5" sx={sectionHeaderStyles}>
                Disc Profile - Attempt {profile?.assessmentId?.attemptNumber}
              </Typography>
              <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
                <Table>
                  <TableHead sx={tableHeaderStyles}>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="center">D</TableCell>
                      <TableCell align="center">I</TableCell>
                      <TableCell align="center">S</TableCell>
                      <TableCell align="center">C</TableCell>
                      <TableCell align="center">B</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(profile?.assessmentId?.scores || {}).map(([key, values]) => (
                      <TableRow key={`${profile._id}-${key}`} sx={tableRowStyles}>
                        <TableCell sx={{ fontWeight: "bold" }}>{key}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: values?.D > 20 ? "bold" : "normal",
                            color: values?.D > 20 ? "#720361" : "inherit",
                          }}
                        >
                          {values?.D}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: values?.I > 20 ? "bold" : "normal",
                            color: values?.I > 20 ? "#720361" : "inherit",
                          }}
                        >
                          {values?.I}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: values?.S > 20 ? "bold" : "normal",
                            color: values?.S > 20 ? "#720361" : "inherit",
                          }}
                        >
                          {values?.S}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: values?.C > 20 ? "bold" : "normal",
                            color: values?.C > 20 ? "#720361" : "inherit",
                          }}
                        >
                          {values?.C}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            fontWeight: values?.B > 20 ? "bold" : "normal",
                            color: values?.B > 20 ? "#720361" : "inherit",
                          }}
                        >
                          {values?.B}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Disc Profile
          </Typography>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <Typography sx={{ display: "flex", alignItems: "center", fontWeight: "600", mb: 1 }}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#F44336",
                  mr: 1,
                }}
              ></Box>
              Status: Incomplete
            </Typography>
            <Typography>Details: {data?.unifiedRecord?.discProfile?.[0]?.details || "N/A"}</Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3, backgroundColor: "rgba(114, 3, 97, 0.1)" }} />

      {/* Survey Section */}
      {data?.unifiedRecord?.survey?.length > 0 ? (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Survey
          </Typography>
          {data.unifiedRecord.survey.map((survey, attemptIndex) => {
            const surveyAnswers = [
              survey?.surveyId?.educationLevel || "N/A",
              survey?.surveyId?.gradePoints || "N/A",
              survey?.surveyId?.nextCareerStep || "N/A",
              survey?.surveyId?.preferredLocation?.join(", ") || "N/A",
              survey?.surveyId?.top3thingsForFuture?.join(", ") || "N/A",
              survey?.surveyId?.nationality || "N/A",
              survey?.surveyId?.selectedPathways?.join(", ") || "N/A",
            ];

            return (
              <Box
                key={survey?._id}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.6)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    ...commonTypography,
                    fontWeight: "600",
                    color: "#BF2F75",
                    mb: 2,
                    borderBottom: "1px dashed #e0e0e0",
                    pb: 1,
                  }}
                >
                  Attempt {survey?.surveyId?.attemptNumber}
                </Typography>
                <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
                  <Table>
                    <TableHead sx={tableHeaderStyles}>
                      <TableRow>
                        <TableCell>Question</TableCell>
                        <TableCell>Answer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fixedQuestions.map((question, index) => (
                        <TableRow key={index} sx={tableRowStyles}>
                          <TableCell sx={{ fontWeight: "bold" }}>{question}</TableCell>
                          <TableCell>{surveyAnswers[index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Survey
          </Typography>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <Typography sx={{ display: "flex", alignItems: "center", fontWeight: "600", mb: 1 }}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: data?.unifiedRecord?.survey?.length > 0 ? "#4CAF50" : "#F44336",
                  mr: 1,
                }}
              ></Box>
              Status: {data?.unifiedRecord?.survey?.length > 0 ? "Complete" : "Incomplete"}
            </Typography>
            <Typography>Details: {data?.unifiedRecord?.survey?.[0]?.details || "N/A"}</Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 3, backgroundColor: "rgba(114, 3, 97, 0.1)" }} />

      {/* Resume Section */}
      {data?.unifiedRecord?.resume?.isCompleted ? (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Resume
          </Typography>

          {/* Personal Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Personal Information
            </Typography>
            <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
              <Table>
                <TableBody>
                  <TableRow sx={tableRowStyles}>
                    <TableCell sx={{ fontWeight: "bold", width: "30%" }}>Name</TableCell>
                    <TableCell>{`${data?.resume?.personalInfo?.firstName} ${data?.resume?.personalInfo?.lastName}`}</TableCell>
                  </TableRow>
                  <TableRow sx={tableRowStyles}>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell>{data?.resume?.personalInfo?.email}</TableCell>
                  </TableRow>
                  <TableRow sx={tableRowStyles}>
                    <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
                    <TableCell>{data?.resume?.personalInfo?.mobile}</TableCell>
                  </TableRow>
                  <TableRow sx={tableRowStyles}>
                    <TableCell sx={{ fontWeight: "bold" }}>LinkedIn</TableCell>
                    <TableCell>
                      {data?.resume?.personalInfo?.linkedIn ? (
                        <a
                          href={data?.resume?.personalInfo?.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0077B5", textDecoration: "none" }}
                        >
                          {data?.resume?.personalInfo?.linkedIn}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={tableRowStyles}>
                    <TableCell sx={{ fontWeight: "bold" }}>GitHub</TableCell>
                    <TableCell>
                      {data?.resume?.personalInfo?.github ? (
                        <a
                          href={data?.resume?.personalInfo?.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#333", textDecoration: "none" }}
                        >
                          {data?.resume?.personalInfo?.github}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={tableRowStyles}>
                    <TableCell sx={{ fontWeight: "bold" }}>Website</TableCell>
                    <TableCell>
                      {data?.resume?.personalInfo?.website ? (
                        <a
                          href={data?.resume?.personalInfo?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#2E77BC", textDecoration: "none" }}
                        >
                          {data?.resume?.personalInfo?.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* Summary */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 1 }}>
              Summary
            </Typography>
            <Box sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
              <Typography>{data?.resume?.summary || "No summary provided"}</Typography>
            </Box>
          </Box>

          {/* Education */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Education
            </Typography>
            <Grid container spacing={2}>
              {data?.resume?.education.map((edu) => (
                <Grid item xs={12} md={6} key={edu._id}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600", color: "#720361", mb: 1 }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {edu.institution}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#717F8C", display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Box component="span" sx={{ mr: 1, fontSize: "0.75rem" }}>
                        📅
                      </Box>
                      {new Date(edu.startDate).toLocaleDateString()} -{" "}
                      {new Date(edu.endDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#717F8C" }}>
                      <Box component="span" sx={{ fontWeight: "600" }}>
                        Grade:
                      </Box>{" "}
                      {edu.grade}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Experience */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Experience
            </Typography>
            {data?.resume?.experience.map((exp) => (
              <Box
                key={exp._id}
                sx={{
                  mb: 2,
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  borderRadius: "8px",
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: "600", color: "#720361", mb: 1 }}>
                  {exp.jobTitle}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {exp.company}, {exp.location}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#717F8C", display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Box component="span" sx={{ mr: 1, fontSize: "0.75rem" }}>
                    📅
                  </Box>
                  {new Date(exp.startDate).toLocaleDateString()} -{" "}
                  {new Date(exp.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: "600", color: "#717F8C" }}>
                    Responsibilities:
                  </Box>{" "}
                  {exp.responsibilities.join(" ")}
                </Typography>
                <Typography variant="body2">
                  <Box component="span" sx={{ fontWeight: "600", color: "#717F8C" }}>
                    Achievements:
                  </Box>{" "}
                  {exp.achievements}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Skills */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Skills
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    height: "100%",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "#720361", mb: 1 }}>
                    Technical Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {data?.resume?.skills?.technical.map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          bgcolor: "#720361",
                          color: "white",
                          borderRadius: "16px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                    height: "100%",
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "600", color: "#720361", mb: 1 }}>
                    Soft Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {data?.resume?.skills?.soft.map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          bgcolor: "#BF2F75",
                          color: "white",
                          borderRadius: "16px",
                          px: 1.5,
                          py: 0.5,
                          fontSize: "0.8rem",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Projects */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Projects
            </Typography>
            <Grid container spacing={2}>
              {data?.resume?.projects.map((proj) => (
                <Grid item xs={12} md={6} key={proj._id}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600", color: "#720361", mb: 1 }}>
                      {proj.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, flex: 1 }}>
                      {proj.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <Box component="span" sx={{ fontWeight: "600", color: "#717F8C" }}>
                        Technologies:
                      </Box>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                        {proj.technologies.map((tech, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              bgcolor: "#f0f0f0",
                              borderRadius: "4px",
                              px: 0.8,
                              py: 0.3,
                              fontSize: "0.75rem",
                              border: "1px solid #e0e0e0",
                            }}
                          >
                            {tech}
                          </Box>
                        ))}
                      </Box>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <Box component="span" sx={{ fontWeight: "600", color: "#717F8C" }}>
                        Link:
                      </Box>{" "}
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2E77BC", textDecoration: "none" }}
                      >
                        {proj.link}
                      </a>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#717F8C", fontSize: "0.75rem" }}>
                      {new Date(proj.startDate).toLocaleDateString()} -{" "}
                      {new Date(proj.endDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Certifications */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Certifications
            </Typography>
            <Grid container spacing={2}>
              {data?.resume?.certifications.map((cert) => (
                <Grid item xs={12} sm={6} key={cert._id}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      height: "100%",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600", color: "#720361", mb: 0.5 }}>
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      {cert.institution}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#717F8C", mb: 0.5, fontSize: "0.85rem" }}>
                      Issue Date: {new Date(cert.issueDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                      <Box component="span" sx={{ fontWeight: "600", color: "#717F8C" }}>
                        Link:
                      </Box>{" "}
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#2E77BC", textDecoration: "none" }}
                      >
                        {cert.link}
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Languages */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 2 }}>
              Languages
            </Typography>
            <Grid container spacing={2}>
              {data?.resume?.languages.map((lang) => (
                <Grid item xs={6} sm={4} md={3} key={lang._id}>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      textAlign: "center",
                      height: "100%",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "600", color: "#720361" }}>
                      {lang.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#717F8C" }}>
                      {lang.proficiency}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Hobbies */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ ...commonTypography, fontWeight: "600", color: "#717F8C", mb: 1 }}>
              Hobbies
            </Typography>
            <Box
              sx={{
                p: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              {data?.resume?.hobbies.map((hobby, index) => (
                <Box
                  key={index}
                  sx={{
                    bgcolor: "#FF8A00",
                    color: "white",
                    borderRadius: "16px",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}
                >
                  {hobby}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={sectionStyles}>
          <Typography variant="h5" sx={sectionHeaderStyles}>
            Resume
          </Typography>
          <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
            <Typography sx={{ display: "flex", alignItems: "center", fontWeight: "600", mb: 1 }}>
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: data?.resume?.isCompleted ? "#4CAF50" : "#F44336",
                  mr: 1,
                }}
              ></Box>
              Status: {data?.resume?.isCompleted ? "Complete" : "Incomplete"}
            </Typography>
            <Typography>Details: {data?.resume?.details || "N/A"}</Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
            borderRadius: "8px",
            padding: "8px 24px",
            fontWeight: "600",
            "&:hover": {
              background: "linear-gradient(124.89deg, #BF2F75 -3.87%, #720361 63.8%)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          Close
        </Button>
      </Box>
    </Paper>
  );
};

export default UserUnifiedModal;
