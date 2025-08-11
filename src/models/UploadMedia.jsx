import React, { useState } from "react";
import { Button, CircularProgress, Box, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  uploadThumbnail,
  uploadVideo,
  selectThumbnailLink,
  selectVideoLink,
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
        notify({ type: "error", message: "Video size should not exceed 50 MB" })
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
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      dispatchToRedux(
        notify({ type: "warning", message: "Please upload an image file" })
      );
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
    }
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
        ) : (
          !videoData && (
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
          )
        )}
        {isThumbnailButtonLoading ? (
          <Button component="span" variant="outlined">
            <CircularProgress size={25} color="inherit" />
          </Button>
        ) : (
          !thumbnailLink && (
            <>
              <input
                id="thumbnail-input"
                type="file"
                onChange={handleThumbnailChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <label htmlFor="thumbnail-input">
                <Button component="span" variant="outlined">
                  Upload Thumbnail
                </Button>
              </label>
            </>
          )
        )}
      </Box>
      <Box>
        {videoData && (
          <TextField
            disabled
            label="Video Link"
            fullWidth
            sx={{ marginBottom: "1rem" }}
            value={videoData?.link}
          />
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
