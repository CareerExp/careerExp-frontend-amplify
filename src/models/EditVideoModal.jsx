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

import { categories, languages, tags } from "../utility/category.js";
import { buttonStyle, inputFieldStyle } from "../utility/commonStyle.js";
import { fonts } from "../utility/fonts.js";

const EditVideoModal = ({ open, onClose, video, onUpdate, isButtonLoading }) => {
  const defaultVideo = {
    title: "",
    description: "",
    tags: [],
    language: "",
    category: "",
  };

  const [formData, setFormData] = useState(defaultVideo);

  useEffect(() => {
    if (video) {
      setFormData(video);
    }
  }, [video]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateClick = () => {
    onUpdate(formData);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(8px) !important",
        backgroundColor: "rgba(0, 0, 0, 0.3) !important",
        paddingBottom: "1rem",
        "& .MuiDialog-paper": {
          width: "100%",
          margin: { xs: "10px", sm: "20px", md: "32px" },
          maxHeight: { xs: "calc(100% - 20px)", sm: "calc(100% - 40px)", md: "calc(100% - 64px)" },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
          padding: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.poppins,
            fontWeight: "700",
            fontSize: { xs: "20px", sm: "22px", md: "26px" },
            textAlign: "center",
          }}
        >
          Edit Video Details
        </Typography>
      </Box>

      <Box
        sx={{
          margin: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
          border: "1px solid #C5C6C7",
          p: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
          borderRadius: "12px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: { xs: "1.5rem", sm: "0.75rem", md: "1.5rem" },
          overflowY: "auto",
        }}
      >
        {formData.youtubeLink ? (
          <iframe
            title="YouTube video player"
            width="100%"
            height="auto"
            style={{ aspectRatio: "16/9", borderRadius: "8px" }}
            src={`https://www.youtube.com/embed/${formData.youtubeVideoId}`}
            allowFullScreen
          ></iframe>
        ) : (
          formData.videoLink && (
            <video
              controls
              style={{ width: "100%", height: "auto", aspectRatio: "16/9", borderRadius: "8px" }}
            >
              <source src={formData.videoLink} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
        )}

        <TextField
          label="Title"
          name="title"
          fullWidth
          sx={{ ...inputFieldStyle, width: "100%" }}
          InputLabelProps={{
            shrink: true,
            style: { marginTop: "-8px" },
          }}
          value={formData.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          multiline
          rows={{ xs: 3, sm: 4, md: 4 }}
          InputLabelProps={{
            shrink: true,
            style: { marginTop: "-8px" },
          }}
          sx={{
            width: "100%",
            backgroundColor: "#F6F6F6",
            fontFamily: fonts.poppins,
            p: { xs: 0.5, sm: 0.75, md: 1 },
            borderRadius: "30px",
            border: "none",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
            "& label.Mui-focused": {
              color: "#A0AAB4",
            },
            InputLabelProps: {
              sx: { marginLeft: "15px" },
            },
            InputProps: {
              disableUnderline: true,
              sx: {
                fontFamily: fonts.poppins,
                "&::placeholder": {
                  fontFamily: fonts.poppins,
                },
              },
              inputProps: {
                style: {
                  paddingLeft: "20px",
                },
              },
            },
          }}
          value={formData.description}
          onChange={handleChange}
        />

        <Autocomplete
          multiple
          id="tags"
          options={tags.map((tag) => tag.option)}
          value={formData.tags}
          onChange={(event, newValue) => setFormData({ ...formData, tags: newValue })}
          renderInput={(params) => (
            <TextField {...params} label="Video Tags" placeholder="Select Video Tags" />
          )}
          sx={{ ...inputFieldStyle, width: "100%", borderRadius: { xs: "30px", sm: "40px", md: "90px" } }}
        />

        <FormControl fullWidth>
          <InputLabel id="select_language" sx={{ marginTop: "-0.5rem" }}>
            Select Language
          </InputLabel>
          <Select
            labelId="select_language"
            name="language"
            fullWidth
            sx={{ ...inputFieldStyle, width: "100%" }}
            value={formData.language}
            onChange={handleChange}
          >
            {languages.map((language) => (
              <MenuItem key={language.code} value={language.name}>
                {language.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="select_category" sx={{ marginTop: "-0.5rem" }}>
            Select Category
          </InputLabel>
          <Select
            labelId="select_category"
            name="category"
            fullWidth
            sx={{ ...inputFieldStyle, width: "100%" }}
            value={formData.category}
            onChange={handleChange}
          >
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
            justifyContent: "flex-end",
            gap: { xs: "0.5rem", sm: "0.75rem", md: "1rem" },
            flexDirection: { xs: "column", sm: "row" },
            mt: { xs: 1, sm: 1.5, md: 2 },
          }}
        >
          {isButtonLoading ? (
            <Button variant="contained" sx={buttonStyle}>
              <CircularProgress size={25} color="inherit" />
            </Button>
          ) : (
            <Button
              onClick={handleUpdateClick}
              sx={{
                ...buttonStyle,
                width: { xs: "100%", sm: "50%", md: "15%" },
                fontSize: { xs: "14px", sm: "15px", md: "16px" },
              }}
            >
              Update
            </Button>
          )}

          <Button
            onClick={onClose}
            sx={{
              ...buttonStyle,
              width: { xs: "100%", sm: "50%", md: "15%" },
              fontSize: { xs: "14px", sm: "15px", md: "16px" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default EditVideoModal;
