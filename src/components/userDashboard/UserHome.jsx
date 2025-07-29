import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { asstaken, consumed, enrolled, followed, liked, resumecreated, shared } from "../../assets/assest";
import { selectAuthenticated, selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import { getUserAnalytics } from "../../redux/slices/userHistory.js";

const CareerSummary = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const authenticated = useSelector(selectAuthenticated);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (authenticated && userId && token) {
        // Dispatch action to fetch user analytics
        const response = await dispatchToRedux(getUserAnalytics({ userId, token }));

        // Set analytics if the response payload is available
        if (response.payload) {
          setAnalytics(response.payload.analytics);
        }
      }
    };

    fetchAnalytics();
  }, [authenticated, userId, token, dispatchToRedux]);

  let stats = [
    { label: "Videos consumed", value: analytics?.watchedCount || 0, img: consumed },
    { label: "Videos liked", value: analytics?.likesCount || 0, img: liked },
    { label: "Videos shared", value: analytics?.sharesCount || 0, img: shared },
    { label: "Career counsellors followed", value: analytics?.followCount || 0, img: followed },
    { label: "Assessments taken", value: analytics?.totalAssessments || 0, img: asstaken },
    { label: "Remaining Attempt Count", value: analytics?.remainingAttempts || 0, img: asstaken },
    { label: "Resumes created", value: analytics?.resumeCount || 0, img: resumecreated },
    { label: "Short Courses enrolled for", value: 0, img: enrolled },
  ];

  return (
    <Box sx={{ textAlign: "center", p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: "bold",
          color: "#fff",
          backgroundImage: "linear-gradient(to right, white, #800080, #800080, white)",
          p: 2,
        }}
      >
        Here’s a quick summary of your activity on Career Explorer.
      </Typography>

      <Box sx={{ backgroundColor: "white", borderRadius: "22px", p: 1, m: 1 }}>
        <Typography variant="h6" sx={{ p: 0 }}>
          Content consumed: Location & Language
        </Typography>
      </Box>
      <Box
        container
        spacing={2}
        sx={{
          justifyContent: "flex-start",
          mb: 4,
          display: "flex",
          background: "white",
          borderRadius: "22px",
          boxShadow: "0px 5px 10px #e5e5e5",
          padding: ".5rem",
          gap: "1rem",
          px: "2rem",
        }}
      >
        {analytics?.watchedFlags?.map((language, index) => (
          <Box key={index}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#800080",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "100px",
                    marginTop: 1,
                    fontFamily: '"Segoe UI Emoji", "NotoColorEmoji", sans-serif',
                  }}
                >
                  {language.flag}
                </Typography>
              </Box>
              <Typography variant="subtitle1">{language.language}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                backgroundColor: "#fff",
                p: 2,
                borderRadius: "8px",
                boxShadow: 1,
                display: "flex",
                gap: "2rem",
              }}
            >
              <img src={stat.img} alt={stat.value} />
              <Box sx={{ textAlign: "start" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle1">{stat.label}</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CareerSummary;
