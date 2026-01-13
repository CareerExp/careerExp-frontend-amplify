import { Box, LinearProgress, Typography } from "@mui/material";
import React, { useEffect } from "react";
import {
  highIndicator,
  lowIndicator,
  mediumIndicator,
} from "../../../assets/assest.js";
import { fonts } from "../../../utility/fonts";
import NewPage from "./NewPage";
import { getCountryFlagByName } from "../../../utility/getCountryFlagByName";
import { getCountryEmojiByName } from "../../../utility/getCountryEmojiByName.jsx";

const DetailedCareerPathways = ({
  detailedCareerData,
  interestProfileData,
  pageNumber,
}) => {
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
            <span>{detailedCareerData?.title}</span>
          </div>

          {/* What They Do Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
                fontFamily: fonts.poppins,
              }}
            >
              What They Do:
            </span>
            <br />
            <span
              style={
                {
                  // fontSize: "14px",
                  // color: "secondaryColor",
                  // lineHeight: "1.4", // Tighter line height
                }
              }
            >
              {detailedCareerData.what_they_do}
            </span>
          </div>

          {/* Knowledge Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
              }}
            >
              Knowledge:
            </span>
            {detailedCareerData?.knowledge?.map((kn, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: secondaryColor,
                  }}
                >
                  • {kn?.domain}:{" "}
                </span>
                <span>{kn.keys}</span>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
              }}
            >
              Skills:
            </span>
            {detailedCareerData?.skills &&
              Object.entries(detailedCareerData?.skills)?.map(
                ([cat, skills], i) => (
                  <div
                    key={i}
                    style={{ paddingLeft: "10px", marginTop: "5px" }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        color: secondaryColor,
                      }}
                    >
                      • {cat.split("_").join(" ")}:{" "}
                    </span>
                    <span>{skills}</span>
                  </div>
                )
              )}
          </div>

          {/* Abilities Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
              }}
            >
              Abilities:
            </span>
            {detailedCareerData?.abilities &&
              Object.entries(detailedCareerData?.abilities)?.map(
                ([cat, abilities], i) => (
                  <div
                    key={i}
                    style={{ paddingLeft: "10px", marginTop: "5px" }}
                  >
                    <span
                      style={{
                        fontWeight: "bold",
                        fontSize: "14px",
                        textTransform: "capitalize",
                        color: secondaryColor,
                      }}
                    >
                      • {cat.split("_").join(" ")}:{" "}
                    </span>
                    <span>{abilities}</span>
                  </div>
                )
              )}
          </div>

          {/* Technology Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
              }}
            >
              Technology:
            </span>
            {detailedCareerData?.technology?.map((kn, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: secondaryColor,
                  }}
                >
                  • {kn?.domain}:{" "}
                </span>
                <span>{kn.tools}</span>
              </div>
            ))}
          </div>

          {/* Personality Section */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
              }}
            >
              Personality:
            </span>
            <br />
            <span
            // style={{ fontSize: "14px", color: "#555", lineHeight: "1.4" }}
            >
              {detailedCareerData?.personality?.top_interest}
            </span>
            <br />
            <span>They do well at jobs that need:</span>
            {detailedCareerData?.personality?.work_styles?.map((el, i) => (
              <div key={i} style={{ paddingLeft: "10px", marginTop: "2px" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: secondaryColor,
                  }}
                >
                  • {el}
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
            <span
              style={{
                fontWeight: "bold",
                fontSize: "16px",
                color: primaryColor,
              }}
            >
              Education Required:
            </span>
            {detailedCareerData?.education_required
              ?.split(",")
              ?.map((el, i) => (
                <div key={i} style={{ paddingLeft: "10px", marginTop: "5px" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: secondaryColor,
                    }}
                  >
                    • {el}{" "}
                  </span>
                </div>
              ))}
          </div>

          {/* Job Outlook  */}
          {Object.keys(detailedCareerData?.job_outlook || {}).length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: primaryColor,
                }}
              >
                Job Outlook:
              </span>
              <br />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                  alignItems: "center",
                  marginTop: 12,
                  height: "220px",
                }}
              >
                {Object.keys(detailedCareerData?.job_outlook || {}).map(
                  (key) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "between",
                        height: "100%",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span
                          style={{
                            textTransform: "capitalize",
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: secondaryColor,
                            alignSelf: "center",
                          }}
                        >
                          {key}
                        </span>
                        {/* {getCountryFlagByName(key) && (
                          <img
                            src={getCountryFlagByName(key)}
                            alt={key}
                            style={{
                              width: 40,
                              height: 26,
                              objectFit: "contain",
                            }}
                          />
                        )} */}
                        {/* <PdfSafeFlag country={key} /> */}
                        <span style={{ fontSize: "28px" }}>
                          {getCountryEmojiByName(key)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: "14px",
                          color: secondaryColor,
                          height: "80px",
                        }}
                      >
                        {detailedCareerData?.job_outlook?.[key]?.description}
                      </span>
                      <img
                        src={
                          detailedCareerData?.job_outlook?.[key]?.category ===
                          "Below Average"
                            ? lowIndicator
                            : detailedCareerData?.job_outlook?.[key]
                                  ?.category === "Bright"
                              ? highIndicator
                              : mediumIndicator
                        }
                        width={"100%"}
                        alt="Indicator"
                        style={{ alignSelf: "center", maxWidth: "150px" }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Sallery Information  */}
          {Object.keys(detailedCareerData?.job_outlook || {}).length > 0 && (
            <div style={{ marginBottom: "10px" }}>
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: primaryColor,
                }}
              >
                Annual Earnings:
              </span>
              <br />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                {Object.keys(detailedCareerData?.job_outlook || {}).map(
                  (key) => {
                    const { low, high, median } =
                      detailedCareerData?.job_outlook?.[key]?.annual_earnings ||
                      {};
                    return (
                      <div
                        key={key}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "start",
                          gap: 8,
                          marginTop: "0.5em",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "16px",
                              color: secondaryColor,
                              alignSelf: "center",
                            }}
                          >
                            {key}
                          </span>
                          {/* {getCountryFlagByName(key) && (
                            <img
                              src={getCountryFlagByName(key)}
                              alt={key}
                              style={{
                                width: 40,
                                height: 26,
                                objectFit: "contain",
                              }}
                            />
                          )} */}
                          <span style={{ fontSize: "28px" }}>
                            {getCountryEmojiByName(key)}
                          </span>
                        </div>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {/* Low Salary (10th Percentile) */}
                          <Box>
                            <Typography sx={{ color: "#720361" }}>
                              Low
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(low / high) * 100}
                              sx={{
                                height: "16px",
                                borderRadius: "10px",
                                backgroundColor: "#ddd",
                                marginTop: "0.5rem",
                              }}
                            />
                            <Typography
                              sx={{ textAlign: "center", marginTop: "0.5rem" }}
                            >
                              ${low?.toLocaleString()}
                            </Typography>
                          </Box>

                          {/* Medium Salary (Median) */}
                          <Box>
                            <Typography sx={{ color: "#720361" }}>
                              Median
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(median / high) * 100}
                              sx={{
                                height: "16px",
                                borderRadius: "10px",
                                backgroundColor: "#ddd",
                                marginTop: "0.5rem",
                              }}
                            />
                            <Typography
                              sx={{ textAlign: "center", marginTop: "0.5rem" }}
                            >
                              ${median?.toLocaleString()}
                            </Typography>
                          </Box>

                          {/* High Salary (90th Percentile) */}
                          <Box>
                            <Typography sx={{ color: "#720361" }}>
                              High
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(high / high) * 100}
                              sx={{
                                height: "16px",
                                borderRadius: "10px",
                                backgroundColor: "#ddd",
                                marginTop: "0.5rem",
                              }}
                            />
                            <Typography
                              sx={{ textAlign: "center", marginTop: "0.5rem" }}
                            >
                              ${high?.toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Available Courses  */}
          <div style={{ marginBottom: "10px" }}>
            <span
              style={{ fontWeight: "bold", fontSize: "20px", color: "#FD8C0C" }}
            >
              Recommended Academic Programs:
            </span>
            <br />

            <div style={{ marginTop: "10px" }}>
              {interestProfileData &&
                interestProfileData?.courses.map((course, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "5px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "16px",
                        color: "#555",
                        lineHeight: "1.5",
                        fontWeight: "600",
                      }}
                    >
                      {index + 1}. {course.trim()}
                    </span>
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
            <span
              style={{ fontWeight: "bold", fontSize: "20px", color: "#FD8C0C" }}
            >
              Colleges and Universities to explore:
            </span>

            <div style={{ marginTop: "20px", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#FD8C0C", color: "#fff" }}>
                    <th
                      style={{
                        width: "180px",
                        maxWidth: "180px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        fontSize: "18px",
                      }}
                    >
                      Country
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        fontSize: "18px",
                      }}
                    >
                      University Name
                    </th>
                    <th
                      style={{
                        width: "130px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        fontSize: "18px",
                      }}
                    >
                      Website
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {interestProfileData?.universities &&
                    Object.entries(interestProfileData?.universities).map(
                      ([country, universities], index, array) => (
                        <>
                          {universities
                            ?.split("\n")
                            .filter((university) => university.trim() !== "")
                            .map((university, i) => {
                              const parts = university.split(" - ");
                              return (
                                <tr
                                  key={`${index}-${i}`}
                                  style={{
                                    backgroundColor:
                                      i % 2 === 0 ? "#f9f9f9" : "#fff",
                                  }}
                                >
                                  {i === 0 && (
                                    <td
                                      rowSpan={universities?.split("\n").length}
                                      style={{
                                        width: "180px",
                                        maxWidth: "180px",
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
                                  <td
                                    style={{
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    {parts[0].substring(3)}
                                  </td>
                                  <td
                                    style={{
                                      width: "130px",
                                      padding: "10px",
                                      border: "1px solid #ddd",
                                    }}
                                  >
                                    <a
                                      href={parts[1]}
                                      target="_blank"
                                      style={{
                                        color: "#007bff",
                                        textDecoration: "none",
                                      }}
                                      rel="noreferrer"
                                    >
                                      Visit Website
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          {/* Add a spacer row between different countries */}
                          {index < array.length - 1 && (
                            <tr>
                              <td
                                colSpan="3"
                                style={{
                                  height: "15px",
                                  backgroundColor: "#fff",
                                }}
                              ></td>
                            </tr>
                          )}
                        </>
                      )
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
