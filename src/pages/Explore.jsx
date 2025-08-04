import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";
import InitialLoaders from "../loaders/InitialLoaders.jsx";
// import ExploreVideoPlayPopup from "../models/ExploreVideoPlayPopup.jsx";
import { selectAuthenticated } from "../redux/slices/authSlice";
import { resetState } from "../redux/slices/creatorSlice";
import { getAllVideos, selectAllVideos } from "../redux/slices/exploreSlice.js";
import exploreStyles from "../styles/Explore.module.css";
import { categories, tags } from "../utility/category";
import { fonts } from "../utility/fonts.js";

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
  const isAuthenticated = useSelector(selectAuthenticated);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCatagory, setSelectedCatagory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setPageLoading(true);
        await dispatchToRedux(getAllVideos({ page }));
        setPageLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setPageLoading(false);
      }
    };

    fetchVideos();
  }, [page]);

  const handleCategorySelection = useCallback(
    (category) => {
      dispatchToRedux(getAllVideos({ category }));
    },
    [dispatchToRedux]
  );

  const handleSearchClick = useCallback(() => {
    if (tag) {
      dispatchToRedux(getAllVideos({ tags: [tag] }));
    }
    if (searchValue) {
      dispatchToRedux(getAllVideos({ search: searchValue }));
    }
  }, [searchValue, tag, dispatchToRedux]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  useEffect(() => {}, [allVideosData, dispatchToRedux]);

  const handleReset = () => {
    dispatchToRedux(resetState());
    dispatchToRedux(getAllVideos({ page }));
    setSearchValue("");
    setTag("");
    setSelectedCatagory("");
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
            borderRadius: "19px",
          }}
        >
          <Box
            sx={{
              // width: "100%",
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
              overflowY: "hidden",
              maxWidth: "100%",
              padding: "10px 0",
              margin: "0px 30.79px",
            }}
          >
            {" "}
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", fontSize: "15px" }}
            >
              Suggested:
            </Typography>
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
                  margin: "0 10px",
                  textTransform: "none",
                  backgroundColor:
                    selectedCatagory === category ? "#FF8A00" : "#ff880033",
                  color: selectedCatagory === category ? "white" : "#FF8A00",
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

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: "auto",
            }}
            className={exploreStyles["filters"]}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                margin: "auto",
                padding: "15px 30px",
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
                  padding: "12px 15px",
                }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Box>

            {/* tags  */}

            <div className={exploreStyles["select-and-buttons"]}>
              <TextField
                select
                variant="outlined"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
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
                  IconComponent: KeyboardArrowDownIcon,
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return (
                        <span
                          style={{
                            color: "#545454",
                            fontFamily: fonts.sans,
                            fontSize: "14px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          Filter by Tags
                        </span>
                      );
                    }
                    return selected;
                  },
                }}
                // renderValue={(value) => (value === "" ? "Filter by Tags" : value)}
              >
                <MenuItem disabled value="">
                  <em>Filter by Tags</em>
                </MenuItem>

                {processedTags.map((tag) => (
                  <MenuItem key={tag.option} value={tag.option}>
                    {tag.option}
                  </MenuItem>
                ))}
              </TextField>
              <Box
                sx={{ display: "flex", gap: "10px" }}
                className={exploreStyles["buttons"]}
              >
                <button
                  onClick={handleSearchClick}
                  className={exploreStyles["applyBtn"]}
                >
                  Apply
                </button>
                <button
                  onClick={handleReset}
                  className={exploreStyles["resetBtn"]}
                >
                  Reset
                </button>
              </Box>
            </div>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: "30px",
            margin: "auto",
            marginTop: "30px",
            width: "1280px",
            maxWidth: "100%",
          }}
        >
          {pageLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "85vw",
              }}
            >
              <InitialLoaders />
            </Box>
          ) : allVideosData?.videos?.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
                width: "90vw",
                margin: "auto",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                No Videos Found
              </Typography>
            </Box>
          ) : (
            allVideosData?.videos?.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
                isAuthenticated={isAuthenticated}
              />
            ))
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5rem",
            padding: "1rem",
          }}
        >
          <Pagination
            count={allVideosData?.totalPages}
            size="large"
            onChange={handlePageChange}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Explore;
