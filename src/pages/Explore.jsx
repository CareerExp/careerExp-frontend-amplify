import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import ExploreVideoPlayPopup from "../models/ExploreVideoPlayPopup.jsx";
import {
  selectAuthenticated,
  selectUserId,
  selectToken,
} from "../redux/slices/authSlice";
import { resetState } from "../redux/slices/creatorSlice";
import {
  getAllVideos,
  getTrendingVideos,
  getVideosByUserInterests,
  getRelatedSearchVideos,
  getAllArticles,
  getTrendingArticles,
  getAllPodcasts,
  getTrendingPodcasts,
  selectAllVideos,
  selectTrendingVideos,
  selectUserInterestsVideos,
  selectRelatedSearchVideos,
  selectAllArticles,
  selectTrendingArticles,
  selectAllPodcasts,
  selectTrendingPodcasts,
  resetRelatedSearchVideos,
  getAllTags,
  selectAllTags,
} from "../redux/slices/exploreSlice.js";
import exploreStyles from "../styles/Explore.module.css";
import { categories, tags } from "../utility/category";
import { fonts } from "../utility/fonts.js";
import VideoSection from "../components/VideoSection.jsx";
import ArticleSection from "../components/ArticleSection.jsx";
import PodcastSection from "../components/PodcastSection.jsx";
import CloseIcon from "@mui/icons-material/Close";
import InterestsModal from "../models/InterestsModal";
import {
  getUserProfile,
  selectUserProfile,
} from "../redux/slices/profileSlice.js";

// Helper function to convert to sentence case
const toSentenceCase = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Process tags: convert to sentence case and sort alphabetically
const processedTags = tags
  .map((tag) => ({
    ...tag,
    option: toSentenceCase(tag.option),
  }))
  .sort((a, b) => a.option.localeCompare(b.option));

// Explore page tabs (config-driven for future content)
const EXPLORE_TABS = [
  { id: "videos", label: "Videos" },
  { id: "articles", label: "Articles" },
  { id: "podcasts", label: "Podcasts" },
  { id: "courses", label: "Courses" },
  { id: "announcements", label: "Announcements" },
  { id: "events", label: "Events" },
  { id: "services", label: "Services" },
  { id: "counsellors", label: "Counsellors" },
];

const Explore = () => {
  const dispatchToRedux = useDispatch();
  let allVideosData = useSelector(selectAllVideos);
  const trendingVideosData = useSelector(selectTrendingVideos);
  const userInterestsVideosData = useSelector(selectUserInterestsVideos);
  const relatedSearchVideosData = useSelector(selectRelatedSearchVideos);
  const allArticlesData = useSelector(selectAllArticles);
  const trendingArticlesData = useSelector(selectTrendingArticles);
  const allPodcastsData = useSelector(selectAllPodcasts);
  const trendingPodcastsData = useSelector(selectTrendingPodcasts);
  const userData = useSelector(selectUserProfile);
  const userId = useSelector(selectUserId);
  const allTags = useSelector(selectAllTags);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = useSelector(selectToken);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  // Convert to Sentence Case
  const formattedTags = allTags
    ?.map((tag) => ({
      label: tag.name.charAt(0).toUpperCase() + tag.name.slice(1).toLowerCase(),
      value: tag.name.toLowerCase(),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const isAuthenticated = useSelector(selectAuthenticated);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCatagory, setSelectedCatagory] = useState("");
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);
  const [page1Loading, setPage1Loading] = useState(false);
  const [page2Loading, setPage2Loading] = useState(false);
  const [page3Loading, setPage3Loading] = useState(false);
  const [page4Loading, setPage4Loading] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  // Applied filters (sent to API when user clicks Apply)
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("");
  const [appliedTags, setAppliedTags] = useState([]);
  // Articles pagination & loading
  const [page1Articles, setPage1Articles] = useState(1);
  const [page3Articles, setPage3Articles] = useState(1);
  const [page1ArticlesLoading, setPage1ArticlesLoading] = useState(false);
  const [page3ArticlesLoading, setPage3ArticlesLoading] = useState(false);
  // Podcasts pagination & loading
  const [page1Podcasts, setPage1Podcasts] = useState(1);
  const [page3Podcasts, setPage3Podcasts] = useState(1);
  const [page1PodcastsLoading, setPage1PodcastsLoading] = useState(false);
  const [page3PodcastsLoading, setPage3PodcastsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !userData) {
      dispatchToRedux(getUserProfile({ userId, token }));
    }
    if (userData?.hasLoggedIn === false) {
      setIsModalOpen(true);
    }
  }, [isAuthenticated, userData, userId, token, dispatchToRedux]);

  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       setPageLoading(true);
  //       await dispatchToRedux(getAllVideos({ page: page1 }));
  //       await dispatchToRedux(
  //         getRelatedSearchVideos({
  //           category: selectedCatagory,
  //           tags: selectedTags,
  //           page: page2,
  //         })
  //       );
  //       await dispatchToRedux(getTrendingVideos({ page: page3 }));
  //       if (userId && isAuthenticated) {
  //         await dispatchToRedux(
  //           getVideosByUserInterests({
  //             userId: userId,
  //             page: page4,
  //           })
  //         );
  //       }
  //       setPageLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching videos:", error);
  //       setPageLoading(false);
  //     }
  //   };

  //   fetchVideos();
  // }, [page1, page2, page3, page4, selectedCatagory, selectedTags]);

  useEffect(() => {
    dispatchToRedux(getAllTags());
  }, []);

  useEffect(() => {
    dispatchToRedux(
      getAllVideos({
        page: page1,
        search: appliedSearch,
        tags: appliedTags,
        category: appliedCategory,
      })
    );
  }, [page1, appliedSearch, appliedTags, appliedCategory]);

  // related searches (uses applied filters)
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setPage2Loading(true);
        await dispatchToRedux(
          getRelatedSearchVideos({
            category: appliedCategory,
            tags: appliedTags,
            page: page2,
          })
        );
      } catch (error) {
        console.error("Error fetching related videos:", error);
      } finally {
        setPage2Loading(false);
      }
    };
    fetchRelated();
  }, [page2, appliedCategory, appliedTags, appliedSearch]);

  // trending videos
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setPage3Loading(true);
        await dispatchToRedux(getTrendingVideos({ page: page3 }));
      } catch (error) {
        console.error("Error fetching trending videos:", error);
      } finally {
        setPage3Loading(false);
      }
    };
    fetchTrending();
  }, [page3]);

  // curated for you
  useEffect(() => {
    const fetchUserInterests = async () => {
      if (!userId || !isAuthenticated) return;
      try {
        setPage4Loading(true);
        await dispatchToRedux(
          getVideosByUserInterests({ userId, page: page4 })
        );
      } catch (error) {
        console.error("Error fetching user interest videos:", error);
      } finally {
        setPage4Loading(false);
      }
    };
    fetchUserInterests();
  }, [page4, userId, isAuthenticated]);

  // Articles: search results (same filters as videos)
  useEffect(() => {
    if (activeTab !== "articles") return;
    const fetch = async () => {
      try {
        setPage1ArticlesLoading(true);
        await dispatchToRedux(
          getAllArticles({
            page: page1Articles,
            search: appliedSearch,
            tags: appliedTags,
            category: appliedCategory,
          })
        );
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setPage1ArticlesLoading(false);
      }
    };
    fetch();
  }, [activeTab, page1Articles, appliedSearch, appliedTags, appliedCategory]);

  // Articles: trending
  useEffect(() => {
    if (activeTab !== "articles") return;
    const fetch = async () => {
      try {
        setPage3ArticlesLoading(true);
        await dispatchToRedux(getTrendingArticles({ page: page3Articles }));
      } catch (error) {
        console.error("Error fetching trending articles:", error);
      } finally {
        setPage3ArticlesLoading(false);
      }
    };
    fetch();
  }, [activeTab, page3Articles]);

  // Podcasts: search results
  useEffect(() => {
    if (activeTab !== "podcasts") return;
    const fetch = async () => {
      try {
        setPage1PodcastsLoading(true);
        await dispatchToRedux(
          getAllPodcasts({
            page: page1Podcasts,
            search: appliedSearch,
            tags: appliedTags,
            category: appliedCategory,
          })
        );
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      } finally {
        setPage1PodcastsLoading(false);
      }
    };
    fetch();
  }, [activeTab, page1Podcasts, appliedSearch, appliedTags, appliedCategory]);

  // Podcasts: trending
  useEffect(() => {
    if (activeTab !== "podcasts") return;
    const fetch = async () => {
      try {
        setPage3PodcastsLoading(true);
        await dispatchToRedux(getTrendingPodcasts({ page: page3Podcasts }));
      } catch (error) {
        console.error("Error fetching trending podcasts:", error);
      } finally {
        setPage3PodcastsLoading(false);
      }
    };
    fetch();
  }, [activeTab, page3Podcasts]);

  const handleApply = useCallback(() => {
    setAppliedSearch(searchValue);
    setAppliedCategory(selectedCatagory);
    setAppliedTags([...selectedTags]);
    setPage1(1);
    setPage1Articles(1);
    setPage1Podcasts(1);
  }, [searchValue, selectedCatagory, selectedTags]);

  const handleReset = useCallback(() => {
    setSearchValue("");
    setSelectedCatagory("");
    setSelectedTags([]);
    setAppliedSearch("");
    setAppliedCategory("");
    setAppliedTags([]);
    setPage1(1);
    setPage1Articles(1);
    setPage1Podcasts(1);
    setPage3Articles(1);
    setPage3Podcasts(1);
    dispatchToRedux(resetState());
    dispatchToRedux(resetRelatedSearchVideos());
  }, [dispatchToRedux]);

  const handlePageChange1 = useCallback((event, value) => {
    setPage1(value);
  }, []);

  const handlePageChange2 = useCallback((event, value) => {
    setPage2(value);
  }, []);

  const handlePageChange3 = useCallback((event, value) => {
    setPage3(value);
  }, []);

  const handlePageChange4 = useCallback((event, value) => {
    setPage4(value);
  }, []);

  const handlePageChange1Articles = useCallback((event, value) => {
    setPage1Articles(value);
  }, []);
  const handlePageChange3Articles = useCallback((event, value) => {
    setPage3Articles(value);
  }, []);
  const handlePageChange1Podcasts = useCallback((event, value) => {
    setPage1Podcasts(value);
  }, []);
  const handlePageChange3Podcasts = useCallback((event, value) => {
    setPage3Podcasts(value);
  }, []);

  useEffect(() => {}, [
    allVideosData,
    trendingVideosData,
    userInterestsVideosData,
    dispatchToRedux,
  ]);

  return (
    <Box sx={{ mt: "9.25rem" }}>
      <Box
        sx={{
          marginTop: "2rem",
          marginLeft: "5rem",
          marginRight: "5rem",
          "@media (max-width: 480px)": {
            marginLeft: "1rem",
            marginRight: "1rem",
          },
        }}
      >
        {/* Single white box: tabs inside top, then filters row */}
        
        <Box
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "2px 2px 10px #a7a7a764",
            width: "100%",
            marginBottom: "2rem",
            borderRadius: "19px",
            marginTop: "2rem",
            paddingX: "2rem",
          }}
        >
          {/* Tabs inside box, equally distributed */}
          <div
            className={`${exploreStyles.tabBar} ${exploreStyles.tabBarInside}`}
            role="tablist"
          >
            <div className={exploreStyles.tabList}>
              {EXPLORE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`explore-panel-${tab.id}`}
                  id={`explore-tab-${tab.id}`}
                  className={`${exploreStyles.tab} ${activeTab === tab.id ? exploreStyles.tabActive : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          {/* Filters row: Search | Categories | Tags | Apply | Reset */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              width: "100%",
              padding: "15px 24px 20px",
              borderTop: "1px solid #eeeeee",
            }}
            className={exploreStyles["filters"]}
          >
            {/* Search input - reduced width, magnifying glass on right */}
            <Box
              sx={{
                position: "relative",
                flex: "1 1 280px",
                minWidth: 0,
                maxWidth: { xs: "100%", sm: "400px" },
              }}
            >
              <input
                placeholder="Search by title, topic, or name"
                style={{
                  width: "100%",
                  height: "46px",
                  outline: "none",
                  border: "1px solid #dddddd",
                  borderRadius: "90px",
                  padding: "10px 48px 10px 16px",
                  backgroundColor: "#F6F6F6",
                  fontFamily: fonts.sans,
                  fontSize: "1rem",
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <SearchIcon
                sx={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#720361",
                  fontSize: "1.4rem",
                  pointerEvents: "none",
                }}
              />
            </Box>
                 <Box sx={{ display: "flex", alignItems: "center", gap: "12px",}}>
            {/* Categories dropdown */}
            <FormControl
              sx={{
                minWidth: { xs: "140px", sm: "180px" },
                height: "46px",
                "& .MuiOutlinedInput-root": {
                  height: "100%",
                  borderRadius: "90px",
                  backgroundColor: "#F6F6F6",
                  fontSize: "0.9375rem",
                  fontFamily: fonts.sans,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#dddddd",
                },
              }}
              size="small"
            >
              <InputLabel id="explore-category-label">Categories</InputLabel>
              <Select
                labelId="explore-category-label"
                id="explore-category-select"
                value={selectedCatagory || ""}
                label="Categories"
                onChange={(e) => setSelectedCatagory(e.target.value || "")}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  "& .MuiSelect-icon": {
                    color: "#720361",
                  },
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat} sx={{ fontFamily: fonts.sans }}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Tags */}
            <Autocomplete
              multiple
              options={formattedTags}
              getOptionLabel={(option) => option.label}
              value={formattedTags.filter((tag) =>
                selectedTags.includes(tag.value)
              )}
              onChange={(event, newValue) => {
                setSelectedTags(newValue.map((tag) => tag.value));
              }}
              filterSelectedOptions
              disableCloseOnSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Tags"
                  size="small"
                  sx={{
                    width: { xs: "140px", sm: "169px" },
                    "& .MuiOutlinedInput-root": {
                      height: "46px",
                      borderRadius: "90px",
                      backgroundColor: "#F6F6F6",
                      padding: "0 35px 0 15px",
                      fontFamily: fonts.sans,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dddddd",
                    },
                  }}
                />
              )}
              renderTags={() => null}
            />

            {/* Apply & Reset */}
            <Box sx={{ display: "flex", gap: "10px", flexShrink: 0 }}>
              <Button
                variant="contained"
                onClick={handleApply}
                className={exploreStyles["applyBtn"]}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "90px",
                  padding: "10px 24px",
                  fontFamily: fonts.sans,
                }}
              >
                Apply
              </Button>
              <Button
                onClick={handleReset}
                className={exploreStyles["resetBtn"]}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "90px",
                  padding: "10px 24px",
                  fontFamily: fonts.sans,
                  backgroundColor: "#717171",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#5a5a5a",
                  },
                }}
              >
                Reset
              </Button>
            </Box>
            </Box>
          </Box>

          {/* Show Selected Tags */}
          {selectedTags?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                width: "100%",
                margin: "auto",
                padding: "0 30px 15px 30px",
              }}
            >
              {selectedTags?.length > 0 &&
                selectedTags.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    onDelete={() => {
                      setSelectedTags((prev) => prev.filter((t) => t !== tag));
                    }}
                    deleteIcon={<CloseIcon />}
                    sx={{
                      fontFamily: fonts.sans,
                      backgroundColor: "#f5f5f5",
                      color: "#4F4F4F",
                      border: "1px solid #dddddd",
                      "& .MuiChip-deleteIcon": {
                        color: "#888",
                        fontSize: "18px",
                        "&:hover": {
                          color: "#FF8A00",
                        },
                      },
                    }}
                  />
                ))}
            </Box>
          )}
        </Box>
        

        {/* Row 3: Tab content */}
        <div
          id="explore-panel-videos"
          role="tabpanel"
          aria-labelledby="explore-tab-videos"
          hidden={activeTab !== "videos"}
        >
          {activeTab === "videos" && (
            <>
              <VideoSection
                title={
                  appliedSearch || appliedTags.length > 0 || appliedCategory
                    ? "Search Results"
                    : ""
                }
                videos={allVideosData?.videos || []}
                isLoading={page1Loading}
                currentPage={page1}
                totalPages={allVideosData?.totalPages || 1}
                onPageChange={handlePageChange1}
              />

              {relatedSearchVideosData?.videos?.length > 0 && (
                <VideoSection
                  title="Related Searches"
                  videos={relatedSearchVideosData?.videos || []}
                  isLoading={page2Loading}
                  currentPage={page2}
                  totalPages={relatedSearchVideosData?.totalPages || 1}
                  onPageChange={handlePageChange2}
                />
              )}

              <VideoSection
                title="Trending"
                videos={trendingVideosData?.videos || []}
                isLoading={page3Loading}
                currentPage={page3}
                totalPages={trendingVideosData?.totalPages || 1}
                onPageChange={handlePageChange3}
              />

              {userId &&
                isAuthenticated &&
                userInterestsVideosData?.videos?.length > 0 && (
                  <VideoSection
                    title="Curated For You"
                    videos={userInterestsVideosData?.videos.slice(0, 12) || []}
                    isLoading={page4Loading}
                    currentPage={page4}
                    totalPages={userInterestsVideosData?.totalPages || 1}
                    onPageChange={handlePageChange4}
                  />
                )}
            </>
          )}
        </div>

        {/* Articles tab content */}
        <div
          id="explore-panel-articles"
          role="tabpanel"
          aria-labelledby="explore-tab-articles"
          hidden={activeTab !== "articles"}
        >
          {activeTab === "articles" && (
            <>
              <ArticleSection
                title={
                  appliedSearch || appliedTags.length > 0 || appliedCategory
                    ? "Search Results"
                    : ""
                }
                articles={allArticlesData?.articles || []}
                isLoading={page1ArticlesLoading}
                currentPage={page1Articles}
                totalPages={allArticlesData?.totalPages || 1}
                onPageChange={handlePageChange1Articles}
              />
              <ArticleSection
                title="Trending"
                articles={trendingArticlesData?.articles || []}
                isLoading={page3ArticlesLoading}
                currentPage={page3Articles}
                totalPages={trendingArticlesData?.totalPages || 1}
                onPageChange={handlePageChange3Articles}
              />
            </>
          )}
        </div>

        {/* Podcasts tab content */}
        <div
          id="explore-panel-podcasts"
          role="tabpanel"
          aria-labelledby="explore-tab-podcasts"
          hidden={activeTab !== "podcasts"}
        >
          {activeTab === "podcasts" && (
            <>
              <PodcastSection
                title={
                  appliedSearch || appliedTags.length > 0 || appliedCategory
                    ? "Search Results"
                    : ""
                }
                podcasts={allPodcastsData?.podcasts || []}
                isLoading={page1PodcastsLoading}
                currentPage={page1Podcasts}
                totalPages={allPodcastsData?.totalPages || 1}
                onPageChange={handlePageChange1Podcasts}
              />
              <PodcastSection
                title="Trending"
                podcasts={trendingPodcastsData?.podcasts || []}
                isLoading={page3PodcastsLoading}
                currentPage={page3Podcasts}
                totalPages={trendingPodcastsData?.totalPages || 1}
                onPageChange={handlePageChange3Podcasts}
              />
            </>
          )}
        </div>

        {/* Placeholder for other tabs */}
        {!["videos", "articles", "podcasts"].includes(activeTab) && (
          <div
            role="tabpanel"
            id={`explore-panel-${activeTab}`}
            aria-labelledby={`explore-tab-${activeTab}`}
            className={exploreStyles.placeholderContent}
          >
            <Typography sx={{ fontFamily: fonts.sans }}>
              {EXPLORE_TABS.find((t) => t.id === activeTab)?.label} — Coming soon
            </Typography>
          </div>
        )}
      </Box>

      {/* {userData?.hasLoggedIn === false &&
        userData?.activeDashboard === "user" && (
          <InterestsModal open={isModalOpen} handleClose={handleModalClose} />
          )} */}
          <InterestsModal open={isModalOpen} handleClose={handleModalClose} />
    </Box>
  );
};

export default Explore;
