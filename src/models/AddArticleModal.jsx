import "react-quill/dist/quill.snow.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
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
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../redux/slices/alertSlice.js";
import { selectToken, selectUserId } from "../redux/slices/authSlice.js";
import {
  addArticle,
  getArticleDetail,
  updateArticle,
  uploadArticleCover,
} from "../redux/slices/creatorSlice.js";
import { articleCategories, tags as tagsOptions } from "../utility/category.js";
import { extractContentFromFile } from "../utility/articleContentFromFile.js";
import { colors } from "../utility/color.js";
import { fonts } from "../utility/fonts.js";

// Register font size so toolbar can use it (run once)
const SizeStyle = Quill.import("attributors/style/size");
SizeStyle.whitelist = ["10px", "12px", "14px", "16px", "18px", "20px", "24px"];
Quill.register(SizeStyle, true);

const articleTagOptions = tagsOptions?.map((t) => t.option) || [];

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ size: ["10px", "12px", "14px", "16px", "18px", "20px", "24px"] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const AddArticleModal = ({ open, onClose, onSuccess, articleId = null }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const isEdit = Boolean(articleId);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isExtractingFile, setIsExtractingFile] = useState(false);
  const fileInputRef = React.useRef(null);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setTags([]);
    setTagInput("");
    setContent("");
    setCoverImageUrl("");
    setCoverFile(null);
    setCoverPreview(null);
  };

  useEffect(() => {
    if (!open) return;
    if (isEdit && articleId) {
      setIsLoadingDetail(true);
      dispatch(getArticleDetail({ articleId }))
        .unwrap()
        .then((res) => {
          const article = res?.articleDetails || res?.article;
          if (article) {
            setTitle(article.title || "");
            setCategory(article.category || "");
            setTags(Array.isArray(article.tags) ? article.tags : []);
            setContent(article.content || "");
            setCoverImageUrl(article.coverImage || "");
            setCoverPreview(article.coverImage || null);
          }
        })
        .catch(() => dispatch(notify({ type: "error", message: "Failed to load article" })))
        .finally(() => setIsLoadingDetail(false));
    } else {
      resetForm();
    }
  }, [open, isEdit, articleId, dispatch]);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      dispatch(notify({ type: "error", message: "Please select an image file" }));
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleImportDocOrPdf = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const name = (file.name || "").toLowerCase();
    const allowed =
      name.endsWith(".pdf") ||
      name.endsWith(".docx") ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!allowed) {
      dispatch(notify({ type: "error", message: "Please choose a PDF or Word (.docx) file." }));
      return;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
    setIsExtractingFile(true);
    try {
      const { content } = await extractContentFromFile(file);
      setContent(content);
      dispatch(notify({ type: "success", message: "Content imported. You can edit it below." }));
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || "Could not read file. Try a different PDF or Word file.",
        }),
      );
    } finally {
      setIsExtractingFile(false);
    }
  };

  const uploadCoverThenSubmit = async (payload) => {
    let finalCoverUrl = coverImageUrl;
    if (coverFile) {
      setIsUploadingCover(true);
      const formData = new FormData();
      formData.append("file", coverFile);
      try {
        const result = await dispatch(
          uploadArticleCover({ userId, formData, token }),
        ).unwrap();
        finalCoverUrl = result?.link || "";
      } catch (err) {
        dispatch(notify({ type: "error", message: err?.message || "Cover upload failed" }));
        setIsUploadingCover(false);
        return;
      }
      setIsUploadingCover(false);
    }
    return { ...payload, coverImageUrl: finalCoverUrl || payload.coverImageUrl };
  };

  const handleSubmit = async () => {
    if (!title?.trim()) {
      dispatch(notify({ type: "error", message: "Article title is required" }));
      return;
    }
    if (!category) {
      dispatch(notify({ type: "error", message: "Please select a category" }));
      return;
    }
    if (!content?.trim()) {
      dispatch(notify({ type: "error", message: "Article content is required" }));
      return;
    }
    if (!isEdit && !coverImageUrl && !coverFile) {
      dispatch(notify({ type: "error", message: "Please upload a cover image" }));
      return;
    }

    setIsSubmitting(true);
    try {
      const basePayload = {
        title: title.trim(),
        category,
        tags: tags.filter(Boolean),
        content: content.trim(),
      };
      const payload = await uploadCoverThenSubmit(basePayload);
      if (!payload) {
        setIsSubmitting(false);
        return;
      }

      if (isEdit) {
        await dispatch(updateArticle({ userId, articleId, payload, token })).unwrap();
        dispatch(notify({ type: "success", message: "Article updated successfully" }));
      } else {
        await dispatch(addArticle({ userId, payload, token })).unwrap();
        dispatch(notify({ type: "success", message: "Article created successfully" }));
      }
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err) {
      dispatch(
        notify({
          type: "error",
          message: err?.message || (isEdit ? "Failed to update article" : "Failed to create article"),
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        "& .MuiDialog-paper": {
          borderRadius: "12px",
          maxHeight: "95vh",
          overflow: "hidden",
        },
      }}
    >
      {/* Header: Back + Title — light lavender/purple (Figma) */}
      <Box
        sx={{
          backgroundColor: "#f3e5f5",
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 2,
          px: 2,
          borderBottom: "1px solid #e0d4e4",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            color: "#720361",
            minWidth: "auto",
            "&:hover": { backgroundColor: "rgba(114, 3, 97, 0.08)" },
          }}
        />
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: 700,
            fontSize: "1.5rem",
            color: colors.darkGray,
          }}
        >
          {isEdit ? "Edit Article" : "Add Articles"}
        </Typography>
      </Box>

      <Box sx={{ overflowY: "auto", flex: 1, p: 2 }}>
        {isLoadingDetail ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#720361" }} />
          </Box>
        ) : (
          <>
            {/* Upload Cover Image */}
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: "0.9375rem",
                color: colors.darkGray,
                mb: 1,
              }}
            >
              Upload Cover Image
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
                py: 4,
                px: 2,
                cursor: "pointer",
                mb: 3,
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleCoverChange}
              />
              {coverPreview ? (
                <Box sx={{ width: "100%", maxWidth: 320, textAlign: "center" }}>
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: 200,
                      objectFit: "contain",
                      borderRadius: 8,
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1, color: colors.lightGray }}>
                    Click to change image
                  </Typography>
                </Box>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 56, color: "#BC2876", mb: 1 }} />
                  <Typography sx={{ fontFamily: fonts.sans, color: colors.darkGray, fontWeight: 500 }}>
                    Upload Cover Image
                  </Typography>
                </>
              )}
            </Box>

            {/* Article Title + Category row */}
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: colors.darkGray,
                    mb: 1,
                  }}
                >
                  Article Title
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F2F2F2",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1, minWidth: { sm: 200 } }}>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: colors.darkGray,
                    mb: 1,
                  }}
                >
                  Category
                </Typography>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#F2F2F2",
                      borderRadius: "8px",
                      "& fieldset": { borderColor: "transparent" },
                    },
                  }}
                >
                  <InputLabel id="article-category-label">Select Category</InputLabel>
                  <Select
                    labelId="article-category-label"
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
            </Box>

            {/* Article Tags */}
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  color: colors.darkGray,
                  mb: 1,
                }}
              >
                Article Tags
              </Typography>
              <Autocomplete
                multiple
                freeSolo
                options={articleTagOptions}
                value={tags}
                inputValue={tagInput}
                onInputChange={(_, v) => setTagInput(v)}
                onChange={(_, newValue) => setTags(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Article Tags"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#F2F2F2",
                        borderRadius: "8px",
                        "& fieldset": { borderColor: "transparent" },
                      },
                    }}
                  />
                )}
              />
            </Box>

            {/* Article Content — Rich text + Import from PDF/Word */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1 }}>
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: colors.darkGray,
                  }}
                >
                  Article Content
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  size="small"
                  disabled={isExtractingFile}
                  startIcon={isExtractingFile ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                  sx={{
                    fontFamily: fonts.sans,
                    textTransform: "none",
                    borderColor: "#BC2876",
                    color: "#BC2876",
                    "&:hover": { borderColor: "#720361", backgroundColor: "rgba(114, 3, 97, 0.04)" },
                  }}
                >
                  {isExtractingFile ? "Importing…" : "Import from PDF or Word"}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleImportDocOrPdf}
                    style={{ display: "none" }}
                    aria-hidden
                  />
                </Button>
              </Box>
              <Typography
                component="p"
                sx={{
                  fontFamily: fonts.sans,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  mt: 0.5,
                  mb: 1,
                }}
              >
                Ensure your PDF or Word file is readable (text-based). Images and complex formatting will not be imported.
              </Typography>
              <Box
                sx={{
                  "& .quill": { backgroundColor: "#fff", borderRadius: "8px" },
                  "& .ql-toolbar": { borderColor: "#e0e0e0", borderRadius: "8px 8px 0 0" },
                  "& .ql-container": { borderColor: "#e0e0e0", borderRadius: "0 0 8px 8px", minHeight: 220 },
                  // Font size dropdown: show actual size labels instead of "Normal"
                  ...["10px", "12px", "14px", "16px", "18px", "20px", "24px"].reduce((acc, size) => {
                    acc[`& .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="${size}"]::before, & .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="${size}"]::before`] = {
                      content: `"${size}"`,
                      fontSize: `${size} !important`,
                    };
                    return acc;
                  }, {}),
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  placeholder="Start writing your article content here..."
                />
              </Box>
            </Box>

            {/* Save Changes */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isSubmitting || isUploadingCover}
                startIcon={isSubmitting || isUploadingCover ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  background: "linear-gradient(to top left, #720361, #bf2f75)",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  px: 3,
                  py: 1.25,
                  "&:hover": {
                    background: "linear-gradient(to top left, #720361, #bf2f75)",
                    opacity: 0.92,
                  },
                }}
              >
                {isSubmitting || isUploadingCover ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default AddArticleModal;
