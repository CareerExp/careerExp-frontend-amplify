import { Box, LinearProgress, Typography } from "@mui/material";
import React from "react";
import { highIndicator, lowIndicator, mediumIndicator } from "../../../assets/assest.js";
import { fonts } from "../../../utility/fonts";
import NewPage from "./NewPage";

const DetailedCareerPathways = ({ key, detailedCareerData, interestProfileData, pageNumber }) => {
  const [primaryColor, secondaryColor] = ["#FF8A00", "#000"]; // Fallback colors

  return (
    <>
      <NewPage pageNumber={pageNumber}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px", // Reduced padding for A4 size
            textAlign: "left",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            height: "100%", // Ensure it fits A4 height
          }}
        >
          {/* Title Section */}
          <div
            style={{
              fontWeight: "bold",
              textAlign: "center",
              textTransform: "uppercase",
              fontSize: "20px", // Slightly smaller for A4
              marginBottom: "10px", // Reduced margin
              color: "#720361",
              fontFamily: fonts.poppins,
            }}
          >
            <span>{detailedCareerData?.career?.title}</span>
          </div>

          {/* What They Do Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor, fontFamily: fonts.poppins }}
            >
              What They Do:
            </span>
            <br />
            <span
              style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.4", // Tighter line height
              }}
            >
              {detailedCareerData.career.what_they_do}
            </span>
          </div>

          {/* Knowledge Section */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>Knowledge:</span>
            {detailedCareerData?.knowledge?.group?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>
                  • {el.title.name}:{" "}
                </span>
                {el.element.map((item, ind) => (
                  <span
                    key={ind}
                    style={{
                      paddingLeft: "0.5rem",
                      textTransform: "capitalize",
                      color: "#555",
                      fontSize: "13px",
                    }}
                  >
                    {item.name},
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>Skills:</span>
            {detailedCareerData?.skills?.group?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>
                  • {el.title.name}:{" "}
                </span>
                {el.element.map((item, ind) => (
                  <span
                    key={ind}
                    style={{
                      paddingLeft: "0.5rem",
                      textTransform: "capitalize",
                      color: "#555",
                      fontSize: "13px",
                    }}
                  >
                    {item.name},
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Abilities Section */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>Abilities:</span>
            {detailedCareerData?.abilities?.group?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>
                  • {el.title.name}:{" "}
                </span>
                {el.element.map((item, ind) => (
                  <span
                    key={ind}
                    style={{
                      paddingLeft: "0.5rem",
                      textTransform: "capitalize",
                      color: "#555",
                      fontSize: "13px",
                    }}
                  >
                    {item.name},
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Technology Section */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>Technology:</span>
            {detailedCareerData?.technology?.category?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>
                  • {el.title.name}:{" "}
                </span>
                {el.example.map((item, ind) => (
                  <span
                    key={ind}
                    style={{
                      paddingLeft: "0.5rem",
                      textTransform: "capitalize",
                      color: "#555",
                      fontSize: "13px",
                    }}
                  >
                    {item.name},
                  </span>
                ))}
              </div>
            ))}
          </div>

          {/* Personality Section */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>Personality:</span>
            <br />
            <span style={{ fontSize: "14px", color: "#555", lineHeight: "1.4" }}>
              {detailedCareerData?.personality?.top_interest?.description}
            </span>
            <br />
            <span style={{ fontSize: "14px", color: secondaryColor }}>They do well at jobs that need:</span>
            {detailedCareerData?.personality?.work_styles?.element?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "2px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>
                  • {el.name}:{" "}
                </span>
              </div>
            ))}
          </div>
        </div>
      </NewPage>

      {/* second page  */}

      <NewPage pageNumber={pageNumber + 1}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px", // Reduced padding for A4 size
            textAlign: "left",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            height: "100%", // Ensure it fits A4 height
          }}
        >
          {/* EDUCATION REQUIRED */}

          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>
              Education Required:
            </span>
            {detailedCareerData?.education?.education_usually_needed?.category?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>• {el}: </span>
              </div>
            ))}
          </div>

          {/* Job Outlook  */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>Job Outlook:</span>
            <br />
            <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
              <span style={{ fontWeight: "bold", fontSize: "14px", color: secondaryColor }}>
                {detailedCareerData?.job_outlook?.outlook?.description}
              </span>
            </div>
            <div style={{ paddingLeft: "10px", marginTop: "5px" }}>
              <img
                src={
                  detailedCareerData?.job_outlook?.outlook?.category === "Below Average"
                    ? lowIndicator
                    : detailedCareerData?.job_outlook?.outlook?.category === "Bright"
                      ? highIndicator
                      : mediumIndicator
                }
                width={"25%"}
                alt="Indicator"
                textAlign="center"
              />
            </div>
          </div>

          {/* Sallery Information  */}

          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "16px", color: primaryColor }}>
              Annual Earnings:
            </span>
            <br />
            <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
              {/* Low Salary (10th Percentile) */}
              <Box sx={{ width: "30%" }}>
                <Typography sx={{ color: "#720361" }}>Low</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (detailedCareerData?.job_outlook?.salary.annual_10th_percentile /
                      detailedCareerData?.job_outlook?.salary.annual_90th_percentile) *
                    100
                  }
                  sx={{
                    height: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#ddd",
                    marginTop: "0.5rem",
                  }}
                />
                <Typography sx={{ textAlign: "center", marginTop: "0.5rem" }}>
                  ${detailedCareerData?.job_outlook.salary?.annual_10th_percentile?.toLocaleString()}
                </Typography>
              </Box>

              {/* Medium Salary (Median) */}
              <Box sx={{ width: "30%" }}>
                <Typography sx={{ color: "#720361" }}>Median</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (detailedCareerData?.job_outlook?.salary?.annual_median /
                      detailedCareerData?.job_outlook?.salary?.annual_90th_percentile) *
                    100
                  }
                  sx={{
                    height: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#ddd",
                    marginTop: "0.5rem",
                  }}
                />
                <Typography sx={{ textAlign: "center", marginTop: "0.5rem" }}>
                  ${detailedCareerData?.job_outlook.salary?.annual_median?.toLocaleString()}
                </Typography>
              </Box>

              {/* High Salary (90th Percentile) */}
              <Box sx={{ width: "30%" }}>
                <Typography sx={{ color: "#720361" }}>High</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (detailedCareerData?.job_outlook?.salary?.annual_90th_percentile /
                      detailedCareerData?.job_outlook?.salary?.annual_90th_percentile) *
                    100
                  }
                  sx={{
                    height: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#ddd",
                    marginTop: "0.5rem",
                  }}
                />
                <Typography sx={{ textAlign: "center", marginTop: "0.5rem" }}>
                  ${detailedCareerData?.job_outlook?.salary?.annual_90th_percentile?.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </div>

          {/* Available Courses  */}
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontWeight: "bold", fontSize: "20px", color: "#FD8C0C" }}>
              Recommended Academic Programs:
            </span>
            <br />

            <div style={{ marginTop: "10px" }}>
              {interestProfileData?.courses?.split("\n").map((course, index) => (
                <div key={index} style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px" }}>
                  {/* <span style={{ fontSize: "16px", color: "#333", marginRight: "8px" }}>•</span> */}
                  <span style={{ fontSize: "16px", color: "#555", lineHeight: "1.5" }}>{course.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ending  */}
        </div>
      </NewPage>

      {/* universities third page  */}
      <NewPage pageNumber={pageNumber + 2}>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "0px 45px", // Reduced padding for A4 size
            textAlign: "left",
            fontFamily: "Arial, sans-serif",
            color: "#333",
            height: "100%", // Ensure it fits A4 height
          }}
        >
          <div>
            <span style={{ fontWeight: "bold", fontSize: "20px", color: "#FD8C0C" }}>
              Colleges and Universities to explore:
            </span>

            <div style={{ marginTop: "20px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#FD8C0C", color: "#fff" }}>
                    <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "18px" }}>Country</th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "18px" }}>
                      University Name
                    </th>
                    <th style={{ padding: "10px", border: "1px solid #ddd", fontSize: "18px" }}>Website</th>
                  </tr>
                </thead>
                <tbody>
                  {interestProfileData?.universities &&
                    Object.entries(interestProfileData.universities).map(
                      ([country, universities], index, array) => (
                        <>
                          {universities?.split("\n").map((university, i) => {
                            const parts = university.split(" - ");
                            return (
                              <tr
                                key={`${index}-${i}`}
                                style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" }}
                              >
                                {i === 0 && (
                                  <td
                                    rowSpan={universities?.split("\n").length}
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                      fontWeight: "bold",
                                      verticalAlign: "top",
                                      backgroundColor: "#f1f1f1",
                                    }}
                                  >
                                    {country}
                                  </td>
                                )}
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                  {parts[0].substring(3)}
                                </td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                  <a
                                    href={parts[1]}
                                    target="_blank"
                                    style={{ color: "#007bff", textDecoration: "none" }}
                                    rel="noreferrer"
                                  >
                                    {parts[1]}
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                          {/* Add a spacer row between different countries */}
                          {index < array.length - 1 && (
                            <tr>
                              <td colSpan="3" style={{ height: "15px", backgroundColor: "#fff" }}></td>
                            </tr>
                          )}
                        </>
                      ),
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </NewPage>
    </>
  );
};

export default DetailedCareerPathways;
