import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  selectThumbnailLink,
  selectVideoLink,
  updateVideo,
  uploadYoutubeVideo,
  resetVideoData,
  getYoutubeVideoTags,
} from "../redux/slices/creatorSlice.js";
import UploadMedia from "./UploadMedia";
import creatorStyle from "../styles/CreatorVideo.module.css";
import { categories, languages } from "../utility/category";
import { fonts } from "../utility/fonts";

const UploadVideoModal = ({ open, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const videoData = useSelector(selectVideoLink);
  const thumbnailLink = useSelector(selectThumbnailLink);
  const [tabValue, setTabValue] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLinkTranscriptLoading, setIsLinkTranscriptLoading] = useState(false);
  const [manualVideoLink, setManualVideoLink] = useState("");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTagChange = (event, value) => {
    setSelectedTags(() => value);
  };

  const handleClick = async () => {
    const formData = {
      title,
      description,
      tags: selectedTags,
      language,
      category,
      ...(tabValue === 0 ? { youtubeLink } : { thumbnail: thumbnailLink }),
    };

    if (
      !title ||
      !description ||
      !language ||
      !category ||
      (tabValue === 0 && !youtubeLink)
    ) {
      dispatchToRedux(
        notify({ type: "error", message: "All fields are required" })
      );
      return;
    }

    if (tabValue === 1 && !thumbnailLink) {
      dispatchToRedux(
        notify({ type: "error", message: "Please upload thumbnail first" })
      );
      return;
    }

    try {
      setIsButtonLoading(true);
      if (tabValue === 0) {
        await dispatchToRedux(uploadYoutubeVideo({ userId, formData, token }));
      } else {
        await dispatchToRedux(
          updateVideo({
            userId,
            videoId: videoData?.video?._id,
            formData,
            token,
          })
        );
      }
      setIsButtonLoading(false);
      dispatchToRedux(
        notify({ type: "success", message: "Video uploaded successfully" })
      );
      // Reset data in Redux store
      dispatchToRedux(resetVideoData());
      // Reset all form fields
      setTitle("");
      setDescription("");
      setSelectedTags([]);
      setLanguage("");
      setCategory("");
      setYoutubeLink("");
      setTabValue(0); // Reset to first tab

      // Close the modal
      handleClose();
    } catch (error) {
      setIsButtonLoading(false);
      dispatchToRedux(notify({ type: "error", message: error.message }));
    }
  };

  const handleVideoTags = (videoLink) => {
    setIsLinkTranscriptLoading(true);
    dispatchToRedux(getYoutubeVideoTags({ youtubeUrl: videoLink, token }))
      .unwrap()
      .then((res) => {
        if (res.success && res.keywords?.length > 0) {
          setSelectedTags((prev) => [...prev, ...res.keywords]);
          dispatchToRedux(
            notify({ type: "success", message: "Tags fetched successfully" })
          );
          setIsLinkTranscriptLoading(false);
        }
      })
      .catch((err) => {
        setSelectedTags([]);
        dispatchToRedux(notify({ type: "error", message: err.message }));
        setIsLinkTranscriptLoading(false);
        return;
      });
  };

  useEffect(() => {
    if (tabValue === 0 && youtubeLink) {
      setManualVideoLink("");
      handleVideoTags(youtubeLink);
    } else if (tabValue === 1 && manualVideoLink) {
      setYoutubeLink("");
      handleVideoTags(manualVideoLink);
    }
  }, [tabValue, youtubeLink, manualVideoLink]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="md"
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <Box
        sx={{
          padding: { xs: "0.75rem", sm: "1rem" },
          maxWidth: "800px",
          margin: "auto",
          borderRadius: { xs: "0.75rem", sm: "1.5rem" },
          width: "100%",
        }}
      >
        <button
          onClick={handleClose}
          style={{
            width: "100%",
            backgroundColor: "transparent",
            color: "#b4b2b2",
            fontWeight: "400",
            fontSize: "2rem",
            border: "none",
            textAlign: "end",
            cursor: "pointer",
          }}
        >
          x
        </button>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: fonts.sans,
            padding: { xs: "0 0.5rem 0.5rem", sm: "0rem 1rem 1rem" },
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
          }}
        >
          Upload Your Video Here
        </Typography>

        <Box
          sx={{
            backgroundColor: "#F2F2F2",
            padding: { xs: "0.3rem", sm: ".5rem" },
            borderRadius: ".5rem",
            color: "#6c6c6c",
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.sans,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            }}
          >
            Please adhere to the following rules:
          </Typography>
          <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
            <li
              style={{
                fontFamily: fonts.sans,
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
              }}
            >
              You can either upload a YouTube link or manually upload a video at
              a time.
            </li>
            <li
              style={{
                fontFamily: fonts.sans,
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
              }}
            >
              Do not refresh the page or navigate away while the video is
              uploading.
            </li>
            <li
              style={{
                fontFamily: fonts.sans,
                fontSize: { xs: "0.7rem", sm: "0.8rem" },
              }}
            >
              Thumbnail is mandatory for video uploads.
            </li>
          </ul>
        </Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { backgroundColor: "#BC2876" } }}
          sx={{
            mb: "10px",
            mt: "10px",
            borderBottom: "1px solid #a6a6a6",
            "& .MuiTab-root": {
              fontSize: { xs: "13px", sm: "16px" },
              padding: { xs: "0.5rem 0.25rem", sm: "0.5rem 1rem" },
              minWidth: { xs: "auto", sm: "160px" },
            },
          }}
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab
            label="Upload YouTube Link"
            sx={{
              fontFamily: fonts.sans,
              color: "#5d5d5d",
              textTransform: "capitalize",
              "&.Mui-selected": { color: "#BC2876" },
            }}
          />
          <Tab
            label="Upload Video Manually"
            sx={{
              fontFamily: fonts.sans,
              color: "#5d5d5d",
              textTransform: "capitalize",
              "&.Mui-selected": { color: "#BC2876" },
            }}
          />
        </Tabs>
        <Box>
          {tabValue === 0 ? (
            <>
              <TextField
                placeholder="YouTube Link"
                variant="standard"
                sx={{
                  marginBottom: "1rem",
                  padding: { xs: ".5rem 1rem", sm: ".66rem 1.4rem" },
                  borderRadius: "2rem",
                  backgroundColor: "#F2F2F2",
                  width: "100%",
                }}
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                InputProps={{ disableUnderline: true }}
              />
              {/* {isLinkTranscriptLoading && (
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    color: "#888",
                    mb: "0.75rem",
                    marginLeft: "0.25rem",
                  }}
                >
                  Generating tags... This may take up to 1-3 minutes.
                </Typography>
              )} */}
            </>
          ) : (
            <UploadMedia setManualVideoLink={setManualVideoLink} />
          )}

          <Autocomplete
            multiple
            freeSolo
            id="tags"
            options={[]} // No predefined options
            value={selectedTags}
            onChange={handleTagChange}
            disabled={isLinkTranscriptLoading}
            renderInput={(params) => (
              isLinkTranscriptLoading ?
                <Box
                  sx={{
                    padding: { xs: ".5rem 1rem", sm: ".66rem 1.4rem" },
                    borderRadius: "2rem",
                    backgroundColor: "#F2F2F2",
                    height: { xs: "5.45rem", sm: "8rem" },
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                  className="scrollbar-hide"
                >
                  <Typography variant="body2" sx={{ color: "#b4b4b4", fontSize: "1rem" }}>
                    Generating tags... This may take up to 1–3 minutes.
                  </Typography>
                  <CircularProgress size={24} sx={{ marginRight: 2, color: "#a4a4a4", }} />
                </Box>
                :
                <TextField
                  {...params}
                  placeholder={
                    isLinkTranscriptLoading
                      ? "Generating tags... This may take up to 1–3 minutes."
                      : "Enter Video Tags"
                  }
                  variant="standard"
                  sx={{
                    padding: { xs: ".5rem 1rem", sm: ".66rem 1.4rem" },
                    borderRadius: "2rem",
                    backgroundColor: "#F2F2F2",
                    border: "none",
                    outline: "none",
                    height: { xs: "5.45rem", sm: "8rem" },
                    width: "100%",
                    overflowY: "auto",
                    textTransform: "capitalize",
                    marginBottom: "1rem",
                  }}
                  className="scrollbar-hide"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
            )}
          />

          <TextField
            name="title"
            placeholder="Title"
            variant="standard"
            sx={{
              marginBottom: "1rem",
              padding: { xs: ".5rem 1rem", sm: ".66rem 1.4rem" },
              borderRadius: "2rem",
              backgroundColor: "#F2F2F2",
              border: "none",
              outline: "none",
              height: { xs: "3rem", sm: "3.375rem" },
              width: "100%",
            }}
            InputProps={{
              disableUnderline: true,
            }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            name="description"
            placeholder="Description"
            variant="standard"
            multiline
            rows={isMobile ? 3 : 4}
            sx={{
              // marginBottom: "1rem",
              padding: { xs: ".5rem 1rem", sm: ".66rem 1.4rem" },
              borderRadius: "2rem",
              backgroundColor: "#F2F2F2",
              border: "none",
              outline: "none",
              width: "100%",
            }}
            InputProps={{
              disableUnderline: true,
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel
              id="select_language"
              shrink={false}
              sx={{ display: "none" }}
            >
              Select Language
            </InputLabel>

            <Select
              labelId="select_language"
              variant="standard"
              displayEmpty
              name="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                marginBottom: "1rem",
                padding: { xs: ".5rem 0", sm: ".66rem 0rem" },
                borderRadius: "2rem",
                backgroundColor: "#F2F2F2",
                border: "none",
                outline: "none",
                height: { xs: "3rem", sm: "3.375rem" },
                width: "100%",
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
                "&:hover:before, &:hover:after": {
                  borderBottom: "none",
                },
                "&:focus:before, &:focus:after": {
                  borderBottom: "none",
                },
                "& .MuiSelect-select": {
                  padding: { xs: ".5rem 1.5rem", sm: ".66rem 2.4rem" },
                },
                "& .MuiSelect-icon": {
                  right: "1rem",
                },
              }}
              inputProps={{
                disableUnderline: true,
              }}
            >
              <MenuItem value="" disabled>
                Select Language
              </MenuItem>

              {languages.map((language) => (
                <MenuItem key={language.code} value={language.name}>
                  {language.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <Select
              variant="standard"
              displayEmpty
              name="category"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{
                marginBottom: "1rem",
                padding: { xs: ".5rem 0", sm: ".66rem 0rem" },
                borderRadius: "2rem",
                backgroundColor: "#F2F2F2",
                border: "none",
                outline: "none",
                height: { xs: "3rem", sm: "3.375rem" },
                width: "100%",
                "&:before": {
                  borderBottom: "none",
                },
                "&:after": {
                  borderBottom: "none",
                },
                "&:hover:before, &:hover:after": {
                  borderBottom: "none",
                },
                "& .MuiSelect-select": {
                  padding: { xs: ".5rem 1.5rem", sm: ".66rem 2.4rem" },
                },
                "& .MuiSelect-icon": {
                  right: "1rem",
                },
              }}
              inputProps={{
                "aria-label": "Select Category",
              }}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>

              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: { xs: "0.5rem", sm: "1rem" },
              padding: { xs: "0.5rem 0", sm: "1rem 0" },
              flexDirection: { xs: isMobile ? "column" : "row", sm: "row" },
            }}
          >
            <button
              onClick={handleClose}
              style={{
                width: isMobile ? "100%" : "86px",
                height: "48px",
                backgroundColor: "#787876",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                border: "none",
                borderRadius: "1.5rem",
              }}
            >
              Close
            </button>
            <button
              onClick={handleClick}
              className={creatorStyle["navButton"]}
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                width: isMobile ? "100%" : "auto",
              }}
              disabled={
                (tabValue === 1 && (!videoData || !thumbnailLink)) ||
                isButtonLoading ||
                isLinkTranscriptLoading
              }
            >
              {isButtonLoading ? (
                <CircularProgress size={25} color="inherit" />
              ) : (
                "Submit Video"
              )}
            </button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UploadVideoModal;
