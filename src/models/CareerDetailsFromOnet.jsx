import {
  Box,
  Button,
  Container,
  LinearProgress,
  Modal,
  Typography,
} from "@mui/material";
import React from "react";

import {
  highIndicator,
  lowIndicator,
  mediumIndicator,
} from "../assets/assest.js";
import { fonts } from "../utility/fonts.js";

const CareerDetailsFromOnet = ({
  open,
  onClose,
  careerData,
  isOnetDetailedLoading,
}) => {
  if (!careerData) return null; // Ensure data is available before rendering

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "fixed", // Ensures modal is fixed on the screen
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Centers the modal
          // width: "90%",
          width: { xs: "95%", sm: "90%", md: "80%" },
          maxWidth: "1200px", // Maximum width
          height: { xs: "90vh", sm: "80vh" },
          overflowY: "auto", // Allows scrolling if content overflows
          backgroundColor: "#F9FAFB", // Background color for the modal
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            padding: { xs: "1rem", sm: "2rem" },
            backgroundColor: "white",
            borderRadius: "20px",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              marginBottom: "1.5rem",
              fontFamily: fonts.sans,
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              textTransform: "uppercase",
            }}
          >
            {careerData?.title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              marginBottom: "1rem",
              fontFamily: fonts.sans,
              fontWeight: "bold",
            }}
          >
            What They Do:
          </Typography>
          <Typography
            sx={{
              paddingLeft: "10px",
              fontFamily: fonts.sans,
              fontWeight: "normal",
              fontSize: "16px",
              color: "gray",
            }}
          >
            {careerData?.what_they_do}
          </Typography>

          {careerData?.on_the_job && (
            <>
              <Typography
                variant="h6"
                sx={{
                  marginTop: "2rem",
                  fontFamily: fonts.sans,
                  fontWeight: "bold",
                }}
              >
                On the Job:
              </Typography>
              <Typography
                key={index}
                sx={{
                  paddingLeft: "10px",
                  fontFamily: fonts.sans,
                  fontWeight: "normal",
                  fontSize: "16px",
                  color: "gray",
                }}
              >
                {careerData?.on_the_job}
              </Typography>
            </>
          )}

          <Typography
            variant="h6"
            sx={{
              marginTop: "2rem",
              fontFamily: fonts.sans,
              fontWeight: "bold",
            }}
          >
            Also Called:
          </Typography>
          {careerData?.also_called?.map((title, index) => (
            <Typography
              key={index}
              sx={{
                paddingLeft: "10px",
                fontFamily: fonts.sans,
                fontWeight: "normal",
                fontSize: "16px",
                color: "gray",
              }}
            >
              {title}
            </Typography>
          ))}

          {/* <Typography variant="h6" sx={{ marginTop: "2rem" }}>
            Resources:
          </Typography> */}
          {/* Add resources rendering if needed */}
          <Box
            sx={{
              display: "grid",
              // gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: "20px",
              marginBottom: "2rem",
            }}
          >
            {/* Knowledge Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C",
                    boxShadow: "none",
                  },
                }}
              >
                KNOWLEDGE
              </Button>

              {careerData?.knowledge?.map((el, i) => (
                <Box key={i}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "18px",
                      color: "#720361",
                      marginLeft: "1rem",
                    }}
                  >
                    {el?.domain}
                  </Typography>
                  {el?.keys?.split(",").map((item, ind) => (
                    <Typography
                      key={ind}
                      sx={{
                        paddingLeft: "3rem",
                        textTransform: "capitalize",
                        color: "gray",
                        fontSize: "16px",
                      }}
                    >
                      {item.name}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>

            {/* Skills Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                    boxShadow: "none", // Disables any shadow effect on hover
                  },
                }}
              >
                SKILLS
              </Button>
              {careerData?.skills &&
                Object.entries(careerData?.skills)?.map(([cat, skills], i) => (
                  <Box key={i}>
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "18px",
                        color: "#720361",
                        marginLeft: "1rem",
                      }}
                      style={{ textTransform: "capitalize" }}
                    >
                      {cat.split("_").join(" ")}
                    </Typography>
                    {skills?.split(",").map((item, ind) => (
                      <Typography
                        key={ind}
                        sx={{
                          paddingLeft: "3rem",
                          textTransform: "capitalize",
                          color: "gray",
                          fontSize: "16px",
                        }}
                      >
                        {item.trim()}
                      </Typography>
                    ))}
                  </Box>
                ))}
            </Box>

            {/* Abilities Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                    boxShadow: "none", // Disables any shadow effect on hover
                  },
                }}
              >
                ABILITIES
              </Button>
              {careerData?.abilities &&
                Object.entries(careerData?.abilities)?.map(
                  ([cat, abilities], i) => (
                    <Box key={i}>
                      <Typography
                        sx={{
                          fontFamily: fonts.sans,
                          fontSize: "18px",
                          color: "#720361",
                          marginLeft: "1rem",
                        }}
                        style={{ textTransform: "capitalize" }}
                      >
                        {cat.split("_").join(" ")}
                      </Typography>
                      {abilities?.split(",").map((item, ind) => (
                        <Typography
                          key={ind}
                          sx={{
                            paddingLeft: "3rem",
                            textTransform: "capitalize",
                            color: "gray",
                            fontSize: "16px",
                          }}
                        >
                          {item.name}
                        </Typography>
                      ))}
                    </Box>
                  )
                )}
            </Box>
            {/* Technology Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                    boxShadow: "none", // Disables any shadow effect on hover
                  },
                }}
              >
                TECHNOLOGY
              </Button>
              {careerData?.technology?.map((el, i) => (
                <Box key={i}>
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      fontSize: "18px",
                      color: "#720361",
                      marginLeft: "1rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {el?.domain}
                  </Typography>
                  {el?.tools?.split(",")?.map((item, ind) => (
                    <Typography
                      key={ind}
                      sx={{
                        paddingLeft: "3rem",
                        textTransform: "capitalize",
                        color: "gray",
                        fontSize: "16px",
                      }}
                    >
                      {item.trim()}
                    </Typography>
                  ))}
                </Box>
              ))}
            </Box>

            {/* Personality Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              {/* <Typography
                sx={{ fontFamily: fonts.sans, fontSize: "21px", fontWeight: 600, color: "#FD8C0C" }}
              >
                PERSONALITY
              </Typography> */}
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                    boxShadow: "none", // Disables any shadow effect on hover
                  },
                }}
              >
                PERSONALITY
              </Button>
              {/* <Typography
                sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "gray" }}
              >
                {careerData?.personality?.top_interest}
              </Typography> */}
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "16px",
                  color: "gray",
                  fontWeight: "600",
                }}
              >
                They do well at jobs that need:
              </Typography>
              {careerData?.personality?.work_styles?.map((el, i) => (
                <Typography
                  key={i}
                  sx={{
                    paddingLeft: "3rem",
                    textTransform: "capitalize",
                    color: "#720361",
                  }}
                >
                  {el}
                </Typography>
              ))}
            </Box>

            {/* Education Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                    boxShadow: "none", // Disables any shadow effect on hover
                  },
                }}
              >
                EDUCATION REQUIRED
              </Button>

              <Typography
                sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "gray" }}
              >
                Education Usually Needed:
              </Typography>
              {careerData?.education_required
                ?.split(",")
                ?.map((item, index) => (
                  <Typography
                    key={index}
                    sx={{
                      paddingLeft: "3rem",
                      textTransform: "capitalize",
                      color: "gray",
                    }}
                  >
                    {item}
                  </Typography>
                ))}
            </Box>

            {/* Job Outlook Box */}
            <Box
              sx={{
                minHeight: "100%",
                // width: "25%",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                padding: "1rem",
                borderRadius: "5px",
                marginBottom: "2rem",
              }}
            >
              <Button
                sx={{
                  fontSize: "16px",
                  fontFamily: fonts.sans,
                  background: "#FD8C0C",
                  color: "white",
                  marginBottom: "1rem",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                    boxShadow: "none", // Disables any shadow effect on hover
                  },
                }}
              >
                JOB OUTLOOK
              </Button>
              {/* <Typography
                sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "gray" }}
              >
                {careerData?.job_outlook?.description}
              </Typography> */}

              <img
                src={
                  careerData?.job_outlook?.category === "Below Average"
                    ? lowIndicator
                    : careerData?.job_outlook?.category === "Bright"
                      ? highIndicator
                      : mediumIndicator
                }
                width={"50%"}
                alt="Indicator"
                textAlign="center"
              />

              {/* <Typography sx={{ fontFamily: fonts.sans, fontSize: "16px", color: "gray" }}>
                Category :
              </Typography>
              <Typography sx={{ color: "#720361" }}> {careerData?.job_outlook.outlook.category}</Typography> */}

              <Box sx={{ marginTop: "1rem", width: "100%" }}>
                {/* <Typography
                  sx={{ fontFamily: fonts.sans, fontSize: "21px", fontWeight: 600, color: "#FD8C0C" }}
                >
                  SALARY GUIDE
                </Typography> */}
                <Button
                  sx={{
                    fontSize: "16px",
                    fontFamily: fonts.sans,
                    background: "#FD8C0C",
                    color: "white",
                    marginBottom: "1rem",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#FD8C0C", // Keeps the background the same on hover
                      boxShadow: "none", // Disables any shadow effect on hover
                    },
                  }}
                >
                  ANNUAL EARNINGS
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "1rem",
                  }}
                >
                  {/* Low Salary (10th Percentile) */}
                  <Box sx={{ width: "30%" }}>
                    <Typography sx={{ color: "#720361" }}>Low</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (careerData?.annual_earnings?.low /
                          careerData?.annual_earnings?.high) *
                        100
                      }
                      sx={{
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#ddd",
                        marginTop: "0.5rem",
                      }}
                    />
                    <Typography
                      sx={{ textAlign: "center", marginTop: "0.5rem" }}
                    >
                      ${careerData?.annual_earnings?.low?.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* Medium Salary (Median) */}
                  <Box sx={{ width: "30%" }}>
                    <Typography sx={{ color: "#720361" }}>Median</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (careerData?.annual_earnings?.median /
                          careerData?.annual_earnings?.high) *
                        100
                      }
                      sx={{
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#ddd",
                        marginTop: "0.5rem",
                      }}
                    />
                    <Typography
                      sx={{ textAlign: "center", marginTop: "0.5rem" }}
                    >
                      ${careerData?.annual_earnings?.median?.toLocaleString()}
                    </Typography>
                  </Box>

                  {/* High Salary (90th Percentile) */}
                  <Box sx={{ width: "30%" }}>
                    <Typography sx={{ color: "#720361" }}>High</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (careerData?.annual_earnings?.high /
                          careerData?.annual_earnings?.high) *
                        100
                      }
                      sx={{
                        height: "20px",
                        borderRadius: "10px",
                        backgroundColor: "#ddd",
                        marginTop: "0.5rem",
                      }}
                    />
                    <Typography
                      sx={{ textAlign: "center", marginTop: "0.5rem" }}
                    >
                      ${careerData?.annual_earnings?.high?.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "2rem",
            }}
          >
            <Button
              onClick={onClose}
              sx={{
                background: "linear-gradient(to right, #720361, #bf2f75)",
                color: "white",
                padding: "0.7rem 2rem",
                borderRadius: "20px",
                fontWeight: "bold",
                fontSize: "1rem",
                "&:hover": {
                  background: "linear-gradient(to right, #bf2f75, #720361)",
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Container>
      </Box>
    </Modal>
  );
};

export default CareerDetailsFromOnet;
