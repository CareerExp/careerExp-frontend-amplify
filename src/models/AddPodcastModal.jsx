import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import EditIcon from "@mui/icons-material/Edit";
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  addPodcastManual,
  addPodcastSpotify,
  getPodcastDetail,
  updatePodcast,
  uploadPodcast,
  uploadPodcastThumbnail,
} from "../redux/slices/creatorSlice.js";
import {
  articleCategories,
  languages,
  tags as tagsOptions,
} from "../utility/category.js";
import { colors } from "../utility/color.js";
import { fonts } from "../utility/fonts.js";

const tagOptions = tagsOptions?.map((t) => t.option) || [];

const AddPodcastModal = ({ open, onClose, onSuccess, podcastId = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const isEdit = Boolean(podcastId);
  const [tabValue, setTabValue] = useState(0);

  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");

  const [thumbnailLink, setThumbnailLink] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const [audioLink, setAudioLink] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const resetForm = () => {
    setTabValue(0);
    setSpotifyUrl("");
    setTitle("");
    setDescription("");
    setSelectedTags([]);
    setLanguage("");
    setCategory("");
    setThumbnailLink("");
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setAudioLink("");
    setAudioFile(null);
  };

  useEffect(() => {
    if (!open) return;
    if (isEdit && podcastId) {
      setIsLoadingDetail(true);
      dispatch(getPodcastDetail({ podcastId }))
        .unwrap()
        .then((res) => {
          const p = res?.podcastDetails || res?.podcast;
          if (p) {
            setTitle(p.title || "");
            setDescription(p.description || "");
            setSelectedTags(Array.isArray(p.tags) ? p.tags : []);
            setLanguage(p.language || "");
            setCategory(p.category || "");
            setThumbnailLink(p.thumbnail || "");
            setThumbnailPreview(p.thumbnail || null);
            setSpotifyUrl(p.spotifyUrl || "");
            setAudioLink(p.audioLink || "");
            setTabValue(p.spotifyLink ? 0 : 1);
          }
        })
        .catch(() =>
          dispatch(
            notify({ type: "error", message: "Failed to load podcast" }),
          ),
        )
        .finally(() => setIsLoadingDetail(false));
    } else {
      resetForm();
    }
  }, [open, isEdit, podcastId, dispatch]);

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      dispatch(
        notify({ type: "error", message: "Please select an image file" }),
      );
      return;
    }
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleAudioChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const accept = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/aac",
    ];
    if (!accept.includes(file.type) && !file.name.match(/\.(mp3|wav|aac)$/i)) {
      dispatch(
        notify({
          type: "error",
          message: "Please select MP3, WAV or AAC file",
        }),
      );
      return;
    }
    setAudioFile(file);
    setAudioLink("");
  };

  const uploadThumbnailIfNeeded = async () => {
    if (!thumbnailFile) return thumbnailLink;
    const formData = new FormData();
    formData.append("file", thumbnailFile);
    const result = await dispatch(
      uploadPodcastThumbnail({ userId, formData, token }),
    ).unwrap();
    return result?.link || "";
  };

  const handleSubmit = async () => {
    if (!title?.trim()) {
      dispatch(notify({ type: "error", message: "Podcast title is required" }));
      return;
    }
    if (!category) {
      dispatch(notify({ type: "error", message: "Please select a category" }));
      return;
    }

    if (isEdit) {
      if (tabValue === 1 && !thumbnailLink && !thumbnailFile) {
        dispatch(
          notify({
            type: "error",
            message:
              "Thumbnail is required. Please upload a podcast thumbnail.",
          }),
        );
        return;
      }
      setIsSubmitting(true);
      try {
        const thumbUrl =
          tabValue === 1 ? await uploadThumbnailIfNeeded() : undefined;
        const body = {
          title: title.trim(),
          description: description.trim() || undefined,
          thumbnail: thumbUrl || undefined,
          tags: selectedTags.filter(Boolean),
          language: language || undefined,
          category,
        };
        if (tabValue === 0) body.spotifyUrl = spotifyUrl?.trim() || undefined;
        if (tabValue === 1) body.audioLink = audioLink || undefined;
        await dispatch(
          updatePodcast({ userId, podcastId, body, token }),
        ).unwrap();
        dispatch(
          notify({ type: "success", message: "Podcast updated successfully" }),
        );
        resetForm();
        onClose();
        onSuccess?.();
      } catch (err) {
        dispatch(
          notify({
            type: "error",
            message: err?.message || "Failed to update podcast",
          }),
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (tabValue === 0) {
      if (!spotifyUrl?.trim()) {
        dispatch(
          notify({ type: "error", message: "Spotify link is required" }),
        );
        return;
      }
      setIsSubmitting(true);
      setIsUploading(true);
      try {
        setIsUploading(false);
        await dispatch(
          addPodcastSpotify({
            userId,
            token,
            body: {
              spotifyUrl: spotifyUrl.trim(),
              title: title.trim(),
              description: description.trim() || "",
              tags: selectedTags.filter(Boolean),
              language: language || "",
              category,
            },
          }),
        ).unwrap();
        dispatch(
          notify({ type: "success", message: "Podcast created successfully" }),
        );
        resetForm();
        onClose();
        onSuccess?.();
      } catch (err) {
        setIsUploading(false);
        dispatch(
          notify({
            type: "error",
            message: err?.message || "Failed to add podcast",
          }),
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (tabValue === 1) {
      let finalAudioLink = audioLink;
      if (audioFile) {
        setIsSubmitting(true);
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", audioFile);
        try {
          const result = await dispatch(
            uploadPodcast({ userId, formData, token }),
          ).unwrap();
          finalAudioLink = result?.link || "";
        } catch (err) {
          setIsUploading(false);
          dispatch(
            notify({
              type: "error",
              message: err?.message || "Audio upload failed",
            }),
          );
          return;
        }
        setIsUploading(false);
      }
      if (!finalAudioLink) {
        dispatch(
          notify({
            type: "error",
            message: "Please upload a podcast audio file",
          }),
        );
        return;
      }
      setIsSubmitting(true);
      try {
        const thumbUrl = await uploadThumbnailIfNeeded();
        await dispatch(
          addPodcastManual({
            userId,
            token,
            body: {
              audioLink: finalAudioLink,
              title: title.trim(),
              description: description.trim() || "",
              thumbnail: thumbUrl || "",
              tags: selectedTags.filter(Boolean),
              language: language || "",
              category,
            },
          }),
        ).unwrap();
        dispatch(
          notify({ type: "success", message: "Podcast created successfully" }),
        );
        resetForm();
        onClose();
        onSuccess?.();
      } catch (err) {
        dispatch(
          notify({
            type: "error",
            message: err?.message || "Failed to add podcast",
          }),
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        "& .MuiDialog-paper": {
          borderRadius: isMobile ? 0 : "12px",
          maxHeight: "95vh",
        },
      }}
    >
      <Box sx={{ p: { xs: 1.5, sm: 2 }, overflowY: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={onClose}
            sx={{
              minWidth: "auto",
              color: "#b4b2b2",
              fontSize: "1.5rem",
              "&:hover": { backgroundColor: "transparent" },
            }}
          >
            ×
          </Button>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            color: colors.darkGray,
            mb: 1,
          }}
        >
          Upload Your Podcast Here
        </Typography>
        <Box
          sx={{
            backgroundColor: "#F2F2F2",
            padding: 1,
            borderRadius: "8px",
            color: "#6c6c6c",
            mb: 2,
          }}
        >
          <Typography
            sx={{ fontFamily: fonts.sans, fontSize: "0.8rem", fontWeight: 500 }}
          >
            Please adhere to the following rules:
          </Typography>
          <ul
            style={{
              paddingLeft: "1.25rem",
              margin: "0.5rem 0 0",
              fontSize: "0.8rem",
              fontFamily: fonts.sans,
            }}
          >
            <li>
              You can either upload a Spotify podcast link or manually upload a
              podcast at a time.
            </li>
            <li>Ensure the podcast content is appropriate and relevant.</li>
            <li>
              Add descriptive tags and select appropriate category for better
              discoverability.
            </li>
          </ul>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          TabIndicatorProps={{ sx: { backgroundColor: "#BC2876" } }}
          sx={{
            borderBottom: "1px solid #a6a6a6",
            mb: 2,
            "& .MuiTab-root": {
              fontFamily: fonts.sans,
              textTransform: "capitalize",
              "&.Mui-selected": { color: "#BC2876" },
            },
          }}
          variant={isMobile ? "fullWidth" : "standard"}
        >
          <Tab label="Upload Spotify podcast link" />
          <Tab label="Upload Podcast Manually" />
        </Tabs>

        {isLoadingDetail ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#720361" }} />
          </Box>
        ) : (
          <>
            {tabValue === 0 && (
              <TextField
                fullWidth
                placeholder="Spotify Link"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F2F2F2",
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "transparent" },
                  },
                }}
              />
            )}

            {tabValue === 1 && (
              <Box
                component="label"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px dashed #BC2876",
                  borderRadius: "12px",
                  backgroundColor: "#fafafa",
                  py: 3,
                  px: 2,
                  cursor: "pointer",
                  mb: 2,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  "&:hover .audio-edit-overlay": { opacity: 1 },
                }}
              >
                <input
                  type="file"
                  accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/aac,.mp3,.wav,.aac"
                  hidden
                  onChange={handleAudioChange}
                />
                {isEdit && (
                  <Box
                    className="audio-edit-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "12px",
                      backgroundColor: "rgba(0,0,0,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.2s",
                      pointerEvents: "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <EditIcon sx={{ fontSize: 24, color: "#BC2876" }} />
                    </Box>
                  </Box>
                )}
                <MusicNoteIcon sx={{ fontSize: 48, color: "#BC2876", mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    color: colors.darkGray,
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  Click to upload podcast or drag and drop
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.lightGray, mt: 0.5 }}
                >
                  MP3, WAV, AAC
                </Typography>
                {audioFile && (
                  <Typography variant="body2" sx={{ mt: 1, color: "#720361" }}>
                    {audioFile.name}
                  </Typography>
                )}
              </Box>
            )}

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: colors.darkGray,
                mb: 1,
              }}
            >
              Podcast Title
            </Typography>
            <TextField
              fullWidth
              placeholder="Podcast Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#F2F2F2",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "transparent" },
                },
              }}
            />

            {/* Thumbnail only for manual upload; Spotify provides thumbnail. Required when editing. */}
            {tabValue === 1 && (
              <>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: colors.darkGray,
                    mb: 1,
                  }}
                >
                  Upload Podcast Thumbnail
                  {isEdit && (
                    <Box component="span" sx={{ color: "#d32f2f", ml: 0.25 }}>
                      *
                    </Box>
                  )}
                </Typography>
                <Box
                  component="label"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #BC2876",
                    borderRadius: "12px",
                    backgroundColor: "#fafafa",
                    py: 2,
                    px: 2,
                    cursor: "pointer",
                    mb: 2,
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    "&:hover .thumb-edit-overlay": { opacity: 1 },
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleThumbnailChange}
                  />
                  {thumbnailPreview ? (
                    <Box
                      sx={{
                        width: "100%",
                        position: "relative",
                        "&:hover .thumb-edit-overlay": { opacity: 1 },
                      }}
                    >
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 120,
                          objectFit: "contain",
                          borderRadius: 8,
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                      <Box
                        className="thumb-edit-overlay"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: 8,
                          backgroundColor: "rgba(0,0,0,0.4)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.2s",
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <EditIcon sx={{ fontSize: 20, color: "#BC2876" }} />
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <>
                      {isEdit && (
                        <Box
                          className="thumb-edit-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "12px",
                            backgroundColor: "rgba(0,0,0,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s",
                            pointerEvents: "none",
                          }}
                        >
                          <EditIcon sx={{ fontSize: 28, color: "#BC2876" }} />
                        </Box>
                      )}
                      <CloudUploadIcon
                        sx={{ fontSize: 40, color: "#BC2876", mb: 0.5 }}
                      />
                    </>
                  )}
                  <Typography
                    sx={{
                      fontFamily: fonts.sans,
                      color: colors.darkGray,
                      fontSize: "0.875rem",
                    }}
                  >
                    Upload Podcast Thumbnail
                  </Typography>
                </Box>
              </>
            )}

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: colors.darkGray,
                mb: 1,
              }}
            >
              Podcast Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Podcast Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#F2F2F2",
                  borderRadius: "8px",
                  "& fieldset": { borderColor: "transparent" },
                },
              }}
            />

            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: colors.darkGray,
                mb: 1,
              }}
            >
              Podcast Tags
            </Typography>
            <Autocomplete
              multiple
              freeSolo
              options={tagOptions}
              value={selectedTags}
              onChange={(_, v) => setSelectedTags(v)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Podcast Tags"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "#F2F2F2",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                    },
                  }}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F2F2F2",
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "transparent" },
                  },
                }}
              >
                <InputLabel id="podcast-language-label">
                  Select Language
                </InputLabel>
                <Select
                  labelId="podcast-language-label"
                  value={language}
                  label="Select Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#F2F2F2",
                    borderRadius: "8px",
                    "& fieldset": { borderColor: "transparent" },
                  },
                }}
              >
                <InputLabel id="podcast-category-label">
                  Select Category
                </InputLabel>
                <Select
                  labelId="podcast-category-label"
                  value={category}
                  label="Select Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {articleCategories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  color: colors.darkGray,
                  borderColor: "#ccc",
                  textTransform: "none",
                  fontFamily: fonts.sans,
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || isUploading}
                startIcon={
                  isSubmitting || isUploading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                sx={{
                  background: "linear-gradient(to top left, #720361, #bf2f75)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 2.5,
                  py: 1.25,
                  "&:hover": {
                    background:
                      "linear-gradient(to top left, #720361, #bf2f75)",
                    opacity: 0.92,
                  },
                }}
              >
                {isSubmitting || isUploading
                  ? "Submitting..."
                  : isEdit
                    ? "Update Podcast"
                    : "Submit Podcast"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default AddPodcastModal;
