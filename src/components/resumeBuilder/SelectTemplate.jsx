import { Box, Button, Grid, Typography } from "@mui/material";
import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { getResume, selectResume } from "../../redux/slices/resumeSlice.js";
import { uploadResume } from "../../redux/slices/resumeSlice.js";
import { buttonStyle } from "../../utility/commonStyle.js";
import { fonts } from "../../utility/fonts.js";
import Footer from "../Footer.jsx";
import Headers from "../Headers.jsx";

const SelectTemplate = () => {
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const resume = useSelector(selectResume);
  const dispatchToRedux = useDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (token && userId) {
      dispatchToRedux(getResume({ token, userId }));
    }
  }, [token, userId, dispatchToRedux]);

  const templates = [
    {
      id: "single",
      name: "Single Column",
      description: "A clean, single-column template ideal for concise resumes.",
      image: "https://static.jobscan.co/blog/uploads/Rectangle@2x-1-1-1.png", // Replace with actual image URL
    },
    {
      id: "double",
      name: "Double Column",
      description: "A detailed, two-column template for comprehensive resumes.",
      image:
        "https://www.resumetemplates.com/wp-content/uploads/2024/06/Teacher-Resume-Templates-and-Examples-1.pdf.jpeg", // Replace with actual image URL
    },
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template.id); // Set the selected template
  };

  const handleDownload = async () => {
    try {
      const element = document.getElementById("resume-content");

      if (!element) {
        dispatchToRedux(notify({ type: "error", message: "Resume content not found!" }));
        return;
      }

      // Ensure `resume` data is populated
      if (
        !resume ||
        !resume.personalInfo ||
        !resume.personalInfo.firstName ||
        !resume.personalInfo.lastName
      ) {
        dispatchToRedux(
          notify({ type: "error", message: "Incomplete resume data. Please check and try again." }),
        );
        return;
      }

      const fileName = `${resume.personalInfo.firstName}_${resume.personalInfo.lastName}_resume.pdf`;

      // Configure PDF options
      const options = {
        margin: [10, 10, 10, 10],
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      dispatchToRedux(notify({ type: "info", message: "Generating PDF..." }));

      try {
        // First generate and download the PDF locally
        await html2pdf().from(element).set(options).save();

        // Then create a separate blob for upload
        const pdfBlob = await html2pdf().from(element).set(options).outputPdf("blob");

        // Create FormData for upload
        const formData = new FormData();

        // Important: Create a proper File object from the Blob for better mobile compatibility
        const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
        formData.append("resume", pdfFile);

        // Log for debugging
        // console.log("FormData entries:");
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value instanceof File ? `File: ${value.name}, ${value.size} bytes` : value);
        }

        // Dispatch Redux Action for Upload
        const response = await dispatchToRedux(uploadResume({ token, formData, userId })).unwrap();

        if (response) {
          dispatchToRedux(notify({ type: "success", message: "Resume uploaded successfully" }));
        } else {
          dispatchToRedux(notify({ type: "error", message: "Failed to upload resume" }));
        }
      } catch (pdfError) {
        console.error("PDF generation or upload error:", pdfError);
        dispatchToRedux(notify({ type: "error", message: "Error generating or uploading PDF" }));
      }
    } catch (error) {
      console.error("Error in handleDownload:", error);
      dispatchToRedux(notify({ type: "error", message: "An error occurred. Please try again." }));
    }
  };

  return (
    <>
      <Box>
        {selectedTemplate === null ? (
          <Box sx={{ height: "80vh" }}>
            <Headers />
            <Box
              padding={4}
              sx={{
                backgroundColor: "white",
                width: "90%",
                margin: "auto",
                marginTop: { xs: "3rem", md: "10rem" },
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontFamily: fonts.poppins,
                  fontWeight: "600",
                  textAlign: "center",
                  p: { xs: 1, md: 5 },
                  fontSize: { xs: "1.5rem", md: "2rem" },
                }}
              >
                Choose Your Resume Template
              </Typography>
              <Grid container spacing={4}>
                {templates.map((template) => (
                  <Grid item xs={12} sm={6} key={template.id}>
                    <Box border={1} borderRadius={2} padding={2} textAlign="center" boxShadow={3}>
                      <img
                        src={template.image}
                        alt={template.name}
                        style={{ width: "100%", height: "auto", marginBottom: "16px" }}
                      />
                      <Typography variant="h6">{template.name}</Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {template.description}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          ...buttonStyle,
                          width: { xs: "90%", md: "50%" },
                          padding: "10px 20px",
                        }}
                        onClick={() => handleSelectTemplate(template)}
                      >
                        Choose {template.name}
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Footer />
          </Box>
        ) : (
          // Display selected template UI after selection
          <Box sx={{ textAlign: "center", backgroundColor: "#D3D3D3" }}>
            <Box sx={{ padding: "1rem", textAlign: "right" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ ...buttonStyle, width: { xs: "100%", md: "20%" } }}
                onClick={handleDownload}
              >
                Download Resume
              </Button>
            </Box>
            {selectedTemplate === "single" && (
              <div
                id="resume-content"
                style={{
                  padding: "20px",
                  maxWidth: "210mm",
                  height: "297mm",
                  margin: "auto",
                  backgroundColor: "white",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "32px",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                >
                  {resume.personalInfo.firstName.toUpperCase()} {resume.personalInfo.lastName.toUpperCase()}
                </p>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#3e3e3e",
                    fontWeight: "bold",
                    paddingBottom: "10px",
                  }}
                >
                  {resume.personalInfo.email} | {resume.personalInfo.mobile} |{" "}
                  {resume.personalInfo.nationality}
                </p>
                <hr />

                <div
                  style={{ marginBottom: "12px", fontSize: "14px", textAlign: "justify", marginTop: "10px" }}
                >
                  <p> {resume?.summary?.replace(/<[^>]+>/g, "")}</p>
                </div>

                <hr />

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>EXPERIENCE</p>
                  <hr />
                  {resume.experience.map((job) => (
                    <div key={job._id} style={{ marginBottom: "10px", textAlign: "left", marginTop: "10px" }}>
                      <p style={{ fontSize: "14px" }}>
                        <strong>{job.jobTitle}</strong> at {job.company}, <i>{job.location}</i> |{" "}
                        {new Date(job.startDate).getFullYear()} - {new Date(job.endDate).getFullYear()}
                      </p>
                      {job.responsibilities && (
                        <p style={{ fontSize: "14px" }}>
                          <p style={{ fontSize: "14px", fontWeight: "bold" }}>Responsibilities:</p>{" "}
                          {job.responsibilities.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <hr />

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>EDUCATION</p>
                  <hr />
                  {resume.education.map((edu) => (
                    <div key={edu._id} style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}>
                      <p style={{ fontSize: "14px" }}>
                        <strong>{edu.degree}</strong> from <i> {edu.institution} </i>| Grade {edu.grade} |
                        {"  " + new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                      </p>
                    </div>
                  ))}
                </div>
                <hr />

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>PROJECTS</p>
                  <hr />
                  {resume.projects.map((project) => (
                    <div
                      key={project._id}
                      style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                    >
                      <p style={{ fontSize: "14px" }}>
                        <strong>{project.title}</strong> - {project.description}
                      </p>
                    </div>
                  ))}
                </div>

                <hr />
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>SKILLS</p>
                  <hr />
                  <div style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}>
                    <p style={{ fontSize: "14px" }}>
                      <strong>Technical Skills:</strong> {resume.skills.technical.join(", ")} |{" "}
                      <strong>Soft Skills:</strong> {resume.skills.soft.join(", ")}
                    </p>
                  </div>
                </div>

                <hr />
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>CERTIFICATIONS</p>
                  <hr />
                  {resume.certifications.map((cert) => (
                    <div
                      key={cert._id}
                      style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                    >
                      <p style={{ fontSize: "14px" }}>
                        <strong>{cert.name}</strong> - {cert.institution} | <strong>Issued:</strong>{" "}
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                <hr />
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>LANGUAGES</p>
                  <hr />
                  {resume.languages.map((lang) => (
                    <div
                      key={lang._id}
                      style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                    >
                      <p style={{ fontSize: "14px" }}>
                        <strong>{lang.name}</strong> - {lang.proficiency}
                      </p>
                    </div>
                  ))}
                </div>
                <hr />

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "bold" }}>HOBBIES</p>
                  <hr />
                  {resume.hobbies.map((hobby) => (
                    <div
                      key={hobby._id}
                      style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                    >
                      <p style={{ fontSize: "14px" }}>
                        <p>{hobby}</p>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTemplate === "double" && (
              <div
                id="resume-content"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  maxWidth: "210mm",
                  height: "297mm",
                  backgroundColor: "white",
                  padding: "20px",
                  margin: "auto",
                }}
              >
                {/* Left Side */}
                <div
                  style={{
                    width: "45%",
                    backgroundColor: "#d8dbe2",
                    padding: "20px",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "32px",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {resume.personalInfo.firstName.toUpperCase()} {resume.personalInfo.lastName.toUpperCase()}
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#3e3e3e",
                      fontWeight: "bold",
                      paddingBottom: "10px",
                    }}
                  >
                    {resume.personalInfo.email} | {resume.personalInfo.mobile} |{" "}
                    {resume.personalInfo.nationality}
                  </p>
                  <hr />
                  {/* Skills */}
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>SKILLS</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px" }}>
                      <strong>Technical Skills:</strong> {resume.skills.technical.join(", ")} |{" "}
                      <strong>Soft Skills:</strong> {resume.skills.soft.join(", ")}
                    </p>
                  </div>
                  <hr />
                  {/* Hobbies */}
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>HOBBIES</p>
                    {resume.hobbies.map((hobby) => (
                      <p key={hobby._id} style={{ fontSize: "14px" }}>
                        {hobby}
                      </p>
                    ))}
                  </div>
                  <hr />
                  {/* Languages */}
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>LANGUAGES</p>
                    {resume.languages.map((lang) => (
                      <p key={lang._id} style={{ fontSize: "14px" }}>
                        <strong>{lang.name}</strong> - {lang.proficiency}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right Side */}

                <div style={{ width: "50%", padding: "20px" }}>
                  <div
                    style={{
                      marginBottom: "12px",
                      fontSize: "14px",
                      textAlign: "justify",
                      marginTop: "10px",
                    }}
                  >
                    <p> {resume.summary.replace(/<[^>]+>/g, "")}</p>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>EXPERIENCE</p>
                    <hr />
                    {resume.experience.map((job) => (
                      <div
                        key={job._id}
                        style={{ marginBottom: "10px", textAlign: "left", marginTop: "10px" }}
                      >
                        <p style={{ fontSize: "14px" }}>
                          <strong>{job.jobTitle}</strong> at {job.company}, <i>{job.location}</i> |{" "}
                          {new Date(job.startDate).getFullYear()} - {new Date(job.endDate).getFullYear()}
                        </p>
                        {job.responsibilities && (
                          <p style={{ fontSize: "14px" }}>
                            <strong>Responsibilities:</strong> {job.responsibilities.join(", ")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>EDUCATION</p>
                    <hr />
                    {resume.education.map((edu) => (
                      <div
                        key={edu._id}
                        style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                      >
                        <p style={{ fontSize: "14px" }}>
                          <strong>{edu.degree}</strong> from <i>{edu.institution}</i> | Grade {edu.grade} |{" "}
                          {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                        </p>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>PROJECTS</p>
                    <hr />
                    {resume.projects.map((project) => (
                      <div
                        key={project._id}
                        style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                      >
                        <p style={{ fontSize: "14px" }}>
                          <strong>{project.title}</strong> - {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <div style={{ marginBottom: "20px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "bold" }}>CERTIFICATIONS</p>
                    <hr />
                    {resume.certifications.map((cert) => (
                      <div
                        key={cert._id}
                        style={{ marginBottom: "10px", marginTop: "10px", textAlign: "left" }}
                      >
                        <p style={{ fontSize: "14px" }}>
                          <strong>{cert.name}</strong> - {cert.institution} | <strong>Issued:</strong>{" "}
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SelectTemplate;
