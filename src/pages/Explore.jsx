import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Chip,
  Container,
  MenuItem,
  Pagination,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
// import ExploreVideoPlayPopup from "../models/ExploreVideoPlayPopup.jsx";
import { selectAuthenticated, selectUserId } from "../redux/slices/authSlice";
import { resetState } from "../redux/slices/creatorSlice";
import {
  getAllVideos,
  getTrendingVideos,
  getVideosByUserInterests,
  getRelatedSearchVideos,
  selectAllVideos,
  selectTrendingVideos,
  selectUserInterestsVideos,
  selectRelatedSearchVideos,
  resetRelatedSearchVideos,
  getAllTags,
  selectAllTags,
} from "../redux/slices/exploreSlice.js";
import exploreStyles from "../styles/Explore.module.css";
import { categories, tags } from "../utility/category";
import { fonts } from "../utility/fonts.js";
import VideoSection from "../components/VideoSection.jsx";
import { borderBottom } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";

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

const Explore = () => {
  const dispatchToRedux = useDispatch();
  let allVideosData = useSelector(selectAllVideos);
  const trendingVideosData = useSelector(selectTrendingVideos);
  const userInterestsVideosData = useSelector(selectUserInterestsVideos);
  const relatedSearchVideosData = useSelector(selectRelatedSearchVideos);
  const userId = useSelector(selectUserId);
  const allTags = useSelector(selectAllTags);
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
    // const fetchAllVideos = async () => {
    //   try {
    //     setPage1Loading(true);
    //     await dispatchToRedux(getAllVideos({ page: page1 }));
    //   } catch (error) {
    //     console.error("Error fetching all videos:", error);
    //   } finally {
    //     setPage1Loading(false);
    //   }
    // };
    // fetchAllVideos();

    dispatchToRedux(
      getAllVideos({
        page: page1,
        search: searchValue,
        tags: selectedTags,
        category: selectedCatagory,
      })
    );
  }, [page1, searchValue, selectedTags, selectedCatagory]);

  // related searches
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setPage2Loading(true);
        await dispatchToRedux(
          getRelatedSearchVideos({
            category: selectedCatagory,
            tags: selectedTags,
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
  }, [page2, selectedCatagory, selectedTags, searchValue]);

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

  const handleCategorySelection = useCallback(
    (category) => {
      dispatchToRedux(getAllVideos({ category }));
    },
    [dispatchToRedux]
  );

  const handleSearchClick = useCallback(() => {
    if (selectedTags?.length > 0) {
      dispatchToRedux(getAllVideos({ tags: selectedTags }));
    }
    if (searchValue) {
      dispatchToRedux(getAllVideos({ search: searchValue }));
    }
  }, [selectedTags?.length, searchValue, dispatchToRedux]);

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

  useEffect(() => {}, [
    allVideosData,
    trendingVideosData,
    userInterestsVideosData,
    dispatchToRedux,
  ]);

  const handleReset = () => {
    setSelectedTags([]);
    setSelectedCatagory("");
    setSearchValue("");
    setPage1(1);
    setPage2(1);
    setPage3(1);
    setPage4(1);
    dispatchToRedux(resetState());
    dispatchToRedux(getAllVideos({ page: page1 }));
    dispatchToRedux(resetRelatedSearchVideos());
    dispatchToRedux(getTrendingVideos({ page: page3 }));
    if (userId && isAuthenticated) {
      dispatchToRedux(
        getVideosByUserInterests({
          userId: userId,
          page: page4,
        })
      );
    }
  };

  return (
    <Box sx={{ mt: "8.5rem" }}>
      <Container maxWidth="xl" sx={{ marginTop: "2rem" }}>
        <Box
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "2px 2px 10px #a7a7a764",
            width: "80rem",
            maxWidth: "100%",
            margin: "auto",
            marginBottom: "2rem",
            borderRadius: "19px",
          }}
        >
          <Box
            sx={{
              borderBottom: "1px solid #dddddd",
            }}
          >
            {/* Categories Filter */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                maxWidth: "100%",
                padding: "15px 0px",
                overflowX: "auto",
                overflowY: "hidden",
                margin: {
                  xs: "0px 15px",
                  sm: "0px 30px",
                },
              }}
              className="scrollbar-hide"
            >
              {" "}
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "15px" }}
              >
                Categories:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  padding: "5px 10px",
                }}
              >
                {categories.map((category, index) => (
                  <Button
                    key={`${category}-index-${index}`}
                    onClick={() => {
                      handleCategorySelection(category);
                      setSelectedCatagory(category);
                    }}
                    variant="contained"
                    sx={{
                      minWidth: "fit-content",
                      borderRadius: "90px",
                      padding: "6px 10px",
                      fontFamily: fonts.sans,
                      margin: "0 5px",
                      textTransform: "none",
                      backgroundColor:
                        selectedCatagory === category ? "#FF8A00" : "#ff880033",
                      color:
                        selectedCatagory === category ? "white" : "#FF8A00",
                      fontWeight: "bold",
                      fontSize: "14px",
                      whiteSpace: "nowrap",
                      // width: "90px",
                      "&:hover": {
                        backgroundColor: "#FF8A00",
                        color: "white",
                      },
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: "auto",
              padding: "4px 0",
            }}
            className={exploreStyles["filters"]}
          >
            {/* Search Input */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                margin: "auto",
                position: "relative",
                padding: {
                  xs: "14px 12px",
                  sm: "15px 30px",
                },
              }}
            >
              <input
                placeholder="Search here"
                variant="outlined"
                style={{
                  marginRight: "10px",
                  flexGrow: 1,
                  width: "23.6875rem",
                  height: "3rem",
                  outline: "none",
                  border: "1px solid #dddddd",
                  borderRadius: "90px",
                  padding: "12px 64px 12px 15px",
                  backgroundColor: "#F6F6F6",
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={handleSearchClick}
                className={exploreStyles["applyBtn"]}
                sx={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                  right: "10px",
                  textTransform: "capitalize",
                  borderRadius: "90px",
                  padding: "12px 24px",
                  // borderRadius: "50%",
                }}
              >
                Search
              </Button>
            </Box>

            {/* Tags Filter  */}
            <div className={exploreStyles["select-and-buttons"]}>
              {/* Multiple tag selection filter */}
              {/* <TextField
                select
                multiple
                variant="outlined"
                value={selectedTags}
                onChange={(e) => {
                  setSelectedTags(e.target.value);
                }}
                className={exploreStyles["select"]}
                displayEmpty
                sx={{
                  marginRight: "10px",
                  width: "169px",
                  maxWidth: "100%",
                  height: "48px",
                  backgroundColor: "#F6F6F6",
                  color: "#545454",
                  borderRadius: "90px",
                  border: "1px solid #dddddd",
                  overflow: "hidden", // prevent overflow
                  "& .MuiOutlinedInput-root": {
                    height: "100%",
                    borderRadius: "90px",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "15px",
                    paddingRight: "35px", // space for icon
                    overflow: "hidden", // prevent overflow
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  "& .MuiSelect-icon": {
                    color: "#720361",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: "10px", // ensure it stays inside
                  },
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start", // left-align text
                    height: "100%",
                    padding: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  },
                }}
                SelectProps={{
                  multiple: true,
                  IconComponent: KeyboardArrowDownIcon,
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (selected.length === 0) {
                      return (
                        <span
                          style={{
                            color: "#545454",
                            fontFamily: fonts.sans,
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          Filter by Tags
                        </span>
                      );
                    }
                    return selected.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        sx={{
                          fontFamily: fonts.sans,
                          color: "#4F4F4F",
                          border: "1px solid #dddddd",
                          margin: "0 2px",
                        }}
                      />
                    ));
                  },
                }}
              >
                <MenuItem disabled value="">
                  <em>Filter by Tags</em>
                </MenuItem>
                {processedTags.map((tag) => (
                  <MenuItem key={tag.option} value={tag.option}>
                    {tag.option}
                  </MenuItem>
                ))}
              </TextField> */}
              <Autocomplete
                multiple
                options={formattedTags}
                getOptionLabel={(option) => option.label}
                value={formattedTags.filter((tag) =>
                  selectedTags.includes(tag.value)
                )}
                onChange={(event, newValue) => {
                  const selectedLowercaseTags = newValue.map(
                    (tag) => tag.value
                  );
                  setSelectedTags(selectedLowercaseTags);
                }}
                filterSelectedOptions
                disableCloseOnSelect
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Filter by Tags"
                    sx={{
                      marginRight: "10px",
                      width: "169px",
                      maxWidth: "100%",
                      height: "46px",
                      backgroundColor: "#F6F6F6",
                      borderRadius: "90px",
                      border: "1px solid #dddddd",
                      "& .MuiOutlinedInput-root": {
                        height: "100%",
                        borderRadius: "90px",
                        padding: "0 35px 0 15px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />
                )}
                renderTags={() => null}
              />

              {/* Apply and Reset Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: "10px",
                }}
                className={exploreStyles["buttons"]}
              >
                <Button
                  onClick={handleReset}
                  className={exploreStyles["resetBtn"]}
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: "transparent",
                    border: "1px solid #dddddd",
                    padding: "0rem 1rem",
                    borderRadius: "90px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "fit-content",
                    fontSize: "1.125rem",
                    gap: ".875rem",
                    color: "#717171",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#dddddd",
                    },
                  }}
                >
                  Reset
                </Button>
              </Box>
            </div>
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

        <VideoSection
          title={
            searchValue || selectedTags.length > 0 || selectedCatagory
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
          title="Most Trending Videos"
          videos={trendingVideosData?.videos || []}
          isLoading={page3Loading}
          currentPage={page3}
          totalPages={trendingVideosData?.totalPages || 1}
          onPageChange={handlePageChange3}
        />

        {userId && isAuthenticated && userInterestsVideosData?.videos?.length > 0 && (
          <VideoSection
            title="Curated For You"
            videos={userInterestsVideosData?.videos.slice(0, 12) || []}
            isLoading={page4Loading}
            currentPage={page4}
            totalPages={userInterestsVideosData?.totalPages || 1}
            onPageChange={handlePageChange4}
          />
        )}
      </Container>
    </Box>
  );
};

export default Explore;
