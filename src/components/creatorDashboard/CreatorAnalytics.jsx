import { Box, Card, CardContent, CssBaseline, Grid, Typography } from "@mui/material";
import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../redux/slices/alertSlice.js";
import { selectAuthenticated, selectToken, selectUserId } from "../../redux/slices/authSlice.js";
import {
  getCounsellorAnalytics,
  getGeneralArticleData,
  getGeneralPodcastData,
  selectCounsellorAnalytics,
  selectGeneralArticleData,
  selectGeneralPodcastData,
} from "../../redux/slices/creatorSlice.js";
import { fonts } from "../../utility/fonts";
import InitialLoaders from "../../loaders/InitialLoaders.jsx";
import { colors } from "../../utility/color.js";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Build 12-month series from aggregate article data for chart display */
function buildArticleMonthlySeries(articleData) {
  if (!articleData) return { names: MONTH_NAMES, likes: [], shares: [] };
  const totalLikes = articleData.totalLikes ?? 0;
  const totalShares = articleData.totalShares ?? 0;
  const len = 12;
  const likes = new Array(len).fill(0);
  const shares = new Array(len).fill(0);
  const lastIdx = len - 1;
  likes[lastIdx] = totalLikes;
  shares[lastIdx] = totalShares;
  return { names: MONTH_NAMES, likes, shares };
}

/** Build monthly series for podcast chart. Uses monthlyData if present, else totalLikes/totalShares like articles. */
function buildPodcastMonthlySeries(podcastData) {
  if (!podcastData) return { names: MONTH_NAMES, likes: [], shares: [] };
  if (Array.isArray(podcastData.monthlyData) && podcastData.monthlyData.length > 0) {
    return {
      names: podcastData.monthlyData.map((item) => item.name ?? item.month),
      likes: podcastData.monthlyData.map((item) => item.likes ?? 0),
      shares: podcastData.monthlyData.map((item) => item.shares ?? 0),
    };
  }
  const totalLikes = podcastData.totalLikes ?? 0;
  const totalShares = podcastData.totalShares ?? 0;
  const len = 12;
  const likes = new Array(len).fill(0);
  const shares = new Array(len).fill(0);
  likes[len - 1] = totalLikes;
  shares[len - 1] = totalShares;
  return { names: MONTH_NAMES, likes, shares };
}

const CreatorAnalytics = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const authenticated = useSelector(selectAuthenticated);
  const token = useSelector(selectToken);
  const counsellorAnalyticsData = useSelector(selectCounsellorAnalytics);
  const generalArticleData = useSelector(selectGeneralArticleData);
  const generalPodcastData = useSelector(selectGeneralPodcastData);
  const userData = counsellorAnalyticsData?.userData;
  const demographicsData = counsellorAnalyticsData?.demographicsData;
  const monthlyData = counsellorAnalyticsData?.monthlyData;
  const [isLoading, setIsLoading] = useState(false);
  const [engagementTab, setEngagementTab] = useState(1); // 1 = Videos, 2 = Articles, 3 = Podcasts

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (authenticated) {
        try {
          setIsLoading(true);
          const response = await dispatchToRedux(getCounsellorAnalytics({ userId, token })).unwrap();
          setIsLoading(false);
          dispatchToRedux(
            notify({
              message: response.success
                ? response.message || "Monthly analytics fetched successfully"
                : response.message || "Failed to fetch monthly analytics",
              type: response.success ? "success" : "error",
            }),
          );
        } catch (error) {
          setIsLoading(false);
          dispatchToRedux(notify({ message: error.message || "Failed to fetch analytics", type: "error" }));
        }
      }
    };

    if (counsellorAnalyticsData === null) {
      fetchAnalytics();
    }
  }, [dispatchToRedux, userId, authenticated, token]);

  useEffect(() => {
    if (authenticated && engagementTab === 2) {
      dispatchToRedux(getGeneralArticleData({ userId, token })).catch(() => {});
    }
  }, [authenticated, engagementTab, userId, token, dispatchToRedux]);

  useEffect(() => {
    if (authenticated && engagementTab === 3) {
      dispatchToRedux(getGeneralPodcastData({ userId, token })).catch(() => {});
    }
  }, [authenticated, engagementTab, userId, token, dispatchToRedux]);

  return (
    <>
      {isLoading ? (
        <InitialLoaders />
      ) : (
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontFamily: fonts.poppins,
              fontWeight: "600",
              paddingTop: "1rem",
              marginLeft: "1.5rem",
              fontSize: { xs: "1.3rem", sm: "1.5rem", md: "1.8rem" },
              marginTop: "1rem",
            }}
          >
            Analytics
          </Typography>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                // marginTop: "60px",
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} >
                  <Card
                    sx={{
                      backgroundColor: "#720361",
                      borderRadius: "1rem",
                      height: "340px",
                    }}
                  >
                    <CardContent>
                      {/* Tabs: Videos | Articles | Podcasts */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0,
                          marginBottom: 1,
                          borderBottom: "1px solid #E0E0E0" 
                        }}
                      >
                        {[
                          { id: 1, label: "Videos" },
                          { id: 2, label: "Articles" },
                          { id: 3, label: "Podcasts" },
                        ].map((tab) => (
                          <Box
                            key={tab.id}
                            onClick={() => setEngagementTab(tab.id)}
                            sx={{
                              px: 2,
                              py: 1,
                              cursor: "pointer",
                              backgroundColor:
                                engagementTab === tab.id
                                  ? "#FFFFFF"
                                  : "#720361",
                              color: engagementTab === tab.id ? "#720361" : "#FFFFFF",
                              fontFamily: fonts.sans,
                              fontWeight: engagementTab === tab.id ? 600 : 500,
                              fontSize: "0.9375rem",
                            }}
                          >
                            {tab.label}
                          </Box>
                        ))}
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ color: "white", fontWeight: "500", fontSize: "20px" }}>
                        {engagementTab === 1 && "Video Engagement"}
                        {engagementTab === 2 && "Article Engagement"}
                        {engagementTab === 3 && "Podcast Engagement"}
                      </Typography>
                      {engagementTab === 1 && (
                        <ReactEcharts
                          option={{
                            xAxis: {
                              type: "category",
                              data: monthlyData?.map((item) => item.name),
                              axisLine: { lineStyle: { color: "#ffffff" } },
                              axisTick: { show: false },
                              axisLabel: { color: "#ffffff" },
                            },
                            yAxis: {
                              type: "value",
                              axisLine: { show: false },
                              axisTick: { show: false },
                              axisLabel: { color: "#ffffff" },
                              splitLine: {
                                show: true,
                                lineStyle: { type: "dashed", color: "#886d6d9f" },
                              },
                            },
                            tooltip: { trigger: "axis" },
                            legend: {
                              data: [
                                { name: "Likes", icon: "circle", itemStyle: { color: "#FF5B8F" } },
                                { name: "Followers", icon: "circle", itemStyle: { color: "#FD8C0C" } },
                              ],
                              top: "5%",
                              right: "10%",
                              textStyle: { color: "#FFFFFF" },
                            },
                            series: [
                              {
                                name: "Likes",
                                type: "line",
                                data: monthlyData?.map((item) => item.likes),
                                smooth: true,
                                lineStyle: { width: 4, color: "#FF5B8F" },
                                areaStyle: {
                                  color: {
                                    type: "linear",
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                      { offset: 0, color: "#EE469F" },
                                      { offset: 1, color: "#ee46a03f" },
                                    ],
                                  },
                                },
                              },
                              {
                                name: "Followers",
                                type: "line",
                                data: monthlyData?.map((item) => item.followers),
                                smooth: true,
                                lineStyle: { width: 4, color: "#FD8C0C" },
                                areaStyle: {
                                  color: {
                                    type: "linear",
                                    x: 0, y: 0, x2: 0, y2: 1,
                                    colorStops: [
                                      { offset: 0, color: "#FD8C0C" },
                                      { offset: 1, color: "#fd8c0c14" },
                                    ],
                                  },
                                },
                              },
                            ],
                          }}
                          style={{ height: "260px" }}
                        />
                      )}
                      {engagementTab === 2 && (() => {
                        const { names, likes, shares } = buildArticleMonthlySeries(generalArticleData);
                        return (
                          <ReactEcharts
                            option={{
                              xAxis: {
                                type: "category",
                                data: names,
                                axisLine: { lineStyle: { color: "#ffffff" } },
                                axisTick: { show: false },
                                axisLabel: { color: "#ffffff" },
                              },
                              yAxis: {
                                type: "value",
                                axisLine: { show: false },
                                axisTick: { show: false },
                                axisLabel: { color: "#ffffff" },
                                splitLine: {
                                  show: true,
                                  lineStyle: { type: "dashed", color: "#886d6d9f" },
                                },
                              },
                              tooltip: { trigger: "axis" },
                              legend: {
                                data: [
                                  { name: "Likes", icon: "circle", itemStyle: { color: "#FD8C0C" } },
                                  { name: "Shares", icon: "circle", itemStyle: { color: "#FF5B8F" } },
                                ],
                                top: "5%",
                                right: "10%",
                                textStyle: { color: "#FFFFFF" },
                              },
                              series: [
                                {
                                  name: "Likes",
                                  type: "line",
                                  data: likes,
                                  smooth: true,
                                  lineStyle: { width: 4, color: "#FD8C0C" },
                                  areaStyle: {
                                    color: {
                                      type: "linear",
                                      x: 0, y: 0, x2: 0, y2: 1,
                                      colorStops: [
                                        { offset: 0, color: "#FD8C0C" },
                                        { offset: 1, color: "#fd8c0c14" },
                                      ],
                                    },
                                  },
                                },
                                {
                                  name: "Shares",
                                  type: "line",
                                  data: shares,
                                  smooth: true,
                                  lineStyle: { width: 4, color: "#FF5B8F" },
                                  areaStyle: {
                                    color: {
                                      type: "linear",
                                      x: 0, y: 0, x2: 0, y2: 1,
                                      colorStops: [
                                        { offset: 0, color: "#EE469F" },
                                        { offset: 1, color: "#ee46a03f" },
                                      ],
                                    },
                                  },
                                },
                              ],
                            }}
                            style={{ height: "260px" }}
                          />
                        );
                      })()}
                      {engagementTab === 3 && (() => {
                        const { names, likes, shares } = buildPodcastMonthlySeries(generalPodcastData);
                        return (
                          <ReactEcharts
                            option={{
                              xAxis: {
                                type: "category",
                                data: names,
                                axisLine: { lineStyle: { color: "#ffffff" } },
                                axisTick: { show: false },
                                axisLabel: { color: "#ffffff" },
                              },
                              yAxis: {
                                type: "value",
                                axisLine: { show: false },
                                axisTick: { show: false },
                                axisLabel: { color: "#ffffff" },
                                splitLine: {
                                  show: true,
                                  lineStyle: { type: "dashed", color: "#886d6d9f" },
                                },
                              },
                              tooltip: { trigger: "axis" },
                              legend: {
                                data: [
                                  { name: "Likes", icon: "circle", itemStyle: { color: "#FD8C0C" } },
                                  { name: "Shares", icon: "circle", itemStyle: { color: "#FF5B8F" } },
                                ],
                                top: "5%",
                                right: "10%",
                                textStyle: { color: "#FFFFFF" },
                              },
                              series: [
                                {
                                  name: "Likes",
                                  type: "line",
                                  data: likes,
                                  smooth: true,
                                  lineStyle: { width: 4, color: "#FD8C0C" },
                                  areaStyle: {
                                    color: {
                                      type: "linear",
                                      x: 0, y: 0, x2: 0, y2: 1,
                                      colorStops: [
                                        { offset: 0, color: "#FD8C0C" },
                                        { offset: 1, color: "#fd8c0c14" },
                                      ],
                                    },
                                  },
                                },
                                {
                                  name: "Shares",
                                  type: "line",
                                  data: shares,
                                  smooth: true,
                                  lineStyle: { width: 4, color: "#FF5B8F" },
                                  areaStyle: {
                                    color: {
                                      type: "linear",
                                      x: 0, y: 0, x2: 0, y2: 1,
                                      colorStops: [
                                        { offset: 0, color: "#EE469F" },
                                        { offset: 1, color: "#ee46a03f" },
                                      ],
                                    },
                                  },
                                },
                              ],
                            }}
                            style={{ height: "260px" }}
                          />
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: "1rem", height: "340px" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                        User Demographics
                      </Typography>
                      <ReactEcharts
                        option={{
                          xAxis: {
                            type: "category",
                            data: userData?.map((item) => item.country),
                            axisLine: { lineStyle: { color: "#ccc" } },
                            axisTick: { show: false },
                            axisLabel: { color: "#666" },
                          },
                          yAxis: {
                            type: "value",
                            axisLine: { show: false },
                            axisTick: { show: false },
                            axisLabel: { color: "#666" },
                            splitLine: {
                              show: true,
                              lineStyle: {
                                type: "dashed",
                                color: "#ccc",
                              },
                            },
                          },
                          tooltip: { trigger: "axis" },
                          series: [
                            {
                              name: "Users",
                              type: "bar",
                              data: userData?.map((item) => item.users),
                              barWidth: "40%",
                              itemStyle: {
                                color: {
                                  type: "linear",
                                  x: 0,
                                  y: 1,
                                  x2: 0,
                                  y2: 0,
                                  colorStops: [
                                    { offset: 0, color: "#BF2F7500" },
                                    { offset: 1, color: "#BF2F75" },
                                  ],
                                },
                                borderRadius: [10, 10, 0, 0],
                              },
                            },
                          ],
                        }}
                        style={{ height: "300px" }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ borderRadius: "1rem", height: "340px" }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "16px",
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                          Audience Demographics
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginRight: "12px",
                            }}
                          >
                            <Box
                              sx={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                border: "2px solid #FF8A00",
                                marginRight: "6px",
                                backgroundColor: "transparent",
                              }}
                            />
                            <Typography variant="body2">Male</Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                              sx={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                border: "2px solid #BC2876",
                                marginRight: "6px",
                                backgroundColor: "transparent",
                              }}
                            />
                            <Typography variant="body2">Female</Typography>
                          </Box>
                        </Box>
                      </Box>

                      <ReactEcharts
                        option={{
                          xAxis: {
                            type: "category",
                            data: demographicsData?.map((item) => item.name),
                          },
                          yAxis: { type: "value" },
                          tooltip: { trigger: "axis" },
                          legend: { show: false },
                          series: [
                            {
                              name: "Male",
                              type: "line",
                              data: demographicsData?.map((item) => item.male),
                              itemStyle: {
                                color: "#FF8A00",
                              },
                              lineStyle: {
                                color: "#FF8A00",
                                width: 3,
                              },
                            },
                            {
                              name: "Female",
                              type: "line",
                              data: demographicsData?.map((item) => item.female),
                              itemStyle: {
                                color: "#BC2876",
                              },
                              lineStyle: {
                                color: "#BC2876",
                                width: 3,
                              },
                            },
                          ],
                        }}
                        style={{ height: "300px" }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default CreatorAnalytics;
