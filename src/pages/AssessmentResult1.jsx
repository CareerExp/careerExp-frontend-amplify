import { Box, IconButton, LinearProgress, Rating, Typography } from "@mui/material";
import ReactECharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { BsDownload } from "react-icons/bs";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { graph1 as Graph, india, insideGraph } from "../assets/assest";
import Footer from "../components/Footer";
import Headers from "../components/Headers";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
import CareerDetailsFromOnet from "../models/CareerDetailsFromOnet.jsx";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import { getInterests, selectEducationLevel, selectInterests } from "../redux/slices/interestSlice.js";
import { getCareerInfo } from "../redux/slices/onetSlice.js";
import { getUserProfile, selectUserProfile } from "../redux/slices/profileSlice.js";
import assessmentResult1 from "../styles/AssessmentResult1.module.css";
import { countryList } from "../utility/countryList.js";
import CircularProgress from "@mui/material/CircularProgress";
import { selectIsFollowing } from "../redux/slices/creatorSlice.js";

const AssessmentResult1 = () => {
  const dispatchToRedux = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const attemptNumber = searchParams.get("attemptNumber");
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const interestsProfile = useSelector(selectInterests);
  const userProfile = useSelector(selectUserProfile);
  const educationLevel = useSelector(selectEducationLevel);
  const [careerRating, setCareerRating] = useState(4);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  //modal
  const [openModal, setOpenModal] = useState(false);
  const [careerData, setCareerData] = useState(null);
  const [isOnetDetailedLoading, setIsOnetDetailedLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const universities = interestsProfile?.interestProfileDetails?.careers?.career[19]?.universities;
  const interestAttemptNumber = interestsProfile?.interestProfileDetails?.attemptNumber;
  const [pollingIntervalId, setPollingIntervalId] = useState(null);

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (attemptNumber) {
          await dispatchToRedux(getInterests({ userId, token, attemptNumber }));
        } else {
          await dispatchToRedux(getInterests({ userId, token }));
        }
        await dispatchToRedux(getUserProfile({ userId, token }));
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [dispatchToRedux, userId, token, attemptNumber]);

  // Polling for universities every 30 seconds
  useEffect(() => {
    if (!universities && !isInitialLoading) {
      const intervalId = setInterval(() => {
        if (attemptNumber) {
          dispatchToRedux(getInterests({ userId, token, attemptNumber }));
        } else {
          dispatchToRedux(getInterests({ userId, token }));
        }
      }, 30000); // 30 seconds
      setPollingIntervalId(intervalId);
      return () => clearInterval(intervalId);
    } else if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      setPollingIntervalId(null);
    }
  }, [universities, isInitialLoading, dispatchToRedux, userId, token, attemptNumber]);

  useEffect(() => {
    if (isInitialLoading) return;

    setIsButtonDisabled(true);
    setModalMessage("We're preparing your report, please hold on a moment.");

    if (universities) {
      setIsButtonDisabled(false);
      setProgress(100);
      setBuffer(100);
      setModalMessage(
        "Your report is compiled and generated! Click the download button to save it to your device.",
      );
      return;
    }

    let progressValue = 0;
    let bufferValue = 10;
    const progressTimer = setInterval(() => {
      progressValue += 0.33; // Adjusted for 5 minutes (300 seconds)
      bufferValue = Math.min(progressValue + 10, 100);
      setProgress(progressValue);
      setBuffer(bufferValue);
    }, 1000);

    const timeout = setTimeout(() => {
      clearInterval(progressTimer);
      setProgress(100);
      setBuffer(100);
      setIsButtonDisabled(false);
      setModalMessage(
        "Your report is compiled and generated! Click the download button to save it to your device.",
      );
    }, 300000); // 5 minutes (300,000 ms)

    return () => {
      clearInterval(progressTimer);
      clearTimeout(timeout);
    };
  }, [universities, isInitialLoading]);

  const colorMap = {
    Realistic: ["#D97196", "#A03B7C"],
    Investigative: ["#E7A337", "#D3452F"],
    Artistic: ["#FF5454", "#AA1A1A"],
    Social: ["#ECB62B", "#F5DE57"],
    Enterprising: ["#4C7F98", "#77C8C3"],
    Conventional: ["#4638A3", "#7C6FCF"],
  };

  // Dynamically update graph and accordion data
  const dynamicGraphAccordionList = interestsProfile?.interestProfileDetails?.results?.result.map(
    (interest) => ({
      title: interest.area,
      percent: ((interest.score / 100) * 100).toFixed(2),
      score: interest.score,
      description: interest.description,
      color: colorMap[interest.area] || ["#000", "#333"],
    }),
  );

  const dynamicOption = {
    toolbox: {
      show: true,
      feature: {
        mark: { show: true },
      },
    },
    series: [
      {
        name: "Nightingale Chart",
        type: "pie",
        radius: innerWidth <= 480 ? [38, 160] : [50, 200],
        center: ["50%", "50%"],
        roseType: "area",
        label: {
          show: false,
          emphasis: {
            show: false,
          },
        },
        data: interestsProfile?.interestProfileDetails?.results?.result.map((interest) => {
          const [startColor, endColor] = colorMap[interest.area] || ["#000", "#333"];
          return {
            value: interest.score,
            name: interest.area,
            itemStyle: {
              color: {
                type: "linear",
                x: 1,
                y: 1,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: startColor },
                  { offset: 1, color: endColor },
                ],
              },
            },
          };
        }),
      },
    ],
    graphic: {
      type: "image",
      style: {
        image: insideGraph,
        width: innerWidth <= 480 ? 80 : 100,
        height: innerWidth <= 480 ? 80 : 100,
      },
      left: "center",
      top: "center",
    },
  };

  const handleOpenModal = async (item) => {
    setCareerData(null);
    setIsOnetDetailedLoading(true);

    try {
      const response = await dispatchToRedux(
        getCareerInfo({ careercode: item.code, topic: "report", token }),
      );

      if (response.error) {
        console.error("Error fetching career info:", response.error);
        return;
      }
      setCareerData(response.payload);
      setIsOnetDetailedLoading(false);
      setOpenModal(true);
    } catch (error) {
      console.error("Error fetching career info:", error);
      setIsOnetDetailedLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCareerData(null);
  };

  const handleDownloadAssessment = (attemptNumber) => {
    window.open(`/generate-assessmnet-pdf?attempt=${attemptNumber}`, "_blank");
  };

  function CircularProgressWithLabel({ value }) {
    return (
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={value} />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            {`${Math.round(value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (isInitialLoading) {
    return (
      // <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <>
        {" "}
        <Headers />
        <InitialLoaders />
        <Footer />
      </>

      // </Box>
    );
  }

  return (
    <div>
      <Headers />
      <div className={assessmentResult1.container}>
        <div className={assessmentResult1.left}>
          <img src={india} alt="user" />
          <p className={assessmentResult1.name}>{userProfile?.firstName + " " + userProfile?.lastName}</p>
          <p style={{ textAlign: "center" }}>{educationLevel}</p>
        </div>
        <div className={assessmentResult1.right}>
          {isButtonDisabled && (
            <div className={assessmentResult1.modalMessageContainer}>
              <div className={assessmentResult1.modalMessage}>
                <p style={{ fontSize: "18px" }}>{modalMessage}</p>
              </div>
            </div>
          )}

          {!isButtonDisabled && (
            <div
              style={{
                margin: "20px 0",
                padding: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#D3F9D8",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "1px 1px 10px rgba(0, 0, 0, 0.25)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "18px" }}>{modalMessage}</p>
              </div>
            </div>
          )}

          <div className={assessmentResult1.aboutResults}>
            <h6>About Your Results</h6>
            <p>
              The first part of the Assessment has examined your Interests, based on a range of work
              activities that you find compelling and enjoyable. The second part has looked at your
              personality traits and the strengths that come easily and are natural to you. Our algorithms
              then look at the way the results of both these parts fit together. The final outcome is a
              recommended shortlist of Career pathways for you to now seriously consider.{" "}
            </p>
            <p>
              Its time to open your mind, be creative and play with the options. Consider where the Market
              Opportunities are and now begin your Career planning.
            </p>
          </div>

          <div className={assessmentResult1.howYouScored}>
            <div>
              <h6>How you scored</h6>
              <p>Full details in your Career Directions Report</p>
              <LinearProgress
                variant="buffer"
                value={progress}
                valueBuffer={buffer}
                style={{ height: 10, padding: "0 20px" }}
                sx={{
                  "& .MuiLinearProgress-bar": { backgroundColor: "orange" },
                  "& .MuiLinearProgress-dashed": { background: "rgba(255, 165, 0, 0.3)" },
                }}
              />
            </div>

            <button
              className={assessmentResult1.navButton}
              onClick={() => handleDownloadAssessment(interestAttemptNumber)}
              disabled={isButtonDisabled}
              style={{
                cursor: isButtonDisabled ? "not-allowed" : "pointer",
                opacity: isButtonDisabled ? 0.5 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {isButtonDisabled ? <CircularProgressWithLabel value={progress} /> : <BsDownload />}
              Download Report
            </button>
          </div>

          <div className={assessmentResult1.graphResult}>
            <div className={assessmentResult1.graph}>
              <ReactECharts
                option={dynamicOption}
                style={{ height: "400px", width: "100%" }}
                className={assessmentResult1.materialGraph}
                opts={{ renderer: "canvas" }}
                onResize={() => {}}
              />
            </div>
            <ul>
              {dynamicGraphAccordionList?.map((item, index) => {
                return (
                  <Accordion
                    key={index}
                    title={item.title}
                    percent={item.percent}
                    score={item.score}
                    description={item.description}
                    color={item.color}
                  />
                );
              })}
            </ul>
          </div>
          <div className={assessmentResult1.bestMatch}>
            <h6>Best Career Matches based on assessement</h6>
            <p>
              The range of Career Pathways below have been selected based on your interests and strengths,
              using a RAISEC methodology. In addition you will see your Personality Factor (PF). This star
              rating shows you how good a match your natural personality is for that career. <br />{" "}
              (IMPORTANT: Please always remember that this is only a guide for you in your Career Exploration
              Journey. As you gain more practical experience and build your skills these selections may
              change)
            </p>

            {isOnetDetailedLoading ? (
              <Box sx={{ textAlign: "center" }}>
                <InitialLoaders />
              </Box>
            ) : (
              <ul className={assessmentResult1.bestMatchCardsList}>
                {interestsProfile?.interestProfileDetails?.careers?.career.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={assessmentResult1.bestMatchCard}
                      onClick={() => handleOpenModal(item)}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <p style={{ fontWeight: "bold", color: "black" }}>{item.title}</p>
                        <p className={assessmentResult1.description}>
                          {item.fit === "Best" ? "Good" : item.fit}
                        </p>
                      </div>
                      <div className={assessmentResult1.userAndRating}>
                        <div className={assessmentResult1.logo}>P</div>
                        <IconButton sx={{ marginTop: "-0.2rem", pointerEvents: "none" }}>
                          <Rating
                            sx={{
                              fontSize: "1rem",
                              pointerEvents: "none",
                              "& .MuiRating-iconHover": { color: "inherit" },
                              "& .MuiRating-iconFocus": { color: "inherit" },
                              "& .MuiRating-iconActive": { color: "inherit" },
                            }}
                            name="read-only"
                            readOnly
                            value={item?.match_score}
                          />
                          <Typography
                            sx={{
                              color: "gray",
                              mx: 0.25,
                              fontSize: "1rem",
                            }}
                          >
                            {item?.match_score}
                          </Typography>
                        </IconButton>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <CareerDetailsFromOnet
        open={openModal}
        onClose={handleCloseModal}
        careerData={careerData}
        isOnetDetailedLoading={isOnetDetailedLoading}
      />
    </div>
  );
};

export default AssessmentResult1;

const Accordion = ({ title, percent, score, description, color, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li className={assessmentResult1["accordion"]} {...props}>
      <div className={assessmentResult1["accordion-header"]}>
        <div>
          <div className={assessmentResult1.circle} style={{ backgroundColor: color[0] }}></div>
          <h6>{title}</h6>
          <p className={assessmentResult1.realisticPercent} style={{ backgroundColor: color[1] }}>
            {percent}
          </p>
        </div>
        <button className={assessmentResult1["accordion-button"]} onClick={toggleAccordion}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {isOpen && (
        <div className="accordion-content">
          <p>
            <b>Score: {score}</b>
          </p>
          <p>{description}</p>
        </div>
      )}
    </li>
  );
};
