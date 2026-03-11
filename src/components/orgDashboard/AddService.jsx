import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  InputAdornment,
  Tooltip,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LinkIcon from "@mui/icons-material/Link";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { fonts } from "../../utility/fonts";
import { uploadDocument } from "../../assets/assest";
import {
  createService,
  updateService,
  selectServiceLoading,
} from "../../redux/slices/serviceSlice";
import { selectToken } from "../../redux/slices/authSlice";
import { notify } from "../../redux/slices/alertSlice";

const MAX_DESCRIPTION_CHARS = 3000;
const MAX_LIST_CHARS = 3000; // for What's included (total)

const ESP_CATEGORIES = [
  "Building your Career Plan",
  "Education options",
  "Financing your studies",
  "Career readiness",
  "Planning your future",
  "Where can I study?",
  "General advice",
];

const HEI_CATEGORIES = [
  "Ask Admissions",
  "Ask Financial Aid",
  "Ask Faculty",
  "Student chat",
];

const AddService = ({ onBack, serviceToEdit, organizationType }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const isLoading = useSelector(selectServiceLoading);

  const isHEI = (organizationType || "").toString().toUpperCase() === "HEI";
  const categories = isHEI ? HEI_CATEGORIES : ESP_CATEGORIES;
  const defaultCategory = categories[0] || "";

  const [formData, setFormData] = useState({
    description: serviceToEdit?.description || "",
    category: serviceToEdit?.category || defaultCategory,
    referenceNumber: serviceToEdit?.referenceNumber || "",
    serviceMode: serviceToEdit?.serviceMode || "ONLINE",
    calendarLink: serviceToEdit?.calendarLink || "",
    ctaType: serviceToEdit?.cta?.type || "LINK",
    ctaValue: serviceToEdit?.cta?.value || "",
    ctaLabel: serviceToEdit?.cta?.label || "Book Slot",
    coverImage: null,
  });

  const categoryOptions =
    formData.category && !categories.includes(formData.category)
      ? [formData.category, ...categories]
      : categories;

  const [whatsIncluded, setWhatsIncluded] = useState(
    serviceToEdit?.whatsIncluded || [],
  );
  const [newItemIncluded, setNewItemIncluded] = useState("");

  const [imagePreview, setImagePreview] = useState(
    serviceToEdit?.coverImage || null,
  );
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description" && value.length > MAX_DESCRIPTION_CHARS) {
      setFormData((prev) => ({
        ...prev,
        [name]: value.slice(0, MAX_DESCRIPTION_CHARS),
      }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleCTATypeChange = (type) => {
    setFormData((prev) => ({ ...prev, ctaType: type }));
  };

  const addItem = (list, setList, item, setItem, maxTotalChars) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    if (maxTotalChars != null) {
      const currentTotal = list.reduce((sum, x) => sum + x.length, 0);
      if (currentTotal + trimmed.length > maxTotalChars) {
        dispatch(
          notify({
            message: `Total characters cannot exceed ${maxTotalChars}. Current: ${currentTotal}, adding: ${trimmed.length}.`,
            type: "error",
          }),
        );
        return;
      }
    }
    setList([...list, trimmed]);
    setItem("");
  };

  const removeItem = (list, setList, index) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description?.trim()) {
      dispatch(
        notify({ message: "Please enter Description", type: "error" }),
      );
      return;
    }

    if (!formData.category) {
      dispatch(
        notify({ message: "Please select Category", type: "error" }),
      );
      return;
    }

    if (formData.description.length > MAX_DESCRIPTION_CHARS) {
      dispatch(
        notify({
          message: `Description cannot exceed ${MAX_DESCRIPTION_CHARS} characters`,
          type: "error",
        }),
      );
      return;
    }

    const whatsIncludedTotal = whatsIncluded.reduce((s, x) => s + x.length, 0);
    if (whatsIncludedTotal > MAX_LIST_CHARS) {
      dispatch(
        notify({
          message: `What's included cannot exceed ${MAX_LIST_CHARS} characters in total`,
          type: "error",
        }),
      );
      return;
    }

    if (!formData.serviceMode) {
      dispatch(
        notify({ message: "Please select Service Mode", type: "error" }),
      );
      return;
    }

    if (!formData.calendarLink?.trim()) {
      dispatch(
        notify({
          message: "Please enter Link to Appointment Calendar",
          type: "error",
        }),
      );
      return;
    }

    if (!formData.ctaValue?.trim()) {
      dispatch(
        notify({ message: "Please enter Add link or email (CTA)", type: "error" }),
      );
      return;
    }

    if (!token) {
      dispatch(
        notify({
          message: "You must be logged in to create services",
          type: "error",
        }),
      );
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.category);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("priceType", "FREE");
      data.append("referenceNumber", formData.referenceNumber || "");
      data.append(
        "duration",
        JSON.stringify({ value: 1, unit: "weeks" }),
      );
      data.append("serviceMode", formData.serviceMode);
      data.append("calendarLink", formData.calendarLink.trim());
      data.append("whatsIncluded", JSON.stringify(whatsIncluded));
      data.append("whatYouWillLearn", JSON.stringify([]));
      data.append("status", "PUBLISHED");
      data.append(
        "cta",
        JSON.stringify({
          type: formData.ctaType,
          value: formData.ctaValue.trim(),
          label: formData.ctaLabel || "Book Slot",
        }),
      );

      if (formData.coverImage) {
        data.append("file", formData.coverImage);
      }

      if (serviceToEdit) {
        const updateAction = await dispatch(
          updateService({ id: serviceToEdit._id, formData: data, token }),
        );
        if (updateService.fulfilled.match(updateAction)) {
          dispatch(
            notify({
              message: "Service updated successfully!",
              type: "success",
            }),
          );
          onBack();
        } else {
          dispatch(
            notify({
              message:
                updateAction.payload?.error || "Failed to update service",
              type: "error",
            }),
          );
        }
      } else {
        const createAction = await dispatch(
          createService({ formData: data, token }),
        );
        if (createService.fulfilled.match(createAction)) {
          dispatch(
            notify({
              message: "Service created successfully!",
              type: "success",
            }),
          );
          onBack();
        } else {
          dispatch(
            notify({
              message:
                createAction.payload?.error || "Failed to create service",
              type: "error",
            }),
          );
        }
      }
    } catch (error) {
      console.error("Service creation error:", error);
      dispatch(
        notify({ message: "An unexpected error occurred", type: "error" }),
      );
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: "100%" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 2 }}>
        <IconButton onClick={onBack} sx={{ p: 0 }}>
          <Box
            sx={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              border: "1px solid #EAECF0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <ArrowBackIcon sx={{ color: "#000" }} />
          </Box>
        </IconButton>
        <Typography
          sx={{
            fontFamily: fonts.sans,
            fontWeight: 700,
            fontSize: "26px",
            color: "#000",
          }}
        >
          {serviceToEdit ? "Edit Call" : "Add Call"}
        </Typography>
      </Box>

      {/* Form Container */}
      <Box sx={{ maxWidth: "881px", mx: "auto", mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3.5}>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Box
                onClick={handleUploadClick}
                sx={{
                  height: "194px",
                  borderRadius: "12px",
                  border: "1px dashed #BC2876",
                  backgroundColor: "#f2f2f2",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {imagePreview ? (
                  <Box
                    component="img"
                    src={imagePreview}
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <Box
                      component="img"
                      src={uploadDocument}
                      sx={{ width: "140px", height: "140px", mb: -2 }}
                    />
                    <Typography
                      sx={{
                        fontFamily: fonts.sans,
                        fontSize: "14px",
                        color: "rgba(0,0,0,0.5)",
                      }}
                    >
                      Upload Service Picture
                    </Typography>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  accept="image/*"
                />
              </Box>
            </Grid>

            {/* Category & Reference Number */}
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Category <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 400 },
                    },
                  }}
                  sx={{
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    px: 1,
                  }}
                >
                  {categoryOptions.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Ref no (Optional)
              </Typography>
              <TextField
                fullWidth
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                placeholder="Ref no"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& fieldset": { border: "none" },
                    px: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Description <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Service Description"
                inputProps={{ maxLength: MAX_DESCRIPTION_CHARS }}
                helperText={`${(formData.description || "").length}/${MAX_DESCRIPTION_CHARS} characters`}
                FormHelperTextProps={{
                  sx: { fontFamily: fonts.sans },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "24px",
                    backgroundColor: "#f2f2f2",
                    "& fieldset": { border: "none" },
                    p: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>

            {/* Service Mode: Online / In-Person */}
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Service Mode <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <FormControl fullWidth>
                <Select
                  name="serviceMode"
                  value={formData.serviceMode}
                  onChange={handleChange}
                  sx={{
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    px: 1,
                  }}
                >
                  <MenuItem value="ONLINE">Online</MenuItem>
                  <MenuItem value="OFFLINE">In-Person</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Link to Appointment Calendar */}
            <Grid item xs={12} sm={6}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                Link to Appointment Calendar <Box component="span" sx={{ color: "#d32f2f" }}>*</Box>
              </Typography>
              <TextField
                fullWidth
                name="calendarLink"
                value={formData.calendarLink}
                onChange={handleChange}
                placeholder="https://calendly.com/..."
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "90px",
                    backgroundColor: "#f2f2f2",
                    height: "54px",
                    "& fieldset": { border: "none" },
                    px: 2,
                  },
                  "& .MuiInputBase-input": {
                    fontFamily: fonts.sans,
                    fontSize: "16px",
                    color: "#000",
                    "&::placeholder": { color: "rgba(0,0,0,0.5)", opacity: 1 },
                  },
                }}
              />
            </Grid>

            {/* What's Included */}
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontFamily: fonts.sans,
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#545454",
                  mb: 1,
                }}
              >
                What's Included
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: fonts.sans,
                  color: "#545454",
                  display: "block",
                  mb: 0.5,
                }}
              >
                {whatsIncluded.reduce((s, x) => s + x.length, 0) +
                  newItemIncluded.length}
                /{MAX_LIST_CHARS} characters max
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth
                  value={newItemIncluded}
                  onChange={(e) => {
                    const total = whatsIncluded.reduce(
                      (s, x) => s + x.length,
                      0,
                    );
                    const maxNew = MAX_LIST_CHARS - total;
                    setNewItemIncluded(e.target.value.slice(0, maxNew));
                  }}
                  placeholder="Add items included in this service"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "90px",
                      backgroundColor: "#f2f2f2",
                      height: "54px",
                      "& fieldset": { border: "none" },
                      px: 2,
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: fonts.sans,
                      fontSize: "16px",
                    },
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(
                        whatsIncluded,
                        setWhatsIncluded,
                        newItemIncluded,
                        setNewItemIncluded,
                        MAX_LIST_CHARS,
                      );
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={() =>
                    addItem(
                      whatsIncluded,
                      setWhatsIncluded,
                      newItemIncluded,
                      setNewItemIncluded,
                      MAX_LIST_CHARS,
                    )
                  }
                  sx={{
                    borderRadius: "90px",
                    minWidth: "100px",
                    background:
                      "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                  }}
                >
                  <AddIcon />
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {whatsIncluded.map((item, index) => (
                  <Chip
                    key={index}
                    label={item}
                    onDelete={() =>
                      removeItem(whatsIncluded, setWhatsIncluded, index)
                    }
                    deleteIcon={
                      <DeleteOutlineIcon style={{ color: "#bc2876" }} />
                    }
                    sx={{
                      fontFamily: fonts.sans,
                      backgroundColor: "#f2f2f2",
                      color: "#545454",
                      fontWeight: 500,
                      borderRadius: "8px",
                      "& .MuiChip-deleteIcon": {
                        color: "#bc2876",
                        "&:hover": { color: "#720361" },
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* CTA Section - Add link or email */}
            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Typography
                  sx={{
                    fontFamily: fonts.sans,
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#545454",
                  }}
                >
                  Add link or email - For CTA
                </Typography>
                <Tooltip title="Enter the URL or email where users should be directed when they click the service CTA.">
                  <InfoOutlinedIcon
                    sx={{
                      fontSize: "20px",
                      color: "#545454",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Box>

              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  fullWidth
                  name="ctaValue"
                  value={formData.ctaValue}
                  onChange={handleChange}
                  placeholder="Call to Action"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "90px",
                      backgroundColor: "#f2f2f2",
                      height: "54px",
                      "& fieldset": { border: "none" },
                      px: 2,
                    },
                    "& .MuiInputBase-input": {
                      fontFamily: fonts.sans,
                      fontSize: "16px",
                      color: "#000",
                      "&::placeholder": {
                        color: "rgba(0,0,0,0.5)",
                        opacity: 1,
                      },
                    },
                  }}
                />
                <Box
                  sx={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: "90px",
                    display: "flex",
                    alignItems: "center",
                    px: "7px",
                    height: "54px",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleCTATypeChange("LINK")}
                    sx={{
                      width: "44px",
                      height: "44px",
                      backgroundColor:
                        formData.ctaType === "LINK" ? "#bc2876" : "transparent",
                      "&:hover": {
                        backgroundColor:
                          formData.ctaType === "LINK"
                            ? "#bc2876"
                            : "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <LinkIcon
                      sx={{
                        color:
                          formData.ctaType === "LINK"
                            ? "#fff"
                            : "rgba(0,0,0,0.3)",
                      }}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => handleCTATypeChange("EMAIL")}
                    sx={{
                      width: "44px",
                      height: "44px",
                      backgroundColor:
                        formData.ctaType === "EMAIL"
                          ? "#bc2876"
                          : "transparent",
                      "&:hover": {
                        backgroundColor:
                          formData.ctaType === "EMAIL"
                            ? "#bc2876"
                            : "rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <MailOutlineIcon
                      sx={{
                        color:
                          formData.ctaType === "EMAIL"
                            ? "#fff"
                            : "rgba(0,0,0,0.3)",
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  width: "243px",
                  height: "48px",
                  borderRadius: "90px",
                  background:
                    "linear-gradient(161.27deg, #BF2F75 3.87%, #720361 63.8%)",
                  fontFamily: fonts.sans,
                  fontWeight: 600,
                  fontSize: "16px",
                  textTransform: "none",
                  textWrap: "nowrap",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : serviceToEdit ? (
                  "Save Changes"
                ) : (
                  "Add Call"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default AddService;
