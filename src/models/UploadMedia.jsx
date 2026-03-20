import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  uploadThumbnail,
  uploadVideo,
  selectThumbnailLink,
  selectVideoLink,
  resetVideoData,
  clearThumbnailOnly,
} from "../redux/slices/creatorSlice.js";

const UploadMedia = () => {
  const dispatchToRedux = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);
  const videoData = useSelector(selectVideoLink);
  const thumbnailLink = useSelector(selectThumbnailLink);
  const [isVideoButtonLoading, setIsVideoButtonLoading] = useState(false);
  const [isThumbnailButtonLoading, setIsThumbnailButtonLoading] =
    useState(false);

  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (file.size > 50 * 1024 * 1024) {
      dispatchToRedux(
        notify({
          type: "error",
          message: "Video size should not exceed 50 MB",
        }),
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsVideoButtonLoading(true);
      await dispatchToRedux(uploadVideo({ userId, formData, token }));
      setIsVideoButtonLoading(false);
    } catch (error) {
      setIsVideoButtonLoading(false);
      dispatchToRedux(notify({ type: "error", message: error.message }));
    }
  };

  const handleThumbnailChange = async (e) => {
    const input = e.target;
    const file = input.files[0];
    if (!file || !file.type.startsWith("image/")) {
      dispatchToRedux(
        notify({ type: "warning", message: "Please upload an image file" }),
      );
      input.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsThumbnailButtonLoading(true);
      await dispatchToRedux(uploadThumbnail({ userId, formData, token }));
      setIsThumbnailButtonLoading(false);
    } catch (error) {
      setIsThumbnailButtonLoading(false);
      dispatchToRedux(notify({ type: "error", message: error.message }));
    } finally {
      input.value = "";
    }
  };

  const handleReplaceVideo = () => {
    dispatchToRedux(resetVideoData());
  };

  const handleRemoveThumbnail = () => {
    dispatchToRedux(clearThumbnailOnly());
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          marginTop: "1rem",
          justifyContent: "space-between",
        }}
      >
        {isVideoButtonLoading ? (
          <Button component="span" variant="outlined">
            <CircularProgress size={25} color="inherit" />
          </Button>
        ) : videoData ? (
          <Button variant="outlined" onClick={handleReplaceVideo}>
            Replace Video
          </Button>
        ) : (
          <>
            <input
              id="video-input"
              type="file"
              onChange={handleVideoChange}
              accept="video/*"
              style={{ display: "none" }}
            />
            <label htmlFor="video-input">
              <Button component="span" variant="outlined">
                Upload Video
              </Button>
            </label>
          </>
        )}
        {isThumbnailButtonLoading ? (
          <Button component="span" variant="outlined">
            <CircularProgress size={25} color="inherit" />
          </Button>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              alignItems: "center",
            }}
          >
            <input
              id="thumbnail-input"
              type="file"
              onChange={handleThumbnailChange}
              accept="image/*"
              style={{ display: "none" }}
            />
            <label htmlFor="thumbnail-input">
              <Button component="span" variant="outlined">
                {thumbnailLink ? "Change thumbnail" : "Upload Thumbnail"}
              </Button>
            </label>
            {thumbnailLink && (
              <Button
                variant="text"
                color="inherit"
                onClick={handleRemoveThumbnail}
                sx={{ textTransform: "none", color: "text.secondary" }}
              >
                Remove thumbnail
              </Button>
            )}
          </Box>
        )}
      </Box>
      <Box>
        {videoData && !thumbnailLink && (
          <Typography
            variant="body2"
            sx={{
              color: "error.main",
              mb: 1,
              fontWeight: 500,
              textAlign: "right",
            }}
          >
            Please upload a thumbnail before submitting.
          </Typography>
        )}
        {videoData && (
          <Box sx={{ mb: 1 }}>
            <TextField
              disabled
              label="Video Link"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
              value={videoData?.link}
            />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              To use a different file, click &quot;Replace Video&quot; above,
              then upload again.
            </Typography>
          </Box>
        )}
        {thumbnailLink && (
          <TextField
            disabled
            label="Thumbnail Link"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={thumbnailLink}
          />
        )}
      </Box>
    </Box>
  );
};

export default UploadMedia;
